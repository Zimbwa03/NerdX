import { useEffect, useState, useRef } from 'react';
import { Brain, Sparkles, Atom, BookOpen, Lightbulb } from 'lucide-react';
import './AILoadingOverlay.css';

interface AILoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  progress?: number;
  accentColor?: string;
  variant?: 'fullscreen' | 'inline' | 'card';
}

const TIPS = [
  "NerdX AI analyzes ZIMSEC patterns for accurate questions",
  "Each question is uniquely crafted for your learning level",
  "Consistent practice improves exam scores by up to 40%",
  "AI adapts difficulty based on your performance history",
  "Flashcards use spaced repetition for better retention",
  "ZIMSEC examiners look for structured, detailed answers",
  "Review your mistakes — they're your biggest growth areas",
  "AI-generated content aligns with the latest ZIMSEC syllabus",
];

const STAGES = [
  { icon: Brain, label: 'Analyzing topic', duration: 2500 },
  { icon: Atom, label: 'Generating content', duration: 3500 },
  { icon: BookOpen, label: 'Aligning with ZIMSEC', duration: 2000 },
  { icon: Sparkles, label: 'Polishing quality', duration: 2000 },
];

export function AILoadingOverlay({
  isVisible,
  title = 'AI is Working',
  subtitle = 'Generating your content...',
  progress,
  accentColor = '#667eea',
  variant = 'inline',
}: AILoadingOverlayProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);
  const [dots, setDots] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(0);
      setTipIndex(0);
      return;
    }

    const p: typeof particles = [];
    for (let i = 0; i < 20; i++) {
      p.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 4,
      });
    }
    setParticles(p);

    let stage = 0;
    const stageInterval = setInterval(() => {
      stage = (stage + 1) % STAGES.length;
      setCurrentStage(stage);
    }, 3000);

    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 5000);

    return () => {
      clearInterval(stageInterval);
      clearInterval(tipInterval);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    intervalRef.current = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isVisible]);

  if (!isVisible) return null;

  const displayProgress = progress !== undefined ? Math.min(progress, 100) : undefined;

  const content = (
    <div className={`ai-loading-container ai-loading-${variant}`} style={{ '--ai-accent': accentColor, '--ai-accent-20': `${accentColor}33`, '--ai-accent-40': `${accentColor}66` } as React.CSSProperties}>
      <div className="ai-loading-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="ai-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              background: accentColor,
            }}
          />
        ))}
      </div>

      <div className="ai-loading-orb-wrap">
        <div className="ai-loading-ring ai-ring-1" style={{ borderColor: `${accentColor}20` }}>
          <div className="ai-ring-dot" style={{ background: accentColor }} />
        </div>
        <div className="ai-loading-ring ai-ring-2" style={{ borderColor: `${accentColor}15` }}>
          <div className="ai-ring-dot" style={{ background: accentColor }} />
        </div>
        <div className="ai-loading-ring ai-ring-3" style={{ borderColor: `${accentColor}10` }}>
          <div className="ai-ring-dot" style={{ background: accentColor }} />
        </div>
        <div className="ai-loading-core" style={{ background: `radial-gradient(circle, ${accentColor}40 0%, ${accentColor}10 60%, transparent 70%)` }}>
          <div className="ai-loading-brain-wrap" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}AA)` }}>
            <Brain size={28} className="ai-brain-icon" />
          </div>
        </div>
      </div>

      <h3 className="ai-loading-title">{title}</h3>
      <p className="ai-loading-subtitle">{subtitle}{dots}</p>

      <div className="ai-loading-stages">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === currentStage;
          const isDone = i < currentStage;
          return (
            <div key={i} className={`ai-stage ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
              <div className="ai-stage-icon" style={{ background: isActive ? `${accentColor}25` : isDone ? `${accentColor}15` : 'rgba(255,255,255,0.05)', borderColor: isActive ? accentColor : isDone ? `${accentColor}60` : 'rgba(255,255,255,0.1)' }}>
                <Icon size={14} style={{ color: isActive ? accentColor : isDone ? `${accentColor}99` : 'rgba(255,255,255,0.3)' }} />
              </div>
              <span className="ai-stage-label" style={{ color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)' }}>
                {stage.label}
              </span>
              {i < STAGES.length - 1 && (
                <div className="ai-stage-connector" style={{ background: isDone ? `${accentColor}40` : 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          );
        })}
      </div>

      {displayProgress !== undefined && (
        <div className="ai-loading-progress-wrap">
          <div className="ai-loading-progress-bar">
            <div
              className="ai-loading-progress-fill"
              style={{ width: `${displayProgress}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)` }}
            />
            <div className="ai-loading-progress-glow" style={{ left: `${displayProgress}%`, background: accentColor }} />
          </div>
          <span className="ai-loading-progress-text">{Math.round(displayProgress)}%</span>
        </div>
      )}

      <div className="ai-loading-tip">
        <Lightbulb size={14} style={{ color: accentColor, flexShrink: 0 }} />
        <span>{TIPS[tipIndex]}</span>
      </div>

      <div className="ai-loading-wave">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="ai-wave-bar" style={{ background: accentColor, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  if (variant === 'fullscreen') {
    return <div className="ai-loading-overlay-backdrop">{content}</div>;
  }

  return content;
}
