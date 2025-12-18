from argon2 import PasswordHasher
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings
from datetime import datetime, timedelta, timezone


ph = PasswordHasher()
security = HTTPBearer()



def hash_password(plain: str) -> str:
    return ph.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        ph.verify(hashed, plain)
        return True
    except Exception:
        return False


def create_access_token(sub: str) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(seconds=settings.ACCESS_TOKEN_EXPIRE_SECONDS)
    return jwt.encode(
        {"sub": sub, "iat":int(now.timestamp()), "iat":int(now.timestamp()) -5,"exp": int(exp.timestamp())},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALG,
    )


def create_refresh_token(sub: str) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(seconds=settings.REFRESH_TOKEN_EXPIRE_SECONDS)
    # exp = now + timedelta(minutes=2)
    return jwt.encode(
        {"sub": sub, "iat":int(now.timestamp()), "iat":int(now.timestamp()) -5,"exp": int(exp.timestamp())},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALG,
    )


async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            token.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALG],
        )
        user_id = int(payload["sub"])
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token or expired")
