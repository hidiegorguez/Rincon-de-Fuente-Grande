import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, ProjectCard, Button } from '@/components/common';
import type { Project } from '@/types/project';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type FilterType = 'all' | string;

export function PortfolioPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${API_URL}/api/projects/public`);
        if (response.ok) {
          setProjects(await response.json());
        }
      } catch (err) {
        console.error('Error fetching public projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('portfolio.filters.all') },
    { key: 'alquiler', label: t('portfolio.filters.rental') },
    { key: 'reforma-venta', label: t('portfolio.filters.renovateSale') },
    { key: 'mixto', label: t('portfolio.filters.mixed') },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.type === activeFilter);

  return (
    <>
      {/* Hero */}
      <section 
        className="bg-linear-to-t from-white-200 to-primary-300"
        style={{ paddingTop: '7rem', paddingBottom: '2rem', marginBottom: '2rem' }}
      >
        <div className="layout-container">
          <div className="max-w-3xl">
            <h1 
              className="text-2xl md:text-3xl font-bold text-accent-900"
              style={{ marginBottom: '1rem' }}
            >
              {t('portfolio.title')}
            </h1>
            <p className="md:text-lg text-neutral-600">
              {t('portfolio.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <Section background="light" paddingY="xs">
        <div className="flex flex-wrap justify-center" style={{ gap: '0.75rem' }}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full font-medium transition-all ${
                activeFilter === filter.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              style={{ padding: '0.5rem 1.25rem' }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Projects Grid */}
      <Section background="light" paddingY="md">
        {loading ? (
          <div className="grid-projects">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-md shadow-md overflow-hidden animate-pulse">
                <div className="aspect-4/3 bg-neutral-200" />
                <div style={{ padding: '1.5rem' }}>
                  <div className="bg-neutral-200 rounded" style={{ width: '60%', height: '0.875rem', marginBottom: '0.5rem' }} />
                  <div className="bg-neutral-200 rounded" style={{ width: '80%', height: '1.25rem', marginBottom: '0.5rem' }} />
                  <div className="bg-neutral-100 rounded" style={{ width: '100%', height: '0.875rem', marginBottom: '1rem' }} />
                  <div className="border-t border-neutral-100" style={{ paddingTop: '1rem' }}>
                    <div className="flex justify-between">
                      <div className="bg-neutral-200 rounded" style={{ width: '5rem', height: '1.5rem' }} />
                      <div className="bg-neutral-200 rounded" style={{ width: '3rem', height: '1.5rem' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid-projects">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '3rem 0' }}>
            <p className="text-neutral-600">
              No hay proyectos en esta categoría.
            </p>
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section background="white" paddingY="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-neutral-800"
            style={{ marginBottom: '1rem' }}
          >
            ¿Quieres participar en nuestro próximo proyecto?
          </h2>
          <p 
            className="text-lg text-neutral-600"
            style={{ marginBottom: '2rem' }}
          >
            Estamos siempre buscando nuevas oportunidades. Contacta con nosotros para conocer las opciones de inversión disponibles.
          </p>
          <Button href="/contacto" size="lg">
            Contactar ahora
          </Button>
        </div>
      </Section>
    </>
  );
}
