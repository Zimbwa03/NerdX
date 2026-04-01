import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Calculator,
  ChevronRight,
  FileText,
  FlaskConical,
  Info,
  MessageCircle,
  Microscope,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  calculateQuizCreditCost,
  formatCreditCost,
  getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import { getSuggestedVirtualLabsForTopic } from '../../utils/topicVirtualLabSuggestions';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import {
  getSubjectHubConfig,
  parseTopicHubPath,
  type PracticeFormat,
  type SubjectHubConfig,
} from '../../data/subjectTopicHub/registry';
import { aLevelPureMathTopics } from '../../data/aLevelPureMath/topics';
import { getTopicById as getHistoryTopicById } from '../../data/historyNotes';
import '../sciences/ScienceUniverse.css';
import '../mathematics/MathTopicHubPage.css';

function surfaceClass(cfg: SubjectHubConfig): string {
  return cfg.universeClass === 'eng' ? 'math' : cfg.universeClass;
}

function backgroundClass(cfg: SubjectHubConfig): string {
  return cfg.universeClass === 'eng' ? 'math-bg' : `${cfg.universeClass}-bg`;
}

function HubHeroIcon({ cfg }: { cfg: SubjectHubConfig }) {
  if (cfg.universeClass === 'bio') return <Microscope size={26} strokeWidth={2} aria-hidden />;
  if (cfg.universeClass === 'chem') return <FlaskConical size={26} strokeWidth={2} aria-hidden />;
  if (cfg.universeClass === 'phys') return <Atom size={26} strokeWidth={2} aria-hidden />;
  if (cfg.quizKind === 'a_pure_math' || cfg.universeClass === 'math')
    return <Calculator size={26} strokeWidth={2} aria-hidden />;
  return <BookOpen size={26} strokeWidth={2} aria-hidden />;
}

function minCreditsForPractice(
  cfg: SubjectHubConfig,
  format: PracticeFormat,
  englishTopical: boolean,
): number {
  if (cfg.quizKind === 'english') {
    return getMinimumCreditsForQuiz({
      subject: 'english',
      questionType: englishTopical ? 'topical' : 'exam',
    });
  }
  if (cfg.quizKind === 'a_biology') {
    return getMinimumCreditsForQuiz({
      subject: cfg.quizSubjectId,
      questionType: 'topical',
      bioQuestionType: format,
    });
  }
  if (cfg.quizKind === 'history_essay') {
    return getMinimumCreditsForQuiz({
      subject: 'history',
      questionType: 'topical',
      questionFormat: 'essay',
    });
  }
  return getMinimumCreditsForQuiz({
    subject: cfg.quizSubjectId,
    questionType: 'topical',
    questionFormat: format,
  });
}

function creditCostForPractice(
  cfg: SubjectHubConfig,
  format: PracticeFormat,
  englishTopical: boolean,
): number {
  if (cfg.quizKind === 'english') {
    return calculateQuizCreditCost({
      subject: 'english',
      questionType: englishTopical ? 'topical' : 'exam',
    });
  }
  if (cfg.quizKind === 'a_biology') {
    return calculateQuizCreditCost({
      subject: cfg.quizSubjectId,
      questionType: 'topical',
      bioQuestionType: format,
    });
  }
  if (cfg.quizKind === 'history_essay') {
    return calculateQuizCreditCost({
      subject: 'history',
      questionType: 'topical',
      questionFormat: 'essay',
    });
  }
  return calculateQuizCreditCost({
    subject: cfg.quizSubjectId,
    questionType: 'topical',
    questionFormat: format,
  });
}

