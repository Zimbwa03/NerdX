import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, Waves } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo, sampleFunction } from './graphing';

const BOUNDS = { xMin: 0.1, xMax: 10, yMin: -3, yMax: 4 };

function formatBase(base: number): string {
  if (Math.abs(base - Math.E) < 0.08) return 'e';
  return base.toFixed(1);
}

export function LogarithmsLab({ simulation }: { simulation: SimulationMetadata }) {
  const [base, setBase] = useState(2);
  const [xValue, setXValue] = useState(4);
  const [showExponential, setShowExponential] = useState(true);
  const [explorations, setExplorations] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const logValue = useMemo(() => Math.log(xValue) / Math.log(base), [base, xValue]);

  const logPoints = useMemo(() => {
    const pts = sampleFunction((x) => Math.log(x) / Math.log(base), BOUNDS.xMin, BOUNDS.xMax, 420);
    return pts.filter((p) => p.y >= BOUNDS.yMin - 0.25 && p.y <= BOUNDS.yMax + 0.25);
  }, [base]);

  const expPoints = useMemo(() => {
    const pts: Array<{ x: number; y: number }> = [];
    if (!showExponential) return pts;
    for (let y = BOUNDS.yMin; y <= BOUNDS.yMax + 1e-9; y += 0.05) {
      const x = Math.pow(base, y);
      if (x >= BOUNDS.xMin - 1e-9 && x <= BOUNDS.xMax + 1e-9) pts.push({ x, y });
    }
    return pts;
  }, [base, showExponential]);

  const canTakeQuiz = explorations >= 3;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #26A69A, #FF7043)' }}>
            <Waves size={28} />
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
            <div className="vl-card-title">Equivalent forms</div>
            <div className="vl-card-subtitle">Logarithms and exponentials are inverse operations.</div>
            <div className="vl-readouts" style={{ marginTop: 12 }}>
              <div className="vl-readout">
                <div className="vl-readout-label">Log form</div>
                <div className="vl-readout-value">
                  log_{formatBase(base)}({roundTo(xValue, 1)}) = {roundTo(logValue, 3)}
                </div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">Exp form</div>
                <div className="vl-readout-value">
                  {formatBase(base)}^{roundTo(logValue, 3)} = {roundTo(xValue, 1)}
                </div>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Controls</div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Base (b): {roundTo(base, 1)}</div>
              <input
                className="vl-range"
                type="range"
                min={1.5}
                max={10}
                step={0.1}
                value={base}
                onChange={(e) => {
                  setBase(roundTo(Number(e.target.value), 1));
                  setExplorations((prev) => Math.min(prev + 1, 4));
                }}
              />
              <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  className="vl-btn secondary"
                  onClick={() => {
                    setBase(2);
                    setExplorations((prev) => Math.min(prev + 1, 4));
                  }}
                >
                  b = 2
                </button>
                <button
                  type="button"
                  className="vl-btn secondary"
                  onClick={() => {
                    setBase(roundTo(Math.E, 3));
                    setExplorations((prev) => Math.min(prev + 1, 4));
                  }}
                >
                  b = e
                </button>
                <button
                  type="button"
                  className="vl-btn secondary"
                  onClick={() => {
                    setBase(10);
                    setExplorations((prev) => Math.min(prev + 1, 4));
                  }}
                >
                  b = 10
                </button>
              </div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">x value: {roundTo(xValue, 1)}</div>
              <input
                className="vl-range"
                type="range"
                min={BOUNDS.xMin}
                max={BOUNDS.xMax}
                step={0.1}
                value={xValue}
                onChange={(e) => {
                  setXValue(clamp(roundTo(Number(e.target.value), 1), BOUNDS.xMin, BOUNDS.xMax));
                  setExplorations((prev) => Math.min(prev + 1, 4));
                }}
              />
            </div>

            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${showExponential ? 'active' : ''}`} onClick={() => setShowExponential((p) => !p)}>
                Show inverse curve
              </button>
            </div>

            <div className="vl-row">
              <button
                type="button"
                className="vl-btn secondary"
                onClick={() => {
                  setBase(2);
                  setXValue(4);
                  setShowExponential(true);
                  setExplorations(0);
                }}
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Change base and x a few times to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Explore more (${explorations}/3)`}
            </button>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Graph</div>
            <div className="vl-card-subtitle">
              Green is y = log_b(x). Orange is its inverse (x = b^y). The dashed line is y = x.
            </div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={BOUNDS}
                curves={[
                  ...(showExponential ? [{ id: 'exp', color: '#FF7043', points: expPoints, width: 3, dashed: false }] : []),
                  { id: 'log', color: '#26A69A', points: logPoints, width: 3 },
                ]}
                lines={[
                  { id: 'yEqX', color: 'rgba(255,255,255,0.22)', p1: { x: 0.1, y: 0.1 }, p2: { x: 4, y: 4 }, dashed: true, width: 2 },
                  { id: 'yAxis', color: 'rgba(255,255,255,0.18)', p1: { x: 1, y: BOUNDS.yMin }, p2: { x: 1, y: BOUNDS.yMax }, width: 2 },
                  { id: 'v', color: 'rgba(38,166,154,0.55)', p1: { x: xValue, y: 0 }, p2: { x: xValue, y: logValue }, dashed: true, width: 2 },
                ]}
                markers={[{ id: 'p', color: '#26A69A', p: { x: xValue, y: logValue }, r: 6, label: `(${roundTo(xValue, 1)}, ${roundTo(logValue, 2)})` }]}
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

