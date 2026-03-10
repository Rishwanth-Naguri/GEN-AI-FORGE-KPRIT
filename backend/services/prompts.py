"""
AI prompt templates for VidyaMitra features.
"""

RESUME_EVALUATION_PROMPT = """You are an expert career counselor and resume evaluator. Analyze the following resume text and provide a comprehensive evaluation.

Resume Text:
{resume_text}

Respond in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{{
    "overall_score": <number 0-100>,
    "summary": "<brief 2-3 sentence summary of the candidate>",
    "strengths": [
        {{"skill": "<skill name>", "score": <number 0-100>, "detail": "<why this is a strength>"}}
    ],
    "gaps": [
        {{"skill": "<missing skill>", "importance": "high/medium/low", "detail": "<why this matters>"}}
    ],
    "recommendations": [
        {{"course": "<course name>", "platform": "<platform>", "skill_addressed": "<skill>", "url": "<url if known, else empty>"}}
    ],
    "experience_level": "<entry/mid/senior>",
    "top_skills": ["<skill1>", "<skill2>", "<skill3>"],
    "improvement_areas": ["<area1>", "<area2>", "<area3>"]
}}
"""

INTERVIEW_START_PROMPT = """You are an expert interviewer conducting a mock interview for the role of {job_role}.

Generate the first interview question. The question should be professional, relevant to the role, and designed to assess the candidate's knowledge and experience.

Respond in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{{
    "question_number": 1,
    "question": "<your interview question>",
    "category": "<technical/behavioral/situational>",
    "difficulty": "<easy/medium/hard>",
    "tip": "<brief tip for answering this type of question>"
}}
"""

INTERVIEW_RESPONSE_PROMPT = """You are an expert interviewer conducting a mock interview for the role of {job_role}.

Previous questions and answers:
{conversation_history}

The candidate just answered:
Question: {current_question}
Answer: {user_answer}

Evaluate the answer and generate the next question. Assess tone, confidence, accuracy, and completeness.

Respond in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{{
    "feedback": {{
        "score": <number 0-100>,
        "tone": "<assessment of communication tone>",
        "confidence": "<assessment of confidence level>",
        "accuracy": "<assessment of answer accuracy>",
        "strengths": ["<what was good>"],
        "improvements": ["<what could be better>"],
        "ideal_answer_summary": "<brief summary of an ideal answer>"
    }},
    "next_question": {{
        "question_number": {next_number},
        "question": "<next interview question>",
        "category": "<technical/behavioral/situational>",
        "difficulty": "<easy/medium/hard>",
        "tip": "<brief tip for answering this type of question>"
    }}
}}
"""

INTERVIEW_SUMMARY_PROMPT = """You are an expert interviewer. Based on the following mock interview for the role of {job_role}, provide an overall performance summary.

Full interview:
{conversation_history}

Respond in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{{
    "overall_score": <number 0-100>,
    "performance_summary": "<2-3 sentence overall assessment>",
    "communication_score": <number 0-100>,
    "confidence_score": <number 0-100>,
    "technical_score": <number 0-100>,
    "top_strengths": ["<strength1>", "<strength2>", "<strength3>"],
    "areas_to_improve": ["<area1>", "<area2>", "<area3>"],
    "final_tips": ["<tip1>", "<tip2>", "<tip3>"],
    "readiness_level": "<not ready/needs practice/almost ready/interview ready>"
}}
"""

CAREER_PATH_PROMPT = """You are an expert career advisor. Analyze the following professional profile and create a personalized career transition roadmap.

Current Resume/Skills:
{resume_text}

Target Role: {target_role}

Create a detailed career transition roadmap. Respond in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{{
    "current_profile": {{
        "identified_role": "<current role/level>",
        "top_skills": ["<skill1>", "<skill2>", "<skill3>"],
        "transferable_skills": ["<skill1>", "<skill2>"]
    }},
    "target_analysis": {{
        "role": "{target_role}",
        "required_skills": ["<skill1>", "<skill2>", "<skill3>"],
        "skill_match_percentage": <number 0-100>
    }},
    "roadmap": [
        {{
            "phase": 1,
            "title": "<phase title>",
            "duration": "<e.g., 1-2 months>",
            "description": "<what to focus on>",
            "tasks": [
                {{"task": "<specific task>", "resource": "<course/book/project>", "platform": "<platform name>"}}
            ]
        }}
    ],
    "certifications": [
        {{"name": "<cert name>", "provider": "<provider>", "priority": "high/medium/low", "estimated_time": "<duration>"}}
    ],
    "estimated_transition_time": "<e.g., 6-9 months>",
    "motivation": "<encouraging message>"
}}
"""
