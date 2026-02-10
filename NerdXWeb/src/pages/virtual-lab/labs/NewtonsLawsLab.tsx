import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gauge, RefreshCw, Sparkles, Zap } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type Law = 1 | 2 | 3;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function NewtonsLawsLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedLaw, setSelectedLaw] = useState<Law>(1);
  const [lawsExplored, setLawsExplored] = useState<Set<Law>>(() => new Set([1]));
  const [quizOpen, setQuizOpen] = useState(false);

  // Law 1: inertia + friction
  const [hasFriction, setHasFriction] = useState(true);
  const [moving, setMoving] = useState(false);
  const [motion, setMotion] = useState({ position: 0, velocity: 0 });

  // Law 2: F = ma
  const [force, setForce] = useState(10);
  const [mass, setMass] = useState(2);

  // Law 3: action-reaction
  const [pushStrength, setPushStrength] = useState(0);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!moving || selectedLaw !== 1) return () => undefined;
    intervalRef.current = window.setInterval(() => {
      setMotion((prev) => {
        const nextPosition = clamp(prev.position + prev.velocity, 0, 100);
        const nextVelocity = hasFriction ? Math.max(0, prev.velocity - 0.5) : prev.velocity;
        const shouldStop = nextPosition >= 100 || (hasFriction && nextVelocity <= 0);
        if (shouldStop) window.setTimeout(() => setMoving(false), 0);
        return { position: nextPosition, velocity: nextVelocity };
      });
    }, 120);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [hasFriction, moving, selectedLaw]);

  const acceleration = useMemo(() => (mass > 0 ? force / mass : 0), [force, mass]);

  const chooseLaw = (law: Law) => {
    setSelectedLaw(law);
    setLawsExplored((prev) => new Set([...prev, law]));
    setMoving(false);
    setMotion({ position: 0, velocity: 0 });
    setPushStrength(0);
  };

  const push = () => {
    setMotion({ position: 0, velocity: 5 });
    setMoving(true);
  };

  const reset = () => {
    setMoving(false);
    setMotion({ position: 0, velocity: 0 });
    setPushStrength(0);
  };

  const canTakeQuiz = lawsExplored.size >= 3;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #009688, #00695C)' }}>
            <Zap size={28} />
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
            <div className="vl-card-title">Choose a Law</div>
            <div className="vl-card-subtitle">Explore all three to unlock the knowledge check.</div>
            <div className="vl-tab-row" role="tablist" aria-label="Newton law">
              <button type="button" className={`vl-tab ${selectedLaw === 1 ? 'active' : ''}`} onClick={() => chooseLaw(1)}>
                Law 1 (Inertia)
              </button>
              <button type="button" className={`vl-tab ${selectedLaw === 2 ? 'active' : ''}`} onClick={() => chooseLaw(2)}>
                Law 2 (F = ma)
              </button>
              <button type="button" className={`vl-tab ${selectedLaw === 3 ? 'active' : ''}`} onClick={() => chooseLaw(3)}>
                Law 3 (Action-Reaction)
              </button>
            </div>

            <div className="vl-explanation" style={{ marginTop: 12 }}>
              Explored: <strong>{lawsExplored.size}</strong> / 3
            </div>
          </div>

          {selectedLaw === 1 && (
            <div className="vl-card">
              <div className="vl-card-title">Law 1: Inertia</div>
              <div className="vl-card-subtitle">An object stays at rest or moves at constant velocity unless a net force acts.</div>

              <div className="vl-row" style={{ marginTop: 8 }}>
                <button type="button" className={`vl-btn ${hasFriction ? 'primary' : 'secondary'}`} onClick={() => setHasFriction(true)} disabled={moving}>
                  Rough surface (friction)
                </button>
                <button type="button" className={`vl-btn ${!hasFriction ? 'primary' : 'secondary'}`} onClick={() => setHasFriction(false)} disabled={moving}>
                  Frictionless surface
                </button>
              </div>

              <div className="vl-canvas-wrap">
                <svg className="vl-sim-svg" viewBox="0 0 560 150" role="img" aria-label="Inertia track">
                  <rect x="30" y="90" width="500" height="18" rx="9" fill={hasFriction ? '#795548' : '#B3E5FC'} opacity="0.9" />
                  <text x="34" y="84" fill="rgba(255,255,255,0.75)" fontSize="11" fontWeight="800">
                    {hasFriction ? 'Rough surface' : 'Frictionless surface'}
                  </text>
                  <g transform={`translate(${30 + (motion.position / 100) * 460}, 58)`}>
                    <rect x="0" y="0" width="60" height="34" rx="8" fill="#3F51B5" />
                    <circle cx="16" cy="40" r="10" fill="#1A237E" />
                    <circle cx="44" cy="40" r="10" fill="#1A237E" />
                  </g>
                </svg>
              </div>

              <div className="vl-stats-grid">
                <div className="vl-stat">
                  <div className="vl-stat-label">Position</div>
                  <div className="vl-stat-value ok">{motion.position.toFixed(0)}%</div>
                </div>
                <div className="vl-stat">
                  <div className="vl-stat-label">Velocity</div>
                  <div className="vl-stat-value">{motion.velocity.toFixed(1)}</div>
                </div>
              </div>

              <div className="vl-row" style={{ marginTop: 12 }}>
                <button type="button" className="vl-btn primary" onClick={push} disabled={moving}>
                  Push
                </button>
                <button type="button" className="vl-btn secondary" onClick={reset}>
                  <RefreshCw size={16} /> Reset
                </button>
              </div>
            </div>
          )}

          {selectedLaw === 2 && (
            <div className="vl-card">
              <div className="vl-card-title">Law 2: F = ma</div>
              <div className="vl-card-subtitle">Acceleration increases with force and decreases with mass.</div>

              <div className="vl-controls" style={{ marginTop: 12 }}>
                <div>
                  <div className="vl-control-head">
                    <span className="vl-control-label">Force (N)</span>
                    <span className="vl-control-value">{force}</span>
                  </div>
                  <input className="vl-range" type="range" min={0} max={50} step={1} value={force} onChange={(e) => setForce(Number(e.target.value))} />
                </div>
                <div>
                  <div className="vl-control-head">
                    <span className="vl-control-label">Mass (kg)</span>
                    <span className="vl-control-value">{mass}</span>
                  </div>
                  <input className="vl-range" type="range" min={1} max={10} step={1} value={mass} onChange={(e) => setMass(Number(e.target.value))} />
                </div>
              </div>

              <div className="vl-canvas-wrap">
                <svg className="vl-sim-svg" viewBox="0 0 560 140" role="img" aria-label="Force and acceleration">
                  <text x="280" y="30" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="26" fontWeight="900">
                    F = m a
                  </text>
                  <text x="280" y="64" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="14" fontWeight="800">
                    a = F / m
                  </text>
                  <text x="280" y="110" textAnchor="middle" fill="#00E676" fontSize="20" fontWeight="900">
                    a = {acceleration.toFixed(2)} m/s^2
                  </text>
                </svg>
              </div>
            </div>
          )}

          {selectedLaw === 3 && (
            <div className="vl-card">
              <div className="vl-card-title">Law 3: Action-Reaction</div>
              <div className="vl-card-subtitle">If A pushes B, B pushes A with equal force in the opposite direction.</div>

              <div className="vl-controls" style={{ marginTop: 12 }}>
                <div>
                  <div className="vl-control-head">
                    <span className="vl-control-label">Push strength</span>
                    <span className="vl-control-value">{pushStrength}</span>
                  </div>
                  <input className="vl-range" type="range" min={0} max={100} step={1} value={pushStrength} onChange={(e) => setPushStrength(Number(e.target.value))} />
                </div>
              </div>

              <div className="vl-canvas-wrap">
                <svg className="vl-sim-svg" viewBox="0 0 560 180" role="img" aria-label="Action reaction diagram">
                  <rect x="0" y="120" width="560" height="16" rx="8" fill="rgba(255,255,255,0.08)" />
                  <circle cx="210" cy="100" r="26" fill="#2979FF" />
                  <circle cx="350" cy="100" r="26" fill="#FF5722" />

                  {/* Action arrow */}
                  <line x1="236" y1="100" x2={236 + pushStrength * 1.6} y2="100" stroke="#00E676" strokeWidth="6" />
                  <polygon
                    points={`${236 + pushStrength * 1.6},100 ${228 + pushStrength * 1.6},94 ${228 + pushStrength * 1.6},106`}
                    fill="#00E676"
                  />
                  <text x="280" y="80" textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="12" fontWeight="800">
                    Action
                  </text>

                  {/* Reaction arrow */}
                  <line x1="324" y1="100" x2={324 - pushStrength * 1.6} y2="100" stroke="#FF9800" strokeWidth="6" />
                  <polygon
                    points={`${324 - pushStrength * 1.6},100 ${332 - pushStrength * 1.6},94 ${332 - pushStrength * 1.6},106`}
                    fill="#FF9800"
                  />
                  <text x="280" y="148" textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="12" fontWeight="800">
                    Reaction
                  </text>
                </svg>
              </div>

              <div className="vl-explanation ok" style={{ marginTop: 12 }}>
                The forces are equal in size ({pushStrength}) and opposite in direction.
              </div>
            </div>
          )}
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Reset</div>
            <div className="vl-card-subtitle">Reset the current experiment without losing explored progress.</div>
            <button type="button" className="vl-btn secondary" onClick={reset}>
              <RefreshCw size={16} /> Reset
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Explore all 3 laws. Progress: {lawsExplored.size} / 3.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Explore all laws'}
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Tip</div>
            <div className="vl-card-subtitle">
              <div className="vl-row" style={{ gap: 10 }}>
                <Gauge size={18} /> Use the sliders to see how variables change: higher mass means smaller acceleration for the same force.
              </div>
            </div>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

