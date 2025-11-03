from argon2 import PasswordHasher
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings
import time


ph = PasswordHasher()
security = HTTPBearer()


ACCESS_TTL = settings.ACCESS_TTL_MIN * 60


def hash_password(plain: str) -> str:
    return ph.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        ph.verify(hashed, plain)
        return True
    except Exception:
        return False


def create_access_token(sub: str) -> str:
    now = int(time.time())
    return jwt.encode(
        {"sub": sub, "iat": now, "exp": now + 1},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALG,
    )


def create_refresh_token(sub: str) -> str:
    now = int(time.time())
    return jwt.encode(
        {"sub": sub, "iat": now, "exp": now + 3600 * 27 * 7},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALG,
    )


async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            token.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALG]
        )
        user_id = int(payload["sub"])
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token or expired")
