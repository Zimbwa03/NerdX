import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTopicNotesBySlug } from '../../data/computerScienceNotes/notes';
import type { TopicNotes as ScienceTopicNotes } from '../../data/scienceNotes/types';
import { MathRenderer } from '../../components/MathRenderer';
import { FlashcardSection } from '../../components/FlashcardSection';
import { ArrowLeft, Info, ChevronDown, ChevronUp, CheckCircle, Lightbulb } from 'lucide-react';

const CS_ACCENT = '#0D47A1';

function toFlashcardNotes(notes: NonNullable<ReturnType<typeof getTopicNotesBySlug>>): ScienceTopicNotes {
  return {
    topic: notes.topic,
    subject: notes.subject,
    summary: notes.summary,
    sections: notes.sections.map((s) => ({
      title: s.title,
      content: s.content,
      diagrams: [],
      subsections: s.subsections?.map((sub) => ({
        title: sub.title,
        content: sub.content,
        diagrams: [],
      })),
    })),
    key_points: notes.key_points,
    exam_tips: notes.exam_tips,
  };
}

export function ALevelComputerScienceNoteDetailPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const notes = topicSlug ? getTopicNotesBySlug(topicSlug) : null;
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (!topicSlug || !notes) {
    return (
      <div className="math-notes-page">
        <Link to="/app/a-level-computer-science/notes" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="math-notes-not-found">
          Notes for this topic are not available.
        </p>
      </div>
    );
  }

  return (
    <div className="math-notes-page">
      <header className="math-notes-header-bar">
        <Link to="/app/a-level-computer-science/notes" className="back-link">
          <ArrowLeft size={20} /> Back to topics
        </Link>
        <span className="math-notes-header-subtitle">A-Level Computer Science Notes</span>
        <h1 className="math-notes-header-title">{notes.topic}</h1>
      </header>

      <div className="math-notes-content">
        <div className="math-notes-card math-notes-summary-card">
          <div className="math-notes-card-header">
            <Info size={24} className="math-notes-card-icon math-notes-icon-info" />
            <h2 className="math-notes-card-title">Summary</h2>
          </div>
          <div className="math-notes-card-body">
            <MathRenderer content={notes.summary} fontSize={16} />
          </div>
        </div>

        {notes.sections.map((section, i) => (
          <div key={i} className="math-notes-card math-notes-section-card">
            <button
              type="button"
              className="math-notes-section-head"
              onClick={() => toggle(i)}
            >
              <h2 className="math-notes-card-title">{section.title}</h2>
              {expanded.has(i) ? (
                <ChevronUp size={24} className="math-notes-chevron" />
              ) : (
                <ChevronDown size={24} className="math-notes-chevron" />
              )}
            </button>
            {expanded.has(i) && (
              <div className="math-notes-card-body">
                <MathRenderer content={section.content} fontSize={16} />
              </div>
            )}
          </div>
        ))}

        {notes.key_points?.length > 0 && (
          <div className="math-notes-card math-notes-keypoints-card">
            <div className="math-notes-card-header">
              <CheckCircle size={24} className="math-notes-card-icon math-notes-icon-success" />
              <h2 className="math-notes-card-title">Key Points</h2>
            </div>
            <div className="math-notes-card-body">
              <ul className="math-notes-points-list">
                {notes.key_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {notes.exam_tips?.length > 0 && (
          <div className="math-notes-card math-notes-examtips-card">
            <div className="math-notes-card-header">
              <Lightbulb size={24} className="math-notes-card-icon math-notes-icon-warning" />
              <h2 className="math-notes-card-title">Exam Tips</h2>
            </div>
            <div className="math-notes-card-body">
              <ul className="math-notes-tips-list">
                {notes.exam_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <FlashcardSection
          subject="A Level Computer Science"
          topic={notes.topic}
          notes={toFlashcardNotes(notes)}
          accentColor={CS_ACCENT}
        />
      </div>
    </div>
  );
}
