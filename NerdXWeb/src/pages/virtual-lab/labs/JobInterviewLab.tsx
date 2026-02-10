import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

interface InterviewOption {
  id: string;
  text: string;
  quality: 'excellent' | 'good' | 'poor';
  feedback: string;
  tip?: string;
}

interface InterviewStep {
  id: string;
  phase: string;
  interviewer: string;
  question: string;
  skillFocus: string;
  options: InterviewOption[];
}

const INTERVIEW_STEPS: InterviewStep[] = [
  {
    id: 'introduction',
    phase: 'Opening',
    interviewer: 'Ms. Nkosi - HR Manager',
    question: "Good morning! Thank you for coming in today. Let's start with you telling me a bit about yourself.",
    skillFocus: 'Self-Introduction',
    options: [
      {
        id: 'a',
        text: "I'm Tendai, 25 years old, from Harare. I like football and music.",
        quality: 'poor',
        feedback: "Personal details aren't relevant here. Focus on professional background and what you bring to the role.",
      },
      {
        id: 'b',
        text: "Thank you for this opportunity. I'm a marketing graduate with 3 years of experience in digital campaigns. I'm passionate about data-driven marketing and have increased engagement by 40% at my current role.",
        quality: 'excellent',
        feedback: '🎉 Excellent! You thanked them, stated relevant experience, showed passion, and gave a quantified achievement.',
        tip: 'Always start with gratitude, mention relevant experience, and include a specific achievement.',
      },
      {
        id: 'c',
        text: "I studied marketing at university and I'm looking for a new job.",
        quality: 'good',
        feedback: 'This is okay but lacks specific achievements or passion. Add what makes you unique!',
      },
    ],
  },
  {
    id: 'strengths',
    phase: 'Strengths Discussion',
    interviewer: 'Ms. Nkosi - HR Manager',
    question: 'What would you say are your greatest strengths?',
    skillFocus: 'Self-Awareness',
    options: [
      {
        id: 'a',
        text: "I'm a perfectionist and I work too hard.",
        quality: 'poor',
        feedback: 'These are disguised weaknesses, not genuine strengths. Interviewers see through this approach.',
      },
      {
        id: 'b',
        text: 'My greatest strength is analytical thinking. For example, at my previous job, I analyzed customer data to identify a 25% drop in retention. I proposed a loyalty program that recovered 60% of those customers within 6 months.',
        quality: 'excellent',
        feedback: '🎉 Perfect! You named a specific strength and backed it up with a concrete, quantified example.',
        tip: 'Always provide evidence! Specific examples make your strengths believable and memorable.',
      },
      {
        id: 'c',
        text: "I'm good at working with people and solving problems.",
        quality: 'good',
        feedback: 'Good strengths to mention, but without examples they sound generic. Make them specific!',
      },
    ],
  },
  {
    id: 'star',
    phase: 'Behavioral Question',
    interviewer: 'Ms. Nkosi - HR Manager',
    question: 'Tell me about a time when you faced a significant challenge at work. How did you handle it?',
    skillFocus: 'STAR Method',
    options: [
      {
        id: 'a',
        text: "I'm very good at handling challenges. I never give up when things get difficult.",
        quality: 'poor',
        feedback: "This is vague and doesn't tell a story. Use the STAR method for behavioral questions!",
      },
      {
        id: 'b',
        text: 'SITUATION: Our main client threatened to leave due to delivery delays. TASK: I was asked to save the relationship. ACTION: I personally called the client, apologized, created a recovery plan, and offered compensation. RESULT: They not only stayed but increased their contract by 15%.',
        quality: 'excellent',
        feedback: '🎉 Masterful use of STAR! You clearly structured your response: Situation, Task, Action, Result.',
        tip: 'STAR = Situation, Task, Action, Result. This structure makes your answers clear and compelling.',
      },
      {
        id: 'c',
        text: 'Once we had an angry client and I helped calm them down. It worked out in the end.',
        quality: 'good',
        feedback: 'Good start but lacks detail. What specifically did you do? What was the outcome?',
      },
    ],
  },
  {
    id: 'weakness',
    phase: 'Self-Reflection',
    interviewer: 'Ms. Nkosi - HR Manager',
    question: 'What would you consider your biggest weakness?',
    skillFocus: 'Growth Mindset',
    options: [
      {
        id: 'a',
        text: "I don't really have any weaknesses. I'm pretty good at everything.",
        quality: 'poor',
        feedback: 'This shows lack of self-awareness. Everyone has areas for improvement!',
      },
      {
        id: 'b',
        text: 'I tend to overthink presentations, which sometimes slows me down. To address this, I now set strict deadlines for myself and get early feedback from colleagues, which has improved my efficiency significantly.',
        quality: 'excellent',
        feedback: "🎉 Honest and growth-focused! You acknowledged a real weakness and actively work to improve it.",
        tip: "Choose a genuine weakness that isn't critical to the role, then explain how you're improving.",
      },
      {
        id: 'c',
        text: 'I sometimes work too hard and forget to take breaks.',
        quality: 'good',
        feedback: 'This is a common "safe" answer but interviewers prefer genuine self-reflection.',
      },
    ],
  },
  {
    id: 'questions',
    phase: 'Closing',
    interviewer: 'Ms. Nkosi - HR Manager',
    question: 'Do you have any questions for us?',
    skillFocus: 'Engagement & Interest',
    options: [
      {
        id: 'a',
        text: "No, I think you've covered everything. Thank you.",
        quality: 'poor',
        feedback: "Always ask questions! It shows genuine interest and helps you evaluate the opportunity.",
      },
      {
        id: 'b',
        text: "Yes! I'd love to know more about the team I'd be working with, and what success looks like in this role after the first year. I'm also curious about opportunities for professional development.",
        quality: 'excellent',
        feedback: '🎉 Excellent questions! They show you are thinking ahead and care about growth and contribution.',
        tip: 'Prepare 2-3 thoughtful questions that show interest in the role, team, and growth opportunities.',
      },
      {
        id: 'c',
        text: "What's the salary for this position?",
        quality: 'good',
        feedback: 'Salary is important, but save it for later rounds. Show interest in the role first.',
      },
    ],
  },
];

