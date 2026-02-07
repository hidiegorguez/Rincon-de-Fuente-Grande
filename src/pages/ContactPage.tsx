import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { Section, Button } from '@/components/common';
import { companyInfo } from '@/data/company';

export function ContactPage() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (aquí iría la lógica real de envío)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', phone: '', message: '' });

    // Reset después de 5 segundos
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero */}
      <section 
        className="bg-white-200"
        style={{ paddingTop: '7rem', paddingBottom: '1rem' }}
      >
        <div className="layout-container">
          <div className="max-w-3xl">
            <h1 
              className="text-2xl md:text-3xl font-bold text-neutral-800"
              style={{ marginBottom: '1rem' }}
            >
              {t('contact.title')}
            </h1>
            <p className="md:text-lg text-neutral-600">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <Section background="light" paddingY="lg">
        <div className="grid-2-cols">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md" style={{ padding: '2rem' }}>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1.5rem' }}
              >
                Envíanos un mensaje
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                  style={{ padding: '3rem 0' }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 
                    className="text-xl font-bold text-neutral-800"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-neutral-600">
                    {t('contact.form.success')}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-700"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem' }}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-700"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem' }}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem' }}
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-neutral-700"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors resize-none"
                      style={{ padding: '0.75rem 1rem' }}
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        {t('contact.form.submit')}
                        <Send className="w-4 h-4" style={{ marginLeft: '0.5rem' }} />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div>
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1.5rem' }}
              >
                {t('contact.info.title')}
              </h2>
              <p 
                className="text-neutral-600"
                style={{ marginBottom: '2rem' }}
              >
                {t('contact.description')}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Email */}
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">
                    {t('contact.info.email')}
                  </h3>
                  <a
                    href={`mailto:${companyInfo.contact.email}`}
                    className="text-primary-500 hover:underline"
                  >
                    {companyInfo.contact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start" style={{ gap: '1rem' }}>
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">
                    {t('contact.info.phone')}
                  </h3>
                  <a
                    href={`tel:${companyInfo.contact.phone}`}
                    className="text-primary-500 hover:underline"
                  >
                    {companyInfo.contact.phone}
                  </a>
                </div>
              </div>

              {/* Schedule */}
              {companyInfo.contact.schedule && (
                <div className="flex items-start" style={{ gap: '1rem' }}>
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {t('contact.info.schedule')}
                    </h3>
                    <p className="text-neutral-600">
                      {companyInfo.contact.schedule}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Trust message */}
            <div 
              className="bg-primary-50 rounded-xl"
              style={{ padding: '1.5rem', marginTop: '2rem' }}
            >
              <h3 
                className="font-semibold text-primary-700"
                style={{ marginBottom: '0.5rem' }}
              >
                Tu información está segura
              </h3>
              <p className="text-sm text-primary-600">
                Respetamos tu privacidad. Tus datos solo se utilizarán para
                contactarte sobre tu consulta y nunca serán compartidos con
                terceros.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
