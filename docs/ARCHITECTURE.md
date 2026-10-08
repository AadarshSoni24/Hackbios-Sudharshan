# System Architecture (ARCHITECTURE.md)
## High-Level Architecture, Data Pipelines & Container Topology
**Project:** Sudarshan (ShadowGraph) | **SIH 2026 PS ID:** 26151

---

## 1. Architectural Topology Overview
Sudarshan adopts a decoupled, event-driven microservices architecture designed to run seamlessly in both air-gapped forensic laboratories and containerized cloud environments.

```
                                  [ ANALYST CLIENT ]
                              Next.js 16 + Cytoscape.js
                               (Browser / HTTPS: 3000)
                                          │
                                          │ REST API / JSON (/api/v1)
                                          ▼
+─────────────────────────────────────────────────────────────────────────────────+
|                           REVERSE PROXY (Nginx / Caddy)                         |
|   - TLS Termination   - Rate Limiting (Redis)   - Content-Security-Policy       |
+─────────────────────────────────────────────────────────────────────────────────+
                                          │
                                          ▼
+─────────────────────────────────────────────────────────────────────────────────+
|                        FASTAPI CORE APPLICATION SERVICE                         |
|   - Auth / Session (Argon2id + TOTP)    - Query & Search Router                 |
|   - Correlation Engine Router           - Report Generation (WeasyPrint)        |
+─────────────────────────────────────────────────────────────────────────────────+
             │                                   │                       │
             ▼                                   ▼                       ▼
+──────────────────────────+       +──────────────────────────+    +──────────────+
|  POSTGRESQL 16 (RELATIONAL)|       | NEO4J 5 COMMUNITY (GRAPH)|    | REDIS 7 (MQ) |
|  - Users, Sources, Jobs  |       | - Actors, Wallets, PGP   |    | - Cache      |
|  - Raw Ingested Docs     |       | - Multi-hop Edges        |    | - Celery MQ  |
|  - SHA-256 Audit Trail   |       | - Graph Topology Path    |    +──────────────+
+──────────────────────────+       +──────────────────────────+           │
                                                                          ▼
                                                            +─────────────────────+
                                                            |   CELERY WORKERS    |
                                                            | - Scraper Runner    |
                                                            | - Regex Extractors  |
                                                            | - Stylometry Engine |
                                                            | - Graph Fusion Job  |
                                                            +─────────────────────+
                                                                     │
                                                                     ▼
                                                            +─────────────────────+
                                                            |  TOR SOCKS5 PROXY   |
                                                            |  (127.0.0.1:9050)   |
                                                            +─────────────────────+
```

---

## 2. The 6-Stage Intelligence Pipeline

```
  Stage 1: TRIGGER
  [Analyst Query / Target URL] OR [Celery Beat Scheduled Scan]
       │
       ▼
  Stage 2: INGEST & PROBE
  [Tor SOCKS5 Crawler] OR [Sanitized Archive Loader]
  - Hash raw document (SHA-256)
  - Persist into raw_documents table
       │
       ▼
  Stage 3: PARSE & EXTRACT
  - Regex Engine: BTC, ETH, XMR, Emails, PGP Blocks, .onion domains
  - PGP Parser (PGPy): Extracts embedded names, emails, key creation dates
  - Infrastructure Scanner: HTTP response headers, SSL cert serials, favicon hashes
       │
       ▼
  Stage 4: MULTI-VECTOR CORRELATION
  - Vector 1: Identifiers (Matching PGP fingerprint, shared wallet, email)
  - Vector 2: Infrastructure (Shared SSL serial, clearnet host leak)
  - Vector 3: Stylometry (Sentence-Transformers MiniLM + Yule's K + posting diurnal cycles)
       │
       ▼
  Stage 5: GRAPH FUSION & CONFIDENCE SCORING
  - Heuristic aggregator scores proposed link: Σ (Weight * Strength)
  - Upsert nodes & edges into Neo4j Community Graph
  - Write proposed linkages into attribution_scores table
       │
       ▼
  Stage 6: DASHBOARD & EXPORT
  - Real-time notification to Analyst Review Queue
  - Human Analyst confirms or rejects proposed link
  - Export court-admissible Section 65B PDF dossier with SHA-256 checksums
```

---

## 3. Technology Stack Specification

| Component Layer | Technology Selected | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (React) | 16.3.3 (Turbopack) | Server/Client components, rapid routing, zero latency |
| **Styling Engine** | Tailwind CSS | 4.3.3 | Utility-first, predictable styling, zero CSS bloat |
| **Graph Visualization** | `react-force-graph-2d` / Cytoscape | Latest | High-performance HTML5 Canvas force physics rendering |
| **Backend API** | Python FastAPI | 0.110+ | Async performance, strict Pydantic v2 typing, OpenAPI generation |
| **Relational Database** | PostgreSQL | 16-alpine | ACID compliance, JSONB support, Full-Text Search indexing |
| **Graph Database** | Neo4j Community Edition | 5.18+ | Cypher traversal for multi-hop actor-wallet-infrastructure queries |
| **Task Queue & Cache** | Redis | 7-alpine | In-memory task brokering for Celery, token blacklisting, rate-limits |
| **Task Scheduler** | Celery + Celery Beat | 5.3+ | Asynchronous job execution for crawling and graph recalculation |
| **Tor Proxy Client** | Tor Daemon + `stem` | 0.4.8+ | Circuit isolation and automated Tor proxy routing (`socks5h://`) |
| **PDF Dossier Engine** | Jinja2 + WeasyPrint | Latest | Pixel-perfect HTML-to-PDF rendering with legal Section 65B stamp |

---

## 4. Docker Compose Multi-Container Blueprint
The entire system is orchestrated via a single, self-contained `docker-compose.yml`:
1. `sudarshan-web`: Next.js frontend UI (`port: 3000`)
2. `sudarshan-api`: FastAPI backend service (`port: 8000`)
3. `sudarshan-worker`: Celery worker for crawling and graph fusion
4. `sudarshan-beat`: Celery beat periodic scheduler
5. `sudarshan-postgres`: PostgreSQL 16 database (`port: 5432`)
6. `sudarshan-neo4j`: Neo4j 5 Community Graph DB (`ports: 7474, 7687`)
7. `sudarshan-redis`: Redis cache & queue (`port: 6379`)
8. `sudarshan-tor`: Tor SOCKS5 proxy service (`port: 9050`)
