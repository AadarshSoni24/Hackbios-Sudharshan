from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.database import get_db, ScrapeJob, Actor, Entity, InfraFinding
from app.services.extractor import extract_entities_from_text, calculate_sha256
from app.api.v1.graph import MOCK_GRAPH_DB
from app.services.scraper_service import run_integrated_scan

router = APIRouter(prefix="/jobs", tags=["Crawler & Extraction Ops"])

class IngestJobRequest(BaseModel):
    target_url: str
    max_depth: int = 1
    max_pages: int = 10
    delay: float = 2.0
    mode: str = "LIVE_TOR"

class TestTextExtractionRequest(BaseModel):
    raw_content: str

class ScraperDataIngestRequest(BaseModel):
    records: list[dict]

class ScanRequest(BaseModel):
    url: str

from app.models.database import SessionLocal

def background_scan_task(url: str):
    """Runs the scraper and ingests data into the mock DB and SQLite DB."""
    records = run_integrated_scan(url)
    if records:
        # Connect to DB for background task
        db = SessionLocal()
        req = ScraperDataIngestRequest(records=records)
        ingest_scraper_data(req, db=db)
        db.close()
        print(f"[+] Background scan finished for {url}. Inserted {len(records)} records into Mock DB.")
    else:
        print(f"[-] Background scan failed or found no records for {url}.")

@router.post("/ingest")
def create_ingest_job(req: IngestJobRequest, db: Session = Depends(get_db)):
    job = ScrapeJob(
        target_url=req.target_url,
        mode=req.mode,
        status="COMPLETED", # Synchronous demo completion
        pages_crawled=req.max_pages,
        entities_found=4,
        completed_at=datetime.now(timezone.utc)
    )
    db.add(job)
    db.commit()
    return {
        "success": True,
        "data": {
            "job_id": job.id,
            "target_url": job.target_url,
            "status": "COMPLETED",
            "message": "Tor crawl simulated successfully across safe test mirrors."
        }
    }

@router.post("/extract-preview")
def preview_extraction(req: TestTextExtractionRequest):
    entities = extract_entities_from_text(req.raw_content)
    sha256_hash = calculate_sha256(req.raw_content)
    return {
        "success": True,
        "sha256_integrity_hash": sha256_hash,
        "extracted_entities": entities
    }

@router.post("/ingest_scraper_data")
def ingest_scraper_data(req: ScraperDataIngestRequest, db: Session = Depends(get_db)):
    total_records = len(req.records)
    print(f"[*] Received {total_records} records from Scraper.")

    for record in req.records:
        source = record.get("source", "Unknown Source")
        identifiers = record.get("identifiers", {})
        
        # 1. Create Actor Nodes from handles
        handles = identifiers.get("handles", [])
        actor_ids = []
        for handle in handles:
            actor_id = handle.lower()
            actor_ids.append(actor_id)

        # If no handle found, use a default anonymous actor for this source
        if not actor_ids:
            actor_id = "anon_" + str(hash(source))[:6]
            actor_ids.append(actor_id)

        primary_actor = actor_ids[0]
        
        # DB Integration for Actors
        if db:
            for act_id in actor_ids:
                handle_lbl = handles[0] if handles else "Unknown Actor"
                db.merge(Actor(id=act_id, display_handle=handle_lbl, category="UNKNOWN", risk_level="HIGH", origin_badge="SCRAPER"))

        # 2. Add Wallets
        for w_type in ["bitcoin_wallets", "ethereum_wallets", "monero_wallets"]:
            for wallet in identifiers.get(w_type, []):
                if db:
                    wtype = "WALLET_" + w_type.split("_")[0].upper()
                    db.merge(Entity(actor_id=primary_actor, type=wtype, value=wallet))

        # 3. Add PGP Keys
        for pgp in identifiers.get("pgp_keys", []):
            pgp_short = pgp.replace("-----BEGIN PGP PUBLIC KEY BLOCK-----", "").strip()[:16]
            if db:
                db.merge(Entity(actor_id=primary_actor, type="PGP_KEY", value=pgp_short))

        # 4. Add Emails as Entities
        for email in identifiers.get("emails", []):
            if db:
                db.merge(Entity(actor_id=primary_actor, type="EMAIL", value=email))

        # 4.5 Add Phone Numbers
        for phone in identifiers.get("phone_numbers", []):
            if db:
                db.merge(Entity(actor_id=primary_actor, type="PHONE_NUMBER", value=phone))
            
        # 5. Infrastructure Headers & IP Leaks
        headers = record.get("infrastructure", {}).get("server_headers", {})
        server = headers.get("Server")
        
        ipv4_leaks = identifiers.get("ipv4_addresses", [])
        
        all_infra = []
        if server:
            all_infra.append(("server", server))
        for ip in ipv4_leaks:
            all_infra.append(("ip", ip))
            
        for infra_type, infra_val in all_infra:
            infra_id = "infra_" + infra_val.replace(" ", "_")
            if db:
                # Add to InfraFinding for the KPI metric
                db.merge(InfraFinding(
                    onion_address=source[:50],
                    finding_type="SERVER_BANNER_LEAK" if infra_type == "server" else "IP_LEAK",
                    banner=infra_val,
                    candidate_host=infra_id,
                    strength="STRONG"
                ))
                # Add as an Entity so it connects to the Actor in the graph
                db.merge(Entity(actor_id=primary_actor, type="CLEARNET_IP" if infra_type == "ip" else "SERVER_HEADER", value=infra_val))

    if db:
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            print("DB Insert Error:", e)

    return {
        "success": True,
        "message": f"Successfully received {total_records} records.",
        "records_processed": total_records
    }

@router.post("/scan")
def start_scan(req: ScanRequest, background_tasks: BackgroundTasks):
    """Triggers the integrated Python scraper in the background."""
    background_tasks.add_task(background_scan_task, req.url)
    return {
        "success": True,
        "message": f"Background scan started for {req.url}. Graph will update automatically."
    }