function scoreForQuality(quality: InterviewOption['quality']): number {
  if (quality === 'excellent') return 20;
  if (quality === 'good') return 12;
  return 5;
}

function qualityColor(quality: InterviewOption['quality']): string {
  if (quality === 'excellent') return '#00E676';
  if (quality === 'good') return '#FFC107';
  return '#FF5252';
}

function performanceRating(totalScore: number) {
  const maxScore = INTERVIEW_STEPS.length * 20;
  const percentage = maxScore ? (totalScore / maxScore) * 100 : 0;
  if (percentage >= 80) return { text: 'Outstanding Candidate!', color: '#00E676' };
  if (percentage >= 60) return { text: 'Good Performance!', color: '#FFC107' };
  return { text: 'Needs Practice', color: '#FF5252' };
}

export function JobInterviewLab({ simulation }: { simulation: SimulationMetadata }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);

  const step = INTERVIEW_STEPS[currentStep];
  const isComplete = completedSteps.length === INTERVIEW_STEPS.length;

  const progress = useMemo(() => {
    const done = Math.min(completedSteps.length, INTERVIEW_STEPS.length);
    return INTERVIEW_STEPS.length ? Math.round((done / INTERVIEW_STEPS.length) * 100) : 0;
  }, [completedSteps.length]);

  const selected = selectedOption ? step.options.find((o) => o.id === selectedOption) : null;

  const choose = (id: string) => {
    if (showFeedback) return;
    setSelectedOption(id);
    setShowFeedback(true);
    const opt = step.options.find((o) => o.id === id);
    if (opt) setTotalScore((prev) => prev + scoreForQuality(opt.quality));
  };

  const next = () => {
    if (!completedSteps.includes(step.id)) setCompletedSteps((prev) => [...prev, step.id]);
    if (currentStep < INTERVIEW_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setTotalScore(0);
    setCompletedSteps([]);
  };

  const rating = performanceRating(totalScore);
  const canTakeQuiz = isComplete;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)' }}>
            <Briefcase size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid wide">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-section-title-row">
              <div className="vl-card-title">Progress</div>
              <div className="vl-section-meta">
                {completedSteps.length} / {INTERVIEW_STEPS.length} • {progress}%
              </div>
            </div>
            <div className="vl-progress-bar">
              <div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
              Total score: <strong>{totalScore}</strong> / {INTERVIEW_STEPS.length * 20}
            </div>
          </div>

          {!isComplete ? (
            <>
              <div className="vl-card">
                <div className="vl-card-title">{step.phase}</div>
                <div className="vl-card-subtitle">
                  {step.skillFocus} • {step.interviewer}
                </div>
                <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
                  <strong>Question:</strong> {step.question}
                </div>
              </div>

              <div className="vl-card">
                <div className="vl-card-title">Choose Your Response</div>
                <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                  {step.options.map((opt) => {
                    const show = showFeedback;
                    const isSelected = selectedOption === opt.id;
                    const color = qualityColor(opt.quality);
                    const bg = !show
                      ? 'rgba(255,255,255,0.06)'
                      : isSelected
                        ? `${color}22`
                        : 'rgba(255,255,255,0.06)';
                    const border = !show ? 'rgba(255,255,255,0.1)' : isSelected ? `${color}55` : 'rgba(255,255,255,0.1)';
                    const opacity = show && !isSelected ? 0.55 : 1;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className="vl-template-btn"
                        style={{ background: bg, borderColor: border, opacity }}
                        onClick={() => choose(opt.id)}
                        disabled={showFeedback}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && selected ? (
                  <>
                    <div className="vl-check-result pass" style={{ borderColor: `${qualityColor(selected.quality)}55`, background: `${qualityColor(selected.quality)}14` }}>
                      <span>
                        <strong style={{ color: qualityColor(selected.quality) }}>{selected.quality.toUpperCase()}</strong> • {selected.feedback}
                      </span>
                    </div>
                    {selected.tip ? (
                      <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
                        <strong>Pro tip:</strong> {selected.tip}
                      </div>
                    ) : null}
                    <div className="vl-row" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
                      <button type="button" className="vl-btn primary" onClick={next}>
                        Next question
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <div className="vl-card">
              <div className="vl-card-title">Interview Complete</div>
              <div className="vl-card-subtitle">
                Rating: <strong style={{ color: rating.color }}>{rating.text}</strong>
              </div>
              <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
                Your score: <strong>{totalScore}</strong> / {INTERVIEW_STEPS.length * 20}
              </div>
              <div className="vl-row" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
                <button type="button" className="vl-btn secondary" onClick={restart}>
                  Restart
                </button>
                <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
                  <Sparkles size={16} /> Knowledge check
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Learning Objectives</div>
            <ul className="vl-bullets">
              {simulation.learningObjectives.map((o) => (
                <li key={o.id}>{o.text}</li>
              ))}
            </ul>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge Check</div>
            <div className="vl-card-subtitle">Complete the interview steps to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Finish interview'}
            </button>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

