# Product Requirements Document (PRD.md)
## Project Sudarshan (ShadowGraph) — Dark Web Threat Actor Attribution Platform
**SIH 2026 · Problem Statement ID: 26151 · Organization: NTRO · Theme: Blockchain & Cybersecurity**  
**Version:** 1.0 (MVP Scope) | **Role Model:** Single Dedicated Role (`analyst`)

---

## 1. Product Overview & Vision
Analysts investigating dark web threat actors today work across disconnected command-line tools, fragmented scrapers, and ad-hoc spreadsheets.

**Sudarshan** is a unified, offline-capable cyber intelligence platform that:
1. **Ingests** dark web forum and marketplace content (from sanitized archives and synthetic ground-truth data for demonstrations; a Tor SOCKS5 crawler module exists for authorized agency environments).
2. **Extracts** high-value digital indicators: actor handles, PGP public keys and fingerprints, cryptocurrency wallets (BTC, ETH, XMR), email addresses, and server SSL/TLS certificates.
3. **Correlates** entities across sources using three explainable vectors:
   - **Vector 1 (Identifiers):** Shared cryptographic PGP keys, wallet addresses, and contact points.
   - **Vector 2 (Infrastructure):** Tor hidden service misconfigurations, shared SSL certificate serials, and clearnet origin server leaks.
   - **Vector 3 (Stylometry):** Baseline text similarity (MiniLM embeddings + sentence/vocabulary heuristics + posting timeline patterns).
4. **Stores** multi-hop relationships in a graph database (**Neo4j**) alongside relational provenance records (**PostgreSQL**).
5. **Scores** proposed attribution links with a transparent, configurable confidence score requiring human analyst confirmation before finalizing.
6. **Presents** findings in a calm, dark-themed analyst dashboard and exports court-admissible dossiers (PDF, JSON, CSV) stamped with SHA-256 evidence integrity hashes.

---

## 2. PS 26151 Traceability Matrix

| Problem Statement Requirement | Sudarshan Module | Priority | Build Status |
| :--- | :--- | :--- | :--- |
| Continuous gathering from marketplaces & forums | M3 Ingestion & Scheduler | **MUST** | Synthetic/Archive loader + Celery Beat + Tor SOCKS5 crawler |
| Tor hidden service misconfiguration → clearnet infra | M5 Infrastructure Scanner | **MUST** (fixtures) / **SHOULD** (live lookup) | Certificate fingerprint matching, banner leaks, candidate host mapping |
| Single relationship graph of handles, PGP, wallets | M7 Graph Fusion, M6 Correlation | **MUST** | Neo4j multi-node graph + Cytoscape.js canvas |
| Stylometric persona identification (rebranded actors) | M6 Vector 3 Stylometry | **MUST** (baseline) | Cosine similarity on embeddings + Yule's K + punctuation rates |
| Query database across a chosen timeline | M9 Timeline & Search | **MUST** | Date-range filters, PostgreSQL full-text search, activity charts |
| Autonomous background processing mode | M3 Celery Worker / Beat | **MUST** | Background job queue with status monitoring |
| Unified actor profiles & linkage confidence | M2 Registry, M10 Dossier Model | **MUST** | Consolidated profile view with explainable evidence breakdowns |
| Exportable intelligence reports | M11 Reports & Export | **MUST** | Section 65B-compliant PDF dossier + STIX 2.1 JSON + CSV |
| Clean, accessible GUI / Dashboards | M8 Analyst Dashboard | **MUST** | 10 focused pages with HackBIOS dark theme |

---

## 3. Scope Boundaries & Honest Claims Policy

### Definition of Priorities
- **MUST**: Core MVP deliverables that are fully built, integrated, and demonstrated live during evaluation.
- **SHOULD**: Secondary enhancements built only after all MUST requirements pass verification.
- **LATER**: Future roadmap items clearly presented as post-hackathon scope; never faked or shown as working.

