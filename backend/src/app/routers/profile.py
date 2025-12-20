from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, is_, update
from ..core.database import get_db
from ..models.user import UserProfile
from ..core.security import get_current_user
from ..schemas.profile import ProfileIn, ProfileOut
from datetime import datetime, timezone


router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("/onboarding", response_model=ProfileOut)
async def onboarding_page(
    body: ProfileIn,
    current_user: int = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await db.scalar(
        select(UserProfile).where(UserProfile.user_id == current_user)
    )
    now = datetime.now(timezone)
    
    if profile is None:
        # Create Profile
        profile = UserProfile(user_id=current_user)
        db.add(profile)
    
    # Update fields
    profile.goal = body.goal
    profile.days_per_week = body.days_per_week
    profile.experience_level = body.experience_level
    profile.equipment_access = body.equipment_access
    profile.session_length = body.session_length
    profile.injuries = body.injuries
    profile.sports_background = body.sports_background

    profile.onboarding_completed_at = now

    await db.commit()
    await db.refresh(profile)
    return profile


@router.get("/me", response_model=ProfileOut|None)
async def read_profile(
    current_user: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    profile = await db.scalar(
        select(UserProfile).where(UserProfile.user_id == current_user)
    )

    # If you prefer 404 instead, raise HTTPException here
    if profile is None:
        return None

    return profile
