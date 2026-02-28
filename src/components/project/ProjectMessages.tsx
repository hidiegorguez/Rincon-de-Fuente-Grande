
import { CheckCircle, Loader2, Send, MessageSquare } from 'lucide-react';
import type { ProjectMessage } from '@/types/project';

interface ProjectMessagesProps {
  messages: ProjectMessage[];
  messageSent: boolean;
  sendingMessage: boolean;
  messageError: string | null;
  messageSubject: string;
  messageContent: string;
  replyingTo: string | null;
  replyContent: string;
  replySent: string | null; // id del mensaje al que se ha respondido con éxito
  replyError: string | null; // error específico de reply
  setMessageSubject: (v: string) => void;
  setMessageContent: (v: string) => void;
  setReplyingTo: (v: string | null) => void;
  setReplyContent: (v: string) => void;
  setReplySent: (v: string | null) => void;
  setReplyError: (v: string | null) => void;
  handleSendMessage: (e: React.FormEvent, parentId?: string | null) => void;
  formatDate: (date: string) => string;
}

export function ProjectMessages({
  messages,
  messageSent,
  sendingMessage,
  messageError,
  messageSubject,
  messageContent,
  replyingTo,
  replyContent,
  replySent,
  replyError,
  setMessageSubject,
  setMessageContent,
  setReplyingTo,
  setReplyContent,
  setReplySent,
  setReplyError,
  handleSendMessage,
  formatDate,
}: ProjectMessagesProps) {
  // Renderiza un mensaje y sus replies
  function renderMessageThread(message: ProjectMessage, isReply: boolean = false){
    const replies = messages.filter((r) => r.parent_id === message.id);
    // Permitir responder siempre a mensajes raíz (isReply === false), nunca a replies
    const canReply = !isReply && !replyingTo;
    return (
      <div
        key={message.id}
        className={isReply ? "bg-neutral-100 rounded-md" : "bg-neutral-50 rounded-lg shadow-sm"}
        style={{
          padding: isReply ? '1rem 1.25rem' : '1.25rem 1.5rem',
          marginBottom: isReply ? '1rem' : '1.25rem',
          border: isReply ? '1px solid #e5e5e5' : '1px solid #ececec',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div className="flex items-baseline justify-between" style={{ marginBottom: '0.5rem' }}>
          <span className="text-base font-semibold text-neutral-800">{message.user_name}</span>
          <span className="text-xs text-neutral-400">{message.created_at && formatDate(message.created_at)}</span>
        </div>
        <p className="text-base font-bold text-primary-700" style={{ marginBottom: '0.25rem' }}>{message.subject}</p>
        <p className="text-neutral-700 text-sm whitespace-pre-wrap" style={{ marginBottom: '0.5rem' }}>{message.content}</p>
        {/* Replies */}
        {replies.length > 0 && (
          <div
            style={{
              marginTop: '1.25rem',
              marginLeft: isReply ? '1rem' : '1.5rem',
              borderLeft: '2px solid #e5e5e5',
              paddingLeft: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {replies.map(reply => renderMessageThread(reply, true))}
          </div>
        )}
        {/* Reply button and form, solo para mensajes raíz sin reply */}
        {canReply && (
          <button
            className="mt-3 text-sm text-primary-600 hover:underline"
            style={{ fontWeight: 500 }}
            onClick={() => { setReplyingTo(message.id); setReplyContent(''); setReplySent(null); setReplyError(null); }}
          >
            Responder
          </button>
        )}
        {/* Formulario de respuesta */}
        {replyingTo === message.id && (
          <form onSubmit={e => handleSendMessage(e, message.id)} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              required
              minLength={5}
              maxLength={2000}
              rows={3}
              className="w-full border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              style={{ padding: '0.75rem 1.25rem', marginBottom: '0.5rem' }}
              placeholder="Escribe tu respuesta..."
            />
            {replyError && (
              <p className="text-red-600 text-xs" style={{ marginBottom: '0.5rem' }}>{replyError}</p>
            )}
            {replySent === message.id && (
              <div className="bg-green-50 border border-green-200 rounded-md flex items-center" style={{ padding: '0.75rem 1rem', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-green-700 text-xs">Respuesta enviada correctamente.</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={sendingMessage || replyContent.length < 5}
                className="inline-flex items-center text-sm bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                style={{ padding: '0.5rem 1.5rem' }}
              >
                {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span style={{ marginLeft: 6 }}>Responder</span>
              </button>
              <button type="button" className="text-sm text-neutral-500" style={{ marginLeft: 8 }} onClick={() => { setReplyingTo(null); setReplyContent(''); setReplySent(null); setReplyError(null); }}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h3 className="text-lg font-bold text-neutral-800 flex items-center" style={{ marginBottom: '1.25rem', gap: '0.75rem' }}>
        <MessageSquare className="w-5 h-5" />
        Conversación
      </h3>
      {messages.filter(m => !m.parent_id).length === 0 && !messageSent ? (
        <p className="text-neutral-500 text-sm" style={{ marginBottom: '1.5rem' }}>
          Inicia la conversación sobre este proyecto.
        </p>
      ) : (
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {messages.filter(m => !m.parent_id).map(msg => renderMessageThread(msg))}
        </div>
      )}
      {/* Formulario de mensaje compacto */}
      {messageSent ? (
        <div 
          className="bg-green-50 border border-green-200 rounded-md flex items-center"
          style={{ padding: '1rem 1.25rem', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm">Mensaje enviado correctamente.</p>
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="bg-neutral-50 rounded-lg shadow-sm" style={{ padding: '1.5rem 1.5rem', marginBottom: '1.5rem', border: '1px solid #ececec', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            value={messageSubject}
            onChange={(e) => setMessageSubject(e.target.value)}
            required
            minLength={3}
            maxLength={200}
            className="w-full border border-neutral-300 rounded-md text-base focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            style={{ padding: '0.75rem 1rem' }}
            placeholder="Asunto del mensaje"
          />
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            required
            minLength={10}
            maxLength={5000}
            rows={3}
            className="w-full border border-neutral-300 rounded-md text-base focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
            style={{ padding: '0.75rem 1rem' }}
            placeholder="Escribe tu mensaje..."
          />
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
              style={{ padding: '0.5rem 1.5rem', gap: '0.5rem' }}
            >
              {sendingMessage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span style={{ marginLeft: 6 }}>Enviar</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
