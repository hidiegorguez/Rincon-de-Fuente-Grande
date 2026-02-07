import type { Project } from '@/types';

// ============================================
// PROYECTOS / PORTFOLIO
// ============================================
// Añade, modifica o elimina proyectos aquí.
// Las imágenes están en /public/images/projects/

export const projects: Project[] = [
  {
    id: '1',
    slug: 'casa-rural-asturias',
    title: 'Casa Rural en Cangas de Onís',
    location: {
      city: 'Cangas de Onís',
      province: 'Asturias',
      region: 'Norte de España',
    },
    type: 'reforma-venta',
    description:
      'Adquisición de una casa rural de piedra del siglo XIX en estado de abandono, ubicada a 5 km de los Lagos de Covadonga. Realizamos una reforma integral respetando la arquitectura tradicional asturiana, incorporando aislamiento térmico moderno, calefacción por suelo radiante y acabados de alta calidad. El resultado: una vivienda de 180m² con 4 habitaciones, perfecta para turismo rural o residencia permanente.',
    shortDescription:
      'Reforma integral de casa rural tradicional asturiana, transformada en vivienda de lujo con vistas a los Picos de Europa.',
    investmentDetails: {
      purchasePrice: 45000,
      reformCost: 120000,
      totalInvestment: 165000,
      currentValue: 285000,
      annualReturn: 72.7,
    },
    features: [
      '180m² construidos',
      '4 habitaciones',
      'Jardín de 500m²',
      'Vistas a montaña',
      'Calefacción por suelo radiante',
      'Materiales tradicionales',
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
    status: 'completed',
    year: 2024,
    featured: true,
  },
  {
    id: '2',
    slug: 'apartamento-san-sebastian',
    title: 'Apartamento Centro San Sebastián',
    location: {
      city: 'San Sebastián',
      province: 'Guipúzcoa',
      region: 'País Vasco',
    },
    type: 'alquiler',
    description:
      'Adquisición de un apartamento de 75m² en el centro histórico de San Sebastián, a 300 metros de la Playa de la Concha. Tras una reforma estética que modernizó cocina y baños, el inmueble genera ingresos estables mediante alquiler turístico de alta gama. La ubicación privilegiada garantiza una ocupación superior al 80% anual.',
    shortDescription:
      'Apartamento céntrico reformado, generando rentabilidad mediante alquiler turístico premium.',
    investmentDetails: {
      purchasePrice: 320000,
      reformCost: 35000,
      totalInvestment: 355000,
      monthlyRent: 2800,
      annualReturn: 9.5,
    },
    features: [
      '75m² útiles',
      '2 habitaciones',
      'A 300m de la playa',
      'Centro histórico',
      'Licencia turística',
      'Ocupación +80%',
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
    status: 'completed',
    year: 2023,
    featured: true,
  },
  {
    id: '3',
    slug: 'edificio-bilbao',
    title: 'Edificio Residencial Bilbao',
    location: {
      city: 'Bilbao',
      province: 'Vizcaya',
      region: 'País Vasco',
    },
    type: 'mixto',
    description:
      'Proyecto de mayor envergadura: adquisición de un edificio completo de 4 plantas con 8 viviendas en el barrio de Deusto. Se realizó una rehabilitación integral de fachada, zonas comunes y actualización de instalaciones. Cuatro viviendas se destinaron a alquiler de larga duración y cuatro se vendieron reformadas, recuperando la inversión inicial y manteniendo activos rentables.',
    shortDescription:
      'Rehabilitación de edificio completo con estrategia mixta: venta de unidades y alquiler residencial.',
    investmentDetails: {
      purchasePrice: 580000,
      reformCost: 220000,
      totalInvestment: 800000,
      currentValue: 1200000,
      monthlyRent: 4800,
      annualReturn: 57.2,
    },
    features: [
      '8 viviendas',
      '4 plantas',
      'Barrio Deusto',
      'Ascensor nuevo',
      'Fachada rehabilitada',
      'Certificación energética B',
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
    status: 'completed',
    year: 2024,
    featured: true,
  },
  {
    id: '4',
    slug: 'chalet-cantabria',
    title: 'Chalet con Terreno en Santillana',
    location: {
      city: 'Santillana del Mar',
      province: 'Cantabria',
      region: 'Norte de España',
    },
    type: 'reforma-venta',
    description:
      'Oportunidad única: chalet de los años 70 con parcela de 2.000m² en una de las villas más bonitas de España. La estrategia consistió en una reforma completa manteniendo la estructura original pero modernizando completamente interiores, instalaciones y eficiencia energética. El jardín se acondicionó con piscina y zona de barbacoa. Actualmente en fase final de comercialización.',
    shortDescription:
      'Chalet con amplio terreno en villa histórica, reformado integralmente con piscina y jardín.',
    investmentDetails: {
      purchasePrice: 180000,
      reformCost: 150000,
      totalInvestment: 330000,
      currentValue: 485000,
      annualReturn: 47.0,
    },
    features: [
      '220m² construidos',
      'Parcela 2.000m²',
      'Piscina privada',
      '5 habitaciones',
      'Garaje doble',
      'Villa histórica',
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      gallery: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
    status: 'in-progress',
    year: 2025,
    featured: true,
  },
];

// Helper para obtener proyectos destacados
export const getFeaturedProjects = (): Project[] => {
  return projects.filter((p) => p.featured);
};

// Helper para obtener proyecto por slug
export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug);
};

// Helper para obtener proyectos por tipo
export const getProjectsByType = (type: Project['type']): Project[] => {
  return projects.filter((p) => p.type === type);
};
