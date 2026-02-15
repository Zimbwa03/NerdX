import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TEACHER_SUBJECTS,
  GRADE_LEVELS,
  SUBJECT_TOPICS,
  A_LEVEL_TOPICS,
  SUBJECT_COLORS,
} from '../../data/teacherConstants';
import { ArrowLeft, Clock, BookOpen, Layers3, Sparkles, CheckCircle2 } from 'lucide-react';

export function TeacherSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const state = (location.state || {}) as { subject?: string; gradeLevel?: string; topic?: string };

  const initialSubject = searchParams.get('subject') || state.subject || '';
  const initialTopic = searchParams.get('topic') || state.topic || '';
  const initialGradeLevel = searchParams.get('gradeLevel') || state.gradeLevel || 'Form 3-4 (O-Level)';

  const [selectedSubject, setSelectedSubject] = useState(
    TEACHER_SUBJECTS.includes(initialSubject as (typeof TEACHER_SUBJECTS)[number]) ? initialSubject : '',
  );
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(
    GRADE_LEVELS.includes(initialGradeLevel as (typeof GRADE_LEVELS)[number])
      ? initialGradeLevel
      : 'Form 3-4 (O-Level)',
  );
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [topicSearch, setTopicSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const availableTopics = useMemo(
    () =>
      selectedSubject
        ? (selectedGradeLevel === 'A-Level' || selectedSubject.includes('A-Level')
            ? A_LEVEL_TOPICS[selectedSubject] || []
            : SUBJECT_TOPICS[selectedSubject] || [])
        : [],
    [selectedGradeLevel, selectedSubject],
  );

  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return availableTopics;
    const query = topicSearch.trim().toLowerCase();
    return availableTopics.filter((topic) => topic.toLowerCase().includes(query));
  }, [availableTopics, topicSearch]);

  const subjectColor = selectedSubject ? SUBJECT_COLORS[selectedSubject] ?? '#667eea' : '#667eea';

  const subjectFallback = selectedSubject
    ? selectedSubject
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    : 'AI';

  const canStart = Boolean(selectedSubject && selectedGradeLevel);

  const handleStart = () => {
    if (!selectedSubject || !selectedGradeLevel) {
      setToast('Please select a subject and grade level.');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const credits = user?.credits ?? 0;
    if (credits <= 0) {
      setToast('You need credits to start Teacher Mode. Please top up first.');
      setTimeout(() => setToast(null), 4000);
      return;
    }

    navigate('/app/teacher/chat', {
      state: {
        subject: selectedSubject,
        gradeLevel: selectedGradeLevel,
        topic: selectedTopic || undefined,
      },
    });
  };

  return (
    <div className="teacher-setup-page teacher-setup-page--v3">
      {toast && (
        <div className="teacher-setup-toast" role="alert">
          {toast}
        </div>
      )}

      <div className="teacher-setup-shell">
        <header className="teacher-setup-hero-v3">
          <div className="teacher-setup-hero-actions">
            <Link to="/app" className="teacher-setup-back" aria-label="Back to dashboard">
              <ArrowLeft size={20} />
            </Link>
            <Link to="/app/teacher/history" className="teacher-setup-history" aria-label="Session history">
              <Clock size={20} />
            </Link>
          </div>

          <div className="teacher-setup-hero-content-v3">
            <span className="teacher-setup-pill">Teacher Mode</span>
            <h1>Build a focused tutoring session</h1>
            <p>Choose subject, grade level, and topic. The chat opens with tools for text, voice, images, and document support.</p>
          </div>

          <div className="teacher-setup-hero-summary">
            <div className="teacher-setup-avatar" style={{ borderColor: `${subjectColor}66` }}>
              {subjectFallback}
            </div>
            <div className="teacher-setup-summary-text">
              <span>{selectedSubject || 'No subject selected'}</span>
              <small>{selectedTopic || 'Any topic'}</small>
            </div>
            <div className="teacher-setup-credits-chip" title="Available credits">
              <strong>{user?.credits ?? 0}</strong>
              <span>credits</span>
            </div>
          </div>
        </header>

        <section className="teacher-setup-grid-v3">
          <article className="teacher-setup-section teacher-setup-section--subject">
            <div className="teacher-setup-section-heading">
              <BookOpen size={16} />
              <h2>Subject</h2>
            </div>
            <p className="teacher-setup-section-desc">Select the subject you want the AI teacher to focus on.</p>

            <div className="teacher-setup-subject-grid-v3">
              {TEACHER_SUBJECTS.map((subjectItem) => {
                const isActive = selectedSubject === subjectItem;
                const color = SUBJECT_COLORS[subjectItem] ?? '#667eea';

                return (
                  <button
                    key={subjectItem}
                    type="button"
                    className={`teacher-setup-chip teacher-setup-subject-card${isActive ? ' active' : ''}`}
                    style={isActive ? { borderColor: color, boxShadow: `0 0 0 1px ${color}66 inset` } : undefined}
                    onClick={() => {
                      setSelectedSubject(subjectItem);
                      setSelectedTopic('');
                      setTopicSearch('');
                    }}
                  >
                    <span className="teacher-setup-chip-icon">
                      {subjectItem
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase() ?? '')
                        .join('')}
                    </span>
                    <span>{subjectItem}</span>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="teacher-setup-section">
            <div className="teacher-setup-section-heading">
              <Layers3 size={16} />
              <h2>Grade Level</h2>
            </div>
            <p className="teacher-setup-section-desc">Set the depth and syllabus level for explanations and examples.</p>

            <div className="teacher-setup-grade-levels">
              {GRADE_LEVELS.map((level) => {
                const isActive = selectedGradeLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    className={`teacher-setup-grade-btn${isActive ? ' active' : ''}`}
                    style={isActive ? { borderColor: subjectColor, color: subjectColor } : undefined}
                    onClick={() => setSelectedGradeLevel(level)}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="teacher-setup-section teacher-setup-section--topic">
            <div className="teacher-setup-section-heading">
              <Sparkles size={16} />
              <h2>Topic</h2>
            </div>
            <p className="teacher-setup-section-desc">Target one area or keep it open for broad revision.</p>

            {availableTopics.length > 8 && (
              <input
                type="text"
                value={topicSearch}
                onChange={(event) => setTopicSearch(event.target.value)}
                placeholder="Filter topics..."
                className="teacher-setup-topic-search"
              />
            )}

            <div className="teacher-setup-chips teacher-setup-topics">
              <button
                type="button"
                className={`teacher-setup-topic-chip${selectedTopic === '' ? ' active' : ''}`}
                style={selectedTopic === '' ? { borderColor: subjectColor, color: subjectColor } : undefined}
                onClick={() => setSelectedTopic('')}
              >
                Any topic
              </button>

              {filteredTopics.map((topicItem) => {
                const isActive = selectedTopic === topicItem;
                return (
                  <button
                    key={topicItem}
                    type="button"
                    className={`teacher-setup-topic-chip${isActive ? ' active' : ''}`}
                    style={isActive ? { borderColor: subjectColor, color: subjectColor } : undefined}
                    onClick={() => setSelectedTopic(topicItem)}
                  >
                    {topicItem}
                  </button>
                );
              })}

              {selectedSubject && filteredTopics.length === 0 && (
                <div className="teacher-setup-empty-topics">No topics match that filter.</div>
              )}
            </div>
          </article>

          <aside className="teacher-setup-info-box teacher-setup-info-box--v3" style={{ borderLeftColor: subjectColor }}>
            <h3>Session Preview</h3>
            <ul>
              <li>
                <CheckCircle2 size={14} />
                <span><strong>Subject:</strong> {selectedSubject || 'Not selected'}</span>
              </li>
              <li>
                <CheckCircle2 size={14} />
                <span><strong>Grade:</strong> {selectedGradeLevel}</span>
              </li>
              <li>
                <CheckCircle2 size={14} />
                <span><strong>Topic:</strong> {selectedTopic || 'Any topic'}</span>
              </li>
              <li>
                <CheckCircle2 size={14} />
                <span>Includes voice input, image attachments, and document analysis in chat.</span>
              </li>
            </ul>
            <p className="teacher-setup-credit-hint">Credits are charged per response based on your plan.</p>
          </aside>
        </section>

        <div className="teacher-setup-footer-v3">
          <button
            type="button"
            className="teacher-setup-start-btn"
            style={canStart ? { borderColor: `${subjectColor}55` } : undefined}
            onClick={handleStart}
            disabled={!canStart}
          >
            Start Teacher Session
          </button>
        </div>
      </div>
    </div>
  );
}
