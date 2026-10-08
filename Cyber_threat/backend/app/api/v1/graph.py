from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, Actor, Entity, InfraFinding, CorrelationLink
import uuid

router = APIRouter(prefix="/graph", tags=["Graph Visualizer"])

# IN-MEMORY MOCK DB FOR TESTING SCRAPER
MOCK_GRAPH_DB = {
    "nodes": [],
    "edges": []
}

@router.get("/data")
def get_graph_data(db: Session = Depends(get_db)):
    # Temporary: Return the in-memory graph if it has data
    if len(MOCK_GRAPH_DB["nodes"]) > 0:
        return {
            "success": True,
            "data": {
                "nodes": MOCK_GRAPH_DB["nodes"],
                "edges": MOCK_GRAPH_DB["edges"],
                "counts": {
                    "total_nodes": len(MOCK_GRAPH_DB["nodes"]),
                    "total_edges": len(MOCK_GRAPH_DB["edges"])
                }
            }
        }
    
    # Fallback to empty for now
    return {
        "success": True,
        "data": {
            "nodes": [],
            "edges": [],
            "counts": {"total_nodes": 0, "total_edges": 0}
        }
    }
