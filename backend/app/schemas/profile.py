from uuid import UUID

from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    bio: str | None = None
    address: str | None = None
    location: str | None = None



class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    full_name: str | None
    phone: str | None
    bio: str | None
    address: str | None
    location: str | None
    profile_image: str | None

    class Config:
        from_attributes = True