import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to: string;
  label?: string;
  variant?: 'default' | 'glass' | 'inline';
  className?: string;
}

/**
 * Reusable back navigation button.
 * - "default": solid pill button, great for content pages inside AppLayout
 * - "glass": glassmorphism floating pill, for full-bleed "universe" pages
 * - "inline": minimal text link, for tight header areas
 */
export function BackButton({
  to,
  label = 'Back to Dashboard',
  variant = 'default',
  className = '',
}: BackButtonProps) {
  const cls = `nerdx-back-btn nerdx-back-btn--${variant} ${className}`.trim();

  return (
    <Link to={to} className={cls}>
      <ArrowLeft size={18} strokeWidth={2.2} />
      <span>{label}</span>
    </Link>
  );
}
