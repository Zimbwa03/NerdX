import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TestTubes } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type Substance = {
  id: string;
  name: string;
  ph: number;
  category: 'acid' | 'neutral' | 'alkali';
  color: string;
};

const PH_COLORS = [
  '#FF0000',
  '#FF2200',
  '#FF4400',
  '#FF6600',
  '#FF9900',
  '#FFCC00',
  '#DDDD00',
  '#00CC00',
  '#00DDAA',
  '#00BBDD',
  '#00AAFF',
  '#0066FF',
  '#0033FF',
  '#6600FF',
  '#9900FF',
];

function getPHColor(ph: number): string {
  const index = Math.max(0, Math.min(14, Math.round(ph)));
  return PH_COLORS[index];
}

export function PHScaleExplorerLab({ simulation }: { simulation: SimulationMetadata }) {
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [selected, setSelected] = useState<Substance | null>(null);
  const [tested, setTested] = useState<Set<string>>(() => new Set());
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const mod = await import('../../../data/virtualLab/simulationsData');
      if (!active) return;
      setSubstances(mod.PH_SUBSTANCES as Substance[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  const canTakeQuiz = tested.size >= 5;
  const selectedColor = selected ? getPHColor(selected.ph) : '#E3F2FD';

  const legend = useMemo(
    () => [
      { label: 'Acid (0-6)', color: '#FF4400' },
      { label: 'Neutral (7)', color: '#00CC00' },
      { label: 'Alkali (8-14)', color: '#0066FF' },
    ],
    []
  );

  const pick = (s: Substance) => {
    setSelected(s);
    setTested((prev) => new Set([...prev, s.id]));
  };

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #673AB7, #3F51B5)' }}>
            <TestTubes size={28} />
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
            <div className="vl-card-title">pH Scale</div>
            <div className="vl-card-subtitle">Click a substance to test it with universal indicator.</div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 140" role="img" aria-label="pH scale">
                <defs>
                  <linearGradient id="phGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    {PH_COLORS.map((c, idx) => (
                      <stop key={c} offset={`${(idx / 14) * 100}%`} stopColor={c} />
                    ))}
                  </linearGradient>
                </defs>
                <rect x="40" y="45" width="480" height="28" rx="8" fill="url(#phGradient)" />
                {Array.from({ length: 15 }, (_, n) => (
                  <g key={`t-${n}`}>
                    <line x1={40 + (n / 14) * 480} y1="73" x2={40 + (n / 14) * 480} y2="86" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    <text x={40 + (n / 14) * 480} y="112" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="12" fontWeight="800">
                      {n}
                    </text>
                  </g>
                ))}
                {selected && (
                  <g>
                    <circle cx={40 + (selected.ph / 14) * 480} cy="59" r="14" fill={selectedColor} stroke="#fff" strokeWidth="4" />
                    <text x={40 + (selected.ph / 14) * 480} y="30" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="13" fontWeight="900">
                      pH {selected.ph}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className="vl-row" style={{ marginTop: 10, gap: 12, flexWrap: 'wrap' }}>
              {legend.map((l) => (
                <div key={l.label} className="vl-pill-mini" style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(10,14,33,0.25)', color: 'rgba(255,255,255,0.86)' }}>
                  <span className="vl-dot" style={{ background: l.color }} aria-hidden="true" /> {l.label}
                </div>
              ))}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Substances</div>
            <div className="vl-card-subtitle">Test at least 5 to unlock the knowledge check.</div>
            {substances.length === 0 ? (
              <div className="vl-card-subtitle">Loading...</div>
            ) : (
              <div className="vl-template-list">
                {substances.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`vl-template-btn ${selected?.id === s.id ? 'active' : ''}`}
                    onClick={() => pick(s)}
                  >
                    <div className="vl-template-title">
                      <span className="vl-dot" style={{ background: getPHColor(s.ph) }} aria-hidden="true" />
                      {s.name}
                      {tested.has(s.id) && <span className="vl-pill-mini">tested</span>}
                    </div>
                    <div className="vl-template-desc">
                      Category: <strong>{s.category}</strong> (pH {s.ph})
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Test Result</div>
            {selected ? (
              <div className="vl-explanation ok" style={{ marginTop: 10 }}>
                <strong>{selected.name}</strong>
                <br />
                pH {selected.ph} ({selected.category}) using universal indicator.
              </div>
            ) : (
              <div className="vl-card-subtitle">Select a substance to view its pH.</div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Test 5 substances. Progress: {Math.min(tested.size, 5)} / 5.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Keep testing'}
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Facts</div>
            <ul className="vl-bullets">
              <li>pH stands for potential of hydrogen.</li>
              <li>pH 0-6: acidic (more H+ ions).</li>
              <li>pH 7: neutral.</li>
              <li>pH 8-14: alkaline (more OH- ions).</li>
              <li>Each pH step is a 10x change in H+ concentration.</li>
            </ul>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

