import { Loader2, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface ProjectMessage {
  id: string;
  user_id: string;
  user_name: string;
  subject: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
}

interface ProjectMessagesProps {
  messages: ProjectMessage[];
  messageSent: boolean;
  sendingMessage: boolean;
  messageError: string | null;
  messageSubject: string;
  messageContent: string;
  replyingTo: string | null;
  replyContent: string;
  setMessageSubject: (v: string) => void;
  setMessageContent: (v: string) => void;
  setReplyingTo: (v: string | null) => void;
  setReplyContent: (v: string) => void;
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
  setMessageSubject,
  setMessageContent,
  setReplyingTo,
  setReplyContent,
  handleSendMessage,
  formatDate,
}: ProjectMessagesProps) {
  // Renderiza un mensaje y sus replies
  function renderMessageThread(message: ProjectMessage) {
    const replies = messages.filter((r) => r.parent_id === message.id);
    return (
      <div key={message.id} className="bg-neutral-50 rounded-md" style={{ padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div className="flex items-baseline justify-between" style={{ marginBottom: '0.25rem' }}>
          <span className="text-sm font-medium text-neutral-800">{message.user_name}</span>
          <span className="text-xs text-neutral-400">{message.created_at && formatDate(message.created_at)}</span>
        </div>
        <p className="text-sm font-medium text-primary-700" style={{ marginBottom: '0.25rem' }}>{message.subject}</p>
        <p className="text-neutral-600 text-sm whitespace-pre-wrap">{message.content}</p>
        {/* Replies */}
        {replies.length > 0 && (
          <div style={{ marginTop: '0.75rem', marginLeft: '1.5rem', borderLeft: '2px solid #e5e5e5', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {replies.map(renderMessageThread)}
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
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-neutral-800 flex items-center" style={{ marginBottom: '0.75rem', gap: '0.5rem', marginTop: '2.5rem' }}>
        <MessageSquare className="w-5 h-5" />
        Conversación
      </h3>
      {messages.length === 0 && !messageSent ? (
        <p className="text-neutral-500 text-sm" style={{ marginBottom: '1rem' }}>
          Inicia la conversación sobre este proyecto.
        </p>
      ) : (
        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
          {messages.filter(m => !m.parent_id).map(renderMessageThread)}
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
    </div>
  );
}
