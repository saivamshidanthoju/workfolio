from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import (
    AuthenticationException,
    ConflictException,
)
from app.core.logger import logger
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserRegister


class AuthService:

    def __init__(self):
        self.user_repository = UserRepository()

    def register(
        self,
        db: Session,
        user_data: UserRegister,
    ) -> User:

        existing_user = self.user_repository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise ConflictException(
                "Email already registered."
            )

        user = User(
            email=user_data.email,
            password_hash=hash_password(
                user_data.password,
            ),
        )

        user = self.user_repository.create(
            db,
            user,
        )

        logger.info(
            "User registered: %s",
            user.email,
        )

        return user

    def login(
        self,
        db: Session,
        email: str,
        password: str,
    ) -> dict:

        user = self.user_repository.get_by_email(
            db,
            email,
        )

        if not user:
            raise AuthenticationException(
                "Invalid email or password."
            )

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise AuthenticationException(
                "Invalid email or password."
            )

        user.last_login = datetime.now(
            timezone.utc,
        )

        self.user_repository.update(
            db,
            user,
        )

        access_token = create_access_token(
            str(user.id),
        )

        logger.info(
            "User logged in: %s",
            user.email,
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }