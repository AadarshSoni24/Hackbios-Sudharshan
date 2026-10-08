# Database Architecture & Schemas (DATABASE.md)
## Relational PostgreSQL 16 & Neo4j 5 Community Graph Models
**Project:** Sudarshan (ShadowGraph) | **SIH 2026**

---

## 1. Storage Architecture Overview
Sudarshan utilizes a dual-database model:
1. **PostgreSQL 16 (Source of Truth):** Enforces ACID transactions, manages user authentication, stores ingested raw dark web documents, maintains immutable SHA-256 audit logs, and handles full-text search.
2. **Neo4j 5 Community (Attribution Graph):** In-memory graph database storing entities and multi-hop relationships (`Actor -> Wallet -> HiddenService -> ClearnetHost`). Rebuilt/updated from PostgreSQL via the Graph Fusion job.

---

## 2. PostgreSQL Relational Schemas

```sql
-- 1. Users Table (Single Role: analyst)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'analyst' CHECK (role IN ('analyst')),
    totp_secret_enc VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'LOCKED')),
    failed_logins INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Threat Intel Sources
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('FORUM', 'MARKET', 'ARCHIVE_DUMP', 'SYNTHETIC')),
    origin_badge VARCHAR(30) NOT NULL CHECK (origin_badge IN ('SYNTHETIC', 'ARCHIVE', 'LIVE_AUTHORIZED')),
    base_url TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Raw Ingested Documents (With Cryptographic Integrity)
CREATE TABLE raw_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    url_or_ref TEXT NOT NULL,
    content TEXT NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_raw_docs_sha256 ON raw_documents(sha256);
CREATE INDEX idx_raw_docs_collected_at ON raw_documents(collected_at);

-- 4. Extracted Entities / Indicators
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES raw_documents(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('HANDLE', 'PGP_KEY', 'PGP_FINGERPRINT', 'WALLET_BTC', 'WALLET_ETH', 'WALLET_XMR', 'EMAIL', 'ONION_URL', 'CLEANET_IP', 'CERT_SERIAL')),
    value TEXT NOT NULL,
    posted_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_entities_type_value ON entities(type, value);

-- 5. Threat Actors Profile
CREATE TABLE actors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_handle VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('RANSOMWARE', 'DATA_LEAKS', 'FINANCIAL_FRAUD', 'NARCOTICS', 'EXPLOIT_VENDOR', 'UNKNOWN')),
    risk_level VARCHAR(20) DEFAULT 'MEDIUM' CHECK (risk_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    first_seen TIMESTAMP WITH TIME ZONE NOT NULL,
    last_scan_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_actors_handle ON actors(display_handle);

-- 6. Actor to Identifier Mapping
CREATE TABLE actor_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(actor_id, entity_id)
);

-- 7. Infrastructure Findings (Misconfigurations)
CREATE TABLE infra_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    onion_address VARCHAR(100) NOT NULL,
    finding_type VARCHAR(50) NOT NULL CHECK (finding_type IN ('EXACT_CERT_MATCH', 'SERVER_BANNER_LEAK', 'FAVICON_HASH_MATCH', 'STATUS_PAGE_EXPOSE')),
    cert_sha256 VARCHAR(64) NULL,
    banner TEXT NULL,
    candidate_host VARCHAR(100) NOT NULL,
    strength VARCHAR(20) NOT NULL CHECK (strength IN ('STRONG', 'MEDIUM', 'WEAK')),
    source_id UUID NOT NULL REFERENCES sources(id),
    found_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Correlation Links (Attribution Edges)
CREATE TABLE correlation_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_a UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    actor_b UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    vector VARCHAR(20) NOT NULL CHECK (vector IN ('V1_IDENTIFIERS', 'V2_INFRASTRUCTURE', 'V3_STYLOMETRY')),
    evidence_json JSONB NOT NULL,
    strength NUMERIC(4, 3) NOT NULL CHECK (strength >= 0.0 AND strength <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Attribution Scores & Review Queue
CREATE TABLE attribution_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_a UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    actor_b UUID NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    score NUMERIC(4, 3) NOT NULL CHECK (score >= 0.0 AND score <= 1.0),
    band VARCHAR(20) NOT NULL CHECK (band IN ('HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(20) DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED', 'CONFIRMED', 'REJECTED')),
    reviewed_by UUID NULL REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(actor_a, actor_b)
);

-- 10. Ingestion Scan Jobs
CREATE TABLE scan_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(30) NOT NULL CHECK (type IN ('TOR_CRAWL', 'ARCHIVE_LOADER', 'CORRELATION_PASS')),
    status VARCHAR(20) DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE NULL,
    counts_json JSONB DEFAULT '{}'::jsonb
);

-- 11. Generated Reports (Section 65B Dossiers)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_reference VARCHAR(50) UNIQUE NOT NULL,
    actor_ids UUID[] NOT NULL,
    format VARCHAR(10) NOT NULL CHECK (format IN ('PDF', 'JSON', 'CSV')),
    file_path TEXT NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Immutable Chain-of-Custody Audit Log
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Neo4j Graph Model

### Node Labels
- `:Actor` (`id`, `handle`, `category`, `risk`)
- `:Wallet` (`address`, `currency`)
- `:PGPKey` (`fingerprint`, `key_id`, `created_date`)
- `:Email` (`address`)
- `:HiddenService` (`onion_address`)
- `:Certificate` (`sha256`, `serial`)
- `:ClearnetHost` (`ip_or_domain`)
- `:Source` (`name`, `origin_badge`)

### Relationship Types
- `(:Actor)-[:USED_WALLET]->(:Wallet)`
- `(:Actor)-[:HAS_PGP]->(:PGPKey)`
- `(:Actor)-[:HAS_EMAIL]->(:Email)`
- `(:Actor)-[:POSTED_ON]->(:HiddenService)`
- `(:HiddenService)-[:HAS_CERT]->(:Certificate)`
- `(:Certificate)-[:HAS_ORIGIN_CANDIDATE]->(:ClearnetHost)`
- `(:Actor)-[:ALIAS_OF {score: 0.85, status: 'CONFIRMED'}]->(:Actor)`

---

## 4. Ground-Truth Seed Dataset (M18)
The database seeds with 10 synthetic actors designed to prove the three vectors:
1. **`DarkVendor_01` & `CryptGhost`:** Share common PGP Fingerprint (`9A4F...`). Demonstrates Vector 1.
2. **`Shadow99` & `SilkRouteX`:** Share multi-input Bitcoin wallet (`1BoatSLR...`). Demonstrates Vector 1.
3. **`PhantomOp` & `NeonSpectre`:** One rebranded persona sharing identical stylometric baseline (sentence length, high Yule's K, slang usage). Demonstrates Vector 3.
4. **`ApexLeaks` (Hidden Service):** Leaks self-signed SSL certificate matching clearnet host `185.220.101.5`. Demonstrates Vector 2.
5. **`DecoyUserA` & `DecoyUserB`:** Standalone actors with zero overlaps to verify the engine does not produce false positives.
