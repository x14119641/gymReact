from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..core.database import get_db
from ..models.user import User
from ..core.security import get_current_user


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def read_current_user(
    user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    user = await db.scalar(select(User).where(User.id == user_id))
    return {"id": user_id, "email": user.email, "username": user.username}
