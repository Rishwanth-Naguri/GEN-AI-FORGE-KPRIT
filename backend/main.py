"""
VidyaMitra Backend – FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, interview, career

app = FastAPI(
    title="VidyaMitra API",
    description="AI-Powered Resume Evaluator, Trainer & Career Planner",
    version="1.0.0",
)

# CORS – allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(resume.router, prefix="/api")
app.include_router(interview.router, prefix="/api")
app.include_router(career.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "app": "VidyaMitra",
        "tagline": "AI-Powered Resume Evaluator, Trainer & Career Planner",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "VidyaMitra API"}
