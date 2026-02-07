import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, TrendingUp, Users, Calendar } from 'lucide-react';
import { Section, SectionHeader, Button, ProjectCard, ServiceCard } from '@/components/common';
import { getFeaturedProjects } from '@/data/projects';
import { services } from '@/data/services';
import { testimonials } from '@/data/services';
import { companyInfo } from '@/data/company';

export function HomePage() {
  const { t } = useTranslation();
  const featuredProjects = getFeaturedProjects().slice(0, 3);

  const stats = [
    { icon: Building2, value: '15+', label: t('stats.projects') },
    { icon: TrendingUp, value: '45%', label: t('stats.returns') },
    { icon: Calendar, value: '5+', label: t('stats.years') },
    { icon: Users, value: '30+', label: t('stats.clients') },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="layout-container relative z-10">
          <div style={{ maxWidth: '48rem' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ marginBottom: '1.5rem' }}
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90"
              style={{ marginBottom: '2rem', maxWidth: '42rem' }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row"
              style={{ gap: '1rem' }}
            >
              <Button href="/portfolio" size="lg" variant="secondary">
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5" style={{ marginLeft: '0.5rem' }} />
              </Button>
              <Button href="/contacto" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-500">
                {t('hero.ctaSecondary')}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent" />
      </section>

      {/* Stats Section */}
      <Section background="white" paddingY="md" className="-mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl" style={{ padding: '2rem' }}>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '2rem' }}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div 
                  className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center"
                  style={{ margin: '0 auto 0.75rem auto' }}
                >
                  <stat.icon className="w-6 h-6 text-primary-500" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-primary-500">
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-600" style={{ marginTop: '0.25rem' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Services Preview */}
      <Section background="light" paddingY="lg">
        <SectionHeader
          title={t('services.title')}
          subtitle={t('services.subtitle')}
        />
        <div className="grid-services">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '2.5rem' }}>
          <Button href="/servicios" variant="outline">
            {t('common.learnMore')}
            <ArrowRight className="w-4 h-4" style={{ marginLeft: '0.5rem' }} />
          </Button>
        </div>
      </Section>

      {/* Featured Projects */}
      <Section background="white" paddingY="lg">
        <SectionHeader
          title={t('portfolio.title')}
          subtitle={t('portfolio.subtitle')}
        />
        <div className="grid-projects">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '2.5rem' }}>
          <Button href="/portfolio">
            {t('portfolio.allProjects')}
            <ArrowRight className="w-4 h-4" style={{ marginLeft: '0.5rem' }} />
          </Button>
        </div>
      </Section>

      {/* Testimonials */}
      <Section background="gradient" paddingY="lg">
        <SectionHeader
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
        />
        <div className="grid-testimonials">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl"
              style={{ padding: '1.5rem' }}
            >
              {/* Stars */}
              <div className="flex" style={{ gap: '0.25rem', marginBottom: '1rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-accent-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* Quote */}
              <p className="text-white/90 italic" style={{ marginBottom: '1.5rem' }}>"{testimonial.content}"</p>
              {/* Author */}
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/70">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section background="white" paddingY="lg">
        <div className="text-center" style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-neutral-800"
            style={{ marginBottom: '1rem' }}
          >
            {t('contact.subtitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-600"
            style={{ marginBottom: '2rem' }}
          >
            {t('contact.description')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center"
            style={{ gap: '1rem' }}
          >
            <Button href="/contacto" size="lg">
              {t('hero.ctaSecondary')}
            </Button>
            <Button
              href={`tel:${companyInfo.contact.phone}`}
              size="lg"
              variant="outline"
              isExternal
            >
              {companyInfo.contact.phone}
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
