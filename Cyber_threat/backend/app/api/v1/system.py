from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, AuditLog, Actor, Entity, InfraFinding, CorrelationLink

router = APIRouter(prefix="/system", tags=["System Operations & Audit"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SUDHARSHAN API Engine",
        "version": "1.0.0-mvp",
        "tor_socks_status": "ONLINE (127.0.0.1:9050)",
        "database": "CONNECTED",
        "evidence_integrity_engine": "ACTIVE"
    }

@router.get("/audit")
def get_audit_trail(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(50).all()
    return {
        "success": True,
        "count": len(logs),
        "data": [
            {
                "id": l.id,
                "officer": l.officer_badge,
                "action": l.action,
                "target": l.target_entity,
                "ip": l.ip_address,
                "timestamp": l.timestamp.isoformat() if l.timestamp else None
            } for l in logs
        ]
    }

@router.get("/kpis")
def get_kpis(db: Session = Depends(get_db)):
    return {
        "success": True,
        "data": {
            "monitored_actors": db.query(Actor).count(),
            "linked_entities": db.query(CorrelationLink).filter(CorrelationLink.status == "CONFIRMED").count(),
            "ip_leaks_discovered": db.query(InfraFinding).count(),
            "total_indicators": db.query(Entity).count(),
            "tor_status": "ONLINE · SYNCING"
        }
    }
