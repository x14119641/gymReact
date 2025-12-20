from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, users, profile


app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost/*",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://10.0.0.2:8080",
    "http://10.0.0.2:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(profile.router)


@app.get("/ping")
def ping():
    return {"message": "pong"}
