import type { Project } from '@/types/project';
import { useTranslation } from 'react-i18next';
import { MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative aspect-4/3 overflow-hidden">
        {project.main_image ? (
          <img
            src={project.main_image.url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-neutral-400" />
          </div>
        )}
        {/* Badge de estado */}
        <div className="absolute top-4 left-4">
          <span
            className={`rounded-full text-sm font-medium ${
              project.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : project.status === 'in-progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
            style={{ padding: '0.25rem 0.75rem' }}
          >
            {t(`portfolio.status.${project.status}`)}
          </span>
        </div>
        {/* Badge de tipo */}
        <div className="absolute top-4 right-4">
          <span 
            className="rounded-full text-sm font-medium bg-primary-500 text-white"
            style={{ padding: '0.25rem 0.75rem' }}
          >
            {t(`portfolio.types.${project.type}`)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '1.5rem' }}>
        {/* Ubicación */}
        <div className="flex items-center text-neutral-500 text-sm" style={{ marginBottom: '0.5rem' }}>
          <MapPin className="w-4 h-4" style={{ marginRight: '0.25rem' }} />
          {project.location.city}, {project.location.province}
        </div>

        {/* Título */}
        <h3 
          className="text-xl font-bold text-neutral-800 group-hover:text-primary-500 transition-colors"
          style={{ marginBottom: '0.5rem' }}
        >
          {project.title}
        </h3>

        {/* Descripción corta */}
        <p className="text-neutral-600 text-sm line-clamp-2" style={{ marginBottom: '1rem' }}>
          {project.short_description}
        </p>

        {/* Datos clave */}
        {project.investment_details && (
          <div 
            className="flex items-center justify-between border-t border-neutral-100"
            style={{ paddingTop: '1rem' }}
          >
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                {t('portfolio.details.investment')}
              </p>
              <p className="text-lg font-bold text-neutral-800">
                {formatCurrency(project.investment_details.total_investment)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                {t('portfolio.details.return')}
              </p>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4" style={{ marginRight: '0.25rem' }} />
                <span className="text-lg font-bold">
                  {Math.round(100 * project.investment_details.annual_return)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Botón */}
        <Link to={`/portfolio/${project.slug}`} className="block" style={{ marginTop: '1rem' }}>
          <Button variant="secondary" fullWidth size="sm">
            {t('portfolio.viewProject')}
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}
