from pydantic import BaseModel
from datetime import datetime

class ScoreCreate(BaseModel):
    nickname: str
    wpm: float
    accuracy: float
    difficulty: str = "medium"
    sentences_completed: int = 0

class ScoreOut(BaseModel):
    id: int
    nickname: str
    wpm: float
    accuracy: float
    difficulty: str
    sentences_completed: int
    created_at: datetime

    class Config:
        from_attributes = True