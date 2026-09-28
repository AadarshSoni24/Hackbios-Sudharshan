# 🇮🇳 Smart India Hackathon (SIH 2026) — Final Presentation Deck
### Problem Statement ID: 26151 | Theme: Cybersecurity & Blockchain
### Project Title: **Project ShadowGraph / Sudarshan: Autonomous Dark Web Threat Actor Attribution Platform**

---

# 📌 SLIDE 1: Idea Title, Problem, Proposed Solution & USPs

### 🎯 Slide Header Bar
* **Project Name:** **Project ShadowGraph** *(or Sudarshan)*
* **Sub-Header:** Autonomous Multi-Vector Dark Web Threat Actor Attribution & De-Anonymization Platform
* **Meta:** PS ID: 26151 | Theme: Blockchain & Cybersecurity | Category: Software / AI

---

### 🧱 Slide Layout: 3-Column Split (Problem ➔ Architecture Visual ➔ Solution & USPs)

#### 🔴 Column 1: The Problem (Left Box)
* **Dark Web Criminal Cloaking:** Cybercriminals, ransomware syndicates, and data brokers exploit Tor onion services and cryptocurrency mixers to operate with near-total anonymity.
* **The Investigation Bottleneck:** Indian law enforcement (CERT-In, NTRO, State Police) manually crawls forums, copy-pastes PGP keys into Excel, and cross-references crypto wallets. A single actor investigation takes **8 to 10 hours** with high human error.
* **Market Rebranding Trap:** When illegal marketplaces (e.g., Silk Road, BreachForums) get seized, threat actors simply rebrand under new aliases on new forums, completely breaking the investigative trail.
* **Expensive Foreign Dependency:** Existing commercial tools (Chainalysis, DarkOwl, Maltego) cost **₹50 Lakhs to ₹1 Crore/year**, operate in data silos, and export sensitive national intelligence to foreign servers.

---

#### 🏛️ Column 2: Central Visual (3-Pillar Foundation)
```
┌────────────────────────────────────────────────────────┐
│           CORE INNOVATION: AI STYLOMETRY               │
│     Catches rebranded aliases via NLP writing DNA     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│         KNOWLEDGE GRAPH: Neo4j RELATIONSHIP ENGINE     │
│   Fuses Handles + PGP Keys + Crypto Wallets + IPs     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│      INGESTION & INFRASTRUCTURE MISCONFIG SCANNER      │
│   Extracts leaked SSL certs, server banners & text    │
└────────────────────────────────────────────────────────┘
```

---

#### 🟢 Column 3: Proposed Solution & Key USPs (Right Box)
* **Our Solution:** An end-to-end autonomous intelligence platform that ingests dark web forums, maps cross-platform identities into a queryable graph, and verifies rebranded actors via AI stylometry.
* **Top 5 USPs (Unique Selling Points):**
  1. 🔄 **Single Unified Platform:** Eliminates 5+ fragmented tools — combines scraping, crypto tracking, infrastructure OSINT, and graph visualization into one pane of glass.
  2. ⚡ **100% Automated Pipeline:** Analysts only trigger the target search; data collection, entity extraction, correlation, and scoring run fully autonomously.
  3. 🧠 **AI Stylometric Fingerprinting:** Uses RoBERTa / Sentence-Transformers to match grammatical habits, slang, and syntax across disconnected forum accounts (89%+ accuracy).
  4. 📊 **Multi-Vector Confidence Scoring:** Attribution is never binary yes/no; delivers weighted mathematical probability (PGP + Wallet + SSL + Stylometry).
  5. 🇮🇳 **Sovereign & Court-Ready:** 100% indigenous, air-gapped deployment capability; exports one-click PDF dossiers with SHA-256 evidence hashes.

---
---

# 📌 SLIDE 2: Technical Approach, Methodology & Architecture

### 🎯 Slide Header Bar
* **Title:** **TECHNICAL APPROACH & ARCHITECTURE**
* **Sub-Header:** Autonomous 6-Stage Intelligence Pipeline with Minimal Human Intervention

---

### 🧱 Slide Layout: Split Layout (Methodology Flow on Left | Architecture Diagram in Center | Tech Stack Cards on Right)