export function SubjectTopicHubPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicId: paramTopicId } = useParams<{ topicId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateUser } = useAuth();

  const parsed = parseTopicHubPath(location.pathname);
  const segment = parsed?.segment ?? '';
  const decodedId = parsed?.topicId ?? (paramTopicId ? decodeURIComponent(paramTopicId) : '');
  const cfg = segment ? getSubjectHubConfig(segment) : undefined;

  const boardParam = (searchParams.get('board') as 'zimsec' | 'cambridge') || 'zimsec';
  const [board, setBoard] = useState<'zimsec' | 'cambridge'>(boardParam);
  useEffect(() => {
    setBoard(boardParam);
  }, [boardParam]);

  const [topics, setTopics] = useState<Topic[]>(() => cfg?.getStaticTopics() ?? []);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<PracticeFormat>('mcq');
  const [englishTopical, setEnglishTopical] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cfg) return;
    let cancelled = false;
    const run = async () => {
      let list = cfg.getStaticTopics();
      if (cfg.fetchTopicsFromApi) {
        try {
          const apiBoard = cfg.apiUsesBoard ? board : undefined;
          const data = await quizApi.getTopics(cfg.quizSubjectId, undefined, apiBoard);
          if (!cancelled && data?.length) list = data;
        } catch {
          /* keep static */
        }
      }
      if (!cancelled) setTopics(list);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [cfg, board]);

  const topic = useMemo(() => {
    if (!decodedId) return undefined;
    return topics.find((t) => t.id === decodedId || t.name === decodedId);
  }, [topics, decodedId]);

  const description = useMemo(() => {
    if (!cfg || !topic) return '';
    return cfg.topicDescription(topic) || topic.name;
  }, [cfg, topic]);

  const labs = useMemo(() => {
    if (!cfg || !topic) return [];
    return getSuggestedVirtualLabsForTopic(cfg.labSubject, topic.name, description, 4);
  }, [cfg, topic, description]);

  const notesPath = cfg && topic ? cfg.notesPath(topic) : null;

  const openPractice = useCallback(() => {
    if (!cfg) return;
    if (cfg.quizKind === 'history_essay') {
      const meta = getHistoryTopicById(topic?.id ?? '');
      navigate('/app/history/essay', {
        state: {
          topic: topic ? { id: topic.id, name: topic.name } : undefined,
          subject: cfg.subjectInfo,
          formLevel: meta?.formLevel,
          backTo: cfg.listPath,
        },
      });
      return;
    }
    setSelectedFormat(cfg.practiceFormats[0] ?? 'mcq');
    setEnglishTopical(true);
    setError(null);
    setPracticeOpen(true);
  }, [cfg, navigate, topic]);

  const minCredits = cfg
    ? minCreditsForPractice(cfg, selectedFormat, englishTopical)
    : 1;
  const creditCost = cfg
    ? creditCostForPractice(cfg, selectedFormat, englishTopical)
    : 1;
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= minCredits;

  const handleStartPractice = async () => {
    if (!cfg || !topic) return;
    if (!hasEnoughCredits) {
      setError(`You need at least ${formatCreditCost(minCredits)} to start. Please top up credits.`);
      return;
    }
    setGenerating(true);
    setPracticeOpen(false);
    setError(null);
    try {
      let question = null;
      const sid = cfg.quizSubjectId;

      switch (cfg.quizKind) {
        case 'o_science':
          question = await quizApi.generateQuestion(
            sid,
            topic.id,
            'medium',
            'topical',
            undefined,
            undefined,
            selectedFormat,
            false,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/sciences/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic,
                parentSubject: cfg.parentForScienceQuiz,
                questionFormat: selectedFormat,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
              },
            });
          }
          break;
        case 'o_quiz': {
          const topicParam = topic.name ?? topic.id;
          const mixImages = cfg.segment === 'geography';
          question = await quizApi.generateQuestion(
            sid,
            topicParam,
            'medium',
            'topical',
            undefined,
            undefined,
            selectedFormat,
            mixImages,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic,
                mixImagesEnabled: mixImages,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
                questionFormat: selectedFormat,
              },
            });
          }
          break;
        }
        case 'o_cs':
          question = await quizApi.generateQuestion(
            sid,
            topic.id,
            'medium',
            'topical',
            undefined,
            undefined,
            selectedFormat,
            undefined,
            undefined,
            board,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic,
                mixImagesEnabled: false,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
                board,
                questionFormat: selectedFormat,
              },
            });
          }
          break;
        case 'english': {
          const topical = englishTopical;
          question = await quizApi.generateQuestion(
            'english',
            topical ? topic.id : undefined,
            'medium',
            topical ? 'topical' : 'exam',
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic: topical ? topic : undefined,
                mixImagesEnabled: false,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
              },
            });
          }
          break;
        }
        case 'a_biology':
          question = await quizApi.generateQuestion(
            sid,
            topic.id,
            'medium',
            'topical',
            'Biology',
            selectedFormat,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic,
                questionFormat: selectedFormat,
                questionType: selectedFormat,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
              },
            });
          }
          break;
        case 'a_stem':
          question = await quizApi.generateQuestion(
            sid,
            topic.id,
            'medium',
            'topical',
            cfg.aStemParent,
            undefined,
            selectedFormat,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic,
                questionFormat: selectedFormat,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
              },
            });
          }
          break;
        case 'a_geography':
          question = await quizApi.generateQuestion(
            sid,
            topic.id,
            'medium',
            'topical',
            undefined,
            undefined,
            selectedFormat,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic,
                questionFormat: selectedFormat,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
              },
            });
          }
          break;
        case 'a_cs':
          question = await quizApi.generateQuestion(
            sid,
            topic.id,
            'medium',
            'topical',
            undefined,
            undefined,
            selectedFormat,
            undefined,
            undefined,
            board,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            navigate('/app/quiz', {
              state: {
                question,
                subject: cfg.subjectInfo,
                topic,
                questionFormat: selectedFormat,
                board,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
              },
            });
          }
          break;
        case 'a_pure_math': {
          question = await quizApi.generateQuestion(
            sid,
            topic.id,
            'medium',
            'topical',
            'Pure Mathematics',
            undefined,
            selectedFormat,
          );
          if (question) {
            const cr = (question as { credits_remaining?: number }).credits_remaining;
            if (cr !== undefined) updateUser({ credits: cr });
            const pm = aLevelPureMathTopics.find((x) => x.id === topic.id);
            const formLevel = pm?.difficulty ?? 'Lower Sixth';
            navigate('/app/mathematics/quiz', {
              state: {
                question,
                subject: {
                  id: sid,
                  name: cfg.subjectInfo.name,
                  color: cfg.subjectInfo.color,
                },
                topic,
                questionFormat: selectedFormat,
                formLevel,
                backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
              },
            });
          }
          break;
        }
        default:
          break;
      }

      if (!question) {
        setError('No question was generated. Please try again.');
        setPracticeOpen(true);
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to generate question');
      setPracticeOpen(true);
    } finally {
      setGenerating(false);
    }
  };

  if (!cfg || !segment) {
    return <Navigate to="/app" replace />;
  }

  if (!topic) {
    return <Navigate to={cfg.listPath} replace />;
  }

  const listLabel = cfg.examLabel;
  const browseLabs =
    cfg.labSubject != null
      ? `/app/virtual-lab?subject=${encodeURIComponent(cfg.labBrowseKey)}`
      : '/app/virtual-lab';

  return (
    <div className={`science-universe-page ${surfaceClass(cfg)} math-topic-hub`}>
      <div className={`science-universe-bg ${backgroundClass(cfg)}`}>
        <div className="science-grid-overlay" />
      </div>

      <div className="math-topic-hub__inner">
        <Link to={cfg.listPath} className="math-topic-hub__back">
          <ArrowLeft size={18} aria-hidden />
          {listLabel}
        </Link>

        <header className="math-topic-hub__hero">
          <div className="math-topic-hub__icon-wrap" aria-hidden>
            <HubHeroIcon cfg={cfg} />
          </div>
          <div className="math-topic-hub__hero-text">
            <span className="math-topic-hub__badge">{cfg.subjectInfo.name}</span>
            <h1 className="math-topic-hub__title">{topic.name}</h1>
            <p className="math-topic-hub__desc">{description}</p>
          </div>
        </header>

        {!hasEnoughCredits && cfg.quizKind !== 'history_essay' && (
          <div
            style={{
              padding: 12,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              borderRadius: 14,
              marginBottom: 20,
              color: '#FCA5A5',
              fontSize: 13,
            }}
          >
            You need at least {formatCreditCost(minCredits)} to start this practice mode.
          </div>
        )}

        <section className="math-topic-hub__section" aria-labelledby="hub-practice-label">
          <h2 id="hub-practice-label" className="math-topic-hub__section-label">
            Practice &amp; assessment
          </h2>
          <div className="math-topic-hub__actions math-topic-hub__actions--pair">
            <button
              type="button"
              className="math-topic-hub__action math-topic-hub__action--primary"
              onClick={openPractice}
            >
              <span className="math-topic-hub__action-icon math-topic-hub__action-icon--brand">
                <Calculator size={20} aria-hidden />
              </span>
              <span className="math-topic-hub__action-body">
                <span className="math-topic-hub__action-title">
                  {cfg.quizKind === 'history_essay' ? 'Essay practice' : 'Practice questions'}
                </span>
                <span className="math-topic-hub__action-sub">
                  {cfg.quizKind === 'history_essay'
                    ? 'ZIMSEC-style essay workspace for this topic'
                    : 'AI-generated ZIMSEC-style items with full solutions'}
                </span>
              </span>
            </button>
            <button
              type="button"
              className="math-topic-hub__action"
              onClick={() =>
                navigate('/app/exam/setup', {
                  state: {
                    subject: cfg.examKey,
                    backTo: `${cfg.listPath}/topic/${encodeURIComponent(topic.id)}`,
                    subjectLabel: cfg.examLabel,
                    preselectedTopicNames: [topic.name],
                  },
                })
              }
            >
              <span className="math-topic-hub__action-icon math-topic-hub__action-icon--exam">
                <FileText size={20} aria-hidden />
              </span>
              <span className="math-topic-hub__action-body">
                <span className="math-topic-hub__action-title">Simulated exam</span>
                <span className="math-topic-hub__action-sub">Timed paper; narrow to this topic in setup</span>
              </span>
            </button>
          </div>
        </section>

        {notesPath && (
          <section className="math-topic-hub__section" aria-labelledby="hub-study-label">
            <h2 id="hub-study-label" className="math-topic-hub__section-label">
              Study
            </h2>
            <div className="math-topic-hub__actions">
              <Link to={notesPath} className="math-topic-hub__action">
                <span className="math-topic-hub__action-icon math-topic-hub__action-icon--brand-mint">
                  <BookOpen size={20} aria-hidden />
                </span>
                <span className="math-topic-hub__action-body">
                  <span className="math-topic-hub__action-title">Notes &amp; videos</span>
                  <span className="math-topic-hub__action-sub">Structured explanations and media for this topic</span>
                </span>
                <ChevronRight className="math-topic-hub__lab-chev" size={20} aria-hidden />
              </Link>
            </div>
          </section>
        )}

        <section className="math-topic-hub__section" aria-labelledby="hub-help-label">
          <h2 id="hub-help-label" className="math-topic-hub__section-label">
            Help
          </h2>
          <div className="math-topic-hub__help-row">
            <button
              type="button"
              className="math-topic-hub__action"
              onClick={() =>
                navigate('/app/teacher', {
                  state: {
                    subject: cfg.tutorSubject,
                    gradeLevel: cfg.tutorGrade,
                    topic: topic.name,
                    initialMessage: `I need help with ${topic.name}. `,
                  },
                })
              }
            >
              <span className="math-topic-hub__action-icon math-topic-hub__action-icon--tutor">
                <MessageCircle size={20} aria-hidden />
              </span>
              <span className="math-topic-hub__action-body">
                <span className="math-topic-hub__action-title">{cfg.tutorCardTitle}</span>
                <span className="math-topic-hub__action-sub">Step-by-step guidance for this topic</span>
              </span>
            </button>
            <div className="math-topic-hub__classroom-slot">
              <MaicTopicClassroomLink
                navigate={navigate}
                subject={cfg.tutorSubject}
                gradeLevel={cfg.maicGrade}
                topicName={topic.name}
              />
            </div>
          </div>
        </section>

        <section className="math-topic-hub__section" aria-labelledby="hub-labs-label">
          <h2 id="hub-labs-label" className="math-topic-hub__section-label">
            Virtual labs
          </h2>
          <p className="math-topic-hub__desc" style={{ marginBottom: 14 }}>
            {cfg.labSubject
              ? 'Hands-on simulations matched to this topic. Open one below or browse the full lab library.'
              : 'Browse interactive labs and tools in the virtual lab — some subjects share cross-topic simulations.'}
          </p>
          {labs.length > 0 && (
            <div className="math-topic-hub__labs">
              {labs.map((lab) => (
                <Link key={lab.id} to={`/app/virtual-lab/${lab.id}`} className="math-topic-hub__lab">
                  <div>
                    <div className="math-topic-hub__lab-title">{lab.title}</div>
                    <div className="math-topic-hub__lab-meta">{lab.estimatedTime}</div>
                  </div>
                  <ChevronRight className="math-topic-hub__lab-chev" size={18} aria-hidden />
                </Link>
              ))}
            </div>
          )}
          <Link to={browseLabs} className="math-topic-hub__browse-labs">
            <Atom size={16} aria-hidden />
            {cfg.labSubject ? `Browse all ${cfg.examLabel.toLowerCase()} labs` : 'Browse virtual labs'}
          </Link>
        </section>
      </div>

      {practiceOpen && cfg.quizKind !== 'history_essay' && (
        <div
          className="math-topic-hub__modal-overlay"
          role="presentation"
          onClick={() => !generating && setPracticeOpen(false)}
        >
          <div
            className="math-topic-hub__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hub-practice-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="math-topic-hub__modal-x"
              onClick={() => setPracticeOpen(false)}
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <div className="math-topic-hub__modal-head">
              <div className="math-topic-hub__modal-icon" aria-hidden>
                <Calculator size={28} />
              </div>
              <h2 id="hub-practice-title" className="math-topic-hub__modal-title">
                {topic.name}
              </h2>
              <p className="math-topic-hub__modal-sub">{cfg.subjectInfo.name}</p>
            </div>

            {(cfg.quizKind === 'o_cs' || cfg.quizKind === 'a_cs') && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                {(['zimsec', 'cambridge'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBoard(b);
                      const next = new URLSearchParams(searchParams);
                      next.set('board', b);
                      setSearchParams(next, { replace: true });
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: `2px solid ${board === b ? 'var(--brand, #10b981)' : 'rgba(255,255,255,0.15)'}`,
                      background: board === b ? 'rgba(16,185,129,0.15)' : 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {b === 'zimsec' ? 'ZIMSEC' : 'Cambridge'}
                  </button>
                ))}
              </div>
            )}

            {cfg.englishModes && (
              <div className="math-topic-hub__modal-check-row" style={{ marginBottom: 12 }}>
                <span style={{ width: '100%', marginBottom: 8, opacity: 0.85, fontSize: 13 }}>Mode</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setEnglishTopical(true)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: `2px solid ${englishTopical ? '#10B981' : 'rgba(255,255,255,0.12)'}`,
                      background: englishTopical ? 'rgba(16,185,129,0.12)' : 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Topical
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnglishTopical(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: `2px solid ${!englishTopical ? '#10B981' : 'rgba(255,255,255,0.12)'}`,
                      background: !englishTopical ? 'rgba(16,185,129,0.12)' : 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Exam
                  </button>
                </div>
              </div>
            )}

            {!cfg.englishModes && cfg.practiceFormats.length > 1 && (
              <div className="format-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, marginBottom: 16 }}>
                {cfg.practiceFormats.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFormat(f)}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      border: `2px solid ${selectedFormat === f ? '#10B981' : 'rgba(255,255,255,0.12)'}`,
                      background: selectedFormat === f ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {f === 'mcq' ? 'MCQ' : f}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: 12,
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 12,
                  marginBottom: 16,
                  color: '#FCA5A5',
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            <div className="math-topic-hub__modal-cost">
              <Info size={16} aria-hidden />
              <span>
                Cost: <strong>{formatCreditCost(creditCost)} per question</strong>
              </span>
            </div>
            <button
              type="button"
              className="math-topic-hub__modal-start"
              onClick={handleStartPractice}
              disabled={generating || !hasEnoughCredits}
            >
              {generating ? 'Generating…' : 'Start practice'}
            </button>
          </div>
        </div>
      )}

      <AILoadingOverlay
        isVisible={generating}
        title="Generating question"
        subtitle={`Creating a practice question for ${topic.name}…`}
        accentColor={cfg.subjectInfo.color}
        variant="fullscreen"
      />
    </div>
  );
}
