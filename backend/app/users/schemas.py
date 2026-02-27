"""
Schemas de usuarios - Pydantic models
"""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserProfile(BaseModel):
    """Perfil completo del usuario"""
    id: str
    email: str
    name: str
    phone: str | None = None
    is_verified: bool = False
    created_at: datetime | None = None
    last_login: datetime | None = None


class UpdateProfileRequest(BaseModel):
    """Datos para actualizar el perfil"""
    name: str | None = Field(None, min_length=2, max_length=100)
    phone: str | None = Field(None, max_length=20)


class ChangePasswordRequest(BaseModel):
    """Datos para cambiar contraseña"""
    current_password: str
    new_password: str = Field(..., min_length=8)
