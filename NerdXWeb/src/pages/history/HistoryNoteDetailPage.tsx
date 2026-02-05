import { useParams, Link } from 'react-router-dom';
import { getTopicNotesBySlug } from '../../data/historyNotes/notes';
import { ArrowLeft, Info, CheckCircle, Lightbulb } from 'lucide-react';

function ContentBlock({ content }: { content: string }) {
  return (
    <div className="commerce-notes-detail-body">
      {content.split(/\n\n+/).map((para, i) => (
        <p key={i} className="commerce-notes-detail-para">
          {para.split(/(\*\*.*?\*\*)/g).map((bit, j) =>
            bit.startsWith('**') && bit.endsWith('**') ? (
              <strong key={j}>{bit.slice(2, -2)}</strong>
            ) : (
              bit
            )
          )}
        </p>
      ))}
    </div>
  );
}

export function HistoryNoteDetailPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const notes = topicSlug ? getTopicNotesBySlug(topicSlug) : null;

  if (!topicSlug || !notes) {
    return (
      <div className="commerce-notes-page">
        <Link to="/app/history/notes" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="commerce-notes-detail-not-found">
          Notes for this topic are not available.
        </p>
      </div>
    );
  }

  return (
    <div className="commerce-notes-page commerce-notes-detail-page bes-notes-detail-page history-notes-detail-page">
      <header className="commerce-notes-detail-header">
        <Link to="/app/history/notes" className="back-link">
          <ArrowLeft size={20} /> Back to topics
        </Link>
        <span className="commerce-notes-detail-subtitle">History Notes</span>
        <h1 className="commerce-notes-detail-title">{notes.topic}</h1>
      </header>

      <div className="commerce-notes-detail-content">
        <div className="commerce-notes-detail-card commerce-notes-detail-summary">
          <div className="commerce-notes-detail-card-head">
            <Info size={24} className="commerce-notes-detail-icon" />
            <h2 className="commerce-notes-detail-card-title">Summary</h2>
          </div>
          <div className="commerce-notes-detail-card-body">
            <ContentBlock content={notes.summary} />
          </div>
        </div>

        {notes.sections.map((section, i) => (
          <div key={i} className="commerce-notes-detail-card commerce-notes-detail-section">
            <h2 className="commerce-notes-detail-card-title">{section.title}</h2>
            <div className="commerce-notes-detail-card-body">
              <ContentBlock content={section.content} />
            </div>
          </div>
        ))}

        {notes.key_points.length > 0 && (
          <div className="commerce-notes-detail-card commerce-notes-detail-keypoints">
            <div className="commerce-notes-detail-card-head">
              <CheckCircle size={24} className="commerce-notes-detail-icon" />
              <h2 className="commerce-notes-detail-card-title">Key points</h2>
            </div>
            <ul className="commerce-notes-detail-list">
              {notes.key_points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {notes.exam_tips.length > 0 && (
          <div className="commerce-notes-detail-card commerce-notes-detail-examtips">
            <div className="commerce-notes-detail-card-head">
              <Lightbulb size={24} className="commerce-notes-detail-icon" />
              <h2 className="commerce-notes-detail-card-title">Exam tips</h2>
            </div>
            <ul className="commerce-notes-detail-list">
              {notes.exam_tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
