// ============================================
// TIPOS - Rincón de Fuentegrande
// ============================================
// Estos tipos están preparados para cuando se conecte
// a una base de datos. Los datos actuales están en /data

export type InvestmentType = 'alquiler' | 'reforma-venta' | 'construccion' | 'mixto';

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: {
    city: string;
    province: string;
    region: string;
  };
  type: InvestmentType;
  description: string;
  shortDescription: string;
  investmentDetails: {
    purchasePrice: number;
    reformCost?: number;
    totalInvestment: number;
    currentValue?: number;
    monthlyRent?: number;
    annualReturn: number; // Porcentaje
  };
  features: string[];
  images: {
    main: string;
    gallery: string[];
  };
  status: 'completed' | 'in-progress' | 'planned';
  year: number;
  featured: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
  schedule?: string;
}

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  contact: ContactInfo;
  social: SocialLinks;
}

// Tipos para el sistema de navegación
export interface NavItem {
  label: string;
  path: string;
  enabled: boolean;
}

// Tipos para internacionalización
export type Language = 'es' | 'en';

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}
