interface FeatureCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  onClick: () => void;
  fullWidth?: boolean;
  glowColor?: string;
}

export function FeatureCard({ title, subtitle, imageSrc, onClick, fullWidth = false, glowColor = '#7C4DFF' }: FeatureCardProps) {
  return (
    <button
      type="button"
      className={`feature-card ${fullWidth ? 'feature-card-full' : ''}`}
      onClick={onClick}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      <div className="feature-card-image-wrap">
        <img src={imageSrc} alt={title} className="feature-card-image" />
        <div className="feature-card-gradient" />
      </div>
      <div className="feature-card-content">
        <span className="feature-card-title">{title}</span>
        <span className="feature-card-subtitle">{subtitle}</span>
      </div>
    </button>
  );
}
