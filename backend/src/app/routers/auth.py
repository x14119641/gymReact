from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from ..core.config import settings
from ..core.database import get_db
from ..core.security import create_refresh_token, hash_password, verify_password, create_access_token
from ..models.user import User
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut
from jose import JWTError, jwt

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


@router.post("/refresh")
async def refresh_token(data = Body (...)):
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        raise HTTPException(400, "Refresh token is missing")
    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid refresh token")
        # MAy check later for that token age, not now
        new_access_token = create_access_token(str(user_id))
        return {"access_token": new_access_token}
    except JWTError:
        raise HTTPException(401, "Invalid or expired refresh token.")


@router.post("/login")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    q = select(User).where(or_(User.username == body.identifier,User.email == body.identifier))
    u = (await db.execute(q)).scalar_one_or_none()
    if not u or not verify_password(body.password, u.password_hash):
        raise HTTPException(401, "Invalid Credentials")
    token = create_access_token(str(u.id))
    refresh_token = create_refresh_token(str(u.id))
    return TokenResponse(access_token=token, refresh_token=refresh_token)


@router.post("/logout")
async def logout():
    # So far is a token, so fronend will need to remove token from headers and thats it, later we will do this with the db
    return {"message":"Log out successful"}
