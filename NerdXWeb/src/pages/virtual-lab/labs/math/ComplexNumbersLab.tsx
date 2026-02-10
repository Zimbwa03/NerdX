import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Infinity, RotateCcw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { roundTo } from './graphing';

export function ComplexNumbersLab({ simulation }: { simulation: SimulationMetadata }) {
  const [re, setRe] = useState(3);
  const [im, setIm] = useState(2);
  const [hasRotated, setHasRotated] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const modulus = useMemo(() => Math.sqrt(re * re + im * im), [im, re]);
  const argRad = useMemo(() => Math.atan2(im, re), [im, re]);
  const argDeg = useMemo(() => (argRad * 180) / Math.PI, [argRad]);

  const rotated = useMemo(() => ({ re: -im, im: re }), [im, re]);

  const bounds = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };

  const canTakeQuiz = hasRotated;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF4081, #7C4DFF)' }}>
            <Infinity size={28} />
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
            <div className="vl-card-title">Argand plane</div>
            <div className="vl-card-subtitle">A complex number z = a + bi is plotted as (a, b).</div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Real part (a)</div>
              <input type="range" min={-4} max={4} step={0.25} value={re} onChange={(e) => setRe(Number(e.target.value))} />
              <div className="vl-card-subtitle">
                a = <strong>{roundTo(re, 2)}</strong>
              </div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Imaginary part (b)</div>
              <input type="range" min={-4} max={4} step={0.25} value={im} onChange={(e) => setIm(Number(e.target.value))} />
              <div className="vl-card-subtitle">
                b = <strong>{roundTo(im, 2)}</strong>
              </div>
            </div>

            <div className="vl-row" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
              <button
                type="button"
                className="vl-btn secondary"
                onClick={() => {
                  setRe(-im);
                  setIm(re);
                  setHasRotated(true);
                }}
              >
                <RotateCcw size={16} /> Multiply by i (rotate 90°)
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Visualize rotation</div>
            <div className="vl-card-subtitle">Multiplying by i rotates the point 90° counter-clockwise.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={bounds}
                lines={[
                  { id: 'z', p1: { x: 0, y: 0 }, p2: { x: re, y: im }, color: '#00E676', width: 3 },
                  { id: 'zi', p1: { x: 0, y: 0 }, p2: { x: rotated.re, y: rotated.im }, color: '#2979FF', width: 3, dashed: true },
                ]}
                markers={[
                  { id: 'p', p: { x: re, y: im }, color: '#FFD93D', r: 6, label: 'z' },
                  { id: 'pi', p: { x: rotated.re, y: rotated.im }, color: '#2979FF', r: 5, label: 'z·i' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Readouts</div>
            <div className="vl-card-subtitle">
              z = <strong>{roundTo(re, 2)}</strong> + <strong>{roundTo(im, 2)}</strong>i
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 8 }}>
              |z| = <strong>{roundTo(modulus, 3)}</strong> • arg(z) ≈ <strong>{roundTo(argDeg, 2)}</strong>°
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 8 }}>
              After multiplying by i: z·i = <strong>{roundTo(rotated.re, 2)}</strong> + <strong>{roundTo(rotated.im, 2)}</strong>i
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Use the rotate button once to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Rotate once'}
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

