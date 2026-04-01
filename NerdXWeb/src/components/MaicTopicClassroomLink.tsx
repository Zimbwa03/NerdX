import type { NavigateFunction } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './MaicTopicClassroomLink.css';

type Props = {
  navigate: NavigateFunction;
  subject: string;
  gradeLevel: string;
  topicName: string;
  /** Use on gold / accounting topic cards */
  variant?: 'default' | 'accounting';
};

/** Inside topic cards; stops propagation so the parent card can open the quiz. */
export function MaicTopicClassroomLink({
  navigate,
  subject,
  gradeLevel,
  topicName,
  variant = 'default',
}: Props) {
  return (
    <button
      type="button"
      className={`ma-topic-classroom-btn${variant === 'accounting' ? ' ma-topic-classroom-btn--accounting' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        navigate('/app/ai-classroom', {
          state: { subject, formLevel: gradeLevel, topic: topicName },
        });
      }}
      aria-label={`Open AI Classroom for ${topicName}`}
    >
      <Sparkles className="ma-topic-classroom-btn__icon" size={13} strokeWidth={2.25} aria-hidden />
      AI Classroom
    </button>
  );
}
