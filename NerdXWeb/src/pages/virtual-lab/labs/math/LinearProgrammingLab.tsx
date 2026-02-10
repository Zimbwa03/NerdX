import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo } from './graphing';

type ProblemType = 'maximize' | 'minimize';

interface Constraint {
  a: number;
  b: number;
  c: number;
  label: string;
  color: string;
}

const DOMAIN = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 };

function findIntersection(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): { x: number; y: number } | null {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-9) return null;
  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;
  return { x, y };
}

function segmentForLine(a: number, b: number, c: number): { p1: { x: number; y: number }; p2: { x: number; y: number } } | null {
  const pts: Array<{ x: number; y: number }> = [];

  if (Math.abs(b) > 1e-9) {
    const yAtXMin = (c - a * DOMAIN.xMin) / b;
    const yAtXMax = (c - a * DOMAIN.xMax) / b;
    if (yAtXMin >= DOMAIN.yMin - 1e-9 && yAtXMin <= DOMAIN.yMax + 1e-9) pts.push({ x: DOMAIN.xMin, y: yAtXMin });
    if (yAtXMax >= DOMAIN.yMin - 1e-9 && yAtXMax <= DOMAIN.yMax + 1e-9) pts.push({ x: DOMAIN.xMax, y: yAtXMax });
  }

  if (Math.abs(a) > 1e-9) {
    const xAtYMin = (c - b * DOMAIN.yMin) / a;
    const xAtYMax = (c - b * DOMAIN.yMax) / a;
    if (xAtYMin >= DOMAIN.xMin - 1e-9 && xAtYMin <= DOMAIN.xMax + 1e-9) pts.push({ x: xAtYMin, y: DOMAIN.yMin });
    if (xAtYMax >= DOMAIN.xMin - 1e-9 && xAtYMax <= DOMAIN.xMax + 1e-9) pts.push({ x: xAtYMax, y: DOMAIN.yMax });
  }

  const uniq = new Map<string, { x: number; y: number }>();
  for (const p of pts) {
    const key = `${roundTo(p.x, 4)},${roundTo(p.y, 4)}`;
    uniq.set(key, p);
  }
  const arr = Array.from(uniq.values());
  if (arr.length < 2) return null;
  return { p1: arr[0], p2: arr[1] };
}

