from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    is_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # -------------------------
    # Relationships
    # -------------------------

    profile: Mapped["Profile"] = relationship(
        "Profile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    worker_profile: Mapped["WorkerProfile | None"] = relationship(
        "WorkerProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    works: Mapped[list["Work"]] = relationship(
        "Work",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    applications: Mapped[list["Application"]] = relationship(
        "Application",
        back_populates="worker",
        cascade="all, delete-orphan",
    )

    client_assignments: Mapped[list["Assignment"]] = relationship(
        "Assignment",
        foreign_keys="Assignment.client_id",
        back_populates="client",
    )

    worker_assignments: Mapped[list["Assignment"]] = relationship(
        "Assignment",
        foreign_keys="Assignment.worker_id",
        back_populates="worker",
    )

    received_notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        back_populates="recipient",
        cascade="all, delete-orphan",
    )

    sent_messages: Mapped[list["Message"]] = relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender",
    )

    reviews_given: Mapped[list["Review"]] = relationship(
        "Review",
        foreign_keys="Review.reviewer_id",
        back_populates="reviewer",
    )

    reviews_received: Mapped[list["Review"]] = relationship(
        "Review",
        foreign_keys="Review.reviewee_id",
        back_populates="reviewee",
    )

    def __repr__(self) -> str:
        return f"<User(email='{self.email}')>"