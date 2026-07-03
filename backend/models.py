from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String, nullable=False)
    wpm = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    difficulty = Column(String, default="medium")
    sentences_completed = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())