/**
 * Página del Portal de Cliente
 * Muestra los proyectos y mensajes del usuario autenticado
 */
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, MessageSquare, User, LogOut, ChevronRight, MapPin } from 'lucide-react';
import { Section, Button } from '@/components/common';
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
}

export function PortalPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <section style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
        <div className="layout-container text-center">
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Helper para traducir estado
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'planned': 'Planificado',
      'in_progress': 'En progreso',
      'completed': 'Completado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'planned': 'bg-yellow-100 text-yellow-700',
      'in_progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
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
              Este es tu portal de cliente. Aquí puedes ver tus proyectos y mensajes.
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
                <p className="text-neutral-500">Cargando proyectos...</p>
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
                <div className="space-y-3">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/portal/proyecto/${project.slug}`}
                      className="block p-4 rounded-md border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-800 mb-1">
                            {project.title}
                          </h3>
                          <div className="flex items-center text-sm text-neutral-500 mb-2" style={{ gap: '0.25rem' }}>
                            <MapPin className="w-3 h-3" />
                            {project.location.city}, {project.location.province}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Tarjeta de Mensajes */}
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
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-800">
                  Mensajes
                </h2>
              </div>
              <p className="text-neutral-600" style={{ marginBottom: '1.5rem' }}>
                No tienes mensajes nuevos. Aquí recibirás comunicaciones 
                sobre tus proyectos y consultas.
              </p>
              <Button href="/contacto" variant="outline" size="sm">
                Enviar consulta
              </Button>
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
