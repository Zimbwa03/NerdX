import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, Lock, RefreshCw, Unlock } from 'lucide-react';
import type { ExperimentRunnerConfig } from '../../../data/virtualLab';
import { evalCondition, evalFormula } from './exprEval';

export interface ExperimentRunnerResult {
  completedTasks: string[];
  progressPercent: number;
  isComplete: boolean;
}

interface Props {
  config: ExperimentRunnerConfig;
  onProgress?: (result: ExperimentRunnerResult) => void;
}

function decimalsForStep(step: number): number {
  const s = String(step);
  const idx = s.indexOf('.');
  if (idx === -1) return 0;
  return Math.min(3, s.length - idx - 1);
}

export function ExperimentRunner({ config, onProgress }: Props) {
  const initialControls = useMemo(() => {
    const obj: Record<string, number> = {};
    for (const c of config.controls) obj[c.id] = c.defaultValue;
    return obj;
  }, [config.controls]);

  const [values, setValues] = useState<Record<string, number>>(initialControls);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const readouts = useMemo(() => {
    const vars: Record<string, number> = { ...values };
    const computed: Record<string, number> = {};
    for (const r of config.readouts) {
      computed[r.id] = evalFormula(r.formula, vars);
      vars[r.id] = computed[r.id];
    }
    return { vars, computed };
  }, [values, config.readouts]);

  const required = config.requiredTasksToUnlock ?? config.tasks.length;

  const calcResult = (nextCompleted: string[]): ExperimentRunnerResult => {
    const completeCount = nextCompleted.length;
    const total = config.tasks.length || 0;
    const needed = Math.min(required, total);
    return {
      completedTasks: nextCompleted,
      progressPercent: total > 0 ? Math.round((completeCount / total) * 100) : 100,
      isComplete: completeCount >= needed,
    };
  };

  const reset = () => {
    setValues(initialControls);
    setCompletedTasks([]);
    onProgress?.(calcResult([]));
  };

  const checkTask = (taskId: string) => {
    const task = config.tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (completedTasks.includes(taskId)) return;

    const ok = evalCondition(task.condition, readouts.vars);
    if (!ok) return;

    const next = [...completedTasks, taskId];
    setCompletedTasks(next);
    onProgress?.(calcResult(next));
  };

  const result = calcResult(completedTasks);

  return (
    <div className="vl-card">
      {config.intro && <div className="vl-card-subtitle">{config.intro}</div>}

      <div className="vl-section">
        <div className="vl-section-title">Controls</div>
        <div className="vl-controls">
          {config.controls.map((c) => {
            const stepDecimals = decimalsForStep(c.step);
            const value = values[c.id] ?? c.defaultValue;
            const formatted = value.toFixed(Math.max(0, stepDecimals));
            return (
              <div key={c.id} className="vl-control">
                <div className="vl-control-head">
                  <div className="vl-control-label">{c.label}</div>
                  <div className="vl-control-value">
                    {formatted}
                    {c.unit ? ` ${c.unit}` : ''}
                  </div>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={value}
                  onChange={(e) => setValues((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="vl-section">
        <div className="vl-section-title">Readouts</div>
        <div className="vl-readouts">
          {config.readouts.map((r) => {
            const val = readouts.computed[r.id] ?? 0;
            const decimals = r.decimals ?? 2;
            return (
              <div key={r.id} className="vl-readout">
                <div className="vl-readout-label">{r.label}</div>
                <div className="vl-readout-value">
                  {val.toFixed(decimals)}
                  {r.unit ? ` ${r.unit}` : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="vl-section">
        <div className="vl-section-title-row">
          <div className="vl-section-title">Tasks</div>
          <div className="vl-section-meta">
            {completedTasks.length}/{config.tasks.length}
          </div>
        </div>
        <div className="vl-tasks">
          {config.tasks.map((t) => {
            const done = completedTasks.includes(t.id);
            return (
              <div key={t.id} className={`vl-task ${done ? 'done' : ''}`}>
                <div className="vl-task-icon" aria-hidden="true">
                  {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>
                <div className="vl-task-text">
                  <div className="vl-task-instruction">{t.instruction}</div>
                </div>
                <button type="button" className="vl-btn" onClick={() => checkTask(t.id)} disabled={done}>
                  {done ? 'Done' : 'Check'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="vl-row">
        <button type="button" className="vl-btn secondary" onClick={reset}>
          <RefreshCw size={16} /> Reset
        </button>
        <div className={`vl-badge ${result.isComplete ? 'ok' : ''}`}>
          {result.isComplete ? <Unlock size={16} /> : <Lock size={16} />}
          {result.isComplete ? 'Knowledge Check Unlocked' : `Complete ${Math.min(required, config.tasks.length)} tasks to unlock`}
        </div>
      </div>
    </div>
  );
}

