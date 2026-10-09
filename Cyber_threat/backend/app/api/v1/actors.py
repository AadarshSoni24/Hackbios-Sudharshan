from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.database import get_db, Actor, Entity

router = APIRouter(prefix="/actors", tags=["Threat Actors"])

@router.get("")
def list_actors(category: str = None, risk: str = None, db: Session = Depends(get_db)):
    query = db.query(Actor)
    if category:
        query = query.filter(Actor.category == category)
    if risk:
        query = query.filter(Actor.risk_level == risk)
    
    actors = query.all()
    result = []
    for a in actors:
        entities = db.query(Entity).filter(Entity.actor_id == a.id).all()
        wallets = [e.value for e in entities if "WALLET" in e.type]
        pgp = next((e.value for e in entities if "PGP" in e.type), None)
        
        result.append({
            "id": a.id,
            "handle": a.display_handle,
            "category": a.category,
            "risk_level": a.risk_level,
            "confidence_score": a.confidence_score,
            "origin_badge": a.origin_badge,
            "first_seen": a.first_seen.isoformat() if a.first_seen else None,
            "last_scan_at": a.last_scan_at.isoformat() if a.last_scan_at else None,
            "known_wallets_count": len(wallets),
            "primary_wallet": wallets[0] if wallets else None,
            "pgp_fingerprint": pgp,
            "notes": a.notes
        })
    return {"success": True, "count": len(result), "data": result}

@router.get("/{actor_id}")
def get_actor_detail(actor_id: str, db: Session = Depends(get_db)):
    actor = db.query(Actor).filter(Actor.id == actor_id).first()
    if not actor:
        # Fallback handle search
        actor = db.query(Actor).filter(Actor.display_handle == actor_id).first()
    if not actor:
        raise HTTPException(status_code=404, detail="Threat actor profile not found")
        
    entities = db.query(Entity).filter(Entity.actor_id == actor.id).all()
    
    return {
        "success": True,
        "data": {
            "id": actor.id,
            "handle": actor.display_handle,
            "category": actor.category,
            "risk_level": actor.risk_level,
            "confidence_score": actor.confidence_score,
            "origin_badge": actor.origin_badge,
            "notes": actor.notes,
            "entities": [
                {"type": e.type, "value": e.value, "context": e.raw_context} for e in entities
            ]
        }
    }
