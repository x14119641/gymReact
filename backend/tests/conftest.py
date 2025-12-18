import os
import pytest
import psycopg
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.engine import make_url
from alembic.config import Config
from alembic import command
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] # backend
load_dotenv(ROOT / ".env", override=True)


print("[conftest] cwd =", os.getcwd())
print("[conftest] DATABASE_URL(raw) =", os.environ.get("DATABASE_URL"))

assert "DATABASE_URL" in os.environ, "DATABASE_URL missing (dotenv didn't load)."
assert "***" not in os.environ["DATABASE_URL"], f"DATABASE_URL is masked: {os.environ['DATABASE_URL']}" 


# Force DATABASE_URL to db_test for the entire test process
base = os.environ["DATABASE_URL"]
u = make_url(base).set(database="db_test")
os.environ["DATABASE_URL"] = u.render_as_string(hide_password=False)
    




def _sync_url_for_psycopg()-> str:
    """psycopg wants postgresql:// (no driver)"""    
    u = make_url(os.environ["DATABASE_URL"]).set(drivername="postgresql")
    return u.render_as_string(hide_password=False)


def _alembic_url()-> str:
    """alembic/SQALcquemy sync engine wants postgresql+psycopog://"""    
    u = make_url(os.environ["DATABASE_URL"]).set(drivername="postgresql+psycopg")
    return u.render_as_string(hide_password=False)



@pytest.fixture(scope="session", autouse=True)
def _migrate_db_at_once():
    """Reset Schema and apply migrations to db test once per test sesion
    """

    sync_test_url = _sync_url_for_psycopg()
    print("[conftest] psycopg url =", sync_test_url)


    # Wipe schema
    with psycopg.connect(sync_test_url) as conn:
        conn.execute("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;")
        conn.commit()
    
    
    # Run 'alembic upgrade head' against db_test
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("sqlalchemy.url", _alembic_url())

    command.upgrade(alembic_cfg, "head")
    
    

@pytest_asyncio.fixture
def app():
    """
    Return FastAPI app with DB dependency override so request use db_test
    even if the prod engine was created at import time.
    """
    from src.app.main import app as fastapi_app
    from src.app.core.database import get_db
    
    # Create a test engine/sessionmakker from the (already overriden) DATABASE_URK
    test_engine = create_async_engine(os.environ["DATABASE_URL"], echo=False, future=True)
    TestSessionLocal = sessionmaker(
        bind = test_engine,
        class_= AsyncSession,
        expire_on_commit= False
    )
    
    async def override_get_db():
        async with TestSessionLocal() as session:
            yield session
    
    fastapi_app.dependency_overrides[get_db] = override_get_db
    return fastapi_app


@pytest_asyncio.fixture
async def client(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c