"""
Rutas de autenticación: registro, login, logout
"""
from fastapi import APIRouter, HTTPException, status, Depends

from app.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserBasic,
    MessageResponse,
)
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token, get_current_user_id
from app.services.airtable import AirtableService

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest):
    """
    Registra un nuevo usuario.
    
    - Verifica que el email no esté ya registrado
    - Hashea la contraseña con bcrypt
    - Crea el usuario en Airtable
    - Devuelve token JWT para login automático
    """
    airtable = AirtableService()
    
    # Verificar si el email ya existe
    existing_user = await airtable.get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este email ya está registrado"
        )
    
    # Hashear contraseña
    password_hash = hash_password(data.password)
    
    # Crear usuario en Airtable
    user = await airtable.create_user(
        email=data.email,
        name=data.name,
        password_hash=password_hash,
        phone=data.phone,
    )
    
    # Generar token (incluimos record_id y user_id personalizado)
    access_token = create_access_token(data={
        "sub": user["id"],  # record ID de Airtable
        "uid": user["user_id"],  # ID personalizado (para búsquedas en tablas relacionadas)
    })
    
    return TokenResponse(
        access_token=access_token,
        user=UserBasic(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            phone=user.get("phone"),
        )
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """
    Inicia sesión con email y contraseña.
    
    - Busca el usuario por email
    - Verifica la contraseña
    - Devuelve token JWT
    """
    airtable = AirtableService()
    
    # Buscar usuario
    user = await airtable.get_user_by_email(data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Verificar contraseña
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Actualizar último login y conexiones
    await airtable.update_user_last_login(user["id"], user.get("conexiones", 0))
    
    # Generar token (incluimos record_id y user_id personalizado)
    access_token = create_access_token(data={
        "sub": user["id"],  # record ID de Airtable
        "uid": user["user_id"],  # ID personalizado
    })
    
    return TokenResponse(
        access_token=access_token,
        user=UserBasic(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            phone=user.get("phone"),
        )
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(user_id: str = Depends(get_current_user_id)):
    """
    Cierra la sesión del usuario.
    
    Nota: Con JWT stateless, el logout real ocurre en el cliente
    eliminando el token. Este endpoint es para logging/auditoría.
    """
    # Aquí podrías agregar el token a una blacklist si implementas una
    # O simplemente registrar el logout para auditoría
    return MessageResponse(message="Sesión cerrada correctamente")


@router.get("/me", response_model=UserBasic)
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    """
    Obtiene los datos del usuario autenticado.
    
    Útil para verificar si el token sigue siendo válido
    y obtener datos actualizados del usuario.
    """
    airtable = AirtableService()
    
    user = await airtable.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserBasic(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        phone=user.get("phone"),
    )
