import type { CompanyInfo, NavItem } from '@/types';

// ============================================
// INFORMACIÓN DE LA EMPRESA
// ============================================
// Modifica estos datos con la información real

export const companyInfo: CompanyInfo = {
  name: 'Rincón de Fuentegrande',
  tagline: 'Convertimos propiedades en oportunidades',
  description:
    'Somos una empresa especializada en inversiones inmobiliarias, dedicada a identificar oportunidades únicas en el mercado español. Transformamos espacios con potencial en hogares con valor, generando rentabilidad sostenible para nuestros inversores.',
  contact: {
    email: 'info@rincondefuentegrande.com',
    phone: '+34 678 756 924',
    address: 'España',
    schedule: 'Lunes a Viernes: 9:00 - 18:00',
  },
  social: {
    linkedin: 'https://linkedin.com/company/rincon-fuente-grande',
    instagram: 'https://instagram.com/rinconfuentegrande',
  },
};

// ============================================
// NAVEGACIÓN
// ============================================
// Cambia 'enabled' a false para ocultar una sección

export const navigation: NavItem[] = [
  { label: 'nav.home', path: '/', enabled: true },
  { label: 'nav.services', path: '/servicios', enabled: true },
  { label: 'nav.portfolio', path: '/portfolio', enabled: true },
  { label: 'nav.about', path: '/nosotros', enabled: false }, // Fácil de activar/desactivar
  { label: 'nav.contact', path: '/contacto', enabled: true },
];

// ============================================
// CONFIGURACIÓN DEL SITIO
// ============================================

export const siteConfig = {
  // Tema por defecto (ver themes.css para opciones)
  defaultTheme: 'theme-elegant',
  
  // Idioma por defecto
  defaultLanguage: 'es' as const,
  
  // Mostrar botón de cambio de idioma
  showLanguageSwitch: true,
  
  // Mostrar CTA flotante de contacto
  showFloatingCTA: true,
  
  // Mostrar sección "Sobre Nosotros" en el footer
  showAboutInFooter: true,
};
