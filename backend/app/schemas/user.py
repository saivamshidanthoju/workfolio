import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr

    is_admin: bool
    is_verified: bool
    is_active: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class CurrentUserResponse(UserResponse):
    last_login: datetime | None