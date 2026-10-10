from app.models.database import SessionLocal, Base, engine, User, Actor, Entity, InfraFinding, CorrelationLink, AuditLog, CaseDossier
from datetime import datetime, timezone

def initialize_seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(Actor).count() > 0:
        db.close()
        return

    # 1. Admin Officer
    admin_user = User(
        username="officer_sharma",
        badge_number="NTRO-INV-4091",
        role="analyst",
        password_hash="argon2id$v=19$m=65536,t=2,p=1$mock_hash_authorized",
        status="ACTIVE"
    )
    db.add(admin_user)

    # 2. Ten Synthetic Ground-Truth Actors (M18)
    actors_data = [
        ("Shadow99", "RANSOMWARE", "CRITICAL", 0.91, "Linked to LockBit 3.0 source code leaks and darknet extortion forums."),
        ("SilkRouteX", "DATA_LEAKS", "HIGH", 0.82, "Vendor selling compromised corporate databases and payment credentials."),
        ("DarkVendor_01", "EXPLOIT_VENDOR", "HIGH", 0.88, "Zero-day broker advertising ICS/SCADA vulnerabilities on Russian forums."),
        ("CryptGhost", "FINANCIAL_FRAUD", "HIGH", 0.79, "Cryptocurrency tumbler operator managing cross-chain laundering pipelines."),
        ("PhantomOp", "APT_PERSISTENT", "CRITICAL", 0.94, "State-sponsored cyber espionage operator targeting Indian critical infrastructure."),
        ("NeonSpectre", "REBRANDED_PERSONA", "MEDIUM", 0.65, "Rebranded handle migrating after forum seizure; matched via stylometric syntax."),
        ("ApexLeaks", "INFRA_OPERATOR", "HIGH", 0.85, "Hidden service operator maintaining leak publication sites."),
        ("DecoyAlpha", "UNKNOWN", "LOW", 0.15, "Standard darknet chatter; no high-risk indicators or linkages detected."),
        ("DecoyBeta", "UNKNOWN", "LOW", 0.12, "Casual forum member posting software tutorial queries."),
        ("DecoyGamma", "UNKNOWN", "LOW", 0.18, "Unverified escrow user with zero cryptographic overlaps.")
    ]

    actor_objs = {}
    for handle, cat, risk, conf, notes in actors_data:
        act = Actor(
            display_handle=handle,
            category=cat,
            risk_level=risk,
            confidence_score=conf,
            origin_badge="SYNTHETIC",
            notes=notes
        )
        db.add(act)
        db.flush()
        actor_objs[handle] = act

    # 3. Identifiers & Indicators
    entities_data = [
        # Shadow99
        (actor_objs["Shadow99"].id, "WALLET_BTC", "1BoatSLR2mWMbt2kXNxC5v7gC28b96F", "Ransom payment address listed in Dread paste"),
        (actor_objs["Shadow99"].id, "WALLET_ETH", "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "Deposit wallet linked to extortion ransom"),
        (actor_objs["Shadow99"].id, "PGP_FINGERPRINT", "C543 B901 7892 ADEF 1120 4490 281A 90FE B78A 9901", "Primary signing key on Torum"),
        # SilkRouteX (Shares BTC wallet with Shadow99 - Vector 1)
        (actor_objs["SilkRouteX"].id, "WALLET_BTC", "1BoatSLR2mWMbt2kXNxC5v7gC28b96F", "Multi-input co-spend transaction cluster match"),
        (actor_objs["SilkRouteX"].id, "EMAIL", "silkroutex_ops@proton.me", "Contact email published on marketplace listing"),
        # DarkVendor_01
        (actor_objs["DarkVendor_01"].id, "PGP_FINGERPRINT", "9A4F 88C1 204B EC90 5512 8820 410A 773B CD49 1042", "Exploit catalog verification key"),
        (actor_objs["DarkVendor_01"].id, "WALLET_XMR", "888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkFxbANsAnJYPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H", "Direct XMR escrow account"),
        # CryptGhost (Shares PGP key with DarkVendor_01 - Vector 1)
        (actor_objs["CryptGhost"].id, "PGP_FINGERPRINT", "9A4F 88C1 204B EC90 5512 8820 410A 773B CD49 1042", "Identical PGP key uploaded to clearnet keyserver"),
        (actor_objs["CryptGhost"].id, "WALLET_ETH", "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE", "Known Binance KYC hot-wallet deposit"),
        # PhantomOp & NeonSpectre
        (actor_objs["PhantomOp"].id, "EMAIL", "phantom_opsec@mail2tor.com", "Encrypted mail forwarder"),
        (actor_objs["NeonSpectre"].id, "ONION_URL", "neonspec7298jkwlw7281909jka891823908123981298312893812839.onion", "Personal blog portal")
    ]

    for a_id, e_type, val, ctx in entities_data:
        ent = Entity(actor_id=a_id, type=e_type, value=val, raw_context=ctx)
        db.add(ent)

    # 4. Infrastructure Findings (Vector 2 Misconfigurations)
    infra_data = [
        ("apexleaks478291048123908129038102938109283109283019283012.onion", "EXACT_CERT_MATCH", "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3", "Nginx/1.24.0 (Ubuntu)", "185.220.101.5", "STRONG"),
        ("shadowmarket991209381029381029381029381029381029381029381029.onion", "SERVER_BANNER_LEAK", "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d", "Apache/2.4.52 (Unix) OpenSSL/1.1.1m", "194.26.29.112", "STRONG"),
        ("darktumbler887192830192830192830192830192830192830192830192.onion", "FAVICON_HASH_MATCH", None, "Python/3.10 aiohttp/3.8.4", "45.154.255.89", "MEDIUM")
    ]
    for onion, f_type, cert, banner, host, strg in infra_data:
        inf = InfraFinding(
            onion_address=onion,
            finding_type=f_type,
            cert_sha256=cert,
            banner=banner,
            candidate_host=host,
            strength=strg,
            status="CONFIRMED"
        )
        db.add(inf)

    # 5. Correlation Links (Attribution Edges)
    links_data = [
        # Link 1: Shadow99 <-> SilkRouteX (Shared Bitcoin Wallet)
        (actor_objs["Shadow99"].id, actor_objs["SilkRouteX"].id, "V1_IDENTIFIERS", "Multi-input transaction co-spend: Shared BTC wallet [1BoatSLR2mWMbt2kXNxC5v7gC28b96F]", 0.88, 0.88, "HIGH", "CONFIRMED"),
        # Link 2: DarkVendor_01 <-> CryptGhost (Shared PGP Fingerprint)
        (actor_objs["DarkVendor_01"].id, actor_objs["CryptGhost"].id, "V1_IDENTIFIERS", "Exact PGP Public Key Fingerprint match [9A4F 88C1 ... CD49 1042] across exploit forum & carding portal", 0.92, 0.92, "HIGH", "CONFIRMED"),
        # Link 3: PhantomOp <-> NeonSpectre (Stylometric Writing Match)
        (actor_objs["PhantomOp"].id, actor_objs["NeonSpectre"].id, "V3_STYLOMETRY", "MiniLM sentence embedding cosine similarity: 0.84. Identical punctuation cadence, Yule's K vocabulary richness, and diurnal posting hours (UTC+05:30).", 0.74, 0.74, "MEDIUM", "PROPOSED"),
        # Link 4: Shadow99 <-> ApexLeaks (Infrastructure / Server leak)
        (actor_objs["Shadow99"].id, actor_objs["ApexLeaks"].id, "V2_INFRASTRUCTURE", "Tor hidden service SSL certificate matches origin clearnet IP [185.220.101.5] registered to same ASN.", 0.78, 0.78, "HIGH", "CONFIRMED")
    ]
    for a_id, b_id, vec, ev, st, sc, band, stat in links_data:
        lnk = CorrelationLink(
            actor_a_id=a_id,
            actor_b_id=b_id,
            vector=vec,
            evidence_text=ev,
            strength=st,
            score=sc,
            band=band,
            status=stat
        )
        db.add(lnk)

    # 6. Audit Logs
    audit_data = [
        ("NTRO-INV-4091", "SYSTEM_INITIALIZE", "System Boot", "127.0.0.1"),
        ("NTRO-INV-4091", "INGEST_ARCHIVE", "DarkWeb_Sanitized_Corpus_v1", "127.0.0.1"),
        ("NTRO-INV-4091", "CORRELATION_PASS", "Ground_Truth_Clustering_M18", "127.0.0.1"),
        ("NTRO-INV-4091", "CONFIRM_LINK", "Shadow99 <-> SilkRouteX", "127.0.0.1")
    ]
    for officer, act, tgt, ip in audit_data:
        log = AuditLog(officer_badge=officer, action=act, target_entity=tgt, ip_address=ip)
        db.add(log)

    # 7. Sample Case Dossier
    sample_dossier = CaseDossier(
        case_reference="NTRO-DW-2026-004",
        title="Operation Trishul — Threat Actor Shadow99 Financial & Infrastructure Attribution",
        target_actor_id=actor_objs["Shadow99"].id,
        evidence_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status="OPEN"
    )
    db.add(sample_dossier)

    db.commit()
    db.close()
    print("Database seeded with 10 synthetic ground-truth threat actors and correlation links!")
