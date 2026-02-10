import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

interface DialogueOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  culturalNote?: string;
}

interface DialogueStep {
  id: string;
  scenario: string;
  vendorMessage: string;
  vendorMood: 'neutral' | 'happy' | 'concerned' | 'pleased';
  options: DialogueOption[];
  vocabulary: { word: string; meaning: string }[];
}

const DIALOGUE_STEPS: DialogueStep[] = [
  {
    id: 'greeting',
    scenario: '🌍 You arrive at a vibrant African marketplace. A friendly vendor arranges fresh tomatoes on her stall.',
    vendorMessage: '*Smiles warmly* Good morning! Would you like some beautiful tomatoes today?',
    vendorMood: 'happy',
    options: [
      {
        id: 'a',
        text: 'How much?',
        isCorrect: false,
        feedback: 'This is too abrupt! In African markets, a warm greeting builds a positive relationship first.',
      },
      {
        id: 'b',
        text: 'Good morning, Mama! They look wonderful. How has business been today?',
        isCorrect: true,
        feedback: '🎉 Perfect! You started with a respectful greeting and showed genuine interest in the vendor.',
        culturalNote: 'Using "Mama" is a respectful term for an elder woman in many African cultures.',
      },
      {
        id: 'c',
        text: "I don't want to buy anything.",
        isCorrect: false,
        feedback: 'Even if not buying, a polite acknowledgment maintains positive community relations.',
      },
    ],
    vocabulary: [
      { word: 'stall', meaning: 'a table or booth where goods are displayed for sale' },
      { word: 'vibrant', meaning: 'full of energy and activity' },
    ],
  },
  {
    id: 'inquiry',
    scenario: '🍅 The vendor is pleased with your greeting and shows you her best tomatoes.',
    vendorMessage: 'Ah, thank you for asking! Business is good today. These tomatoes are from my farm - very fresh! How many would you like?',
    vendorMood: 'pleased',
    options: [
      {
        id: 'a',
        text: "I'll take 2 kilos. What's the price?",
        isCorrect: false,
        feedback: 'Good quantity specification, but asking the price first lets you negotiate better.',
      },
      {
        id: 'b',
        text: 'They look very fresh! Could you tell me the price per kilo, please?',
        isCorrect: true,
        feedback: '🎉 Excellent! You complimented the product and politely asked for pricing information.',
        culturalNote: 'Complimenting products before asking prices creates goodwill.',
      },
      {
        id: 'c',
        text: 'Just give me some.',
        isCorrect: false,
        feedback: 'Being specific about quantity and asking about price helps avoid misunderstandings.',
      },
    ],
    vocabulary: [
      { word: 'fresh', meaning: 'recently made, picked, or prepared' },
      { word: 'kilo', meaning: 'short for kilogram, a unit of weight (1000 grams)' },
    ],
  },
  {
    id: 'negotiation',
    scenario: '💰 The vendor tells you the tomatoes are 5,000 per kilo.',
    vendorMessage: "For you, these beautiful tomatoes are 5,000 per kilo. They're the best in the market!",
    vendorMood: 'neutral',
    options: [
      {
        id: 'a',
        text: "That's too expensive! I'll pay 2,000 only.",
        isCorrect: false,
        feedback: 'Starting too low can feel disrespectful. A more reasonable counter-offer works better.',
      },
      {
        id: 'b',
        text: 'I really love these tomatoes, but I was hoping for around 3,500. Would that work for you?',
        isCorrect: true,
        feedback: '🎉 Great negotiation! You were polite, gave a reasonable offer, and invited discussion.',
        culturalNote: 'Using "I was hoping" softens your request and keeps the conversation friendly.',
      },
      {
        id: 'c',
        text: 'No, I will buy somewhere else.',
        isCorrect: false,
        feedback: 'This sounds threatening. In many markets, negotiation is friendly and relational.',
      },
    ],
    vocabulary: [
      { word: 'counter-offer', meaning: 'an alternative offer made in response to an initial offer' },
      { word: 'reasonable', meaning: 'fair and sensible' },
    ],
  },
  {
    id: 'agreement',
    scenario: '🤝 The vendor considers your offer and proposes a middle ground.',
    vendorMessage: '*Thinking* Hmm, 3,500 is low, but because you are polite... let\'s say 4,000 and I\'ll add some extra tomatoes. Deal?',
    vendorMood: 'happy',
    options: [
      {
        id: 'a',
        text: 'Deal! Thank you so much, Mama. I appreciate your generosity.',
        isCorrect: true,
        feedback: '🎉 Wonderful! You accepted graciously and showed appreciation for the fair deal.',
        culturalNote: 'Expressing gratitude strengthens community bonds and ensures a warm welcome next time.',
      },
      {
        id: 'b',
        text: 'Make it 3,800 and we have a deal.',
        isCorrect: false,
        feedback: 'She already offered a good compromise. Pushing further may seem greedy.',
      },
      {
        id: 'c',
        text: 'OK.',
        isCorrect: false,
        feedback: "A warmer response acknowledges the vendor's kindness in meeting you halfway.",
      },
    ],
    vocabulary: [
      { word: 'deal', meaning: 'an agreement between parties' },
      { word: 'generous', meaning: 'willing to give more than expected' },
    ],
  },
  {
    id: 'farewell',
    scenario: "👋 You've completed your purchase. Time to say goodbye!",
    vendorMessage: '*Handing you the bag with extra tomatoes* Here you go! Come back again soon!',
    vendorMood: 'happy',
    options: [
      {
        id: 'a',
        text: '*Takes bag and walks away*',
        isCorrect: false,
        feedback: 'A proper farewell leaves a positive impression for future visits.',
      },
      {
        id: 'b',
        text: 'Thank you very much, Mama! May your business continue to prosper. See you next time!',
        isCorrect: true,
        feedback: "🎉 Perfect ending! You blessed her business and promised to return - building lasting relationships.",
        culturalNote: "Wishing someone's business well is a meaningful blessing in many African cultures.",
      },
      {
        id: 'c',
        text: 'Thanks. Bye.',
        isCorrect: false,
        feedback: 'A warmer farewell reflects the positive interaction you have built.',
      },
    ],
    vocabulary: [
      { word: 'prosper', meaning: 'to succeed or do well financially' },
      { word: 'farewell', meaning: 'a goodbye or parting message' },
    ],
  },
];

