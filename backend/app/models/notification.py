from __future__ import annotations

import uuid

from sqlalchemy import Boolean, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import NotificationType


class Notification(BaseModel):
    __tablename__ = "notifications"

    recipient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType),
        nullable=False,
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # -------------------------
    # Relationships
    # -------------------------

    recipient: Mapped["User"] = relationship(
        "User",
        back_populates="received_notifications",
    )

    def __repr__(self) -> str:
        return (
            f"<Notification(recipient_id={self.recipient_id}, "
            f"type={self.type.value})>"
        )