import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ruler, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

const SCALE_CM_TO_KM = 2;
const LINE_CM = 3;
const CORRECT_DISTANCE_KM = 6;

export function ScaleDistanceLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedDist, setSelectedDist] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const options = useMemo(
    () => [
      { value: 3, label: '3 km' },
      { value: 4, label: '4 km' },
      { value: 5, label: '5 km' },
      { value: 6, label: '6 km' },
    ],
    []
  );

  const canTakeQuiz = selectedDist !== null;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
            <Ruler size={28} />
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
            <div className="vl-card-title">Using a Linear Scale</div>
            <div className="vl-card-subtitle">Scale bar: 1 cm on the map = 2 km on the ground.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 140" role="img" aria-label="Scale bar">
                <rect x="120" y="60" width="320" height="18" rx="9" fill="rgba(255,255,255,0.12)" />
                <rect x="120" y="60" width="80" height="18" rx="9" fill="rgba(0,230,118,0.25)" />
                <rect x="200" y="60" width="80" height="18" rx="0" fill="rgba(255,255,255,0.08)" />
                <rect x="280" y="60" width="80" height="18" rx="0" fill="rgba(0,230,118,0.18)" />
                <rect x="360" y="60" width="80" height="18" rx="9" fill="rgba(255,255,255,0.08)" />

                <text x="120" y="54" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  0
                </text>
                <text x="200" y="54" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  2 km
                </text>
                <text x="280" y="54" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  4 km
                </text>
                <text x="360" y="54" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  6 km
                </text>
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Task: Measure Distance</div>
            <div className="vl-card-subtitle">
              The straight line from town A to town B on the map is {LINE_CM} cm. Using 1 cm = {SCALE_CM_TO_KM} km, what is the real distance?
            </div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 160" role="img" aria-label="A to B line">
                <rect x="70" y="40" width="420" height="90" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                <circle cx="170" cy="85" r="18" fill="#1976D2" />
                <text x="170" y="90" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">
                  A
                </text>
                <circle cx="390" cy="85" r="18" fill="#2E7D32" />
                <text x="390" y="90" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">
                  B
                </text>
                <line x1="188" y1="85" x2="372" y2="85" stroke="#7C4DFF" strokeWidth="6" />
                <text x="280" y="120" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="900">
                  {LINE_CM} cm on map
                </text>
              </svg>
            </div>

            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {options.map((opt) => {
                const show = selectedDist !== null;
                const selected = selectedDist === opt.value;
                const correct = opt.value === CORRECT_DISTANCE_KM;
                const bg = !show ? 'rgba(255,255,255,0.06)' : selected ? (correct ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.18)') : 'rgba(255,255,255,0.06)';
                const border = !show ? 'rgba(255,255,255,0.1)' : selected ? (correct ? 'rgba(0,230,118,0.35)' : 'rgba(255,23,68,0.35)') : 'rgba(255,255,255,0.1)';
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="vl-btn"
                    style={{ background: bg, borderColor: border }}
                    onClick={() => setSelectedDist(opt.value)}
                    disabled={selectedDist !== null}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {selectedDist !== null && (
              <div className={`vl-check-result ${selectedDist === CORRECT_DISTANCE_KM ? 'pass' : 'fail'}`}>
                {selectedDist === CORRECT_DISTANCE_KM ? (
                  <span>Correct: {LINE_CM} cm x {SCALE_CM_TO_KM} km/cm = {CORRECT_DISTANCE_KM} km.</span>
                ) : (
                  <span>Distance = map distance x scale. {LINE_CM} x {SCALE_CM_TO_KM} = {CORRECT_DISTANCE_KM} km.</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Answer the distance question.</div>
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

