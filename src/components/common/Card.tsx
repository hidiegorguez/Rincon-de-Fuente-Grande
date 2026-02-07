import type { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStylesCSS: Record<'none' | 'sm' | 'md' | 'lg', CSSProperties> = {
  none: {},
  sm: { padding: '1rem' },
  md: { padding: '1.5rem' },
  lg: { padding: '2rem' },
};

export function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-md ${
        hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
      } ${className}`}
      style={paddingStylesCSS[padding]}
    >
      {children}
    </motion.div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
}

const aspectRatioStyles = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
};

export function CardImage({
  src,
  alt,
  className = '',
  aspectRatio = 'video',
}: CardImageProps) {
  return (
    <div
      className={`overflow-hidden rounded-t-xl ${aspectRatioStyles[aspectRatio]} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className} style={{ padding: '1.5rem' }}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}

export function CardTitle({
  children,
  className = '',
  as: Tag = 'h3',
}: CardTitleProps) {
  return (
    <Tag
      className={`font-bold text-neutral-800 ${
        Tag === 'h2' ? 'text-2xl' : Tag === 'h3' ? 'text-xl' : 'text-lg'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className = '',
}: CardDescriptionProps) {
  return (
    <p className={`text-neutral-600 ${className}`} style={{ marginTop: '0.5rem' }}>
      {children}
    </p>
  );
}
