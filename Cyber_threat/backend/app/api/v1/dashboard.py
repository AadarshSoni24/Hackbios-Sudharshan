from fastapi import APIRouter
from app.api.v1.graph import MOCK_GRAPH_DB

router = APIRouter(tags=["Dashboard UI Data"])

@router.get("/actors")
def get_actors():
    actors = []
    for node in MOCK_GRAPH_DB.get("nodes", []):
        if node.get("type") == "actor":
            # Try to find a connected wallet and pgp key from edges
            wallet = None
            pgp = None
            for edge in MOCK_GRAPH_DB.get("edges", []):
                if edge["source"] == node["id"]:
                    target_node = next((n for n in MOCK_GRAPH_DB["nodes"] if n["id"] == edge["target"]), None)
                    if target_node:
                        if target_node["type"] == "wallet":
                            wallet = target_node["label"]
                        elif target_node["type"] == "pgp":
                            pgp = target_node["label"]
            
            actors.append({
                "id": node["id"],
                "handle": node["label"],
                "risk_level": "CRITICAL" if wallet and pgp else "HIGH",
                "category": "RANSOMWARE" if wallet else "DATA_LEAKS",
                "primary_wallet": wallet,
                "pgp_fingerprint": pgp,
                "confidence_score": 0.94 if pgp else 0.82
            })
    
    # Add some static ones if empty to show the UI
    if not actors:
        actors = [
            {
                "id": "shadow99", "handle": "Shadow99", "risk_level": "CRITICAL", 
                "category": "RANSOMWARE", "primary_wallet": "1BoatSLR2mMmb...", 
                "pgp_fingerprint": "C543 B981 7892...", "confidence_score": 0.91
            },
            {
                "id": "silkroutex", "handle": "SilkRouteX", "risk_level": "HIGH", 
                "category": "DATA_LEAKS", "primary_wallet": "1BoatSLR2mMmb...", 
                "pgp_fingerprint": None, "confidence_score": 0.82
            }
        ]

    return {"success": True, "data": actors}

@router.get("/links")
def get_links():
    return {
        "success": True,
        "data": [
            {
                "id": "link1", "actor_a": {"handle": "Shadow99"}, "actor_b": {"handle": "SilkRouteX"},
                "vector": "V1_IDENTIFIERS", "score": 0.88, "band": "HIGH", "status": "CONFIRMED",
                "evidence": "Multi-input transaction co-spend: Shared BTC wallet [1BoatSL...]"
            },
            {
                "id": "link2", "actor_a": {"handle": "PhantomOp"}, "actor_b": {"handle": "NeonSpectre"},
                "vector": "V3_STYLOMETRY", "score": 0.74, "band": "MEDIUM", "status": "PROPOSED",
                "evidence": "MiniLM sentence embedding cosine similarity: 0.84. Identical punctuation cadence."
            }
        ]
    }

@router.post("/links/{link_id}/{action}")
def action_link(link_id: str, action: str):
    return {"success": True, "message": f"Link {link_id} {action}ed."}

@router.get("/infra/findings")
def get_infra_findings():
    findings = []
    # Dynamic IP findings
    for node in MOCK_GRAPH_DB.get("nodes", []):
        if node.get("type") == "ip":
            findings.append({
                "id": f"infra_{node['id']}",
                "onion_address": "darkmarket3920...",
                "finding_type": "SERVER_BANNER_LEAK",
                "banner": "Nginx/1.24.0 (Ubuntu)",
                "candidate_host": node["label"],
                "strength": "STRONG"
            })
            
    if not findings:
        findings = [
            {
                "id": "i1", "onion_address": "apexleaks478...", "finding_type": "EXACT_CERT_MATCH",
                "banner": "Nginx/1.24.0 (Ubuntu)", "candidate_host": "185.220.101.5", "strength": "STRONG"
            },
            {
                "id": "i2", "onion_address": "darktumbler887...", "finding_type": "FAVICON_HASH_MATCH",
                "banner": "Python/3.10 aiohttp", "candidate_host": "45.154.255.89", "strength": "MEDIUM"
            }
        ]
    return {"success": True, "data": findings}