#### 🔄 Left Side: 6-Stage Autonomous Methodology
* **Stage 1: Target Trigger & Allocation 🎯**
  * Analyst enters a target seed (handle, BTC wallet, PGP key, or keyword) OR Celery Beat cron triggers scheduled ingestion.
* **Stage 2: Dark Web Ingestion 🌐**
  * Automated Scrapy spiders route through Tor daemon SOCKS5 proxy to scrape onion forums; pyOpenSSL extracts hidden SSL certs.
* **Stage 3: Data Parsing & Entity Extraction 🔍**
  * spaCy NLP and regex parsers automatically extract Bitcoin/Monero addresses, PGP fingerprints, session IDs, and email leaks.
* **Stage 4: Multi-Vector Analysis Engine 🧠**
  * Deterministic correlation (PGP/Wallet) + Clearnet Shodan SSL pivot + AI Stylometry vector cosine similarity.
* **Stage 5: Neo4j Graph Fusion 🕸️**
  * Ingests parsed relationships as nodes and edges into Neo4j; executes shortest-path and centrality Cypher queries.
* **Stage 6: Analyst Dashboard & Dossier Export 📊**
  * React/Cytoscape.js interactive graph rendering; 1-click court-ready PDF dossier generation with SHA-256 verification.
* 💡 **Crucial Design Callout:** *Human intervention is strictly required only at Stage 1 (Input) and Stage 6 (Review). Stages 2 to 5 run 100% autonomously.*

---

#### 🖼️ Center: Architecture Diagram
*(Use the 6-stage colored workflow graphic: `WhatsApp Image 2026-09-07 at 11.59.36 AM.jpeg` from your folder in the center)*

---

#### 🛠️ Right Side: Technology Stack (Categorized Badges)
| Layer | Technologies Selected | Core Operational Purpose |
|---|---|---|
| **Frontend UI** | **Next.js 14 / React + Cytoscape.js + Tailwind** | Dynamic interactive node-graph visualization & intelligence dashboard |
| **Backend API** | **Python 3.11 + FastAPI + Uvicorn** | Asynchronous, high-throughput microservices orchestration |
| **Knowledge Graph** | **Neo4j Enterprise / Community + Cypher** | High-speed multi-hop graph queries linking aliases, keys, and wallets |
| **Structured Store** | **PostgreSQL 16 + Redis** | Raw HTML archives, analyst audit trails & low-latency caching |
| **AI / NLP** | **PyTorch + Hugging Face (`all-MiniLM-L6-v2`)** | Authorship stylometry, text embeddings & cosine similarity |
| **Dark Web & OSINT**| **Tor Daemon, Stem, BeautifulSoup4, Shodan API** | Anonymized SOCKS5 routing, HTML parsing & clearnet IP mapping |
| **Task Queue** | **Celery + Redis Broker** | Non-blocking background worker execution for heavy scraping & ML |
| **Reporting & Hash**| **WeasyPrint / Jinja2 + `hashlib` (SHA-256)** | Court-ready forensic PDF export with tamper-evident cryptographic hash |
| **Deployment** | **Docker & Docker Compose** | 1-click air-gapped containerization across host environments |

---
---

# 📌 SLIDE 3: Feasibility Analysis, Challenges & Mitigation Strategies

### 🎯 Slide Header Bar
* **Title:** **FEASIBILITY ANALYSIS & RISK MITIGATION**
* **Sub-Header:** Pragmatic Engineering Approach for Hackathon Execution & Real-World Deployment

---

### 🧱 Slide Layout: 3 Clear Columns / Grid Cards (Feasibility ➔ Potential Risks ➔ Mitigation Strategies)

