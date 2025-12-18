from pydantic_settings import BaseSettings
from sqlalchemy.engine.url import make_url
from pydantic import ConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALG: str

    ACCESS_TOKEN_EXPIRE_SECONDS:int = 60 *15 # 15min
    REFRESH_TOKEN_EXPIRE_SECONDS:int=60*60*24*7 # 7 days

    @property
    def SYNC_DATABASE_URL(self) -> str:
        url = make_url(self.DATABASE_URL)
        url = url.set(drivername="postgresql+psycopg")
        return str(url)

    model_config = ConfigDict(env_file=".env", extra="forbid")


settings = Settings()
