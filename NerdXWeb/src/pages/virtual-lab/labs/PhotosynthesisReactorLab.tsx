import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Play, Sparkles, Square } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function PhotosynthesisReactorLab({ simulation }: { simulation: SimulationMetadata }) {
  const [lightIntensity, setLightIntensity] = useState(50); // 0-100
  const [co2Level, setCo2Level] = useState(50); // 0-100
  const [temperature, setTemperature] = useState(25); // 10-45
  const [bubbleCount, setBubbleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [experimentsRun, setExperimentsRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const bubbleRate = useMemo(() => {
    const lightFactor = lightIntensity / 100;
    const co2Factor = co2Level / 100;
    const tempFactor = temperature <= 30 ? temperature / 30 : Math.max(0, 1 - (temperature - 30) / 15);
    const limiting = Math.min(lightFactor, co2Factor, tempFactor);
    return Math.round(limiting * 30);
  }, [co2Level, lightIntensity, temperature]);

  const limitingFactor = useMemo(() => {
    const lightFactor = lightIntensity / 100;
    const co2Factor = co2Level / 100;
    const tempFactor = temperature <= 30 ? temperature / 30 : Math.max(0, 1 - (temperature - 30) / 15);
    if (lightFactor <= co2Factor && lightFactor <= tempFactor) return 'Light intensity';
    if (co2Factor <= lightFactor && co2Factor <= tempFactor) return 'CO2 concentration';
    return 'Temperature';
  }, [co2Level, lightIntensity, temperature]);

  useEffect(() => {
    if (!running) return () => undefined;
    intervalRef.current = window.setInterval(() => {
      setBubbleCount((prev) => prev + bubbleRate);
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [bubbleRate, running]);

  const startStop = () => {
    if (!running) {
      setBubbleCount(0);
      setExperimentsRun((p) => clamp(p + 1, 0, 5));
    }
    setRunning((p) => !p);
  };

  const canTakeQuiz = experimentsRun >= 3;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
            <Leaf size={28} />
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
            <div className="vl-card-title">Setup</div>
            <div className="vl-card-subtitle">
              Adjust light, CO2 and temperature. Start counting bubbles to estimate photosynthesis rate.
            </div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 520 240" role="img" aria-label="Photosynthesis setup">
                <defs>
                  <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(187, 222, 251, 0.65)" />
                    <stop offset="100%" stopColor="rgba(33, 150, 243, 0.15)" />
                  </linearGradient>
                </defs>

                {/* Light */}
                <g transform="translate(235, 10)">
                  <ellipse cx="30" cy="20" rx="28" ry="16" fill={`rgba(255, 235, 59, ${lightIntensity / 100})`} />
                  <circle cx="30" cy="20" r="10" fill="#FFEB3B" />
                  {lightIntensity > 30 && (
                    <>
                      <line x1="30" y1="40" x2="30" y2="58" stroke="#FFC107" strokeWidth="3" />
                      <line x1="12" y1="36" x2="0" y2="52" stroke="#FFC107" strokeWidth="3" />
                      <line x1="48" y1="36" x2="60" y2="52" stroke="#FFC107" strokeWidth="3" />
                    </>
                  )}
                </g>

                {/* Beaker */}
                <g transform="translate(175, 70)">
                  <rect x="0" y="0" width="170" height="150" rx="14" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.35)" />
                  <rect x="10" y="18" width="150" height="122" rx="12" fill="url(#water)" />

                  {/* Pondweed */}
                  <path d="M 86 140 Q 76 110 86 80 Q 98 56 84 28" stroke="#4CAF50" strokeWidth="6" fill="none" />
                  <ellipse cx="82" cy="40" rx="10" ry="6" fill="#66BB6A" />
                  <ellipse cx="92" cy="58" rx="10" ry="6" fill="#66BB6A" />
                  <ellipse cx="78" cy="76" rx="10" ry="6" fill="#66BB6A" />

                  {/* Bubbles */}
                  {running &&
                    Array.from({ length: Math.min(18, Math.max(3, Math.floor(bubbleRate / 2))) }).map((_, i) => (
                      <circle
                        key={`b-${i}`}
                        cx={40 + ((i * 17) % 90)}
                        cy={120 - ((i * 23) % 90)}
                        r={3 + (i % 3)}
                        fill="rgba(255,255,255,0.8)"
                      />
                    ))}
                </g>
              </svg>
            </div>

            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Bubble rate (approx)</div>
                <div className="vl-stat-value ok">{bubbleRate} bubbles/s</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Limiting factor</div>
                <div className="vl-stat-value">{limitingFactor}</div>
              </div>
            </div>

            <div className="vl-controls" style={{ marginTop: 12 }}>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Light intensity</span>
                  <span className="vl-control-value">{lightIntensity}%</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  disabled={running}
                />
              </div>

              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">CO2 concentration</span>
                  <span className="vl-control-value">{co2Level}%</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={co2Level}
                  onChange={(e) => setCo2Level(Number(e.target.value))}
                  disabled={running}
                />
              </div>

              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Temperature</span>
                  <span className="vl-control-value">{temperature} C</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={10}
                  max={45}
                  step={1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  disabled={running}
                />
              </div>
            </div>

            <div className="vl-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-btn primary ${running ? 'danger' : ''}`} onClick={startStop}>
                {running ? (
                  <>
                    <Square size={16} /> Stop
                  </>
                ) : (
                  <>
                    <Play size={16} /> Start counting
                  </>
                )}
              </button>
              <div className="vl-card-subtitle" style={{ margin: 0 }}>
                Bubble count: <strong>{bubbleCount}</strong>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Equation</div>
            <div className="vl-card-subtitle">
              6CO2 + 6H2O -&gt; C6H12O6 + 6O2 (light + chlorophyll)
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Run at least 3 experiments. Progress: {Math.min(experimentsRun, 3)} / 3.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Run more experiments'}
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

