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
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Section, Button } from '@/components/common';
import { useAuth } from '@/contexts';

import { ProjectFeatures } from '@/components/project/ProjectFeatures';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { ProjectUpdates } from '@/components/project/ProjectUpdates';
import { ProjectMessages } from '@/components/project/ProjectMessages';
import { InvestmentSidebar } from '@/components/project/InvestmentSidebar';
import type {
  Project,
  ProjectUpdate,
  ProjectMessage,
} from '@/types/project';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Tipos

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
  const [replySent, setReplySent] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);

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


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUpdateTypeInfo = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      'Avance': { label: 'Avance', color: 'bg-blue-100 text-blue-700' },
      'Hito': { label: 'Hito', color: 'bg-green-100 text-green-700' },
      'Documento': { label: 'Documento', color: 'bg-purple-100 text-purple-700' },
      'Foto': { label: 'Foto', color: 'bg-orange-100 text-orange-700' },
    };
    return types[type] || { label: type, color: 'bg-neutral-100 text-neutral-700' };
  };

  // Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!token || !slug) return;
    setSendingMessage(true);
    setMessageError(null);
    if (parentId) {
      setReplyError(null);
      setReplySent(null);
    }
    let subject = messageSubject;
    let content = messageContent;
    let url = `${API_URL}/api/messages`;
    let method = 'POST';
    let body: any = {};
    if (parentId) {
      const parentMsg = messages.find(m => m.id === parentId || m.parent_id === parentId);
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
        if (parentId) {
          setReplyError(data.detail || 'Error al enviar la respuesta');
        }
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
      if (parentId) {
        setReplySent(parentId);
        setReplyContent('');
        setReplyingTo(null);
        setTimeout(() => setReplySent(null), 5000);
      } else {
        setMessageSent(true);
        setMessageSubject('');
        setMessageContent('');
        setTimeout(() => setMessageSent(false), 5000);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      if (!parentId) setMessageError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
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

              {/* Características */}
              <ProjectFeatures features={project.features} />

              {/* Imágenes del proyecto */}
              <ProjectGallery gallery={project.images} title="Galería" />

              {/* Actualizaciones del proyecto */}
              <ProjectUpdates updates={updates} getUpdateTypeInfo={getUpdateTypeInfo} formatDate={formatDate} />

              {/* Mensajes del proyecto */}
              <ProjectMessages
                messages={messages}
                messageSent={messageSent}
                sendingMessage={sendingMessage}
                messageError={messageError}
                messageSubject={messageSubject}
                messageContent={messageContent}
                replyingTo={replyingTo}
                replyContent={replyContent}
                replySent={replySent}
                replyError={replyError}
                setMessageSubject={setMessageSubject}
                setMessageContent={setMessageContent}
                setReplyingTo={setReplyingTo}
                setReplyContent={setReplyContent}
                setReplySent={setReplySent}
                setReplyError={setReplyError}
                handleSendMessage={handleSendMessage}
                formatDate={formatDate}
              />
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
              <InvestmentSidebar type={project.type} investment_details={project.investment_details} />
            </motion.div>
          </div>
        </div>
      </Section>
    </>
  );
}
