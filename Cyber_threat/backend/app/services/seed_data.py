from app.models.database import SessionLocal, Base, engine, User, Actor, Entity, InfraFinding, CorrelationLink, AuditLog, CaseDossier
from datetime import datetime, timezone

def initialize_seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(Actor).count() > 0:
        db.close()
        return

    # 1. Admin Officer
    admin_user = User(
        username="officer_sharma",
        badge_number="NTRO-INV-4091",
        role="analyst",
        password_hash="argon2id$v=19$m=65536,t=2,p=1$mock_hash_authorized",
        status="ACTIVE"
    )
    db.add(admin_user)

    db.commit()
    db.close()
    print("Database initialized with Admin User only. Ready for live scraper ingestion.")
