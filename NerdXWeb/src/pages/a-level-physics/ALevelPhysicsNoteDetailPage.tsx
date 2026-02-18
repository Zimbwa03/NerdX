import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { NotesSection, TopicNotes } from '../../data/scienceNotes/types';
import { aLevelPhysicsNotes, getTopicById } from '../../data/aLevelPhysics';
import { MathRenderer } from '../../components/MathRenderer';
import { FlashcardSection } from '../../components/FlashcardSection';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Lightbulb,
} from 'lucide-react';
import { VideoPlayer, AudioPlayer } from '../../components/MediaPlayer';
import '../sciences/ScienceUniverse.css';

const ACCENT_COLOR = '#06B6D4';

export function ALevelPhysicsNoteDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();

  const topicMeta = useMemo(() => (topicId ? getTopicById(topicId) : undefined), [topicId]);

  const [notes, setNotes] = useState<TopicNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const isMediaLocked = useMemo(() => {
    const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;
    return !hasPaidCredits;
  }, [user]);

  useEffect(() => {
    if (!topicMeta) {
      setLoading(false);
      setNotes(null);
      return;
    }
    const topicNotes = aLevelPhysicsNotes[topicMeta.name];
    setNotes(topicNotes ?? null);
    setLoading(false);
  }, [topicMeta]);

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
              <Heading className="science-notes-subtitle" style={{ color: ACCENT_COLOR }}>
                {section.title}
              </Heading>
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
      <div className="science-universe-page phys loading-screen">
        <div className="science-universe-bg phys-bg" />
        <div className="loading-spinner" style={{ borderColor: ACCENT_COLOR, borderTopColor: 'transparent' }}></div>
        <div className="loading-text">Loading A-Level Physics Notes...</div>
      </div>
    );
  }

  if (!notes || !topicMeta) {
    return (
      <div className="science-universe-page phys">
        <div className="science-universe-bg phys-bg" />
        <Link to="/app/a-level-physics" className="super-back-btn">
          <ArrowLeft size={18} />
          <span>Back</span>
        </Link>
        <div className="science-hero">
          <h1>Notes Not Found</h1>
          <p>The requested A-Level Physics notes could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="science-universe-page phys">
      <div className="science-universe-bg phys-bg" />
      <div className="science-grid-overlay" />

      <div className="science-notes-header-bar glass-panel">
        <Link to="/app/a-level-physics" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <div className="header-breadcrumbs">
          <span className="crumb-subject" style={{ color: ACCENT_COLOR }}>A-Level Physics</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-topic">{notes.topic}</span>
        </div>
      </div>

      <h1 className="science-notes-page-title">{notes.topic}</h1>

      <div className="science-notes-content-container">
        {(notes.audioUrl || notes.videoUrl) && (
          <div className="science-media-section">
            <div className="media-grid">
              {notes.videoUrl && (
                <VideoPlayer
                  src={notes.videoUrl}
                  accentColor={ACCENT_COLOR}
                  locked={isMediaLocked}
                />
              )}
              {notes.audioUrl && (
                <AudioPlayer
                  src={notes.audioUrl}
                  subject="A Level Physics"
                  accentColor={ACCENT_COLOR}
                  locked={isMediaLocked}
                />
              )}
            </div>
          </div>
        )}

        <div className="science-notes-body-grid">
          <div className="notes-main-col">
            <div className="science-notes-card summary-card">
              <div className="card-header highlight" style={{ borderColor: ACCENT_COLOR }}>
                <Info size={24} style={{ color: ACCENT_COLOR }} />
                <h3>Summary</h3>
              </div>
              <div className="card-content">
                <MathRenderer content={notes.summary} fontSize={16} />
              </div>
            </div>

            <div className="notes-sections-list">
              {notes.sections.map((section, i) => (
                <div key={`${section.title}-${i}`} className={`science-notes-card section-card ${expanded.has(i) ? 'expanded' : ''}`}>
                  <button
                    type="button"
                    className="section-header-btn"
                    onClick={() => toggle(i)}
                  >
                    <div className="section-number" style={{ backgroundColor: ACCENT_COLOR }}>{i + 1}</div>
                    <h3 className="section-title">{section.title}</h3>
                    {expanded.has(i) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>

                  {expanded.has(i) && (
                    <div className="section-body">
                      <MathRenderer content={section.content} fontSize={16} />
                      {renderSubsections(section.subsections)}

                      {section.diagrams && section.diagrams.length > 0 && (
                        <div className="section-diagrams">
                          {section.diagrams.map((d, dIdx) => (
                            <div key={dIdx} className="diagram-box">
                              {typeof d === 'string' ? (
                                <img src={d} alt={`Diagram for ${section.title}`} />
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="notes-sidebar-col">
            {notes.key_points?.length > 0 && (
              <div className="science-notes-card key-points-card">
                <div className="card-header" style={{ color: ACCENT_COLOR }}>
                  <CheckCircle size={20} />
                  <h3>Key Points</h3>
                </div>
                <ul className="points-list">
                  {notes.key_points.map((point, i) => (
                    <li key={i}>
                      <span className="bullet" style={{ backgroundColor: ACCENT_COLOR }}></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {notes.exam_tips?.length > 0 && (
              <div className="science-notes-card exam-tips-card">
                <div className="card-header" style={{ color: '#F59E0B' }}>
                  <Lightbulb size={20} />
                  <h3>Exam Tips</h3>
                </div>
                <ul className="points-list">
                  {notes.exam_tips.map((tip, i) => (
                    <li key={i}>
                      <div className="tip-box">
                        {tip}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <FlashcardSection
          subject="A Level Physics"
          topic={notes.topic}
          notes={notes}
          accentColor={ACCENT_COLOR}
        />
      </div>
    </div>
  );
}
