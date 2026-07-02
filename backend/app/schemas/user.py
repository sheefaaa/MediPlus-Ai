from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserProfileOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    age: int | None = None
    gender: str | None = None
    avatar_url: str | None = None
    notification_enabled: bool
    theme: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    age: int | None = None
    gender: str | None = None
    avatar_url: str | None = None
    notification_enabled: bool | None = None
    theme: str | None = None
    current_password: str | None = None
    new_password: str | None = Field(default=None, min_length=6, max_length=120)
