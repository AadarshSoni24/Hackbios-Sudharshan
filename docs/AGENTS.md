# AGENTS.md
## AI Agent Operating Instructions & Repository Guidelines
**Project:** Sudarshan (ShadowGraph) — Dark Web Threat Actor Attribution Platform  
**Target:** SIH 2026 · Problem Statement 26151 · NTRO

---

## 1. Core Purpose & Agent Persona
You are an expert full-stack cyber intelligence systems engineer pair-programming on **Sudarshan**. Your task is to implement, test, and document the platform strictly within the scope defined in `PRD.md` and `TRD.md`.

You do not guess, assume, or invent extraneous features. You adhere strictly to the project's **Honest Claims Policy** and **Single-Role Architecture**.

---

## 2. Workspace Map & Key Directories
```
SIH 2026/
├── Cyber_threat_fontend-main/      # Next.js 16 + Tailwind CSS Frontend
│   ├── app/                        # Next.js App Router (10 pages)
│   ├── components/cti/             # Dashboard, Force Graph, Drawers, Modals
│   └── lib/                        # cti-data, utilities, API client
├── SUDARSHAN-main/                 # Python Ingestion Engine
│   └── Scraper.py                  # Tor SOCKS5 crawler + Regex IOC extractor
├── backend/                        # FastAPI Backend Engine (Python 3.11+)
│   ├── app/
│   │   ├── api/v1/                 # REST Route Handlers
│   │   ├── core/                   # Security, Config, JWT, TOTP
│   │   ├── models/                 # SQLAlchemy 2.0 & Pydantic v2 Models
│   │   ├── services/               # Extraction, Correlation, Graph Fusion
│   │   └── main.py                 # FastAPI Application Factory
│   └── tests/                      # Pytest Test Suite
├── docs/                           # Centralized Vibe Coding System Documentation
│   ├── PRD.md                      # Product Requirements Document
│   ├── AGENTS.md                   # Agent Rules (This File)
│   ├── DESIGN_SYSTEM.md            # Theme, Tokens, Layout Guidelines
│   ├── ARCHITECTURE.md             # System Architecture & Data Flow
│   ├── SECURITY.md                 # Security & Evidence Integrity Rules
│   ├── CODE_STYLE.md               # Coding Conventions & Checklist
│   ├── DATABASE.md                 # PostgreSQL & Neo4j Schema Spec
│   ├── API.md                      # OpenAPI / REST Endpoint Contract
│   ├── TRD.md                      # Technical Requirements Specification
│   ├── APP_FLOW.md                 # Screen States & User Journey
│   ├── IMPLEMENTATION_PLAN.md      # Phased Task Execution Order
│   └── TESTING.md                  # Test Matrix & Ground Truth Benchmark
└── docker-compose.yml              # Local Multi-Container Deployment Spec
```

---

## 3. Strict Prohibitions (Never Violate)
1. **NO Inflated or Unverifiable AI Claims:** Never output or commit text claiming "90% attribution accuracy", "100% automated de-anonymization", or "replaces 5 commercial tools". Every figure must derive from `TESTING.md` synthetic benchmarks.
2. **NO Multi-Role RBAC Bloat:** Do not build custom role editors, permissions trees, customer tiers, or billing engines. The system implements a single role: `analyst`.
3. **NO Live Dark Web Crawling during Evaluation:** Scraper tests must hit local mock fixtures or safe public mirrors. Never direct requests to illicit hidden services.
4. **NO Raw SQL or Cypher String Interpolation:** Always use parameterized SQLAlchemy ORM queries or Neo4j Cypher query parameters to prevent injection.
5. **NO Unsanitized Scraped HTML Rendering:** Dark web page contents must be processed strictly as plain text or token streams. Never render raw HTML with `dangerouslySetInnerHTML`.
6. **NO Hardcoded Credentials or API Keys:** All secrets must be loaded via environment variables (`.env`).

---

## 4. Agent Execution Workflow
When assigned a task:
1. **Read Relevant Docs First:**
   - Database tasks: Check `DATABASE.md` and `SECURITY.md`.
   - API endpoints: Check `API.md`, `SECURITY.md`, and `CODE_STYLE.md`.
   - UI / Frontend: Check `DESIGN_SYSTEM.md`, `APP_FLOW.md`, and `CODE_STYLE.md`.
2. **Verify Against Existing Code:** Check files in `Cyber_threat_fontend-main` and `SUDARSHAN-main` before proposing new modules.
3. **Follow Build Order:** Check `IMPLEMENTATION_PLAN.md` to ensure prerequisites are satisfied.
4. **Run Verification:** Execute relevant automated checks from `TESTING.md` before marking any step complete.
