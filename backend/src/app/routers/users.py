from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..core.database import get_db
from ..models.user import User, UserProfile
from ..core.security import get_current_user


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def read_current_user(
    user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    user = await db.scalar(select(User).where(User.id == user_id))
    onboarding_completed_at = await db.scalar(select(UserProfile.onboarding_completed_at).where(UserProfile.user_id==user_id))
    onboarding_completed = onboarding_completed_at is not None # Then is true
    return {"id": user_id, "email": user.email, "username": user.username, "onboarding_completed":onboarding_completed}


@router.get("/protected")
async def protected(
    user_id: int = Depends(get_current_user)
):
    return {"message": "This is a protected page"}


@router.get("/unprotected")
async def unprotected(
):
    return {"message": "Unprocteted"}