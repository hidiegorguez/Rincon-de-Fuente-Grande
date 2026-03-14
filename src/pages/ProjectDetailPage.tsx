/**
 * Página de Detalle de Proyecto - Vista pública
 * Carga datos del proyecto desde la API pública (sin autenticación)
 * Mismos componentes que PortalProjectPage pero sin actualizaciones ni mensajes
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { Section, Button } from '@/components/common';
import { ProjectFeatures } from '@/components/project/ProjectFeatures';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { InvestmentSidebar } from '@/components/project/InvestmentSidebar';
import type { Project } from '@/types/project';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      try {
        const response = await fetch(`${API_URL}/api/projects/public/${slug}`);
        if (!response.ok) {
          setError('Proyecto no encontrado');
          return;
        }
        setProject(await response.json());
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  // Skeleton de carga
  if (loading) {
    return (
      <>
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-neutral-300 animate-pulse">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ padding: '1.5rem 1.5rem 3rem' }}
          >
            <div className="layout-container">
              <div className="bg-neutral-400/50 rounded" style={{ width: '8rem', height: '1rem', marginBottom: '1rem' }} />
              <div className="bg-neutral-400/50 rounded" style={{ width: '60%', height: '2.5rem', marginBottom: '0.75rem' }} />
              <div className="flex" style={{ gap: '1rem' }}>
                <div className="bg-neutral-400/50 rounded" style={{ width: '10rem', height: '1rem' }} />
                <div className="bg-neutral-400/50 rounded" style={{ width: '4rem', height: '1rem' }} />
              </div>
            </div>
          </div>
        </section>
        <Section background="white" paddingY="lg">
          <div className="grid-project-detail">
            <div>
              <div className="bg-neutral-200 rounded animate-pulse" style={{ width: '14rem', height: '1.75rem', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                <div className="bg-neutral-100 rounded animate-pulse" style={{ width: '100%', height: '1rem' }} />
                <div className="bg-neutral-100 rounded animate-pulse" style={{ width: '100%', height: '1rem' }} />
                <div className="bg-neutral-100 rounded animate-pulse" style={{ width: '75%', height: '1rem' }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-neutral-100 rounded animate-pulse" style={{ height: '2.5rem' }} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 rounded-md" style={{ padding: '1.5rem' }}>
                <div className="bg-neutral-200 rounded animate-pulse" style={{ width: '10rem', height: '1.25rem', marginBottom: '1.5rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #e5e5e5' }}>
                      <div className="bg-neutral-200 rounded animate-pulse" style={{ width: '6rem', height: '1rem' }} />
                      <div className="bg-neutral-200 rounded animate-pulse" style={{ width: '5rem', height: '1rem' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </>
    );
  }

  // Error o no encontrado
  if (error || !project) {
    return (
      <Section background="white" paddingY="xl">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" style={{ marginBottom: '1rem' }} />
          <h1 
            className="text-2xl font-bold text-neutral-800"
            style={{ marginBottom: '0.5rem' }}
          >
            {error || 'Proyecto no encontrado'}
          </h1>
          <p 
            className="text-neutral-600"
            style={{ marginBottom: '2rem' }}
          >
            El proyecto que buscas no existe o ha sido eliminado.
          </p>
          <Button href="/portfolio">Volver al portfolio</Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {project.main_image ? (
          <img
            src={project.main_image.url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-neutral-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        <div 
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: '1.5rem 1.5rem 3rem' }}
        >
          <div className="layout-container">
            <Link
              to="/portfolio"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              style={{ marginBottom: '1rem' }}
            >
              <ArrowLeft className="w-4 h-4" style={{ marginRight: '0.5rem' }} />
              {t('common.back')}
            </Link>
            <h1 
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ marginBottom: '0.5rem' }}
            >
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center text-white/90" style={{ gap: '1rem' }}>
              <span className="flex items-center">
                <MapPin className="w-4 h-4" style={{ marginRight: '0.25rem' }} />
                {project.location.city}, {project.location.province}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4" style={{ marginRight: '0.25rem' }} />
                {project.year}
              </span>
              <span
                className={`rounded-full text-sm font-medium ${
                  project.status === 'completed'
                    ? 'bg-green-500/20 text-green-300'
                    : project.status === 'in-progress'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
                style={{ padding: '0.25rem 0.75rem' }}
              >
                {t(`portfolio.status.${project.status}`)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section background="white" paddingY="lg">
        <div className="grid-project-detail">
          {/* Main Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                Descripción del proyecto
              </h2>
              <p 
                className="text-neutral-600 leading-relaxed"
                style={{ marginBottom: '2rem' }}
              >
                {project.description || project.short_description || 'Sin descripción disponible.'}
              </p>

              {/* Características */}
              <ProjectFeatures features={project.features} />

              {/* Galería */}
              <ProjectGallery gallery={project.images} title="Galería" />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-50 rounded-md sticky top-28"
              style={{ padding: '1.5rem' }}
            >
              <InvestmentSidebar type={project.type} investment_details={project.investment_details} />

              <Button href="/contacto" fullWidth style={{ marginTop: '1.5rem' }}>
                Solicitar información
              </Button>
            </motion.div>
          </div>
        </div>
      </Section>
    </>
  );
}
