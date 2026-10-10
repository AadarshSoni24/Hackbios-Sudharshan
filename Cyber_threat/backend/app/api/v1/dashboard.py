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
    
    return {"success": True, "data": actors}

@router.get("/links")
def get_links():
    return {
        "success": True,
        "data": []
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
            
    return {"success": True, "data": findings}
