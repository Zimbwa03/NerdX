import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Pause, Play, RefreshCw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type GraphType = 'distance-time' | 'velocity-time';

type DataPoint = {
  x: number;
  y: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pathDistance(data: DataPoint[], w: number, h: number): string {
  if (!data.length) return '';
  const xScale = w / 10;
  const yScale = h / 100;
  return data
    .map((p, i) => {
      const x = p.x * xScale;
      const y = h - clamp(p.y, 0, 100) * yScale;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function pathVelocity(data: DataPoint[], w: number, h: number): string {
  if (!data.length) return '';
  const xScale = w / 10;
  const yMin = -5;
  const yMax = 5;
  const yScale = h / (yMax - yMin);
  return data
    .map((p, i) => {
      const x = p.x * xScale;
      const y = h - (p.y - yMin) * yScale;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export function MotionGrapherLab({ simulation }: { simulation: SimulationMetadata }) {
  const [graphType, setGraphType] = useState<GraphType>('distance-time');
  const [velocity, setVelocity] = useState(0); // -5..5
  const [distance, setDistance] = useState(0); // 0..100
  const [time, setTime] = useState(0); // 0..10
  const [running, setRunning] = useState(false);
  const [distanceData, setDistanceData] = useState<DataPoint[]>([{ x: 0, y: 0 }]);
  const [velocityData, setVelocityData] = useState<DataPoint[]>([{ x: 0, y: 0 }]);
  const [experimentsRun, setExperimentsRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running || time >= 10) return () => undefined;
    intervalRef.current = window.setInterval(() => {
      setTime((prevTime) => {
        const nextTime = clamp(prevTime + 0.5, 0, 10);
        setDistance((prevDistance) => {
          const nextDistance = clamp(prevDistance + velocity * 0.5, 0, 100);
          setDistanceData((prev) => [...prev, { x: nextTime, y: nextDistance }]);
          setVelocityData((prev) => [...prev, { x: nextTime, y: velocity }]);
          return nextDistance;
        });
        if (nextTime >= 10) setRunning(false);
        return nextTime;
      });
    }, 500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running, time, velocity]);

  const reset = () => {
    setRunning(false);
    setTime(0);
    setDistance(0);
    setVelocity(0);
    setDistanceData([{ x: 0, y: 0 }]);
    setVelocityData([{ x: 0, y: 0 }]);
    setExperimentsRun((p) => clamp(p + 1, 0, 5));
  };

  const canTakeQuiz = experimentsRun >= 2;

  const w = 520;
  const h = 180;

  const dPath = useMemo(() => pathDistance(distanceData, w, h), [distanceData]);
  const vPath = useMemo(() => pathVelocity(velocityData, w, h), [velocityData]);

  const graphColor = graphType === 'distance-time' ? '#2196F3' : '#4CAF50';
  const trackPos = useMemo(() => 30 + (distance / 100) * 500, [distance]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #3F51B5, #1A237E)' }}>
            <BarChart3 size={28} />
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
            <div className="vl-card-title">Motion Track</div>
            <div className="vl-card-subtitle">Set a velocity, then play to generate distance-time and velocity-time graphs.</div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 120" role="img" aria-label="Track">
                <rect x="30" y="60" width="500" height="16" rx="8" fill="#455A64" opacity="0.9" />
                <text x="30" y="54" fill="rgba(255,255,255,0.75)" fontSize="11" fontWeight="800">
                  0 m
                </text>
                <text x="530" y="54" textAnchor="end" fill="rgba(255,255,255,0.75)" fontSize="11" fontWeight="800">
                  100 m
                </text>
                <circle cx={trackPos} cy="68" r="14" fill={graphColor} stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
                <text x={trackPos} y="72" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900">
                  •
                </text>
              </svg>
            </div>

            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Time</div>
                <div className="vl-stat-value ok">{time.toFixed(1)} s</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Distance</div>
                <div className="vl-stat-value">{distance.toFixed(1)} m</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Velocity</div>
                <div className="vl-stat-value">{velocity.toFixed(1)} m/s</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Runs</div>
                <div className="vl-stat-value">{experimentsRun}</div>
              </div>
            </div>

            <div className="vl-row" style={{ marginTop: 12 }}>
              <div className="vl-row" style={{ gap: 10, marginTop: 0 }}>
                <button type="button" className="vl-btn secondary" onClick={() => setVelocity((p) => clamp(p - 1, -5, 5))} disabled={running}>
                  -1 m/s
                </button>
                <button type="button" className="vl-btn secondary" onClick={() => setVelocity((p) => clamp(p + 1, -5, 5))} disabled={running}>
                  +1 m/s
                </button>
              </div>

              <div className="vl-row" style={{ gap: 10, marginTop: 0 }}>
                <button type="button" className="vl-btn primary" onClick={() => setRunning((p) => !p)} disabled={time >= 10}>
                  {running ? (
                    <>
                      <Pause size={16} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Play
                    </>
                  )}
                </button>
                <button type="button" className="vl-btn secondary" onClick={reset}>
                  <RefreshCw size={16} /> Reset
                </button>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Graph Type</div>
            <div className="vl-tab-row" role="tablist" aria-label="Graph type">
              <button type="button" className={`vl-tab ${graphType === 'distance-time' ? 'active' : ''}`} onClick={() => setGraphType('distance-time')}>
                Distance-Time
              </button>
              <button type="button" className={`vl-tab ${graphType === 'velocity-time' ? 'active' : ''}`} onClick={() => setGraphType('velocity-time')}>
                Velocity-Time
              </button>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">{graphType === 'distance-time' ? 'Distance-Time Graph' : 'Velocity-Time Graph'}</div>
            <div className="vl-card-subtitle">
              {graphType === 'distance-time' ? 'Gradient gives speed.' : 'Area under the graph gives distance.'}
            </div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Graph">
                {/* Grid */}
                {Array.from({ length: 6 }, (_, i) => (
                  <line key={`gx-${i}`} x1={(i * w) / 5} y1="0" x2={(i * w) / 5} y2={h} stroke="rgba(255,255,255,0.08)" />
                ))}
                {Array.from({ length: 6 }, (_, i) => (
                  <line key={`gy-${i}`} x1="0" y1={(i * h) / 5} x2={w} y2={(i * h) / 5} stroke="rgba(255,255,255,0.08)" />
                ))}

                {graphType === 'velocity-time' && (
                  <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                )}

                <path d={graphType === 'distance-time' ? dPath : vPath} stroke={graphColor} strokeWidth="4" fill="none" />
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Reset and run at least 2 experiments. Progress: {Math.min(experimentsRun, 2)} / 2.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Do more runs'}
            </button>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

