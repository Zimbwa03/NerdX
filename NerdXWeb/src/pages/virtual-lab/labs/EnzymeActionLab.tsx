import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, Droplets, Sparkles, ThermometerSun } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function iodineColor(starchRemaining: number): string {
  if (starchRemaining > 80) return '#1A237E';
  if (starchRemaining > 60) return '#283593';
  if (starchRemaining > 40) return '#3949AB';
  if (starchRemaining > 20) return '#5C6BC0';
  return '#795548';
}

export function EnzymeActionLab({ simulation }: { simulation: SimulationMetadata }) {
  const [temperature, setTemperature] = useState(37);
  const [ph, setPh] = useState(7);
  const [running, setRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [starchRemaining, setStarchRemaining] = useState(100);
  const [experimentsRun, setExperimentsRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const activity = useMemo(() => {
    const tempOptimum = 37;
    const phOptimum = 7;

    const tempFactor = temperature > 60 ? 0 : Math.exp(-Math.pow(temperature - tempOptimum, 2) / 200);
    const phFactor = Math.exp(-Math.pow(ph - phOptimum, 2) / 8);
    return tempFactor * phFactor * 10;
  }, [ph, temperature]);

  const denatured = temperature > 60;

  useEffect(() => {
    if (!running) return () => undefined;
    intervalRef.current = window.setInterval(() => {
      setTimeElapsed((p) => p + 1);
      setStarchRemaining((p) => clamp(p - activity, 0, 100));
    }, 500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [activity, running]);

  const startStop = () => {
    if (!running) {
      setTimeElapsed(0);
      setStarchRemaining(100);
      setExperimentsRun((p) => clamp(p + 1, 0, 5));
    }
    setRunning((p) => !p);
  };

  const reset = () => {
    setRunning(false);
    setTimeElapsed(0);
    setStarchRemaining(100);
  };

  const canTakeQuiz = experimentsRun >= 3;

  const graphPath = useMemo(() => {
    const width = 480;
    const height = 140;
    const pts: Array<{ x: number; y: number }> = [];
    for (let t = 0; t <= 80; t += 4) {
      const tempFactor = t > 60 ? 0 : Math.exp(-Math.pow(t - 37, 2) / 200);
      const x = (t / 80) * width;
      const y = height - tempFactor * height;
      pts.push({ x, y });
    }
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, []);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)' }}>
            <Activity size={28} />
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
            <div className="vl-card-title">Controls</div>
            <div className="vl-card-subtitle">Adjust conditions, then start the reaction and watch starch disappear.</div>

            <div className="vl-controls" style={{ marginTop: 12 }}>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Temperature</span>
                  <span className="vl-control-value">{temperature} C</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={0}
                  max={80}
                  step={1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  disabled={running}
                />
              </div>

              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">pH</span>
                  <span className="vl-control-value">{ph}</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={1}
                  max={14}
                  step={1}
                  value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  disabled={running}
                />
              </div>
            </div>

            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Enzyme activity</div>
                <div className={`vl-stat-value ${denatured ? '' : 'ok'}`}>{denatured ? '0 (denatured)' : activity.toFixed(1)}</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Starch remaining</div>
                <div className="vl-stat-value">{Math.round(starchRemaining)}%</div>
              </div>
            </div>

            {denatured && (
              <div className="vl-explanation bad">
                <strong>Denaturation:</strong> At high temperatures the enzyme loses its shape, so activity drops to zero.
              </div>
            )}

            <div className="vl-row" style={{ marginTop: 12 }}>
              <button type="button" className="vl-btn primary" onClick={startStop}>
                {running ? (
                  <>
                    <ThermometerSun size={16} /> Stop
                  </>
                ) : (
                  <>
                    <ThermometerSun size={16} /> Start
                  </>
                )}
              </button>
              <button type="button" className="vl-btn secondary" onClick={reset}>
                Reset
              </button>
              <div className="vl-card-subtitle" style={{ margin: 0 }}>
                Time: <strong>{timeElapsed}</strong> steps
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Iodine Test Tube</div>
            <div className="vl-card-subtitle">Iodine turns blue-black when starch is present.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 420 220" role="img" aria-label="Test tube">
                <defs>
                  <linearGradient id="tubeGlass" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
                  </linearGradient>
                </defs>
                <rect x="170" y="20" width="80" height="170" rx="40" fill="url(#tubeGlass)" stroke="rgba(255,255,255,0.35)" />
                <rect x="182" y="60" width="56" height="118" rx="28" fill={iodineColor(starchRemaining)} opacity="0.85" />
                <circle cx="210" cy="178" r="26" fill={iodineColor(starchRemaining)} opacity="0.85" />
                <text x="210" y="210" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" fontWeight="700">
                  {starchRemaining > 20 ? 'Starch present' : 'No starch'}
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Temperature vs Activity</div>
            <div className="vl-card-subtitle">Most enzymes have an optimum temperature before denaturing.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 520 200" role="img" aria-label="Activity graph">
                <line x1="30" y1="160" x2="510" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <line x1="30" y1="20" x2="30" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <path d={graphPath} transform="translate(30,20)" stroke="#00E676" strokeWidth="4" fill="none" />

                {/* Optimum marker */}
                <line x1={30 + (37 / 80) * 480} y1="20" x2={30 + (37 / 80) * 480} y2="160" stroke="rgba(255,152,0,0.8)" strokeWidth="2" />
                <text x={30 + (37 / 80) * 480} y="16" textAnchor="middle" fill="rgba(255,152,0,0.9)" fontSize="11" fontWeight="800">
                  Optimum
                </text>

                {/* Current temperature marker */}
                <circle cx={30 + (temperature / 80) * 480} cy="160" r="6" fill="#7C4DFF" />
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Quick Notes</div>
            <div className="vl-card-subtitle">
              <div className="vl-row" style={{ gap: 10 }}>
                <Droplets size={18} /> pH affects enzyme shape; temperature affects kinetic energy and denaturation.
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Run at least 3 experiments. Progress: {Math.min(experimentsRun, 3)} / 3.</div>
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

