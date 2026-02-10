import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { PRESET_MATRICES } from '../../../../data/virtualLab/mathSimulationsData';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo } from './graphing';

type ShapeType = 'square' | 'triangle' | 'arrow';
type PresetKey = keyof typeof PRESET_MATRICES;

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

function getTransformDescription(a: number, b: number, c: number, d: number): string {
  if (a === 1 && b === 0 && c === 0 && d === 1) return 'Identity (no change)';
  if (a === 0 && b === -1 && c === 1 && d === 0) return 'Rotation 90deg CCW';
  if (a === -1 && b === 0 && c === 0 && d === -1) return 'Rotation 180deg';
  if (a === 0 && b === 1 && c === -1 && d === 0) return 'Rotation 90deg CW';
  if (a === 1 && b === 0 && c === 0 && d === -1) return 'Reflect over x-axis';
  if (a === -1 && b === 0 && c === 0 && d === 1) return 'Reflect over y-axis';
  if (a === d && b === 0 && c === 0) return `Scale ${a}x`;
  if (b !== 0 || c !== 0) return 'Shear / custom';
  return 'Custom transformation';
}

function shapeVertices(shapeType: ShapeType): Array<{ x: number; y: number }> {
  if (shapeType === 'triangle') {
    return [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1.5 },
    ];
  }
  if (shapeType === 'arrow') {
    return [
      { x: 0, y: 0 },
      { x: 1.5, y: 0 },
      { x: 1.5, y: -0.3 },
      { x: 2, y: 0.25 },
      { x: 1.5, y: 0.8 },
      { x: 1.5, y: 0.5 },
      { x: 0, y: 0.5 },
    ];
  }
  return [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
}

