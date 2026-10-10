from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, Actor, Entity, InfraFinding, CorrelationLink

router = APIRouter(prefix="/graph", tags=["Graph Visualizer"])

# In-memory store for live scraped nodes/edges
MOCK_GRAPH_DB = {
    "nodes": [],
    "edges": []
}

@router.get("/data")
def get_graph_data(db: Session = Depends(get_db)):
    # Build nodes & links formatted for react-force-graph-2d / Cytoscape
    nodes = []
    edges = []
    node_ids = set()

    # 1. Actor Nodes (Red)
    actors = db.query(Actor).all()
    for a in actors:
        nodes.append({
            "id": a.id,
            "label": a.display_handle,
            "sublabel": f"{a.category} · {int(a.confidence_score * 100)}%",
            "type": "actor",
            "risk": a.risk_level.lower(),
            "confidence": a.confidence_score
        })
        node_ids.add(a.id)

    # 2. Entity Nodes (Wallets: Blue, PGP: Purple, IP: Green)
    entities = db.query(Entity).all()
    for e in entities:
        if e.value not in node_ids:
            node_type = "wallet" if "WALLET" in e.type else ("pgp" if "PGP" in e.type else "ip")
            nodes.append({
                "id": e.value,
                "label": e.value[:14] + "..." if len(e.value) > 16 else e.value,
                "sublabel": e.type,
                "type": node_type,
                "full_value": e.value
            })
            node_ids.add(e.value)

        # Connect Actor to Entity
        if e.actor_id and e.actor_id in node_ids:
            edges.append({
                "source": e.actor_id,
                "target": e.value,
                "label": "uses_" + e.type.lower()
            })

    # 3. Leaked Clearnet Host Nodes (Green)
    infras = db.query(InfraFinding).all()
    for inf in infras:
        host_id = "host_" + inf.candidate_host
        if host_id not in node_ids:
            nodes.append({
                "id": host_id,
                "label": inf.candidate_host,
                "sublabel": "Leaked Clearnet Origin",
                "type": "ip",
                "risk": "critical"
            })
            node_ids.add(host_id)

    # 4. Correlation Links between Actors (e.g. ALIAS_OF, MULTI_INPUT_COSPEND)
    links = db.query(CorrelationLink).all()
    for lnk in links:
        if lnk.actor_a_id in node_ids and lnk.actor_b_id in node_ids:
            edges.append({
                "source": lnk.actor_a_id,
                "target": lnk.actor_b_id,
                "label": f"LINK: {int(lnk.score * 100)}% ({lnk.band})",
                "strength": lnk.strength,
                "status": lnk.status
            })

    return {
        "success": True,
        "data": {
            "nodes": nodes,
            "edges": edges,
            "counts": {
                "total_nodes": len(nodes),
                "total_edges": len(edges)
            }
        }
    }
