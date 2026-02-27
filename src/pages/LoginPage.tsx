/**
 * Página de Inicio de Sesión
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Section, Button } from '@/components/common';
import { useAuth } from '@/contexts';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData.email, formData.password);
      navigate('/portal'); // Redirigir al portal después de login
    } catch {
      // El error ya se maneja en el contexto
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
              Iniciar sesión
            </h1>
            <p className="md:text-lg text-neutral-600">
              Accede a tu portal de cliente para ver tus proyectos y mensajes.
            </p>
          </div>
        </div>
      </section>

      <Section background="light" paddingY="lg">
        <div className="max-w-md" style={{ margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-md shadow-md" style={{ padding: '2rem' }}>
              
              {/* Error */}
              {error && (
                <div 
                  className="bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-center"
                  style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', gap: '0.5rem' }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail 
                      className="absolute text-neutral-400 w-5 h-5" 
                      style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock 
                      className="absolute text-neutral-400 w-5 h-5" 
                      style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Iniciando sesión...'
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" style={{ marginRight: '0.5rem' }} />
                      Iniciar sesión
                    </>
                  )}
                </Button>
              </form>

              {/* Link a registro */}
              <div 
                className="text-center text-neutral-600"
                style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e5e5' }}
              >
                ¿No tienes cuenta?{' '}
                <Link 
                  to="/registro" 
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