### What We DO NOT Say vs. What We Say Instead
| ❌ Do Not Say (Unsubstantiated / Inflated) | ✅ Say Instead (Honest & Verifiable) |
| :--- | :--- |
| *"Our AI achieves 89%+ / 95% de-anonymization accuracy."* | *"Stylometry is a supporting signal; on our controlled test set it scored X (measured)."* |
| *"The system is 100% automated."* | *"Stages 2–5 run as background jobs; an analyst must review and confirm every proposed link."* |
| *"100% guaranteed match for shared wallet or key."* | *"Strong shared-identifier correlation link."* |
| *"Court-ready proof that guarantees conviction."* | *"Evidence-hashed intelligence dossier formatted for Section 65B forensic review."* |
| *"Scrapes the entire live dark web in real-time."* | *"Tor-routed crawler module tested on safe test mirrors; demo runs on sanitized/synthetic archives."* |
| *"Replaces 5 commercial intelligence tools."* | *"Consolidates dark web extraction, graph correlation, and reporting into one unified workflow."* |
| *"100% sovereign air-gapped platform."* | *"Runs entirely on-premises with Docker Compose and zero external internet dependencies in demo mode."* |

### Non-Goals (Explicitly Out of Scope)
- No live crawling of active illegal marketplaces during demonstrations or at the hackathon venue.
- No identification of living individuals; all demo targets are synthetic or derived from public academic research sets.
- No multi-tier customer or billing portals; system implements a single dedicated **Analyst** role.
- No commercial mobile apps, SMS gateways, or WhatsApp integrations.
- No black-box deep learning claims beyond the specified stylometric baseline.

---

## 4. Product Principles
1. **Explainable by Design:** Every attribution link exposes its exact evidence trail (matching PGP fingerprint, shared wallet hash, or leaked certificate serial). Never display a raw confidence percentage without showing *why*.
2. **Human in the Loop:** The algorithm proposes candidate links; the human intelligence officer confirms or rejects them.
3. **Data Provenance Everywhere:** Every record displays an origin badge: `[SYNTHETIC]`, `[ARCHIVE]`, or `[LIVE-AUTHORIZED]`.
4. **Calm & Uncluttered UI:** Maximum three primary functional zones per page. No flashing gadgets, sensory overload, or confusing multi-nested menus.

---

## 5. Webpage Layout & Navigation Architecture (10 Pages)

```
[ LEFT SIDEBAR ]           [ TOP NAVIGATION BAR: Global Search | Origin Badge | Officer Session ]
- Overview                 ----------------------------------------------------------------------
- Actors Directory         [ CONTENT AREA: Maximum 3 primary cards or data blocks               ]
- Actor Deep-Dive          ----------------------------------------------------------------------
- Graph Explorer           [ FOOTER / STATUS: Tor Proxy Status | DB Status | Active Case Ref    ]
- Persona Review Queue
- Infrastructure Leaks
- Timeline & Search
- Dossiers & Reports
- System Operations
- Logout
```

