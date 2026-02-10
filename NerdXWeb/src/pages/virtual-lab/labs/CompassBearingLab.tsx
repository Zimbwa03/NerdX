import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

const CORRECT_BEARING = 45;

export function CompassBearingLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedBearing, setSelectedBearing] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const options = useMemo(
    () => [
      { value: 0, label: '000° (N)' },
      { value: 45, label: '045° (NE)' },
      { value: 90, label: '090° (E)' },
      { value: 135, label: '135° (SE)' },
      { value: 180, label: '180° (S)' },
    ],
    []
  );

  const canTakeQuiz = selectedBearing !== null;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
            <Compass size={28} />
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
            <div className="vl-card-title">Bearings (0–360°)</div>
            <div className="vl-card-subtitle">Bearings are measured clockwise from North. North = 0°, East = 90°, South = 180°, West = 270°.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 420 220" role="img" aria-label="Compass rose">
                <circle cx="210" cy="110" r="80" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
                <line x1="210" y1="30" x2="210" y2="190" stroke="rgba(255,255,255,0.18)" />
                <line x1="130" y1="110" x2="290" y2="110" stroke="rgba(255,255,255,0.18)" />
                <text x="210" y="26" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="900">
                  N (0°)
                </text>
                <text x="210" y="206" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="900">
                  S (180°)
                </text>
                <text x="118" y="116" textAnchor="end" fill="rgba(255,255,255,0.85)" fontSize="12" fontWeight="900">
                  W (270°)
                </text>
                <text x="302" y="116" textAnchor="start" fill="rgba(255,255,255,0.85)" fontSize="12" fontWeight="900">
                  E (90°)
                </text>
                <g transform="translate(210,110)">
                  <line x1="0" y1="-70" x2="0" y2="-18" stroke="#7C4DFF" strokeWidth="6" />
                  <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                  <circle cx="0" cy="0" r="2" fill="rgba(255,255,255,0.7)" />
                  <line x1="-14" y1="0" x2="-8" y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                  <line x1="8" y1="0" x2="14" y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                  <line x1="0" y1="-14" x2="0" y2="-8" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                  <line x1="0" y1="8" x2="0" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Practice</div>
            <div className="vl-card-subtitle">You are at point A. What is the bearing to point B? (Clockwise from North.)</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 420 220" role="img" aria-label="A to B">
                <rect x="40" y="30" width="340" height="160" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                <text x="210" y="48" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  N
                </text>
                <circle cx="110" cy="160" r="16" fill="#1976D2" />
                <text x="110" y="165" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">
                  A
                </text>
                <circle cx="300" cy="70" r="16" fill="#2E7D32" />
                <text x="300" y="75" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">
                  B
                </text>
                <line x1="122" y1="152" x2="288" y2="78" stroke="#7C4DFF" strokeWidth="4" />
              </svg>
            </div>

            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {options.map((opt) => {
                const show = selectedBearing !== null;
                const selected = selectedBearing === opt.value;
                const correct = opt.value === CORRECT_BEARING;
                const bg = !show ? 'rgba(255,255,255,0.06)' : selected ? (correct ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.18)') : 'rgba(255,255,255,0.06)';
                const border = !show ? 'rgba(255,255,255,0.1)' : selected ? (correct ? 'rgba(0,230,118,0.35)' : 'rgba(255,23,68,0.35)') : 'rgba(255,255,255,0.1)';
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="vl-btn"
                    style={{ background: bg, borderColor: border }}
                    onClick={() => setSelectedBearing(opt.value)}
                    disabled={selectedBearing !== null}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {selectedBearing !== null && (
              <div className={`vl-check-result ${selectedBearing === CORRECT_BEARING ? 'pass' : 'fail'}`}>
                {selectedBearing === CORRECT_BEARING ? (
                  <span>Correct: A to B is North-east, bearing 045°.</span>
                ) : (
                  <span>Not quite. B is up and right from A (NE), so the bearing is 045°.</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Answer the practice question.</div>
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
