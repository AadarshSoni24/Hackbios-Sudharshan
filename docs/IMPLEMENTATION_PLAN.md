# Implementation Plan (IMPLEMENTATION_PLAN.md)
## Phased Build Order, Dependency Matrix & Milestone Checklists
**Project:** Sudarshan (ShadowGraph) | **SIH 2026**

---

## 1. Build Philosophy: Strict Phased Execution
Features must be completed in chronological order. **Never begin a phase until the preceding phase passes its verification checks.**

```
Phase 0: Environment & Docker Topology
     │
     ▼
Phase 1: Database Schemas & Ground-Truth Seed Data (M17, M18)
     │
     ▼
Phase 2: Core Extraction & Graph Fusion Engine (M4, M6 V1, M7)
     │
     ▼
Phase 3: Authentication & Core Analyst Dashboard (M1, M8)
     │
     ▼
Phase 4: Infrastructure Scanner & Stylometry Baseline (M5, M6 V2/V3)
     │
     ▼
Phase 5: Timeline Query, Full-Text Search & Section 65B PDF Export (M9, M11)
     │
     ▼
Phase 6: Audit Integrity, Security Hardening & Offline Rehearsal (M13, M15, M19)
```

---

## 2. Milestone Task Breakdown

### Phase 0 — Environment & Docker Topology
- [x] Next.js 16 frontend running on `http://localhost:3000`.
- [ ] Initialize FastAPI backend skeleton on `http://localhost:8000`.
- [ ] Create `docker-compose.yml` orchestrating PostgreSQL 16, Neo4j 5 Community, Redis 7, and Tor daemon.
- **Verification:** `docker compose up` starts all services with zero port conflicts.

### Phase 1 — Database Schemas & Ground-Truth Seed Data
- [ ] Implement SQLAlchemy models matching `DATABASE.md`.
- [ ] Apply initial Alembic migration (`001_initial_schema.py`).
- [ ] Create synthetic seed script (`python scripts/seed_ground_truth.py`) populating the 10 synthetic actors and deliberate overlaps.
- **Verification:** `SELECT count(*) FROM actors;` returns 10; Neo4j browser visualizes planted wallet and PGP links.

### Phase 2 — Core Extraction & Graph Fusion Engine
- [ ] Adapt `Scraper.py` extractors into modular functions in `backend/app/services/extractor.py`.
- [ ] Implement Vector 1 Identifier Correlation (matching identical PGP fingerprints and multi-input wallets).
- [ ] Implement heuristic confidence scoring function ($	ext{Score} = \sum 	ext{Weight}_i 	imes 	ext{Strength}_i$).
- [ ] Build Neo4j Graph Fusion worker syncing proposed links into graph edges.
- **Verification:** Running extraction on synthetic test dump correctly flags `DarkVendor_01 <-> CryptGhost` (shared PGP) with score >= 0.75.

### Phase 3 — Authentication & Core Analyst UI
- [ ] Implement Argon2id password verification and `pyotp` TOTP endpoints in `/auth`.
- [ ] Wire Next.js `/login` screen to verify credentials and store session JWT.
- [ ] Connect Overview KPI cards and Actors Directory table to live FastAPI endpoints.
- [ ] Connect `GraphCanvas` in Next.js to `/api/v1/graph/data`.
- **Verification:** Logging in with test credentials opens Overview; clicking an actor centers the 2D graph.

### Phase 4 — Infrastructure Scanner & Stylometry Baseline
- [ ] Build SSL certificate and server banner analyzer matching against clearnet host fixtures.
- [ ] Build stylometric embedding similarity pipeline (`all-MiniLM-L6-v2` + sentence length + Yule's K).
- [ ] Implement Persona Review Queue page (`/links`) with Confirm/Reject actions.
- **Verification:** Rebranded persona `PhantomOp <-> NeonSpectre` appears in Review Queue; clicking Confirm creates `ALIAS_OF` edge in Neo4j.

### Phase 5 — Timeline Search & Section 65B PDF Export
- [ ] Implement PostgreSQL full-text search across `raw_documents`.
- [ ] Implement 24-hour diurnal posting activity chart on `/timeline`.
- [ ] Build Jinja2 + WeasyPrint template generating court-admissible Section 65B PDF dossiers.
- **Verification:** Exported PDF renders with official header, graph topology diagram, and SHA-256 evidence table.

### Phase 6 — Audit Integrity, Security Hardening & Dry-Run
- [ ] Enforce append-only permissions on `audit_logs` table.
- [ ] Execute automated test suite from `TESTING.md` (all unit and ground-truth benchmark tests pass).
- [ ] Execute full 5-minute demo rehearsal with machine Wi-Fi disabled (confirming 100% offline capability).
- **Verification:** Complete offline walkthrough executes with zero network dropouts or errors.
