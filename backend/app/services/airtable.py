"""
Cliente de Airtable - Servicio para interactuar con la base de datos
"""
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import quote
import httpx

from app.config import get_settings

settings = get_settings()


class AirtableService:
    """
    Servicio para interactuar con Airtable.
    
    Usa la API REST de Airtable para CRUD de registros.
    Documentación: https://airtable.com/developers/web/api/introduction
    
    MAPEO DE CAMPOS (código → Airtable):
    
    Usuarios:
        email → Email
        name → Nombre
        phone → Teléfono
        password_hash → Contraseña
        is_verified → Cuenta verificada
        is_active → Cuenta activa
        created_at → Fecha registro
        last_login → Último inicio
    
    Proyectos:
        slug → Slug
        title → Título
        is_public → Público
        status → Estado
    
    Proyectos de Usuario:
        user_id → ID Usuario
        project_id → ID Proyecto
        role → Rol
        assigned_at → Asignación
    
    Actualizaciones:
        project_id → ID Proyecto
        title → Título
        content → Contenido
        update_type → Tipo
        attachments → Media
        published_at → Fecha
    
    Mensajes:
        user_id → ID Usuario
        project_id → ID Proyecto
        subject → Título
        content → Contenido
        sender_type → Tipo emisor
        is_read → Leído
        created_at → Fecha
        parent_id → ID Padre
    """
    
    def __init__(self):
        self.base_url = f"https://api.airtable.com/v0/{settings.airtable_base_id}"
        self.headers = {
            "Authorization": f"Bearer {settings.airtable_api_key}",
            "Content-Type": "application/json",
        }
    
    # ============================================
    # USUARIOS
    # ============================================
    
    def _get_table_url(self, table_name: str) -> str:
        """Construye la URL de una tabla codificando espacios"""
        return f"{self.base_url}/{quote(table_name)}"
    
    async def get_user_by_email(self, email: str) -> Optional[dict]:
        """Busca un usuario por email"""
        async with httpx.AsyncClient() as client:
            # Usar filterByFormula para buscar por email
            formula = f"{{Email}} = '{email}'"
            response = await client.get(
                self._get_table_url(settings.airtable_users_table),
                headers=self.headers,
                params={"filterByFormula": formula, "maxRecords": 1},
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            if not records:
                return None
            
            return self._parse_user(records[0])
    
    async def get_user_by_uid(self, uid: str) -> Optional[dict]:
        """Busca un usuario por su ID corto (uid)"""
        async with httpx.AsyncClient() as client:
            formula = f"{{ID}} = '{uid}'"
            response = await client.get(
                self._get_table_url(settings.airtable_users_table),
                headers=self.headers,
                params={"filterByFormula": formula, "maxRecords": 1},
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            if not records:
                return None
            
            return self._parse_user(records[0])
    
    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        """Obtiene un usuario por su ID de Airtable"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self._get_table_url(settings.airtable_users_table)}/{user_id}",
                    headers=self.headers,
                )
                response.raise_for_status()
                return self._parse_user(response.json())
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    return None
                raise
    
    async def create_user(
        self,
        email: str,
        name: str,
        password_hash: str,
        phone: Optional[str] = None,
    ) -> dict:
        """Crea un nuevo usuario"""
        import uuid
        
        async with httpx.AsyncClient() as client:
            # Generar ID único corto (8 caracteres)
            user_id = uuid.uuid4().hex[:8].upper()
            now = datetime.now(timezone.utc).isoformat()
            
            data = {
                "fields": {
                    "ID": user_id,
                    "Email": email,
                    "Nombre": name,
                    "Contraseña": password_hash,
                    "Cuenta verificada": False,
                    "Cuenta activa": True,
                    "Último inicio": now,
                }
            }
            if phone:
                data["fields"]["Teléfono"] = phone
            
            response = await client.post(
                self._get_table_url(settings.airtable_users_table),
                headers=self.headers,
                json=data,
            )
            response.raise_for_status()
            return self._parse_user(response.json())
    
    async def update_user(self, user_id: str, data: dict) -> dict:
        """Actualiza campos de un usuario. Mapea nombres internos a Airtable."""
        # Mapeo de nombres internos a nombres de Airtable
        field_mapping = {
            "name": "Nombre",
            "phone": "Teléfono",
            "password_hash": "Contraseña",
            "is_verified": "Cuenta verificada",
            "last_login": "Último inicio",
        }
        
        # Convertir nombres de campos
        airtable_data = {}
        for key, value in data.items():
            airtable_key = field_mapping.get(key, key)
            airtable_data[airtable_key] = value
        
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{self._get_table_url(settings.airtable_users_table)}/{user_id}",
                headers=self.headers,
                json={"fields": airtable_data},
            )
            response.raise_for_status()
            return self._parse_user(response.json())
    
    async def update_user_last_login(self, user_id: str) -> None:
        """Actualiza la fecha de último login"""
        # Formato ISO completo con hora para campos DateTime de Airtable
        await self.update_user(user_id, {
            "last_login": datetime.now(timezone.utc).isoformat()
        })
    
    def _parse_user(self, record: dict) -> dict:
        """Parsea un registro de Airtable a dict de usuario"""
        fields = record.get("fields", {})
        return {
            "id": record["id"],
            "user_id": fields.get("ID", ""),
            "email": fields.get("Email", ""),
            "name": fields.get("Nombre", ""),
            "phone": fields.get("Teléfono"),
            "password_hash": fields.get("Contraseña", ""),
            "is_verified": fields.get("Cuenta verificada", False),
            "last_login": fields.get("Último inicio"),
        }
    
    # ============================================
    # PROYECTOS
    # ============================================
    
    async def get_public_projects(
        self,
        featured_only: bool = False,
        status: Optional[str] = None,
        limit: int = 50,
    ) -> list[dict]:
        """Obtiene proyectos públicos"""
        async with httpx.AsyncClient() as client:
            # Construir fórmula de filtro
            conditions = ["{Público} = TRUE()"]
            if featured_only:
                conditions.append("{Destacado} = TRUE()")
            if status:
                conditions.append(f"{{Estado}} = '{status}'")
            
            formula = f"AND({', '.join(conditions)})"
            
            response = await client.get(
                self._get_table_url(settings.airtable_projects_table),
                headers=self.headers,
                params={
                    "filterByFormula": formula,
                    "maxRecords": limit,
                },
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            return [self._parse_project(r) for r in records]
    
    async def get_project_by_slug(self, slug: str) -> Optional[dict]:
        """Obtiene un proyecto por su slug"""
        async with httpx.AsyncClient() as client:
            formula = f"{{Slug}} = '{slug}'"
            response = await client.get(
                self._get_table_url(settings.airtable_projects_table),
                headers=self.headers,
                params={"filterByFormula": formula, "maxRecords": 1},
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            if not records:
                return None
            
            return self._parse_project(records[0], full=True)
    
    async def get_user_projects(self, user_id: str) -> list[dict]:
        """Obtiene los proyectos asignados a un usuario"""
        async with httpx.AsyncClient() as client:
            # Para linked records, usamos FIND para buscar en el array
            formula = f"FIND('{user_id}', ARRAYJOIN({{ID Usuario}}))"
            response = await client.get(
                self._get_table_url(settings.airtable_user_projects_table),
                headers=self.headers,
                params={"filterByFormula": formula},
            )
            response.raise_for_status()
            
            assignments = response.json().get("records", [])
            
            if not assignments:
                return []
            
            # Obtener los slugs de proyectos (usando campo Lookup "Slug Proyecto")
            project_slugs = []
            for a in assignments:
                slug = a["fields"].get("Slug Proyecto")
                if slug:
                    # Lookup fields devuelven arrays
                    if isinstance(slug, list):
                        project_slugs.extend(slug)
                    else:
                        project_slugs.append(slug)
            
            # Obtener los proyectos por slug
            projects = []
            for slug in project_slugs:
                project = await self.get_project_by_slug(slug)
                if project:
                    projects.append(project)
            
            return projects
    
    async def _get_project_by_record_id(self, record_id: str) -> Optional[dict]:
        """Obtiene un proyecto por su record_id de Airtable (linked records devuelven esto)"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self._get_table_url(settings.airtable_projects_table)}/{record_id}",
                    headers=self.headers,
                )
                response.raise_for_status()
                return self._parse_project(response.json(), full=False)
            except httpx.HTTPStatusError as e:
                print(f"Error obteniendo proyecto {record_id}: {e.response.status_code}")
                if e.response.status_code == 404:
                    return None
                raise

    async def check_user_project_access(self, user_id: str, project_slug: str) -> Optional[dict]:
        """Verifica si un usuario tiene acceso a un proyecto"""
        async with httpx.AsyncClient() as client:
            # Usamos Slug Proyecto (Lookup) para buscar por slug
            formula = f"AND(FIND('{user_id}', ARRAYJOIN({{ID Usuario}})), FIND('{project_slug}', ARRAYJOIN({{Slug Proyecto}})))"
            response = await client.get(
                self._get_table_url(settings.airtable_user_projects_table),
                headers=self.headers,
                params={"filterByFormula": formula, "maxRecords": 1},
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            if not records:
                return None
            
            fields = records[0].get("fields", {})
            return {
                "project_id": fields.get("ID Proyecto"),
                "role": fields.get("Rol", "viewer"),
                "assigned_at": fields.get("Asignación"),
            }
    
    async def get_project_updates(self, project_slug: str, limit: int = 20) -> list[dict]:
        """Obtiene las actualizaciones de un proyecto por su slug"""
        async with httpx.AsyncClient() as client:
            # Usar Lookup "Slug Proyecto" para buscar por slug
            formula = f"FIND('{project_slug}', ARRAYJOIN({{Slug Proyecto}}))"
            response = await client.get(
                self._get_table_url(settings.airtable_project_updates_table),
                headers=self.headers,
                params={
                    "filterByFormula": formula,
                    "maxRecords": limit,
                    "sort[0][field]": "Fecha",
                    "sort[0][direction]": "desc",
                },
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            return [self._parse_project_update(r) for r in records]
    
    async def get_project_messages(self, project_slug: str, limit: int = 50) -> list[dict]:
        """Obtiene los mensajes de un proyecto por su slug"""
        async with httpx.AsyncClient() as client:
            # Usar Lookup "Slug Proyecto" para buscar por slug
            formula = f"FIND('{project_slug}', ARRAYJOIN({{Slug Proyecto}}))"
            response = await client.get(
                self._get_table_url(settings.airtable_messages_table),
                headers=self.headers,
                params={
                    "filterByFormula": formula,
                    "maxRecords": limit,
                    "sort[0][field]": "Fecha",
                    "sort[0][direction]": "desc",
                },
            )
            
            if response.status_code != 200:
                print(f"Error Airtable mensajes: {response.status_code}")
                print(f"Response: {response.text}")
            
            response.raise_for_status()
            
            records = response.json().get("records", [])
            return [self._parse_message_for_project(r) for r in records]
    
    def _parse_message_for_project(self, record: dict) -> dict:
        """Parsea mensaje para mostrar en proyecto"""
        fields = record.get("fields", {})
        
        # Linked records que devuelven arrays
        user_id = fields.get("ID Usuario")
        if isinstance(user_id, list):
            user_id = user_id[0] if user_id else ""
        
        # Lookup para nombre de usuario
        user_name = fields.get("Nombre Usuario")
        if isinstance(user_name, list):
            user_name = user_name[0] if user_name else "Usuario"
        
        return {
            "id": fields.get("ID", ""),
            "user_id": user_id,
            "user_name": user_name,
            "subject": fields.get("Título", ""),
            "content": fields.get("Contenido", ""),
            "created_at": fields.get("Fecha"),
            "parent_id": fields.get("ID Padre"),
        }
    
    def _parse_project(self, record: dict, full: bool = False) -> dict:
        """Parsea un registro de proyecto"""
        fields = record.get("fields", {})
        
        # Parsear imagen principal (si existe el campo)
        main_image = None
        if fields.get("Imagen principal"):
            img = fields["Imagen principal"][0] if isinstance(fields["Imagen principal"], list) else fields["Imagen principal"]
            main_image = {"url": img.get("url", ""), "filename": img.get("filename")}
        
        # Mapeo de estados español → inglés
        status_mapping = {
            "En progreso": "in-progress",
            "Completado": "completed",
            "Planificado": "planned",
            # También aceptar valores en inglés directamente
            "in-progress": "in-progress",
            "completed": "completed",
            "planned": "planned",
        }
        raw_status = fields.get("Estado", "planned")
        status = status_mapping.get(raw_status, "planned")
        
        project = {
            "id": record["id"],
            "project_id": fields.get("ID", ""),
            "slug": fields.get("Slug", ""),
            "title": fields.get("Título", ""),
            "location": {
                "city": fields.get("Ciudad", ""),
                "province": fields.get("Provincia", ""),
                "region": fields.get("Región", ""),
            },
            "type": fields.get("Tipo", "alquiler"),
            "short_description": fields.get("Descripción corta", ""),
            "main_image": main_image,
            "status": status,
            "year": fields.get("Año", 2026),
            "featured": fields.get("Destacado", False),
            "is_public": fields.get("Público", False),
        }
        
        if full:
            # Agregar campos adicionales para detalle
            project["description"] = fields.get("Descripción larga", "")
            project["investment_details"] = {
                "purchase_price": fields.get("Precio de compra", 0),
                "reform_cost": fields.get("Coste de reforma"),
                "total_investment": fields.get("Inversión total", 0),
                "current_value": fields.get("Valor actual"),
                "monthly_rent": fields.get("Alquiler mensual"),
                "annual_return": fields.get("Retorno anual", 0),
            }
            
            # Parsear features (asumiendo que vienen separados por líneas o comas)
            features_raw = fields.get("Características", "")
            if features_raw:
                project["features"] = [f.strip() for f in features_raw.replace("\n", ",").split(",") if f.strip()]
            else:
                project["features"] = []
            
            # Parsear galería
            gallery = []
            if fields.get("Galería"):
                for img in fields["Galería"]:
                    gallery.append({"url": img.get("url", ""), "filename": img.get("filename")})
            project["gallery"] = gallery
            
            # Parsear imágenes (campo adicional)
            images = []
            if fields.get("Imágenes"):
                for img in fields["Imágenes"]:
                    images.append({"url": img.get("url", ""), "filename": img.get("filename")})
            project["images"] = images
        
        return project
    
    def _parse_project_update(self, record: dict) -> dict:
        """Parsea un registro de actualización de proyecto"""
        fields = record.get("fields", {})
        
        # Parsear attachments
        attachments = []
        if fields.get("Media"):
            for att in fields["Media"]:
                attachments.append({"url": att.get("url", ""), "filename": att.get("filename")})
        
        # Linked records devuelven arrays, tomar el primer elemento
        project_id = fields.get("ID Proyecto", "")
        if isinstance(project_id, list):
            project_id = project_id[0] if project_id else ""
        
        return {
            "id": record["id"],
            "project_id": project_id,
            "title": fields.get("Título", ""),
            "content": fields.get("Contenido", ""),
            "update_type": fields.get("Tipo", "avance"),
            "attachments": attachments,
            "published_at": fields.get("Fecha"),
        }
    
    # ============================================
    # MENSAJES
    # ============================================
    
    async def get_user_messages(
        self,
        user_id: str,
        unread_only: bool = False,
        limit: int = 50,
    ) -> list[dict]:
        """Obtiene los mensajes de un usuario"""
        async with httpx.AsyncClient() as client:
            conditions = [f"{{ID Usuario}} = '{user_id}'"]
            if unread_only:
                conditions.append("{Leído} = FALSE()")
            
            # Solo mensajes raíz (sin parent_id)
            conditions.append("NOT({ID Padre})")
            
            formula = f"AND({', '.join(conditions)})"
            
            response = await client.get(
                self._get_table_url(settings.airtable_messages_table),
                headers=self.headers,
                params={
                    "filterByFormula": formula,
                    "maxRecords": limit,
                    "sort[0][field]": "Fecha",
                    "sort[0][direction]": "desc",
                },
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            return [self._parse_message_preview(r) for r in records]
    
    async def count_unread_messages(self, user_id: str) -> int:
        """Cuenta mensajes no leídos"""
        async with httpx.AsyncClient() as client:
            formula = f"AND({{ID Usuario}} = '{user_id}', {{Leído}} = FALSE(), {{Tipo emisor}} = 'admin')"
            
            response = await client.get(
                self._get_table_url(settings.airtable_messages_table),
                headers=self.headers,
                params={"filterByFormula": formula},
            )
            response.raise_for_status()
            
            return len(response.json().get("records", []))
    
    async def get_message_by_id(self, message_id: str) -> Optional[dict]:
        """Obtiene un mensaje por ID"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self._get_table_url(settings.airtable_messages_table)}/{message_id}",
                    headers=self.headers,
                )
                response.raise_for_status()
                return self._parse_message_full(response.json())
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    return None
                raise
    
    async def get_message_replies(self, parent_id: str) -> list[dict]:
        """Obtiene las respuestas a un mensaje"""
        async with httpx.AsyncClient() as client:
            formula = f"{{ID Padre}} = '{parent_id}'"
            
            response = await client.get(
                self._get_table_url(settings.airtable_messages_table),
                headers=self.headers,
                params={
                    "filterByFormula": formula,
                    "sort[0][field]": "Fecha",
                    "sort[0][direction]": "asc",
                },
            )
            response.raise_for_status()
            
            records = response.json().get("records", [])
            return [self._parse_message_full(r) for r in records]
    
    async def create_message(
        self,
        user_uid: str,
        subject: str,
        content: str,
        project_slug: Optional[str] = None,
        parent_id: Optional[str] = None,
        parent_project_id: Optional[str] = None,
        parent_project_slug: Optional[str] = None,
    ) -> dict:
        """Crea un nuevo mensaje"""
        import uuid
        
        async with httpx.AsyncClient() as client:
            # Generar ID único para el mensaje
            message_id = uuid.uuid4().hex[:8].upper()
            # Buscar el record_id del usuario
            user = await self.get_user_by_uid(user_uid)
            if not user:
                raise ValueError(f"Usuario no encontrado: {user_uid}")
            user_record_id = user["id"]
            data = {
                "fields": {
                    "ID": message_id,
                    "ID Usuario": [user_record_id],
                    "Título": subject,
                    "Contenido": content,
                }
            }
            # Si hay project_slug, buscar el record_id y guardar ambos
            if project_slug:
                project = await self.get_project_by_slug(project_slug)
                if project:
                    data["fields"]["ID Proyecto"] = [project["id"]]
                    data["fields"]["Slug Proyecto"] = project["slug"]
            # Si viene del mensaje padre, clonar ID y slug del proyecto
            if parent_project_id:
                data["fields"]["ID Proyecto"] = [parent_project_id]
            if parent_project_slug:
                data["fields"]["Slug Proyecto"] = parent_project_slug
            if parent_id:
                data["fields"]["ID Padre"] = parent_id
            response = await client.post(
                self._get_table_url(settings.airtable_messages_table),
                headers=self.headers,
                json=data,
            )
            if response.status_code != 200:
                print(f"Error Airtable: {response.status_code}")
                print(f"Response: {response.text}")
            response.raise_for_status()
            return self._parse_message_preview(response.json())
    
    async def mark_message_as_read(self, message_id: str) -> None:
        """Marca un mensaje como leído"""
        async with httpx.AsyncClient() as client:
            await client.patch(
                f"{self._get_table_url(settings.airtable_messages_table)}/{message_id}",
                headers=self.headers,
                json={"fields": {"Leído": True}},
            )
    
    def _parse_message_preview(self, record: dict) -> dict:
        """Parsea mensaje para listado (preview)"""
        fields = record.get("fields", {})
        content = fields.get("Contenido", "")
        
        # Linked records devuelven arrays
        project_id = fields.get("ID Proyecto")
        if isinstance(project_id, list):
            project_id = project_id[0] if project_id else None
        
        return {
            "id": record["id"],
            "subject": fields.get("Título", ""),
            "preview": content[:100] + "..." if len(content) > 100 else content,
            "sender_type": fields.get("Tipo emisor", "user"),
            "is_read": fields.get("Leído", False),
            "created_at": fields.get("Fecha"),
            "project_id": project_id,
            "project_title": fields.get("Título proyecto"),  # Si usas lookup en Airtable
        }
    
    def _parse_message_full(self, record: dict) -> dict:
        """Parsea mensaje completo"""
        fields = record.get("fields", {})
        
        # Linked records devuelven arrays
        user_record_ids = fields.get("ID Usuario")
        if isinstance(user_record_ids, list):
            user_record_id = user_record_ids[0] if user_record_ids else ""
        else:
            user_record_id = user_record_ids or ""
        print(f"DEBUG: _parse_message_full user_record_id={user_record_id}, user_record_ids={user_record_ids}")
        custom_user_id = ""
        if user_record_id:
            try:
                import requests
                url = f"{self._get_table_url(settings.airtable_users_table)}/{user_record_id}"
                response = requests.get(url, headers=self.headers)
                response.raise_for_status()
                user = self._parse_user(response.json())
                custom_user_id = user.get("user_id", "") if user else ""
                print(f"DEBUG: _parse_message_full usuario encontrado: {user}")
            except Exception as e:
                print(f"DEBUG: Error buscando usuario para mensaje: {e}")
        else:
            print("DEBUG: user_record_id vacío, no se puede buscar usuario.")
            custom_user_id = ""
        
        project_id = fields.get("ID Proyecto")
        if isinstance(project_id, list):
            project_id = project_id[0] if project_id else None
        
        return {
            "id": record["id"],
            "user_id": custom_user_id,
            "user_record_id": user_record_id,
            "subject": fields.get("Título", ""),
            "content": fields.get("Contenido", ""),
            "sender_type": fields.get("Tipo emisor", "user"),
            "is_read": fields.get("Leído", False),
            "created_at": fields.get("Fecha"),
            "project_id": project_id,
            "project_title": fields.get("Título proyecto"),
            "parent_id": fields.get("ID Padre"),
        }

    def get_user_by_id_sync(self, user_record_id: str) -> Optional[dict]:
        """Versión síncrona para obtener usuario por record_id (para parseo)"""
        import requests
        url = f"{self._get_table_url(settings.airtable_users_table)}/{user_record_id}"
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return self._parse_user(response.json())
        except Exception as e:
            print(f"DEBUG: Error in get_user_by_id_sync: {e}")
            return None
