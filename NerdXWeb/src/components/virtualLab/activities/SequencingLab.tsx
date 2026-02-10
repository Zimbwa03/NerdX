import { useMemo, useState } from 'react';
import { CheckCircle2, RefreshCw, Undo2, XCircle, Lock, Unlock } from 'lucide-react';
import type { SequencingActivityConfig } from '../../../data/virtualLab';

export interface SequencingLabResult {
  placed: number;
  total: number;
  isComplete: boolean;
}

interface Props {
  config: SequencingActivityConfig;
  onProgress?: (result: SequencingLabResult) => void;
}

function shuffle(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SequencingLab({ config, onProgress }: Props) {
  const shuffled = useMemo(() => shuffle(config.steps), [config.steps]);
  const [chosen, setChosen] = useState<string[]>([]);

  const required = config.requiredCorrectToUnlock ?? config.steps.length;

  const correctSoFar = chosen.filter((s, idx) => config.steps[idx] === s).length;
  const isComplete = correctSoFar >= Math.min(required, config.steps.length) && chosen.length === config.steps.length;

  const notify = (nextChosen: string[]) => {
    const correct = nextChosen.filter((s, idx) => config.steps[idx] === s).length;
    onProgress?.({
      placed: correct,
      total: config.steps.length,
      isComplete: correct >= Math.min(required, config.steps.length) && nextChosen.length === config.steps.length,
    });
  };

  const pick = (step: string) => {
    if (chosen.includes(step)) return;
    if (chosen.length >= config.steps.length) return;
    const next = [...chosen, step];
    setChosen(next);
    notify(next);
  };

  const undo = () => {
    if (chosen.length === 0) return;
    const next = chosen.slice(0, -1);
    setChosen(next);
    notify(next);
  };

  const reset = () => {
    setChosen([]);
    notify([]);
  };

  return (
    <div className="vl-card">
      {config.prompt && <div className="vl-card-subtitle">{config.prompt}</div>}

      <div className="vl-section">
        <div className="vl-section-title">Build the correct order</div>
        <div className="vl-seq-slots">
          {config.steps.map((_, idx) => {
            const val = chosen[idx];
            const correct = val ? val === config.steps[idx] : null;
            return (
              <div key={idx} className={`vl-seq-slot ${correct === true ? 'ok' : correct === false ? 'bad' : ''}`}>
                <div className="vl-seq-index">{idx + 1}.</div>
                <div className="vl-seq-text">{val || 'Tap a step below'}</div>
                {correct === true ? <CheckCircle2 size={18} /> : null}
                {correct === false ? <XCircle size={18} /> : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="vl-section">
        <div className="vl-section-title">Steps</div>
        <div className="vl-seq-chips">
          {shuffled.map((step) => {
            const used = chosen.includes(step);
            return (
              <button
                key={step}
                type="button"
                className="vl-chip"
                onClick={() => pick(step)}
                disabled={used || chosen.length >= config.steps.length}
                title={used ? 'Already used' : 'Select'}
              >
                {step}
              </button>
            );
          })}
        </div>
      </div>

      <div className="vl-row">
        <div className="vl-row">
          <button type="button" className="vl-btn secondary" onClick={undo} disabled={chosen.length === 0}>
            <Undo2 size={16} /> Undo
          </button>
          <button type="button" className="vl-btn secondary" onClick={reset} disabled={chosen.length === 0}>
            <RefreshCw size={16} /> Reset
          </button>
        </div>
        <div className={`vl-badge ${isComplete ? 'ok' : ''}`}>
          {isComplete ? <Unlock size={16} /> : <Lock size={16} />}
          {isComplete ? 'Knowledge Check Unlocked' : `Correct: ${correctSoFar}/${config.steps.length}`}
        </div>
      </div>
    </div>
  );
}

