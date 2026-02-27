"""
Schemas de proyectos - Pydantic models
"""
from datetime import datetime
from pydantic import BaseModel
from typing import Literal


class ProjectLocation(BaseModel):
    """Ubicación del proyecto"""
    city: str
    province: str
    region: str


class ProjectInvestment(BaseModel):
    """Detalles de inversión"""
    purchase_price: float
    reform_cost: float | None = None
    total_investment: float
    current_value: float | None = None
    monthly_rent: float | None = None
    annual_return: float  # Porcentaje


class ProjectImage(BaseModel):
    """Imagen con URL y nombre"""
    url: str
    filename: str | None = None


class ProjectBase(BaseModel):
    """Datos básicos de proyecto (para listados)"""
    id: str
    slug: str
    title: str
    location: ProjectLocation
    type: Literal["alquiler", "reforma-venta", "construccion", "mixto"]
    short_description: str
    main_image: ProjectImage | None = None
    status: Literal["completed", "in-progress", "planned"]
    year: int
    featured: bool = False


class ProjectDetail(ProjectBase):
    """Proyecto completo con todos los detalles"""
    description: str
    investment_details: ProjectInvestment
    features: list[str] = []
    gallery: list[ProjectImage] = []
    images: list[ProjectImage] = []


class ProjectUpdate(BaseModel):
    """Actualización de un proyecto"""
    id: str
    project_id: str
    title: str
    content: str
    update_type: Literal["Avance", "Foto", "Documento", "Hito"]
    attachments: list[ProjectImage] = []
    published_at: datetime


class ProjectMessage(BaseModel):
    """Mensaje de un proyecto"""
    id: str
    user_id: str
    user_name: str = "Usuario"
    subject: str
    content: str
    created_at: datetime | None = None
    parent_id: str | None = None


class UserProjectAccess(BaseModel):
    """Acceso del usuario a un proyecto"""
    project_id: str
    role: Literal["Responsable", "Inversor", "Observador"]
    assigned_at: datetime


class ProjectWithUpdates(ProjectDetail):
    """Proyecto con sus actualizaciones y mensajes"""
    user_role: Literal["Responsable", "Inversor", "Observador"] | None = None
    updates: list[ProjectUpdate] = []
    messages: list[ProjectMessage] = []
