import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo, sampleFunction } from './graphing';

type FnKey = 'x2' | 'x3' | 'sin' | 'exp';

const FUNCTIONS: Record<
  FnKey,
  {
    label: string;
    f: (x: number) => number;
    df: (x: number) => number;
    bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  }
> = {
  x2: {
    label: 'f(x) = x^2',
    f: (x) => x * x,
    df: (x) => 2 * x,
    bounds: { xMin: -4, xMax: 4, yMin: -2, yMax: 16 },
  },
  x3: {
    label: 'f(x) = x^3',
    f: (x) => x * x * x,
    df: (x) => 3 * x * x,
    bounds: { xMin: -3, xMax: 3, yMin: -28, yMax: 28 },
  },
  sin: {
    label: 'f(x) = sin(x)',
    f: (x) => Math.sin(x),
    df: (x) => Math.cos(x),
    bounds: { xMin: -6.28, xMax: 6.28, yMin: -1.6, yMax: 1.6 },
  },
  exp: {
    label: 'f(x) = e^x',
    f: (x) => Math.exp(x),
    df: (x) => Math.exp(x),
    bounds: { xMin: -2, xMax: 2, yMin: -0.5, yMax: 8 },
  },
};

export function DifferentiationLab({ simulation }: { simulation: SimulationMetadata }) {
  const [fnKey, setFnKey] = useState<FnKey>('x2');
  const [x0, setX0] = useState(1);
  const [touched, setTouched] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const cfg = FUNCTIONS[fnKey];

  useEffect(() => {
    // Keep x0 inside the domain when switching functions.
    setX0((prev) => clamp(prev, cfg.bounds.xMin, cfg.bounds.xMax));
  }, [cfg.bounds.xMax, cfg.bounds.xMin]);

  const y0 = useMemo(() => cfg.f(x0), [cfg, x0]);
  const slope = useMemo(() => cfg.df(x0), [cfg, x0]);

  const fPoints = useMemo(() => sampleFunction(cfg.f, cfg.bounds.xMin, cfg.bounds.xMax, 260), [cfg]);
  const dfPoints = useMemo(() => sampleFunction(cfg.df, cfg.bounds.xMin, cfg.bounds.xMax, 260), [cfg]);

  const dfBounds = useMemo(() => {
    const ys = dfPoints.map((p) => p.y).filter((v) => Number.isFinite(v));
    if (!ys.length) return { xMin: cfg.bounds.xMin, xMax: cfg.bounds.xMax, yMin: -10, yMax: 10 };
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const span = Math.max(1, max - min);
    const pad = span * 0.15;
    return {
      xMin: cfg.bounds.xMin,
      xMax: cfg.bounds.xMax,
      yMin: min - pad,
      yMax: max + pad,
    };
  }, [cfg.bounds.xMax, cfg.bounds.xMin, dfPoints]);

  const tangent = useMemo(() => {
    const xLeft = cfg.bounds.xMin;
    const xRight = cfg.bounds.xMax;
    return {
      p1: { x: xLeft, y: y0 + slope * (xLeft - x0) },
      p2: { x: xRight, y: y0 + slope * (xRight - x0) },
    };
  }, [cfg.bounds.xMax, cfg.bounds.xMin, slope, x0, y0]);

  const canTakeQuiz = touched;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2979FF, #7C4DFF)' }}>
            <TrendingUp size={28} />
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
            <div className="vl-card-title">Choose a function</div>
            <div className="vl-editor-row">
              <select
                className="vl-select"
                value={fnKey}
                onChange={(e) => {
                  setFnKey(e.target.value as FnKey);
                  setTouched(true);
                }}
              >
                {Object.entries(FUNCTIONS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Move along the curve (x)</div>
              <input
                type="range"
                min={cfg.bounds.xMin}
                max={cfg.bounds.xMax}
                step={(cfg.bounds.xMax - cfg.bounds.xMin) / 120}
                value={x0}
                onChange={(e) => {
                  setX0(Number(e.target.value));
                  setTouched(true);
                }}
              />
              <div className="vl-card-subtitle">
                x = <strong>{roundTo(x0, 3)}</strong> • f(x) = <strong>{roundTo(y0, 3)}</strong> • slope f&apos;(x) ={' '}
                <strong>{roundTo(slope, 3)}</strong>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">f(x) with tangent</div>
            <div className="vl-card-subtitle">The derivative at x is the slope of the tangent line.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={cfg.bounds}
                curves={[{ id: 'f', color: '#00E676', points: fPoints, width: 3 }]}
                lines={[{ id: 'tangent', color: '#7C4DFF', p1: tangent.p1, p2: tangent.p2, width: 3 }]}
                markers={[{ id: 'p', color: '#FFD93D', p: { x: x0, y: y0 }, r: 5, label: 'P' }]}
              />
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Derivative graph f&apos;(x)</div>
            <div className="vl-card-subtitle">As you move P, the derivative point moves too.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={dfBounds}
                curves={[{ id: 'df', color: '#2979FF', points: dfPoints, width: 3 }]}
                markers={[{ id: 'dp', color: '#FFD93D', p: { x: x0, y: slope }, r: 5, label: "P'" }]}
              />
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Move the slider at least once to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Move slider'}
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
