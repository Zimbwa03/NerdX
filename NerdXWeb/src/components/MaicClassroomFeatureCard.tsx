import type { NavigateFunction } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

type Props = {
  navigate: NavigateFunction;
  /** Label passed to Teacher Mode / MAIC (e.g. "O Level Biology") */
  subject: string;
  /** e.g. "Form 3-4 (O-Level)" */
  gradeLevel: string;
  accent?: string;
};

/**
 * Subject hub card: opens MAIC AI Classroom with preset subject/level.
 * Topic can be chosen on the classroom page or via topic-level links.
 */
export function MaicClassroomFeatureCard({
  navigate,
  subject,
  gradeLevel,
  accent = 'rgba(16, 185, 129, 0.15)',
}: Props) {
  return (
    <div
      className="science-feature-card"
      role="button"
      tabIndex={0}
      onClick={() =>
        navigate('/app/ai-classroom', {
          state: { subject, formLevel: gradeLevel, topic: '' },
        })
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/app/ai-classroom', {
            state: { subject, formLevel: gradeLevel, topic: '' },
          });
        }
      }}
    >
      <div className="feature-icon-box" style={{ background: accent }}>
        <GraduationCap size={28} color="#34d399" />
      </div>
      <h3 className="feature-card-title">AI Classroom</h3>
      <p className="feature-card-desc">
        Structured lesson with Mr. Moyo, a classmate voice, and a quiz — multi-agent
        classroom mode for ZIMSEC-style study.
      </p>
    </div>
  );
}
