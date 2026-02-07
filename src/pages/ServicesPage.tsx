import { useTranslation } from 'react-i18next';
import { Section, SectionHeader, ServiceCard, Button } from '@/components/common';
import { services } from '@/data/services';
// import { companyInfo } from '@/data/company';
import { ArrowRight } from 'lucide-react';

export function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section 
        className="bg-linear-to-t from-white-200 to-primary-300"
        style={{ paddingTop: '7rem', paddingBottom: '1rem' }}
      >
        <div className="layout-container">
          <div className="max-w-3xl">
            <h1 
              className="text-2xl md:text-3xl font-bold text-accent-900"
              style={{ marginBottom: '1rem' }}
            >
              {t('services.title')}
            </h1>
            <p className="md:text-lg text-neutral-600">
              {t('services.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <Section background="light" paddingY="lg">
        <div className="grid-2-cols">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section background="white" paddingY="lg">
        <SectionHeader
          title="¿Por qué elegirnos?"
          subtitle="La diferencia está en los detalles y el compromiso"
        />
        <div className="grid-values" style={{ marginTop: '3rem' }}>
          {[
            {
              title: 'Experiencia',
              description: 'Años de trayectoria en el sector inmobiliario español, con un profundo conocimiento del mercado.',
            },
            {
              title: 'Transparencia',
              description: 'Información clara sobre cada operación. Sin sorpresas, sin letra pequeña.',
            },
            {
              title: 'Resultados',
              description: 'Un historial probado de inversiones exitosas que hablan por sí solas.',
            },
          ].map((item, index) => (
            <div key={index} className="text-center" style={{ padding: '1.5rem' }}>
              <div 
                className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center"
                style={{ margin: '0 auto 1rem auto' }}
              >
                <span className="text-2xl font-bold text-primary-500">
                  {index + 1}
                </span>
              </div>
              <h3 
                className="text-xl font-bold text-neutral-800"
                style={{ marginBottom: '0.5rem' }}
              >
                {item.title}
              </h3>
              <p className="text-neutral-600">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ marginBottom: '1rem' }}
          >
            ¿Listo para invertir con seguridad?
          </h2>
          <p 
            className="text-lg opacity-90"
            style={{ marginBottom: '2rem' }}
          >
            Cuéntanos tus objetivos y te ayudaremos a encontrar la mejor oportunidad.
          </p>
          <Button href="/contacto" size="lg" variant="secondary">
            Solicitar información
            <ArrowRight className="w-5 h-5" style={{ marginLeft: '0.5rem' }} />
          </Button>
        </div>
      </Section>
    </>
  );
}
