import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame, Sparkles, Thermometer, ThermometerSun } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type MaterialState = 'solid' | 'liquid' | 'gas';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function expansionFactor(temp: number, state: MaterialState): number {
  const base = 20;
  const d = temp - base;
  if (state === 'solid') return 1 + d * 0.001;
  if (state === 'liquid') return 1 + d * 0.003;
  return 1 + d * 0.01;
}

function seededPoints(seed: number, count: number): Array<{ x: number; y: number }> {
  let t = seed >>> 0;
  const next = () => {
    t ^= t << 13;
    t ^= t >>> 17;
    t ^= t << 5;
    return (t >>> 0) / 4294967296;
  };
  return Array.from({ length: count }).map(() => ({ x: next(), y: next() }));
}

export function ThermalExpansionLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedState, setSelectedState] = useState<MaterialState>('solid');
  const [temperature, setTemperature] = useState(20);
  const [experimentsRun, setExperimentsRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const expansion = useMemo(() => expansionFactor(temperature, selectedState), [selectedState, temperature]);
  const expansionPercent = useMemo(() => ((expansion - 1) * 100).toFixed(2), [expansion]);

  const ballRadius = 25 * expansion;
  const ringRadius = 27;
  const ballFits = ballRadius < ringRadius;
  const liquidHeight = clamp(60 + temperature * 0.8, 30, 140);

  const gasParticles = useMemo(() => {
    const base = seededPoints(temperature + 101, 24);
    const spread = clamp((temperature / 100) * 0.35, 0, 0.35);
    return base.map((p, i) => ({
      x: clamp(p.x + (i % 3 === 0 ? spread : -spread) * 0.6, 0.05, 0.95),
      y: clamp(p.y + (i % 4 === 0 ? spread : -spread) * 0.6, 0.05, 0.95),
    }));
  }, [temperature]);

  const recordObservation = () => setExperimentsRun((p) => clamp(p + 1, 0, 4));
  const canTakeQuiz = experimentsRun >= 2;

  const keyPoint =
    selectedState === 'solid'
      ? 'Solids expand the least because particles are tightly packed and can only vibrate in place.'
      : selectedState === 'liquid'
        ? 'Liquids expand more than solids as particles have more freedom to move apart.'
        : 'Gases expand the most because particles are free to move and spread out significantly.';

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF5722, #F44336)' }}>
            <ThermometerSun size={28} />
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
            <div className="vl-card-title">State of Matter</div>
            <div className="vl-card-subtitle">Pick a state, then heat/cool to observe expansion.</div>
            <div className="vl-tab-row" role="tablist" aria-label="Material state">
              <button type="button" className={`vl-tab ${selectedState === 'solid' ? 'active' : ''}`} onClick={() => setSelectedState('solid')}>
                Solid
              </button>
              <button type="button" className={`vl-tab ${selectedState === 'liquid' ? 'active' : ''}`} onClick={() => setSelectedState('liquid')}>
                Liquid
              </button>
              <button type="button" className={`vl-tab ${selectedState === 'gas' ? 'active' : ''}`} onClick={() => setSelectedState('gas')}>
                Gas
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Experiment</div>
            <div className="vl-card-subtitle">
              Expansion: <strong>{expansionPercent}%</strong>
            </div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 240" role="img" aria-label="Expansion experiment">
                {selectedState === 'solid' && (
                  <g>
                    <text x="280" y="30" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="800">
                      Ball and Ring
                    </text>
                    <rect x="270" y="190" width="20" height="40" fill="#795548" />
                    <rect x="220" y="228" width="120" height="8" fill="#795548" />

                    <circle cx="280" cy="130" r={ringRadius} fill="transparent" stroke="#607D8B" strokeWidth="6" />
                    <circle cx="280" cy="130" r={ringRadius - 4} fill="transparent" stroke="#607D8B" strokeWidth="2" />

                    <circle
                      cx="280"
                      cy="88"
                      r={ballRadius}
                      fill={temperature > 50 ? '#F44336' : temperature > 30 ? '#FF9800' : '#2196F3'}
                    />

                    <text x="280" y="176" textAnchor="middle" fill={ballFits ? '#00E676' : '#FF1744'} fontSize="12" fontWeight="900">
                      {ballFits ? 'Fits through ring' : 'Does not fit'}
                    </text>
                  </g>
                )}

                {selectedState === 'liquid' && (
                  <g>
                    <text x="280" y="30" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="800">
                      Thermometer
                    </text>
                    <rect x="260" y="50" width="40" height="150" rx="20" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" />
                    <rect x="273" y={200 - liquidHeight} width="14" height={liquidHeight} rx="7" fill={temperature > 60 ? '#F44336' : '#FF9800'} />
                    <circle cx="280" cy="200" r="22" fill={temperature > 60 ? '#F44336' : '#FF9800'} opacity="0.9" />
                    <text x="320" y="110" fill="rgba(255,255,255,0.85)" fontSize="12" fontWeight="800">
                      {temperature} C
                    </text>
                  </g>
                )}

                {selectedState === 'gas' && (
                  <g>
                    <text x="280" y="30" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="800">
                      Gas Particles
                    </text>
                    <rect x="140" y="50" width="280" height="160" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" />
                    {gasParticles.map((p, idx) => (
                      <circle
                        key={`gp-${idx}`}
                        cx={140 + p.x * 280}
                        cy={50 + p.y * 160}
                        r={4 + (idx % 3)}
                        fill={temperature > 60 ? '#FF5722' : '#00BCD4'}
                        opacity="0.85"
                      />
                    ))}
                    <text x="280" y="226" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="800">
                      Hotter = particles move faster and spread out
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Temperature</div>
            <div className="vl-card-subtitle">
              <Thermometer size={16} /> {temperature} C
            </div>
            <input className="vl-range" type="range" min={0} max={100} step={1} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
            <div className="vl-row" style={{ marginTop: 10 }}>
              <div className="vl-badge ok">
                <Flame size={16} /> Expansion: {expansionPercent}%
              </div>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Key Point</div>
            <div className="vl-explanation ok" style={{ marginTop: 10 }}>
              {keyPoint}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Record Observation</div>
            <div className="vl-card-subtitle">Record at least 2 observations to unlock the knowledge check.</div>
            <div className="vl-row">
              <button type="button" className="vl-btn secondary" onClick={recordObservation}>
                Record ({experimentsRun}/4)
              </button>
              <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
                <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Record ${2 - experimentsRun} more`}
              </button>
            </div>
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

