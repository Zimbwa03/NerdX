import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, RefreshCw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';
import { roundTo } from './graphing';

type Highlight = 'mean' | 'median' | 'mode' | 'none';

function safeParseNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function StatisticsExplorerLab({ simulation }: { simulation: SimulationMetadata }) {
  const [dataPoints, setDataPoints] = useState<number[]>([4, 7, 2, 9, 4, 5, 8]);
  const [inputValue, setInputValue] = useState('');
  const [highlight, setHighlight] = useState<Highlight>('none');
  const [quizOpen, setQuizOpen] = useState(false);

  const stats = useMemo(() => {
    if (!dataPoints.length) return null;
    const sorted = [...dataPoints].sort((a, b) => a - b);
    const sum = dataPoints.reduce((a, b) => a + b, 0);
    const mean = sum / dataPoints.length;

    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    const freq = new Map<number, number>();
    let maxFreq = 0;
    for (const v of dataPoints) {
      const next = (freq.get(v) ?? 0) + 1;
      freq.set(v, next);
      maxFreq = Math.max(maxFreq, next);
    }
    const modes = Array.from(freq.entries())
      .filter(([, f]) => f === maxFreq)
      .map(([v]) => v)
      .sort((a, b) => a - b);

    const variance = dataPoints.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / dataPoints.length;
    const stdDev = Math.sqrt(variance);
    const range = sorted[sorted.length - 1] - sorted[0];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return { sorted, mean, median, modes, variance, stdDev, range, min, max };
  }, [dataPoints]);

  const canTakeQuiz = dataPoints.length >= 5;

  const addDataPoint = () => {
    const n = safeParseNumber(inputValue);
    if (n === null) return;
    if (n < 0 || n > 100) return;
    setDataPoints((prev) => [...prev, n]);
    setInputValue('');
  };

  const removeDataPoint = (index: number) => {
    setDataPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const resetToDefault = () => {
    setDataPoints([4, 7, 2, 9, 4, 5, 8]);
    setHighlight('none');
  };

  const addRandomOutlier = () => {
    const outlier = Math.random() > 0.5 ? 95 + randInt(0, 4) : randInt(0, 2);
    setDataPoints((prev) => [...prev, outlier]);
  };

  const chart = useMemo(() => {
    if (!stats) return null;
    const w = 560;
    const h = 220;
    const padX = 44;
    const padTop = 22;
    const padBottom = 30;
    const plotW = w - padX * 2;
    const plotH = h - padTop - padBottom;
    const range = stats.max - stats.min || 1;
    const points = dataPoints.map((value, index) => {
      const t = dataPoints.length <= 1 ? 0.5 : index / (dataPoints.length - 1);
      const x = padX + t * plotW;
      const y = padTop + (1 - (value - stats.min) / range) * plotH;
      return { value, x, y };
    });
    const yOf = (v: number) => padTop + (1 - (v - stats.min) / range) * plotH;
    return { w, h, padX, padTop, padBottom, plotW, plotH, points, yOf };
  }, [dataPoints, stats]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #66BB6A, #4CAF50)' }}>
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
            <div className="vl-card-title">Your data set</div>
            <div className="vl-card-subtitle">Add values (0-100). Click a chip to remove it.</div>
            <div className="vl-row" style={{ justifyContent: 'flex-start', marginTop: 10 }}>
              <input
                className="vl-select"
                type="number"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ maxWidth: 220 }}
              />
              <button type="button" className="vl-btn primary" onClick={addDataPoint}>
                Add
              </button>
              <button type="button" className="vl-btn secondary" onClick={addRandomOutlier}>
                Add outlier
              </button>
              <button type="button" className="vl-btn secondary" onClick={resetToDefault}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>
            <div className="vl-seq-chips" style={{ marginTop: 12 }}>
              {dataPoints.map((v, idx) => (
                <button key={`d-${idx}`} type="button" className="vl-chip" onClick={() => removeDataPoint(idx)}>
                  {roundTo(v, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Data visualization</div>
            <div className="vl-card-subtitle">Tap mean/median/mode cards to highlight them.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 220" role="img" aria-label="Statistics chart">
                <rect x="14" y="14" width="532" height="192" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

                {stats && chart ? (
                  <>
                    {highlight === 'mean' ? (
                      <line
                        x1={chart.padX}
                        y1={chart.yOf(stats.mean)}
                        x2={chart.padX + chart.plotW}
                        y2={chart.yOf(stats.mean)}
                        stroke="#FF9800"
                        strokeWidth={2}
                        strokeDasharray="8 6"
                      />
                    ) : null}
                    {highlight === 'median' ? (
                      <line
                        x1={chart.padX}
                        y1={chart.yOf(stats.median)}
                        x2={chart.padX + chart.plotW}
                        y2={chart.yOf(stats.median)}
                        stroke="#4CAF50"
                        strokeWidth={2}
                        strokeDasharray="8 6"
                      />
                    ) : null}

                    {chart.points.map((p, idx) => {
                      const isMode = highlight === 'mode' && stats.modes.includes(p.value);
                      const fill = isMode ? '#E91E63' : '#66BB6A';
                      return (
                        <g key={`p-${idx}`}>
                          <circle cx={p.x} cy={p.y} r={11} fill={fill} stroke="#fff" strokeWidth={2} />
                          <text x={p.x} y={p.y + 4} fontSize={9} textAnchor="middle" fill="#fff" fontWeight={900}>
                            {roundTo(p.value, 2)}
                          </text>
                        </g>
                      );
                    })}
                  </>
                ) : null}
              </svg>
            </div>
          </div>

          {stats ? (
            <div className="vl-card">
              <div className="vl-card-title">Measures</div>
              <div className="vl-card-subtitle">Mean, median, and mode capture the center in different ways.</div>
              <div className="vl-counter-grid">
                <button
                  type="button"
                  className="vl-counter"
                  onClick={() => setHighlight((prev) => (prev === 'mean' ? 'none' : 'mean'))}
                  style={{
                    borderColor: highlight === 'mean' ? 'rgba(255,152,0,0.38)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="vl-counter-label">Mean</div>
                  <div style={{ marginTop: 6, fontWeight: 900, color: '#FF9800', fontSize: 18 }}>{roundTo(stats.mean, 3)}</div>
                </button>

                <button
                  type="button"
                  className="vl-counter"
                  onClick={() => setHighlight((prev) => (prev === 'median' ? 'none' : 'median'))}
                  style={{
                    borderColor: highlight === 'median' ? 'rgba(76,175,80,0.35)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="vl-counter-label">Median</div>
                  <div style={{ marginTop: 6, fontWeight: 900, color: '#4CAF50', fontSize: 18 }}>{roundTo(stats.median, 3)}</div>
                </button>

                <button
                  type="button"
                  className="vl-counter"
                  onClick={() => setHighlight((prev) => (prev === 'mode' ? 'none' : 'mode'))}
                  style={{
                    borderColor: highlight === 'mode' ? 'rgba(233,30,99,0.32)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="vl-counter-label">Mode(s)</div>
                  <div style={{ marginTop: 6, fontWeight: 900, color: '#E91E63', fontSize: 16 }}>{stats.modes.map((m) => roundTo(m, 2)).join(', ')}</div>
                </button>
              </div>

              <div className="vl-counter-grid">
                <div className="vl-counter">
                  <div className="vl-counter-label">Std dev</div>
                  <div style={{ marginTop: 6, fontWeight: 900, color: '#fff', fontSize: 18 }}>{roundTo(stats.stdDev, 3)}</div>
                </div>
                <div className="vl-counter">
                  <div className="vl-counter-label">Variance</div>
                  <div style={{ marginTop: 6, fontWeight: 900, color: '#fff', fontSize: 18 }}>{roundTo(stats.variance, 3)}</div>
                </div>
                <div className="vl-counter">
                  <div className="vl-counter-label">Range</div>
                  <div style={{ marginTop: 6, fontWeight: 900, color: '#fff', fontSize: 18 }}>{roundTo(stats.range, 3)}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Keep at least 5 data points to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Add more (${dataPoints.length}/5)`}
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

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

