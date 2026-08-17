import datetime
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

@event.listens_for(Engine, "connect")
def register_sqlite_now(dbapi_connection, connection_record):
    if hasattr(dbapi_connection, "create_function"):
        # Register standard 'now' function to return current UTC time
        dbapi_connection.create_function(
            "now", 
            0, 
            lambda: datetime.datetime.utcnow().isoformat()
        )

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    future=True,
)