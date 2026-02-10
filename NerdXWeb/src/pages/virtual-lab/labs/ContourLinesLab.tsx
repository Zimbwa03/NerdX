import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mountain, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

export function ContourLinesLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedHeight, setSelectedHeight] = useState<number | null>(null);
  const [selectedSlope, setSelectedSlope] = useState<'steep' | 'gentle' | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const heightOptions = useMemo(
    () => [
      { value: 100, label: '100 m' },
      { value: 150, label: '150 m' },
      { value: 200, label: '200 m' },
      { value: 250, label: '250 m' },
    ],
    []
  );
  const correctHeight = 150;

  const slopeOptions = useMemo(
    () => [
      { value: 'steep' as const, label: 'Steep (contours close together)' },
      { value: 'gentle' as const, label: 'Gentle (contours far apart)' },
    ],
    []
  );
  const correctSlope: 'steep' | 'gentle' = 'steep';

  const canTakeQuiz = selectedHeight !== null && selectedSlope !== null;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
            <Mountain size={28} />
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
            <div className="vl-card-title">Contour Diagram</div>
            <div className="vl-card-subtitle">Contour interval = 50 m. Close lines = steep slope.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 420 220" role="img" aria-label="Contour diagram">
                <rect x="60" y="25" width="300" height="170" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                <ellipse cx="210" cy="110" rx="120" ry="80" fill="transparent" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <ellipse cx="210" cy="110" rx="90" ry="60" fill="transparent" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <ellipse cx="210" cy="110" rx="60" ry="40" fill="transparent" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <ellipse cx="210" cy="110" rx="30" ry="20" fill="transparent" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />

                <circle cx="252" cy="110" r="12" fill="#2E7D32" />
                <text x="252" y="114" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">
                  X
                </text>
                <text x="98" y="52" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="800">
                  100 m
                </text>
                <text x="154" y="82" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="800">
                  200 m
                </text>
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Task 1: Height at X</div>
            <div className="vl-card-subtitle">Point X lies halfway between the 100 m and 200 m contours. Approx height?</div>
            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {heightOptions.map((opt) => {
                const show = selectedHeight !== null;
                const selected = selectedHeight === opt.value;
                const correct = opt.value === correctHeight;
                const bg = !show ? 'rgba(255,255,255,0.06)' : selected ? (correct ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.18)') : 'rgba(255,255,255,0.06)';
                const border = !show ? 'rgba(255,255,255,0.1)' : selected ? (correct ? 'rgba(0,230,118,0.35)' : 'rgba(255,23,68,0.35)') : 'rgba(255,255,255,0.1)';
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="vl-btn"
                    style={{ background: bg, borderColor: border }}
                    onClick={() => setSelectedHeight(opt.value)}
                    disabled={selectedHeight !== null}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {selectedHeight !== null && (
              <div className={`vl-check-result ${selectedHeight === correctHeight ? 'pass' : 'fail'}`}>
                {selectedHeight === correctHeight ? (
                  <span>Correct: halfway between 100 m and 200 m is about 150 m.</span>
                ) : (
                  <span>Not quite. Halfway between 100 m and 200 m is about 150 m.</span>
                )}
              </div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Task 2: Slope</div>
            <div className="vl-card-subtitle">From A to B the contours are close together. What does this tell you?</div>
            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {slopeOptions.map((opt) => {
                const show = selectedSlope !== null;
                const selected = selectedSlope === opt.value;
                const correct = opt.value === correctSlope;
                const bg = !show ? 'rgba(255,255,255,0.06)' : selected ? (correct ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.18)') : 'rgba(255,255,255,0.06)';
                const border = !show ? 'rgba(255,255,255,0.1)' : selected ? (correct ? 'rgba(0,230,118,0.35)' : 'rgba(255,23,68,0.35)') : 'rgba(255,255,255,0.1)';
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="vl-btn"
                    style={{ background: bg, borderColor: border }}
                    onClick={() => setSelectedSlope(opt.value)}
                    disabled={selectedSlope !== null}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {selectedSlope !== null && (
              <div className={`vl-check-result ${selectedSlope === correctSlope ? 'pass' : 'fail'}`}>
                {selectedSlope === correctSlope ? (
                  <span>Correct: close contours mean a steep slope.</span>
                ) : (
                  <span>Not quite. When contours are close together, the slope is steep.</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Complete both tasks.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Finish tasks'}
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

