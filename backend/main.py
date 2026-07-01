from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from groq import Groq
import os
import random

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

try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    RATE_LIMIT = True
except ImportError:
    RATE_LIMIT = False

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

FALLBACK = {
    "easy": [
        "The cat sat on a warm sunny windowsill.",
        "She found a tiny key hidden under the mat.",
        "Blue skies made the little kitten smile today.",
        "A soft breeze carried the smell of fresh rain.",
        "The old cat napped by the fire all evening.",
        "He walked slowly down the quiet empty street.",
        "The dog chased the ball across the green field.",
        "She opened the window and felt the cool air.",
        "The boy smiled and waved at his new friend.",
        "A bird sang softly from the top of the tree.",
        "The sun rose slowly over the calm blue lake.",
        "She poured a warm cup of tea and sat down.",
        "The little girl laughed and ran through the park.",
        "He read a short book before going to sleep.",
        "The cat knocked the glass off the kitchen table.",
        "A small red car drove past the old white house.",
        "The stars were bright and clear in the night sky.",
        "She picked fresh flowers from the garden every morning.",
        "The puppy ran around the yard chasing fallen leaves.",
        "He wrote a short note and left it on the door.",
        "The children played games until the sun went down.",
        "A big wave crashed onto the sandy beach below.",
        "She hummed a soft song while making breakfast.",
        "The old man fed the ducks by the pond daily.",
        "He found a coin on the pavement near the shop.",
    ],
    "medium": [
        "The curious cat discovered a hidden door behind the old bookshelf.",
        "Programming requires patience and a willingness to learn from errors.",
        "Every great journey begins with a single determined step forward.",
        "The scientist observed the tiny creature through her magnifying glass.",
        "Autumn leaves drifted silently across the cobblestone village square.",
        "She decided to take a different route home through the forest.",
        "The engineer spent three days debugging a single line of code.",
        "Reading books regularly expands vocabulary and builds deeper empathy.",
        "The market was filled with colorful fruits from distant countries.",
        "He practiced the piano for two hours every single morning.",
        "The old lighthouse stood tall against the stormy winter ocean.",
        "She learned a new language by watching foreign films daily.",
        "The team worked through the night to finish the project.",
        "A sudden rainstorm interrupted the outdoor concert in the park.",
        "He discovered an old photograph hidden inside the library book.",
        "The chef prepared a delicious meal using only local ingredients.",
        "She wrote in her journal every evening before going to sleep.",
        "The bridge was built over one hundred and fifty years ago.",
        "He trained for months before competing in the national championship.",
        "The documentary explored the lives of deep sea creatures in detail.",
        "She repaired the broken bicycle and rode it to the market.",
        "The professor explained the theory using simple everyday examples.",
        "A mysterious letter arrived at the door with no return address.",
        "He saved enough money to travel across three different countries.",
        "The forest trail wound through tall pine trees and mossy rocks.",
    ],
    "hard": [
        "Simultaneously, the sophisticated algorithm traversed the labyrinthine data structure efficiently.",
        "Kubernetes orchestrates containerized applications across clusters with remarkable precision and resilience.",
        "Cryptographic hash functions produce fixed-size outputs ensuring data integrity verification.",
        "The asymptotic complexity of recursive Fibonacci degrades exponentially without memoization.",
        "Distributed systems must handle network partitions and eventual consistency simultaneously.",
        "Polymorphism enables disparate object types to be manipulated through unified interfaces.",
        "The Byzantine Generals Problem illustrates the difficulty of consensus in unreliable systems.",
        "Containerization abstracts application dependencies enabling reproducible deployments across environments.",
        "Backpropagation computes gradients through the chain rule enabling neural network optimization.",
        "Microservices decompose monolithic applications into independently deployable bounded contexts.",
        "The CAP theorem states distributed systems guarantee only two of three consistency properties.",
        "Immutable infrastructure replaces mutable configurations with versioned reproducible machine images.",
        "Quantum entanglement enables instantaneous correlation between particles across vast distances.",
        "The Fourier transform decomposes complex signals into constituent sinusoidal frequency components.",
        "Homomorphic encryption allows computation on encrypted data without requiring decryption first.",
        "The observer pattern establishes a subscription mechanism to notify dependents of state changes.",
        "Gradient descent iteratively minimizes loss functions by moving opposite to the gradient direction.",
        "Idempotency ensures that repeated identical operations produce the same result as a single operation.",
        "The garbage collector automatically reclaims memory occupied by objects no longer referenced.",
        "Eventual consistency guarantees that replicas converge to identical state given sufficient time.",
        "Dependency injection decouples component creation from usage promoting testability and flexibility.",
        "The Von Neumann architecture separates processing units from memory causing the bottleneck.",
        "Recursive descent parsers decompose grammar rules into mutually recursive parsing functions.",
        "Sharding partitions data horizontally across multiple database nodes improving scalability significantly.",
        "The halting problem proves no algorithm can determine if arbitrary programs terminate universally.",
    ],
}

DIFFICULTY_PROMPTS = {
    "easy": "Generate 1 simple short sentence (8-12 words) for a typing speed test. Use common everyday words. Return only the sentence, no quotes, no explanation.",
    "medium": "Generate 1 medium difficulty sentence (12-18 words) for a typing speed test. Use moderately complex vocabulary. Return only the sentence, no quotes, no explanation.",
    "hard": "Generate 1 challenging sentence (15-20 words) for a typing speed test. Use technical or complex vocabulary. Return only the sentence, no quotes, no explanation.",
}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/paragraphs")
async def get_paragraph(request: Request, difficulty: str = "medium"):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=100,
            messages=[{"role": "user", "content": DIFFICULTY_PROMPTS.get(difficulty, DIFFICULTY_PROMPTS["medium"])}]
        )
        text = response.choices[0].message.content.strip().strip('"').strip("'")
        return {"text": text, "difficulty": difficulty}
    except Exception:
        return {"text": random.choice(FALLBACK[difficulty]), "difficulty": difficulty}

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