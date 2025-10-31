# alembic/env.py
from logging.config import fileConfig
import os
import sys

from alembic import context
from sqlalchemy import engine_from_config, pool


from pathlib import Path
# add backend in path so app is importable
BACKEND_DIR= Path(__file__).resolve(1)
SRC_DIR = BACKEND_DIR / "src"
# Make "app" importable
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

# ---- App imports
from src.app.core.config import settings
from src.app.core.database import Base
# IMPORTANT: import models so Base.metadata is populated
import src.app.models # noqa: F401

# Alembic Config
config = context.config

# Override URL in alembic.ini with our settings (sync driver)
config.set_main_option("sqlalchemy.url", settings.SYNC_DATABASE_URL)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


from sqlalchemy import MetaData
from src.app.core.database import Base

Base.metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
})
# Target metadata for 'autogenerate'
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
