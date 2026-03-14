/**
 * Página del Portal de Cliente
 * Muestra los proyectos y últimas actualizaciones del usuario autenticado
 */
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, FileText, User, LogOut, ChevronRight, MapPin } from 'lucide-react';
import { Section } from '@/components/common';
import { useAuth } from '@/contexts';

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Tipo para proyecto
interface Project {
  id: string;
  slug: string;
  title: string;
  location: {
    city: string;
    province: string;
  };
  status: string;
  type: string;
  short_description: string;
  main_image: { url: string; filename: string } | null;
}

interface Update {
  id: string;
  title: string;
  content: string;
  update_type: string;
  published_at: string;
  project_slug: string;
  project_title: string;
}

export function PortalPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Cargar proyectos del usuario
  useEffect(() => {
    async function fetchProjects() {
      if (!token) return;
      
      try {
        const response = await fetch(`${API_URL}/api/projects/my-projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar proyectos');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setErrorProjects('No se pudieron cargar los proyectos');
      } finally {
        setLoadingProjects(false);
      }
    }
    
    if (isAuthenticated && token) {
      fetchProjects();
    }
  }, [isAuthenticated, token]);

  // Cargar actualizaciones
  useEffect(() => {
    async function fetchUpdates() {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/projects/my-updates?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          setUpdates(await response.json());
        }
      } catch (err) {
        console.error('Error fetching updates:', err);
      } finally {
        setLoadingUpdates(false);
      }
    }
    if (isAuthenticated && token) {
      fetchUpdates();
    }
  }, [isAuthenticated, token]);

  if (isLoading) {
    return (
      <>
        {/* Hero skeleton */}
        <section
          className="bg-linear-to-t from-white-200 to-primary-300"
          style={{ paddingTop: '7rem', paddingBottom: '1rem' }}
        >
          <div className="layout-container">
            <div className="bg-primary-200/50 rounded animate-pulse" style={{ width: '14rem', height: '2rem', marginBottom: '1rem' }} />
            <div className="bg-primary-200/30 rounded animate-pulse" style={{ width: '24rem', maxWidth: '100%', height: '1.25rem' }} />
          </div>
        </section>

        <Section background="light" paddingY="lg">
          <div className="grid-2-cols">
            {/* Proyectos skeleton */}
            <div className="bg-white rounded-md shadow-md" style={{ padding: '2rem' }}>
              <div className="flex items-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="bg-neutral-200 rounded-full animate-pulse" style={{ width: '3rem', height: '3rem' }} />
                <div className="bg-neutral-200 rounded animate-pulse" style={{ width: '8rem', height: '1.5rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-neutral-100 rounded-md animate-pulse" style={{ height: '5rem' }} />
                ))}
              </div>
            </div>
            {/* Actualizaciones skeleton */}
            <div className="bg-white rounded-md shadow-md" style={{ padding: '2rem' }}>
              <div className="flex items-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="bg-neutral-200 rounded-full animate-pulse" style={{ width: '3rem', height: '3rem' }} />
                <div className="bg-neutral-200 rounded animate-pulse" style={{ width: '12rem', height: '1.5rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-neutral-100 rounded-md animate-pulse" style={{ height: '4rem' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Perfil skeleton */}
          <div className="bg-white rounded-md shadow-md" style={{ padding: '2rem', marginTop: '2rem' }}>
            <div className="flex items-center" style={{ gap: '1rem' }}>
              <div className="bg-neutral-200 rounded-full animate-pulse" style={{ width: '3rem', height: '3rem' }} />
              <div>
                <div className="bg-neutral-200 rounded animate-pulse" style={{ width: '10rem', height: '1.25rem', marginBottom: '0.5rem' }} />
                <div className="bg-neutral-100 rounded animate-pulse" style={{ width: '14rem', height: '1rem' }} />
              </div>
            </div>
          </div>
        </Section>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Helper para traducir estado
  // Las claves deben coincidir con el backend (airtable.py → status_mapping)
  // Valores actuales en Airtable: "En progreso", "Completado" → backend envía: "in-progress", "completed", "planned"
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'planned': 'Planificado',
      'in-progress': 'En progreso',
      'completed': 'Completado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'planned': 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
  };

  const getUpdateTypeInfo = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      'Avance': { label: 'Avance', color: 'bg-blue-100 text-blue-700' },
      'Hito': { label: 'Hito', color: 'bg-green-100 text-green-700' },
      'Documento': { label: 'Documento', color: 'bg-purple-100 text-purple-700' },
      'Foto': { label: 'Foto', color: 'bg-orange-100 text-orange-700' },
    };
    return types[type] || { label: type, color: 'bg-neutral-100 text-neutral-700' };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  return (
    <>
      {/* Hero */}
      <section 
        className="bg-linear-to-t from-white-200 to-primary-300"
        style={{ paddingTop: '7rem', paddingBottom: '1rem' }}
      >
        <div className="layout-container">
          <div className="max-w-3xl">
            <h1 
              className="text-2xl md:text-3xl font-bold text-accent-900"
              style={{ marginBottom: '1rem' }}
            >
              Bienvenido, {user?.name?.split(' ')[0]}
            </h1>
            <p className="md:text-lg text-neutral-600">
              Este es tu portal de cliente. Aquí puedes ver tus proyectos y sus actualizaciones.
            </p>
          </div>
        </div>
      </section>

      <Section background="light" paddingY="lg">
        <div className="grid-2-cols">
          {/* Tarjeta de Proyectos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="bg-white rounded-md shadow-md h-full"
              style={{ padding: '2rem' }}
            >
              <div className="flex items-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="bg-primary-100 rounded-full" style={{ padding: '0.75rem' }}>
                  <FolderOpen className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-800">
                  Mis Proyectos
                </h2>
              </div>
              
              {loadingProjects ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-neutral-100 rounded-md animate-pulse" style={{ height: '5rem' }} />
                  ))}
                </div>
              ) : errorProjects ? (
                <p className="text-red-500">{errorProjects}</p>
              ) : projects.length === 0 ? (
                <>
                  <p className="text-neutral-600" style={{ marginBottom: '1.5rem' }}>
                    Aún no tienes proyectos asignados. Cuando formes parte de un proyecto, 
                    aparecerá aquí con todas sus actualizaciones.
                  </p>
                  <div className="text-sm text-neutral-500 bg-neutral-50 rounded-sm" style={{ padding: '1rem' }}>
                    💡 Los proyectos son asignados por el administrador. 
                    Si crees que debería aparecer alguno, contáctanos.
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/portal/proyecto/${project.slug}`}
                      className="flex items-stretch rounded-md border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors overflow-hidden"
                    >
                      {project.main_image ? (
                        <div
                          className="shrink-0"
                          style={{
                            width: '5.5rem',
                            backgroundImage: `url(${project.main_image.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      ) : (
                        <div
                          className="bg-neutral-100 shrink-0 flex items-center justify-center"
                          style={{ width: '5.5rem' }}
                        >
                          <FolderOpen className="w-6 h-6 text-neutral-300" />
                        </div>
                      )}
                      <div className="flex items-center justify-between flex-1 min-w-0" style={{ padding: '0.75rem 1rem' }}>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-neutral-800" style={{ marginBottom: '0.25rem' }}>
                            {project.title}
                          </h3>
                          <div className="flex items-center text-sm text-neutral-500" style={{ gap: '0.25rem', marginBottom: '0.5rem' }}>
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{project.location.city}, {project.location.province}</span>
                          </div>
                          <span
                            className={`text-xs rounded-full font-medium ${getStatusColor(project.status)}`}
                            style={{ padding: '0.15rem 0.6rem' }}
                          >
                            {getStatusLabel(project.status)}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400 shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Tarjeta de Últimas Actualizaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div 
              className="bg-white rounded-md shadow-md h-full"
              style={{ padding: '2rem' }}
            >
              <div className="flex items-center" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="bg-primary-100 rounded-full" style={{ padding: '0.75rem' }}>
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-800">
                  Últimas actualizaciones
                </h2>
              </div>

              {loadingUpdates ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-neutral-100 rounded-md animate-pulse" style={{ height: '4rem' }} />
                  ))}
                </div>
              ) : updates.length === 0 ? (
                <p className="text-neutral-600">
                  No hay actualizaciones todavía. Cuando haya novedades en tus proyectos, aparecerán aquí.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {updates.map((update) => {
                    const info = getUpdateTypeInfo(update.update_type);
                    return (
                      <Link
                        key={update.id}
                        to={`/portal/proyecto/${update.project_slug}`}
                        className="block rounded-md border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        style={{ padding: '1rem 1.25rem' }}
                      >
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.25rem' }}>
                          <span className="font-semibold text-neutral-800 text-sm">{update.title}</span>
                          <span
                            className={`rounded text-xs font-semibold shrink-0 ${info.color}`}
                            style={{ padding: '0.15rem 0.5rem', marginLeft: '0.75rem' }}
                          >
                            {info.label}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-neutral-500" style={{ gap: '0.5rem' }}>
                          <span>{update.project_title}</span>
                          <span>·</span>
                          <span>{formatDate(update.published_at)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginTop: '2rem' }}
        >
          <div 
            className="bg-white rounded-md shadow-md"
            style={{ padding: '2rem' }}
          >
            <div className="flex items-center justify-between flex-wrap" style={{ gap: '1rem' }}>
              <div className="flex items-center" style={{ gap: '1rem' }}>
                <div className="bg-neutral-100 rounded-full" style={{ padding: '0.75rem' }}>
                  <User className="w-6 h-6 text-neutral-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800">{user?.name}</h3>
                  <p className="text-sm text-neutral-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-red-500 hover:text-red-600 font-medium transition-colors"
                style={{ gap: '0.5rem' }}
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
}
