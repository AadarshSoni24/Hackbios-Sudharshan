from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.database import get_db, CorrelationLink, Actor, AuditLog

router = APIRouter(prefix="/links", tags=["Persona Review Queue"])

@router.get("")
def list_links(status: str = None, db: Session = Depends(get_db)):
    query = db.query(CorrelationLink)
    if status:
        query = query.filter(CorrelationLink.status == status)
    links = query.all()

    result = []
    for l in links:
        act_a = db.query(Actor).filter(Actor.id == l.actor_a_id).first()
        act_b = db.query(Actor).filter(Actor.id == l.actor_b_id).first()
        result.append({
            "id": l.id,
            "actor_a": {"id": act_a.id, "handle": act_a.display_handle, "category": act_a.category} if act_a else None,
            "actor_b": {"id": act_b.id, "handle": act_b.display_handle, "category": act_b.category} if act_b else None,
            "vector": l.vector,
            "evidence": l.evidence_text,
            "score": l.score,
            "band": l.band,
            "status": l.status,
            "created_at": l.created_at.isoformat() if l.created_at else None
        })
    return {"success": True, "count": len(result), "data": result}

@router.post("/{link_id}/confirm")
def confirm_link(link_id: str, db: Session = Depends(get_db)):
    link = db.query(CorrelationLink).filter(CorrelationLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    link.status = "CONFIRMED"
    link.reviewed_at = datetime.now(timezone.utc)
    
    # Audit log
    audit = AuditLog(
        officer_badge="NTRO-INV-4091",
        action="CONFIRM_LINK",
        target_entity=f"Link {link.id} -> CONFIRMED",
        ip_address="127.0.0.1"
    )
    db.add(audit)
    db.commit()
    return {"success": True, "message": "Link successfully confirmed as true attribution!"}

@router.post("/{link_id}/reject")
def reject_link(link_id: str, db: Session = Depends(get_db)):
    link = db.query(CorrelationLink).filter(CorrelationLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    link.status = "REJECTED"
    link.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    return {"success": True, "message": "Link marked as false positive."}
