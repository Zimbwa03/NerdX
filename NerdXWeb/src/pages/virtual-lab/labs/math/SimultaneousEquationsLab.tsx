import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { roundTo } from './graphing';

export function SimultaneousEquationsLab({ simulation }: { simulation: SimulationMetadata }) {
  const [m1, setM1] = useState(2);
  const [c1, setC1] = useState(1);
  const [m2, setM2] = useState(-1);
  const [c2, setC2] = useState(4);
  const [quizOpen, setQuizOpen] = useState(false);

  const bounds = useMemo(() => ({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 }), []);

  const intersection = useMemo(() => {
    const denom = m1 - m2;
    if (Math.abs(denom) < 1e-9) return null;
    const x = (c2 - c1) / denom;
    const y = m1 * x + c1;
    return { x, y };
  }, [c1, c2, m1, m2]);

  const lines = useMemo(() => {
    const x1 = bounds.xMin;
    const x2 = bounds.xMax;
    return [
      { id: 'l1', color: '#2196F3', p1: { x: x1, y: m1 * x1 + c1 }, p2: { x: x2, y: m1 * x2 + c1 }, width: 3 },
      { id: 'l2', color: '#FF9800', p1: { x: x1, y: m2 * x1 + c2 }, p2: { x: x2, y: m2 * x2 + c2 }, width: 3 },
    ];
  }, [bounds.xMax, bounds.xMin, c1, c2, m1, m2]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #E91E63, #C2185B)' }}>
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
            <div className="vl-card-title">Graphical solver</div>
            <div className="vl-card-subtitle">A system of simultaneous equations is solved where the two lines intersect.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={bounds}
                lines={lines}
                markers={
                  intersection && Number.isFinite(intersection.x) && Number.isFinite(intersection.y)
                    ? [{ id: 'p', color: '#E91E63', p: intersection, r: 6, label: `(${roundTo(intersection.x, 1)}, ${roundTo(intersection.y, 1)})` }]
                    : []
                }
              />
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Solution</div>
            {intersection ? (
              <div className="vl-card-subtitle">
                x = <strong>{roundTo(intersection.x, 3)}</strong>, y = <strong>{roundTo(intersection.y, 3)}</strong>
              </div>
            ) : (
              <div className="vl-card-subtitle">Lines are parallel (no unique solution).</div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Controls - line 1</div>
            <div className="vl-card-subtitle">
              y = <strong>{roundTo(m1, 2)}</strong>x + <strong>{roundTo(c1, 2)}</strong>
            </div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Gradient (m)</div>
              <input className="vl-range" type="range" min={-5} max={5} step={0.5} value={m1} onChange={(e) => setM1(Number(e.target.value))} />
            </div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Y-intercept (c)</div>
              <input className="vl-range" type="range" min={-8} max={8} step={1} value={c1} onChange={(e) => setC1(Number(e.target.value))} />
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Controls - line 2</div>
            <div className="vl-card-subtitle">
              y = <strong>{roundTo(m2, 2)}</strong>x + <strong>{roundTo(c2, 2)}</strong>
            </div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Gradient (m)</div>
              <input className="vl-range" type="range" min={-5} max={5} step={0.5} value={m2} onChange={(e) => setM2(Number(e.target.value))} />
            </div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Y-intercept (c)</div>
              <input className="vl-range" type="range" min={-8} max={8} step={1} value={c2} onChange={(e) => setC2(Number(e.target.value))} />
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Try changing gradients and intercepts, then test yourself.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)}>
              <Sparkles size={16} /> Start knowledge check
            </button>
          </div>
        </div>

        <div className="vl-col">
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

