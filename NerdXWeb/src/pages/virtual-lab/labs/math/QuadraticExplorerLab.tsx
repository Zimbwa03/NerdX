import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo, sampleFunction } from './graphing';

function formatRoot(x: number): string {
  return Number.isFinite(x) ? roundTo(x, 3).toString() : '-';
}

export function QuadraticExplorerLab({ simulation }: { simulation: SimulationMetadata }) {
  const [a, setA] = useState(1);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [touched, setTouched] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const f = useMemo(() => (x: number) => a * (x - h) * (x - h) + k, [a, h, k]);

  const xMin = -6;
  const xMax = 6;

  const points = useMemo(() => sampleFunction(f, xMin, xMax, 320), [f]);

  const yBounds = useMemo(() => {
    const ys = points.map((p) => p.y).filter((v) => Number.isFinite(v));
    if (!ys.length) return { yMin: -10, yMax: 10 };
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const span = Math.max(1, max - min);
    const pad = span * 0.15;
    return {
      yMin: clamp(min - pad, -60, 60),
      yMax: clamp(max + pad, -60, 60),
    };
  }, [points]);

  const discriminant = useMemo(() => -4 * a * k, [a, k]);

  const roots = useMemo(() => {
    if (a === 0) return { hasReal: false, x1: null as number | null, x2: null as number | null };
    const inside = -k / a;
    if (inside < 0) return { hasReal: false, x1: null, x2: null };
    const r = Math.sqrt(inside);
    return { hasReal: true, x1: h - r, x2: h + r };
  }, [a, h, k]);

  const canTakeQuiz = touched;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #00E676, #2979FF)' }}>
            <GitBranch size={28} />
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
            <div className="vl-card-title">Adjust the parabola</div>
            <div className="vl-card-subtitle">Vertex form: y = a(x - h)^2 + k</div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">a (opens up/down)</div>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={a}
                onChange={(e) => {
                  setA(Number(e.target.value));
                  setTouched(true);
                }}
              />
              <div className="vl-card-subtitle">
                a = <strong>{a}</strong> {a > 0 ? '(opens up)' : a < 0 ? '(opens down)' : '(flat)'}
              </div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">h (moves left/right)</div>
              <input
                type="range"
                min={-4}
                max={4}
                step={0.25}
                value={h}
                onChange={(e) => {
                  setH(Number(e.target.value));
                  setTouched(true);
                }}
              />
              <div className="vl-card-subtitle">
                h = <strong>{roundTo(h, 2)}</strong>
              </div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">k (moves up/down)</div>
              <input
                type="range"
                min={-10}
                max={10}
                step={0.25}
                value={k}
                onChange={(e) => {
                  setK(Number(e.target.value));
                  setTouched(true);
                }}
              />
              <div className="vl-card-subtitle">
                k = <strong>{roundTo(k, 2)}</strong>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Graph</div>
            <div className="vl-card-subtitle">Watch roots appear/disappear when the discriminant changes.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={{ xMin, xMax, yMin: yBounds.yMin, yMax: yBounds.yMax }}
                curves={[{ id: 'quad', color: '#00E676', points, width: 3 }]}
                lines={[{ id: 'axis', color: 'rgba(255,255,255,0.25)', p1: { x: h, y: yBounds.yMin }, p2: { x: h, y: yBounds.yMax }, dashed: true, width: 2 }]}
                markers={[
                  { id: 'vertex', p: { x: h, y: k }, color: '#FFD93D', r: 6, label: 'V' },
                  ...(roots.hasReal && roots.x1 !== null && roots.x2 !== null
                    ? [
                        { id: 'r1', p: { x: roots.x1, y: 0 }, color: '#2979FF', r: 5, label: 'x1' },
                        { id: 'r2', p: { x: roots.x2, y: 0 }, color: '#2979FF', r: 5, label: 'x2' },
                      ]
                    : []),
                ]}
              />
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Insights</div>
            <div className="vl-card-subtitle">
              Discriminant (b^2 - 4ac) = <strong>{roundTo(discriminant, 3)}</strong>
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 8 }}>
              Roots: {roots.hasReal ? `${formatRoot(roots.x1!)} , ${formatRoot(roots.x2!)}` : 'No real roots'}
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 8 }}>
              Axis of symmetry: x = {roundTo(h, 3)}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Change any slider once to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Try the sliders'}
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

