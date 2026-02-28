import { Check } from 'lucide-react';

interface ProjectFeaturesProps {
  features: string[];
}

export function ProjectFeatures({ features }: ProjectFeaturesProps) {
  if (!features || features.length === 0) {
    return <span className="text-neutral-500 text-sm">Sin características destacadas.</span>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-center text-neutral-700" style={{ padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '0.5rem' }}>
          <Check className="w-5 h-5 text-accent-500 shrink-0" style={{ marginRight: '0.5rem' }} />
          <span className="text-sm">{feature}</span>
        </div>
      ))}
    </div>
  );
}