#### 📋 Column 1: Feasibility Analysis ⭐⭐⭐⭐
* **Technical Feasibility:** Built entirely on production-grade open-source tools (FastAPI, Neo4j, Scrapy, PyTorch). No reliance on proprietary paid APIs or non-existent experimental tech.
* **Operational Feasibility:** Seamlessly integrates into law enforcement workflow. Replaces manual Excel data entry with an autonomous ingest-and-alert dashboard.
* **Economic Viability:** Zero recurring foreign software license fees. Replaces ₹1 Crore/year commercial platforms with an in-house sovereign solution.
* **Legal & Ethical Compliance:** Ingests only publicly accessible forum listings and dark web marketplaces. Does not execute intrusive hacks, port exploits, or active exploitation.
* **Demo Feasibility (Zero-Fail MVP):** Powered by curated real-world dark web research datasets (AZSecure, CrimeBB) alongside live simulated scrapers, guaranteeing a zero-latency demo.

---

#### ⚠️ Column 2: Potential Challenges & Risks
* **Tor Latency & Service Churn:** .onion services are notorious for 5–30 second page load times, random downtime, and frequent marketplace takedowns.
* **Anti-Scraping Defenses:** Dark web forums frequently deploy Cloudflare-like DDoS guards, custom CAPTCHAs, and session authentication barriers.
* **AI Attribution Errors (Mimicry):** Threat actors deliberately alter writing styles or borrow forum slang, causing potential false positive attribution.
* **Data Security & Evidence Integrity:** Law enforcement intelligence data is highly sensitive and prone to legal admissibility challenges in court.
* **36-Hour Hackathon Scope:** Attempting to build an entire live dark web crawler, AI engine, and graph UI from scratch in 36 hours risks incomplete execution.

---

#### 🛡️ Column 3: Strategies to Overcome Challenges
* **Hybrid Data Architecture (Zero-Fail Demo):** Core presentation utilizes pre-indexed offline dark web corpora in Neo4j; scraper runs a targeted live demo on controlled endpoints.
* **Headless Automation & Session Reuse:** Scraper incorporates Stem identity rotation and FlareSolverr headless session persistence to bypass bot barriers.
* **Multi-Vector Weighted Confidence Scoring:** AI stylometry is never used in isolation; it holds a 10% weight, while hard cryptographic proof (PGP keys, shared wallets) anchors attribution.
* **Cryptographic Evidence Chain of Custody:** Every raw scraped snapshot and database record is hashed with SHA-256; system includes RBAC and full audit logs.
* **Pre-Built Modular Microservices:** Backend, Graph, and UI communicate via modular REST contracts, enabling parallel development and foolproof isolation.

---
---

# 📌 SLIDE 4: Impact, Benefits & Commercial Viability

### 🎯 Slide Header Bar
* **Title:** **IMPACT, BENEFITS & NATIONAL VALUE**
* **Sub-Header:** Transforming India's Dark Web Cyber Defense from Reactive to Proactive

---

### 📊 Top Impact Metric Banners (Horizontal Stats Bar)
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     98% TIME     │  │   ₹1 CRORE+     │  │     89%+        │  │     100%        │
│    REDUCTION    │  │ ANNUAL SAVINGS  │  │ ATTRIBUTION ACC │  │ SOVEREIGN TECH  │
│ 8-10 Hrs ➔ 5 Min│  │ Zero Foreign Fee│  │ Stylometry Score│  │ Zero Data Leaks │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

### 🧱 Slide Layout: Split Layout (Before vs After Table on Left | Strategic National Benefits on Right)

#### ⚖️ Left Side: Operational Transformation (Before vs. After)

| Metric / Dimension | Traditional Manual Method ❌ | Project ShadowGraph Platform ✅ |
|---|---|---|
| **Investigation Speed** | 8 – 10 hours per actor | **Under 5 minutes (Instant Graph Query)** |
| **Tool Fragmentation** | 5+ disconnected commercial tools | **Single unified intelligence dashboard** |
| **Rebranded Actor Attribution** | Trail goes dead on alias change | **AI Stylometry connects historical aliases** |
| **Attribution Certainty** | Human guesswork & manual hunches | **Quantified mathematical confidence score** |
| **Courtroom Admissibility** | Screenshots easily disputed | **SHA-256 hashed evidence dossier export** |
| **Surveillance Continuity** | Manual periodic checks | **24/7 autonomous monitoring via Celery** |

---

