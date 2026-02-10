import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, RefreshCw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type CoinSide = 'heads' | 'tails';
type Mode = 'dice' | 'coin';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ProbabilitySimulatorLab({ simulation }: { simulation: SimulationMetadata }) {
  const [mode, setMode] = useState<Mode>('dice');
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [coinResults, setCoinResults] = useState<CoinSide[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [currentDice, setCurrentDice] = useState(1);
  const [currentCoin, setCurrentCoin] = useState<CoinSide>('heads');
  const [quizOpen, setQuizOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, []);

  const diceFreq = useMemo(() => {
    const freq = [0, 0, 0, 0, 0, 0];
    for (const r of diceResults) freq[r - 1] += 1;
    return freq;
  }, [diceResults]);

  const coinFreq = useMemo(() => {
    const heads = coinResults.filter((r) => r === 'heads').length;
    return { heads, tails: coinResults.length - heads };
  }, [coinResults]);

  const maxDiceFreq = useMemo(() => Math.max(1, ...diceFreq), [diceFreq]);
  const maxCoinFreq = useMemo(() => Math.max(1, coinFreq.heads, coinFreq.tails), [coinFreq.heads, coinFreq.tails]);

  const canTakeQuiz = rollCount >= 20;

  const rollOnce = () => {
    if (isRolling) return;
    setIsRolling(true);
    setRollCount((p) => p + 1);

    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);

    if (mode === 'dice') {
      let ticks = 0;
      intervalRef.current = window.setInterval(() => {
        setCurrentDice(randInt(1, 6));
        ticks += 1;
        if (ticks >= 10) {
          if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          const finalValue = randInt(1, 6);
          setCurrentDice(finalValue);
          setDiceResults((prev) => [...prev, finalValue]);
          setIsRolling(false);
        }
      }, 80);
      return;
    }

    let flips = 0;
    intervalRef.current = window.setInterval(() => {
      setCurrentCoin((prev) => (prev === 'heads' ? 'tails' : 'heads'));
      flips += 1;
      if (flips >= 8) {
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        const finalSide: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';
        setCurrentCoin(finalSide);
        setCoinResults((prev) => [...prev, finalSide]);
        setIsRolling(false);
      }
    }, 100);
  };

  const rollMultiple = (count: number) => {
    if (isRolling) return;
    if (count <= 0) return;
    setRollCount((p) => p + count);

    if (mode === 'dice') {
      const outcomes = Array.from({ length: count }, () => randInt(1, 6));
      setDiceResults((prev) => [...prev, ...outcomes]);
      setCurrentDice(outcomes[outcomes.length - 1] ?? currentDice);
      return;
    }

    const outcomes: CoinSide[] = Array.from({ length: count }, () => (Math.random() < 0.5 ? 'heads' : 'tails'));
    setCoinResults((prev) => [...prev, ...outcomes]);
    setCurrentCoin(outcomes[outcomes.length - 1] ?? currentCoin);
  };

  const reset = () => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRolling(false);
    setDiceResults([]);
    setCoinResults([]);
    setRollCount(0);
    setCurrentDice(1);
    setCurrentCoin('heads');
  };

  const observedDice = useMemo(() => {
    if (diceResults.length === 0) return null;
    return diceFreq.map((f) => f / diceResults.length);
  }, [diceFreq, diceResults.length]);

  const observedCoin = useMemo(() => {
    if (coinResults.length === 0) return null;
    return {
      heads: coinFreq.heads / coinResults.length,
      tails: coinFreq.tails / coinResults.length,
    };
  }, [coinFreq.heads, coinFreq.tails, coinResults.length]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #AB47BC, #7B1FA2)' }}>
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
            <div className="vl-card-subtitle">Simulate random events and compare expected vs observed probability.</div>
            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              <button type="button" className={`vl-tab ${mode === 'dice' ? 'active' : ''}`} onClick={() => setMode('dice')}>
                Dice
              </button>
              <button type="button" className={`vl-tab ${mode === 'coin' ? 'active' : ''}`} onClick={() => setMode('coin')}>
                Coin
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Last result</div>
            <div className="vl-card-subtitle">Rolls total: {rollCount}</div>
            <div style={{ display: 'grid', placeItems: 'center', padding: '10px 0 2px' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#fff' }}>{mode === 'dice' ? currentDice : currentCoin === 'heads' ? 'H' : 'T'}</div>
              <div className="vl-card-subtitle" style={{ marginTop: 2 }}>
                {mode === 'dice' ? `Last roll: ${currentDice}` : currentCoin === 'heads' ? 'Heads' : 'Tails'}
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Actions</div>
            <div className="vl-row">
              <button type="button" className="vl-btn primary" onClick={rollOnce} disabled={isRolling}>
                {mode === 'dice' ? 'Roll once' : 'Flip once'}
              </button>
              <button type="button" className="vl-btn secondary" onClick={() => rollMultiple(10)} disabled={isRolling}>
                x10
              </button>
              <button type="button" className="vl-btn secondary" onClick={() => rollMultiple(50)} disabled={isRolling}>
                x50
              </button>
              <button type="button" className="vl-btn secondary" onClick={() => rollMultiple(100)} disabled={isRolling}>
                x100
              </button>
              <button type="button" className="vl-btn secondary" onClick={reset}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Statistics</div>
            {mode === 'dice' ? (
              <div className="vl-readouts" style={{ marginTop: 12 }}>
                <div className="vl-readout">
                  <div className="vl-readout-label">Expected each face</div>
                  <div className="vl-readout-value">1/6 = 0.1667</div>
                </div>
                <div className="vl-readout">
                  <div className="vl-readout-label">Observed (avg)</div>
                  <div className="vl-readout-value">
                    {observedDice ? (observedDice.reduce((s, v) => s + v, 0) / observedDice.length).toFixed(4) : 'N/A'}
                  </div>
                </div>
                <div className="vl-readout">
                  <div className="vl-readout-label">Rolls recorded</div>
                  <div className="vl-readout-value">{diceResults.length}</div>
                </div>
                <div className="vl-readout">
                  <div className="vl-readout-label">Most frequent</div>
                  <div className="vl-readout-value">
                    {diceResults.length
                      ? `${diceFreq.findIndex((f) => f === Math.max(...diceFreq)) + 1} (${Math.max(...diceFreq)})`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="vl-readouts" style={{ marginTop: 12 }}>
                <div className="vl-readout">
                  <div className="vl-readout-label">Expected</div>
                  <div className="vl-readout-value">0.5 / 0.5</div>
                </div>
                <div className="vl-readout">
                  <div className="vl-readout-label">Observed heads</div>
                  <div className="vl-readout-value">{observedCoin ? observedCoin.heads.toFixed(4) : 'N/A'}</div>
                </div>
                <div className="vl-readout">
                  <div className="vl-readout-label">Observed tails</div>
                  <div className="vl-readout-value">{observedCoin ? observedCoin.tails.toFixed(4) : 'N/A'}</div>
                </div>
                <div className="vl-readout">
                  <div className="vl-readout-label">Flips recorded</div>
                  <div className="vl-readout-value">{coinResults.length}</div>
                </div>
              </div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">Do at least 20 trials to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : `Trials: ${rollCount}/20`}
            </button>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Frequency chart</div>
            <div className="vl-card-subtitle">As trials grow, the bars should settle near the expected distribution.</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 560 220" role="img" aria-label="Frequency chart">
                <rect x="14" y="14" width="532" height="192" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

                {mode === 'dice'
                  ? diceFreq.map((f, idx) => {
                      const barW = 56;
                      const gap = 18;
                      const x = 44 + idx * (barW + gap);
                      const h = (f / maxDiceFreq) * 140;
                      const y = 180 - h;
                      return (
                        <g key={`d-${idx}`}>
                          <rect x={x} y={y} width={barW} height={h} rx="10" fill="rgba(255,215,64,0.85)" />
                          <text x={x + barW / 2} y="200" fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontWeight={900}>
                            {idx + 1}
                          </text>
                          <text x={x + barW / 2} y={y - 6} fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.78)" fontWeight={900}>
                            {f}
                          </text>
                        </g>
                      );
                    })
                  : ([
                      { label: 'H', value: coinFreq.heads, color: 'rgba(255,215,64,0.85)' },
                      { label: 'T', value: coinFreq.tails, color: 'rgba(160,174,192,0.85)' },
                    ] as const).map((b, idx) => {
                      const barW = 160;
                      const gap = 80;
                      const x = 90 + idx * (barW + gap);
                      const h = (b.value / maxCoinFreq) * 140;
                      const y = 180 - h;
                      return (
                        <g key={`c-${b.label}`}>
                          <rect x={x} y={y} width={barW} height={h} rx="12" fill={b.color} />
                          <text x={x + barW / 2} y="200" fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontWeight={900}>
                            {b.label}
                          </text>
                          <text x={x + barW / 2} y={y - 6} fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.78)" fontWeight={900}>
                            {b.value}
                          </text>
                        </g>
                      );
                    })}
              </svg>
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

