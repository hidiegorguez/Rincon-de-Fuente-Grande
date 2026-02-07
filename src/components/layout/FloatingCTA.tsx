import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/data/company';

export function FloatingCTA() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!siteConfig.showFloatingCTA) return;

    const handleScroll = () => {
      // Mostrar después de hacer scroll 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!siteConfig.showFloatingCTA || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed z-50 flex items-center"
          style={{ bottom: '1.5rem', right: '1.5rem', gap: '0.5rem' }}
        >
          {/* Botón de cerrar */}
          <button
            onClick={() => setIsDismissed(true)}
            className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center hover:bg-neutral-300 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* CTA */}
          <Link
            to="/contacto"
            className="flex items-center bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all hover:shadow-xl"
            style={{ gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{t('floatingCta.text')}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
