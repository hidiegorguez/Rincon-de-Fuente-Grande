import type { Service, Testimonial } from '@/types';

// ============================================
// SERVICIOS
// ============================================

export const services: Service[] = [
  {
    id: '1',
    title: 'services.buyRenovateSell.title',
    description: 'services.buyRenovateSell.description',
    icon: 'Hammer',
    features: [
      'services.buyRenovateSell.features.0',
      'services.buyRenovateSell.features.1',
      'services.buyRenovateSell.features.2',
      'services.buyRenovateSell.features.3',
    ],
  },
  {
    id: '2',
    title: 'services.rental.title',
    description: 'services.rental.description',
    icon: 'Key',
    features: [
      'services.rental.features.0',
      'services.rental.features.1',
      'services.rental.features.2',
      'services.rental.features.3',
    ],
  },
  {
    id: '3',
    title: 'services.consulting.title',
    description: 'services.consulting.description',
    icon: 'LineChart',
    features: [
      'services.consulting.features.0',
      'services.consulting.features.1',
      'services.consulting.features.2',
      'services.consulting.features.3',
    ],
  },
  {
    id: '4',
    title: 'services.partnership.title',
    description: 'services.partnership.description',
    icon: 'Handshake',
    features: [
      'services.partnership.features.0',
      'services.partnership.features.1',
      'services.partnership.features.2',
      'services.partnership.features.3',
    ],
  },
];

// ============================================
// TESTIMONIOS
// ============================================
// Testimonios ficticios - reemplazar con reales cuando estén disponibles

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Martínez',
    role: 'Inversor particular',
    content:
      'Llevaba años buscando una forma segura de invertir mis ahorros. Gracias a Rincón de Fuentegrande, hoy tengo dos propiedades que generan ingresos pasivos. Su transparencia y profesionalidad me dieron la confianza que necesitaba.',
    rating: 5,
  },
  {
    id: '2',
    name: 'María González',
    role: 'Empresaria',
    content:
      'Lo que más valoro es su honestidad. Me presentaron los riesgos y las oportunidades de cada inversión de forma clara. Después de tres operaciones juntos, puedo decir que son un equipo de confianza.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Antonio Ruiz',
    role: 'Jubilado',
    content:
      'Buscaba una inversión para complementar mi pensión. Me recomendaron un apartamento para alquiler y me ayudaron en todo el proceso. Hoy recibo una renta mensual que me permite vivir más tranquilo.',
    rating: 5,
  },
];