export function MatrixSandboxLab({ simulation }: { simulation: SimulationMetadata }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);
  const [shapeType, setShapeType] = useState<ShapeType>('square');
  const [showOriginal, setShowOriginal] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [explorations, setExplorations] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const determinant = useMemo(() => a * d - b * c, [a, b, c, d]);
  const description = useMemo(() => getTransformDescription(a, b, c, d), [a, b, c, d]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setExplorations((prev) => Math.min(prev + 1, 5));
    }, 3000);
    return () => window.clearTimeout(t);
  }, [a, b, c, d]);

  const originalShape = useMemo(() => shapeVertices(shapeType), [shapeType]);
  const transformedShape = useMemo(() => originalShape.map(({ x, y }) => ({ x: a * x + b * y, y: c * x + d * y })), [a, b, c, d, originalShape]);

  const bounds = useMemo(() => ({ xMin: -4, xMax: 4, yMin: -4, yMax: 4 }), []);
  const canTakeQuiz = explorations >= 4;

  const presets = useMemo(() => Object.entries(PRESET_MATRICES) as Array<[PresetKey, (typeof PRESET_MATRICES)[PresetKey]]>, []);

  const applyPreset = (key: PresetKey) => {
    const m = PRESET_MATRICES[key].matrix;
    setA(m[0][0]);
    setB(m[0][1]);
    setC(m[1][0]);
    setD(m[1][1]);
    setExplorations((prev) => Math.min(prev + 1, 5));
  };

  const detBadgeClass = determinant >= 0 ? 'vl-badge ok' : 'vl-badge';

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2979FF, #7C4DFF)' }}>
            <Grid3X3 size={28} />
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
            <div className="vl-card-title">Transformation matrix</div>
            <div className="vl-card-subtitle">Edit the 2x2 matrix and watch the shape transform.</div>
            <div className="vl-row" style={{ marginTop: 10, justifyContent: 'flex-start' }}>
              <span className={detBadgeClass}>det = {roundTo(determinant, 3)}</span>
              <span className="vl-badge ok" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}>
                {description}
              </span>
            </div>

            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 320 }}>
              <label className="vl-editor-label">
                a
                <input
                  className="vl-select"
                  type="number"
                  step={0.1}
                  value={a}
                  onChange={(e) => setA(clamp(Number(e.target.value), -6, 6))}
                  style={{ marginTop: 6 }}
                />
              </label>
              <label className="vl-editor-label">
                b
                <input
                  className="vl-select"
                  type="number"
                  step={0.1}
                  value={b}
                  onChange={(e) => setB(clamp(Number(e.target.value), -6, 6))}
                  style={{ marginTop: 6 }}
                />
              </label>
              <label className="vl-editor-label">
                c
                <input
                  className="vl-select"
                  type="number"
                  step={0.1}
                  value={c}
                  onChange={(e) => setC(clamp(Number(e.target.value), -6, 6))}
                  style={{ marginTop: 6 }}
                />
              </label>
              <label className="vl-editor-label">
                d
                <input
                  className="vl-select"
                  type="number"
                  step={0.1}
                  value={d}
                  onChange={(e) => setD(clamp(Number(e.target.value), -6, 6))}
                  style={{ marginTop: 6 }}
                />
              </label>
            </div>

            <div className="vl-section" style={{ marginTop: 14 }}>
              <div className="vl-section-title">Presets</div>
              <div className="vl-tab-row">
                {presets.map(([key, p]) => (
                  <button key={key} type="button" className="vl-tab" onClick={() => applyPreset(key)}>
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="vl-card-subtitle" style={{ marginTop: 8 }}>
                Presets help you quickly see rotations, reflections, scaling, and shear.
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Shape & view</div>
            <div className="vl-tab-row" style={{ marginTop: 10 }}>
              {([
                { key: 'square', label: 'Square' },
                { key: 'triangle', label: 'Triangle' },
                { key: 'arrow', label: 'Arrow' },
              ] as Array<{ key: ShapeType; label: string }>).map((s) => (
                <button key={s.key} type="button" className={`vl-tab ${shapeType === s.key ? 'active' : ''}`} onClick={() => setShapeType(s.key)}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${showOriginal ? 'active' : ''}`} onClick={() => setShowOriginal((p) => !p)}>
                Show original
              </button>
              <button type="button" className={`vl-tab ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid((p) => !p)}>
                Grid
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Explore a few transformations to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Explore more (${explorations}/4)`}
            </button>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Visualization</div>
            <div className="vl-card-subtitle">
              The filled shape is transformed. The dashed outline is the original (if enabled). Basis vectors show where (1,0) and (0,1) land.
            </div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={bounds}
                showGrid={showGrid}
                renderOverlay={({ mapX, mapY }) => {
                  const poly = (verts: Array<{ x: number; y: number }>) => verts.map((v) => `${mapX(v.x).toFixed(2)},${mapY(v.y).toFixed(2)}`).join(' ');
                  const ox = mapX(0);
                  const oy = mapY(0);
                  const e1x = mapX(a);
                  const e1y = mapY(c);
                  const e2x = mapX(b);
                  const e2y = mapY(d);

                  return (
                    <>
                      <polygon points={poly(transformedShape)} fill="rgba(124,77,255,0.22)" stroke="rgba(124,77,255,0.55)" strokeWidth={2} />
                      {showOriginal ? (
                        <polygon points={poly(originalShape)} fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth={2} strokeDasharray="8 6" />
                      ) : null}

                      <line x1={ox} y1={oy} x2={e1x} y2={e1y} stroke="#00E5FF" strokeWidth={3} />
                      <polygon points={arrowHeadPoints(ox, oy, e1x, e1y, 12)} fill="#00E5FF" />
                      <text x={e1x + 8} y={e1y - 8} fontSize={12} fill="rgba(255,255,255,0.78)" fontWeight={900}>
                        e1
                      </text>

                      <line x1={ox} y1={oy} x2={e2x} y2={e2y} stroke="#FF9100" strokeWidth={3} />
                      <polygon points={arrowHeadPoints(ox, oy, e2x, e2y, 12)} fill="#FF9100" />
                      <text x={e2x + 8} y={e2y - 8} fontSize={12} fill="rgba(255,255,255,0.78)" fontWeight={900}>
                        e2
                      </text>
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

