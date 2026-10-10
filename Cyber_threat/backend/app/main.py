from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.services.seed_data import initialize_seed_data
from app.api.v1.auth import router as auth_router
from app.api.v1.actors import router as actors_router
from app.api.v1.graph import router as graph_router
from app.api.v1.links import router as links_router
from app.api.v1.infra import router as infra_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.reports import router as reports_router
from app.api.v1.system import router as system_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed Data
    initialize_seed_data()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Autonomous Multi-Vector Dark Web Threat Actor Attribution & Intelligence Engine (SIH 2026 / NTRO)",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["https://*.vercel.app"],
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(actors_router, prefix=settings.API_V1_STR)
app.include_router(graph_router, prefix=settings.API_V1_STR)
app.include_router(links_router, prefix=settings.API_V1_STR)
app.include_router(infra_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(system_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "docs": "/docs",
        "health": "/api/v1/system/health",
        "api_v1": settings.API_V1_STR
    }


from fastapi.responses import HTMLResponse
from pathlib import Path

@app.get("/mock/alphabay", response_class=HTMLResponse)
def get_mock_alphabay():
    demo_file = Path(r"C:\Users\aadar\SIH 2026\demo_market_a - Copy.html")
    if demo_file.exists():
        return HTMLResponse(content=demo_file.read_text(encoding="utf-8", errors="ignore"))
    return HTMLResponse(content="<h1>Demo market file not found</h1>")
