import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Sparkles, Square, Wind } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function TranspirationTrackerLab({ simulation }: { simulation: SimulationMetadata }) {
  const [temperature, setTemperature] = useState(25); // 15-40
  const [windSpeed, setWindSpeed] = useState(0); // 0-10
  const [humidity, setHumidity] = useState(50); // 0-100
  const [lightIntensity, setLightIntensity] = useState(50); // 0-100

  const [bubblePosition, setBubblePosition] = useState(0); // 0-100
  const [running, setRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [experimentsRun, setExperimentsRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const rate = useMemo(() => {
    let r = 1;
    r *= 1 + (temperature - 20) * 0.05;
    r *= 1 + windSpeed * 0.1;
    r *= 1 - humidity * 0.008;
    r *= 0.2 + lightIntensity * 0.008;
    return clamp(r, 0.1, 5);
  }, [humidity, lightIntensity, temperature, windSpeed]);

  useEffect(() => {
    if (!running) return () => undefined;
    if (bubblePosition >= 100) return () => undefined;
    intervalRef.current = window.setInterval(() => {
      setTimeElapsed((p) => p + 1);
      setBubblePosition((p) => clamp(p + rate, 0, 100));
    }, 500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [bubblePosition, rate, running]);

  const startStop = () => {
    if (!running) {
      setBubblePosition(0);
      setTimeElapsed(0);
      setExperimentsRun((p) => clamp(p + 1, 0, 5));
    }
    setRunning((p) => !p);
  };

  const reset = () => {
    setRunning(false);
    setBubblePosition(0);
    setTimeElapsed(0);
  };

  const waterUptake = (bubblePosition * 0.1).toFixed(1);
  const transpirationRate =
    timeElapsed > 0 ? (((bubblePosition * 0.1) / (timeElapsed * 0.5)) * 60).toFixed(2) : '0.00';

  const canTakeQuiz = experimentsRun >= 3;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #00BCD4, #0288D1)' }}>
            <Wind size={28} />
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
            <div className="vl-card-title">Potometer</div>
            <div className="vl-card-subtitle">Bubble movement shows water uptake (linked to transpiration rate).</div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 200" role="img" aria-label="Potometer">
                {/* Capillary tube */}
                <rect x="40" y="92" width="480" height="16" rx="8" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.26)" />
                <rect x="44" y="96" width="472" height="8" rx="4" fill="rgba(10,14,33,0.22)" />

                {/* Bubble */}
                <circle cx={48 + (bubblePosition / 100) * 464} cy="100" r="10" fill="#FFEB3B" stroke="rgba(255,255,255,0.35)" />

                {/* Plant shoot */}
                <path d="M 520 100 C 535 90, 545 70, 540 55" stroke="#4CAF50" strokeWidth="6" fill="none" />
                <ellipse cx="538" cy="56" rx="12" ry="7" fill="#66BB6A" />

                {/* Simple environment indicators */}
                {windSpeed > 0 && (
                  <g transform="translate(70, 35)" opacity={Math.min(1, windSpeed / 10)}>
                    <path d="M 0 0 Q 18 6 34 0" stroke="#B0BEC5" strokeWidth="3" fill="none" />
                    <path d="M 10 18 Q 28 24 44 18" stroke="#B0BEC5" strokeWidth="3" fill="none" />
                  </g>
                )}
                {lightIntensity > 40 && (
                  <g transform="translate(452, 16)" opacity={Math.min(1, lightIntensity / 100)}>
                    <circle cx="18" cy="18" r="10" fill="#FFEB3B" />
                    <line x1="18" y1="0" x2="18" y2="10" stroke="#FFC107" strokeWidth="2" />
                    <line x1="18" y1="26" x2="18" y2="36" stroke="#FFC107" strokeWidth="2" />
                    <line x1="0" y1="18" x2="10" y2="18" stroke="#FFC107" strokeWidth="2" />
                    <line x1="26" y1="18" x2="36" y2="18" stroke="#FFC107" strokeWidth="2" />
                  </g>
                )}
              </svg>
            </div>

            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Water uptake</div>
                <div className="vl-stat-value ok">{waterUptake} mm^3</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Rate (calc)</div>
                <div className="vl-stat-value">{transpirationRate} mm^3/min</div>
              </div>
            </div>

            <div className="vl-explanation" style={{ marginTop: 12 }}>
              Current transpiration factor: <strong>{rate.toFixed(2)}x</strong>
            </div>

            <div className="vl-row" style={{ marginTop: 12 }}>
              <button type="button" className="vl-btn primary" onClick={startStop}>
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
                Reset
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Environment</div>
            <div className="vl-card-subtitle">Change conditions to see how transpiration responds.</div>

            <div className="vl-controls" style={{ marginTop: 12 }}>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Temperature</span>
                  <span className="vl-control-value">{temperature} C</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={15}
                  max={40}
                  step={1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  disabled={running}
                />
              </div>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Wind</span>
                  <span className="vl-control-value">{windSpeed}</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  disabled={running}
                />
              </div>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Humidity</span>
                  <span className="vl-control-value">{humidity}%</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  disabled={running}
                />
              </div>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Light</span>
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

