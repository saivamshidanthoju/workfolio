from typing import Generator

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.core.security import decode_access_token
from app.core.exceptions import (
    AuthenticationException,
    ForbiddenException,
)
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
)


def get_db() -> Generator[Session, None, None]:

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:

    user_id = decode_access_token(token)

    if user_id is None:
        raise AuthenticationException(
            "Invalid or expired token."
        )

    user = db.get(User, user_id)

    if user is None:
        raise AuthenticationException(
            "User not found."
        )

    if not user.is_active:
        raise ForbiddenException(
            "User account is inactive."
        )

    return user