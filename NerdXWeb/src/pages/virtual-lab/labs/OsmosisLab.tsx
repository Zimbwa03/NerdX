import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type CellType = 'red-blood-cell' | 'plant-cell';
type SolutionType = 'hypotonic' | 'isotonic' | 'hypertonic';

type Observation = {
  id: string;
  concentration: number;
  solutionType: SolutionType;
  cellState: string;
  timestamp: number;
};

function getSolutionType(conc: number): SolutionType {
  if (conc < 40) return 'hypotonic';
  if (conc > 60) return 'hypertonic';
  return 'isotonic';
}

function cellScale(solutionType: SolutionType): number {
  if (solutionType === 'hypotonic') return 1.3;
  if (solutionType === 'hypertonic') return 0.72;
  return 1.0;
}

export function OsmosisLab({ simulation }: { simulation: SimulationMetadata }) {
  const [cellType, setCellType] = useState<CellType>('red-blood-cell');
  const [concentration, setConcentration] = useState(50);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const obsCounter = useRef(0);

  const solutionType = getSolutionType(concentration);

  const stateLabel = useMemo(() => {
    if (cellType === 'red-blood-cell') {
      if (solutionType === 'hypotonic') return 'Swelling (lysis risk)';
      if (solutionType === 'hypertonic') return 'Shrinking (crenation)';
      return 'Normal';
    }
    if (solutionType === 'hypotonic') return 'Turgid';
    if (solutionType === 'hypertonic') return 'Plasmolyzed';
    return 'Flaccid';
  }, [cellType, solutionType]);

  const movement = useMemo(() => {
    if (solutionType === 'hypotonic') return 'Water moves into the cell';
    if (solutionType === 'hypertonic') return 'Water moves out of the cell';
    return 'Water movement is balanced';
  }, [solutionType]);

  const recordObservation = () => {
    const id = `${Date.now()}-${obsCounter.current++}`;
    setObservations((prev) => [
      { id, concentration, solutionType, cellState: stateLabel, timestamp: Date.now() },
      ...prev,
    ].slice(0, 12));
  };

  const canTakeQuiz = useMemo(() => {
    if (observations.length < 3) return false;
    const hasHypo = observations.some((o) => o.solutionType === 'hypotonic');
    const hasIso = observations.some((o) => o.solutionType === 'isotonic');
    const hasHyper = observations.some((o) => o.solutionType === 'hypertonic');
    return hasHypo && hasIso && hasHyper;
  }, [observations]);

  const scale = cellScale(solutionType);
  const waterPts = useMemo(() => {
    // deterministic ring of molecules
    const pts: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2;
      pts.push({ x: 160 + Math.cos(a) * 128, y: 160 + Math.sin(a) * 118 });
    }
    return pts;
  }, []);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #03A9F4, #1565C0)' }}>
            <Droplets size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Experiment</div>
            <div className="vl-card-subtitle">Adjust salt concentration and observe how the cell changes.</div>

            <div className="vl-row">
              <div className="vl-tab-row" role="tablist" aria-label="Cell type">
                {(['red-blood-cell', 'plant-cell'] as CellType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`vl-tab ${cellType === t ? 'active' : ''}`}
                    onClick={() => setCellType(t)}
                  >
                    {t === 'red-blood-cell' ? 'Red blood cell' : 'Plant cell'}
                  </button>
                ))}
              </div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Salt concentration: {concentration}%</div>
              <input
                className="vl-range"
                type="range"
                min={0}
                max={100}
                step={1}
                value={concentration}
                onChange={(e) => setConcentration(Number(e.target.value))}
              />
              <div className="vl-meta">
                <span className="vl-meta-item">{solutionType}</span>
                <span className="vl-meta-item">{stateLabel}</span>
              </div>
            </div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 320 320" role="img" aria-label="Osmosis simulation">
                {waterPts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#2196F3" opacity="0.6" />
                    <circle cx={p.x - 3} cy={p.y + 3} r="3" fill="#64B5F6" opacity="0.5" />
                    <circle cx={p.x + 3} cy={p.y + 3} r="3" fill="#64B5F6" opacity="0.5" />
                  </g>
                ))}

                {cellType === 'red-blood-cell' ? (
                  <g style={{ transformOrigin: '160px 160px', transform: `scale(${scale})` }}>
                    <ellipse cx="160" cy="160" rx="62" ry="52" fill="#F44336" stroke="#D32F2F" strokeWidth="3" />
                    <ellipse cx="160" cy="160" rx="26" ry="22" fill="#E57373" opacity="0.85" />
                  </g>
                ) : (
                  <>
                    <rect x="70" y="85" width="180" height="150" rx="14" fill="#8BC34A" stroke="#558B2F" strokeWidth="4" />
                    <g style={{ transformOrigin: '160px 160px', transform: `scale(${Math.max(0.8, Math.min(1.08, scale))})` }}>
                      <rect x="82" y="97" width="156" height="126" rx="12" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="2" opacity="0.9" />
                      <rect x="88" y="103" width="144" height="114" rx="10" fill="#E1BEE7" opacity="0.55" />
                      <ellipse
                        cx="172"
                        cy="170"
                        rx={solutionType === 'hypertonic' ? 42 : 70 * scale}
                        ry={solutionType === 'hypertonic' ? 34 : 55 * scale}
                        fill="#03A9F4"
                        opacity="0.45"
                      />
                    </g>
                  </>
                )}

                {solutionType !== 'isotonic' && (
                  <g opacity="0.85">
                    <path
                      d={solutionType === 'hypotonic' ? 'M 250 160 l -18 -10 v 7 h -40 v 6 h 40 v 7 z' : 'M 70 160 l 18 -10 v 7 h 40 v 6 h -40 v 7 z'}
                      fill="#00E676"
                    />
                  </g>
                )}
              </svg>
            </div>

            <div className="vl-explanation">
              <strong>Water movement:</strong> {movement}. <strong>Cell state:</strong> {stateLabel}.
            </div>

            <div className="vl-row">
              <button type="button" className="vl-btn secondary" onClick={recordObservation}>
                Record observation
              </button>
              <button type="button" className="vl-btn secondary" onClick={() => setObservations([])} disabled={observations.length === 0}>
                Clear
              </button>
              <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
                <Sparkles size={16} /> {canTakeQuiz ? 'Knowledge check' : 'Record 3 types to unlock'}
              </button>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Observations</div>
            <div className="vl-card-subtitle">Try hypotonic, isotonic, and hypertonic solutions.</div>

            {observations.length === 0 ? (
              <div className="vl-card-subtitle">No observations recorded yet.</div>
            ) : (
              <div className="vl-template-list">
                {observations.map((o) => (
                  <div key={o.id} className="vl-template-btn">
                    <div className="vl-template-title">
                      {o.solutionType} <span className="vl-pill-mini">{o.concentration}%</span>
                    </div>
                    <div className="vl-template-desc">{o.cellState}</div>
                  </div>
                ))}
              </div>
            )}
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
