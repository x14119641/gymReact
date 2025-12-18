import os
import pytest
from sqlalchemy.engine import make_url
from alembic.config import Config
from alembic import command
from dotenv import load_dotenv
import psycopg


load_dotenv(".env", override=True)

    
    
@pytest.fixture(scope="session", autouse=True)
def _migrate_db():
    """Reset Schema and apply migrations to db test once per test sesion
    """
    from src.app.core.config import settings
    
    base = os.environ["DATABASE_URL"]        
    url = make_url(base).set(drivername="postgresql", database="db_test")
    sync_test_url = url.render_as_string(hide_password=False)


    # Wipe schema
    with psycopg.connect(sync_test_url) as conn:
        conn.execute("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;")
        conn.commit()
    
    
    # Run 'alembic upgrade head' against db_test
    alembic_cfg = Config("alembic.ini")
    alembic_url = make_url(base).set(drivername="postgresql+psycopg", database="db_test")
    alembic_cfg.set_main_option("sqlalchemy.url", alembic_url.render_as_string(hide_password=False))

    command.upgrade(alembic_cfg, "head")