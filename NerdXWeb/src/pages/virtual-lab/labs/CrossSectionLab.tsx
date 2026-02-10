import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

const CORRECT_INDEX = 1;

export function CrossSectionLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const options = useMemo(
    () => [
      { value: 0, label: 'A view from directly above (plan view)' },
      { value: 1, label: 'A side view of the land along a line (profile)' },
      { value: 2, label: 'Only rivers and water features' },
      { value: 3, label: 'Grid references only' },
    ],
    []
  );

  const canTakeQuiz = selected !== null;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
            <Globe size={28} />
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
            <div className="vl-card-title">What Is a Cross-Section?</div>
            <div className="vl-card-subtitle">
              A cross-section (profile) is a side view of the land along a straight line on the map. You transfer heights
              from where contour lines cross the line, then join the points to show relief.
            </div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 220" role="img" aria-label="Cross-section diagram">
                <rect x="40" y="26" width="480" height="160" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                <line x1="80" y1="166" x2="500" y2="166" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
                <line x1="80" y1="50" x2="80" y2="166" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />

                <path
                  d="M80 166 C 150 70, 220 70, 260 166 S 360 210, 420 120 S 470 90, 500 110"
                  fill="none"
                  stroke="#7C4DFF"
                  strokeWidth="4"
                />
                <circle cx="260" cy="166" r="4" fill="#00E676" />
                <circle cx="420" cy="120" r="4" fill="#00E676" />

                <text x="88" y="56" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  Height (m)
                </text>
                <text x="490" y="184" textAnchor="end" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  Distance →
                </text>
                <text x="280" y="206" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">
                  Example profile: hill and valley
                </text>
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Task</div>
            <div className="vl-card-subtitle">What does a cross-section (profile) show?</div>

            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {options.map((opt) => {
                const show = selected !== null;
                const isSelected = selected === opt.value;
                const isCorrect = opt.value === CORRECT_INDEX;
                const bg = !show
                  ? 'rgba(255,255,255,0.06)'
                  : isSelected
                    ? isCorrect
                      ? 'rgba(0,230,118,0.22)'
                      : 'rgba(255,23,68,0.18)'
                    : 'rgba(255,255,255,0.06)';
                const border = !show
                  ? 'rgba(255,255,255,0.1)'
                  : isSelected
                    ? isCorrect
                      ? 'rgba(0,230,118,0.35)'
                      : 'rgba(255,23,68,0.35)'
                    : 'rgba(255,255,255,0.1)';

                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="vl-btn"
                    style={{ background: bg, borderColor: border }}
                    onClick={() => setSelected(opt.value)}
                    disabled={selected !== null}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className={`vl-check-result ${selected === CORRECT_INDEX ? 'pass' : 'fail'}`}>
                {selected === CORRECT_INDEX ? (
                  <span>Correct: a cross-section is a side view of the land along a line.</span>
                ) : (
                  <span>Not quite. A cross-section is a side view of relief along a straight line on the map.</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Answer the task question.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Select an answer'}
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Learning Objectives</div>
            <ul className="vl-bullets">
              {simulation.learningObjectives.map((o) => (
                <li key={o.id}>{o.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

