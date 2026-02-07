import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/common';
import { Shield, Users, Target } from 'lucide-react';

export function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Shield,
      title: t('about.values.transparency.title'),
      description: t('about.values.transparency.description'),
    },
    {
      icon: Users,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
    },
    {
      icon: Target,
      title: t('about.values.results.title'),
      description: t('about.values.results.description'),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section 
        className="bg-white"
        style={{ paddingTop: '7rem', paddingBottom: '2rem' }}
      >
        <div className="layout-container">
          <div className="max-w-3xl">
            <h1 
              className="text-4xl md:text-5xl font-bold text-neutral-800"
              style={{ marginBottom: '1rem' }}
            >
              {t('about.title')}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <Section background="white" paddingY="lg">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-neutral-600 leading-relaxed text-center"
          >
            {t('about.description')}
          </motion.p>
        </div>
      </Section>

      {/* Values */}
      <Section background="light" paddingY="lg">
        <SectionHeader title={t('about.values.title')} />
        <div className="grid-values">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-md text-center shadow-md"
              style={{ padding: '2rem' }}
            >
              <div 
                className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center"
                style={{ margin: '0 auto 1.5rem auto' }}
              >
                <value.icon className="w-8 h-8 text-primary-500" />
              </div>
              <h3 
                className="text-xl font-bold text-neutral-800"
                style={{ marginBottom: '0.75rem' }}
              >
                {value.title}
              </h3>
              <p className="text-neutral-600">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Mission */}
      <Section background="gradient" paddingY="lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ marginBottom: '1.5rem' }}
          >
            Nuestra Misión
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            Hacer accesible la inversión inmobiliaria a personas que buscan
            rentabilizar sus ahorros de forma segura y transparente. Creemos que
            cada propiedad tiene un potencial oculto, y nuestra misión es
            descubrirlo y hacerlo realidad.
          </p>
        </div>
      </Section>
    </>
  );
}
