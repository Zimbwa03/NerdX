import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { scienceNotesApi } from '../../services/api/scienceNotesApi';
import type { NotesSection, TopicNotes } from '../../data/scienceNotes/types';
import { MathRenderer } from '../../components/MathRenderer';
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Lightbulb,
  Video,
  Volume2,
} from 'lucide-react';

type ScienceSubject = 'Biology' | 'Chemistry' | 'Physics';

const SUBJECT_LABELS: Record<string, ScienceSubject> = {
  biology: 'Biology',
  chemistry: 'Chemistry',
  physics: 'Physics',
};

export function ScienceNotesPage() {
  const { subject: subjectParam, topic: topicParam } = useParams<{ subject: string; topic: string }>();
  const subjectName = useMemo(() => {
    if (!subjectParam) return null;
    const key = subjectParam.toLowerCase();
    return SUBJECT_LABELS[key] ?? null;
  }, [subjectParam]);
  const topicName = useMemo(() => (topicParam ? decodeURIComponent(topicParam) : ''), [topicParam]);

  const [notes, setNotes] = useState<TopicNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (!subjectName || !topicName) {
      setLoading(false);
      setNotes(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await scienceNotesApi.getTopicNotes(subjectName, topicName);
        if (!cancelled) setNotes(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [subjectName, topicName]);

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const renderSubsections = (sections?: NotesSection[], depth: number = 0) => {
    if (!sections?.length) return null;
    return (
      <div className={`science-notes-subsections depth-${depth}`}>
        {sections.map((section, index) => {
          const Heading = depth === 0 ? 'h3' : 'h4';
          return (
            <div key={`${section.title}-${index}`} className="science-notes-subsection">
              <Heading className="science-notes-subtitle">{section.title}</Heading>
              <MathRenderer content={section.content} fontSize={15} />
              {renderSubsections(section.subsections, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="science-notes-page">
        <div className="science-notes-loading">Preparing science notes...</div>
      </div>
    );
  }

  if (!notes || !subjectName) {
    return (
      <div className="science-notes-page">
        <Link to="/app/sciences" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="science-notes-not-found">Notes for "{topicName}" are not available.</p>
      </div>
    );
  }

  return (
    <div className="science-notes-page">
      <header className="science-notes-header-bar">
        <Link
          to="/app/sciences"
          className="back-link"
          state={{ activeTab: subjectName }}
        >
          <ArrowLeft size={20} /> Back
        </Link>
        <span className="science-notes-header-subtitle">{subjectName} Notes</span>
        <h1 className="science-notes-header-title">{notes.topic}</h1>
      </header>

      <div className="science-notes-content">
        <div className="science-notes-card science-notes-summary-card">
          <div className="science-notes-card-header">
            <Info size={24} className="science-notes-card-icon science-notes-icon-info" />
            <h2 className="science-notes-card-title">Summary</h2>
          </div>
          <div className="science-notes-card-body">
            <MathRenderer content={notes.summary} fontSize={16} />
          </div>
        </div>

        {(notes.audioUrl || notes.videoUrl) && (
          <div className="science-notes-media-grid">
            {notes.audioUrl && (
              <div className="science-notes-card">
                <div className="science-notes-card-header">
                  <Volume2 size={22} className="science-notes-card-icon science-notes-icon-audio" />
                  <h2 className="science-notes-card-title">Audio Lesson</h2>
                </div>
                <audio controls src={notes.audioUrl} className="science-notes-audio" />
              </div>
            )}
            {notes.videoUrl && (
              <div className="science-notes-card">
                <div className="science-notes-card-header">
                  <Video size={22} className="science-notes-card-icon science-notes-icon-video" />
                  <h2 className="science-notes-card-title">Video Lesson</h2>
                </div>
                <video controls src={notes.videoUrl} className="science-notes-video" />
              </div>
            )}
          </div>
        )}

        {notes.sections.map((section, i) => (
          <div key={`${section.title}-${i}`} className="science-notes-card science-notes-section-card">
            <button
              type="button"
              className="science-notes-section-head"
              onClick={() => toggle(i)}
            >
              <h2 className="science-notes-card-title">{section.title}</h2>
              {expanded.has(i) ? (
                <ChevronUp size={24} className="science-notes-chevron" />
              ) : (
                <ChevronDown size={24} className="science-notes-chevron" />
              )}
            </button>
            {expanded.has(i) && (
              <div className="science-notes-card-body">
                <MathRenderer content={section.content} fontSize={16} />
                {renderSubsections(section.subsections)}
              </div>
            )}
          </div>
        ))}

        {notes.key_points?.length > 0 && (
          <div className="science-notes-card">
            <div className="science-notes-card-header">
              <CheckCircle size={24} className="science-notes-card-icon science-notes-icon-success" />
              <h2 className="science-notes-card-title">Key Points</h2>
            </div>
            <div className="science-notes-card-body">
              <ul className="science-notes-points-list">
                {notes.key_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {notes.exam_tips?.length > 0 && (
          <div className="science-notes-card">
            <div className="science-notes-card-header">
              <Lightbulb size={24} className="science-notes-card-icon science-notes-icon-warning" />
              <h2 className="science-notes-card-title">Exam Tips</h2>
            </div>
            <div className="science-notes-card-body">
              <ul className="science-notes-tips-list">
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
