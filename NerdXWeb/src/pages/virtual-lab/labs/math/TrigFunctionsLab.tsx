import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pause, Play, RotateCcw, Sparkles, Waves } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { GraphSvg } from './GraphSvg';
import { clamp, roundTo, sampleFunction } from './graphing';

const TAU = Math.PI * 2;

const SPECIAL_ANGLES: Array<{ label: string; value: number }> = [
  { label: '0deg', value: 0 },
  { label: '30deg', value: Math.PI / 6 },
  { label: '45deg', value: Math.PI / 4 },
  { label: '60deg', value: Math.PI / 3 },
  { label: '90deg', value: Math.PI / 2 },
  { label: '120deg', value: (2 * Math.PI) / 3 },
  { label: '135deg', value: (3 * Math.PI) / 4 },
  { label: '150deg', value: (5 * Math.PI) / 6 },
  { label: '180deg', value: Math.PI },
  { label: '270deg', value: (3 * Math.PI) / 2 },
  { label: '360deg', value: TAU },
];

function circlePoints(steps = 200): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  const safe = Math.max(40, Math.min(800, Math.floor(steps)));
  for (let i = 0; i <= safe; i += 1) {
    const t = (i / safe) * TAU;
    pts.push({ x: Math.cos(t), y: Math.sin(t) });
  }
  return pts;
}

