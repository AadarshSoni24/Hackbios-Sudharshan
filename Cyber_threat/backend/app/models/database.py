from sqlalchemy import create_engine, Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime, timezone
import uuid
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)
    badge_number = Column(String, unique=True, nullable=False)
    role = Column(String, default="analyst")
    password_hash = Column(String, nullable=False)
    totp_secret = Column(String, default="JBSWY3DPEHPK3PXP")
    status = Column(String, default="ACTIVE")
    failed_logins = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Actor(Base):
    __tablename__ = "actors"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    display_handle = Column(String, index=True, nullable=False)
    category = Column(String, default="RANSOMWARE")
    risk_level = Column(String, default="CRITICAL") # CRITICAL, HIGH, MEDIUM, LOW
    confidence_score = Column(Float, default=0.85)
    first_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_scan_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    origin_badge = Column(String, default="SYNTHETIC")
    notes = Column(Text, nullable=True)

class Entity(Base):
    __tablename__ = "entities"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String, ForeignKey("actors.id"), nullable=True)
    type = Column(String, index=True, nullable=False) # WALLET_BTC, WALLET_ETH, PGP_KEY, PGP_FINGERPRINT, EMAIL, ONION_URL, CLEANET_IP
    value = Column(String, index=True, nullable=False)
    raw_context = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InfraFinding(Base):
    __tablename__ = "infra_findings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    onion_address = Column(String, nullable=False)
    finding_type = Column(String, nullable=False) # EXACT_CERT_MATCH, SERVER_BANNER_LEAK, FAVICON_HASH
    cert_sha256 = Column(String, nullable=True)
    banner = Column(String, nullable=True)
    candidate_host = Column(String, nullable=False) # Clearnet IP
    strength = Column(String, default="STRONG") # STRONG, MEDIUM, WEAK
    status = Column(String, default="CONFIRMED")
    found_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CorrelationLink(Base):
    __tablename__ = "correlation_links"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_a_id = Column(String, ForeignKey("actors.id"), nullable=False)
    actor_b_id = Column(String, ForeignKey("actors.id"), nullable=False)
    vector = Column(String, nullable=False) # V1_IDENTIFIERS, V2_INFRASTRUCTURE, V3_STYLOMETRY
    evidence_text = Column(Text, nullable=False)
    strength = Column(Float, default=0.85)
    score = Column(Float, default=0.85)
    band = Column(String, default="HIGH") # HIGH, MEDIUM, LOW
    status = Column(String, default="PROPOSED") # PROPOSED, CONFIRMED, REJECTED
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ScrapeJob(Base):
    __tablename__ = "scrape_jobs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    target_url = Column(String, nullable=False)
    mode = Column(String, default="LIVE_TOR")
    status = Column(String, default="COMPLETED")
    pages_crawled = Column(Integer, default=0)
    entities_found = Column(Integer, default=0)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    officer_badge = Column(String, default="NTRO-INV-4091")
    action = Column(String, nullable=False)
    target_entity = Column(String, nullable=False)
    ip_address = Column(String, default="127.0.0.1")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CaseDossier(Base):
    __tablename__ = "case_dossiers"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_reference = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    target_actor_id = Column(String, ForeignKey("actors.id"), nullable=False)
    evidence_hash = Column(String, nullable=False)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
