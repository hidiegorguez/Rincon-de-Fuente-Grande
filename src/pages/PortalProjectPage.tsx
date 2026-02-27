/**
 * Página de Detalle de Proyecto en el Portal
 * Usa la misma estructura que ProjectDetailPage pero con datos de la API autenticada
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  Check,
  FileText,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Send,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { Section, Button } from '@/components/common';
import { useAuth } from '@/contexts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Tipos
interface ProjectLocation {
  city: string;
  province: string;
  region: string;
}

interface InvestmentDetails {
  purchase_price: number;
  reform_cost: number | null;
  total_investment: number;
  current_value: number | null;
  monthly_rent: number | null;
  annual_return: number;
}

interface ProjectImage {
  url: string;
  filename: string;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  location: ProjectLocation;
  type: string;
  short_description: string;
  description: string;
  main_image: ProjectImage | null;
  gallery: ProjectImage[];
  images: ProjectImage[];
  status: string;
  year: number;
  featured: boolean;
  is_public: boolean;
  investment_details: InvestmentDetails;
  features: string[];
}

interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  update_type: string;
  attachments: { url: string; filename: string }[];
  published_at: string;
}

interface ProjectMessage {
  id: string;
  user_id: string;
  user_name: string;
  subject: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
}

export function PortalProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el formulario de mensajes
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Cargar proyecto (incluye actualizaciones y mensajes)
  useEffect(() => {
    async function fetchData() {
      if (!token || !slug) return;
      
      try {
        const response = await fetch(`${API_URL}/api/projects/my-projects/${slug}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Proyecto no encontrado');
          } else if (response.status === 403) {
            setError('No tienes acceso a este proyecto');
          } else {
            throw new Error('Error al cargar el proyecto');
          }
          return;
        }
        
        const data = await response.json();
        setProject(data);
        setUpdates(data.updates || []);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    }
    
    if (isAuthenticated && token) {
      fetchData();
    }
  }, [isAuthenticated, token, slug]);

  // Helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getUpdateTypeInfo = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      'avance': { label: 'Avance de obra', color: 'bg-blue-100 text-blue-700' },
      'documento': { label: 'Documento', color: 'bg-purple-100 text-purple-700' },
      'financiero': { label: 'Actualización financiera', color: 'bg-green-100 text-green-700' },
      'noticia': { label: 'Noticia', color: 'bg-orange-100 text-orange-700' },
    };
    return types[type] || { label: type, color: 'bg-neutral-100 text-neutral-700' };
  };

  // Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!token || !slug) return;
    setSendingMessage(true);
    setMessageError(null);
    let subject = messageSubject;
    let content = messageContent;
    let url = `${API_URL}/api/messages`;
    let method = 'POST';
    let body: any = {};
    if (parentId) {
      // Buscar el mensaje padre por el campo personalizado 'ID', no por el record_id
      const parentMsg = messages.find(m => m.id === parentId || m.parent_id === parentId);
      // Usar el campo 'ID' si existe, si no, fallback al record_id
      const parentCustomId = parentMsg && parentMsg.parent_id ? parentMsg.parent_id : parentId;
      subject = parentMsg ? parentMsg.subject : '';
      content = replyContent;
      url = `${API_URL}/api/messages/${parentCustomId}/reply`;
      body = { content };
    } else {
      body = { subject, content, project_id: slug };
    }
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Error al enviar el mensaje');
      }
      const newMessage = await response.json();
      setMessages(prev => [{
        id: newMessage.id,
        user_id: '',
        user_name: 'Tú',
        subject,
        content,
        created_at: new Date().toISOString(),
        parent_id: parentId,
      }, ...prev]);
      setMessageSent(true);
      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setMessageSubject('');
        setMessageContent('');
      }
      setTimeout(() => setMessageSent(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessageError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  // Estado de carga
  if (authLoading || loading) {
    return (
      <Section background="white" paddingY="xl">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-neutral-600" style={{ marginTop: '1rem' }}>Cargando proyecto...</p>
        </div>
      </Section>
    );
  }

  // Estado de error
  if (error || !project) {
    return (
      <Section background="white" paddingY="xl">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" style={{ marginBottom: '1rem' }} />
          <h1 
            className="text-2xl font-bold text-neutral-800"
            style={{ marginBottom: '0.5rem' }}
          >
            {error || 'Proyecto no encontrado'}
          </h1>
          <p 
            className="text-neutral-600"
            style={{ marginBottom: '2rem' }}
          >
            {error === 'No tienes acceso a este proyecto' 
              ? 'Este proyecto no está asignado a tu cuenta.'
              : 'El proyecto que buscas no existe o ha sido eliminado.'}
          </p>
          <Button href="/portal">Volver al portal</Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {project.main_image ? (
          <img
            src={project.main_image.url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-neutral-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        <div 
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: '1.5rem 1.5rem 3rem' }}
        >
          <div className="layout-container">
            <Link
              to="/portal"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              style={{ marginBottom: '1rem' }}
            >
              <ArrowLeft className="w-4 h-4" style={{ marginRight: '0.5rem' }} />
              Volver al portal
            </Link>
            <h1 
              className="text-3xl md:text-5xl font-bold text-white"
              style={{ marginBottom: '0.5rem' }}
            >
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center text-white/90" style={{ gap: '1rem' }}>
              <span className="flex items-center">
                <MapPin className="w-4 h-4" style={{ marginRight: '0.25rem' }} />
                {project.location.city}, {project.location.province}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4" style={{ marginRight: '0.25rem' }} />
                {project.year}
              </span>
              <span
                className={`rounded-full text-sm font-medium ${
                  project.status === 'completed'
                    ? 'bg-green-500/20 text-green-300'
                    : project.status === 'in-progress'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
                style={{ padding: '0.25rem 0.75rem' }}
              >
                {t(`portfolio.status.${project.status}`)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <Section background="white" paddingY="lg">
        <div className="grid-project-detail">
          {/* Main Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 
                className="text-2xl font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                Descripción del proyecto
              </h2>
              <p 
                className="text-neutral-600 leading-relaxed"
                style={{ marginBottom: '2rem' }}
              >
                {project.description || project.short_description || 'Sin descripción disponible.'}
              </p>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <>
                  <h3 
                    className="text-xl font-bold text-neutral-800"
                    style={{ marginBottom: '1rem' }}
                  >
                    {t('portfolio.details.features')}
                  </h3>
                  <div 
                    className="grid grid-cols-2 md:grid-cols-3"
                    style={{ gap: '1rem', marginBottom: '2rem' }}
                  >
                    {project.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-neutral-700"
                        style={{ padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '0.5rem' }}
                      >
                        <Check className="w-5 h-5 text-accent-500 shrink-0" style={{ marginRight: '0.5rem' }} />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <>
                  <h3 
                    className="text-xl font-bold text-neutral-800"
                    style={{ marginBottom: '1rem' }}
                  >
                    Galería
                  </h3>
                  <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                    {project.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${project.title} - Imagen ${index + 1}`}
                        className="rounded-sm w-full aspect-video object-cover"
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Imágenes del proyecto */}
              {project.images && project.images.length > 0 && (
                <>
                  <h3 
                    className="text-xl font-bold text-neutral-800"
                    style={{ marginBottom: '1rem' }}
                  >
                    Imágenes
                  </h3>
                  <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                    {project.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${project.title} - Imagen ${index + 1}`}
                        className="rounded-sm w-full aspect-video object-cover"
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Actualizaciones del proyecto */}
              <h3 
                className="text-lg font-bold text-neutral-800 flex items-center"
                style={{ marginBottom: '0.75rem', gap: '0.5rem' }}
              >
                <FileText className="w-5 h-5" />
                Actualizaciones
              </h3>
              
              {updates.length === 0 ? (
                <p className="text-neutral-500 text-sm" style={{ marginBottom: '1.5rem' }}>
                  Sin actualizaciones todavía.
                </p>
              ) : (
                <div style={{ marginBottom: '1.5rem', borderLeft: '2px solid #e5e5e5', paddingLeft: '1rem' }}>
                  {updates.map((update) => {
                    const typeInfo = getUpdateTypeInfo(update.update_type);
                    return (
                      <div
                        key={update.id}
                        style={{ position: 'relative', paddingBottom: '1rem' }}
                      >
                        <div 
                          style={{ 
                            position: 'absolute',
                            left: '-1.35rem',
                            top: '0.25rem',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                          }}
                        />
                        <div className="flex items-baseline justify-between" style={{ gap: '0.5rem' }}>
                          <span className="text-sm font-medium text-neutral-800">{update.title}</span>
                          <span className="text-xs text-neutral-400 whitespace-nowrap">
                            {formatDate(update.published_at)}
                          </span>
                        </div>
                        <span 
                          className={`inline-block rounded text-xs ${typeInfo.color}`}
                          style={{ padding: '0 0.375rem', marginTop: '0.25rem' }}
                        >
                          {typeInfo.label}
                        </span>
                        {update.content && (
                          <p className="text-neutral-600 text-sm" style={{ marginTop: '0.25rem' }}>
                            {update.content.length > 100 ? update.content.substring(0, 100) + '...' : update.content}
                          </p>
                        )}
                        {update.attachments && update.attachments.length > 0 && (
                          <div className="flex flex-wrap" style={{ gap: '0.5rem', marginTop: '0.25rem' }}>
                            {update.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-600 hover:text-primary-700"
                              >
                                📎 {att.filename || `Archivo ${i + 1}`}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Mensajes del proyecto */}
              <h3 
                className="text-lg font-bold text-neutral-800 flex items-center"
                style={{ marginBottom: '0.75rem', gap: '0.5rem' }}
              >
                <MessageSquare className="w-5 h-5" />
                Conversación
              </h3>
              
              {messages.length === 0 && !messageSent ? (
                <p className="text-neutral-500 text-sm" style={{ marginBottom: '1rem' }}>
                  Inicia la conversación sobre este proyecto.
                </p>
              ) : (
                <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {messages.filter(m => !m.parent_id).map((message) => (
                    <div key={message.id} className="bg-neutral-50 rounded-md" style={{ padding: '0.75rem' }}>
                      <div className="flex items-baseline justify-between" style={{ marginBottom: '0.25rem' }}>
                        <span className="text-sm font-medium text-neutral-800">{message.user_name}</span>
                        <span className="text-xs text-neutral-400">
                          {message.created_at && formatDate(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-primary-700" style={{ marginBottom: '0.25rem' }}>
                        {message.subject}
                      </p>
                      <p className="text-neutral-600 text-sm whitespace-pre-wrap">{message.content}</p>
                      {/* Replies */}
                      {messages.filter(r => r.parent_id === message.id).length > 0 && (
                        <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem', borderLeft: '2px solid #e5e5e5', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {messages.filter(r => r.parent_id === message.id).map(reply => (
                            <div key={reply.id} className="bg-neutral-100 rounded-md" style={{ padding: '0.75rem 1rem' }}>
                              <div className="flex items-baseline justify-between" style={{ marginBottom: '0.25rem' }}>
                                <span className="text-sm font-medium text-neutral-700">{reply.user_name}</span>
                                <span className="text-xs text-neutral-400">{reply.created_at && formatDate(reply.created_at)}</span>
                              </div>
                              <p className="text-sm font-medium text-primary-700" style={{ marginBottom: '0.25rem' }}>{reply.subject}</p>
                              <p className="text-neutral-600 text-sm whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Reply button and form */}
                      {replyingTo === message.id ? (
                        <form onSubmit={e => handleSendMessage(e, message.id)} className="mt-3">
                          <textarea
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            required
                            minLength={5}
                            maxLength={2000}
                            rows={3}
                            className="w-full border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            style={{ padding: '0.75rem 1rem', marginBottom: '0.75rem' }}
                            placeholder="Escribe tu respuesta..."
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              disabled={sendingMessage || replyContent.length < 5}
                              className="inline-flex items-center text-sm bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                              style={{ padding: '0.5rem 1.25rem' }}
                            >
                              {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                              Responder
                            </button>
                            <button type="button" className="text-sm text-neutral-500" onClick={() => setReplyingTo(null)}>Cancelar</button>
                          </div>
                        </form>
                      ) : (
                        <button
                          className="mt-3 text-sm text-primary-600 hover:underline"
                          onClick={() => { setReplyingTo(message.id); setReplyContent(''); }}
                        >
                          Responder
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario de mensaje compacto */}
              {messageSent ? (
                <div 
                  className="bg-green-50 border border-green-200 rounded-md flex items-center"
                  style={{ padding: '0.75rem', gap: '0.5rem' }}
                >
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-sm">Mensaje enviado correctamente.</p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="bg-neutral-50 rounded-md" style={{ padding: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      required
                      minLength={3}
                      maxLength={200}
                      className="w-full border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      style={{ padding: '0.5rem 0.75rem' }}
                      placeholder="Asunto del mensaje"
                    />
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={2}
                      className="w-full border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      style={{ padding: '0.5rem 0.75rem' }}
                      placeholder="Escribe tu mensaje..."
                    />
                  </div>
                  {messageError && (
                    <p className="text-red-600 text-xs" style={{ marginBottom: '0.5rem' }}>{messageError}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {messageSubject.length >= 3 && messageContent.length >= 10 ? '✓ Listo para enviar' : `${Math.max(0, 3 - messageSubject.length)} / ${Math.max(0, 10 - messageContent.length)} caracteres más`}
                    </span>
                    <button
                      type="submit"
                      disabled={sendingMessage || messageSubject.length < 3 || messageContent.length < 10}
                      className="inline-flex items-center text-sm bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                      style={{ padding: '0.5rem 1rem', gap: '0.375rem' }}
                    >
                      {sendingMessage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Enviar
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-50 rounded-md sticky top-28"
              style={{ padding: '1.5rem' }}
            >
              <h3 
                className="text-lg font-bold text-neutral-800"
                style={{ marginBottom: '1rem' }}
              >
                Datos de inversión
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-neutral-600">
                    {t('portfolio.details.type')}
                  </span>
                  <span className="font-medium text-neutral-800">
                    {t(`portfolio.types.${project.type}`)}
                  </span>
                </div>

                {project.investment_details.purchase_price > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      Precio de compra
                    </span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(project.investment_details.purchase_price)}
                    </span>
                  </div>
                )}

                {project.investment_details.reform_cost && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      Coste de reforma
                    </span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(project.investment_details.reform_cost)}
                    </span>
                  </div>
                )}

                {project.investment_details.total_investment > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      {t('portfolio.details.investment')}
                    </span>
                    <span className="font-bold text-primary-500">
                      {formatCurrency(project.investment_details.total_investment)}
                    </span>
                  </div>
                )}

                {project.investment_details.current_value && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      Valor actual
                    </span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(project.investment_details.current_value)}
                    </span>
                  </div>
                )}

                {project.investment_details.monthly_rent && (
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <span className="text-neutral-600">
                      Renta mensual
                    </span>
                    <span className="font-medium text-neutral-800">
                      {formatCurrency(project.investment_details.monthly_rent)}
                    </span>
                  </div>
                )}

                {project.investment_details.annual_return > 0 && (
                  <div 
                    className="flex justify-between items-center"
                    style={{ paddingTop: '0.5rem' }}
                  >
                    <span className="text-neutral-800 font-medium">
                      {t('portfolio.details.return')}
                    </span>
                    <span className="flex items-center text-green-600 font-bold text-xl">
                      <TrendingUp className="w-5 h-5" style={{ marginRight: '0.25rem' }} />
                      {Math.round(100 * project.investment_details.annual_return)}%
                    </span>
                  </div>
                )}
              </div>

              <p 
                className="text-xs text-neutral-500"
                style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-neutral-200)' }}
              >
                Los datos financieros son orientativos y pueden variar según las condiciones del mercado.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>
    </>
  );
}
