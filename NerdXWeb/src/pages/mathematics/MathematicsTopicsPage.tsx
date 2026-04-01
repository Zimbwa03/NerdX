import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import {
  ArrowLeft, TrendingUp, Camera, MessageCircle, BookOpen,
  Calculator, FileText, Play, Atom,
} from 'lucide-react';
import { MaicClassroomFeatureCard } from '../../components/MaicClassroomFeatureCard';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import {
  mathFormLevels,
  getMathTopicsByForm,
  type MathFormLevel,
} from '../../data/oLevelMath/topics';
import { getMathTopicIcon } from '../../data/oLevelMath/topicIcons';
import type { Topic } from '../../services/api/quizApi';
import '../sciences/ScienceUniverse.css';

export function MathematicsTopicsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedForm, setSelectedForm] = useState<MathFormLevel>('Form 1');

  const formTopics = getMathTopicsByForm(selectedForm);
  const displayTopics = formTopics.map((t) => ({
    id: selectedForm === 'Form 4' ? t.name : t.id,
    hubSlug: t.id,
    name: t.name,
    subject: 'mathematics',
  } as Topic & { hubSlug: string }));

  const minCredits = getMinimumCreditsForQuiz({
    subject: 'mathematics',
    questionType: 'topical',
    isImageQuestion: false,
  });

  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const notesTopics = getMathTopicsByForm(selectedForm).filter((t) => t.hasNotes && t.notesKey);

  return (
    <div className="science-universe-page math">
      <div className="science-universe-bg math-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(41, 121, 255, 0.15)', border: '1px solid rgba(41, 121, 255, 0.3)' }}>
          <Calculator size={14} />
          <span>O-LEVEL MATHEMATICS</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #2979FF, #448AFF, #82B1FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master the Universe<br />of Mathematics
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          AI-powered tutoring, real-time feedback, and exam-grade practice from Form 1 to Form 4.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          {mathFormLevels.map((form) => (
            <button
              key={form}
              type="button"
              onClick={() => setSelectedForm(form)}
              style={{
                padding: '10px 22px',
                borderRadius: 50,
                border: `2px solid ${selectedForm === form ? '#2979FF' : 'rgba(255,255,255,0.15)'}`,
                background: selectedForm === form ? 'rgba(41, 121, 255, 0.25)' : 'rgba(255,255,255,0.05)',
                color: selectedForm === form ? '#82B1FF' : 'rgba(255,255,255,0.7)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'O Level Mathematics', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 230, 118, 0.15)' }}>
              <MessageCircle size={28} color="#00E676" />
            </div>
            <h3 className="feature-card-title">AI Math Tutor</h3>
            <p className="feature-card-desc">Interactive Socratic tutoring. Ask any question and get instant, step-by-step guidance.</p>
          </div>

          <MaicClassroomFeatureCard
            navigate={navigate}
            subject="O Level Mathematics"
            gradeLevel={selectedForm}
            accent="rgba(41, 121, 255, 0.15)"
          />

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/mathematics/graph-practice')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(255, 145, 0, 0.15)' }}>
              <TrendingUp size={28} color="#FF9100" />
            </div>
            <h3 className="feature-card-title">Graph Practice</h3>
            <p className="feature-card-desc">Master coordinate geometry. Practice reading, plotting, and analyzing graphs.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/mathematics/scan-solve')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <Camera size={28} color="#10B981" />
            </div>
            <h3 className="feature-card-title">Scan & Solve</h3>
            <p className="feature-card-desc">Snap a photo of any math problem. Our AI solves it instantly with working.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=mathematics')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(41, 121, 255, 0.15)' }}>
              <Atom size={28} color="#2979FF" />
            </div>
            <h3 className="feature-card-title">Virtual Lab</h3>
            <p className="feature-card-desc">Interactive simulations for calculus, graphs, probability, and vectors.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'mathematics', backTo: '/app/mathematics', subjectLabel: 'Mathematics' } })}
          >
            <div className="feature-icon-box" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))' }}>
              <FileText size={28} color="#34D399" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Full timed exam conditions. Test your readiness with past-paper style questions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Play size={24} style={{ color: '#448AFF' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Practice Topics – {selectedForm}</span>
            <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.7 }}>
            Open a topic for a <strong>single workspace</strong>: practice questions, simulated exam, notes &amp; videos, tutor, AI Classroom, and matched virtual labs. Everything stays scoped to that topic.
          </p>

          {!hasEnoughCredits && (
            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
              You need at least {formatCreditCost(minCredits)} to generate a question.
            </div>
          )}

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = getMathTopicIcon(topic.name);
              return (
                <div
                  key={topic.hubSlug}
                  className="science-topic-card"
                  onClick={() =>
                    navigate(`/app/mathematics/topic/${encodeURIComponent(topic.hubSlug)}`)
                  }
                >
                  <div className="science-topic-card__row">
                    <div className="topic-icon-small">
                      <TopicIcon size={20} />
                    </div>
                    <MaicTopicClassroomLink
                      navigate={navigate}
                      subject="O Level Mathematics"
                      gradeLevel={selectedForm}
                      topicName={topic.name}
                    />
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                </div>
              );
            })}
          </div>

          {notesTopics.length > 0 && (
            <>
              <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 12 }}>
                <BookOpen size={24} style={{ color: '#82B1FF' }} />
                <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes – {selectedForm}</span>
              </div>
              <p style={{ marginBottom: 16, opacity: 0.65, fontSize: 14 }}>
                Chips jump to the same topic hub as the cards above (notes are one tap away inside).
              </p>

              <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {notesTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/app/mathematics/topic/${encodeURIComponent(topic.id)}`}
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50px',
                      color: '#fff',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {topic.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
