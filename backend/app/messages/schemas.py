"""
Schemas de mensajes - Pydantic models
"""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Literal


class MessageBase(BaseModel):
    """Datos básicos de un mensaje"""
    id: str
    subject: str
    content: str
    sender_type: Literal["user", "admin"]
    is_read: bool = False
    created_at: datetime
    project_id: str | None = None
    parent_id: str | None = None


class MessagePreview(BaseModel):
    """Vista previa de mensaje (para listados)"""
    id: str
    subject: str
    preview: str  # Primeros ~100 caracteres del contenido
    sender_type: Literal["user", "admin"]
    is_read: bool
    created_at: datetime
    project_id: str | None = None
    project_title: str | None = None
    parent_id: str | None = None


class MessageThread(BaseModel):
    """Mensaje con sus respuestas"""
    id: str
    subject: str
    content: str
    sender_type: Literal["user", "admin"]
    is_read: bool
    created_at: datetime
    project_id: str | None = None
    project_title: str | None = None
    parent_id: str | None = None
    replies: list["MessageBase"] = []


class CreateMessageRequest(BaseModel):
    """Datos para crear un mensaje"""
    subject: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=10, max_length=5000)
    project_id: str | None = Field(None, description="ID del proyecto relacionado (opcional)")


class ReplyMessageRequest(BaseModel):
    """Datos para responder a un mensaje"""
    content: str = Field(..., min_length=10, max_length=5000)


class UnreadCount(BaseModel):
    """Conteo de mensajes no leídos"""
    count: int


# Resolver referencia forward
MessageThread.model_rebuild()
