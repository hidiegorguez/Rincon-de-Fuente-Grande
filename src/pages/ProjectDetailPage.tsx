import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
//   Home,
  Check,
} from 'lucide-react';
import { Section, Button } from '@/components/common';
import { getProjectBySlug, projects } from '@/data/projects';
import { ProjectCard } from '@/components/common/ProjectCard';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const project = getProjectBySlug(slug || '');

  if (!project) {
    return (
      <Section background="white" paddingY="xl">
        <div className="text-center">
          <h1 
            className="text-3xl font-bold text-neutral-800"
            style={{ marginBottom: '1rem' }}
          >
            Proyecto no encontrado
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const otherProjects = projects
    .filter((p) => p.id !== project.id)
    .slice(0, 2);

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={project.images.main}
          alt={project.title}
          className="w-full h-full object-cover"
        />
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
                {project.description}
              </p>

              {/* Features */}
              <h3 
                className="text-xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('portfolio.details.features')}
              </h3>
              <div 
                className="grid grid-cols-2 md:grid-cols-3"
                style={{ gap: '1rem', marginBottom: '2rem' }}
              >
                {project.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-neutral-700"
                    style={{ padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '0.5rem' }}
                  >
                    <Check className="w-5 h-5 text-accent-500 shrink-0" style={{ marginRight: '0.5rem' }} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Gallery */}
              {project.images.gallery.length > 0 && (
                <>
                  <h3 
                    className="text-xl font-bold text-neutral-800"
                    style={{ marginBottom: '1rem' }}
                  >
                    Galería
                  </h3>
                  <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    {project.images.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${project.title} - Imagen ${index + 1}`}
                        className="rounded-lg w-full aspect-video object-cover"
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-50 rounded-xl sticky top-28"
              style={{ padding: '1.5rem' }}
            >
              <h3 
                className="text-lg font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                Datos de inversión
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-neutral-600">
                    {t('portfolio.details.type')}
                  </span>
                  <span className="font-medium text-neutral-800">
                    {t(`portfolio.types.${project.type}`)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-neutral-600">
                    Precio de compra
                  </span>
                  <span className="font-medium text-neutral-800">
                    {formatCurrency(project.investmentDetails.purchasePrice)}
                  </span>
                </div>

                {project.investmentDetails.reformCost && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      Coste de reforma
                    </span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(project.investmentDetails.reformCost)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-neutral-600">
                    {t('portfolio.details.investment')}
                  </span>
                  <span className="font-bold text-primary-500">
                    {formatCurrency(project.investmentDetails.totalInvestment)}
                  </span>
                </div>

                {project.investmentDetails.currentValue && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      Valor actual
                    </span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(project.investmentDetails.currentValue)}
                    </span>
                  </div>
                )}

                {project.investmentDetails.monthlyRent && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      Renta mensual
                    </span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(project.investmentDetails.monthlyRent)}
                    </span>
                  </div>
                )}

                <div 
                  className="flex justify-between items-center"
                  style={{ paddingTop: '0.5rem' }}
                >
                  <span className="text-neutral-800 font-medium">
                    {t('portfolio.details.return')}
                  </span>
                  <span className="flex items-center text-green-600 font-bold text-xl">
                    <TrendingUp className="w-5 h-5" style={{ marginRight: '0.25rem' }} />
                    {project.investmentDetails.annualReturn}%
                  </span>
                </div>
              </div>

              <Button href="/contacto" fullWidth style={{ marginTop: '1.5rem' }}>
                Solicitar información
              </Button>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <Section background="light" paddingY="lg">
          <h2 
            className="text-2xl md:text-3xl font-bold text-neutral-800 text-center"
            style={{ marginBottom: '2rem' }}
          >
            Otros proyectos
          </h2>
          <div className="grid-2-cols" style={{ maxWidth: '56rem', margin: '0 auto' }}>
            {otherProjects.map((p, index) => (
              <ProjectCard key={p.id} project={p} index={index} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
