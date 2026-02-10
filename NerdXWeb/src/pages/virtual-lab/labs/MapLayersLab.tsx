import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

const CORRECT_INDEX = 1;

export function MapLayersLab({ simulation }: { simulation: SimulationMetadata }) {
  const [roadsOn, setRoadsOn] = useState(true);
  const [riversOn, setRiversOn] = useState(true);
  const [landUseOn, setLandUseOn] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const options = useMemo(
    () => [
      { value: 0, label: 'So the map is always the same' },
      { value: 1, label: 'To turn themes on/off and compare different data' },
      { value: 2, label: 'To hide all information' },
      { value: 3, label: 'To replace paper maps only' },
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
            <Layers size={28} />
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
            <div className="vl-card-title">Toggle Layers</div>
            <div className="vl-card-subtitle">
              In GIS, each type of data (roads, rivers, land use) is a separate layer. Turn layers on/off to focus and compare.
            </div>

            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${roadsOn ? 'active' : ''}`} onClick={() => setRoadsOn((v) => !v)}>
                Roads: {roadsOn ? 'On' : 'Off'}
              </button>
              <button type="button" className={`vl-tab ${riversOn ? 'active' : ''}`} onClick={() => setRiversOn((v) => !v)}>
                Rivers: {riversOn ? 'On' : 'Off'}
              </button>
              <button type="button" className={`vl-tab ${landUseOn ? 'active' : ''}`} onClick={() => setLandUseOn((v) => !v)}>
                Land use: {landUseOn ? 'On' : 'Off'}
              </button>
            </div>

            <div className="vl-canvas-wrap">
              <div
                style={{
                  width: '100%',
                  maxWidth: 560,
                  height: 170,
                  borderRadius: 16,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(10,14,33,0.25)',
                }}
                aria-label="GIS layer preview"
              >
                {landUseOn ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'repeating-linear-gradient(45deg, rgba(0,230,118,0.12), rgba(0,230,118,0.12) 10px, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 20px)',
                    }}
                  />
                ) : null}

                {roadsOn ? (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: 76,
                        left: 22,
                        right: 22,
                        height: 6,
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.65)',
                        transform: 'rotate(-6deg)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 18,
                        left: 74,
                        width: 6,
                        height: 130,
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.5)',
                        transform: 'rotate(8deg)',
                      }}
                    />
                  </>
                ) : null}

                {riversOn ? (
                  <svg
                    viewBox="0 0 560 170"
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', inset: 0 }}
                    aria-hidden="true"
                  >
                    <path
                      d="M 50 130 C 130 90, 190 150, 270 110 S 390 60, 510 95"
                      fill="none"
                      stroke="rgba(33,150,243,0.85)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : null}

                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 12,
                    right: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'rgba(255,255,255,0.76)',
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  <span>Preview</span>
                  <span>{[roadsOn ? 'Roads' : null, riversOn ? 'Rivers' : null, landUseOn ? 'Land use' : null].filter(Boolean).join(' • ') || 'No layers'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Question</div>
            <div className="vl-card-subtitle">Why do we use layers in GIS?</div>

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
                  <span>Correct: layers help you compare themes and focus on one type of data at a time.</span>
                ) : (
                  <span>Not quite. Layers let you turn themes on/off (roads vs rivers vs land use) to compare and analyze patterns.</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Answer the question.</div>
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

