import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  examApi,
  getDefaultTimeInfo,
  QUESTION_COUNTS,
  QUESTION_MODES,
  DIFFICULTIES,
  type ExamConfig,
  type TimeInfo,
  type QuestionMode,
  type Level,
  type Difficulty,
} from '../../services/api/examApi';
import { quizApi } from '../../services/api/quizApi';
import { formatCreditCost } from '../../utils/creditCalculator';
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export type ExamSetupState = {
  subject: string;
  backTo: string;
  subjectLabel: string;
};

const DEFAULT_SETUP_STATE: ExamSetupState = {
  subject: 'mathematics',
  backTo: '/app/mathematics',
  subjectLabel: 'Mathematics',
};

function getExamCreditCost(
  subject: string,
  questionCount: number,
  questionMode: QuestionMode
): number {
  const subj = subject.toLowerCase();
  let perQ = 0.5;
  if (subj === 'mathematics' || subj === 'math') perQ = 0.5;
  else if (subj === 'combined_science') perQ = 0.5;
  else if (subj === 'english') perQ = 1;
  else if (subj === 'a_level_biology') {
    perQ = questionMode === 'MCQ_ONLY' ? 0.25 : 0.5;
    if (questionMode === 'MIXED') {
      const mcq = Math.floor(questionCount / 2);
      const struct = questionCount - mcq;
      return mcq * 0.25 + struct * 0.5;
    }
  } else if (subj.includes('computer_science')) {
    perQ = questionMode === 'MCQ_ONLY' ? 0.3 : questionMode === 'STRUCTURED_ONLY' ? 0.5 : 1;
    if (questionMode === 'MIXED') {
      const mcq = Math.floor(questionCount / 2);
      const struct = questionCount - mcq;
      return mcq * 0.3 + struct * 0.5;
    }
  } else if (subj === 'commerce') {
    perQ = questionMode === 'MCQ_ONLY' ? 0.3 : 1;  // Paper 2 Essay = 1 credit
    if (questionMode === 'MIXED') {
      const mcq = Math.floor(questionCount / 2);
      const essay = questionCount - mcq;
      return mcq * 0.3 + essay * 1;
    }
  } else if (subj === 'business_enterprise_skills') {
    perQ = questionMode === 'MCQ_ONLY' ? 0.3 : 1;  // Paper 2 Essay = 1 credit (same as commerce)
    if (questionMode === 'MIXED') {
      const mcq = Math.floor(questionCount / 2);
      const essay = questionCount - mcq;
      return mcq * 0.3 + essay * 1;
    }
  } else if (subj === 'history') {
    // History: Paper 1 Essays only (3-part ZIMSEC format) = 1 credit per question
    return questionCount * 1;
  }
  return questionCount * perQ;
}

function getInitialLevel(subject: string): Level {
  if (subject.includes('a_level_') || subject === 'pure_math') return 'A_LEVEL';
  return 'O_LEVEL';
}

