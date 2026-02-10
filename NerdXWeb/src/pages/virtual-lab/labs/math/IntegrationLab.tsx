import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo, sampleFunction } from './graphing';

type FnKey = 'x2' | 'sin1';
type Method = 'left' | 'mid' | 'right';

const FUNCTIONS: Record<
  FnKey,
  {
    label: string;
    f: (x: number) => number;
    exactIntegral: (a: number, b: number) => number;
    bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  }
> = {
  x2: {
    label: 'f(x) = x^2',
    f: (x) => x * x,
    exactIntegral: (a, b) => (b * b * b - a * a * a) / 3,
    bounds: { xMin: 0, xMax: 4, yMin: 0, yMax: 18 },
  },
  sin1: {
    label: 'f(x) = sin(x) + 1',
    f: (x) => Math.sin(x) + 1,
    exactIntegral: (a, b) => (-Math.cos(b) + b) - (-Math.cos(a) + a),
    bounds: { xMin: 0, xMax: 6.28, yMin: 0, yMax: 2.3 },
  },
};

function methodLabel(m: Method): string {
  if (m === 'left') return 'Left';
  if (m === 'right') return 'Right';
  return 'Midpoint';
}

export function IntegrationLab({ simulation }: { simulation: SimulationMetadata }) {
  const [fnKey, setFnKey] = useState<FnKey>('x2');
  const [a, setA] = useState(0);
  const [b, setB] = useState(3);
  const [n, setN] = useState(10);
  const [method, setMethod] = useState<Method>('mid');
  const [touched, setTouched] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const cfg = FUNCTIONS[fnKey];

  useEffect(() => {
    setA((prev) => clamp(prev, cfg.bounds.xMin, cfg.bounds.xMax - 0.25));
    setB((prev) => clamp(prev, cfg.bounds.xMin + 0.25, cfg.bounds.xMax));
  }, [cfg.bounds.xMax, cfg.bounds.xMin]);

  useEffect(() => {
    // keep a < b
    setA((prev) => Math.min(prev, b - 0.25));
  }, [b]);

  useEffect(() => {
    setB((prev) => Math.max(prev, a + 0.25));
  }, [a]);

  const curve = useMemo(() => sampleFunction(cfg.f, cfg.bounds.xMin, cfg.bounds.xMax, 320), [cfg]);

  const riemann = useMemo(() => {
    const safeN = Math.max(2, Math.min(80, Math.floor(n)));
    const dx = (b - a) / safeN;
    const rects: Array<{ xLeft: number; xRight: number; height: number }> = [];
    let sum = 0;
    for (let i = 0; i < safeN; i += 1) {
      const xLeft = a + i * dx;
      const xRight = xLeft + dx;
      const xSample = method === 'left' ? xLeft : method === 'right' ? xRight : xLeft + dx / 2;
      const h = cfg.f(xSample);
      rects.push({ xLeft, xRight, height: h });
      sum += h * dx;
    }
    return { dx, rects, approx: sum };
  }, [a, b, cfg, method, n]);

  const exact = useMemo(() => cfg.exactIntegral(a, b), [a, b, cfg]);
  const error = useMemo(() => riemann.approx - exact, [exact, riemann.approx]);

  const canTakeQuiz = touched;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #7C4DFF, #00E676)' }}>
            <Layers size={28} />
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
            <div className="vl-card-title">Riemann rectangles</div>
            <div className="vl-card-subtitle">Integration is the area under a curve. Increase rectangles to approach the exact area.</div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Function</div>
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
              <div className="vl-editor-label">Interval [a, b]</div>
              <input
                type="range"
                min={cfg.bounds.xMin}
                max={cfg.bounds.xMax - 0.25}
                step={(cfg.bounds.xMax - cfg.bounds.xMin) / 120}
                value={a}
                onChange={(e) => {
                  setA(Number(e.target.value));
                  setTouched(true);
                }}
              />
              <input
                type="range"
                min={cfg.bounds.xMin + 0.25}
                max={cfg.bounds.xMax}
                step={(cfg.bounds.xMax - cfg.bounds.xMin) / 120}
                value={b}
                onChange={(e) => {
                  setB(Number(e.target.value));
                  setTouched(true);
                }}
              />
              <div className="vl-card-subtitle">
                a = <strong>{roundTo(a, 2)}</strong> • b = <strong>{roundTo(b, 2)}</strong>
              </div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Rectangles (n)</div>
              <input
                type="range"
                min={2}
                max={60}
                step={1}
                value={n}
                onChange={(e) => {
                  setN(Number(e.target.value));
                  setTouched(true);
                }}
              />
              <div className="vl-card-subtitle">
                n = <strong>{n}</strong> • method: <strong>{methodLabel(method)}</strong> • dx ≈ <strong>{roundTo(riemann.dx, 3)}</strong>
              </div>
            </div>

            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              {(['left', 'mid', 'right'] as Method[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`vl-tab ${method === m ? 'active' : ''}`}
                  onClick={() => {
                    setMethod(m);
                    setTouched(true);
                  }}
                >
                  {methodLabel(m)}
                </button>
              ))}
            </div>

            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={cfg.bounds}
                curves={[{ id: 'f', color: '#00E676', points: curve, width: 3 }]}
                renderOverlay={({ mapX, mapY, plot }) => {
                  const y0 = mapY(0);
                  return (
                    <>
                      {riemann.rects.map((r, idx) => {
                        if (r.xRight < a - 1e-9 || r.xLeft > b + 1e-9) return null;
                        const x = mapX(r.xLeft);
                        const w = mapX(r.xRight) - mapX(r.xLeft);
                        const topY = mapY(r.height);
                        const h = y0 - topY;
                        const clampedH = Math.max(0, Math.min(plot.h, h));
                        return (
                          <rect
                            key={`rect-${idx}`}
                            x={x}
                            y={y0 - clampedH}
                            width={w}
                            height={clampedH}
                            fill="rgba(124,77,255,0.18)"
                            stroke="rgba(124,77,255,0.22)"
                          />
                        );
                      })}
                      <line x1={mapX(a)} y1={plot.y} x2={mapX(a)} y2={plot.y + plot.h} stroke="rgba(255,255,255,0.18)" strokeDasharray="6 6" />
                      <line x1={mapX(b)} y1={plot.y} x2={mapX(b)} y2={plot.y + plot.h} stroke="rgba(255,255,255,0.18)" strokeDasharray="6 6" />
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Results</div>
            <div className="vl-card-subtitle">
              Approx area ≈ <strong>{roundTo(riemann.approx, 4)}</strong>
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 8 }}>
              Exact area = <strong>{roundTo(exact, 4)}</strong> • Error = <strong>{roundTo(error, 4)}</strong>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Change any control once to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Try the controls'}
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

