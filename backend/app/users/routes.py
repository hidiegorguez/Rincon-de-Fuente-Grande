"""
Rutas de usuarios: perfil, actualización
"""
from fastapi import APIRouter, HTTPException, status, Depends

from app.auth.jwt import get_current_user_id
from app.auth.password import hash_password, verify_password
from app.auth.schemas import MessageResponse
from app.users.schemas import UserProfile, UpdateProfileRequest, ChangePasswordRequest
from app.services.airtable import AirtableService

router = APIRouter()


@router.get("/profile", response_model=UserProfile)
async def get_profile(user_id: str = Depends(get_current_user_id)):
    """
    Obtiene el perfil completo del usuario autenticado.
    """
    airtable = AirtableService()
    
    user = await airtable.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserProfile(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        phone=user.get("phone"),
        is_verified=user.get("is_verified", False),
        created_at=user.get("created_at"),
        last_login=user.get("last_login"),
    )


@router.patch("/profile", response_model=UserProfile)
async def update_profile(
    data: UpdateProfileRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Actualiza el perfil del usuario.
    Solo se actualizan los campos proporcionados.
    """
    airtable = AirtableService()
    
    # Preparar datos a actualizar (solo los que no son None)
    update_data = {}
    if data.name is not None:
        update_data["name"] = data.name
    if data.phone is not None:
        update_data["phone"] = data.phone
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se proporcionaron datos para actualizar"
        )
    
    # Actualizar en Airtable
    user = await airtable.update_user(user_id, update_data)
    
    return UserProfile(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        phone=user.get("phone"),
        is_verified=user.get("is_verified", False),
        created_at=user.get("created_at"),
        last_login=user.get("last_login"),
    )


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Cambia la contraseña del usuario.
    Requiere la contraseña actual para verificación.
    """
    airtable = AirtableService()
    
    # Obtener usuario con contraseña
    user = await airtable.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Verificar contraseña actual
    if not verify_password(data.current_password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta"
        )
    
    # Hashear nueva contraseña y guardar
    new_hash = hash_password(data.new_password)
    await airtable.update_user(user_id, {"password_hash": new_hash})
    
    return MessageResponse(message="Contraseña actualizada correctamente")
