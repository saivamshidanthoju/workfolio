from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import NotificationType


class NotificationResponse(BaseModel):
    id: UUID
    recipient_id: UUID
    title: str
    message: str
    type: NotificationType
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True