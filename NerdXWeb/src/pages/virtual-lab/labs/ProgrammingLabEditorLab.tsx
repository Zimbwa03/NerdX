import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Play, RotateCcw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import type { ProgrammingLanguage } from '../../../types/programmingLabTypes';
import { PROGRAMMING_TEMPLATES } from '../../../data/virtualLab/programmingLab/templates';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';
import { programmingLabApi, type ProgrammingLabExecutionResponse } from '../../../services/api/programmingLabApi';

const DEFAULT_CODE: Record<ProgrammingLanguage, string> = {
  python: '# Welcome to Programming Lab\nprint("Hello, World!")\n',
  vbnet: 'Module Module1\n    Sub Main()\n        Console.WriteLine("Hello, World!")\n    End Sub\nEnd Module\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  html: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>\n',
};

const LANG_OPTIONS: Array<{ key: ProgrammingLanguage; label: string }> = [
  { key: 'python', label: 'Python' },
  { key: 'vbnet', label: 'VB.NET' },
  { key: 'java', label: 'Java' },
];

export function ProgrammingLabEditorLab({ simulation }: { simulation: SimulationMetadata }) {
  const [language, setLanguage] = useState<ProgrammingLanguage>('python');
  const [code, setCode] = useState(() => DEFAULT_CODE.python);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ProgrammingLabExecutionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const templates = useMemo(
    () => PROGRAMMING_TEMPLATES.filter((t) => t.language === language),
    [language]
  );

  const reset = () => {
    setCode(DEFAULT_CODE[language] ?? DEFAULT_CODE.python);
    setResult(null);
    setError(null);
  };

  const run = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const res = await programmingLabApi.executeCode({
        code,
        language,
        input: [],
        timeoutSeconds: 5,
      });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to execute code. Please try again.');
    } finally {
      setRunning(false);
    }
  };

  const output = result?.output;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-editor-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #0066CC, #1565C0)' }}>
            <Code size={28} />
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
            <div className="vl-card-title">Setup</div>
            <div className="vl-card-subtitle">{simulation.description}</div>

            <div className="vl-editor-row">
              <label className="vl-editor-label" htmlFor="vl-lang">
                Language
              </label>
              <select
                id="vl-lang"
                className="vl-select"
                value={language}
                onChange={(e) => {
                  const next = e.target.value as ProgrammingLanguage;
                  setLanguage(next);
                  setCode(DEFAULT_CODE[next] ?? DEFAULT_CODE.python);
                  setResult(null);
                  setError(null);
                }}
              >
                {LANG_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {templates.length > 0 && (
              <div className="vl-editor-row">
                <div className="vl-editor-label">Templates</div>
                <div className="vl-template-list">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="vl-template-btn"
                      onClick={() => {
                        setCode(t.code);
                        setResult(null);
                        setError(null);
                      }}
                    >
                      <div className="vl-template-title">{t.title}</div>
                      <div className="vl-template-desc">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="vl-row">
              <button type="button" className="vl-btn secondary" onClick={reset}>
                <RotateCcw size={16} /> Reset
              </button>
              <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)}>
                <Sparkles size={16} /> Knowledge check
              </button>
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

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-editor-toolbar">
              <button type="button" className="vl-btn primary" onClick={run} disabled={running}>
                <Play size={16} /> {running ? 'Running...' : 'Run'}
              </button>
            </div>

            <textarea
              className="vl-editor-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Output</div>
            {error && <div className="vl-output-error">{error}</div>}
            {result?.stderr && <pre className="vl-output stderr">{result.stderr}</pre>}
            {result?.stdout && <pre className="vl-output">{result.stdout}</pre>}

            {output?.type === 'html' && (
              <div className="vl-preview-wrap">
                <div className="vl-card-subtitle">HTML output preview</div>
                <iframe
                  className="vl-web-preview"
                  sandbox="allow-scripts allow-forms allow-modals allow-popups"
                  srcDoc={output.content}
                  title="Programming Lab Output"
                />
              </div>
            )}

            {result && (
              <div className="vl-meta">
                <span className="vl-meta-item">Time: {result.executionTime}ms</span>
                <span className="vl-meta-item">Memory: {result.memoryUsed}KB</span>
                <span className={`vl-meta-item ${result.success ? 'ok' : ''}`}>{result.success ? 'Success' : 'Failed'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

