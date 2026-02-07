import { useTranslation } from 'react-i18next';
import { Section } from '@/components/common';
import { companyInfo } from '@/data/company';

export function PrivacyPolicyPage() {
  const { t } = useTranslation();

  const formatDate = () => {
    const locale = t('privacy.lastUpdate') === 'Last updated' ? 'en-US' : 'es-ES';
    return new Date().toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
              {t('privacy.title')}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600">
              {t('privacy.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section background="white" paddingY="lg">
        <div className="max-w-4xl mx-auto">
          <p className="text-neutral-600" style={{ marginBottom: '2rem' }}>
            {t('privacy.lastUpdate')}: {formatDate()}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Responsable */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.responsible.title')}
              </h2>
              <p className="text-neutral-600">
                {t('privacy.sections.responsible.content')} <strong>{companyInfo.name}</strong>, {' '}
                {t('privacy.sections.responsible.contact')}: {' '}
                <a href={`mailto:${companyInfo.contact.email}`} className="text-primary-500 hover:underline">
                  {companyInfo.contact.email}
                </a>.
              </p>
            </div>

            {/* Datos recogidos */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.dataCollected.title')}
              </h2>
              <p className="text-neutral-600" style={{ marginBottom: '1rem' }}>
                {t('privacy.sections.dataCollected.intro')}
              </p>
              <ul className="text-neutral-600" style={{ paddingLeft: '1.5rem', listStyle: 'disc' }}>
                {(t('privacy.sections.dataCollected.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Finalidad */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.purpose.title')}
              </h2>
              <p className="text-neutral-600" style={{ marginBottom: '1rem' }}>
                {t('privacy.sections.purpose.intro')}
              </p>
              <ul className="text-neutral-600" style={{ paddingLeft: '1.5rem', listStyle: 'disc' }}>
                {(t('privacy.sections.purpose.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Base legal */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.legalBasis.title')}
              </h2>
              <p className="text-neutral-600">
                {t('privacy.sections.legalBasis.content')}
              </p>
            </div>

            {/* Conservación */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.retention.title')}
              </h2>
              <p className="text-neutral-600">
                {t('privacy.sections.retention.content')}
              </p>
            </div>

            {/* Derechos */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.rights.title')}
              </h2>
              <p className="text-neutral-600" style={{ marginBottom: '1rem' }}>
                {t('privacy.sections.rights.intro')}
              </p>
              <ul className="text-neutral-600" style={{ paddingLeft: '1.5rem', listStyle: 'disc' }}>
                {(t('privacy.sections.rights.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                ))}
              </ul>
              <p className="text-neutral-600" style={{ marginTop: '1rem' }}>
                {t('privacy.sections.rights.contact')}: {' '}
                <a href={`mailto:${companyInfo.contact.email}`} className="text-primary-500 hover:underline">
                  {companyInfo.contact.email}
                </a>
              </p>
            </div>

            {/* Seguridad */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.security.title')}
              </h2>
              <p className="text-neutral-600">
                {t('privacy.sections.security.content')}
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.cookies.title')}
              </h2>
              <p className="text-neutral-600">
                {t('privacy.sections.cookies.content')}
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('privacy.sections.contact.title')}
              </h2>
              <p className="text-neutral-600">
                {t('privacy.sections.contact.content')}: {' '}
                <a href={`mailto:${companyInfo.contact.email}`} className="text-primary-500 hover:underline">
                  {companyInfo.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
