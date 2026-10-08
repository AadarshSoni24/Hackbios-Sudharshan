from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, InfraFinding

router = APIRouter(prefix="/infra", tags=["Infrastructure Misconfigurations"])

@router.get("/findings")
def get_infra_findings(db: Session = Depends(get_db)):
    findings = db.query(InfraFinding).all()
    return {
        "success": True,
        "count": len(findings),
        "data": [
            {
                "id": f.id,
                "onion_address": f.onion_address,
                "finding_type": f.finding_type,
                "cert_sha256": f.cert_sha256,
                "banner": f.banner,
                "candidate_host": f.candidate_host,
                "strength": f.strength,
                "status": f.status,
                "found_at": f.found_at.isoformat() if f.found_at else None
            } for f in findings
        ]
    }
