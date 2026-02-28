"""
Rutas de mensajes: inbox, envío, lectura
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query

from app.auth.jwt import get_current_user_uid
from app.auth.schemas import MessageResponse
from app.messages.schemas import (
    MessagePreview,
    MessageThread,
    CreateMessageRequest,
    ReplyMessageRequest,
    UnreadCount,
)
from app.services.airtable import AirtableService

router = APIRouter()


@router.get("", response_model=list[MessagePreview])
async def get_messages(
    user_uid: str = Depends(get_current_user_uid),
    unread_only: bool = Query(False, description="Solo mensajes no leídos"),
    limit: int = Query(50, ge=1, le=100),
):
    """
    Obtiene los mensajes del usuario (inbox).
    Ordenados por fecha, más recientes primero.
    """
    airtable = AirtableService()
    
    messages = await airtable.get_user_messages(
        user_id=user_uid,
        unread_only=unread_only,
        limit=limit,
    )
    
    return messages


@router.get("/unread-count", response_model=UnreadCount)
async def get_unread_count(user_uid: str = Depends(get_current_user_uid)):
    """
    Obtiene el número de mensajes no leídos.
    Útil para mostrar badge en la UI.
    """
    airtable = AirtableService()
    
    count = await airtable.count_unread_messages(user_uid)
    
    return UnreadCount(count=count)


@router.get("/{message_id}", response_model=MessageThread)
async def get_message(
    message_id: str,
    user_uid: str = Depends(get_current_user_uid)
):
    """
    Obtiene un mensaje con sus respuestas (hilo).
    Marca el mensaje como leído automáticamente.
    """
    airtable = AirtableService()
    
    # Obtener mensaje
    message = await airtable.get_message_by_id(message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensaje no encontrado"
        )
    
    # Verificar que el mensaje pertenece al usuario
    if message["user_id"] != user_uid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este mensaje"
        )
    
    # Marcar como leído si es del admin y no estaba leído
    if message["sender_type"] == "admin" and not message["is_read"]:
        await airtable.mark_message_as_read(message_id)
        message["is_read"] = True
    
    # Obtener respuestas
    replies = await airtable.get_message_replies(message_id)
    
    return MessageThread(
        **message,
        replies=replies,
    )


@router.post("", response_model=MessagePreview, status_code=status.HTTP_201_CREATED)
async def send_message(
    data: CreateMessageRequest,
    user_uid: str = Depends(get_current_user_uid)
):
    """
    Envía un nuevo mensaje.
    Si incluye project_id, el mensaje se asocia a ese proyecto.
    """
    airtable = AirtableService()
    # Si hay project_id, verificar que el usuario tiene acceso
    if data.project_id:
        access = await airtable.check_user_project_access(user_uid, data.project_id)
        if not access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes acceso al proyecto especificado"
            )
    # Crear mensaje
    message = await airtable.create_message(
        user_uid=user_uid,
        subject=data.subject,
        content=data.content,
        project_slug=data.project_id,
        parent_id=getattr(data, "parent_id", None),
    )
    return message


@router.post("/{message_id}/reply", response_model=MessagePreview, status_code=status.HTTP_201_CREATED)
async def reply_to_message(
    message_id: str,
    data: ReplyMessageRequest,
    user_uid: str = Depends(get_current_user_uid)
):
    """
    Responde a un mensaje existente. Permite que cualquier usuario responda a cualquier mensaje.
    """
    airtable = AirtableService()
    # Obtener mensaje original (solo para contexto, no para restricción de acceso)
    original = await airtable.get_message_by_id(message_id)
    if not original:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensaje no encontrado"
        )
    # Clonar ID y slug del proyecto del mensaje padre
    reply = await airtable.create_message(
        user_uid=user_uid,
        subject=f"Re: {original['subject']}",
        content=data.content,
        parent_id=message_id,
        parent_project_id=original.get("project_id"),
        parent_project_slug=original.get("project_title") or original.get("slug_proyecto"),
    )
    return reply


@router.patch("/{message_id}/read", response_model=MessageResponse)
async def mark_as_read(
    message_id: str,
    user_uid: str = Depends(get_current_user_uid)
):
    """
    Marca un mensaje como leído manualmente.
    """
    airtable = AirtableService()
    
    # Verificar acceso
    message = await airtable.get_message_by_id(message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensaje no encontrado"
        )
    
    if message["user_id"] != user_uid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este mensaje"
        )
    
    await airtable.mark_message_as_read(message_id)
    
    return MessageResponse(message="Mensaje marcado como leído")
