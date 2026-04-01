import { MARKETPLACE_SUBJECT_COLORS } from '../../data/marketplaceConstants';

interface SubjectBadgeProps {
  subject: string;
  level?: string;
  size?: 'sm' | 'md';
}

export function SubjectBadge({ subject, level, size = 'sm' }: SubjectBadgeProps) {
  const color = MARKETPLACE_SUBJECT_COLORS[subject] || '#10B981';

  return (
    <span
      className={`subject-badge subject-badge--${size}`}
      style={{ '--badge-color': color } as React.CSSProperties}
    >
      {subject}
      {level && <span className="subject-badge__level">{level}</span>}
    </span>
  );
}
