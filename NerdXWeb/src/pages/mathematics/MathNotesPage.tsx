import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mathNotesApi } from '../../services/api/mathNotesApi';
import type { MathTopicNotes } from '../../data/mathNotes/types';
import { MathRenderer } from '../../components/MathRenderer';
import { ArrowLeft, Info, ChevronDown, ChevronUp, CheckCircle, Lightbulb, PenLine } from 'lucide-react';

export function MathNotesPage() {
  const { topic: topicSlug } = useParams<{ topic: string }>();
  const topicName = topicSlug?.replace(/-/g, ' ') ?? '';
  const [notes, setNotes] = useState<MathTopicNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (!topicName) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await mathNotesApi.getTopicNotes(topicName);
        if (!cancelled) setNotes(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [topicName]);

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="math-notes-page">
        <div className="math-notes-loading">Preparing professional math notes…</div>
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="math-notes-page">
        <Link to="/app/mathematics" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="math-notes-not-found">Notes for &quot;{topicName}&quot; are not available.</p>
      </div>
    );
  }

  return (
    <div className="math-notes-page">
      <header className="math-notes-header-bar">
        <Link to="/app/mathematics" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <span className="math-notes-header-subtitle">Mathematics Notes</span>
        <h1 className="math-notes-header-title">{notes.topic}</h1>
      </header>

      <div className="math-notes-content">
        {/* Summary Section */}
        <div className="math-notes-card math-notes-summary-card">
          <div className="math-notes-card-header">
            <Info size={24} className="math-notes-card-icon math-notes-icon-info" />
            <h2 className="math-notes-card-title">Summary</h2>
          </div>
          <div className="math-notes-card-body">
            <MathRenderer content={notes.summary} fontSize={16} />
          </div>
        </div>

        {/* Main Content Sections */}
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
                {section.worked_examples?.map((ex, k) => (
                  <div key={k} className="math-notes-example-box">
                    <div className="math-notes-example-header">
                      <PenLine size={20} className="math-notes-example-icon" />
                      <span className="math-notes-example-title">Worked Example</span>
                    </div>
                    <MathRenderer content={ex.question} fontSize={16} />
                    <div className="math-notes-steps">
                      {ex.steps.map((step, s) => (
                        <div key={s} className="math-notes-step-row">
                          <span className="math-notes-step-num">{s + 1}</span>
                          <div className="math-notes-step-content">
                            <MathRenderer content={step} fontSize={15} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="math-notes-example-answer">
                      <span className="math-notes-answer-label">Final Answer:</span>
                      <MathRenderer content={ex.final_answer} fontSize={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Key Points */}
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

        {/* Exam Tips */}
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
      </div>
    </div>
  );
}
