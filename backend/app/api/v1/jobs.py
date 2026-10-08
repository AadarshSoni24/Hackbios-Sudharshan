from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.database import get_db, ScrapeJob
from app.services.extractor import extract_entities_from_text, calculate_sha256

router = APIRouter(prefix="/jobs", tags=["Crawler & Extraction Ops"])

class IngestJobRequest(BaseModel):
    target_url: str
    max_depth: int = 1
    max_pages: int = 10
    delay: float = 2.0
    mode: str = "LIVE_TOR"

class TestTextExtractionRequest(BaseModel):
    raw_content: str

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
