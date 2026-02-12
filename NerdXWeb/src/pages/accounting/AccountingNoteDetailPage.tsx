import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Info, Lightbulb } from 'lucide-react';
import { VideoPlayer, AudioPlayer } from '../../components/MediaPlayer';
import { MathRenderer } from '../../components/MathRenderer';
import { FlashcardSection } from '../../components/FlashcardSection';
import { getTopicById } from '../../data/accounting/topics';
import { useAuth } from '../../context/AuthContext';
import type { TopicNotes } from '../../data/scienceNotes/types';

export function AccountingNoteDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();

  const topic = useMemo(() => (topicId ? getTopicById(topicId) : undefined), [topicId]);
  const [notesMap, setNotesMap] = useState<Record<string, TopicNotes> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mod = await import('../../data/accounting/notes');
        if (!active) return;
        setNotesMap(mod.accountingNotes);
      } catch {
        if (!active) return;
        setNotesMap({});
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const notes = useMemo(() => {
    if (!topic || !notesMap) return null;
    return notesMap[topic.name] ?? null;
  }, [topic, notesMap]);

  const isMediaLocked = useMemo(() => {
    const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;
    return !hasPaidCredits;
  }, [user]);

  if (!topicId || !topic) {
    return (
      <div className="accounting-notes-page accounting-note-detail-page">
        <Link to="/app/accounting/notes" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="accounting-notes-not-found">Notes for this topic are not available.</p>
      </div>
    );
  }

  if (!notesMap) {
    return (
      <div className="accounting-notes-page accounting-note-detail-page">
        <Link to="/app/accounting/notes" className="back-link">
          <ArrowLeft size={20} /> Back to topics
        </Link>
        <p className="accounting-notes-not-found">Loading notes...</p>
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="accounting-notes-page accounting-note-detail-page">
        <Link to="/app/accounting/notes" className="back-link">
          <ArrowLeft size={20} /> Back to topics
        </Link>
        <p className="accounting-notes-not-found">Notes for this topic are not available.</p>
      </div>
    );
  }

  return (
    <div className="accounting-notes-page accounting-note-detail-page">
      <header className="accounting-detail-header">
        <Link to="/app/accounting/notes" className="back-link">
          <ArrowLeft size={20} /> Back to topics
        </Link>
        <span className="accounting-detail-subtitle">Accounting Notes</span>
        <h1 className="accounting-detail-title">{notes.topic}</h1>
      </header>

      {(notes.audioUrl || notes.videoUrl) && (
        <div className="accounting-media-grid">
          {notes.videoUrl && (
            <VideoPlayer
              src={notes.videoUrl}
              accentColor="#B8860B"
              locked={isMediaLocked}
            />
          )}
          {notes.audioUrl && (
            <AudioPlayer
              src={notes.audioUrl}
              subject="Accounting"
              accentColor="#B8860B"
              locked={isMediaLocked}
            />
          )}
        </div>
      )}

      <div className="accounting-detail-content">
        <div className="accounting-detail-card">
          <div className="accounting-detail-card-head">
            <Info size={20} />
            <h2>Summary</h2>
          </div>
          <MathRenderer content={notes.summary} fontSize={16} />
        </div>

        {notes.sections.map((section, i) => (
          <div key={`${section.title}-${i}`} className="accounting-detail-card">
            <div className="accounting-detail-card-head">
              <span className="accounting-section-index">{i + 1}</span>
              <h2>{section.title}</h2>
            </div>
            <MathRenderer content={section.content} fontSize={15} />
          </div>
        ))}

        {notes.key_points.length > 0 && (
          <div className="accounting-detail-card">
            <div className="accounting-detail-card-head">
              <Lightbulb size={20} />
              <h2>Key points</h2>
            </div>
            <ul className="accounting-detail-list">
              {notes.key_points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {notes.exam_tips.length > 0 && (
          <div className="accounting-detail-card">
            <div className="accounting-detail-card-head">
              <Lightbulb size={20} />
              <h2>Exam tips</h2>
            </div>
            <ul className="accounting-detail-list">
              {notes.exam_tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        <FlashcardSection subject="accounting" topic={notes.topic} notes={notes} accentColor="#B8860B" />
      </div>
    </div>
  );
}
