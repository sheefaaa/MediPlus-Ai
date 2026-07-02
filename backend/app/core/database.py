import re

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


def _resolve_database_url(url: str) -> str:
    """Normalise the database URL for the active driver.

    psycopg v3 requires the SQLAlchemy dialect ``postgresql+psycopg``.
    Rewrite bare ``postgresql://`` and legacy ``postgresql+psycopg2://``
    URLs so they work transparently regardless of how DATABASE_URL is set.
    """
    url = re.sub(r"^postgresql\+psycopg2://", "postgresql+psycopg://", url)
    url = re.sub(r"^postgresql://", "postgresql+psycopg://", url)
    return url


connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

database_url = _resolve_database_url(settings.database_url)
engine = create_engine(database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
