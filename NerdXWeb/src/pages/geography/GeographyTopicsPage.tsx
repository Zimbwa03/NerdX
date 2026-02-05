import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GEO_TOPICS_FALLBACK: Topic[] = [
  { id: 'weather_and_climate', name: 'Weather and Climate', subject: 'geography' },
  { id: 'landforms_and_landscape_processes', name: 'Landforms and Landscape Processes', subject: 'geography' },
  { id: 'ecosystems', name: 'Ecosystems', subject: 'geography' },
  { id: 'natural_resources', name: 'Natural Resources', subject: 'geography' },
  { id: 'energy_and_power_development', name: 'Energy and Power Development', subject: 'geography' },
  { id: 'map_work_and_geographical_information_systems__gis_', name: 'Map Work and Geographical Information Systems (GIS)', subject: 'geography' },
  { id: 'minerals_and_mining', name: 'Minerals and Mining', subject: 'geography' },
  { id: 'environmental_management', name: 'Environmental Management', subject: 'geography' },
  { id: 'agriculture_and_land_reform', name: 'Agriculture and Land Reform', subject: 'geography' },
  { id: 'industry', name: 'Industry', subject: 'geography' },
  { id: 'settlement_and_population', name: 'Settlement and Population', subject: 'geography' },
  { id: 'transport_and_trade', name: 'Transport and Trade', subject: 'geography' },
];

const SUBJECT = {
  id: 'geography',
  name: 'Geography',
  color: '#2E7D32',
};

type QuestionFormat = 'mcq' | 'structured' | 'essay';

export function GeographyTopicsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>('mcq');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('geography');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(GEO_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(GEO_TOPICS_FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayTopics = topics.length ? topics : GEO_TOPICS_FALLBACK;

  const openStartQuiz = (topic: Topic | null) => {
    setPendingTopic(topic);
    setQuestionFormat('mcq');
    setError(null);
    setStartQuizModalOpen(true);
  };

  const creditCost = calculateQuizCreditCost({
    subject: 'geography',
    questionType: 'topical',
    questionFormat,
  });
  const minCredits = getMinimumCreditsForQuiz({
    subject: 'geography',
    questionType: 'topical',
    questionFormat,
  });
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const handleStartQuiz = async () => {
    if (!hasEnoughCredits) {
      setError(`You need at least ${formatCreditCost(minCredits)} to start. Please top up credits.`);
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const useTopic = pendingTopic;
      // Backend expects topic name (e.g. "Weather and Climate") for geography generator
      const topicParam = useTopic?.name ?? useTopic?.id ?? undefined;
      const question = await quizApi.generateQuestion(
        'geography',
        topicParam,
        'medium',
        'topical',
        undefined,
        undefined,
        questionFormat,
        undefined,
        undefined
      );

      if (!question) {
        setError('No question was generated. Please try again.');
        return;
      }

      const creditsRemaining = (question as { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) {
        updateUser({ credits: creditsRemaining });
      }

      setStartQuizModalOpen(false);
      setPendingTopic(null);
      navigate('/app/quiz', {
        state: {
          question,
          subject: { id: 'geography', name: 'Geography', color: SUBJECT.color },
          topic: useTopic ?? undefined,
          mixImagesEnabled: true,
          backTo: '/app/geography',
          questionFormat,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate question';
      setError(typeof message === 'string' ? message : 'Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="geo-topics-page">
      <header className="geo-topics-header">
        <Link to="/app" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="geo-topics-title">Geography</h1>
        <p className="geo-topics-subtitle">ZIMSEC O Level – All Level</p>
      </header>

      <section className="geo-features-section">
        <button
          type="button"
          className="geo-feature-card geo-feature-notes"
          onClick={() => navigate('/app/geography/notes')}
        >
          <div className="geo-feature-icon geo-feature-icon-notes">
            <BookOpen size={28} />
          </div>
          <div className="geo-feature-content">
            <h3>Geography Notes</h3>
            <p>Comprehensive notes for all topics</p>
          </div>
          <span className="geo-feature-arrow">→</span>
        </button>

        <button
          type="button"
          className="geo-feature-card"
          onClick={() => navigate('/app/teacher', { state: { subject: 'Geography', gradeLevel: 'Form 1-4 (O-Level)' } })}
        >
          <div className="geo-feature-icon">
            <MessageSquare size={28} />
          </div>
          <div className="geo-feature-content">
            <h3>AI Tutor</h3>
            <p>Interactive tutoring for Geography topics</p>
          </div>
          <span className="geo-feature-arrow">→</span>
        </button>

        <button type="button" className="geo-feature-card geo-feature-labs" onClick={() => {}} disabled>
          <div className="geo-feature-icon geo-feature-icon-labs">
            <Map size={28} />
          </div>
          <div className="geo-feature-content">
            <h3>Maps Lab</h3>
            <p>Coming soon – interactive map work</p>
          </div>
          <span className="geo-feature-arrow">→</span>
        </button>
      </section>

      <section className="geo-exam-section">
        <button
          type="button"
          className="geo-exam-card"
          onClick={() =>
            navigate('/app/exam/setup', {
              state: { subject: 'geography', backTo: '/app/geography', subjectLabel: 'Geography' },
            })
          }
        >
          <div className="geo-exam-icon">
            <ClipboardList size={32} />
          </div>
          <div className="geo-exam-content">
            <h3>Start Exam</h3>
            <p>Timed exam with mixed questions from all topics</p>
          </div>
          <span className="geo-feature-arrow">→</span>
        </button>
      </section>

      <section className="geo-topics-section">
        <h2 className="geo-section-title">Quiz – Practice by Topic</h2>
        <p className="geo-section-subtitle">Choose a topic and question type (MCQ, Structured, Essay)</p>
        {loading ? (
          <div className="geo-loading">Loading topics…</div>
        ) : (
          <div className="geo-topics-grid">
            {displayTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="geo-topic-card"
                onClick={() => openStartQuiz(topic)}
              >
                <span className="geo-topic-name">{topic.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {startQuizModalOpen && (
        <div className="geo-modal-overlay" onClick={() => !generating && setStartQuizModalOpen(false)}>
          <div className="geo-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="geo-modal-title">
              {pendingTopic ? pendingTopic.name : 'Geography Quiz'}
            </h3>
            <p className="geo-modal-subtitle">Choose question type</p>
            <div className="geo-modal-options geo-modal-options-format">
              <button
                type="button"
                className={`geo-modal-option ${questionFormat === 'mcq' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('mcq')}
              >
                MCQ
              </button>
              <button
                type="button"
                className={`geo-modal-option ${questionFormat === 'structured' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('structured')}
              >
                Structured
              </button>
              <button
                type="button"
                className={`geo-modal-option ${questionFormat === 'essay' ? 'active' : ''}`}
                onClick={() => setQuestionFormat('essay')}
              >
                Essay
              </button>
            </div>
            <p className="geo-modal-cost">
              Cost: {formatCreditCost(creditCost)} per question
            </p>
            {error && <p className="geo-modal-error">{error}</p>}
            <div className="geo-modal-actions">
              <button
                type="button"
                className="geo-modal-cancel"
                onClick={() => !generating && setStartQuizModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="geo-modal-start"
                onClick={handleStartQuiz}
                disabled={generating || !hasEnoughCredits}
              >
                {generating ? 'Generating…' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
