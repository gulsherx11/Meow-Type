from pydantic import BaseModel
from datetime import datetime

class ScoreCreate(BaseModel):
    nickname: str
    wpm: float
    accuracy: float
    difficulty: str = "medium"

class ScoreOut(BaseModel):
    id: int
    nickname: str
    wpm: float
    accuracy: float
    difficulty: str
    created_at: datetime

    class Config:
        from_attributes = True