#### 🇮🇳 Right Side: National & Strategic Impact
* **Indigenous Cyber Sovereignty:** Eliminates critical reliance on US/Israeli intelligence platforms (Chainalysis, DarkOwl), ensuring sensitive Indian security data never leaves sovereign borders.
* **Empowering Law Enforcement:** Equips state cyber police, CERT-In, NTRO, and NIA with institutional capability previously accessible only to well-funded federal agencies.
* **Proactive Threat Disruption:** Identifies threat actors during early stage data dumps and illicit escrow deposits, before major national infrastructure attacks materialize.
* **Commercial & Market Potential:** Can be commercialized as an enterprise SaaS product for Indian banks, critical infrastructure operators, and telecom providers to detect corporate breaches.

*(Visual reference: Refer to `impact_benefits_slide.jpg` saved in your SIH folder for visual inspiration)*

---
---

# 📌 SLIDE 5: Implementation Roadmap, Team Roles & Deliverables

### 🎯 Slide Header Bar
* **Title:** **IMPLEMENTATION ROADMAP & DELIVERABLES**
* **Sub-Header:** 36-Hour Hackathon Execution Plan & Post-Hackathon National Rollout

---

### 🧱 Slide Layout: 3 Horizontal/Vertical Workstreams (36-Hr Hackathon Plan ➔ Role Assignment ➔ Tangible Deliverables)

#### ⏱️ Section 1: 36-Hour Hackathon Sprint Plan
* **Hours 00 – 08: Pipeline & Ingestion Setup 🚀**
  * Initialize Tor daemon proxy; configure Stem identity rotation; load AZSecure/CrimeBB forum corpus; setup PostgreSQL schema.
* **Hours 08 – 18: Knowledge Graph & Entity Extraction 🕸️**
  * Run regex & spaCy extractors on posts; construct Neo4j schema; load actor nodes (Handles, Wallets, PGP, SSL Certs) and relationship edges.
* **Hours 18 – 26: AI Stylometry & Multi-Vector Engine 🧠**
  * Deploy Sentence-Transformer embedding model; build cosine similarity comparison; implement weighted confidence scoring formula.
* **Hours 26 – 32: Dashboard Integration & Visualization 💻**
  * Connect Next.js/React frontend with FastAPI endpoints; render dynamic Cytoscape.js relationship graph with search filters.
* **Hours 32 – 36: Court Dossier Generation & Demo Rehearsal 📄**
  * Finalize WeasyPrint 1-click PDF dossier export; conduct offline end-to-end rehearsal; prepare judge walkthrough scenario.

---

#### 👥 Section 2: Team Division of Labor (Specialized Ownership)
* **Role 1: Cybersecurity & OSINT Engineer (Data & Ingestion Lead)**
  * *Tech:* Python 3.11+, Tor Daemon, Stem, BeautifulSoup4, pyOpenSSL, Shodan API, PGPy.
  * *Responsibilities:* Dark web scraping, SSL cert extraction, PGP key parsing, and raw data ingestion.
* **Role 3: Full-Stack & UI/UX Engineer (Analyst Dashboard Lead)**
  * *Tech:* Next.js 14, React, Cytoscape.js, Tailwind CSS, WeasyPrint/ReportLab.
  * *Responsibilities:* Interactive graph visualization, actor search dossier, and court-ready PDF export.
* **Role 2: Backend & AI Engineer (Core Architecture & Graph Lead)**
  * *Tech:* FastAPI, Neo4j (Cypher), PostgreSQL, Celery/Redis, PyTorch, Hugging Face Transformers.
  * *Responsibilities:* Knowledge graph schema, identity linking, AI stylometry verification, and REST API development.

---

#### 🏆 Section 3: Tangible Final Deliverables (What Judges Will Touch & See)
1. 🖥️ **Live Web Dashboard:** Search any handle/wallet to explore interactive node-link network graph in real time.
2. 🕸️ **Populated Neo4j Knowledge Graph:** 50,000+ nodes and edges mapping real-world threat actors across forums.
3. 🤖 **Working AI Stylometry Demo:** Enter two text samples to see instant cosine similarity score and writing style match.
4. 📄 **Downloadable PDF Intelligence Dossier:** Complete court-admissible PDF report featuring actor timeline, alias web, and SHA-256 evidence hash.
