"""
Configuración del backend - Variables de entorno
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración de la aplicación desde variables de entorno"""
    
    # App
    app_name: str = "Rincón de Fuentegrande API"
    debug: bool = False
    
    # CORS - URLs del frontend permitidas
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # JWT
    jwt_secret_key: str = "CAMBIAR-EN-PRODUCCION-usar-openssl-rand-hex-32"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 2  # 2 horas
    
    # Airtable
    airtable_api_key: str = ""
    airtable_base_id: str = ""
    
    # Nombres de tablas en Airtable
    airtable_users_table: str = "Users"
    airtable_projects_table: str = "Projects"
    airtable_user_projects_table: str = "UserProjects"
    airtable_project_updates_table: str = "ProjectUpdates"
    airtable_messages_table: str = "Messages"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Obtiene la configuración cacheada"""
    return Settings()
