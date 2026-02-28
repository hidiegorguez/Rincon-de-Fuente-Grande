import { Check } from 'lucide-react';

interface ProjectFeaturesProps {
  features: string[];
}

export function ProjectFeatures({ features }: ProjectFeaturesProps) {
  if (!features || features.length === 0) {
    return <span className="text-neutral-500 text-sm">Sin características destacadas.</span>;
  }
  // 2 columnas en móvil, 3 en tablet, 4 en desktop
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="flex items-center text-neutral-700"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderRadius: '0.5rem',
            minHeight: 40,
          }}
        >
          <Check className="w-5 h-5 text-accent-500 shrink-0" style={{ marginRight: '0.5rem' }} />
          <span className="text-sm">{feature}</span>
        </div>
      ))}
    </div>
  );
}
