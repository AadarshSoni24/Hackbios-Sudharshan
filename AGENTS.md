# SUDARSHAN (ShadowGraph) - Team Collaboration & Architecture Rules
# Smart India Hackathon (SIH 2026) | Problem Statement: 26151

## 1. Directory Structure (STRICT - DO NOT MOVE OR RENAME)
The project directory structure is permanently frozen for the hackathon. Any AI assistant working on this repo MUST respect these exact paths:

- **Frontend:** `Cyber_threat/frontend/`
  - Technology: Next.js 16 (Turbopack), React 19, Tailwind CSS v4, Lucide React, Framer Motion.
  - Run command: `pnpm dev` inside `Cyber_threat/frontend/` (Port 3000).
  - Routes: `/` (Overview & Live Scan), `/graph`, `/actors`, `/actors/[id]`, `/links`, `/infrastructure`, `/timeline`, `/reports`, `/system`, `/login`, `/signup`.

- **Backend:** `Cyber_threat/backend/`
  - Technology: Python FastAPI, SQLAlchemy, SQLite, Uvicorn.
  - Run command: `python -m uvicorn app.main:app --reload --port 8000` inside `Cyber_threat/backend/` (Port 8000).
  - Database file: `Cyber_threat/backend/sudarshan.db` (Contains M18 ground-truth actors & entities).
  - Ingestion & Crawler: `app/services/scraper_service.py` and `app/api/v1/jobs.py`.

- **Documentation & Specs:** `docs/`
- **Standalone Scraper:** `SUDARSHAN-main/`

### ⚠️ ABSOLUTE CONSTRAINTS:
1. **DO NOT** move, rename, delete, or wrap `Cyber_threat/backend` or `Cyber_threat/frontend` into another folder.
2. **DO NOT** delete or overwrite `Cyber_threat/backend/sudarshan.db`.
3. **DO NOT** touch or modify peer code outside your assigned domain without pulling `main` first.

---

## 2. Team Git Synchronization Rules
Before making any changes or running commands:
1. Always start from up-to-date main:
   ```bash
   git checkout main
   git pull origin main
   ```
2. When pushing features:
   ```bash
   git add .
   git commit -m "feat(<scope>): descriptive message"
   git push origin main
   ```
3. Never force push (`git push -f`) or delete branches without team agreement.

---

## 3. Product & AI Principles
1. **Explainable Attribution:** Use transparent additive point scores (PGP key: +35, Clearnet IP leak: +30, Crypto co-spend: +25, Diurnal/Stylometry: +10). No unsubstantiated "90%+ black-box AI" claims.
2. **Offline-First Demo:** All features must work seamlessly against the local synthetic M18 database in `sudarshan.db` even without internet or Tor connection.
3. **Role Architecture:** Single officer role (`analyst`). Keep auth simple (2FA TOTP simulation).
