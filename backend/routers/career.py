"""
Career path recommendation API router.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.resume_parser import extract_text_from_pdf
from services.ai_service import generate_ai_response, DEMO_CAREER_RESULT
from services.prompts import CAREER_PATH_PROMPT

router = APIRouter(prefix="/career", tags=["Career"])


class CareerAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: str


@router.post("/analyze")
async def analyze_career_path(data: CareerAnalyzeRequest):
    """Analyze career transition and generate a personalized roadmap."""
    
    if not data.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not data.target_role.strip():
        raise HTTPException(status_code=400, detail="Target role cannot be empty.")
    
    prompt = CAREER_PATH_PROMPT.format(
        resume_text=data.resume_text,
        target_role=data.target_role,
    )
    result = await generate_ai_response(prompt, fallback_demo=DEMO_CAREER_RESULT)
    
    return {
        "success": True,
        "target_role": data.target_role,
        "data": result
    }


@router.post("/analyze-upload")
async def analyze_career_with_upload(
    target_role: str,
    file: UploadFile = File(...),
):
    """Upload resume PDF and target role to get career roadmap."""
    
    if not target_role.strip():
        raise HTTPException(status_code=400, detail="Target role cannot be empty.")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    prompt = CAREER_PATH_PROMPT.format(
        resume_text=resume_text,
        target_role=target_role,
    )
    result = await generate_ai_response(prompt, fallback_demo=DEMO_CAREER_RESULT)
    
    return {
        "success": True,
        "target_role": target_role,
        "data": result
    }