1. **Login Page (`/login`):** Secure access screen with Officer ID, password, and 6-digit TOTP authenticator code (pyotp-based, works 100% offline).
2. **Overview Dashboard (`/` or `/overview`):** 10-second situational awareness dashboard with 4 KPI cards (Monitored Actors, Links Pending Review, Sources, Last Scan Timestamp), recent activity feed, and pending reviews.
3. **Actors Directory (`/actors`):** Clean, searchable data grid listing actor handles, categories (ransomware, data leaks, financial fraud), source count, confidence band, and last scan dates.
4. **Actor Profile (`/actors/:id`):** Exhaustive actor dossier view with tabbed navigation: *Identifiers*, *Linked Personas*, *Infrastructure Findings*, *Evidence Documents*, and *Investigator Notes*.
5. **Graph Explorer (`/graph`):** Centerpiece 2D interactive force canvas (Cytoscape.js / Force-Graph). Displays multi-hop relationships across Actors, Wallets, Infrastructure, and PGP Keys. Includes 1-hop expansion and confidence filtering.
6. **Persona Review Queue (`/links`):** Specialized verification deck displaying candidate persona pairs (`Persona A ↔ Persona B`), comparative score breakdown, evidence cards, and `[Confirm Link]` / `[Reject Link]` actions.
7. **Infrastructure Scanner (`/infrastructure`):** Table of dark web server misconfigurations: SSL certificate serial leaks, banner exposes, and candidate clearnet IP addresses.
8. **Timeline & Search (`/timeline`):** Date-range selector, activity histogram across 24-hour UTC cycles, and PostgreSQL full-text search across all collected dark web content.
9. **Dossier & Report Generator (`/reports`):** Selection workspace to generate and download court-admissible Section 65B PDF dossiers, STIX 2.1 JSON, and CSV tables, complete with cryptographic SHA-256 evidence verification.
10. **System Operations (`/system`):** Administrative hub showing Celery ingestion pipeline health, source repository management, immutable audit logs, and TOTP key setup.

---

## 6. Functional Module Specifications (M1 to M19)

### M1 — Authentication & Access Control (Single Role)
- **Role:** Single dedicated role (`analyst`). Database stores `users.role` to permit future RBAC expansion without current code overhead.
- **Authentication:** Username + password verified via Argon2id.
- **MFA:** 6-digit TOTP second factor using RFC 6238 standard (`pyotp`), functional offline without SMS gateways.
- **Session:** Short-lived JWT access tokens (15-min expiry) paired with HTTP-only refresh tokens.
- **Account Lockout:** 5 consecutive failed attempts trigger a 15-minute temporary lockout.

### M2 — Actor & Identifier Registry
- Stores actor profiles: handle, alias aliases, threat categories, first-seen timestamp, last-scanned timestamp, and investigation status.
- Tracks typed indicators: BTC/ETH/XMR wallets, PGP fingerprints, emails, Tor `.onion` URLs, and SSL certificate hashes.
- Referential Integrity: Every identifier links strictly to the `raw_documents` record from which it was extracted.

### M3 — Data Ingestion & Job Scheduling
- Dataset loader for sanitized dark web archives and synthetic test corpora (JSON/CSV/HTML).
- Celery Beat scheduler executing periodic ingestion and correlation recalculations.
- Tor SOCKS5 crawler client (`requests[socks]` via `socks5h://127.0.0.1:9050` with `stem` library circuit management), restricted to safe public mirrors during testing.
- Mandatory cryptographic SHA-256 hashing of every raw document upon intake.

### M4 — Entity Extraction Engine
- Deterministic regex extractors for:
  - Bitcoin (Legacy, SegWit, Bech32), Ethereum (0x hex), Monero (95-char).
  - PGP public key blocks (`BEGIN PGP PUBLIC KEY BLOCK`) and 160-bit key fingerprints.
  - Email addresses, XMPP/Jabber handles, Telegram usernames, and `.onion` v3 URLs.
- PGP key parsing via `PGPy` extracting embedded user names, email addresses, and key creation dates.

### M5 — Infrastructure & Misconfiguration Scanner
- Inspects HTTP response headers, server banners, and status pages for server identification.
- Parses SSL certificate fingerprints from hidden services running HTTPS.
- Correlates certificate serials against cached clearnet databases (crt.sh / Shodan fixtures) to identify candidate clearnet IP addresses.
- Assigns lead strength: *Exact Certificate Match*, *Server Banner Match*, or *Weak Lead*.

