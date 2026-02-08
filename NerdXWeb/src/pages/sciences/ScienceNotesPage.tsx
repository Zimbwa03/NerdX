/**
 * ScienceNotesPage - Premium Desktop Design
 * Features deep space themes, glassmorphism, and advanced desktop layout
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { scienceNotesApi } from '../../services/api/scienceNotesApi';
import type { NotesSection, TopicNotes } from '../../data/scienceNotes/types';
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
  Video,
  Volume2,
  Lock,
} from 'lucide-react';
import './ScienceUniverse.css'; // Import the new premium science styles

type ScienceSubject = 'Biology' | 'Chemistry' | 'Physics';

// Map URL params to display names
const SUBJECT_LABELS: Record<string, ScienceSubject> = {
  biology: 'Biology',
  chemistry: 'Chemistry',
  physics: 'Physics',
};

// Map URL params to theme classes
const SUBJECT_THEMES: Record<string, string> = {
  biology: 'bio',
  chemistry: 'chem',
  physics: 'phys',
};

// Map URL params to accent colors
const SUBJECT_COLORS: Record<string, string> = {
  biology: '#10B981',
  chemistry: '#F59E0B',
  physics: '#06B6D4',
};

export function ScienceNotesPage() {
  const { subject: subjectParam, topic: topicParam } = useParams<{ subject: string; topic: string }>();
  const location = useLocation();
  const { user } = useAuth();

  const normalizedSubject = useMemo(() => {
    if (subjectParam) return subjectParam.toLowerCase();
    const path = location.pathname.toLowerCase();
    if (path.includes('/biology/')) return 'biology';
    if (path.includes('/chemistry/')) return 'chemistry';
    if (path.includes('/physics/')) return 'physics';
    return '';
  }, [subjectParam, location.pathname]);

  const subjectName = useMemo(() => SUBJECT_LABELS[normalizedSubject] ?? null, [normalizedSubject]);
  const topicName = useMemo(() => (topicParam ? decodeURIComponent(topicParam) : ''), [topicParam]);
  const themeClass = useMemo(() => SUBJECT_THEMES[normalizedSubject] || '', [normalizedSubject]);
  const accentColor = useMemo(() => SUBJECT_COLORS[normalizedSubject] || '#10B981', [normalizedSubject]);

  const [notes, setNotes] = useState<TopicNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  // Media Lock Logic
  const isMediaLocked = useMemo(() => {
    // Check if user has purchased credits
    const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;

    // For now, we don't have topic index easily available here without fetching all topics.
    // So we'll lock media based on credit status only for simplicity, 
    // OR we could fetch topics to check index if needed for "First 2 topics free" logic.
    // For this implementation plan, we'll keep it simple: Paid credits unlock media.
    return !hasPaidCredits;
  }, [user]);

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
              <Heading className="science-notes-subtitle" style={{ color: accentColor }}>{section.title}</Heading>
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
      <div className={`science-universe-page ${themeClass} loading-screen`}>
        <div className="science-universe-bg" />
        <div className="loading-spinner" style={{ borderColor: accentColor, borderTopColor: 'transparent' }}></div>
        <div className="loading-text">Loading {subjectName} Notes...</div>
      </div>
    );
  }

  if (!notes || !subjectName) {
    return (
      <div className={`science-universe-page ${themeClass}`}>
        <div className="science-universe-bg" />
        <Link to={`/app/${normalizedSubject}`} className="super-back-btn">
          <ArrowLeft size={24} />
        </Link>
        <div className="science-hero">
          <h1>Notes Not Found</h1>
          <p>The requested notes could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`science-universe-page ${themeClass}`}>
      <div className={`science-universe-bg ${themeClass}-bg`} />
      <div className="science-grid-overlay" />

      {/* Header Bar */}
      <div className="science-notes-header-bar glass-panel">
        <Link to={`/app/${normalizedSubject}`} className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <div className="header-breadcrumbs">
          <span className="crumb-subject" style={{ color: accentColor }}>{subjectName}</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-topic">{notes.topic}</span>
        </div>
      </div>

      <div className="science-notes-content-container">

        {/* Media Section */}
        {(notes.audioUrl || notes.videoUrl) && (
          <div className="science-media-section">
            <div className="media-grid">

              {/* Video Player Card */}
              {notes.videoUrl && (
                <div className="science-media-card video-card">
                  <div className="media-card-header">
                    <Video size={20} className="media-icon" />
                    <span>Video Lesson</span>
                  </div>

                  {isMediaLocked ? (
                    <div className="locked-media-container">
                      <div className="locked-overlay">
                        <Lock size={48} className="lock-icon" />
                        <h3>Premium Video</h3>
                        <p>Unlock this video lesson by purchasing credits</p>
                        <Link to="/app/credits" className="unlock-btn" style={{ backgroundColor: accentColor }}>
                          Unlock Now
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="video-wrapper">
                      <video controls src={notes.videoUrl} className="science-video-player" />
                    </div>
                  )}
                </div>
              )}

              {/* Audio Player Card */}
              {notes.audioUrl && (
                <div className="science-media-card audio-card">
                  <div className="media-card-header">
                    <Volume2 size={20} className="media-icon" />
                    <span>Audio Lesson</span>
                  </div>

                  {isMediaLocked ? (
                    <div className="locked-media-container audio-locked">
                      <div className="locked-overlay">
                        <Lock size={32} className="lock-icon" />
                        <h3>Premium Audio</h3>
                        <p>Unlock audio lesson</p>
                        <Link to="/app/credits" className="unlock-btn small" style={{ backgroundColor: accentColor }}>
                          Unlock
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="audio-wrapper">
                      <audio controls src={notes.audioUrl} className="science-audio-player" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Content */}
        <div className="science-notes-body-grid">
          <div className="notes-main-col">

            {/* Summary */}
            <div className="science-notes-card summary-card">
              <div className="card-header highlight" style={{ borderColor: accentColor }}>
                <Info size={24} style={{ color: accentColor }} />
                <h3>Summary</h3>
              </div>
              <div className="card-content">
                <MathRenderer content={notes.summary} fontSize={16} />
              </div>
            </div>

            {/* Sections */}
            <div className="notes-sections-list">
              {notes.sections.map((section, i) => (
                <div key={`${section.title}-${i}`} className={`science-notes-card section-card ${expanded.has(i) ? 'expanded' : ''}`}>
                  <button
                    type="button"
                    className="section-header-btn"
                    onClick={() => toggle(i)}
                  >
                    <div className="section-number" style={{ backgroundColor: accentColor }}>{i + 1}</div>
                    <h3 className="section-title">{section.title}</h3>
                    {expanded.has(i) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>

                  {expanded.has(i) && (
                    <div className="section-body">
                      <MathRenderer content={section.content} fontSize={16} />
                      {renderSubsections(section.subsections)}

                      {/* Diagrams */}
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
            {/* Key Points */}
            {notes.key_points?.length > 0 && (
              <div className="science-notes-card key-points-card">
                <div className="card-header" style={{ color: '#10B981' }}>
                  <CheckCircle size={20} />
                  <h3>Key Points</h3>
                </div>
                <ul className="points-list">
                  {notes.key_points.map((point, i) => (
                    <li key={i}>
                      <span className="bullet" style={{ backgroundColor: accentColor }}></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam Tips */}
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

            {/* Flashcards (New Feature) */}
            <FlashcardSection
              subject={subjectName}
              topic={notes.topic}
              notes={notes}
              accentColor={accentColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
