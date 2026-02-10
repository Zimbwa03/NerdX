import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Atom, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type Element = { atomicNumber: number; symbol: string; name: string; mass: number };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function electronConfig(electrons: number): number[] {
  const shellMax = [2, 8, 8, 18, 18, 32];
  const config: number[] = [];
  let remaining = electrons;
  for (let i = 0; i < shellMax.length && remaining > 0; i += 1) {
    const shellElectrons = Math.min(remaining, shellMax[i]);
    config.push(shellElectrons);
    remaining -= shellElectrons;
  }
  return config;
}

export function AtomBuilderLab({ simulation }: { simulation: SimulationMetadata }) {
  const [elements, setElements] = useState<Element[]>([]);
  const [protons, setProtons] = useState(0);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(0);
  const [built, setBuilt] = useState<number[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const mod = await import('../../../data/virtualLab/simulationsData');
      if (!active) return;
      setElements(mod.ELEMENTS as Element[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  const atomicNumber = protons;
  const massNumber = protons + neutrons;
  const element = elements.find((e) => e.atomicNumber === protons);
  const isNeutral = protons === electrons;
  const isValidElement = protons > 0 && protons <= 20;
  const isStable = isNeutral && isValidElement;

  useEffect(() => {
    if (!isStable || !element) return;
    setBuilt((prev) => (prev.includes(protons) ? prev : [...prev, protons]));
  }, [element, isStable, protons]);

  const config = useMemo(() => electronConfig(electrons), [electrons]);
  const canTakeQuiz = built.length >= 3;

  const reset = () => {
    setProtons(0);
    setNeutrons(0);
    setElectrons(0);
  };

  const nucleusParticles = useMemo(() => {
    const particles: Array<{ x: number; y: number; color: string; stroke: string; key: string }> = [];
    const centerX = 160;
    const centerY = 160;
    const nucleusRadius = 42;
    const particleRadius = 6;
    const total = protons + neutrons;
    if (total <= 0) return particles;

    for (let i = 0; i < Math.min(protons, 20); i += 1) {
      const angle = (i / total) * Math.PI * 2;
      const r = Math.min(nucleusRadius - particleRadius, Math.sqrt(i + 1) * 8);
      const x = centerX + Math.cos(angle) * r * (i % 3 === 0 ? 0.55 : 1);
      const y = centerY + Math.sin(angle) * r * (i % 3 === 0 ? 0.55 : 1);
      particles.push({ x, y, color: '#F44336', stroke: '#D32F2F', key: `p-${i}` });
    }

    for (let i = 0; i < Math.min(neutrons, 20); i += 1) {
      const angle = ((i + protons) / total) * Math.PI * 2 + 0.25;
      const r = Math.min(nucleusRadius - particleRadius, Math.sqrt(i + protons + 1) * 7);
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      particles.push({ x, y, color: '#9E9E9E', stroke: '#757575', key: `n-${i}` });
    }

    return particles;
  }, [neutrons, protons]);

  const shells = useMemo(() => {
    const centerX = 160;
    const centerY = 160;
    const shellRadii = [70, 110, 150];
    const out: Array<{ cx: number; cy: number; r: number; key: string }> = [];
    config.forEach((count, shellIndex) => {
      if (shellIndex >= shellRadii.length || count <= 0) return;
      const radius = shellRadii[shellIndex];
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        out.push({
          cx: centerX + Math.cos(angle) * radius,
          cy: centerY + Math.sin(angle) * radius,
          r: 8,
          key: `e-${shellIndex}-${i}`,
        });
      }
    });
    return out;
  }, [config]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #F44336)' }}>
            <Atom size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Build an atom</div>
            <div className="vl-card-subtitle">Add protons, neutrons, and electrons. Try to make a neutral (stable) atom.</div>

            <div className="vl-counter-grid">
              {[
                { label: 'Protons', value: protons, set: setProtons, min: 0, max: 20, accent: '#F44336' },
                { label: 'Neutrons', value: neutrons, set: setNeutrons, min: 0, max: 30, accent: '#9E9E9E' },
                { label: 'Electrons', value: electrons, set: setElectrons, min: 0, max: 30, accent: '#2196F3' },
              ].map((c) => (
                <div key={c.label} className="vl-counter">
                  <div className="vl-counter-label">{c.label}</div>
                  <div className="vl-counter-controls">
                    <button type="button" className="vl-btn secondary" onClick={() => c.set((v) => clamp(v - 1, c.min, c.max))}>
                      <Minus size={16} />
                    </button>
                    <div className="vl-counter-value" style={{ color: c.accent }}>
                      {c.value}
                    </div>
                    <button type="button" className="vl-btn secondary" onClick={() => c.set((v) => clamp(v + 1, c.min, c.max))}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="vl-row">
              <button type="button" className="vl-btn secondary" onClick={reset}>
                <RotateCcw size={16} /> Reset
              </button>
              <button type="button" className="vl-btn primary" disabled={!canTakeQuiz} onClick={() => setQuizOpen(true)}>
                <Sparkles size={16} /> {canTakeQuiz ? 'Knowledge check' : 'Build 3 stable atoms'}
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Stats</div>
            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Atomic number</div>
                <div className="vl-stat-value">{atomicNumber}</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Mass number</div>
                <div className="vl-stat-value">{massNumber}</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Charge</div>
                <div className="vl-stat-value">{protons - electrons}</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Stability</div>
                <div className={`vl-stat-value ${isStable ? 'ok' : ''}`}>{isStable ? 'Neutral' : 'Unstable'}</div>
              </div>
            </div>

            <div className="vl-explanation">
              <strong>Element:</strong> {element ? `${element.name} (${element.symbol})` : '—'}{' '}
              {!isValidElement && protons > 0 ? '(supported 1–20)' : ''}
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Atom diagram</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 320 320" role="img" aria-label="Atom diagram">
                <circle cx="160" cy="160" r="48" fill="rgba(255,255,255,0.06)" />

                {config.slice(0, 3).map((_, idx) => (
                  <circle
                    key={`orbit-${idx}`}
                    cx="160"
                    cy="160"
                    r={[70, 110, 150][idx]}
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                  />
                ))}

                {shells.map((e) => (
                  <circle key={e.key} cx={e.cx} cy={e.cy} r={e.r} fill="#2196F3" stroke="#1565C0" strokeWidth="2" />
                ))}

                {nucleusParticles.map((p) => (
                  <circle key={p.key} cx={p.x} cy={p.y} r="6" fill={p.color} stroke={p.stroke} strokeWidth="1" />
                ))}

                {protons > 0 && (
                  <text x="160" y="168" textAnchor="middle" fontSize="34" fill="rgba(255,255,255,0.92)" fontWeight="900">
                    {element?.symbol ?? '?'}
                  </text>
                )}
              </svg>
            </div>

            <div className="vl-card-subtitle">
              Electron configuration: {config.length ? config.join(', ') : '—'}
            </div>

            <div className="vl-card-subtitle">
              Stable elements built: {built.length ? built.map((n) => elements.find((e) => e.atomicNumber === n)?.symbol ?? n).join(', ') : '—'}
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

