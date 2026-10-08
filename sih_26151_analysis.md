# SIH PS 26151 — Dark Web Threat Actor De-Anonymization

## Complete Problem-to-Solution Research Analysis

---

# 1. EXACT PROBLEM STATEMENT

| Field | Value |
|-------|-------|
| **PS ID** | 26151 |
| **Title** | Dark web threat actor de-anonymization |
| **Organization** | National Technical Research Organisation (NTRO) |
| **Category** | Software |
| **Theme** | Blockchain & Cybersecurity |

### Simple Explanation

NTRO wants a system that **uncovers the real identities of criminals hiding on the dark web**. Think of it like this: criminals use Tor (an anonymity network) like a digital disguise. This PS asks you to build a detective toolkit that:

1. **Finds cracks in their disguise** — server misconfigurations, leaked certificates, exposed pages
2. **Connects their multiple fake identities** — same person using different names across forums
3. **Matches writing patterns using AI** — even if they change names, their writing style stays the same

### A. Explicitly Stated by the PS

- Build an end-to-end system for collection, storage, contextualization, and querying
- Three core capabilities: misconfiguration detection, cross-marketplace mapping, AI-based stylometric analysis
- Must have GUI/dashboard for querying across timelines
- Must work autonomously
- Export in CSV, JSON, and report formats
- Track: handles, PGP keys, wallets, trust links, infrastructure indicators, attribution confidence, category, last scan date, source

### B. Reasonable Inference

- NTRO is India's premier technical intelligence agency — this is for **national security**, not academic research
- The system should produce **actionable intelligence** for investigators, not just raw data
- "Attribution confidence" implies a scoring/probabilistic system, not binary yes/no
- "Autonomous mode" = the system should run 24/7 collecting data without manual intervention
- The end user is a trained intelligence analyst, not a general public user

### C. Needs Further Research/Verification

- Whether NTRO expects real-time Tor network access or simulated data for the hackathon
- Scope: Indian dark web actors only or global?
- Legal boundaries for data collection during development
- Expected scale (hundreds vs. thousands of actors)

---

# 2. REAL-WORLD PROBLEM

### What's Actually Happening

The dark web is the **internet's black market**. Using the Tor network, threat actors:
- Sell stolen data (credit cards, Aadhaar numbers, government secrets)
- Trade drugs and weapons
- Offer hacking-as-a-service
- Launder money through cryptocurrency
- Finance terrorism

**Why it's difficult:**
- Tor routes traffic through multiple encrypted relays → no direct IP attribution
- Actors use pseudonyms, frequently change identities
- Marketplaces shut down and reappear under new names
- Cryptocurrency provides financial anonymity
- Actors operate across jurisdictions

**Consequences of inaction:**
- Critical data breaches go unattributed (India saw 1.39M+ cyber incidents reported to CERT-In in 2022 alone — *FACT: CERT-In Annual Report*)
- Terror financing channels remain open
- Government classified documents leak without traceability

### Simple Example

A threat actor "ShadowViper" sells stolen Indian banking data on Marketplace A. The marketplace gets shut down. The same person reappears as "DarkPhoenix" on Marketplace B, using a slightly different PGP key but the same writing style and same Bitcoin wallet. Without a de-anonymization system, investigators start from scratch. With this system, the connection is made automatically, and a misconfigured server header reveals their hosting provider maps to a clearnet IP in Lucknow.

---

# 3. PROBLEM DECOMPOSITION

```
Main Problem: De-anonymize dark web threat actors
│
├── Sub-problem 1: DATA COLLECTION
│   ├── Crawl Tor hidden services (forums, marketplaces)
│   ├── Extract structured data (posts, PGP keys, wallets, timestamps)
│   └── Handle anti-scraping measures, CAPTCHAs, access controls
│
├── Sub-problem 2: INFRASTRUCTURE ATTRIBUTION
│   ├── Detect server misconfigurations (exposed /server-status, phpinfo)
│   ├── Match SSL/TLS certificates to clearnet domains via CT logs
│   ├── Identify default banners, descriptor inconsistencies
│   └── Cross-reference with Shodan/Censys for clearnet mapping
│
├── Sub-problem 3: IDENTITY LINKING (Cross-Platform)
│   ├── Map handles across multiple forums/marketplaces
│   ├── Link PGP key fingerprints
│   ├── Trace cryptocurrency wallet reuse
│   └── Build trust-link relationship graphs
│
├── Sub-problem 4: AI-BASED PERSONA IDENTIFICATION
│   ├── Stylometric analysis (writing fingerprinting)
│   ├── Behavioral profiling (activity patterns, timezone inference)
│   ├── Adversarial stylometry (actors deliberately changing style)
│   └── Link rebranded/migrated personas
│
└── Sub-problem 5: ANALYTICAL FRONTEND
    ├── Timeline-based querying
    ├── Dashboard with confidence scoring
    ├── Export functionality (CSV/JSON/report)
    └── Relationship graph visualization
```

### CORE PROBLEM

**Building a unified intelligence pipeline that continuously ingests dark web data, resolves multiple identities to single entities, and provides confidence-scored attribution linking anonymous personas to real-world infrastructure.**

---

# 4. CURRENT SYSTEM / CURRENT PROCESS

```
Dark web activity detected/reported
        ↓
Intelligence agency assigns analyst
        ↓
Analyst manually browses dark web using Tor Browser (Tails/Whonix)
        ↓
Manually screenshots, copies text, notes handles
        ↓
Searches other forums manually for same handle
        ↓
Checks cryptocurrency wallets via blockchain explorers
        ↓
Cross-references with OSINT tools (Maltego, SpiderFoot) — one at a time
        ↓
Writes manual report
        ↓
Report goes up chain of command
        ↓
If lucky, identifies a misconfiguration → gets real IP
        ↓
Investigation may take weeks/months
```

### Major Bottlenecks

| Bottleneck | Impact |
|-----------|--------|
| Manual browsing | Extremely slow, limited coverage |
| No persistent data store | Historical context lost when markets shut down |
| Identity linking done by human memory | Misses non-obvious connections |
| No stylometric analysis | Rebranded actors escape detection |
| No automated misconfiguration scanning | Relies on luck, not systematic checks |
| Siloed tools | Maltego, blockchain tools, OSINT tools don't talk to each other natively |

