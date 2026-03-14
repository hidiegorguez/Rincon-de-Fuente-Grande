import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectImage {
  url: string;
  filename: string;
}

interface ProjectGalleryProps {
  gallery: ProjectImage[];
  title?: string;
}

export function ProjectGallery({ gallery, title = 'Galería' }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);
  const prev = useCallback(() => {
    setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : gallery.length - 1));
  }, [gallery.length]);
  const next = useCallback(() => {
    setSelectedIndex((i) => (i !== null && i < gallery.length - 1 ? i + 1 : 0));
  }, [gallery.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, close, prev, next]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <h3 className="text-xl font-bold text-neutral-800" style={{ marginBottom: '1rem' }}>{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
        {gallery.map((img, idx) => (
          <img
            key={img.url || idx}
            src={img.url}
            alt={img.filename || `Imagen ${idx + 1}`}
            className="rounded-sm w-full aspect-video object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedIndex(idx)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={close}
        >
          {/* Cerrar */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            style={{ padding: '0.5rem' }}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Contador */}
          <div
            className="absolute top-4 left-4 text-white/70 text-sm"
          >
            {selectedIndex + 1} / {gallery.length}
          </div>

          {/* Flecha izquierda */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white/70 hover:text-white transition-colors"
              style={{ padding: '0.5rem' }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {/* Imagen grande */}
          <img
            src={gallery[selectedIndex].url}
            alt={gallery[selectedIndex].filename || `Imagen ${selectedIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-md"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Flecha derecha */}
          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white/70 hover:text-white transition-colors"
              style={{ padding: '0.5rem' }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
