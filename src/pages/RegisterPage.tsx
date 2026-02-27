/**
 * Página de Registro
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { Section, Button } from '@/components/common';
import { useAuth } from '@/contexts';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);
    
    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
      navigate('/portal'); // Redirigir al portal después de registro
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

  const displayError = validationError || error;

  // Validación visual de contraseña
  const passwordChecks = {
    length: formData.password.length >= 8,
    match: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0,
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
              Crear cuenta
            </h1>
            <p className="md:text-lg text-neutral-600">
              Regístrate para acceder al portal de clientes y seguir tus proyectos.
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
              {displayError && (
                <div 
                  className="bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-center"
                  style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', gap: '0.5rem' }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User 
                      className="absolute text-neutral-400 w-5 h-5" 
                      style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    Email *
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

                {/* Teléfono */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-neutral-700"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    Teléfono (opcional)
                  </label>
                  <div className="relative">
                    <Phone 
                      className="absolute text-neutral-400 w-5 h-5" 
                      style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                      placeholder="+34 600 000 000"
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
                    Contraseña *
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
                      minLength={8}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-neutral-700"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    Confirmar contraseña *
                  </label>
                  <div className="relative">
                    <Lock 
                      className="absolute text-neutral-400 w-5 h-5" 
                      style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
                      style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                      placeholder="Repite la contraseña"
                    />
                  </div>
                </div>

                {/* Password checks */}
                {formData.password && (
                  <div className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div className={`flex items-center ${passwordChecks.length ? 'text-green-600' : 'text-neutral-400'}`} style={{ gap: '0.5rem' }}>
                      <CheckCircle className="w-4 h-4" />
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    {formData.confirmPassword && (
                      <div className={`flex items-center ${passwordChecks.match ? 'text-green-600' : 'text-red-500'}`} style={{ gap: '0.5rem' }}>
                        <CheckCircle className="w-4 h-4" />
                        <span>Las contraseñas coinciden</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit */}
                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Creando cuenta...'
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" style={{ marginRight: '0.5rem' }} />
                      Crear cuenta
                    </>
                  )}
                </Button>
              </form>

              {/* Link a login */}
              <div 
                className="text-center text-neutral-600"
                style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e5e5' }}
              >
                ¿Ya tienes cuenta?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Inicia sesión
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
