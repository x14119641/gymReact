from pydantic_settings import BaseSettings
from sqlalchemy.engine.url import make_url


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALG: str
    ACCESS_TTL_MIN: int = 15

    @property
    def SYNC_DATABASE_URL(self) -> str:
        url = make_url(self.DATABASE_URL)
        url = url.set(drivername="postgresql+psycopg")
        return str(url)

    class Config:
        env_file = ".env"


settings = Settings()
