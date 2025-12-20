from sqlalchemy import String, ForeignKey,DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY
from typing import List
from datetime import datetime
from ..core.database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int]= mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255),  nullable=False, index=True, unique=True)
    username: Mapped[str] = mapped_column(String(120),  nullable=False, index=True, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    profile: Mapped["UserProfile"] = relationship(back_populates="user", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id: Mapped[int]= mapped_column(primary_key=True)
    user_id: Mapped[int]= mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    goal:Mapped[str] = mapped_column(String(120))
    days_per_week:Mapped[str] = mapped_column(String(12))
    experience_level:Mapped[str] = mapped_column(String(60))
    equipment_access:Mapped[List[str]] = mapped_column(ARRAY(String(90)))
    session_length:Mapped[str] = mapped_column(String(12))
    injuries:Mapped[List[str]] = mapped_column(ARRAY(String(90)))
    sports_background:Mapped[List[str]] = mapped_column(ARRAY(String(90)))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user: Mapped["User"] = relationship(back_populates="profile")

