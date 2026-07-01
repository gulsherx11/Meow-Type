# Meow Type - Typing Speed Test

A cat-themed retro typing speed test with AI-generated sentences.

## Tech Stack
- Frontend: React + custom CSS (retro/pixel theme)
- Backend: FastAPI + PostgreSQL
- AI: Groq API (llama-3.1-8b-instant)
- DevOps: Docker, Docker Compose, GitHub Actions

## Run Locally

### With Docker
```bash
docker-compose up --build
```
App → http://localhost:3000
API → http://localhost:8000/docs

### Without Docker
```bash
# Terminal 1
cd backend
uvicorn main:app --reload

# Terminal 2
cd frontend
npm start
```

## Environment Variables

Create `backend/.env`:

DATABASE_URL=postgresql://postgres:password@localhost:5432/typingdb
GROQ_API_KEY=your_groq_api_key

## Features
- AI-generated sentences via Groq API
- 5 sentences per round, one by one
- +5 seconds bonus after each sentence
- Live WPM and accuracy tracking
- Backspace disabled for challenge
- Leaderboard with top 10 scores
- Docker + CI/CD pipeline