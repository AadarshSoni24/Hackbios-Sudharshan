# Testing & Honest Evaluation Matrix (TESTING.md)
## Automated Unit Tests, Ground-Truth Benchmarks & Pre-Demo Verification
**Project:** Sudarshan (ShadowGraph) | **SIH 2026**

---

## 1. Testing Philosophy
In adherence to the **Honest Claims Policy**, no accuracy or performance figures will be claimed in presentation slides or live demonstrations unless directly measured and recorded by this evaluation test suite.

---

## 2. Automated Test Matrix

| Test Suite | File Path | Scope Tested | Target Pass Criteria |
| :--- | :--- | :--- | :--- |
| **Extractor Unit Tests** | `tests/test_extractors.py` | Regex parsing for BTC, ETH, XMR, PGP blocks, emails | 100% pass on 50 test strings |
| **PGP Parser Tests** | `tests/test_pgp_parser.py` | PGPy extraction of user IDs and key fingerprints | Valid fingerprint on all test keys |
| **Scoring Engine Tests** | `tests/test_scoring.py` | Heuristic weight calculation and band assignment | Score strictly between 0.0 and 1.0 |
| **Auth & Lockout Tests** | `tests/test_auth.py` | TOTP verification, JWT expiry, 5-failure lockout | Account locked after 5 failed attempts |
| **API Route Tests** | `tests/test_api.py` | CRUD endpoints for actors, links, graph, reports | 200 OK with valid JSON envelope |
| **Graph Fusion Tests** | `tests/test_graph_fusion.py` | Synchronization from PostgreSQL to Neo4j | Edges correctly created upon link confirmation |

---

## 3. Ground-Truth Synthetic Benchmark (M18 / M19)

### Evaluation Dataset Composition
The benchmark operates against 10 controlled synthetic actor profiles containing known planted linkages:
- **Planted Link 1 (Vector 1 - PGP):** `DarkVendor_01` and `CryptGhost` share PGP Key `9A4F...`
- **Planted Link 2 (Vector 1 - Crypto):** `Shadow99` and `SilkRouteX` share multi-input Bitcoin address `1BoatSLR...`
- **Planted Link 3 (Vector 3 - Stylometry):** `PhantomOp` and `NeonSpectre` share linguistic markers and diurnal posting profiles.
- **Planted Link 4 (Vector 2 - Infra):** `ApexLeaks` onion service shares SSL certificate with clearnet IP `185.220.101.5`.
- **Decoy Set (Negative Controls):** `DecoyUserA`, `DecoyUserB`, `DecoyUserC` have zero connections to any actor.

### Benchmark Execution Command
```bash
pytest tests/test_benchmark.py -v --tb=short
```

### Measured Metric Definitions
$$	ext{Precision} = \frac{\text{True Positive Proposed Links}}{\text{Total Proposed Links}}$$

$$	ext{Recall} = \frac{\text{True Positive Proposed Links}}{\text{Total Planted True Links}}$$

*Reporting Rule:* During jury questions regarding attribution accuracy, state:
> *"On our controlled synthetic ground-truth test suite of 10 actors and 4 planted relationships, Sudarshan achieved a measured Precision of X% and Recall of Y% with zero false links proposed for negative decoy actors."*

---

## 4. Pre-Demo Verification Checklist (Day of Evaluation)
Complete this checklist 30 minutes before presentation:
- [ ] **Wi-Fi Independence:** Turn off laptop Wi-Fi; verify all 10 pages load locally on `localhost:3000` and `localhost:8000`.
- [ ] **Database Seed Check:** Execute `make seed` or run `scripts/seed_ground_truth.py` to ensure fresh, clean test state.
- [ ] **Docker Containers Healthy:** Verify `docker compose ps` shows all containers `Up (healthy)`.
- [ ] **Sample Dossier Pre-Compiled:** Verify PDF export generates in under 4 seconds.
- [ ] **Clear Browser Cache:** Open dashboard in clean browser session to ensure fast initial page load.
