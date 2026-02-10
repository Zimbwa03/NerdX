import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, Link2, Lock, RefreshCw, Unlock } from 'lucide-react';
import type { MatchingActivityConfig } from '../../../data/virtualLab';

export interface MatchingLabResult {
  correctPairs: number;
  totalPairs: number;
  isComplete: boolean;
}

interface Props {
  config: MatchingActivityConfig;
  onProgress?: (result: MatchingLabResult) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcCorrectPairs(pairs: MatchingActivityConfig['pairs'], matched: Record<string, string>): number {
  return Object.keys(matched).filter((l) => {
    const r = matched[l];
    const pair = pairs.find((p) => p.left === l);
    return pair?.right === r;
  }).length;
}

export function MatchingLab({ config, onProgress }: Props) {
  const leftItems = useMemo(() => config.pairs.map((p) => p.left), [config.pairs]);
  const rightItems = useMemo(() => shuffle(config.pairs.map((p) => p.right)), [config.pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState(false);

  const required = config.requiredCorrectToUnlock ?? config.pairs.length;
  const correctPairs = calcCorrectPairs(config.pairs, matched);
  const isComplete = correctPairs >= Math.min(required, config.pairs.length);

  const notify = (nextMatched: Record<string, string>) => {
    const correct = calcCorrectPairs(config.pairs, nextMatched);
    onProgress?.({
      correctPairs: correct,
      totalPairs: config.pairs.length,
      isComplete: correct >= Math.min(required, config.pairs.length),
    });
  };

  const pickRight = (right: string) => {
    if (!selectedLeft) return;
    const expected = config.pairs.find((p) => p.left === selectedLeft)?.right;
    if (expected === right) {
      const next = { ...matched, [selectedLeft]: right };
      setMatched(next);
      setSelectedLeft(null);
      notify(next);
    } else {
      setWrongFlash(true);
      window.setTimeout(() => setWrongFlash(false), 220);
    }
  };

  const reset = () => {
    setSelectedLeft(null);
    setMatched({});
    notify({});
  };

  return (
    <div className="vl-card">
      {config.prompt && <div className="vl-card-subtitle">{config.prompt}</div>}

      <div className="vl-matching-grid">
        <div className="vl-matching-col">
          <div className="vl-section-title">Left</div>
          {leftItems.map((item) => {
            const done = matched[item] !== undefined;
            const selected = selectedLeft === item;
            return (
              <button
                key={item}
                type="button"
                className={`vl-pill ${done ? 'done' : ''} ${selected ? 'selected' : ''}`}
                onClick={() => !done && setSelectedLeft(item)}
                disabled={done}
              >
                {done ? <CheckCircle2 size={18} /> : selected ? <Circle size={18} /> : <Circle size={18} />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        <div className="vl-matching-col">
          <div className="vl-section-title">Right</div>
          {rightItems.map((item) => {
            const used = Object.values(matched).includes(item);
            return (
              <button
                key={item}
                type="button"
                className={`vl-pill ${wrongFlash ? 'wrong' : ''}`}
                onClick={() => !used && pickRight(item)}
                disabled={used}
                title={used ? 'Already used' : 'Select'}
              >
                <Link2 size={18} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="vl-row">
        <button type="button" className="vl-btn secondary" onClick={reset}>
          <RefreshCw size={16} /> Reset
        </button>
        <div className={`vl-badge ${isComplete ? 'ok' : ''}`}>
          {isComplete ? <Unlock size={16} /> : <Lock size={16} />}
          {isComplete ? 'Knowledge Check Unlocked' : `Match ${Math.min(required, config.pairs.length)} to unlock`}
        </div>
      </div>
    </div>
  );
}

