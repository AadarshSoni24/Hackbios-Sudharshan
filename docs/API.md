# API Specification (API.md)
## RESTful Endpoints, Request/Response Envelopes & Error Contracts
**Base URL:** `http://localhost:8000/api/v1` | **Version:** 1.0.0 | **Documentation:** `/docs` (OpenAPI 3.0)

---

## 1. Global Conventions

### Authentication
Protected endpoints require an authorized Bearer JWT token in the request header:
```http
Authorization: Bearer <access_token>
```

### Standard Response Envelope
All API responses return a structured JSON envelope:
```json
{
  "success": true,
  "data": { },
  "meta": {
    "timestamp": "2026-10-05T22:00:00Z",
    "request_id": "req_abc123"
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "Threat actor with ID 'act_99' does not exist.",
    "details": null
  },
  "meta": {
    "timestamp": "2026-10-05T22:00:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## 2. Core API Endpoints

### 2.1 Authentication (`/auth`)
- `POST /auth/login`
  - Input: `{ "username": "analyst_01", "password": "SecurePassword123!" }`
  - Response: `{ "temp_session_token": "tmp_xyz", "mfa_required": true }`
- `POST /auth/totp/verify`
  - Input: `{ "temp_session_token": "tmp_xyz", "totp_code": "849201" }`
  - Response: `{ "access_token": "jwt_...", "token_type": "bearer", "expires_in": 900 }` (Cookie: `refresh_token`)
- `POST /auth/refresh`
  - Response: `{ "access_token": "jwt_new..." }`
- `POST /auth/logout`
  - Response: `{ "message": "Successfully logged out." }`

### 2.2 Threat Actors (`/actors`)
- `GET /actors?category=RANSOMWARE&page=1&page_size=20`
  - Returns paginated list of threat actors with confidence bands and origin badges.
- `GET /actors/{id}`
  - Returns deep dossier: identifiers, associated wallets, PGP fingerprints, and candidate persona linkages.
- `PATCH /actors/{id}`
  - Input: `{ "notes": "Investigator tag: Op Trident target" }`

### 2.3 Attribution & Graph Canvas (`/graph`)
- `GET /graph/data?depth=2&min_confidence=0.40`
  - Returns nodes and edges formatted for Cytoscape.js / `react-force-graph-2d`.
- `GET /graph/actor/{id}?depth=1`
  - Returns localized 1-hop subgraph centered on the target actor.
- `GET /graph/path?from={actor_a}&to={actor_b}`
  - Calculates shortest evidence path linking two distinct personas.

### 2.4 Persona Review Queue (`/links`)
- `GET /links?status=PROPOSED&band=HIGH`
  - Returns candidate linkages pending human analyst review.
- `POST /links/{id}/confirm`
  - Changes link status to `CONFIRMED`. Triggers Neo4j graph update with `ALIAS_OF` edge.
- `POST /links/{id}/reject`
  - Input: `{ "rejection_reason": "Known shared public burner wallet" }`
  - Changes link status to `REJECTED`.

### 2.5 Infrastructure Findings (`/infra`)
- `GET /infra/findings`
  - Returns table of dark web server misconfigurations (SSL certificate leaks, banners, clearnet host IPs).

### 2.6 Crawler & Ingestion Management (`/jobs`)
- `POST /jobs/ingest`
  - Input: `{ "target_url": "http://example...onion", "max_depth": 1, "max_pages": 10, "delay": 2.0 }`
  - Starts asynchronous Celery ingestion job. Returns `{ "job_id": "job_123" }`.
- `GET /jobs/{id}`
  - Returns real-time job progress (status, pages crawled, entities found).

### 2.7 Search & Timeline (`/search`)
- `GET /search?q=1BoatSLR...&from=2026-01-01&to=2026-10-01`
  - Executes full-text and identifier match across all collected documents.

### 2.8 Reports & Legal Dossiers (`/reports`)
- `POST /reports`
  - Input: `{ "case_reference": "NTRO-DW-2026-009", "actor_ids": ["uuid-1", "uuid-2"], "format": "PDF" }`
  - Generates Section 65B court-admissible PDF dossier with SHA-256 evidence seals.
- `GET /reports/{id}/download?format=pdf`
  - Streams binary PDF file.

### 2.9 System & Audit (`/system`)
- `GET /system/health`
  - Returns health check for FastAPI, PostgreSQL, Neo4j, Redis, and Tor SOCKS5 daemon.
- `GET /system/audit?page=1&page_size=50`
  - Returns immutable officer activity logs.
