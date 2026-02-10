import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bolt, Play, RefreshCw, Sparkles, Square } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type Electrolyte = {
  id: string;
  name: string;
  formula: string;
  cathodeProduct: string;
  anodeProduct: string;
  cathodeHalfEq: string;
  anodeHalfEq: string;
  cathodeColor: string;
  anodeColor: string;
};

const ELECTROLYTES: Electrolyte[] = [
  {
    id: 'water',
    name: 'Dilute Sulfuric Acid',
    formula: 'H2SO4(aq)',
    cathodeProduct: 'Hydrogen (H2)',
    anodeProduct: 'Oxygen (O2)',
    cathodeHalfEq: '2H+ + 2e- -> H2',
    anodeHalfEq: '4OH- -> O2 + 2H2O + 4e-',
    cathodeColor: '#E3F2FD',
    anodeColor: '#E3F2FD',
  },
  {
    id: 'nacl',
    name: 'Concentrated Sodium Chloride',
    formula: 'NaCl(conc)',
    cathodeProduct: 'Hydrogen (H2)',
    anodeProduct: 'Chlorine (Cl2)',
    cathodeHalfEq: '2H+ + 2e- -> H2',
    anodeHalfEq: '2Cl- -> Cl2 + 2e-',
    cathodeColor: '#E3F2FD',
    anodeColor: '#DCEDC8',
  },
  {
    id: 'cuso4',
    name: 'Copper(II) Sulfate',
    formula: 'CuSO4(aq)',
    cathodeProduct: 'Copper (Cu)',
    anodeProduct: 'Oxygen (O2)',
    cathodeHalfEq: 'Cu2+ + 2e- -> Cu',
    anodeHalfEq: '4OH- -> O2 + 2H2O + 4e-',
    cathodeColor: '#FFCCBC',
    anodeColor: '#E3F2FD',
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function bubblesFor(count: number, seed: number): Array<{ x: number; y: number; r: number }> {
  const n = Math.min(14, Math.max(0, count % 24));
  let t = (seed * 1103515245 + 12345) >>> 0;
  const next = () => {
    t = (t * 1664525 + 1013904223) >>> 0;
    return t / 4294967296;
  };
  return Array.from({ length: n }).map(() => ({
    x: 0.15 + next() * 0.7,
    y: 0.15 + next() * 0.7,
    r: 3 + Math.floor(next() * 4),
  }));
}

export function ElectrolysisSimulatorLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedElectrolyte, setSelectedElectrolyte] = useState<Electrolyte>(ELECTROLYTES[0]);
  const [voltage, setVoltage] = useState(0);
  const [running, setRunning] = useState(false);
  const [bubbleCount, setBubbleCount] = useState({ cathode: 0, anode: 0 });
  const [experimentsRun, setExperimentsRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running || voltage <= 0) return () => undefined;
    intervalRef.current = window.setInterval(() => {
      setBubbleCount((prev) => ({
        cathode: prev.cathode + Math.floor(voltage / 3),
        anode: prev.anode + Math.floor(voltage / 4),
      }));
    }, 500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running, voltage]);

  const startStop = () => {
    if (!running) setExperimentsRun((p) => clamp(p + 1, 0, 5));
    setRunning((p) => !p);
  };

  const reset = () => {
    setRunning(false);
    setBubbleCount({ cathode: 0, anode: 0 });
    setVoltage(0);
  };

  const canTakeQuiz = experimentsRun >= 2;

  const cathodeBubbles = useMemo(() => bubblesFor(bubbleCount.cathode, voltage + 1), [bubbleCount.cathode, voltage]);
  const anodeBubbles = useMemo(() => bubblesFor(bubbleCount.anode, voltage + 9), [bubbleCount.anode, voltage]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}>
            <Bolt size={28} />
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
            <div className="vl-card-title">Electrolysis Cell</div>
            <div className="vl-card-subtitle">Select an electrolyte, set voltage, then start the circuit.</div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 240" role="img" aria-label="Electrolysis cell">
                {/* Power source */}
                <rect x="230" y="12" width="100" height="34" rx="8" fill="#37474F" />
                <text x="248" y="34" fill="#fff" fontSize="12" fontWeight="800">
                  DC Power
                </text>
                <text x="240" y="35" fill="#F44336" fontSize="18" fontWeight="900">
                  -
                </text>
                <text x="315" y="35" fill="#4CAF50" fontSize="18" fontWeight="900">
                  +
                </text>

                {/* Wires */}
                <path d="M 248 46 C 210 70 170 90 160 120" stroke="rgba(255,255,255,0.6)" strokeWidth="3" fill="none" />
                <path d="M 312 46 C 350 70 390 90 400 120" stroke="rgba(255,255,255,0.6)" strokeWidth="3" fill="none" />

                {/* Beaker */}
                <rect x="120" y="90" width="320" height="140" rx="14" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" />
                <rect x="132" y="104" width="296" height="114" rx="12" fill="rgba(10,14,33,0.22)" />

                {/* Electrolyte liquid */}
                <rect x="132" y="140" width="296" height="78" rx="12" fill="rgba(187, 222, 251, 0.25)" />

                {/* Electrodes */}
                <rect x="180" y="120" width="18" height="100" rx="4" fill="#90A4AE" />
                <rect x="362" y="120" width="18" height="100" rx="4" fill="#90A4AE" />
                <text x="188" y="116" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" fontWeight="800">
                  Cathode (-)
                </text>
                <text x="371" y="116" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" fontWeight="800">
                  Anode (+)
                </text>

                {/* Bubbles */}
                {running &&
                  cathodeBubbles.map((b, idx) => (
                    <circle
                      key={`cb-${idx}`}
                      cx={170 + b.x * 60}
                      cy={150 + b.y * 60}
                      r={b.r}
                      fill="rgba(255,255,255,0.8)"
                      stroke="rgba(255,255,255,0.25)"
                    />
                  ))}
                {running &&
                  anodeBubbles.map((b, idx) => (
                    <circle
                      key={`ab-${idx}`}
                      cx={350 + b.x * 60}
                      cy={150 + b.y * 60}
                      r={b.r}
                      fill="rgba(255,255,255,0.8)"
                      stroke="rgba(255,255,255,0.25)"
                    />
                  ))}

                {/* Deposits */}
                {running && selectedElectrolyte.id === 'cuso4' && (
                  <rect x="178" y="172" width="22" height="44" rx="6" fill={selectedElectrolyte.cathodeColor} opacity="0.85" />
                )}
                {running && selectedElectrolyte.id === 'nacl' && (
                  <rect x="360" y="172" width="22" height="44" rx="6" fill={selectedElectrolyte.anodeColor} opacity="0.65" />
                )}
              </svg>
            </div>

            <div className="vl-card-subtitle" style={{ marginTop: 12 }}>
              Bubble count: cathode <strong>{bubbleCount.cathode}</strong>, anode <strong>{bubbleCount.anode}</strong>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Electrolyte</div>
            <div className="vl-card-subtitle">Different electrolytes give different products.</div>
            <div className="vl-template-list">
              {ELECTROLYTES.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={`vl-template-btn ${selectedElectrolyte.id === e.id ? 'active' : ''}`}
                  onClick={() => {
                    if (running) return;
                    setSelectedElectrolyte(e);
                    reset();
                  }}
                  disabled={running}
                >
                  <div className="vl-template-title">
                    <span className="vl-dot" style={{ background: e.id === 'cuso4' ? '#FF9800' : '#2196F3' }} aria-hidden="true" />
                    {e.name}
                    <span className="vl-pill-mini">{e.formula}</span>
                  </div>
                  <div className="vl-template-desc">
                    Cathode: {e.cathodeProduct}
                    <br />
                    Anode: {e.anodeProduct}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Voltage</div>
            <div className="vl-card-subtitle">
              Voltage controls how fast electrolysis happens. Voltage: <strong>{voltage}V</strong>
            </div>
            <input
              className="vl-range"
              type="range"
              min={0}
              max={12}
              step={1}
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              disabled={running}
            />

            <div className="vl-row" style={{ marginTop: 10 }}>
              <button type="button" className="vl-btn primary" onClick={startStop} disabled={voltage === 0 && !running}>
                {running ? (
                  <>
                    <Square size={16} /> Stop
                  </>
                ) : (
                  <>
                    <Play size={16} /> Start
                  </>
                )}
              </button>
              <button type="button" className="vl-btn secondary" onClick={reset}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Electrode Products</div>
            <div className="vl-card-subtitle">Cathode: reduction, Anode: oxidation.</div>
            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Cathode (-)</div>
                <div className="vl-stat-value ok">{selectedElectrolyte.cathodeProduct}</div>
                <div className="vl-template-desc">{selectedElectrolyte.cathodeHalfEq}</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Anode (+)</div>
                <div className="vl-stat-value">{selectedElectrolyte.anodeProduct}</div>
                <div className="vl-template-desc">{selectedElectrolyte.anodeHalfEq}</div>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Remember</div>
            <ul className="vl-bullets">
              <li>Cations (+) go to the cathode (-).</li>
              <li>Anions (-) go to the anode (+).</li>
              <li>Cathode: reduction (gain e-).</li>
              <li>Anode: oxidation (lose e-).</li>
            </ul>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Run at least 2 experiments. Progress: {Math.min(experimentsRun, 2)} / 2.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Run more experiments'}
            </button>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

