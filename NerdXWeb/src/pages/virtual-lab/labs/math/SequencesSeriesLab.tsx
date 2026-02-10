import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { roundTo } from './graphing';

type Mode = 'arithmetic' | 'geometric';

function sumArithmetic(a: number, d: number, n: number): number {
  return (n / 2) * (2 * a + (n - 1) * d);
}

function sumGeometric(a: number, r: number, n: number): number {
  if (Math.abs(r - 1) < 1e-9) return a * n;
  return (a * (1 - Math.pow(r, n))) / (1 - r);
}

export function SequencesSeriesLab({ simulation }: { simulation: SimulationMetadata }) {
  const [mode, setMode] = useState<Mode>('arithmetic');
  const [firstTerm, setFirstTerm] = useState(2);
  const [commonDiff, setCommonDiff] = useState(3);
  const [commonRatio, setCommonRatio] = useState(2);
  const [numTerms, setNumTerms] = useState(8);
  const [quizOpen, setQuizOpen] = useState(false);

  const sequence = useMemo(() => {
    const seq: number[] = [];
    for (let i = 0; i < numTerms; i += 1) {
      if (mode === 'arithmetic') seq.push(firstTerm + i * commonDiff);
      else seq.push(firstTerm * Math.pow(commonRatio, i));
    }
    return seq;
  }, [commonDiff, commonRatio, firstTerm, mode, numTerms]);

  const sum = useMemo(() => {
    if (mode === 'arithmetic') return sumArithmetic(firstTerm, commonDiff, numTerms);
    return sumGeometric(firstTerm, commonRatio, numTerms);
  }, [commonDiff, commonRatio, firstTerm, mode, numTerms]);

  const infiniteSum = useMemo(() => {
    if (mode !== 'geometric') return null;
    if (Math.abs(commonRatio) >= 1) return null;
    return firstTerm / (1 - commonRatio);
  }, [commonRatio, firstTerm, mode]);

  const barMeta = useMemo(() => {
    const shown = sequence.slice(0, Math.min(10, sequence.length));
    const min = Math.min(...shown, 0);
    const max = Math.max(...shown, 1);
    const range = max - min || 1;
    return { shown, min, max, range };
  }, [sequence]);

  const modeAccent = mode === 'arithmetic' ? '#42A5F5' : '#AB47BC';

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: `linear-gradient(135deg, ${modeAccent}, #FF9800)` }}>
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
            <div className="vl-card-title">Mode</div>
            <div className="vl-card-subtitle">Arithmetic adds a constant d. Geometric multiplies by a constant r.</div>
            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${mode === 'arithmetic' ? 'active' : ''}`} onClick={() => setMode('arithmetic')}>
                Arithmetic
              </button>
              <button type="button" className={`vl-tab ${mode === 'geometric' ? 'active' : ''}`} onClick={() => setMode('geometric')}>
                Geometric
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">First terms</div>
            <div className="vl-card-subtitle">Showing the first {Math.min(10, sequence.length)} terms.</div>
            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {sequence.slice(0, 10).map((v, idx) => (
                <span
                  key={`t-${idx}`}
                  className="vl-badge ok"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  T{idx + 1} = {roundTo(v, 3)}
                </span>
              ))}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Chart</div>
            <div className="vl-card-subtitle">Bars scale between the minimum and maximum visible terms.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 220" role="img" aria-label="Sequence chart">
                <rect x="14" y="14" width="532" height="192" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                {barMeta.shown.map((val, idx) => {
                  const barW = 44;
                  const gap = 10;
                  const x = 30 + idx * (barW + gap);
                  const barH = ((val - barMeta.min) / barMeta.range) * 140;
                  const y = 180 - barH;
                  return (
                    <g key={`bar-${idx}`}>
                      <rect x={x} y={y} width={barW} height={barH} rx="8" fill={modeAccent} opacity="0.75" />
                      <text x={x + barW / 2} y="200" fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontWeight={900}>
                        {idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Controls</div>
            <div className="vl-editor-row">
              <div className="vl-editor-label">First term (a): {firstTerm}</div>
              <input className="vl-range" type="range" min={-5} max={10} step={1} value={firstTerm} onChange={(e) => setFirstTerm(Number(e.target.value))} />
            </div>

            {mode === 'arithmetic' ? (
              <div className="vl-editor-row">
                <div className="vl-editor-label">Common difference (d): {commonDiff}</div>
                <input className="vl-range" type="range" min={-5} max={10} step={1} value={commonDiff} onChange={(e) => setCommonDiff(Number(e.target.value))} />
              </div>
            ) : (
              <div className="vl-editor-row">
                <div className="vl-editor-label">Common ratio (r): {roundTo(commonRatio, 1)}</div>
                <input
                  className="vl-range"
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={commonRatio}
                  onChange={(e) => setCommonRatio(roundTo(Number(e.target.value), 1))}
                />
              </div>
            )}

            <div className="vl-editor-row">
              <div className="vl-editor-label">Number of terms (n): {numTerms}</div>
              <input className="vl-range" type="range" min={3} max={15} step={1} value={numTerms} onChange={(e) => setNumTerms(Number(e.target.value))} />
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Formulas</div>
            <div className="vl-card-subtitle">
              nth term: <strong>{mode === 'arithmetic' ? `Tn = a + (n-1)*d` : `Tn = a * r^(n-1)`}</strong>
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
              sum: <strong>{mode === 'arithmetic' ? `Sn = n/2 * (2a + (n-1)d)` : `Sn = a(1 - r^n)/(1 - r)`}</strong>
            </div>
            <div className="vl-readouts" style={{ marginTop: 12 }}>
              <div className="vl-readout">
                <div className="vl-readout-label">S{numTerms}</div>
                <div className="vl-readout-value">{Math.abs(sum) > 10000 ? sum.toExponential(2) : roundTo(sum, 3)}</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">S infinity</div>
                <div className="vl-readout-value">{infiniteSum === null ? 'N/A' : roundTo(infiniteSum, 4)}</div>
              </div>
            </div>
            {mode === 'geometric' && Math.abs(commonRatio) >= 1 ? (
              <div className="vl-check-result fail" style={{ marginTop: 12 }}>
                Geometric series diverges because |r| is greater than or equal to 1.
              </div>
            ) : null}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Try a few sequences, then test yourself.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)}>
              <Sparkles size={16} /> Start knowledge check
            </button>
          </div>
        </div>

        <div className="vl-col">
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

