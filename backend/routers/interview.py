"""
Mock interview API router.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.ai_service import (
    generate_ai_response,
    DEMO_INTERVIEW_START,
    DEMO_INTERVIEW_FEEDBACK,
    DEMO_INTERVIEW_SUMMARY,
)
from services.prompts import (
    INTERVIEW_START_PROMPT,
    INTERVIEW_RESPONSE_PROMPT,
    INTERVIEW_SUMMARY_PROMPT,
)

router = APIRouter(prefix="/interview", tags=["Interview"])


class InterviewStartRequest(BaseModel):
    job_role: str


class InterviewRespondRequest(BaseModel):
    job_role: str
    current_question: str
    user_answer: str
    conversation_history: Optional[str] = ""
    question_number: Optional[int] = 1


class InterviewSummaryRequest(BaseModel):
    job_role: str
    conversation_history: str


@router.post("/start")
async def start_interview(request: InterviewStartRequest):
    """Start a mock interview for a given job role."""
    
    if not request.job_role.strip():
        raise HTTPException(status_code=400, detail="Job role cannot be empty.")
    
    prompt = INTERVIEW_START_PROMPT.format(job_role=request.job_role)
    result = await generate_ai_response(prompt, fallback_demo=DEMO_INTERVIEW_START)
    
    return {
        "success": True,
        "job_role": request.job_role,
        "data": result
    }


@router.post("/respond")
async def respond_to_question(request: InterviewRespondRequest):
    """Submit an answer and get feedback + next question."""
    
    if not request.user_answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")
    
    prompt = INTERVIEW_RESPONSE_PROMPT.format(
        job_role=request.job_role,
        conversation_history=request.conversation_history or "No previous questions.",
        current_question=request.current_question,
        user_answer=request.user_answer,
        next_number=request.question_number + 1,
    )
    result = await generate_ai_response(prompt, fallback_demo=DEMO_INTERVIEW_FEEDBACK)
    
    return {
        "success": True,
        "data": result
    }


@router.post("/summary")
async def get_interview_summary(request: InterviewSummaryRequest):
    """Get overall interview performance summary."""
    
    if not request.conversation_history.strip():
        raise HTTPException(status_code=400, detail="No interview data provided.")
    
    prompt = INTERVIEW_SUMMARY_PROMPT.format(
        job_role=request.job_role,
        conversation_history=request.conversation_history,
    )
    result = await generate_ai_response(prompt, fallback_demo=DEMO_INTERVIEW_SUMMARY)
    
    return {
        "success": True,
        "data": result
    }
