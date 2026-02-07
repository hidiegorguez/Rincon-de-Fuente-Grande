import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Linkedin, Instagram } from 'lucide-react';
import { navigation, companyInfo } from '@/data/company';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const enabledNavItems = navigation.filter((item) => item.enabled);

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="layout-container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '2rem' }}>
          {/* Columna 1: Logo y descripción */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <img 
                src="/icon.png" 
                alt="" 
                className="w-10 h-10"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              {companyInfo.name}
            </Link>
            <p className="text-neutral-400" style={{ marginTop: '1rem', maxWidth: '28rem' }}>
              {t('footer.description')}
            </p>
            {/* Redes sociales */}
            <div className="flex" style={{ gap: '1rem', marginTop: '1.5rem' }}>
              {/* {companyInfo.social.linkedin && (
                <a
                  href={companyInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )} */}
              {companyInfo.social.instagram && (
                <a
                  href={companyInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h4 className="text-lg font-semibold" style={{ marginBottom: '1rem' }}>{t('footer.links.title')}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {enabledNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-lg font-semibold" style={{ marginBottom: '1rem' }}>{t('contact.info.title')}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a
                  href={`mailto:${companyInfo.contact.email}`}
                  className="flex items-center text-neutral-400 hover:text-white transition-colors"
                  style={{ gap: '0.5rem' }}
                >
                  <Mail className="w-4 h-4" />
                  {companyInfo.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${companyInfo.contact.phone}`}
                  className="flex items-center text-neutral-400 hover:text-white transition-colors"
                  style={{ gap: '0.5rem' }}
                >
                  <Phone className="w-4 h-4" />
                  {companyInfo.contact.phone}
                </a>
              </li>
              {companyInfo.contact.schedule && (
                <li className="text-neutral-400">
                  {companyInfo.contact.schedule}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center"
          style={{ marginTop: '3rem', paddingTop: '2rem', gap: '1rem' }}
        >
          <p className="text-neutral-500 text-sm">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </p>
          <div className="flex text-sm" style={{ gap: '1.5rem' }}>
            <Link
              to="/privacidad"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              {t('footer.legal.privacy')}
            </Link>
            <Link
              to="/terminos"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              {t('footer.legal.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
