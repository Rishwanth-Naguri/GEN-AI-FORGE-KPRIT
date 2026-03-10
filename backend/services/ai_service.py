"""
AI service wrapper for Google Gemini API.
"""

import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
API_KEY = os.getenv("GEMINI_API_KEY", "")

if API_KEY:
    genai.configure(api_key="AIzaSyClQuGBMFEebSVa4QsQ6PJVnbLkjJCpDpI")


def _get_model():
    """Get the Gemini generative model."""
    return genai.GenerativeModel("gemini-1.5-flash")


def _clean_json_response(text: str) -> str:
    """Strip markdown code fences and extract raw JSON."""
    text = text.strip()
    # Remove ```json ... ``` wrappers
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


# ── Demo / fallback data ─────────────────────────────────────────

DEMO_RESUME_RESULT = {
    "overall_score": 72,
    "summary": "A motivated engineering graduate with solid fundamentals in programming and web development. Shows potential but lacks industry experience and some in-demand skills.",
    "strengths": [
        {"skill": "Python", "score": 80, "detail": "Strong programming fundamentals demonstrated through projects"},
        {"skill": "Web Development", "score": 75, "detail": "Experience with HTML, CSS, and JavaScript frameworks"},
        {"skill": "Problem Solving", "score": 70, "detail": "Good analytical thinking shown in academic projects"}
    ],
    "gaps": [
        {"skill": "Data Visualization", "importance": "high", "detail": "Essential for data-driven roles, not demonstrated on resume"},
        {"skill": "Cloud Fundamentals", "importance": "high", "detail": "AWS/Azure/GCP knowledge is increasingly required"},
        {"skill": "Version Control", "importance": "medium", "detail": "Git proficiency should be highlighted"}
    ],
    "recommendations": [
        {"course": "Data Visualization with Python", "platform": "Coursera", "skill_addressed": "Data Visualization", "url": "https://www.coursera.org"},
        {"course": "AWS Cloud Practitioner", "platform": "AWS Training", "skill_addressed": "Cloud Fundamentals", "url": "https://aws.amazon.com/training"},
        {"course": "Git & GitHub Masterclass", "platform": "Udemy", "skill_addressed": "Version Control", "url": "https://www.udemy.com"}
    ],
    "experience_level": "entry",
    "top_skills": ["Python", "Web Development", "Problem Solving"],
    "improvement_areas": ["Cloud Computing", "Data Visualization", "Professional Experience"]
}

DEMO_INTERVIEW_START = {
    "question_number": 1,
    "question": "Tell me about yourself and what interests you about this role.",
    "category": "behavioral",
    "difficulty": "easy",
    "tip": "Keep your answer concise (2-3 minutes). Focus on relevant experience and show enthusiasm for the role."
}

DEMO_INTERVIEW_FEEDBACK = {
    "feedback": {
        "score": 70,
        "tone": "Professional and clear communication",
        "confidence": "Moderate confidence, could be more assertive",
        "accuracy": "Good general understanding demonstrated",
        "strengths": ["Clear communication", "Relevant examples provided"],
        "improvements": ["Be more specific with metrics", "Show more enthusiasm"],
        "ideal_answer_summary": "An ideal answer would include specific achievements with measurable outcomes, demonstrate passion for the role, and connect past experience to the position requirements."
    },
    "next_question": {
        "question_number": 2,
        "question": "Can you describe a challenging project you worked on and how you handled it?",
        "category": "behavioral",
        "difficulty": "medium",
        "tip": "Use the STAR method: Situation, Task, Action, Result. Be specific about your contributions."
    }
}

DEMO_INTERVIEW_SUMMARY = {
    "overall_score": 72,
    "performance_summary": "The candidate showed good communication skills and relevant knowledge. With more practice on providing specific examples and demonstrating confidence, they would be well-prepared for actual interviews.",
    "communication_score": 75,
    "confidence_score": 65,
    "technical_score": 70,
    "top_strengths": ["Clear communication", "Good problem-solving approach", "Relevant technical knowledge"],
    "areas_to_improve": ["Provide more specific examples", "Quantify achievements", "Show more confidence"],
    "final_tips": ["Practice the STAR method for behavioral questions", "Research the company thoroughly", "Prepare 3-5 questions to ask the interviewer"],
    "readiness_level": "needs practice"
}

DEMO_CAREER_RESULT = {
    "current_profile": {
        "identified_role": "Software Developer",
        "top_skills": ["Python", "SQL", "Web Development"],
        "transferable_skills": ["Analytical Thinking", "Problem Solving"]
    },
    "target_analysis": {
        "role": "Data Scientist",
        "required_skills": ["Machine Learning", "Statistics", "Python", "Data Visualization", "Deep Learning"],
        "skill_match_percentage": 45
    },
    "roadmap": [
        {
            "phase": 1,
            "title": "Foundation Building",
            "duration": "1-2 months",
            "description": "Build strong fundamentals in statistics and mathematics for data science",
            "tasks": [
                {"task": "Complete Statistics & Probability course", "resource": "Statistics with Python Specialization", "platform": "Coursera"},
                {"task": "Learn NumPy and Pandas", "resource": "Python for Data Science", "platform": "DataCamp"}
            ]
        },
        {
            "phase": 2,
            "title": "Core Skills Development",
            "duration": "2-3 months",
            "description": "Master machine learning algorithms and data visualization",
            "tasks": [
                {"task": "Complete ML course", "resource": "Machine Learning by Andrew Ng", "platform": "Coursera"},
                {"task": "Learn data visualization", "resource": "Data Visualization with Python", "platform": "Coursera"}
            ]
        },
        {
            "phase": 3,
            "title": "Advanced & Portfolio",
            "duration": "2-3 months",
            "description": "Work on real-world projects and build a portfolio",
            "tasks": [
                {"task": "Complete 3 end-to-end projects", "resource": "Kaggle Competitions", "platform": "Kaggle"},
                {"task": "Learn Deep Learning basics", "resource": "Deep Learning Specialization", "platform": "Coursera"}
            ]
        }
    ],
    "certifications": [
        {"name": "Google Data Analytics Certificate", "provider": "Google", "priority": "high", "estimated_time": "3 months"},
        {"name": "AWS Machine Learning Specialty", "provider": "AWS", "priority": "medium", "estimated_time": "2 months"}
    ],
    "estimated_transition_time": "6-9 months",
    "motivation": "Your programming background gives you a strong foundation! With focused effort on statistics and ML, you can make a successful transition to data science. Many great data scientists started exactly where you are."
}


# ── Main API call function ────────────────────────────────────────

async def generate_ai_response(prompt: str, fallback_demo: dict | None = None) -> dict:
    """
    Send a prompt to Gemini and return the parsed JSON response.
    Falls back to demo data if no API key is configured.
    """
    if not API_KEY:
        if fallback_demo:
            return fallback_demo
        return {"error": "No GEMINI_API_KEY configured. Please set it in your .env file."}

    try:
        model = _get_model()
        response = model.generate_content(prompt)
        cleaned = _clean_json_response(response.text)
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # If JSON parsing fails, try to extract JSON from the response
        try:
            json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except Exception:
            pass
        if fallback_demo:
            return fallback_demo
        return {"error": "Failed to parse AI response", "raw": response.text[:500]}
    except Exception as e:
        if fallback_demo:
            return fallback_demo
        return {"error": str(e)}
