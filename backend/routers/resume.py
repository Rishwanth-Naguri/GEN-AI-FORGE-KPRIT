"""
Resume evaluation API router.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.resume_parser import extract_text_from_pdf
from services.ai_service import generate_ai_response, DEMO_RESUME_RESULT
from services.prompts import RESUME_EVALUATION_PROMPT

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/evaluate")
async def evaluate_resume(file: UploadFile = File(...)):
    """Upload a PDF resume and get AI-powered evaluation."""
    
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Read and parse PDF
    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Generate AI evaluation
    prompt = RESUME_EVALUATION_PROMPT.format(resume_text=resume_text)
    result = await generate_ai_response(prompt, fallback_demo=DEMO_RESUME_RESULT)
    
    return {
        "success": True,
        "filename": file.filename,
        "evaluation": result
    }


@router.post("/evaluate-text")
async def evaluate_resume_text(data: dict):
    """Evaluate resume from plain text (for testing)."""
    resume_text = data.get("text", "")
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    
    prompt = RESUME_EVALUATION_PROMPT.format(resume_text=resume_text)
    result = await generate_ai_response(prompt, fallback_demo=DEMO_RESUME_RESULT)
    
    return {
        "success": True,
        "evaluation": result
    }
