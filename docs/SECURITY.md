# Security & Evidence Integrity Policy (SECURITY.md)
## Law Enforcement Grade Protection, OpSec & Legal Chain of Custody
**Project:** Sudarshan (ShadowGraph) | **Standard:** Section 65B Indian Evidence Act Compliant

---

## 1. Threat Model & Operational Security (OpSec)
Sudarshan handles sensitive dark web threat intelligence, target actor pseudonyms, and digital evidence. The security architecture addresses three primary threat vectors:
1. **Malicious Content Execution:** Hostile dark web sites returning exploit payloads, weaponized JavaScript, or zero-day browser exploits in scraped HTML.
2. **Evidence Tampering & Chain-of-Custody Compromise:** Unauthorized manipulation or spoliation of forensic digital evidence prior to courtroom introduction.
3. **Analyst De-Anonymization / Intelligence Leakage:** Direct network leakage exposing the investigating officer's clearnet IP address during dark web exploration.

---

## 2. Authentication & Session Management
- **Single-Role Model:** Only authorized users with role `analyst` can access the platform.
- **Password Security:** Passwords hashed using **Argon2id** (minimum time cost 2, memory 64MB, parallelism 1).
- **Mandatory 2FA (TOTP):** 
  - Standard RFC 6238 Time-Based One-Time Password generated via `pyotp`.
  - Operates 100% offline without requiring third-party SMS or email gateways.
  - Secret key encrypted at rest in the database using AES-256-GCM.
- **JWT Lifecycles & Rotation:**
  - Access Token: Maximum **15 minutes** lifespan.
  - Refresh Token: Stored strictly in `HttpOnly`, `SameSite=Strict`, `Secure` cookies with automatic rotation on each refresh.
- **Brute-Force & Lockout Policy:**
  - 5 consecutive failed authentication attempts enforce an immediate **15-minute account lockout**.
  - Rate limiting enforced via Redis: maximum 10 login attempts per IP per 10-minute window.

---

## 3. Safe Dark Web Content Handling & Ingestion
- **Strict Text-Only Parsing:** Dark web HTML responses are parsed exclusively as sanitized text strings. Never render raw HTML with `dangerouslySetInnerHTML` in the React frontend.
- **No Remote Asset Fetching:** The ingestion crawler blocks automatic download of external JavaScript files, web fonts, or embedded iframes.
- **Isolated Crawler Execution:** All Tor network requests execute within a separate Docker container running without root privileges, communicating strictly through the Tor SOCKS5 proxy (`socks5h://127.0.0.1:9050`).
- **No Direct Outbound Clearnet Connections from Crawler:** The scraper container is network-isolated such that outbound traffic can only traverse the Tor SOCKS5 daemon.

---

## 4. Digital Evidence Integrity (Section 65B Compliance)
To ensure all exported dossiers are admissible under **Section 65B of the Indian Evidence Act**:
1. **Intake Hashing:** Immediately upon retrieval from the Tor network or archive dump, the raw byte payload of the source document is hashed using **SHA-256**.
2. **Cryptographic Binding:** The document record permanently couples:
   - `content`: Raw text content
   - `sha256`: Hexadecimal SHA-256 digest
   - `url_or_ref`: Source `.onion` URI or archive file identifier
   - `collected_at`: UTC timestamp calibrated against NIST time standard
3. **Report Verification:** Every generated PDF and STIX JSON dossier contains the SHA-256 hashes of all underlying source documents and is itself sealed with an overarching report SHA-256 checksum.
4. **Tamper-Evident Audit Logging:** All user actions (searches, entity views, link confirmations, dossier exports) are logged into an append-only `audit_logs` table. Database permissions prevent `UPDATE` or `DELETE` queries on the audit table.

---

## 5. Input Validation & Defense-in-Depth
- **Strict Schema Enforcement:** All API endpoints validate request parameters via Pydantic v2 schemas before execution.
- **SQL & Cypher Injection Prevention:**
  - PostgreSQL: 100% parameterized queries using SQLAlchemy 2.0 ORM. Zero raw string concatenation.
  - Neo4j: All graph queries use Cypher parameterized arguments (`$param`).
- **Security Headers (Reverse Proxy):**
  - `add_header X-Frame-Options "DENY" always;`
  - `add_header X-Content-Type-Options "nosniff" always;`
  - `add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';" always;`
  - `add_header Referrer-Policy "strict-origin-when-cross-origin" always;`
- **Environment Secrets:** Zero secrets committed to Git. All API keys, database credentials, and JWT signing keys are loaded strictly from the environment (`.env`).
