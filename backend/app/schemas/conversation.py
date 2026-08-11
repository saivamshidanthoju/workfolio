from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ConversationResponse(BaseModel):
    id: UUID
    assignment_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True