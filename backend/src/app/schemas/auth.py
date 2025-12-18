from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str


class LoginRequest(BaseModel):
    identifier: str # username or email
    password: str


class TokenResponse(BaseModel):
    access_token: str 
    refresh_token: str
