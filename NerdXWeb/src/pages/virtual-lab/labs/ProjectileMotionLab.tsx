import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gauge, Play, RotateCcw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type TrajectoryPoint = { x: number; y: number; t: number };

const CANVAS_W = 360;
const CANVAS_H = 250;
const GROUND_Y = CANVAS_H - 30;
const LAUNCH_X = 40;
const LAUNCH_Y = GROUND_Y - 10;

export function ProjectileMotionLab({ simulation }: { simulation: SimulationMetadata }) {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(30);
  const [gravity, setGravity] = useState(10);
  const [isLaunched, setIsLaunched] = useState(false);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [pos, setPos] = useState({ x: LAUNCH_X, y: LAUNCH_Y });
  const [launches, setLaunches] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const rafRef = useRef<number | null>(null);
  const pointIndexRef = useRef(0);

  const angleRad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(angleRad);
  const vy = velocity * Math.sin(angleRad);
  const timeOfFlight = vy > 0 ? (2 * vy) / gravity : 0;
  const maxHeight = vy > 0 ? (vy * vy) / (2 * gravity) : 0;
  const range = vx * timeOfFlight;
  const scale = Math.min((CANVAS_W - 80) / (range || 1), (GROUND_Y - 50) / (maxHeight || 1)) * 0.8 || 1;

  const calculateTrajectory = (): TrajectoryPoint[] => {
    const points: TrajectoryPoint[] = [];
    const dt = 0.05;
    for (let t = 0; t <= timeOfFlight; t += dt) {
      const x = vx * t;
      const y = vy * t - 0.5 * gravity * t * t;
      if (y >= 0) {
        points.push({ x: LAUNCH_X + x * scale, y: LAUNCH_Y - y * scale, t });
      }
    }
    return points;
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const reset = () => {
    stop();
    setIsLaunched(false);
    setPos({ x: LAUNCH_X, y: LAUNCH_Y });
    setTrajectory([]);
    pointIndexRef.current = 0;
  };

  const launch = () => {
    if (isLaunched) return;
    setIsLaunched(true);
    const points = calculateTrajectory();
    setTrajectory(points);
    pointIndexRef.current = 0;

    const animate = () => {
      const idx = pointIndexRef.current;
      if (idx < points.length) {
        setPos({ x: points[idx].x, y: points[idx].y });
        pointIndexRef.current += 1;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      stop();
      setLaunches((v) => v + 1);
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => stop(), []);

  const canTakeQuiz = launches >= 3;

  const polyline = useMemo(() => trajectory.map((p) => `${p.x},${p.y}`).join(' '), [trajectory]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #1976D2, #00E676)' }}>
            <Gauge size={28} />
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
            <div className="vl-card-title">Controls</div>
            <div className="vl-card-subtitle">Adjust angle, velocity and gravity, then launch the projectile.</div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Angle: {angle}°</div>
              <input className="vl-range" type="range" min={5} max={85} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} disabled={isLaunched} />
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Velocity: {velocity} m/s</div>
              <input className="vl-range" type="range" min={5} max={60} step={1} value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} disabled={isLaunched} />
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Gravity: {gravity} m/s²</div>
              <input className="vl-range" type="range" min={5} max={20} step={1} value={gravity} onChange={(e) => setGravity(Number(e.target.value))} disabled={isLaunched} />
            </div>

            <div className="vl-row">
              <button type="button" className="vl-btn primary" onClick={launch} disabled={isLaunched}>
                <Play size={16} /> Launch
              </button>
              <button type="button" className="vl-btn secondary" onClick={reset}>
                <RotateCcw size={16} /> Reset
              </button>
              <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
                <Sparkles size={16} /> {canTakeQuiz ? 'Knowledge check' : `Launch 3 times (${launches}/3)`}
              </button>
            </div>

            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Time of flight</div>
                <div className="vl-stat-value">{timeOfFlight ? timeOfFlight.toFixed(2) : '0.00'}s</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Max height</div>
                <div className="vl-stat-value">{maxHeight ? maxHeight.toFixed(2) : '0.00'}m</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Range</div>
                <div className="vl-stat-value">{range ? range.toFixed(2) : '0.00'}m</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Launches</div>
                <div className="vl-stat-value">{launches}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Trajectory</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-label="Projectile motion canvas">
                <rect x="0" y="0" width={CANVAS_W} height={GROUND_Y} fill="rgba(25,118,210,0.08)" />

                {/* grid */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <g key={i}>
                    <line x1={((i + 1) * CANVAS_W) / 5} y1={0} x2={((i + 1) * CANVAS_W) / 5} y2={GROUND_Y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1={0} y1={(i * GROUND_Y) / 4} x2={CANVAS_W} y2={(i * GROUND_Y) / 4} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  </g>
                ))}

                {/* ground */}
                <rect x="0" y={GROUND_Y} width={CANVAS_W} height={30} fill="#8D6E63" />
                <line x1="0" y1={GROUND_Y} x2={CANVAS_W} y2={GROUND_Y} stroke="#5D4037" strokeWidth="2" />

                {/* launcher */}
                <g>
                  <rect x="20" y={LAUNCH_Y - 20} width="40" height="30" fill="#795548" />
                  <line x1={LAUNCH_X} y1={LAUNCH_Y} x2={LAUNCH_X + 40 * Math.cos(angleRad)} y2={LAUNCH_Y - 40 * Math.sin(angleRad)} stroke="#607D8B" strokeWidth="6" strokeLinecap="round" />
                  <text x={LAUNCH_X + 54} y={LAUNCH_Y - 6} fontSize="11" fill="rgba(255,255,255,0.7)">
                    {angle}°
                  </text>
                </g>

                {/* path */}
                {trajectory.length >= 2 && (
                  <polyline points={polyline} stroke="#00E676" strokeWidth="2" fill="none" strokeDasharray="6 4" />
                )}

                {/* projectile */}
                {isLaunched && <circle cx={pos.x} cy={pos.y} r="8" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="2" />}

                {/* marker */}
                {isLaunched && maxHeight > 0 && (
                  <g opacity="0.85">
                    <line x1={LAUNCH_X} y1={LAUNCH_Y - maxHeight * scale} x2={CANVAS_W - 20} y2={LAUNCH_Y - maxHeight * scale} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={CANVAS_W - 24} y={LAUNCH_Y - maxHeight * scale - 6} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.65)">
                      max height
                    </text>
                  </g>
                )}
              </svg>
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

