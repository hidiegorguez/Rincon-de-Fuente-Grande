"""
Schemas de autenticación - Pydantic models
"""
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Datos para registro de usuario"""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Mínimo 8 caracteres")
    name: str = Field(..., min_length=2, max_length=100)
    phone: str | None = Field(None, max_length=20)


class LoginRequest(BaseModel):
    """Datos para inicio de sesión"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Respuesta con token JWT"""
    access_token: str
    token_type: str = "bearer"
    user: "UserBasic"


class UserBasic(BaseModel):
    """Datos básicos del usuario (sin info sensible)"""
    id: str
    email: str
    name: str
    phone: str | None = None


class MessageResponse(BaseModel):
    """Respuesta genérica con mensaje"""
    message: str


# Para resolver la referencia forward de TokenResponse
TokenResponse.model_rebuild()
