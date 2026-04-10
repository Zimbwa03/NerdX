import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Copy, Share2 } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { getApiErrorMessage } from '../../services/api/config';
import { scanSolveApi } from '../../services/api/scanSolveApi';
import type { ScanSolveResult } from '../../types/scanSolve';
import { loadScanSolveHistory, upsertScanSolveHistory } from '../../utils/scanSolveStorage';
import { resolveConceptPath } from '../../utils/scanSolveResolver';

const LOADING_STATES = [
  { message: 'Reading problem...' },
  { message: 'Solving with Vertex AI...' },
  { message: 'Vertex AI: building visualization...' },
  { message: 'Preparing lesson audio...' },
  { message: 'Assembling your lesson...' },
];

const SUBJECT_OPTIONS = [
  'Auto-detect',
  'Algebra',
  'Calculus',
  'Statistics',
  'Geometry',
  'Trigonometry',
  'Mechanics',
  'Probability',
  'Matrices',
  'Vectors',
] as const;

const makeClientResult = (payload: any): ScanSolveResult => ({
  id: payload.meta?.id || `solve-${Date.now()}`,
  timestamp: new Date().toISOString(),
  problem: payload.problem,
  solution: payload.solution,
  media: payload.media,
  meta: payload.meta,
});

export function ScanSolvePage() {
  const navigate = useNavigate();
  const [subjectHint, setSubjectHint] = useState<(typeof SUBJECT_OPTIONS)[number]>('Auto-detect');
  const [level, setLevel] = useState<'O-Level' | 'A-Level'>('O-Level');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [solution, setSolution] = useState<ScanSolveResult | null>(null);
  const [history, setHistory] = useState<ScanSolveResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    setHistory(loadScanSolveHistory());
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const audioSrc = useMemo(() => {
    if (!solution?.media.audio_base64) return '';
    return `data:audio/${solution.media.audio_format};base64,${solution.media.audio_base64}`;
  }, [solution]);

  const currentLoading = LOADING_STATES[Math.min(loadingStage, LOADING_STATES.length - 1)];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (nextFile) {
      setPreviewUrl(URL.createObjectURL(nextFile));
    }
  };

  const handleSolve = async (prefill?: string, explicitFile?: File | null) => {
    const text = (prefill !== undefined ? prefill : '').trim();
    const solveFile = explicitFile !== undefined ? explicitFile : file;
    if (prefill === undefined) {
      if (!solveFile) {
        setError('Please upload an image of your problem.');
        return;
      }
    } else if (!text && !solveFile) {
      setError('Could not run this practice problem.');
      return;
    }

    setLoading(true);
    setLoadingStage(0);
    setError(null);
    const stageTimer = window.setInterval(() => {
      setLoadingStage((current) => Math.min(current + 1, LOADING_STATES.length - 1));
    }, 700);

    try {
      const payload = await scanSolveApi.solve({
        text: prefill === undefined ? undefined : text || undefined,
        image: solveFile,
        subjectHint: subjectHint === 'Auto-detect' ? undefined : subjectHint,
        level,
      });
      const result = makeClientResult(payload);
      setSolution(result);
      setHistory((current) => upsertScanSolveHistory(current, result));
      setExpandedSteps([]);
    } catch (solveError: unknown) {
      setError(getApiErrorMessage(solveError, 'Could not prepare the lesson.'));
    } finally {
      window.clearInterval(stageTimer);
      setLoading(false);
    }
  };

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((current) =>
      current.includes(stepNumber)
        ? current.filter((item) => item !== stepNumber)
        : [...current, stepNumber]
    );
  };

  const expandAll = () => {
    setExpandedSteps(solution?.solution.steps.map((step) => step.step_number) || []);
  };

  const handleCopyAnswer = async () => {
    if (!solution) return;
    await navigator.clipboard.writeText(solution.solution.final_answer);
  };

  const handleShare = async () => {
    if (!solution) return;
    const message = `${solution.problem.plain}\n\nFinal Answer: ${solution.solution.final_answer}`;
    if (navigator.share) {
      await navigator.share({ text: message });
      return;
    }
    await navigator.clipboard.writeText(message);
  };

  return (
    <div className="scan-solve-page">
      <header className="scan-solve-header-bar">
        <Link to="/app/mathematics" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="scan-solve-hero-kicker">Mathematics</p>
        <h1 className="scan-solve-hero-title">Scan &amp; Solve</h1>
        <p className="scan-solve-subtitle">Upload a clear photo — get visuals, audio, and step-by-step working.</p>
      </header>

      <div className="scan-solve-input-panel">
        <label htmlFor="scan-solve-file" className="scan-solve-upload-cta">
          <Camera size={22} strokeWidth={2.25} aria-hidden />
          Upload problem image
        </label>
        <input id="scan-solve-file" type="file" accept="image/*" className="scan-solve-file-hidden" onChange={handleFileChange} />

        {previewUrl ? (
          <div className="scan-solve-preview scan-solve-preview--hero">
            <img src={previewUrl} alt="Uploaded preview" />
            <span className="scan-solve-preview-badge">Ready</span>
          </div>
        ) : (
          <p className="scan-solve-upload-hint">Use good lighting and include the full question in frame.</p>
        )}

        <p className="scan-solve-field-label">Subject focus</p>
        <div className="scan-solve-chip-row" role="group" aria-label="Subject focus">
          {SUBJECT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`scan-solve-chip${subjectHint === option ? ' scan-solve-chip--active' : ''}`}
              onClick={() => setSubjectHint(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <p className="scan-solve-field-label">Exam level</p>
        <div className="scan-solve-level-tabs" role="group" aria-label="Exam level">
          {(['O-Level', 'A-Level'] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`scan-solve-level-tab${level === item ? ' scan-solve-level-tab--active' : ''}`}
              onClick={() => setLevel(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {error ? <p className="scan-solve-error">{error}</p> : null}

        <button
          type="button"
          className="scan-solve-solve-btn scan-solve-solve-btn--block"
          onClick={() => handleSolve()}
          disabled={loading || !file}
        >
          {loading ? currentLoading.message : 'Solve'}
        </button>
      </div>

      <section className="scan-solve-section">
        <h2 className="scan-solve-section-title">Recent lessons</h2>
        <p className="scan-solve-section-desc">Open any cached result instantly, even when you just want to review.</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {history.length === 0 ? (
            <div className="scan-solve-result-card">
              <p style={{ color: 'rgba(255,255,255,0.68)' }}>Your last 20 Scan &amp; Solve lessons will appear here.</p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                type="button"
                className="scan-solve-result-card"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => setSolution(item)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <span style={{ color: '#86efac', fontWeight: 700, textTransform: 'capitalize' }}>{item.problem.subject}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.problem.difficulty}</span>
                </div>
                <div style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>{item.problem.plain || item.problem.latex}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)' }}>{item.solution.final_answer}</div>
              </button>
            ))
          )}
        </div>
      </section>

      {solution ? (
        <section style={{ marginTop: 36, display: 'grid', gap: 20 }}>
          <div className="scan-solve-result-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: '#86efac', fontWeight: 800, textTransform: 'capitalize', marginBottom: 8 }}>
                  {solution.problem.subject} • {solution.problem.difficulty}
                </div>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{solution.problem.plain || solution.problem.latex}</div>
              </div>
              <span className="scan-solve-badge online">{solution.meta.cache_hit ? 'Cached' : 'Live'}</span>
            </div>
          </div>

          <div className="scan-solve-result-card">
            <h3 className="scan-solve-steps-title">Visual Explanation</h3>
            <iframe
              title="Scan and Solve visualization"
              srcDoc={solution.media.simulation_html}
              style={{
                width: '100%',
                height: 320,
                borderRadius: 16,
                border: '1px solid rgba(34,197,94,0.3)',
                background: '#0f1117',
              }}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              {solution.solution.key_concepts.map((concept) => (
                <button
                  key={concept}
                  type="button"
                  onClick={() => {
                    const path = resolveConceptPath(concept);
                    if (!path) {
                      setError(`NerdX could not find a confident notes match for "${concept}" yet.`);
                      return;
                    }
                    navigate(path);
                  }}
                  style={{
                    borderRadius: 999,
                    padding: '10px 14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#d1fae5',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {concept}
                </button>
              ))}
            </div>
          </div>

          <div className="scan-solve-result-card">
            <h3 className="scan-solve-steps-title">Listen &amp; Learn</h3>
            {audioSrc ? (
              <audio controls src={audioSrc} style={{ width: '100%' }} />
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.68)' }}>Audio unavailable for this lesson.</p>
            )}
            <button
              type="button"
              onClick={() => setShowTranscript((current) => !current)}
              style={{ marginTop: 14, background: 'none', border: 'none', color: '#86efac', fontWeight: 700, cursor: 'pointer' }}
            >
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
            {showTranscript ? (
              <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, marginTop: 12 }}>{solution.solution.audio_script}</p>
            ) : null}
          </div>

          <div className="scan-solve-result-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <h3 className="scan-solve-steps-title" style={{ marginBottom: 0 }}>Step-by-Step Solution</h3>
              <button type="button" onClick={expandAll} style={{ background: 'none', border: 'none', color: '#86efac', fontWeight: 700, cursor: 'pointer' }}>
                Expand All
              </button>
            </div>
            <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
              {solution.solution.steps.map((step) => {
                const expanded = expandedSteps.includes(step.step_number);
                return (
                  <div key={step.step_number} className="scan-solve-step-card" style={{ borderLeft: '4px solid #22c55e' }}>
                    <button
                      type="button"
                      onClick={() => toggleStep(step.step_number)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                    >
                      <div className="scan-solve-step-header">
                        <span className="scan-solve-step-num">STEP {step.step_number}</span>
                        <span className="scan-solve-step-desc">{step.title}</span>
                      </div>
                    </button>
                    {expanded ? (
                      <div style={{ marginTop: 12 }}>
                        <p className="scan-solve-step-explanation"><strong>WHY:</strong> {step.explanation}</p>
                        {step.working ? (
                          <div className="scan-solve-step-latex">
                            <MathRenderer content={step.working} fontSize={16} />
                          </div>
                        ) : null}
                        {step.hint ? <p className="scan-solve-step-explanation"><strong>Watch out:</strong> {step.hint}</p> : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="scan-solve-result-card" style={{ background: 'rgba(34,197,94,0.14)', borderColor: 'rgba(34,197,94,0.3)' }}>
            <div className="scan-solve-result-title">Final Answer</div>
            <div className="scan-solve-latex-answer" style={{ marginTop: 14 }}>
              <MathRenderer content={solution.solution.final_answer} fontSize={20} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <button type="button" className="scan-solve-scan-btn" onClick={handleCopyAnswer}><Copy size={18} /> Copy Answer</button>
              <button type="button" className="scan-solve-scan-btn" onClick={handleShare}><Share2 size={18} /> Share Solution</button>
            </div>
          </div>

          <div className="scan-solve-result-card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
            <div className="scan-solve-result-title">ZIMSEC Exam Tip</div>
            <p className="scan-solve-step-explanation">{solution.solution.zimsec_exam_tip}</p>
          </div>

          <div className="scan-solve-result-card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
            <div className="scan-solve-result-title">Common Mistakes</div>
            {solution.solution.common_mistakes.map((mistake) => (
              <p key={mistake} className="scan-solve-step-explanation">• {mistake}</p>
            ))}
          </div>

          <div className="scan-solve-result-card">
            <div className="scan-solve-result-title">Practice More</div>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              {solution.solution.similar_problems.map((item) => (
                <button
                  key={item.problem}
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                    void handleSolve(item.problem, null);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '14px 16px',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: '#111622',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.problem}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)' }}>{item.hint}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
