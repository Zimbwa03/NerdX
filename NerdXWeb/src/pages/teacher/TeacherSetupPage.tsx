import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TEACHER_SUBJECTS,
  GRADE_LEVELS,
  SUBJECT_TOPICS,
  A_LEVEL_TOPICS,
  SUBJECT_COLORS,
  SUBJECT_ICONS,
} from '../../data/teacherConstants';
import { ArrowLeft, Clock } from 'lucide-react';

export function TeacherSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const state = (location.state || {}) as { subject?: string; gradeLevel?: string; topic?: string };
  const [selectedSubject, setSelectedSubject] = useState(state.subject || '');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(state.gradeLevel || 'Form 3-4 (O-Level)');
  const [selectedTopic, setSelectedTopic] = useState(state.topic || '');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const subject = searchParams.get('subject') || state.subject;
    const topic = searchParams.get('topic') || state.topic;
    const gradeLevel = searchParams.get('gradeLevel') || state.gradeLevel;
    if (subject && TEACHER_SUBJECTS.includes(subject as (typeof TEACHER_SUBJECTS)[number])) setSelectedSubject(subject);
    if (topic) setSelectedTopic(topic);
    if (gradeLevel && GRADE_LEVELS.includes(gradeLevel as (typeof GRADE_LEVELS)[number])) setSelectedGradeLevel(gradeLevel);
  }, [searchParams, state.subject, state.topic, state.gradeLevel]);

  const availableTopics = selectedSubject
    ? (selectedGradeLevel === 'A-Level' || selectedSubject.includes('A-Level')
        ? A_LEVEL_TOPICS[selectedSubject] || []
        : SUBJECT_TOPICS[selectedSubject] || [])
    : [];
  const subjectColor = selectedSubject ? SUBJECT_COLORS[selectedSubject] ?? '#667eea' : '#667eea';

  const handleStart = () => {
    if (!selectedSubject || !selectedGradeLevel) {
      setToast('Please select subject and grade level');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const credits = user?.credits ?? 0;
    if (credits <= 0) {
      setToast('You need credits to use Teacher Mode. Please top up.');
      setTimeout(() => setToast(null), 4000);
      return;
    }
    navigate('/app/teacher/chat', {
      state: { subject: selectedSubject, gradeLevel: selectedGradeLevel, topic: selectedTopic || undefined },
    });
  };

  return (
    <div className="teacher-setup-page">
      {toast && <div className="teacher-setup-toast" role="alert">{toast}</div>}

      <header className="teacher-setup-header">
        <Link to="/app" className="teacher-setup-back" aria-label="Back">
          <ArrowLeft size={24} />
        </Link>
        <Link to="/app/teacher/history" className="teacher-setup-history" aria-label="Session History">
          <Clock size={24} />
        </Link>
        <div className="teacher-setup-header-content">
          <div className="teacher-setup-avatar">
            {selectedSubject ? SUBJECT_ICONS[selectedSubject] ?? '👨‍🏫' : '👨‍🏫'}
          </div>
          <div className="teacher-setup-header-text">
            <h1>{selectedSubject ? `${selectedSubject} Tutor` : 'AI Teacher Mode'}</h1>
            <p>
              {selectedSubject
                ? `Interactive ${selectedSubject} tutoring session`
                : 'Configure your personalized learning session'}
            </p>
          </div>
        </div>
      </header>

      <div className="teacher-setup-sections">
        <section className="teacher-setup-section">
          <h2 className="teacher-setup-section-title">📚 Select Subject</h2>
          <div className="teacher-setup-chips teacher-setup-subjects">
            {TEACHER_SUBJECTS.map((subj) => (
              <button
                key={subj}
                type="button"
                className={`teacher-setup-chip teacher-setup-subject-chip ${selectedSubject === subj ? 'active' : ''}`}
                style={
                  selectedSubject === subj
                    ? { backgroundColor: SUBJECT_COLORS[subj], color: '#fff', borderColor: SUBJECT_COLORS[subj] }
                    : {}
                }
                onClick={() => {
                  setSelectedSubject(subj);
                  setSelectedTopic('');
                }}
              >
                <span className="teacher-setup-chip-icon">{SUBJECT_ICONS[subj]}</span>
                <span>{subj}</span>
              </button>
            ))}
          </div>
        </section>

        {selectedSubject && (
          <section className="teacher-setup-section">
            <h2 className="teacher-setup-section-title">📖 Choose Topic</h2>
            <p className="teacher-setup-section-desc">Select a specific topic or leave as Any Topic for general tutoring.</p>
            <div className="teacher-setup-chips teacher-setup-topics">
              <button
                type="button"
                className={`teacher-setup-topic-chip ${selectedTopic === '' ? 'active' : ''}`}
                style={
                  selectedTopic === ''
                    ? { backgroundColor: subjectColor, color: '#fff', borderColor: subjectColor }
                    : { borderColor: subjectColor }
                }
                onClick={() => setSelectedTopic('')}
              >
                🎯 Any Topic
              </button>
              {availableTopics.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`teacher-setup-topic-chip ${selectedTopic === t ? 'active' : ''}`}
                  style={
                    selectedTopic === t
                      ? { backgroundColor: subjectColor, color: '#fff', borderColor: subjectColor }
                      : { borderColor: 'rgba(255,255,255,0.1)' }
                  }
                  onClick={() => setSelectedTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="teacher-setup-section">
          <h2 className="teacher-setup-section-title">📊 Grade Level</h2>
          <div className="teacher-setup-grade-levels">
            {GRADE_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={`teacher-setup-grade-btn ${selectedGradeLevel === level ? 'active' : ''}`}
                style={
                  selectedGradeLevel === level
                    ? { backgroundColor: subjectColor, color: '#fff', borderColor: subjectColor }
                    : {}
                }
                onClick={() => setSelectedGradeLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <div
          className="teacher-setup-info-box"
          style={{ borderLeftColor: subjectColor }}
        >
          <h3 style={{ color: subjectColor }}>✨ What You'll Get</h3>
          <ul>
            <li>Interactive Socratic tutoring</li>
            <li>Step-by-step explanations</li>
            <li>{selectedSubject?.toLowerCase().includes('math') ? 'Dynamic graph generation' : 'Visual diagrams'}</li>
            <li>Downloadable PDF notes</li>
          </ul>
          <p className="teacher-setup-credit-hint">
            💎 <strong>0.1 Credit</strong> per AI response (Start for Free)
          </p>
        </div>

        <button
          type="button"
          className="teacher-setup-start-btn"
          style={{
            background: selectedSubject ? `linear-gradient(90deg, ${subjectColor}, ${subjectColor}CC)` : '#999',
            opacity: selectedSubject && selectedGradeLevel ? 1 : 0.6,
          }}
          onClick={handleStart}
          disabled={!selectedSubject || !selectedGradeLevel}
        >
          Start {selectedSubject || ''} Tutor →
        </button>
      </div>
    </div>
  );
}
