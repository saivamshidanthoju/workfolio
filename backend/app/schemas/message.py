from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class MessageCreate(BaseModel):
    message: str
    attachment: str | None = None


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    message: str
    attachment: str | None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True