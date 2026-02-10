import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, Waves } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type WaveType = 'transverse' | 'longitudinal';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function transversePath(width: number, height: number, wavelength: number, amplitude: number, phase: number): string {
  const mid = height / 2;
  const step = 4;
  const pts: string[] = [];
  for (let x = 0; x <= width; x += step) {
    const y = mid - amplitude * Math.sin((2 * Math.PI * x) / wavelength + phase);
    pts.push(`${pts.length === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  return pts.join(' ');
}

function longitudinalParticles(width: number, wavelength: number, amplitude: number, phase: number) {
  const n = 22;
  const spacing = width / n;
  return Array.from({ length: n }).map((_, i) => {
    const baseX = i * spacing;
    const displacement = amplitude * 0.3 * Math.sin((2 * Math.PI * baseX) / wavelength + phase);
    return { x: baseX + displacement, compressed: displacement < 0 };
  });
}

export function WavePropertiesLab({ simulation }: { simulation: SimulationMetadata }) {
  const [waveType, setWaveType] = useState<WaveType>('transverse');
  const [wavelength, setWavelength] = useState(100);
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(1);
  const [experimentsRun, setExperimentsRun] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const phaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const width = 560;
  const height = 170;

  const [wavePath, setWavePath] = useState(() => transversePath(width, height, wavelength, amplitude, 0));
  const [particles, setParticles] = useState(() => longitudinalParticles(width, wavelength, amplitude, 0));

  const waveSpeed = useMemo(() => frequency * wavelength, [frequency, wavelength]);
  const period = useMemo(() => (frequency > 0 ? 1 / frequency : 0), [frequency]);

  useEffect(() => {
    const animate = () => {
      phaseRef.current += 0.05 * frequency;
      if (waveType === 'transverse') {
        setWavePath(transversePath(width, height, wavelength, amplitude, phaseRef.current));
      } else {
        setParticles(longitudinalParticles(width, wavelength, amplitude, phaseRef.current));
      }
      rafRef.current = window.requestAnimationFrame(animate);
    };
    rafRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [amplitude, frequency, wavelength, waveType]);

  const record = () => setExperimentsRun((p) => clamp(p + 1, 0, 5));
  const canTakeQuiz = experimentsRun >= 3;

  const reset = () => {
    phaseRef.current = 0;
    setExperimentsRun(0);
  };

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #1565C0)' }}>
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
            <div className="vl-card-title">Wave Type</div>
            <div className="vl-card-subtitle">Transverse: particles move up/down. Longitudinal: compressions/rarefactions.</div>
            <div className="vl-tab-row" role="tablist" aria-label="Wave type">
              <button type="button" className={`vl-tab ${waveType === 'transverse' ? 'active' : ''}`} onClick={() => setWaveType('transverse')}>
                Transverse
              </button>
              <button type="button" className={`vl-tab ${waveType === 'longitudinal' ? 'active' : ''}`} onClick={() => setWaveType('longitudinal')}>
                Longitudinal
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Visualization</div>
            <div className="vl-card-subtitle">Wave direction {'\u2192'}</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Wave visualization">
                <rect x="0" y="0" width={width} height={height} rx="18" fill="rgba(10, 14, 33, 0.18)" />
                {waveType === 'transverse' ? (
                  <>
                    <path d={wavePath} stroke="#00E676" strokeWidth="4" fill="none" />
                    <line x1="40" y1={height - 22} x2="520" y2={height - 22} stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
                    <polygon points={`520,${height - 22} 506,${height - 30} 506,${height - 14}`} fill="rgba(255,255,255,0.22)" />
                  </>
                ) : (
                  <>
                    <line x1="40" y1={height / 2} x2="520" y2={height / 2} stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
                    {particles.map((p, i) => (
                      <circle
                        key={`p-${i}`}
                        cx={clamp(p.x, 10, width - 10)}
                        cy={height / 2}
                        r={p.compressed ? 7 : 5}
                        fill={p.compressed ? '#FF9800' : '#00BCD4'}
                        opacity={p.compressed ? 0.95 : 0.7}
                      />
                    ))}
                    <polygon points={`520,${height / 2} 506,${height / 2 - 8} 506,${height / 2 + 8}`} fill="rgba(255,255,255,0.22)" />
                  </>
                )}
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Controls</div>
            <div className="vl-controls" style={{ marginTop: 12 }}>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Wavelength (lambda)</span>
                  <span className="vl-control-value">{wavelength}px</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={40}
                  max={200}
                  step={1}
                  value={wavelength}
                  onChange={(e) => setWavelength(Number(e.target.value))}
                />
              </div>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Amplitude</span>
                  <span className="vl-control-value">{amplitude}px</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={10}
                  max={60}
                  step={1}
                  value={amplitude}
                  onChange={(e) => setAmplitude(Number(e.target.value))}
                />
              </div>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Frequency</span>
                  <span className="vl-control-value">{frequency.toFixed(1)} Hz</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="vl-row" style={{ marginTop: 12 }}>
              <button type="button" className="vl-btn secondary" onClick={record}>
                Record observation ({experimentsRun}/5)
              </button>
              <button type="button" className="vl-btn secondary" onClick={reset}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Wave Equation</div>
            <div className="vl-card-subtitle">v = f * lambda</div>
            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Speed</div>
                <div className="vl-stat-value ok">{waveSpeed.toFixed(0)} units/s</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Period (T)</div>
                <div className="vl-stat-value">{period.toFixed(2)} s</div>
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Record at least 3 observations. Progress: {Math.min(experimentsRun, 3)} / 3.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Record more'}
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
