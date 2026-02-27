"""
Entry point de la API - Rincón de Fuentegrande
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.projects.routes import router as projects_router
from app.messages.routes import router as messages_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API para el portal de clientes de Rincón de Fuentegrande",
    version="1.0.0",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/api/health")
async def health_check():
    """Endpoint para verificar que la API está funcionando"""
    return {"status": "ok", "service": settings.app_name}


# Routers
app.include_router(auth_router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(users_router, prefix="/api/users", tags=["Usuarios"])
app.include_router(projects_router, prefix="/api/projects", tags=["Proyectos"])
app.include_router(messages_router, prefix="/api/messages", tags=["Mensajes"])