---

# 5. EXISTING SOLUTIONS — DEEP RESEARCH

---

## EXISTING SOLUTION #1: DarkOwl Vision

| Field | Detail |
|-------|--------|
| **Organization** | DarkOwl LLC |
| **Country** | USA |
| **Type** | Commercial |
| **Website** | [darkowl.com](https://darkowl.com) |
| **Status** | Active |
| **Target Users** | Law enforcement, intelligence agencies, enterprises |

**What it is:** The world's largest commercially available darknet database. Indexes thousands of dark web sites in near real-time.

**What it solves for our PS:** Data collection and indexing of dark web content (handles, PGP keys, forum posts). Provides search and API access.

**What it does NOT solve:** Does NOT perform automated infrastructure misconfiguration detection, does NOT do stylometric analysis, does NOT build unified cross-marketplace persona graphs with confidence scoring. It's a **data source**, not a de-anonymization engine.

**Competition level:** Complementary system / Infrastructure tool. NOT a direct competitor.

---

## EXISTING SOLUTION #2: Recorded Future (Intelligence Cloud)

| Field | Detail |
|-------|--------|
| **Organization** | Recorded Future (Mastercard subsidiary) |
| **Country** | USA |
| **Type** | Commercial |
| **Status** | Active |
| **Target Users** | SOC teams, enterprise threat intelligence |

**What it is:** Full-scale cyber threat intelligence platform with dark web monitoring as one module.

**What it solves for our PS:** Automated collection from forums/markets, AI/ML analysis, some actor tracking.

**What it does NOT solve:** Not designed for de-anonymization — focuses on threat alerting, not attribution. No Tor hidden service misconfiguration scanning. No stylometric persona linking.

**Competition level:** Partial competitor.

---

## EXISTING SOLUTION #3: OnionScan

| Field | Detail |
|-------|--------|
| **Organization** | Sarah Jamie Lewis (community forks: nao1215/onionscan) |
| **Country** | International (Open Source) |
| **Type** | Open Source |
| **Website** | [github.com/s-rah/onionscan](https://github.com/s-rah/onionscan) |
| **Status** | Original: unmaintained. Forks: active |
| **Target Users** | Security researchers, hidden service operators |

**What it is:** A Go-based tool that scans .onion services for OPSEC leaks — exposed server-status, EXIF metadata, PGP identity leaks, SSH fingerprints, etc.

**What it solves for our PS:** Directly addresses Sub-problem 2 (infrastructure attribution). Detects misconfigurations.

**What it does NOT solve:** No cross-marketplace persona mapping, no stylometric analysis, no persistent database, no analytical frontend, no relationship graph. It's a **scanner**, not a platform.

**Competition level:** Infrastructure tool. Can be integrated.

**Key learning:** OnionScan's analyzer architecture (pluggable modules for different misconfiguration types) is an excellent design pattern to adopt.

---

## EXISTING SOLUTION #4: Maltego

| Field | Detail |
|-------|--------|
| **Organization** | Maltego Technologies |
| **Country** | Germany |
| **Type** | Commercial (Community Edition free) |
| **Status** | Active |
| **Target Users** | OSINT analysts, investigators, pentesters |

**What it is:** Graph-based link analysis platform. Connects entities (domains, IPs, emails, aliases) through "transforms" that query external data sources.

**What it solves for our PS:** Visualization of entity relationships, pivoting from one data point to related ones, integration with DarkOwl/Cybersixgill via Transform Hub.

**What it does NOT solve:** No autonomous dark web crawling, no infrastructure misconfiguration scanning, no stylometric analysis, no persistent autonomous monitoring. It's an **analyst's tool**, not an autonomous system.

**Competition level:** Complementary system.

---

## EXISTING SOLUTION #5: Chainalysis Reactor

| Field | Detail |
|-------|--------|
| **Organization** | Chainalysis Inc. |
| **Country** | USA |
| **Type** | Commercial |
| **Website** | [chainalysis.com](https://chainalysis.com) |
| **Status** | Active |
| **Target Users** | Law enforcement, financial intelligence units |

**What it is:** Blockchain investigation platform. Traces cryptocurrency transactions, clusters wallet addresses to known entities, visualizes fund flows across 100+ blockchains.

**What it solves for our PS:** Cryptocurrency wallet tracing (part of Sub-problem 3). Can link wallets to exchanges where KYC is enforced.

**What it does NOT solve:** Everything else — no dark web crawling, no stylometric analysis, no infrastructure attribution. Purely a financial intelligence tool.

**Competition level:** Complementary system / Infrastructure tool.

---

## EXISTING SOLUTION #6: SpiderFoot

| Field | Detail |
|-------|--------|
| **Organization** | SpiderFoot (Open Source) |
| **Country** | International |
| **Type** | Open Source |
| **Website** | [github.com/smicallef/spiderfoot](https://github.com/smicallef/spiderfoot) |
| **Status** | Active |
| **Target Users** | Security professionals, OSINT researchers |

**What it is:** OSINT automation framework. Integrates 200+ data sources. Has Tor integration for dark web searches. Modular architecture.

**What it solves for our PS:** Automated reconnaissance, OSINT correlation, some dark web search capability.

**What it does NOT solve:** No stylometric analysis, no persistent identity graph, no Tor service misconfiguration scanning, no analytical dashboard for intelligence analysis.

**Competition level:** Infrastructure tool. Can be integrated.

---

## EXISTING SOLUTION #7: Ahmia.fi

| Field | Detail |
|-------|--------|
| **Organization** | Open Source (Tor Project affiliated) |
| **Country** | Finland |
| **Type** | Open Source |
| **Website** | [ahmia.fi](https://ahmia.fi) |
| **Status** | Active |

**What it is:** Search engine for Tor hidden services. Uses Scrapy crawler + Elasticsearch index + Django frontend.

**What it solves for our PS:** Discovery and indexing of .onion services. Open-source architecture (crawler + Elasticsearch) is directly reusable.

**What it does NOT solve:** No actor profiling, no de-anonymization, no identity linking, no stylometric analysis.

**Competition level:** Infrastructure tool. Architecture pattern to adopt.

---

## EXISTING SOLUTION #8: Flashpoint

| Field | Detail |
|-------|--------|
| **Organization** | Flashpoint |
| **Type** | Commercial |
| **Status** | Active |

**What it is:** Deep/dark web intelligence platform with human-validated analysis. Strong focus on threat actor tracking, financial fraud monitoring, and ransomware intelligence.

**What it solves for our PS:** Actor tracking across forums, some identity resolution, encrypted chat monitoring (Telegram, Discord).

**What it does NOT solve:** No automated Tor misconfiguration scanning, limited stylometric AI, no unified de-anonymization pipeline with confidence scoring as described by PS.

**Competition level:** Partial competitor (closest to our PS among commercial solutions).

---

# 6. EXISTING SOLUTION COMPARISON

| Solution | Provider | PS Coverage | Strengths | Missing for Our PS |
|----------|----------|-------------|-----------|-------------------|
| DarkOwl | DarkOwl LLC | ~20% (data only) | Largest darknet database | No de-anonymization engine |
| Recorded Future | Mastercard | ~25% | Broad threat intel | Not attribution-focused |
| OnionScan | Open Source | ~15% (infra only) | Misconfiguration scanning | No identity linking, no AI |
| Maltego | Maltego Tech | ~15% (visualization) | Graph analysis | Manual, not autonomous |
| Chainalysis | Chainalysis | ~10% (crypto only) | Best blockchain analysis | Only financial aspect |
| SpiderFoot | Open Source | ~15% (OSINT) | 200+ data sources | No stylometry, no persistence |
| Ahmia.fi | Open Source | ~10% (indexing) | Proven crawler architecture | No intelligence layer |
| Flashpoint | Flashpoint | ~30% | Actor tracking, HUMINT | No infrastructure scanning, limited AI |

### Key Findings

- **No existing solution completely solves this PS.** Each solves 10-30% of the requirements.
- **Flashpoint** is closest but lacks the three-pillar approach (misconfiguration + identity graph + stylometry) the PS explicitly demands.
- **The PS exists because** current tools are siloed — you need to use 5-6 different tools manually and mentally synthesize the results.
- **Integration candidates:** OnionScan (infra scanning), Ahmia architecture (crawling), SpiderFoot (OSINT enrichment).

---

# 7. GAP ANALYSIS

### Gap #1: Unified Multi-Pillar Attribution

| Aspect | Detail |
|--------|--------|
| **Existing capability** | Individual tools handle individual aspects (scanning, OSINT, blockchain) |
| **Missing capability** | A single system that fuses all three attribution methods with confidence scoring |
| **Why it matters** | Attribution confidence comes from convergence of multiple evidence types |
| **Difficulty** | High |

### Gap #2: Autonomous Stylometric Persona Linking

| Aspect | Detail |
|--------|--------|
| **Existing capability** | Academic research exists (BERT, SDAE models achieving 90%+ accuracy in controlled settings) |
| **Missing capability** | No deployed, productionized system that continuously applies stylometric analysis across dark web forums |
| **Why it matters** | Actors rebrand after marketplace takedowns — writing style is the one thing they can't easily change |
| **Difficulty** | Very High |

### Gap #3: Persistent Cross-Marketplace Identity Graph

| Aspect | Detail |
|--------|--------|
| **Existing capability** | Maltego can manually build relationship graphs; commercial platforms track some actors |
| **Missing capability** | An autonomous system that continuously builds and updates a unified identity graph (handles → PGP → wallets → trust links → behavioral clusters) across the entire dark web |
| **Difficulty** | High |

### Gap #4: Automated Tor Infrastructure Misconfiguration Detection at Scale

| Aspect | Detail |
|--------|--------|
| **Existing capability** | OnionScan can scan individual services |
| **Missing capability** | Continuous, large-scale scanning with automatic cross-referencing against clearnet infrastructure databases (CT logs, Shodan, Censys) |
| **Difficulty** | Medium-High |

### THE CORE GAP

> **"Existing systems can individually monitor dark web activity, scan for misconfigurations, trace cryptocurrency, or perform OSINT — but they cannot autonomously fuse infrastructure attribution, cross-platform identity resolution, and AI-driven stylometric analysis into a single, continuously updated intelligence graph with quantified attribution confidence."**

---

# 8. STAKEHOLDER ANALYSIS

| Stakeholder | Role | Problem | Required Capability |
|-------------|------|---------|-------------------|
| NTRO Intelligence Analysts | Primary user | Manual, slow, fragmented tools | Unified dashboard with autonomous data collection |
| CERT-In | Incident responders | Can't attribute dark web attacks to actors | Actor profiles with infrastructure links |
| NCIIPC | Critical infra protection | Unknown threats from dark web | Early warning from dark web monitoring |
| Law Enforcement (NIA, CBI) | Investigation & prosecution | Need evidence chain for court | Exportable reports with confidence scoring |
| Judiciary | Evidence validation | Assessing reliability of digital evidence | Clear attribution confidence methodology |

---

# 9. USER JOURNEY

### Current Journey
```
Analyst receives tip about threat actor "ShadowViper"
→ Manually searches 5+ dark web forums using Tor Browser (2-3 hours)
→ Finds posts, copies text to spreadsheet
→ Searches blockchain explorers for wallet addresses (1 hour)
→ Runs Maltego transforms manually (1 hour)
→ Checks OnionScan on known .onion addresses (30 min per address)
→ Manually cross-references with Shodan (1 hour)
→ Writes report in Word document (2 hours)
→ Total: 8-10 hours for a SINGLE actor, low confidence
```

### Proposed Journey
```
Analyst enters handle "ShadowViper" in dashboard
→ System immediately shows:
  - All posts across 15+ forums (auto-collected)
  - Linked handles: "DarkPhoenix", "Viper_X" (via PGP + stylometry)
  - Wallet cluster: 3 BTC addresses, traced to Exchange X
  - Infrastructure: .onion service has exposed SSL cert → maps to IP 203.x.x.x
  - Confidence: 87% attribution to specific clearnet entity
  - Timeline of all activity over 6 months
→ Analyst exports JSON report
→ Total: 5 minutes for comprehensive, multi-evidence attribution
```

---

# 10. DATA REQUIREMENTS

| Data | Purpose | Source | Availability | Privacy |
|------|---------|--------|-------------|---------|
| Dark web forum posts | Stylometric analysis, actor profiling | Custom Tor crawler | Must crawl ourselves | High sensitivity |
| .onion service metadata | Infrastructure attribution | OnionScan-style scanning | Must scan ourselves | Medium |
| Certificate Transparency logs | SSL cert → clearnet mapping | crt.sh, Google CT | Public, free API | Low |
| Shodan/Censys data | Clearnet infrastructure matching | Shodan/Censys APIs | Free tier available | Low |
| Blockchain transactions | Wallet tracing | Blockchain.com API, Blockchair | Public, free | Low |
| PGP keyserver data | Key fingerprint linking | keys.openpgp.org, SKS pool | Public | Low |
| CrimeBB dataset | Training stylometric models | Cambridge Cybercrime Centre | Restricted academic access | High |
| Darknet Market Archives | Historical actor data | IMPACT Cyber Trust, Gwern archives | Academic/research access | High |

### For SIH MVP — Synthetic Data Strategy

Since your team **cannot and should not** crawl the actual dark web during a hackathon:

1. **Generate synthetic forum data** — Use GPT/LLM to create realistic forum posts from "10 fake threat actors" with distinct writing styles
2. **Create mock .onion metadata** — Simulate server-status pages, SSL certs with clearnet links
3. **Use Bitcoin testnet** — Generate test wallet transactions
4. **Use Gwern's darknet market archives** — Publicly available metadata from defunct markets (Silk Road, etc.)

---

# 11. API ANALYSIS

| API | Provider | Purpose | Free? | Rate Limits |
|-----|----------|---------|-------|-------------|
| crt.sh | Sectigo/COMODO | CT log search | Yes | Reasonable |
| Shodan API | Shodan.io | Internet device search | Free tier (limited) | 1 query/sec |
| Censys Search API | Censys | Internet host scanning | Free tier | 250 queries/month |
| Blockchain.com API | Blockchain.com | BTC transaction lookup | Yes | Standard |
| Blockchair API | Blockchair | Multi-chain block explorer | Free tier | 30 req/min |
| HaveIBeenPwned API | Troy Hunt | Breach data correlation | Free (rate limited) | 10 req/min |
| VirusTotal API | Google | Malware/URL reputation | Free tier | 4 req/min |
| KeyServer (HKP) | keys.openpgp.org | PGP key lookup | Yes | No limit documented |

---

# 12. AI / ML ANALYSIS

### Is AI Actually Necessary?

**YES** — AI is essential for Sub-problem 4 (stylometric analysis). Without it, persona linking across rebranded accounts is practically impossible at scale.

### Where AI Provides Genuine Value

| AI Application | Technique | Purpose | Criticality |
|---------------|-----------|---------|-------------|
| **Stylometric fingerprinting** | BERT/RoBERTa fine-tuned for authorship attribution | Link posts across forums to same author | **P0 — Critical** |
| **Behavioral profiling** | Time-series clustering (activity patterns, timezone inference) | Identify actor routines | P1 |
| **Entity resolution** | Graph Neural Networks (GNN) / Node2Vec | Merge duplicate entities across data sources | P1 |
| **Anomaly detection** | Isolation Forest / Autoencoders | Flag unusual misconfiguration patterns | P2 |
| **NLP — Topic classification** | Text classification (category tagging) | Auto-categorize forum posts (drugs, weapons, hacking) | P2 |

### Recommended Stylometric Model

```
Input: Forum post text (min ~500 characters)
    ↓
Preprocessing: Tokenization, feature extraction
    (character n-grams, function word frequency, 
     punctuation patterns, sentence length distribution)
    ↓
Model: Fine-tuned RoBERTa or DeBERTa
    ↓
Output: Author embedding vector (768-dim)
    ↓
Matching: Cosine similarity against known author embeddings
    ↓
Result: "87% match to Author X across 3 forums"
```

**Training data:** CrimeBB dataset (academic access) or synthetic data for MVP. ~50 posts per author needed for reliable attribution (*INFERENCE based on literature*).

**Where traditional algorithms are better than AI:**
- Infrastructure misconfiguration detection → Rule-based pattern matching (regex for server-status, cert parsing)
- PGP key fingerprint matching → Exact hash comparison
- Wallet clustering → Graph algorithms (not ML)

---

# 13. CYBERSECURITY & PRIVACY

> [!CAUTION]
> This PS involves handling **extremely sensitive data**. Security architecture is not optional — it's central.

### Threat Model

| Threat | Risk | Mitigation |
|--------|------|-----------|
| Threat actors discover they're being monitored | High | All crawling through dedicated Tor circuits, no clearnet leaks |
| Data breach of collected intelligence | Critical | Encryption at rest (AES-256), access control, audit logs |
| Analyst identity exposure | High | Isolated environments (Whonix/Tails VMs for crawling) |
| Legal liability from data collection | Medium | Clear data retention policies, legal framework documentation |
| False attribution → wrongful targeting | High | Confidence scoring, human-in-the-loop for final attribution |

### Required Security Architecture

- **Network isolation:** Crawling components run in isolated VMs/containers routed through Tor
- **Encryption:** All data at rest encrypted. TLS for all internal communication.
- **RBAC:** Role-based access control (Analyst, Admin, Viewer roles)
- **Audit logging:** Every query, export, and attribution decision logged
- **Data classification:** All collected data tagged by sensitivity level

---

# 14. HARDWARE / IoT

**Hardware is NOT required for the core solution.** This is a pure software/data engineering problem.

The only hardware consideration is compute requirements for:
- Tor crawling (can run on standard VMs)
- ML inference (GPU beneficial for stylometric model, but CPU-only is viable for MVP)

---

# 15. PROPOSED SOLUTION

### Project Name: **SPECTRE** (System for Profiling, Entity Correlation, and Threat actor REsolution)

> "We are building **SPECTRE**, an autonomous dark web intelligence platform that helps **intelligence analysts** de-anonymize threat actors by **fusing infrastructure misconfiguration detection, cross-platform identity resolution, and AI-driven stylometric analysis into a unified, confidence-scored attribution graph.**"

### Why It Fills the Gap

1. **Unified pipeline** — No existing tool combines all three attribution methods
2. **Autonomous operation** — Runs continuously, not manually triggered
3. **Confidence scoring** — Probabilistic attribution, not binary
4. **Persistent knowledge graph** — Intelligence accumulates over time, not lost between sessions
5. **AI-driven persona linking** — Catches rebranded actors that manual analysis misses

---

# 16. WHAT EXACTLY SHOULD WE BUILD?

### ✅ MUST BUILD

| Feature | Reason |
|---------|--------|
| Dark web crawler (simulated for demo) | Core data collection — PS explicitly requires it |
| Infrastructure misconfiguration scanner | PS explicitly lists this as Capability #1 |
| Cross-platform identity linker (handles, PGP, wallets) | PS explicitly lists this as Capability #2 |
| Stylometric analysis engine | PS explicitly lists this as Capability #3 |
| Relationship graph database (Neo4j) | Required for entity resolution and visualization |
| Analytical dashboard with timeline querying | PS explicitly requires GUI/dashboard |
| Export functionality (CSV, JSON, report) | PS explicitly requires this |
| Attribution confidence scoring | PS mentions "attribution confidence" |

### 🟡 SHOULD BUILD

| Feature | Reason |
|---------|--------|  
| Clearnet cross-referencing (CT logs, Shodan) | Strengthens infrastructure attribution |
| Real-time notification system | Alerts when high-confidence attribution is made |
| MITRE ATT&CK TTP mapping | Standardized threat framework, impresses judges |

### 🟢 NICE TO HAVE

| Feature | Reason |
|---------|--------|
| Blockchain transaction visualization | Visual appeal for demo |
| Telegram/Discord channel monitoring | Extends coverage |
| Multi-language stylometric support | PS doesn't explicitly require it |

### 🔴 DO NOT BUILD

| Feature | Reason |
|---------|--------|
| Actual Tor network crawler for live demo | Legal and ethical risks, unnecessary for SIH |
| Full blockchain analysis engine | Chainalysis already exists; simulate wallet linking instead |
| Custom cryptocurrency mixer detection | Too complex, too niche |
| Mobile app | Not needed — this is an analyst workstation tool |

---

# 17. SYSTEM WORKFLOW

```
[Data Collection Layer]
Tor Crawler (simulated) → Scrapes forums, marketplaces
    ↓
[Ingestion & Parsing]
Extract: posts, handles, PGP keys, wallet addresses, timestamps, server headers
    ↓
[Storage]
Elasticsearch (full-text search) + Neo4j (relationship graph) + PostgreSQL (metadata)
    ↓
[Analysis Engine — Three Pillars]
┌─────────────────────┬──────────────────────┬─────────────────────┐
│ Infrastructure      │ Identity Resolution  │ AI Stylometric      │
│ Attribution         │                      │ Analysis            │
│                     │                      │                     │
│ • Server-status     │ • Handle matching    │ • Feature extraction│
│ • SSL cert → CT log │ • PGP fingerprint    │ • RoBERTa embedding │
│ • Banner analysis   │ • Wallet clustering  │ • Author matching   │
│ • Shodan/Censys     │ • Trust link mapping │ • Behavioral profile│
│   cross-ref         │                      │                     │
└─────────────────────┴──────────────────────┴─────────────────────┘
    ↓
[Entity Resolution & Confidence Scoring]
Merge evidence from all three pillars → weighted confidence score
    ↓
[Knowledge Graph Update]
Neo4j graph updated with new nodes, edges, confidence scores
    ↓
[Analytical Frontend]
Dashboard → Timeline query → Graph visualization → Export
```

### Realistic Example

```
1. Crawler discovers forum post by "CyberRat" on Forum A
2. Post contains PGP key fingerprint ABC123
3. System searches: PGP key ABC123 also found on Forum B under handle "NetWraith"
4. Stylometric engine: posts by "CyberRat" and "NetWraith" have 91% style similarity
5. Infrastructure scan: Forum A's .onion has exposed /server-status showing domain "example.com"
6. CT log lookup: example.com's SSL cert maps to IP 103.x.x.x
7. Shodan lookup: IP 103.x.x.x is a VPS in Mumbai
8. Entity Resolution: Merge "CyberRat" + "NetWraith" into single actor profile
9. Attribution confidence: 87% (PGP match: high, stylometric: high, infra: medium)
10. Analyst views on dashboard, exports report for investigation team
```

---

# 18. SYSTEM ARCHITECTURE

### MVP Architecture (SIH Prototype)

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND (React)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │Dashboard │ │Graph View│ │Timeline  │ │Export   │ │
│  │(D3.js)   │ │(vis.js)  │ │Query     │ │Module   │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
└───────────────────────┬──────────────────────────────┘
                        │ REST API
┌───────────────────────┴──────────────────────────────┐
│                 BACKEND (Python FastAPI)               │
│  ┌────────────┐ ┌─────────────┐ ┌──────────────────┐ │
│  │Crawler     │ │Analysis     │ │Entity Resolution │ │
│  │Simulator   │ │Engine       │ │& Scoring         │ │
│  └────────────┘ └─────────────┘ └──────────────────┘ │
│  ┌────────────┐ ┌─────────────┐ ┌──────────────────┐ │
│  │Infra       │ │Stylometric  │ │API Integrations  │ │
│  │Scanner     │ │ML Service   │ │(crt.sh, Shodan)  │ │
│  └────────────┘ └─────────────┘ └──────────────────┘ │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────┴──────────────────────────────┐
│                    DATA LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │Neo4j     │  │Elastic-  │  │PostgreSQL        │   │
│  │(Graph)   │  │search    │  │(Metadata, Users) │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### Production Architecture (Additional)

- **Kafka** for real-time data streaming from multiple crawlers
- **Kubernetes** for container orchestration
- **Redis** for caching
- **MinIO** for raw data storage (screenshots, HTML dumps)
- **Grafana/Prometheus** for monitoring
- **HashiCorp Vault** for secrets management

---

# 19. TECHNOLOGY STACK

### RECOMMENDED STACK FOR SIH TEAM

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React + TypeScript | Team already knows React (per user profile) |
| **Graph Visualization** | vis.js or react-force-graph | Interactive, browser-based graph rendering |
| **Charts/Dashboard** | Recharts or Chart.js | Clean, modern dashboards |
| **Backend** | Python FastAPI | Fastest for ML integration + API development |
| **Graph Database** | Neo4j Community Edition | Purpose-built for relationship graphs, free |
| **Search Engine** | Elasticsearch | Full-text search over forum posts, proven with Ahmia |
| **Relational DB** | PostgreSQL | Metadata, user management, audit logs |
| **ML Framework** | PyTorch + HuggingFace Transformers | RoBERTa/DeBERTa for stylometric analysis |
| **NLP** | spaCy | Text preprocessing, feature extraction |
| **Task Queue** | Celery + Redis | Async crawling and analysis jobs |
| **Containerization** | Docker + Docker Compose | Easy local deployment for demo |
| **Auth** | JWT (FastAPI built-in) | Simple, secure API authentication |

### Why Not Alternatives?

| Alternative | Why Not |
|------------|---------|
| Node.js backend | Harder to integrate PyTorch ML models |
| MongoDB | Neo4j is fundamentally better for relationship queries |
| TensorFlow | PyTorch + HuggingFace has better pretrained authorship models |
| Django | Slower API development than FastAPI for this use case |
| ArangoDB | Less community support than Neo4j for threat intelligence |

---

# 20. REQUIRED IMPROVEMENTS OVER EXISTING SOLUTIONS

| # | Current Situation | Required Improvement | Priority |
|---|------------------|---------------------|----------|
| 1 | Tools are siloed (5-6 separate tools) | Unified platform fusing all three attribution methods | **P0** |
| 2 | No autonomous stylometric tracking | Continuous AI-driven writing style fingerprinting | **P0** |
| 3 | Manual cross-referencing of identities | Automated entity resolution with confidence scoring | **P0** |
| 4 | OnionScan is one-shot, not continuous | Persistent scanning with historical comparison | **P1** |
| 5 | No confidence quantification | Bayesian confidence scoring across evidence types | **P1** |
| 6 | Reports generated manually | One-click export in CSV, JSON, formatted reports | **P1** |
| 7 | No timeline-based querying | Query actor activity across custom date ranges | **P2** |

---

# 21. IMPLEMENTATION PLAN

### Phase 1 — Problem Validation & Data Prep (Days 1-2)

- Generate synthetic dark web forum data (10 actors, 50+ posts each)
- Create mock .onion metadata with intentional misconfigurations
- Set up Bitcoin testnet wallets
- **Deliverable:** Synthetic dataset ready

### Phase 2 — Backend Core (Days 3-5)

- Set up FastAPI project structure
- Implement data ingestion pipeline
- Configure Neo4j schema (Actor, Handle, PGPKey, Wallet, Forum, Post nodes)
- Configure Elasticsearch index
- **Deliverable:** Working data pipeline

### Phase 3 — Three Analysis Pillars (Days 6-10)

- **Infrastructure Scanner:** Rule-based detectors for server-status, SSL cert extraction, CT log lookup
- **Identity Linker:** PGP fingerprint matching, handle correlation, wallet clustering
- **Stylometric Engine:** Fine-tune RoBERTa on synthetic data, implement embedding + cosine similarity matching
- **Deliverable:** All three analysis engines working independently

### Phase 4 — Entity Resolution & Confidence (Days 11-12)

- Implement weighted evidence fusion
- Build confidence scoring algorithm
- Neo4j graph merge logic
- **Deliverable:** Unified attribution pipeline

### Phase 5 — Frontend (Days 13-16)

- Dashboard with summary statistics
- Interactive graph visualization (vis.js)
- Timeline query interface
- Actor profile pages
- Export module (CSV, JSON, PDF report)
- **Deliverable:** Full analytical frontend

### Phase 6 — Integration & Testing (Days 17-18)

- End-to-end testing with synthetic data
- Performance optimization
- Security hardening (RBAC, encryption)
- **Deliverable:** Production-ready prototype

### Phase 7 — Demo Prep (Days 19-20)

- Create compelling demo scenario
- Record backup demo video
- Prepare presentation
- **Deliverable:** Demo-ready system

---

# 22. TEAM STRUCTURE (6-member team)

| Role | Person | Responsibilities |
|------|--------|-----------------|
| **Backend Lead** | Person 1 | FastAPI, data pipeline, API integrations (crt.sh, Shodan) |
| **ML Engineer** | Person 2 | Stylometric model (RoBERTa fine-tuning), entity resolution |
| **Frontend Lead** | Person 3 | React dashboard, graph visualization, export module |
| **Data/Graph Engineer** | Person 4 | Neo4j schema, Elasticsearch, synthetic data generation |
| **Security/Infra** | Person 5 | Docker setup, infrastructure scanner, encryption, RBAC |
| **Research/Product** | Person 6 | Domain research, demo script, presentation, documentation |

> Persons 1+4 can share backend responsibilities. Person 2 focuses exclusively on ML — it's the hardest part.

---

# 23. MVP

### If You Have Very Limited Time, Build EXACTLY This:

1. **Pre-loaded synthetic dataset** — 10 threat actors, 3 forums, 200 posts, intentional PGP/handle overlaps, 2 infrastructure misconfigurations
2. **Working stylometric engine** — Input 2 anonymous posts → output "82% same author"
3. **Working infrastructure scanner** — Input mock .onion metadata → output "SSL cert matches clearnet domain X"
4. **Working identity linker** — Input handle → show linked handles via PGP/wallet graph
5. **Graph visualization** — Interactive Neo4j-backed graph showing the relationship web
6. **Dashboard** — Summary stats, timeline slider, search bar, confidence badges
7. **Export** — One button → JSON/CSV download

### MVP Must Prove:

> "Given fragmented data across multiple dark web sources, our system automatically identifies that 3 apparently different actors are actually the same person, with 85% confidence, by combining infrastructure evidence, identity markers, and writing style analysis."

---

# 24. DEMO STRATEGY

### STEP 1: Show the Problem (30 sec)
"Here's a real scenario: Marketplace Alpha was taken down. Threat actor 'ShadowViper' disappeared. 3 months later, stolen Indian banking data appears on Marketplace Beta under 'PhoenixRise'. Are they the same person? Currently, investigators have NO automated way to know."

### STEP 2: Show Current Limitation (20 sec)
"Today, analysts manually search 5+ forums, cross-reference handles in spreadsheets, and guess. It takes 8-10 hours per actor with low confidence."

### STEP 3: Introduce SPECTRE (20 sec)
"SPECTRE does this in seconds, automatically, with quantified confidence."

### STEP 4: Live Demo — Input (20 sec)
Type "ShadowViper" into the search bar.

### STEP 5: System Processing (30 sec)
Show the three analysis engines running in parallel — infrastructure scan results, PGP match found, stylometric comparison.

### STEP 6: Show Intelligence (40 sec)
The **knowledge graph** lights up — ShadowViper, PhoenixRise, and a third handle "CryptoGhost" all merge into a single cluster. Show the evidence breakdown: PGP match (100%), writing style (91%), shared wallet (confirmed), infrastructure link (87%).

### STEP 7: Show Result (20 sec)
Actor profile page: unified view with all handles, all posts, all wallets, infrastructure links, timeline, **overall attribution confidence: 89%**.

### STEP 8: Export (10 sec)
One click → JSON report downloaded. Show the structured output.

### STEP 9: Impact (20 sec)
"What took 8-10 hours manually now takes under a minute. With higher accuracy and zero risk of missing connections."

### What Judges Should Remember

> *"These students built a system that fuses three independent de-anonymization techniques into a single graph with AI-driven confidence scoring — something no existing commercial tool does in a unified way."*

---

# 25. IMPACT

| Metric | Improvement |
|--------|-------------|
| **Investigation time** | 8-10 hours → under 5 minutes per actor (qualitative) |
| **Coverage** | Manual: 1-2 forums → Automated: 15+ forums simultaneously |
| **Connection discovery** | Human memory → Graph algorithms find non-obvious links |
| **Rebranded actor detection** | Near impossible manually → Automated via stylometry |
| **Evidence quality** | Subjective → Quantified confidence scores |
| **National security** | Faster attribution → faster response to dark web threats |

---

# 26. SCALABILITY

| Dimension | Prototype | Production |
|-----------|-----------|------------|
| **Actors tracked** | 10-50 | 100,000+ |
| **Forum posts** | 1,000 | 100M+ |
| **Neo4j nodes** | ~500 | 10M+ (needs clustering) |
| **ML inference** | CPU, batch | GPU cluster, real-time |
| **Crawling** | Simulated | Distributed Tor crawlers on Kubernetes |
| **Storage** | 10 GB | 10+ TB (MinIO/S3) |
| **Elasticsearch** | Single node | Multi-node cluster |

---

# 27. RISKS & CHALLENGES

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Stylometric model accuracy on short texts | High | High | Use character n-grams + deep learning ensemble; set minimum text length |
| Synthetic data not representative | Medium | High | Use Gwern archives + CrimeBB patterns as templates |
| Neo4j performance with large graphs | Low (MVP scale) | Medium | Proper indexing, pagination |
| Legal concerns about dark web data | Medium | High | Use ONLY synthetic data for demo; document legal framework |
| Judges unfamiliar with domain | Medium | Medium | Start demo with simple problem explanation |
| False positives in attribution | High | High | Confidence scoring + human-in-the-loop design |
| Demo failure (API downtime, etc.) | Medium | Critical | Pre-recorded backup demo, offline-capable MVP |

---

# 28. SIH COMPETITIVENESS

| Factor | Score | Reason |
|--------|-------|--------|
| Problem Impact | **9/10** | National security, directly addresses NTRO's mandate |
| Innovation | **8/10** | Novel fusion of three attribution methods |
| Technical Complexity | **9/10** | NLP, graph ML, distributed crawling, multiple databases |
| Feasibility | **6/10** | Ambitious scope — tight for hackathon |
| Scalability | **8/10** | Graph + Elasticsearch architecture scales well |
| Social Impact | **8/10** | Counter-terrorism, anti-crime |
| Government Value | **10/10** | NTRO posted it — they want exactly this |
| Data Availability | **5/10** | Real data restricted; synthetic viable for demo |
| Demo Strength | **8/10** | Graph visualization + confidence scoring is very visual |
| Uniqueness | **8/10** | No SIH team has likely built this fusion before |
| AI/Technology Depth | **9/10** | NLP + Graph ML + Entity Resolution |
| Implementation Difficulty | **8/10** | Multi-database, multi-model, complex integration |
| Judge Appeal | **8/10** | Intelligence domain is fascinating, visual demo |
| Differentiation | **8/10** | Three-pillar fusion is genuinely novel at student level |

### Honest Assessment

- **Is this a strong SIH problem?** Yes — NTRO is a prestigious organization and the problem is real.
- **Is it too difficult?** It's at the upper end of difficulty. The stylometric ML component requires genuine expertise.
- **Is it already solved?** No — not in a unified way. That's the opportunity.
- **Can a student team realistically build it?** Yes, with synthetic data and a focused MVP. The full production system would take months.
- **Is the demo likely to be impressive?** Very much yes — graph visualizations with confidence scores are inherently dramatic.
- **What competing teams could do better:** Teams with actual cybersecurity/dark web research experience could build a more realistic demo with better data.

---

# 29. WHY WOULD THIS SOLUTION WIN?

### Why Judges Might Select Us

- Directly addresses all three capabilities NTRO explicitly asked for
- Demonstrates genuine technical depth (NLP + Graph DB + entity resolution + confidence scoring)
- Visual demo is compelling (knowledge graph lighting up with connections)
- Clear improvement over existing fragmented tools
- Addresses a problem of clear national importance

### Why Judges Might Reject Us

- If the stylometric model isn't convincing on synthetic data
- If the demo breaks (complex system = more failure points)
- If the team can't explain the domain confidently
- If competing teams have more realistic data

### What Competitors Could Do Better

- Use pre-existing dark web datasets (CrimeBB via academic access)
- Focus on fewer features but with higher polish
- Include a working Tor crawler component (risky but impressive)

### Strongest Differentiator

> **The three-pillar fusion with confidence scoring.** No other student team will likely build a system that combines infrastructure scanning, identity graph resolution, AND AI stylometric analysis with a unified confidence score.

### What Should NOT Be Our Selling Point

- "We used blockchain" (blockchain is only marginally relevant for wallet tracing)
- "We used AI" (too generic — specify stylometric authorship attribution)

### Central Story

> *"Dark web actors rebrand, migrate, and hide — but they leave footprints in their infrastructure, their cryptographic keys, and their writing style. SPECTRE fuses all three into a single intelligence graph, turning fragmented clues into confident attribution."*

---

# 30. FINAL RECOMMENDATION

| Section | Summary |
|---------|---------|
| **THE PROBLEM** | Criminal actors hide behind Tor anonymity; investigators can't link personas to real-world identities |
| **THE REAL-WORLD PROBLEM** | Manual, slow, fragmented investigation process taking hours per actor with low confidence |
| **CURRENT SYSTEM** | Analysts manually use 5-6 siloed tools (OnionScan, Maltego, blockchain explorers, OSINT tools) |
| **EXISTING SOLUTIONS** | DarkOwl, Recorded Future, Flashpoint, OnionScan, Maltego, Chainalysis, SpiderFoot |
| **CLOSEST EXISTING SOLUTION** | Flashpoint (~30% PS coverage) — best actor tracking but no unified de-anonymization pipeline |
| **WHAT EXISTING SOLUTIONS DO WELL** | Individual aspects: data collection, graph analysis, blockchain tracing |
| **WHAT THEY CANNOT DO** | Fuse all three attribution methods autonomously with confidence scoring |
| **CORE GAP** | No unified system that combines infrastructure attribution + identity graph + AI stylometry |
| **OUR OPPORTUNITY** | Build the fusion layer that connects these three pillars |
| **PROPOSED SOLUTION** | SPECTRE — autonomous multi-pillar dark web de-anonymization platform |
| **KEY FEATURES** | Infrastructure scanner, identity linker, stylometric engine, knowledge graph, dashboard, export |
| **REQUIRED DATA** | Synthetic (for MVP) + CrimeBB (ideal) + CT logs + Shodan + blockchain APIs |
| **REQUIRED TECHNOLOGY** | React, FastAPI, Neo4j, Elasticsearch, PostgreSQL, PyTorch/HuggingFace, Docker |
| **ARCHITECTURE** | Three-pillar analysis engine → Entity resolution → Neo4j graph → React dashboard |
| **IMPLEMENTATION** | 20-day plan, 6-person team, phased delivery |
| **MVP** | 10 synthetic actors, working stylometry, graph visualization, confidence scoring, export |
| **KEY IMPROVEMENTS** | Unified pipeline, automated entity resolution, AI persona linking, confidence quantification |
| **INNOVATION** | Three-pillar fusion with probabilistic confidence scoring |
| **BIGGEST RISK** | Stylometric model accuracy on short/synthetic texts |
| **SIH POTENTIAL** | Very high — prestigious org, real gap, technically impressive, visual demo |

### FINAL VERDICT

## 🟢 HIGHLY RECOMMENDED

This PS is a **top-tier SIH choice** for your team:

1. **Genuine gap exists** — No tool unifies all three attribution methods
2. **NTRO is prestigious** — Judges will take it seriously
3. **Technically deep** — NLP + graphs + multi-database architecture demonstrates real engineering
4. **Visually demonstrable** — Knowledge graphs with confidence scores make compelling demos
5. **Team-skill fit** — Your full-stack + ML skills directly apply (React frontend + Python ML backend)

**Conditions for success:**
- Invest heavily in synthetic data quality — your demo is only as good as your data
- The ML engineer must prioritize the stylometric model — it's the "wow" factor
- Keep a backup demo recorded in case of live failures
- Practice the domain explanation — judges need to understand the problem before they can appreciate the solution

---

# 31. FINAL ONE-PAGE SUMMARY

| Field | Value |
|-------|-------|
| **PS** | 26151 — Dark web threat actor de-anonymization (NTRO) |
| **Problem** | Criminal actors hide behind Tor anonymity; current attribution is manual, slow, and fragmented |
| **Current Situation** | Analysts use 5-6 separate tools manually, 8-10 hours per actor, low confidence |
| **Existing Solutions** | DarkOwl, Recorded Future, Flashpoint, OnionScan, Maltego, Chainalysis, SpiderFoot |
| **Closest Existing Tool** | Flashpoint (~30% coverage) — no unified de-anonymization pipeline |
| **Main Gap** | No system fuses infrastructure + identity + AI stylometric attribution with confidence scoring |
| **Target Users** | NTRO intelligence analysts, law enforcement investigators |
| **What We Should Build** | SPECTRE — autonomous three-pillar de-anonymization platform with knowledge graph |
| **Why Existing Solutions Are Not Enough** | They're siloed tools solving individual aspects, not a unified attribution engine |
| **Main Innovation** | Fusing infrastructure misconfig detection + cross-platform identity resolution + AI stylometric analysis into a single confidence-scored knowledge graph |
| **Required Technology** | React, FastAPI, Neo4j, Elasticsearch, PostgreSQL, PyTorch (RoBERTa), Docker |
| **Required Data** | Synthetic data for MVP; CrimeBB for ideal; CT logs, Shodan, blockchain APIs |
| **Important APIs** | crt.sh, Shodan, Blockchair, HaveIBeenPwned, PGP keyservers |
| **MVP** | 10 synthetic actors, 3 analysis engines, graph visualization, confidence scoring, export |
| **Implementation Difficulty** | High (8/10) — multi-model, multi-database, complex domain |
| **Main Risk** | Stylometric accuracy on short/synthetic texts |
| **SIH Potential** | Very High — prestigious org, real gap, technically impressive |
| **Final Verdict** | 🟢 **HIGHLY RECOMMENDED** |
