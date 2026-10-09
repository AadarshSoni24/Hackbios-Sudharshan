from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import hashlib
from app.models.database import get_db, CaseDossier, Actor, Entity, CorrelationLink

router = APIRouter(prefix="/reports", tags=["Intelligence Reports & Section 65B"])

class CreateDossierRequest(BaseModel):
    case_reference: str
    title: str
    target_actor_id: str

@router.get("")
def list_dossiers(db: Session = Depends(get_db)):
    cases = db.query(CaseDossier).all()
    return {
        "success": True,
        "data": [
            {
                "id": c.id,
                "case_reference": c.case_reference,
                "title": c.title,
                "target_actor_id": c.target_actor_id,
                "evidence_hash": c.evidence_hash,
                "status": c.status,
                "created_at": c.created_at.isoformat() if c.created_at else None
            } for c in cases
        ]
    }

@router.get("/{case_id}/dossier-preview")
def get_dossier_preview(case_id: str, db: Session = Depends(get_db)):
    case = db.query(CaseDossier).filter(CaseDossier.id == case_id).first()
    if not case:
        case = db.query(CaseDossier).filter(CaseDossier.case_reference == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case file not found")
        
    actor = db.query(Actor).filter(Actor.id == case.target_actor_id).first()
    entities = db.query(Entity).filter(Entity.actor_id == actor.id).all() if actor else []
    links = db.query(CorrelationLink).filter(
        (CorrelationLink.actor_a_id == actor.id) | (CorrelationLink.actor_b_id == actor.id)
    ).all() if actor else []

    # Section 65B Certificate payload
    return {
        "success": True,
        "data": {
            "statutory_header": "NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO) // CYBER INTELLIGENCE DIVISION",
            "statutory_compliance": "Section 65B Indian Evidence Act, 1872 / Bharatiya Sakshya Adhiniyam, 2023",
            "case_reference": case.case_reference,
            "title": case.title,
            "target_alias": actor.display_handle if actor else "Unknown",
            "category": actor.category if actor else "Unknown",
            "attribution_confidence": f"{int(actor.confidence_score * 100)}%" if actor else "N/A",
            "evidence_sha256_hash": case.evidence_hash,
            "certified_timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            "certifying_officer": "NTRO-INV-4091 (Senior Cyber Intelligence Analyst)",
            "extracted_indicators": [{"type": e.type, "value": e.value} for e in entities],
            "corroborated_links": [
                {"vector": l.vector, "score": f"{int(l.score * 100)}%", "evidence": l.evidence_text} for l in links
            ]
        }
    }
