from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..core.database import get_db
from ..core.security import hash_password, verify_password, create_access_token
from ..models.user import User
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    q = select(User).where(
        (User.email == body.email) | (User.username == body.username)
    )
    if (await db.execute(q)).scalar_one_or_none():
        raise HTTPException(400, "Email or username already in use")

    u = User(
        email=body.email,
        username=body.username,
        password_hash=hash_password(body.password),
    )

    db.add(u)
    await db.commit()
    await db.refresh(u)
    return UserOut(id=u.id, email=u.email, username=u.username)


@router.post("/login")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    q = select(User).where(User.email == body.email)
    u = (await db.execute(q)).scalar_one_or_none()
    if not u or not verify_password(body.password, u.password_hash):
        raise HTTPException(401, "Invalid Credentials")
    token = create_access_token(str(u.id))
    return TokenResponse(access_token=token)
