import uuid

from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    def create(
        self,
        db: Session,
        user: User,
    ) -> User:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_by_id(
        self,
        db: Session,
        user_id: uuid.UUID,
    ) -> User | None:
        return db.get(User, user_id)

    def get_by_email(
        self,
        db: Session,
        email: str,
    ) -> User | None:
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    def update(
        self,
        db: Session,
        user: User,
    ) -> User:
        db.commit()
        db.refresh(user)
        return user

    def delete(
        self,
        db: Session,
        user: User,
    ) -> None:
        db.delete(user)
        db.commit()