export function ExamSetupPage() {
  const { state: locationState } = useLocation() as { state?: Partial<ExamSetupState> | null };
  const { subject, backTo, subjectLabel } = { ...DEFAULT_SETUP_STATE, ...locationState };
  const navigate = useNavigate();
  const { user } = useAuth();
  const [level, setLevel] = useState<Level>(() => getInitialLevel(subject));
  const [questionMode, setQuestionMode] = useState<QuestionMode>(() =>
    (subject || '').toLowerCase() === 'history' ? 'STRUCTURED_ONLY' : 'MCQ_ONLY'
  );
  const [difficulty, setDifficulty] = useState<Difficulty>('standard');
  const [questionCount, setQuestionCount] = useState(10);
  const [sliderIndex, setSliderIndex] = useState(1);
  const [allTopics, setAllTopics] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  /** For combined_science only: topics grouped by Biology, Chemistry, Physics */
  const [topicsBySubject, setTopicsBySubject] = useState<Record<string, string[]>>({});
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);
  const [loadingTime, setLoadingTime] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCombinedScience = subject === 'combined_science';
  const isHistory = (subject || '').toLowerCase() === 'history';
  const SCIENCE_SUBJECTS = ['Biology', 'Chemistry', 'Physics'] as const;
  const [activeScienceSubject, setActiveScienceSubject] = useState<'Biology' | 'Chemistry' | 'Physics'>('Biology');

  useEffect(() => {
    setLevel(getInitialLevel(subject));
  }, [subject]);

  useEffect(() => {
    if ((subject || '').toLowerCase() === 'history') {
      setQuestionMode('STRUCTURED_ONLY');
    }
  }, [subject]);

  useEffect(() => {
    let cancelled = false;
    if (subject === 'combined_science') {
      (async () => {
        try {
          const [bio, chem, phys] = await Promise.all([
            quizApi.getTopics('combined_science', 'Biology'),
            quizApi.getTopics('combined_science', 'Chemistry'),
            quizApi.getTopics('combined_science', 'Physics'),
          ]);
          if (!cancelled) {
            setTopicsBySubject({
              Biology: bio.map((t) => t.name),
              Chemistry: chem.map((t) => t.name),
              Physics: phys.map((t) => t.name),
            });
            const names = new Set<string>();
            [bio, chem, phys].forEach((list) => list.forEach((t) => names.add(t.name)));
            setAvailableTopics(Array.from(names));
          }
        } catch {
          if (!cancelled) {
            setTopicsBySubject({});
            setAvailableTopics([]);
          }
        }
      })();
    } else {
      setTopicsBySubject({});
      (async () => {
        const topics = await quizApi.getTopics(subject);
        if (!cancelled && topics?.length) {
          setAvailableTopics(topics.map((t) => t.name));
        }
      })();
    }
    return () => { cancelled = true; };
  }, [subject]);

  const calculateTime = useCallback(async () => {
    setLoadingTime(true);
    try {
      const info = await examApi.calculateTime(subject, questionCount, questionMode, difficulty);
      setTimeInfo(info ?? getDefaultTimeInfo(questionCount, questionMode, difficulty));
    } catch {
      setTimeInfo(getDefaultTimeInfo(questionCount, questionMode, difficulty));
    } finally {
      setLoadingTime(false);
    }
  }, [subject, questionCount, questionMode, difficulty]);

  useEffect(() => {
    calculateTime();
  }, [calculateTime]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Math.round(Number(e.target.value));
    setSliderIndex(idx);
    setQuestionCount(QUESTION_COUNTS[idx]);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleStart = async () => {
    if (!allTopics && selectedTopics.length === 0) {
      setError('Please select at least 1 topic, or switch to All Topics.');
      return;
    }
    const creditCost = getExamCreditCost(subject, questionCount, questionMode);
    if ((user?.credits ?? 0) < creditCost) {
      setError('Insufficient credits. Please top up to start this exam.');
      return;
    }
    setStarting(true);
    setError(null);
    try {
      const config: ExamConfig = {
        subject,
        level,
        question_mode: questionMode,
        difficulty,
        total_questions: questionCount,
        paper_style: 'ZIMSEC',
        topics: allTopics ? undefined : selectedTopics,
      };
      const effectiveTime = timeInfo ?? getDefaultTimeInfo(questionCount, questionMode, difficulty);
      navigate('/app/exam/session', {
        state: { examConfig: config, timeInfo: effectiveTime, backTo, subjectLabel },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start');
    } finally {
      setStarting(false);
    }
  };

  const displayTime = timeInfo ?? getDefaultTimeInfo(questionCount, questionMode, difficulty);
  const creditCost = getExamCreditCost(subject, questionCount, questionMode);
  const userCredits = user?.credits ?? 0;
  const hasEnoughCredits = userCredits >= creditCost;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}min`;
  };

  const showLevelToggle = subject !== 'combined_science';

  return (
    <div className="exam-setup-page">
      <header className="exam-setup-header-bar">
        <Link to={backTo} className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1>Exam Setup</h1>
        <p className="exam-setup-subtitle">{subjectLabel}</p>
      </header>

      <div className="exam-setup-content">
        {showLevelToggle && (
          <section className="exam-setup-section">
            <h3>Level</h3>
            <div className="exam-setup-toggle">
              {(['O_LEVEL', 'A_LEVEL'] as Level[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={level === lvl ? 'active' : ''}
                  onClick={() => setLevel(lvl)}
                >
                  {lvl.replace('_', ' ')}
                </button>
              ))}
            </div>
          </section>
        )}

        {!isHistory && (
          <section className="exam-setup-section">
            <h3>Question Type</h3>
            <div className="exam-setup-modes">
              {QUESTION_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={questionMode === m.id ? 'active' : ''}
                  onClick={() => setQuestionMode(m.id)}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </section>
        )}
        {isHistory && (
          <section className="exam-setup-section">
            <h3>Question Type</h3>
            <p className="exam-setup-info">Paper 1 Essays only (3-part ZIMSEC format)</p>
          </section>
        )}

        <section className="exam-setup-section">
          <h3>Difficulty</h3>
          <div className="exam-setup-toggle">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                type="button"
                className={difficulty === d.id ? 'active' : ''}
                onClick={() => setDifficulty(d.id)}
              >
                {d.name}
              </button>
            ))}
          </div>
        </section>

        {(availableTopics.length > 0 || (isCombinedScience && Object.keys(topicsBySubject).length > 0)) && (
          <section className="exam-setup-section">
            <h3>Topics</h3>
            <div className="exam-setup-topics-card">
              <button
                type="button"
                className="exam-setup-all-topics"
                onClick={() => setAllTopics(!allTopics)}
              >
                <span>All Topics</span>
                <span className={`exam-setup-checkbox ${allTopics ? 'checked' : ''}`}>
                  {allTopics && '✓'}
                </span>
              </button>
              {!allTopics && isCombinedScience && (
                <div className="exam-setup-topics-by-subject">
                  <div className="exam-setup-science-tabs">
                    {SCIENCE_SUBJECTS.map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        className={`exam-setup-science-tab ${activeScienceSubject === subj ? 'active' : ''}`}
                        onClick={() => setActiveScienceSubject(subj)}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                  <div className="exam-setup-topics-grid">
                    {(topicsBySubject[activeScienceSubject] ?? []).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`exam-setup-topic-chip ${selectedTopics.includes(t) ? 'active' : ''}`}
                        onClick={() => toggleTopic(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!allTopics && !isCombinedScience && (
                <div className="exam-setup-topics-grid">
                  {availableTopics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`exam-setup-topic-chip ${selectedTopics.includes(t) ? 'active' : ''}`}
                      onClick={() => toggleTopic(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="exam-setup-section">
          <h3>Number of Questions</h3>
          <div className="exam-setup-slider-card">
            <span className="exam-setup-count">{questionCount}</span>
            <span className="exam-setup-count-label">questions</span>
            <input
              type="range"
              min={0}
              max={QUESTION_COUNTS.length - 1}
              value={sliderIndex}
              onChange={handleSliderChange}
              className="exam-setup-slider"
            />
            <div className="exam-setup-slider-labels">
              <span>{QUESTION_COUNTS[0]}</span>
              <span>{QUESTION_COUNTS[QUESTION_COUNTS.length - 1]}</span>
            </div>
          </div>
        </section>

        <section className="exam-setup-time-card">
          <Clock size={24} className="exam-setup-time-icon" />
          <div>
            <span className="exam-setup-time-label">Estimated Time</span>
            {loadingTime ? (
              <span className="exam-setup-time-value">Calculating…</span>
            ) : (
              <span className="exam-setup-time-value">
                {formatTime(displayTime.total_minutes)}
              </span>
            )}
          </div>
        </section>

        <section
          className={`exam-setup-credits-card ${hasEnoughCredits ? 'ok' : 'low'}`}
        >
          {hasEnoughCredits ? (
            <CheckCircle size={24} />
          ) : (
            <AlertCircle size={24} />
          )}
          <div>
            <span className="exam-setup-credits-label">Credits Required</span>
            <span className="exam-setup-credits-value">
              {creditCost.toFixed(1)} credits ({questionCount} × {formatCreditCost(creditCost / questionCount)} each) / {userCredits} available
            </span>
            <span className="exam-setup-credits-per">💎 {formatCreditCost(creditCost / questionCount)} per question</span>
          </div>
          {!hasEnoughCredits && (
            <p className="exam-setup-credits-warning">
              ⚠️ Insufficient credits. Please top up to start.
            </p>
          )}
        </section>

        {error && <p className="exam-setup-error">{error}</p>}

        <button
          type="button"
          className="exam-setup-begin"
          onClick={handleStart}
          disabled={!hasEnoughCredits || starting}
        >
          {starting ? 'Starting…' : 'Begin Exam'}
        </button>

        <p className="exam-setup-info">
          Questions are generated one at a time. Timer starts when exam begins.
        </p>
      </div>
    </div>
  );
}
