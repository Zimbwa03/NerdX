import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Beaker, Droplet, RefreshCw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type Indicator = 'phenolphthalein' | 'methyl-orange';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function TitrationMasterLab({ simulation }: { simulation: SimulationMetadata }) {
  const [indicator, setIndicator] = useState<Indicator>('phenolphthalein');
  const [titrantAdded, setTitrantAdded] = useState(0); // mL
  const [titreValues, setTitreValues] = useState<number[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);

  const ENDPOINT = 25;
  const atEndpoint = titrantAdded >= ENDPOINT && titrantAdded <= ENDPOINT + 1;
  const pastEndpoint = titrantAdded > ENDPOINT + 1;

  const solutionColor = useMemo(() => {
    if (indicator === 'phenolphthalein') {
      if (titrantAdded < ENDPOINT) return '#FFEBEE';
      if (atEndpoint) return '#F48FB1';
      return '#EC407A';
    }
    if (titrantAdded < ENDPOINT) return '#F44336';
    if (atEndpoint) return '#FF9800';
    return '#FFEB3B';
  }, [atEndpoint, indicator, titrantAdded]);

  const addDrop = () => setTitrantAdded((p) => clamp(p + 0.5, 0, 50));
  const addBulk = () => setTitrantAdded((p) => clamp(p + 5, 0, 50));
  const reset = () => setTitrantAdded(0);
  const recordTitre = () => {
    if (titrantAdded <= 0) return;
    setTitreValues((prev) => (prev.length >= 3 ? prev : [...prev, titrantAdded]));
    setTitrantAdded(0);
  };

  const averageTitre = useMemo(() => {
    if (!titreValues.length) return '0.00';
    const avg = titreValues.reduce((a, b) => a + b, 0) / titreValues.length;
    return avg.toFixed(2);
  }, [titreValues]);

  const canTakeQuiz = titreValues.length >= 2;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #E91E63, #9C27B0)' }}>
            <Beaker size={28} />
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
            <div className="vl-card-title">Apparatus</div>
            <div className="vl-card-subtitle">Add NaOH from a burette into an acid in a conical flask.</div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 520 320" role="img" aria-label="Titration diagram">
                {/* Stand */}
                <rect x="255" y="20" width="10" height="280" fill="#5D4037" />
                <rect x="205" y="20" width="110" height="10" fill="#5D4037" />
                <rect x="220" y="298" width="80" height="10" fill="#5D4037" />

                {/* Burette */}
                <g transform="translate(305, 50)">
                  <rect x="0" y="0" width="28" height="180" rx="4" fill="rgba(227,242,253,0.85)" stroke="#90CAF9" strokeWidth="2" />
                  {/* Liquid level (simple) */}
                  <rect x="3" y={8 + titrantAdded * 3.4} width="22" height={170 - titrantAdded * 3.4} fill="rgba(187,222,251,0.95)" />
                  <text x="14" y="18" textAnchor="middle" fontSize="10" fill="#1565C0" fontWeight="800">
                    NaOH
                  </text>
                  <rect x="7" y="180" width="14" height="18" fill="#37474F" />
                  <rect x="11" y="198" width="6" height="28" fill="#37474F" />
                </g>

                {/* Flask */}
                <g transform="translate(190, 210)">
                  <path
                    d="M 60 0 L 90 0 L 105 70 Q 75 105 45 70 Z"
                    fill="rgba(255,255,255,0.22)"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2"
                  />
                  <path d="M 52 58 Q 75 86 98 58 Z" fill={solutionColor} opacity="0.85" />
                </g>

                {/* Endpoint badge */}
                {atEndpoint && (
                  <g>
                    <circle cx="420" cy="280" r="10" fill="#00E676" />
                    <text x="440" y="285" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="800">
                      Endpoint
                    </text>
                  </g>
                )}
                {pastEndpoint && (
                  <g>
                    <circle cx="420" cy="280" r="10" fill="#FF1744" />
                    <text x="440" y="285" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="800">
                      Past endpoint
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className="vl-card-subtitle" style={{ marginTop: 12 }}>
              Titrant added: <strong>{titrantAdded.toFixed(1)} mL</strong> (endpoint ~ {ENDPOINT} mL)
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Indicator</div>
            <div className="vl-card-subtitle">Choose an indicator and observe the color change at the endpoint.</div>
            <div className="vl-tab-row" role="tablist" aria-label="Indicator">
              <button
                type="button"
                className={`vl-tab ${indicator === 'phenolphthalein' ? 'active' : ''}`}
                onClick={() => setIndicator('phenolphthalein')}
              >
                Phenolphthalein
              </button>
              <button
                type="button"
                className={`vl-tab ${indicator === 'methyl-orange' ? 'active' : ''}`}
                onClick={() => setIndicator('methyl-orange')}
              >
                Methyl orange
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Controls</div>
            <div className="vl-row">
              <button type="button" className="vl-btn primary" onClick={addDrop} disabled={titrantAdded >= 50}>
                <Droplet size={16} /> Add 0.5 mL
              </button>
              <button type="button" className="vl-btn primary" onClick={addBulk} disabled={titrantAdded >= 50}>
                <Droplet size={16} /> Add 5 mL
              </button>
              <button type="button" className="vl-btn secondary" onClick={reset}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>
            <div className="vl-row" style={{ marginTop: 10 }}>
              <button type="button" className="vl-btn primary" onClick={recordTitre} disabled={titrantAdded <= 0 || titreValues.length >= 3}>
                Record titre
              </button>
              <div className="vl-card-subtitle" style={{ margin: 0 }}>
                Record up to 3 values (aim for concordant titres).
              </div>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Titre Table</div>
            {titreValues.length === 0 ? (
              <div className="vl-card-subtitle">No titres recorded yet.</div>
            ) : (
              <div className="vl-table-wrap">
                <table className="vl-table">
                  <thead>
                    <tr>
                      <th>Attempt</th>
                      <th>Titre (mL)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {titreValues.map((v, idx) => (
                      <tr key={`t-${idx}`}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 900 }}>{v.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ fontWeight: 900, color: '#FF9800' }}>Average</td>
                      <td style={{ fontWeight: 900, color: '#FF9800' }}>{averageTitre}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Record at least 2 titre values. Progress: {Math.min(titreValues.length, 2)} / 2.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Keep titrating'}
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Tip</div>
            <div className="vl-card-subtitle">Near the endpoint, add titrant dropwise for accuracy.</div>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

