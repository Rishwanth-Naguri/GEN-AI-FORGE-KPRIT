# VidyaMitra – AI-Powered Career Platform

> AI-Powered Resume Evaluator, Trainer & Career Planner

## Features

| Feature | Description |
|---|---|
| 📄 **Resume Evaluator** | Upload PDF resume → AI skill gap analysis, scores, course recommendations |
| 🎤 **Mock Interview** | AI interviewer with real-time feedback on tone, confidence, accuracy |
| 🗺️ **Career Path Planner** | Personalized roadmap with phases, certifications, and timeline |

## Tech Stack

- **Frontend**: React 19 + Vite + React Router
- **Backend**: Python FastAPI
- **AI**: Google Gemini API (works in demo mode without API key)

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt

# (Optional) Add your API key
copy .env.example .env
# Edit .env → GEMINI_API_KEY=your_key

uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open

Go to **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/evaluate` | Upload PDF for evaluation |
| `POST` | `/api/interview/start` | Start mock interview |
| `POST` | `/api/interview/respond` | Submit answer, get feedback |
| `POST` | `/api/interview/summary` | Get interview summary |
| `POST` | `/api/career/analyze` | Generate career roadmap |
| `GET`  | `/api/health` | Health check |

## Demo Mode

If no `GEMINI_API_KEY` is configured, the app falls back to realistic demo data so you can explore all features without an API key.
