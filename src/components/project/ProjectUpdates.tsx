import { FileText } from 'lucide-react';

interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  update_type: string;
  attachments: { url: string; filename: string }[];
  published_at: string;
}

interface ProjectUpdatesProps {
  updates: ProjectUpdate[];
  getUpdateTypeInfo: (type: string) => { label: string; color: string };
  formatDate: (date: string) => string;
}

export function ProjectUpdates({ updates, getUpdateTypeInfo, formatDate }: ProjectUpdatesProps) {
  if (!updates || updates.length === 0) {
    return <p className="text-neutral-500 text-sm" style={{ marginBottom: '1.5rem' }}>Sin actualizaciones todavía.</p>;
  }
  return (
    <>
      <h3 className="text-lg font-bold text-neutral-800 flex items-center" style={{ marginBottom: '1rem', gap: '0.5rem' }}>
        <FileText className="w-5 h-5" />
        Actualizaciones
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {updates.map((update) => {
          const info = getUpdateTypeInfo(update.update_type);
          return (
            <div
              key={update.id}
              className="bg-white border border-neutral-200 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300"
              style={{ padding: '1.5rem' }}
            >
              <div
                className={`inline-block rounded text-xs font-semibold ${info.color}`}
                style={{ padding: '0.25rem 0.75rem', marginBottom: '0.75rem' }}
              >
                {info.label}
              </div>
              <div className="font-bold text-neutral-800" style={{ marginBottom: '0.25rem' }}>
                {update.title}
              </div>
              <div className="text-xs text-neutral-500" style={{ marginBottom: '0.75rem' }}>
                {formatDate(update.published_at)}
              </div>
              <div className="text-neutral-700 text-sm leading-relaxed">
                {update.content}
              </div>
              {update.attachments && update.attachments.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {update.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-primary-600 hover:underline"
                      style={{ gap: '0.5rem' }}
                    >
                      <FileText className="w-4 h-4" />
                      {att.filename}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