export function LinearProgrammingLab({ simulation }: { simulation: SimulationMetadata }) {
  const constraints: Constraint[] = useMemo(
    () => [
      { a: 1, b: 1, c: 6, label: 'x + y <= 6', color: '#2979FF' },
      { a: 2, b: 1, c: 8, label: '2x + y <= 8', color: '#FF9100' },
      { a: 0, b: 1, c: 4, label: 'y <= 4', color: '#00E676' },
    ],
    []
  );

  const [objA, setObjA] = useState(3);
  const [objB, setObjB] = useState(2);
  const [problemType, setProblemType] = useState<ProblemType>('maximize');
  const [objectiveValue, setObjectiveValue] = useState(12);
  const [showFeasible, setShowFeasible] = useState(true);
  const [explorations, setExplorations] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const feasibleVertices = useMemo(() => {
    const vertices: Array<{ x: number; y: number }> = [];
    const allLines = [
      ...constraints.map((c) => ({ a: c.a, b: c.b, c: c.c })),
      { a: 1, b: 0, c: 0 }, // x = 0
      { a: 0, b: 1, c: 0 }, // y = 0
    ];

    for (let i = 0; i < allLines.length; i += 1) {
      for (let j = i + 1; j < allLines.length; j += 1) {
        const p = findIntersection(allLines[i].a, allLines[i].b, allLines[i].c, allLines[j].a, allLines[j].b, allLines[j].c);
        if (!p) continue;
        if (p.x < -0.01 || p.y < -0.01) continue;
        if (p.x > DOMAIN.xMax + 0.01 || p.y > DOMAIN.yMax + 0.01) continue;

        let ok = true;
        for (const cst of constraints) {
          if (cst.a * p.x + cst.b * p.y > cst.c + 0.01) {
            ok = false;
            break;
          }
        }
        if (ok) vertices.push(p);
      }
    }

    const uniq = new Map<string, { x: number; y: number }>();
    for (const v of vertices) uniq.set(`${roundTo(v.x, 4)},${roundTo(v.y, 4)}`, v);
    const out = Array.from(uniq.values());

    if (out.length > 2) {
      const cx = out.reduce((s, v) => s + v.x, 0) / out.length;
      const cy = out.reduce((s, v) => s + v.y, 0) / out.length;
      out.sort((p1, p2) => Math.atan2(p1.y - cy, p1.x - cx) - Math.atan2(p2.y - cy, p2.x - cx));
    }

    return out;
  }, [constraints]);

  const optimalPoint = useMemo(() => {
    if (!feasibleVertices.length) return null;
    let best = feasibleVertices[0];
    let bestVal = objA * best.x + objB * best.y;
    for (const v of feasibleVertices) {
      const z = objA * v.x + objB * v.y;
      if (problemType === 'maximize' ? z > bestVal : z < bestVal) {
        best = v;
        bestVal = z;
      }
    }
    return { point: best, value: bestVal };
  }, [feasibleVertices, objA, objB, problemType]);

  const objectiveSegment = useMemo(() => segmentForLine(objA, objB, objectiveValue), [objA, objB, objectiveValue]);

  const constraintSegments = useMemo(
    () =>
      constraints
        .map((cst) => {
          const seg = segmentForLine(cst.a, cst.b, cst.c);
          return seg ? { ...seg, id: cst.label, color: cst.color } : null;
        })
        .filter((x): x is { id: string; color: string; p1: { x: number; y: number }; p2: { x: number; y: number } } => !!x),
    [constraints]
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      setExplorations((prev) => Math.min(prev + 1, 5));
    }, 3000);
    return () => window.clearTimeout(t);
  }, [objectiveValue, problemType]);

  const canTakeQuiz = explorations >= 3;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FFD740, #FF9100)' }}>
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
            <div className="vl-card-title">Optimization problem</div>
            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${problemType === 'maximize' ? 'active' : ''}`} onClick={() => setProblemType('maximize')}>
                Maximize
              </button>
              <button type="button" className={`vl-tab ${problemType === 'minimize' ? 'active' : ''}`} onClick={() => setProblemType('minimize')}>
                Minimize
              </button>
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
              Objective: <strong>Z = {objA}x + {objB}y</strong>
            </div>
            {optimalPoint ? (
              <div className="vl-check-result pass" style={{ marginTop: 12 }}>
                Optimal vertex: ({roundTo(optimalPoint.point.x, 2)}, {roundTo(optimalPoint.point.y, 2)}) gives Z = {roundTo(optimalPoint.value, 2)}
              </div>
            ) : (
              <div className="vl-check-result fail" style={{ marginTop: 12 }}>
                No feasible region found in the current domain.
              </div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Constraints</div>
            <div className="vl-card-subtitle">All constraints apply with x &gt;= 0 and y &gt;= 0.</div>
            <ul className="vl-bullets">
              {constraints.map((c) => (
                <li key={c.label}>
                  <span style={{ color: c.color, fontWeight: 900 }}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Objective line</div>
            <div className="vl-card-subtitle">Drag the dashed line: Z = {roundTo(objectiveValue, 1)}</div>
            <input
              className="vl-range"
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={objectiveValue}
              onChange={(e) => setObjectiveValue(Number(e.target.value))}
            />
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Objective coefficients</div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Coefficient of x: {objA}</div>
              <input className="vl-range" type="range" min={1} max={10} step={1} value={objA} onChange={(e) => setObjA(clamp(Number(e.target.value), 1, 10))} />
            </div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Coefficient of y: {objB}</div>
              <input className="vl-range" type="range" min={1} max={10} step={1} value={objB} onChange={(e) => setObjB(clamp(Number(e.target.value), 1, 10))} />
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">View</div>
            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${showFeasible ? 'active' : ''}`} onClick={() => setShowFeasible((p) => !p)}>
                Show feasible region
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Move the objective line and switch maximize/minimize a few times.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Explore more (${explorations}/3)`}
            </button>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Graph</div>
            <div className="vl-card-subtitle">Green polygon is feasible. Yellow line is the objective contour.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={DOMAIN}
                lines={[
                  ...constraintSegments.map((seg) => ({ id: seg.id, color: seg.color, p1: seg.p1, p2: seg.p2, dashed: true, width: 2 })),
                  ...(objectiveSegment ? [{ id: 'obj', color: '#FFD740', p1: objectiveSegment.p1, p2: objectiveSegment.p2, dashed: true, width: 3 }] : []),
                ]}
                markers={[
                  ...feasibleVertices.map((v, idx) => ({ id: `v-${idx}`, color: 'rgba(255,255,255,0.55)', p: v, r: 4 })),
                  ...(optimalPoint ? [{ id: 'opt', color: '#FFD740', p: optimalPoint.point, r: 7, label: 'Optimal' }] : []),
                ]}
                renderOverlay={({ mapX, mapY }) => {
                  if (!showFeasible) return null;
                  if (feasibleVertices.length < 3) return null;
                  const pts = feasibleVertices.map((v) => `${mapX(v.x).toFixed(2)},${mapY(v.y).toFixed(2)}`).join(' ');
                  return <polygon points={pts} fill="rgba(0,230,118,0.10)" stroke="rgba(0,230,118,0.45)" strokeWidth={2} />;
                }}
              />
            </div>
            <div className="vl-check-result pass" style={{ marginTop: 12 }}>
              Key insight: the optimal solution occurs at a corner (vertex) of the feasible region.
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
