import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigation, companyInfo, siteConfig } from '@/data/company';
import { Button } from '@/components/common';

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const enabledNavItems = navigation.filter((item) => item.enabled);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-primary-600'
      }`}
    >
      <div className="layout-container">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`text-xl md:text-2xl font-bold transition-colors ${
              isScrolled ? 'text-primary-500' : 'text-white'
            }`}
          >
            {companyInfo.name}
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center" style={{ gap: '2rem' }}>
            {enabledNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? location.pathname === item.path
                      ? 'text-primary-500'
                      : 'text-neutral-700 hover:text-primary-500'
                    : location.pathname === item.path
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {t(item.label)}
              </Link>
            ))}
          </div>

          {/* Acciones Desktop */}
          <div className="hidden lg:flex items-center" style={{ gap: '1rem' }}>
            {siteConfig.showLanguageSwitch && (
              <button
                onClick={toggleLanguage}
                className={`flex items-center text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-neutral-600 hover:text-primary-500'
                    : 'text-white/80 hover:text-white'
                }`}
                title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                style={{ gap: '0.25rem' }}
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{i18n.language}</span>
              </button>
            )}
            <Button 
              href="/contacto" 
              size="sm"
              variant={isScrolled ? 'primary' : 'outline'}
              className={isScrolled ? '' : 'border-white text-white hover:bg-white hover:text-primary-600'}
            >
              {t('nav.contact')}
            </Button>
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden transition-colors ${
              isScrolled ? 'text-neutral-700' : 'text-white'
            }`}
            style={{ padding: '0.5rem' }}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-neutral-100"
          >
            <div className="layout-container" style={{ padding: '1.5rem 0' }}>
              <div className="flex flex-col" style={{ gap: '1rem' }}>
                {enabledNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-lg font-medium ${
                      location.pathname === item.path
                        ? 'text-primary-500'
                        : 'text-neutral-700'
                    }`}
                    style={{ padding: '0.5rem 0' }}
                  >
                    {t(item.label)}
                  </Link>
                ))}
                <hr className="border-neutral-100" />
                {siteConfig.showLanguageSwitch && (
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center text-lg font-medium text-neutral-600"
                    style={{ gap: '0.5rem', padding: '0.5rem 0' }}
                  >
                    <Globe className="w-5 h-5" />
                    {i18n.language === 'es' ? 'English' : 'Español'}
                  </button>
                )}
                <Button href="/contacto" fullWidth>
                  {t('nav.contact')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
