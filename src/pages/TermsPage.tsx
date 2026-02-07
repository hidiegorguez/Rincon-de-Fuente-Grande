import { useTranslation } from 'react-i18next';
import { Section } from '@/components/common';
import { companyInfo } from '@/data/company';

export function TermsPage() {
  const { t } = useTranslation();

  const formatDate = () => {
    const locale = t('terms.lastUpdate') === 'Last updated' ? 'en-US' : 'es-ES';
    return new Date().toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const replaceCompany = (text: string) => {
    return text.replace(/{company}/g, companyInfo.name);
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
              {t('terms.title')}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600">
              {t('terms.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section background="white" paddingY="lg">
        <div className="max-w-4xl mx-auto">
          <p className="text-neutral-600" style={{ marginBottom: '2rem' }}>
            {t('terms.lastUpdate')}: {formatDate()}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Objeto */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.object.title')}
              </h2>
              <p className="text-neutral-600">
                {replaceCompany(t('terms.sections.object.content'))}
              </p>
            </div>

            {/* Propiedad intelectual */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.intellectualProperty.title')}
              </h2>
              <p className="text-neutral-600">
                {replaceCompany(t('terms.sections.intellectualProperty.content'))}
              </p>
            </div>

            {/* Uso del sitio */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.useConditions.title')}
              </h2>
              <p className="text-neutral-600" style={{ marginBottom: '1rem' }}>
                {t('terms.sections.useConditions.intro')}
              </p>
              <ul className="text-neutral-600" style={{ paddingLeft: '1.5rem', listStyle: 'disc' }}>
                {(t('terms.sections.useConditions.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Exclusión de responsabilidad */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.liability.title')}
              </h2>
              <p className="text-neutral-600" style={{ marginBottom: '1rem' }}>
                {replaceCompany(t('terms.sections.liability.intro'))}
              </p>
              <ul className="text-neutral-600" style={{ paddingLeft: '1.5rem', listStyle: 'disc' }}>
                {(t('terms.sections.liability.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Información sobre inversiones */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.investmentInfo.title')}
              </h2>
              <p className="text-neutral-600">
                {t('terms.sections.investmentInfo.content')}
              </p>
            </div>

            {/* Enlaces externos */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.externalLinks.title')}
              </h2>
              <p className="text-neutral-600">
                {replaceCompany(t('terms.sections.externalLinks.content'))}
              </p>
            </div>

            {/* Modificaciones */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.modifications.title')}
              </h2>
              <p className="text-neutral-600">
                {replaceCompany(t('terms.sections.modifications.content'))}
              </p>
            </div>

            {/* Legislación aplicable */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.jurisdiction.title')}
              </h2>
              <p className="text-neutral-600">
                {t('terms.sections.jurisdiction.content')}
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                {t('terms.sections.contact.title')}
              </h2>
              <p className="text-neutral-600">
                {t('terms.sections.contact.content')}: {' '}
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