export function TrigFunctionsLab({ simulation }: { simulation: SimulationMetadata }) {
  const [angle, setAngle] = useState(Math.PI / 4);
  const [amplitude, setAmplitude] = useState(1);
  const [period, setPeriod] = useState(1);
  const [showSine, setShowSine] = useState(true);
  const [showCosine, setShowCosine] = useState(true);
  const [showTriangle, setShowTriangle] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [explorations, setExplorations] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAnimating) {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      return;
    }

    const tick = () => {
      setAngle((prev) => (prev + 0.03) % TAU);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [isAnimating]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setExplorations((prev) => Math.min(prev + 1, 4));
    }, 2500);
    return () => window.clearTimeout(t);
  }, [angle, amplitude, period]);

  const sinValue = Math.sin(angle);
  const cosValue = Math.cos(angle);
  const tanValue = Math.abs(cosValue) < 1e-6 ? null : sinValue / cosValue;
  const angleDeg = (angle * 180) / Math.PI;

  const unitCircle = useMemo(() => circlePoints(260), []);
  const circleBounds = useMemo(() => ({ xMin: -1.4, xMax: 1.4, yMin: -1.4, yMax: 1.4 }), []);

  const waveYSpan = Math.max(1.25, amplitude * 1.25);
  const waveBounds = useMemo(
    () => ({ xMin: 0, xMax: TAU, yMin: -waveYSpan, yMax: waveYSpan }),
    [waveYSpan]
  );

  const sineWave = useMemo(
    () => sampleFunction((x) => amplitude * Math.sin(period * x), 0, TAU, 340),
    [amplitude, period]
  );
  const cosineWave = useMemo(
    () => sampleFunction((x) => amplitude * Math.cos(period * x), 0, TAU, 340),
    [amplitude, period]
  );

  const waveSinAtAngle = amplitude * Math.sin(period * angle);
  const waveCosAtAngle = amplitude * Math.cos(period * angle);

  const canTakeQuiz = explorations >= 3;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #00BCD4, #7C4DFF)' }}>
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
            <div className="vl-card-title">Readouts</div>
            <div className="vl-card-subtitle">Angle and unit-circle values update live.</div>
            <div className="vl-readouts" style={{ marginTop: 12 }}>
              <div className="vl-readout">
                <div className="vl-readout-label">Angle</div>
                <div className="vl-readout-value">
                  {roundTo(angleDeg, 1)}deg ({roundTo(angle, 3)} rad)
                </div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">sin(theta)</div>
                <div className="vl-readout-value">{roundTo(sinValue, 4)}</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">cos(theta)</div>
                <div className="vl-readout-value">{roundTo(cosValue, 4)}</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">tan(theta)</div>
                <div className="vl-readout-value">{tanValue === null ? 'Infinity' : roundTo(tanValue, 4)}</div>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Controls</div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">Angle (theta)</div>
              <input
                className="vl-range"
                type="range"
                min={0}
                max={TAU}
                step={0.005}
                value={angle}
                onChange={(e) => setAngle(clamp(Number(e.target.value), 0, TAU))}
              />
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Amplitude (A)</div>
              <input
                className="vl-range"
                type="range"
                min={0.25}
                max={2}
                step={0.05}
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
              />
              <div className="vl-card-subtitle">A = {roundTo(amplitude, 2)}</div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Period multiplier (B)</div>
              <input
                className="vl-range"
                type="range"
                min={0.5}
                max={3}
                step={0.05}
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              />
              <div className="vl-card-subtitle">Wave uses y = A sin(Bx), y = A cos(Bx)</div>
            </div>

            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${showSine ? 'active' : ''}`} onClick={() => setShowSine((p) => !p)}>
                Sine
              </button>
              <button type="button" className={`vl-tab ${showCosine ? 'active' : ''}`} onClick={() => setShowCosine((p) => !p)}>
                Cosine
              </button>
              <button type="button" className={`vl-tab ${showTriangle ? 'active' : ''}`} onClick={() => setShowTriangle((p) => !p)}>
                Triangle
              </button>
            </div>

            <div className="vl-row">
              <button type="button" className="vl-btn secondary" onClick={() => setIsAnimating((p) => !p)}>
                {isAnimating ? <Pause size={16} /> : <Play size={16} />} {isAnimating ? 'Pause' : 'Animate'}
              </button>
              <button
                type="button"
                className="vl-btn secondary"
                onClick={() => {
                  setIsAnimating(false);
                  setAngle(Math.PI / 4);
                  setAmplitude(1);
                  setPeriod(1);
                }}
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>

            <div className="vl-section" style={{ marginTop: 14 }}>
              <div className="vl-section-title">Special angles</div>
              <div className="vl-tab-row">
                {SPECIAL_ANGLES.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    className="vl-tab"
                    onClick={() => {
                      setIsAnimating(false);
                      setAngle(a.value % TAU);
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Explore the unit circle and waves to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Explore more (${explorations}/3)`}
            </button>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unit circle</div>
            <div className="vl-card-subtitle">cos(theta) is x, sin(theta) is y.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={circleBounds}
                curves={[{ id: 'circle', color: '#00E5FF', points: unitCircle, width: 3 }]}
                lines={
                  showTriangle
                    ? [
                        { id: 'cos', color: '#2979FF', p1: { x: 0, y: 0 }, p2: { x: cosValue, y: 0 }, width: 3 },
                        { id: 'sin', color: '#FF5252', p1: { x: cosValue, y: 0 }, p2: { x: cosValue, y: sinValue }, width: 3 },
                        { id: 'hyp', color: 'rgba(255,255,255,0.45)', p1: { x: 0, y: 0 }, p2: { x: cosValue, y: sinValue }, dashed: true, width: 2 },
                      ]
                    : [{ id: 'radius', color: 'rgba(255,255,255,0.45)', p1: { x: 0, y: 0 }, p2: { x: cosValue, y: sinValue }, width: 3 }]
                }
                markers={[{ id: 'p', color: '#FFD93D', p: { x: cosValue, y: sinValue }, r: 6, label: 'P' }]}
              />
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Sine/cosine waves</div>
            <div className="vl-card-subtitle">Cursor x is theta. Wave values use A and B.</div>
            <div className="vl-canvas-wrap">
              <GraphSvg
                bounds={waveBounds}
                curves={[
                  ...(showSine ? [{ id: 'sin', color: '#FF5252', points: sineWave, width: 3 }] : []),
                  ...(showCosine ? [{ id: 'cos', color: '#2979FF', points: cosineWave, width: 3 }] : []),
                ]}
                lines={[{ id: 'cursor', color: 'rgba(255,255,255,0.24)', p1: { x: angle, y: waveBounds.yMin }, p2: { x: angle, y: waveBounds.yMax }, dashed: true, width: 2 }]}
                markers={[
                  ...(showSine ? [{ id: 's', color: '#FF5252', p: { x: angle, y: waveSinAtAngle }, r: 5, label: '' }] : []),
                  ...(showCosine ? [{ id: 'c', color: '#2979FF', p: { x: angle, y: waveCosAtAngle }, r: 5, label: '' }] : []),
                ]}
              />
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
              At theta: sin(Bx)*A = <strong>{roundTo(waveSinAtAngle, 4)}</strong> • cos(Bx)*A ={' '}
              <strong>{roundTo(waveCosAtAngle, 4)}</strong>
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

