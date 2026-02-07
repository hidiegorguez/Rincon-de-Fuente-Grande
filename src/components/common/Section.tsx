import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'white' | 'light' | 'primary' | 'gradient';
  paddingY?: 'xs' |'sm' | 'md' | 'lg' | 'xl';
}
  
const backgroundStyles = {
  white: 'bg-white',
  light: 'bg-neutral-50',
  primary: 'bg-primary-500 text-white',
  gradient:
    'bg-gradient-to-br from-primary-500 to-primary-700 text-white',
};

const paddingStyles = {
  xs: 'section-padding-xs',
  sm: 'section-padding-sm',
  md: 'section-padding-md',
  lg: 'section-padding-lg',
  xl: 'section-padding-xl',
};

export function Section({
  children,
  className = '',
  id,
  background = 'white',
  paddingY = 'lg',
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${backgroundStyles[background]} ${paddingStyles[paddingY]} ${className}`}
    >
      <div className="layout-container">
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`${centered ? 'text-center' : ''} ${className}`}
      style={{ marginBottom: '3rem' }}
    >
      <h2 
        className="text-3xl md:text-4xl lg:text-5xl font-bold"
        style={{ marginBottom: '1rem' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p 
          className="text-lg md:text-xl opacity-80"
          style={{ maxWidth: '42rem', margin: centered ? '0 auto' : '0' }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
