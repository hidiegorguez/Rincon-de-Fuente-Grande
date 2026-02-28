interface ProjectImage {
  url: string;
  filename: string;
}

interface ProjectGalleryProps {
  gallery: ProjectImage[];
  title?: string;
}

export function ProjectGallery({ gallery, title = 'Galería' }: ProjectGalleryProps) {
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
            className="rounded-sm w-full aspect-video object-cover"
          />
        ))}
      </div>
    </>
  );
}