### M6 — Correlation Engine (3 Vectors)
- **Vector 1 (Identifiers):** Exact matching of PGP fingerprints, wallet addresses, and contact emails across distinct personas.
- **Vector 2 (Infrastructure):** Shared SSL certificates, identical favicon hashes, or exposed clearnet host IPs across hidden services.
- **Vector 3 (Stylometry):** Sentence-Transformers (`all-MiniLM-L6-v2`) semantic embeddings + stylometric metrics (average sentence length, punctuation frequency, Yule's K vocabulary richness, and diurnal posting hour distributions). Requires minimum 150 words of analyzed text before executing.

### M7 — Confidence Scoring & Graph Fusion
- Heuristic scoring formula:
  $$	ext{Score} = \sum (	ext{Weight}_i 	imes 	ext{Strength}_i)$$
  *Default Weights:* Shared PGP = 40, Shared Wallet = 30, Shared Infrastructure = 20, Stylometry = 10.
- Confidence Bands: **High** ($\ge 0.75$), **Medium** ($0.40 - 0.74$), **Low** ($< 0.40$).
- State Machine: `PROPOSED` $ightarrow$ `CONFIRMED` or `REJECTED` by human analyst review.
- Neo4j Graph Model: Nodes (`Actor`, `Wallet`, `PGPKey`, `HiddenService`, `ClearnetHost`); Edges (`USED_WALLET`, `HAS_PGP`, `HOSTED_ON`, `ALIAS_OF`).

### M8 — Analyst Dashboard UI
- Clean Next.js 16 + Tailwind CSS frontend interface.
- Graph visualization using `react-force-graph-2d` / `Cytoscape.js`.
- Responsive data tables with built-in sorting, filtering, and pagination.

### M9 — Timeline & Search
- Date-range slider filtering posts, linkages, and infrastructure findings.
- Search bar querying actor handles, wallets, PGP fingerprints, and full-text document content.

### M10 — Actor Dossier Data Model
- Comprehensive entity schema consolidating alias history, identified indicators, linked personas, and corroborating evidence records.

### M11 — Reports & Export Engine
- One-click export to CSV, structured STIX 2.1 JSON, and court-admissible PDF dossiers (Jinja2 + WeasyPrint).
- Each generated report is permanently stamped with its own SHA-256 checksum and generating officer's ID.

### M12 — Pre-Built Analytics
- Statistical aggregations: threat actors by category, link distribution across confidence tiers, ingested document volume over time, and source coverage metrics.

### M13 — Audit Trail & Evidence Integrity
- Append-only audit logging recording all officer logins, search queries, link confirmations/rejections, and report exports.
- Cryptographic hash verification tool allowing analysts to verify any stored document or report against its recorded SHA-256 hash.

### M14 — Pipeline & System Monitoring
- `/api/v1/health` endpoint monitoring status of FastAPI, PostgreSQL, Neo4j, and Redis.
- Background worker status board displaying active Celery task queues.

### M15 — Security & Hardening
- Argon2id password hashing, TOTP second factor, parameterized SQLAlchemy and Cypher queries.
- Zero raw HTML rendering of scraped dark web content (parsed exclusively as sanitized text).
- Isolated container execution for scraping tasks.

### M16 — REST API Architecture
- Versioned `/api/v1` RESTful interface with auto-documented OpenAPI specification at `/docs`.

### M17 — Database Architecture
- Dual-persistence engine: PostgreSQL 16 for transactional integrity and audit records; Neo4j 5 Community for multi-hop graph traversals.

### M18 — Ground-Truth Synthetic Test Corpus
- Pre-seeded evaluation dataset featuring 10 synthetic actors across 4 mock dark web sources:
  - 2 actors sharing a common PGP key.
  - 2 actors sharing a common Bitcoin wallet.
  - 1 rebranded persona sharing distinct stylometric writing patterns.
  - 1 hidden service leaking an origin clearnet certificate.
  - 2 decoy actors with zero linkages (demonstrating the engine does not over-correlate).

### M19 — Testing & Evaluation Suite
- Automated unit tests for extractors, scoring functions, and link state transitions.
- Ground-truth benchmark measuring exact precision and recall against the synthetic dataset.
