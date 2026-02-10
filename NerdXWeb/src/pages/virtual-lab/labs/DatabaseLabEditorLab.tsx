import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle, Database, Play, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';
import { databaseLabApi, type DatabaseLabExecuteResult } from '../../../services/api/databaseLabApi';
import { DATABASE_LAB_TEMPLATES } from '../../../data/virtualLab/databaseLab/templates';
import { DATABASE_LAB_EXERCISES, type DatabaseLabExercise } from '../../../data/virtualLab/databaseLab/exercises';

type AutoCheckResult = { status: 'pass' | 'fail'; message: string };

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return Number.isFinite(value) ? String(Number(value.toFixed(6))) : String(value);
  return String(value).trim().toLowerCase();
}

function normalizeRow(row: unknown[]): string[] {
  return row.map(normalizeValue);
}

function compareRows(expected: unknown[][], actual: unknown[][], orderMatters: boolean): { equal: boolean; message: string } {
  const expectedRows = expected.map((r) => normalizeRow(r as unknown[]));
  const actualRows = actual.map((r) => normalizeRow(r as unknown[]));

  if (!orderMatters) {
    const sortKey = (row: string[]) => row.join('|');
    expectedRows.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
    actualRows.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  }

  if (expectedRows.length !== actualRows.length) {
    return { equal: false, message: `Expected ${expectedRows.length} rows but got ${actualRows.length}.` };
  }

  for (let i = 0; i < expectedRows.length; i += 1) {
    const exp = expectedRows[i];
    const act = actualRows[i];
    if (exp.length !== act.length) return { equal: false, message: 'Column count does not match expected output.' };
    for (let j = 0; j < exp.length; j += 1) {
      if (exp[j] !== act[j]) return { equal: false, message: 'Row values do not match expected output.' };
    }
  }

  return { equal: true, message: 'Results match expected output.' };
}

function evaluateExerciseResult(exercise: DatabaseLabExercise, data: DatabaseLabExecuteResult): AutoCheckResult {
  if (data.error) return { status: 'fail', message: data.error };
  if (!data.columns || !data.rows) {
    return { status: 'fail', message: 'No result rows returned. Make sure your query is a SELECT.' };
  }

  if (exercise.expected.columns) {
    const expectedCols = exercise.expected.columns.map((c) => c.toLowerCase());
    const actualCols = data.columns.map((c) => c.toLowerCase());
    if (expectedCols.length !== actualCols.length) {
      return { status: 'fail', message: 'Column count does not match expected output.' };
    }
    for (let i = 0; i < expectedCols.length; i += 1) {
      if (expectedCols[i] !== actualCols[i]) {
        return { status: 'fail', message: 'Column names do not match expected output.' };
      }
    }
  }

  if (exercise.expected.rowCount !== undefined && data.rows.length !== exercise.expected.rowCount) {
    return { status: 'fail', message: `Expected ${exercise.expected.rowCount} rows but got ${data.rows.length}.` };
  }

  if (exercise.expected.rows) {
    const comparison = compareRows(exercise.expected.rows, data.rows, exercise.expected.orderMatters ?? false);
    if (!comparison.equal) return { status: 'fail', message: comparison.message };
  }

  return { status: 'pass', message: 'Great job! Your query matches the expected output.' };
}

export function DatabaseLabEditorLab({ simulation }: { simulation: SimulationMetadata }) {
  const [sql, setSql] = useState(() => DATABASE_LAB_TEMPLATES.find((t) => t.id === 'students')?.sql ?? '');
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<DatabaseLabExecuteResult | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [autoCheckResult, setAutoCheckResult] = useState<AutoCheckResult | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const selectedExercise = useMemo(
    () => (selectedExerciseId ? DATABASE_LAB_EXERCISES.find((e) => e.id === selectedExerciseId) : undefined),
    [selectedExerciseId]
  );

  const run = async () => {
    const trimmed = sql.trim();
    if (!trimmed) return;
    setRunning(true);
    setResult(null);
    setAutoCheckResult(null);
    try {
      const data = await databaseLabApi.executeSql(trimmed);
      setResult(data);
    } catch (e: unknown) {
      setResult({ error: e instanceof Error ? e.message : 'Failed to run SQL. Check your connection.' });
    } finally {
      setRunning(false);
    }
  };

  const autoCheck = async () => {
    if (!selectedExercise) return;
    const trimmed = sql.trim();
    if (!trimmed) return;
    setChecking(true);
    setAutoCheckResult(null);
    try {
      const combinedSql = `${selectedExercise.setupSql}\n${trimmed}`;
      const data = await databaseLabApi.executeSql(combinedSql);
      setResult(data);
      setAutoCheckResult(evaluateExerciseResult(selectedExercise, data));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to check SQL. Check your connection.';
      setAutoCheckResult({ status: 'fail', message });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-editor-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #5C6BC0, #1A237E)' }}>
            <Database size={28} />
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
            <div className="vl-card-title">Templates</div>
            <div className="vl-card-subtitle">Load a schema + sample data, then run queries.</div>
            <div className="vl-template-list">
              {DATABASE_LAB_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="vl-template-btn"
                  onClick={() => {
                    setSelectedExerciseId(null);
                    setSql(t.sql);
                    setResult(null);
                    setAutoCheckResult(null);
                  }}
                >
                  <div className="vl-template-title">{t.title}</div>
                  <div className="vl-template-desc">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Exercises</div>
            <div className="vl-card-subtitle">Pick an exercise, edit the SQL, then auto-check.</div>
            <div className="vl-template-list">
              {DATABASE_LAB_EXERCISES.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  className={`vl-template-btn ${selectedExerciseId === ex.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedExerciseId(ex.id);
                    setSql(ex.starterSql);
                    setResult(null);
                    setAutoCheckResult(null);
                  }}
                >
                  <div className="vl-template-title">
                    {ex.title} <span className="vl-pill-mini">{ex.difficulty}</span>
                  </div>
                  <div className="vl-template-desc">{ex.prompt}</div>
                </button>
              ))}
            </div>

            <div className="vl-row">
              <button type="button" className="vl-btn secondary" onClick={autoCheck} disabled={!selectedExercise || checking}>
                {checking ? 'Checking...' : 'Auto-check'}
              </button>
              <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)}>
                <Sparkles size={16} /> Knowledge check
              </button>
            </div>

            {autoCheckResult && (
              <div className={`vl-check-result ${autoCheckResult.status}`}>
                {autoCheckResult.status === 'pass' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{autoCheckResult.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-editor-toolbar">
              <button type="button" className="vl-btn primary" onClick={run} disabled={running}>
                <Play size={16} /> {running ? 'Running...' : 'Run SQL'}
              </button>
            </div>

            <textarea
              className="vl-editor-textarea"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Results</div>
            {result?.error && <div className="vl-output-error">{result.error}</div>}
            {result?.message && <div className="vl-card-subtitle">{result.message}</div>}

            {result?.columns && result?.rows && (
              <div className="vl-table-wrap">
                <table className="vl-table">
                  <thead>
                    <tr>
                      {result.columns.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.slice(0, 80).map((row, idx) => (
                      <tr key={idx}>
                        {row.map((cell, j) => (
                          <td key={j}>{cell === null ? 'NULL' : String(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.rows.length > 80 && <div className="vl-card-subtitle">Showing first 80 rows...</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

