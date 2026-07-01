from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from groq import Groq
import os

from database import engine, get_db
from models import Base, Score
from schemas import ScoreCreate, ScoreOut

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/paragraphs")
def get_paragraph(difficulty: str = "medium"):
    difficulty_prompts = {
        "easy": "Generate 1 simple short sentence (8-12 words) for a typing speed test. Use common everyday words. Return only the sentence, no quotes, no explanation.",
        "medium": "Generate 1 medium difficulty sentence (12-18 words) for a typing speed test. Use moderately complex vocabulary. Return only the sentence, no quotes, no explanation.",
        "hard": "Generate 1 challenging sentence (15-20 words) for a typing speed test. Use technical or complex vocabulary. Return only the sentence, no quotes, no explanation.",
    }

    prompt = difficulty_prompts.get(difficulty, difficulty_prompts["medium"])

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        max_tokens=100,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.choices[0].message.content.strip().strip('"').strip("'")
    return {"text": text, "difficulty": difficulty}

@app.post("/scores", response_model=ScoreOut)
def save_score(score: ScoreCreate, db: Session = Depends(get_db)):
    db_score = Score(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@app.get("/leaderboard", response_model=List[ScoreOut])
def get_leaderboard(db: Session = Depends(get_db)):
    return db.query(Score).order_by(Score.wpm.desc()).limit(10).all()