import type { Service } from '@/types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Hammer, Key, LineChart, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  Hammer,
  Key,
  LineChart,
  Handshake,
};

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const { t } = useTranslation();
  const Icon = iconMap[service.icon] || Hammer;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300"
      style={{ padding: '2rem' }}
    >
      {/* Icono */}
      <div 
        className="w-14 h-14 rounded-sm bg-primary-50 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300"
        style={{ marginBottom: '1.5rem' }}
      >
        <Icon className="w-7 h-7 text-primary-500 group-hover:text-white transition-colors duration-300" />
      </div>

      {/* Título */}
      <h3 
        className="text-xl font-bold text-neutral-800"
        style={{ marginBottom: '0.75rem' }}
      >
        {t(service.title)}
      </h3>

      {/* Descripción */}
      <p 
        className="text-neutral-600"
        style={{ marginBottom: '1.5rem' }}
      >
        {t(service.description)}
      </p>

      {/* Features */}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-start text-sm text-neutral-600">
            <Check className="w-4 h-4 text-accent-500 shrink-0" style={{ marginRight: '0.5rem', marginTop: '0.125rem' }} />
            <span>{t(feature)}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
