# Technical Requirements Document (TRD.md)
## Engineering Specifications, Operational Latencies & Definition of Done
**Project:** Sudarshan (ShadowGraph) | **SIH 2026 PS ID:** 26151

---

## 1. Technical Purpose & Constraints
The Technical Requirements Document translates high-level functional requirements from `PRD.md` into concrete, verifiable software engineering criteria.

### Operating Constraints
1. **Offline Demonstration Capability:** The entire stack must be capable of running locally without internet connectivity (using cached fixture data and local synthetic corpora).
2. **Deterministic Attribution Logic:** Scoring functions and entity extractors must produce identical outputs when re-run against identical inputs.
3. **Containerized Portability:** Deployable in a single `docker-compose up` execution on an air-gapped machine running Linux or Windows with WSL2.

---

## 2. System Performance & Latency Budgets
| Metric | Target Budget | Verification Method |
| :--- | :--- | :--- |
| **API Response Time (CRUD)** | < 120 ms (p95) | Locust load benchmark |
| **Graph Rendering (500 nodes)** | < 800 ms initial layout | Browser Performance profiling |
| **Entity Extraction (100KB document)** | < 50 ms per document | Pytest benchmark |
| **Stylometric Embedding Calculation** | < 250 ms per text sample | Pytest benchmark (CPU mode) |
| **PDF Dossier Compilation** | < 3.5 seconds | WeasyPrint generation benchmark |
| **Cold Startup (Docker Compose)** | < 45 seconds total | Scripted docker compose timing |

---

## 3. Technology Stack & Exact Versions
- **Node.js Environment:** Node v20 LTS / pnpm v11+
- **Frontend Framework:** Next.js 16.3.3 (Turbopack enabled)
- **UI & Visualization:** React 19, Tailwind CSS 4.3.3, `react-force-graph-2d` 1.29+, Cytoscape.js 3.28+
- **Backend Service:** Python 3.11+ / FastAPI 0.110+, Uvicorn 0.28+
- **Relational ORM:** SQLAlchemy 2.0+ with Alembic migrations
- **Graph Client:** Neo4j Python Driver 5.18+ (Bolt protocol)
- **Task Scheduling:** Celery 5.3+ with Redis 7 Broker
- **PDF Engine:** Jinja2 3.1+ and WeasyPrint 61+
- **NLP & Stylometry:** `sentence-transformers` 2.5+ (`all-MiniLM-L6-v2`), NLTK / spaCy tokenizers
- **Cryptography:** `pyotp` 2.9+, `cryptography` 42+, `PGPy` 0.6+

---

## 4. Definition of Done (DoD)
A feature or module is considered **Done** only when:
1. **Code Complete:** Follows conventions in `CODE_STYLE.md` with 100% type coverage.
2. **Schema & API Parity:** Database tables match `DATABASE.md` and routes match `API.md`.
3. **Automated Verification:** Unit and integration tests in `TESTING.md` pass without failures.
4. **Security Check:** Zero credentials in code, strict Pydantic input validation, and text-only dark web parsing.
5. **Calm UI Verified:** Clean HackBIOS dark theme rendering with no console errors or layout shifting.
