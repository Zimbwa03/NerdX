import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo } from './graphing';

type Operation = 'add' | 'subtract' | 'dot_product' | 'none';

function arrowHeadPoints(x1: number, y1: number, x2: number, y2: number, size = 10): string {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const left = {
    x: x2 - size * Math.cos(ang - Math.PI / 6),
    y: y2 - size * Math.sin(ang - Math.PI / 6),
  };
  const right = {
    x: x2 - size * Math.cos(ang + Math.PI / 6),
    y: y2 - size * Math.sin(ang + Math.PI / 6),
  };
  return `${x2.toFixed(2)},${y2.toFixed(2)} ${left.x.toFixed(2)},${left.y.toFixed(2)} ${right.x.toFixed(2)},${right.y.toFixed(2)}`;
}

export function VectorVisualizerLab({ simulation }: { simulation: SimulationMetadata }) {
  const [v1x, setV1x] = useState(3);
  const [v1y, setV1y] = useState(2);
  const [v2x, setV2x] = useState(1);
  const [v2y, setV2y] = useState(3);
  const [operation, setOperation] = useState<Operation>('add');
  const [showMagnitude, setShowMagnitude] = useState(true);
  const [showParallelogram, setShowParallelogram] = useState(true);
  const [explorations, setExplorations] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setExplorations((prev) => Math.min(prev + 1, 4));
    }, 2500);
    return () => window.clearTimeout(t);
  }, [operation, v1x, v1y, v2x, v2y]);

  const magnitude1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const magnitude2 = Math.sqrt(v2x * v2x + v2y * v2y);
  const dotProduct = v1x * v2x + v1y * v2y;

  const angleBetween = useMemo(() => {
    const denom = magnitude1 * magnitude2;
    if (denom < 1e-9) return null;
    const ratio = clamp(dotProduct / denom, -1, 1);
    return (Math.acos(ratio) * 180) / Math.PI;
  }, [dotProduct, magnitude1, magnitude2]);

  const result = useMemo(() => {
    if (operation === 'add') return { x: v1x + v2x, y: v1y + v2y };
    if (operation === 'subtract') return { x: v1x - v2x, y: v1y - v2y };
    return null;
  }, [operation, v1x, v1y, v2x, v2y]);

  const resultMagnitude = useMemo(() => (result ? Math.sqrt(result.x * result.x + result.y * result.y) : 0), [result]);

  const canTakeQuiz = explorations >= 3;
  const bounds = useMemo(() => ({ xMin: -8, xMax: 8, yMin: -8, yMax: 8 }), []);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2979FF, #FF9100)' }}>
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
            <div className="vl-card-title">Vectors</div>
            <div className="vl-card-subtitle">Adjust components and pick an operation.</div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Vector a = ({roundTo(v1x, 1)}, {roundTo(v1y, 1)})</div>
              <input className="vl-range" type="range" min={-6} max={6} step={0.5} value={v1x} onChange={(e) => setV1x(Number(e.target.value))} />
              <input className="vl-range" type="range" min={-6} max={6} step={0.5} value={v1y} onChange={(e) => setV1y(Number(e.target.value))} />
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Vector b = ({roundTo(v2x, 1)}, {roundTo(v2y, 1)})</div>
              <input className="vl-range" type="range" min={-6} max={6} step={0.5} value={v2x} onChange={(e) => setV2x(Number(e.target.value))} />
              <input className="vl-range" type="range" min={-6} max={6} step={0.5} value={v2y} onChange={(e) => setV2y(Number(e.target.value))} />
            </div>

            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              {([
                { key: 'add', label: 'a + b' },
                { key: 'subtract', label: 'a - b' },
                { key: 'dot_product', label: 'a · b' },
                { key: 'none', label: 'None' },
              ] as Array<{ key: Operation; label: string }>).map((op) => (
                <button
                  key={op.key}
                  type="button"
                  className={`vl-tab ${operation === op.key ? 'active' : ''}`}
                  onClick={() => setOperation(op.key)}
                >
                  {op.label}
                </button>
              ))}
            </div>

            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${showMagnitude ? 'active' : ''}`} onClick={() => setShowMagnitude((p) => !p)}>
                Magnitudes
              </button>
              <button
                type="button"
                className={`vl-tab ${showParallelogram ? 'active' : ''}`}
                onClick={() => setShowParallelogram((p) => !p)}
                disabled={operation !== 'add'}
              >
                Parallelogram
              </button>
            </div>

            <div className="vl-readouts" style={{ marginTop: 12 }}>
              <div className="vl-readout">
                <div className="vl-readout-label">|a|</div>
                <div className="vl-readout-value">{showMagnitude ? roundTo(magnitude1, 3) : 'Hidden'}</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">|b|</div>
                <div className="vl-readout-value">{showMagnitude ? roundTo(magnitude2, 3) : 'Hidden'}</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">a · b</div>
                <div className="vl-readout-value">{roundTo(dotProduct, 3)}</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">Angle</div>
                <div className="vl-readout-value">{angleBetween === null || Number.isNaN(angleBetween) ? 'N/A' : `${roundTo(angleBetween, 2)} deg`}</div>
              </div>
            </div>

            {result ? (
              <div className="vl-card-subtitle" style={{ marginTop: 12 }}>
                Result = ({roundTo(result.x, 2)}, {roundTo(result.y, 2)}) • |result| = {roundTo(resultMagnitude, 3)}
              </div>
            ) : null}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Explore vectors and operations to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Explore more (${explorations}/3)`}
            </button>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Visualization</div>
            <div className="vl-card-subtitle">Blue is a, orange is b, green is the result.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={bounds}
                lines={[
                  { id: 'a', color: '#2979FF', p1: { x: 0, y: 0 }, p2: { x: v1x, y: v1y }, width: 4 },
                  { id: 'b', color: '#FF9100', p1: { x: 0, y: 0 }, p2: { x: v2x, y: v2y }, width: 4 },
                  ...(result ? [{ id: 'r', color: '#00E676', p1: { x: 0, y: 0 }, p2: { x: result.x, y: result.y }, width: 4 }] : []),
                ]}
                renderOverlay={({ mapX, mapY }) => {
                  const ox = mapX(0);
                  const oy = mapY(0);
                  const ax = mapX(v1x);
                  const ay = mapY(v1y);
                  const bx = mapX(v2x);
                  const by = mapY(v2y);

                  const rx = result ? mapX(result.x) : 0;
                  const ry = result ? mapY(result.y) : 0;

                  const para =
                    showParallelogram && operation === 'add'
                      ? `${ox.toFixed(2)},${oy.toFixed(2)} ${ax.toFixed(2)},${ay.toFixed(2)} ${rx.toFixed(2)},${ry.toFixed(2)} ${bx.toFixed(2)},${by.toFixed(2)}`
                      : null;

                  return (
                    <>
                      {para ? (
                        <polygon
                          points={para}
                          fill="rgba(0,230,118,0.08)"
                          stroke="rgba(0,230,118,0.45)"
                          strokeWidth={2}
                          strokeDasharray="8 6"
                        />
                      ) : null}

                      <polygon points={arrowHeadPoints(ox, oy, ax, ay, 12)} fill="#2979FF" />
                      <polygon points={arrowHeadPoints(ox, oy, bx, by, 12)} fill="#FF9100" />
                      {result ? <polygon points={arrowHeadPoints(ox, oy, rx, ry, 12)} fill="#00E676" /> : null}

                      <text x={ax + 8} y={ay - 8} fontSize={12} fill="rgba(255,255,255,0.78)" fontWeight={900}>
                        a
                      </text>
                      <text x={bx + 8} y={by - 8} fontSize={12} fill="rgba(255,255,255,0.78)" fontWeight={900}>
                        b
                      </text>
                      {result ? (
                        <text x={rx + 8} y={ry - 8} fontSize={12} fill="rgba(255,255,255,0.78)" fontWeight={900}>
                          r
                        </text>
                      ) : null}
                    </>
                  );
                }}
              />
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

