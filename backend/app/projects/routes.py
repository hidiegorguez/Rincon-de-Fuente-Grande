"""
Rutas de proyectos: públicos y del portal de usuario
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional

from app.auth.jwt import get_current_user_id, get_current_user_uid
from app.projects.schemas import (
    ProjectBase,
    ProjectDetail,
    ProjectWithUpdates,
    ProjectUpdate,
    ProjectUpdateWithProject,
)
from app.services.airtable import AirtableService

router = APIRouter()


# ============================================
# RUTAS PÚBLICAS (sin autenticación)
# ============================================

@router.get("/public", response_model=list[ProjectBase])
async def get_public_projects(
    featured_only: bool = Query(False, description="Solo proyectos destacados"),
    status: Optional[str] = Query(None, description="Filtrar por estado"),
    limit: int = Query(50, ge=1, le=100),
):
    """
    Obtiene los proyectos públicos (is_public = true).
    Para el portfolio de la web.
    """
    airtable = AirtableService()
    
    projects = await airtable.get_public_projects(
        featured_only=featured_only,
        status=status,
        limit=limit,
    )
    
    return projects


@router.get("/public/{slug}", response_model=ProjectDetail)
async def get_public_project_by_slug(slug: str):
    """
    Obtiene un proyecto público por su slug.
    Para la página de detalle del portfolio.
    """
    airtable = AirtableService()
    
    project = await airtable.get_project_by_slug(slug)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    if not project.get("is_public", False):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    return project


# ============================================
# RUTAS DEL PORTAL (requieren autenticación)
# ============================================

@router.get("/my-projects", response_model=list[ProjectBase])
async def get_user_projects(user_uid: str = Depends(get_current_user_uid)):
    """
    Obtiene los proyectos asignados al usuario autenticado.
    Para el dashboard del portal.
    """
    airtable = AirtableService()
    
    projects = await airtable.get_user_projects(user_uid)
    
    return projects


@router.get("/my-updates", response_model=list[ProjectUpdateWithProject])
async def get_user_updates(
    user_uid: str = Depends(get_current_user_uid),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Obtiene las últimas actualizaciones de todos los proyectos del usuario.
    Para el dashboard del portal.
    """
    airtable = AirtableService()
    updates = await airtable.get_user_all_updates(user_uid, limit=limit)
    return updates


@router.get("/my-projects/{slug}", response_model=ProjectWithUpdates)
async def get_user_project_detail(
    slug: str,
    user_uid: str = Depends(get_current_user_uid)
):
    """
    Obtiene el detalle de un proyecto del usuario,
    incluyendo las actualizaciones.
    """
    airtable = AirtableService()
    
    # Verificar que el usuario tiene acceso al proyecto
    access = await airtable.check_user_project_access(user_uid, slug)
    if not access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este proyecto"
        )
    
    # Obtener proyecto con updates y mensajes
    project = await airtable.get_project_by_slug(slug)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    updates = await airtable.get_project_updates(slug)
    messages = await airtable.get_project_messages(slug)

    return ProjectWithUpdates(
        **project,
        user_role=access["role"],
        updates=updates,
        messages=messages,
    )


@router.get("/my-projects/{slug}/updates", response_model=list[ProjectUpdate])
async def get_user_project_updates(
    slug: str,
    user_id: str = Depends(get_current_user_id),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Obtiene solo las actualizaciones de un proyecto.
    Útil para cargar más actualizaciones con paginación.
    """
    airtable = AirtableService()
    
    # Verificar acceso
    access = await airtable.check_user_project_access(user_id, slug)
    if not access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este proyecto"
        )
    
    # Obtener el proyecto para sacar su ID
    project = await airtable.get_project_by_slug(slug)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyecto no encontrado"
        )
    
    updates = await airtable.get_project_updates(slug, limit=limit)
    
    return updates
