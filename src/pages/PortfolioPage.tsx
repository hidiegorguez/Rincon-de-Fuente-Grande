import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { Section, SectionHeader, ProjectCard, Button } from '@/components/common';
import { Section, ProjectCard, Button } from '@/components/common';
import { projects } from '@/data/projects';
import type { InvestmentType } from '@/types';

type FilterType = 'all' | InvestmentType;

export function PortfolioPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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
        className="bg-white-300"
        style={{ paddingTop: '7rem', paddingBottom: '2rem' }}
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
        {filteredProjects.length > 0 ? (
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