function moodLabel(mood: DialogueStep['vendorMood']): string {
  if (mood === 'happy') return 'Happy';
  if (mood === 'pleased') return 'Pleased';
  if (mood === 'concerned') return 'Concerned';
  return 'Neutral';
}

export function MarketNegotiationLab({ simulation }: { simulation: SimulationMetadata }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showVocab, setShowVocab] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const step = DIALOGUE_STEPS[currentStep];
  const isComplete = completedSteps.length === DIALOGUE_STEPS.length;

  const progress = useMemo(() => {
    const done = Math.min(completedSteps.length, DIALOGUE_STEPS.length);
    return DIALOGUE_STEPS.length ? Math.round((done / DIALOGUE_STEPS.length) * 100) : 0;
  }, [completedSteps.length]);

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
    setShowFeedback(true);
    const option = step.options.find((o) => o.id === optionId);
    if (option?.isCorrect) setScore((prev) => prev + 20);
  };

  const next = () => {
    if (!completedSteps.includes(step.id)) setCompletedSteps((prev) => [...prev, step.id]);
    if (currentStep < DIALOGUE_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowVocab(false);
      return;
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setCompletedSteps([]);
    setShowVocab(false);
  };

  const selected = selectedOption ? step.options.find((o) => o.id === selectedOption) : null;

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
            <MessageCircle size={28} />
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
                {completedSteps.length} / {DIALOGUE_STEPS.length} • {progress}%
              </div>
            </div>
            <div className="vl-progress-bar">
              <div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
              Score: <strong>{score}</strong> / {DIALOGUE_STEPS.length * 20}
            </div>
          </div>

          {!isComplete ? (
            <>
              <div className="vl-card">
                <div className="vl-card-title">Scene</div>
                <div className="vl-card-subtitle">{step.scenario}</div>
              </div>

              <div className="vl-card">
                <div className="vl-card-title">Vendor ({moodLabel(step.vendorMood)})</div>
                <div className="vl-card-subtitle">{step.vendorMessage}</div>
              </div>

              <div className="vl-card">
                <div className="vl-card-title">Choose Your Response</div>
                <div className="vl-card-subtitle">Pick the best response for this situation.</div>

                <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                  {step.options.map((opt) => {
                    const show = showFeedback;
                    const isSelected = selectedOption === opt.id;
                    const bg = !show
                      ? 'rgba(255,255,255,0.06)'
                      : isSelected
                        ? opt.isCorrect
                          ? 'rgba(0,230,118,0.22)'
                          : 'rgba(255,23,68,0.18)'
                        : opt.isCorrect
                          ? 'rgba(0,230,118,0.12)'
                          : 'rgba(255,255,255,0.06)';
                    const border = !show
                      ? 'rgba(255,255,255,0.1)'
                      : isSelected
                        ? opt.isCorrect
                          ? 'rgba(0,230,118,0.35)'
                          : 'rgba(255,23,68,0.35)'
                        : opt.isCorrect
                          ? 'rgba(0,230,118,0.25)'
                          : 'rgba(255,255,255,0.1)';
                    const opacity = show && !isSelected && !opt.isCorrect ? 0.55 : 1;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className="vl-template-btn"
                        style={{ background: bg, borderColor: border, opacity }}
                        onClick={() => handleOptionSelect(opt.id)}
                        disabled={showFeedback}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && selected ? (
                  <div className={`vl-check-result ${selected.isCorrect ? 'pass' : 'fail'}`}>
                    <span>{selected.feedback}</span>
                  </div>
                ) : null}

                {showFeedback && selected?.culturalNote ? (
                  <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
                    <strong>Culture note:</strong> {selected.culturalNote}
                  </div>
                ) : null}

                {showFeedback ? (
                  <div className="vl-row" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
                    <button type="button" className="vl-btn secondary" onClick={() => setShowVocab((v) => !v)}>
                      {showVocab ? 'Hide' : 'Show'} vocabulary
                    </button>
                    <button type="button" className="vl-btn primary" onClick={next}>
                      Next
                    </button>
                  </div>
                ) : null}

                {showVocab ? (
                  <div style={{ marginTop: 12 }}>
                    <div className="vl-card-title">Vocabulary</div>
                    <ul className="vl-bullets">
                      {step.vocabulary.map((v) => (
                        <li key={v.word}>
                          <strong>{v.word}:</strong> {v.meaning}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="vl-card">
              <div className="vl-card-title">Negotiation Complete</div>
              <div className="vl-card-subtitle">
                Great work. You practiced greetings, polite negotiation, and respectful closing.
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
            <div className="vl-card-subtitle">Complete all dialogue steps to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Finish dialogue'}
            </button>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

