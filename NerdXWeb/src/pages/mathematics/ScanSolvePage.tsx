import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { mathApi, type MathSolution } from '../../services/api/mathApi';
import { MathRenderer } from '../../components/MathRenderer';
import { ArrowLeft, Upload, Calculator, X } from 'lucide-react';

function hasLatex(text: string): boolean {
  return /\\frac|\\sqrt|\\sum|\\int|\\\(|\\\[|\$/.test(text);
}

export function ScanSolvePage() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanMethod, setScanMethod] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSolve = async () => {
    if (!problem.trim()) {
      setError('Please enter a math problem');
      return;
    }
    setLoading(true);
    setError(null);
    setSolution(null);
    try {
      const result = await mathApi.solveProblem(problem.trim());
      if (result && result.success !== false) {
        setSolution(result);
      } else {
        setError('Could not solve this problem. Try rephrasing or check the syntax.');
      }
    } catch (err) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(msg || (err instanceof Error ? err.message : 'Solve failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSolution(null);
    setScanMethod(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        const mime = file.type || 'image/png';
        const res = await mathApi.scanImage(base64, mime);
        if (!res.success) {
          setError('Could not recognize equation. Try a clearer image.');
          return;
        }
        const text = (res.latex || res.detected_text || '').trim();
        if (!text) {
          setError('No equation detected in the image.');
          return;
        }
        setProblem(text);
        setScanMethod(res.method === 'vertex-vision' ? '☁️ Scanned online (NerdX Cloud)' : 'Scanned');

        const solveResult = await mathApi.solveProblem(text);
        if (solveResult && solveResult.success !== false) {
          setSolution(solveResult);
        } else {
          setError('Equation detected but could not solve. You can edit and try again.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Scan failed');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleClear = () => {
    setProblem('');
    setSolution(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setScanMethod(null);
  };

  return (
    <div className="scan-solve-page">
      <header className="scan-solve-header-bar">
        <Link to="/app/mathematics" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1>Scan & Solve</h1>
        <p className="scan-solve-subtitle">Scan or type a problem</p>
      </header>

      <div className="scan-solve-input-card">
        <div className="scan-solve-input-row">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. x^2 + 5x + 6 = 0"
            rows={3}
            className="scan-solve-textarea"
          />
          {problem && (
            <button
              type="button"
              className="scan-solve-clear-btn"
              onClick={handleClear}
              aria-label="Clear"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="scan-solve-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleScan}
            className="scan-solve-file-hidden"
          />
          <button
            type="button"
            className="scan-solve-scan-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload size={20} /> Scan
          </button>
          <button
            type="button"
            className="scan-solve-solve-btn"
            onClick={handleSolve}
            disabled={!problem.trim() || loading}
          >
            {loading ? (
              <span className="scan-solve-spinner" />
            ) : (
              <>
                <Calculator size={20} /> Solve
              </>
            )}
          </button>
        </div>

        {scanMethod && (
          <p className="scan-solve-method">{scanMethod}</p>
        )}
      </div>

      {previewUrl && (
        <div className="scan-solve-preview">
          <img src={previewUrl} alt="Uploaded" />
        </div>
      )}

      {error && <p className="scan-solve-error">{error}</p>}

      {solution && (
        <div className="scan-solve-solution-section">
          <div className="scan-solve-result-card">
            <div className="scan-solve-result-header">
              <span className="scan-solve-result-title">Solution</span>
              <span className={`scan-solve-badge ${solution.solvedOffline ? 'offline' : 'online'}`}>
                {solution.solvedOffline ? '⚡ Offline' : '☁️ Server'}
              </span>
            </div>
            <div className="scan-solve-latex-answer">
              {solution.latex_solutions.length > 0 ? (
                solution.latex_solutions.map((latex, i) => (
                  hasLatex(latex) ? (
                    <MathRenderer key={i} content={latex} fontSize={20} />
                  ) : (
                    <span key={i} className="scan-solve-answer-text">{latex}</span>
                  )
                ))
              ) : (
                <span>{solution.explanation}</span>
              )}
            </div>
          </div>

          {solution.steps.length > 0 && (
            <>
              <h3 className="scan-solve-steps-title">Step-by-Step Explanation</h3>
              {solution.steps.map((step, i) => (
                <div key={i} className="scan-solve-step-card">
                  <div className="scan-solve-step-header">
                    <span className="scan-solve-step-num">{step.step}</span>
                    <span className="scan-solve-step-desc">{step.description}</span>
                  </div>
                  {step.latex && (
                    <div className="scan-solve-step-latex">
                      {hasLatex(step.latex) ? (
                        <MathRenderer content={step.latex} fontSize={16} />
                      ) : (
                        <span>{step.latex}</span>
                      )}
                    </div>
                  )}
                  {step.explanation && (
                    <p className="scan-solve-step-explanation">{step.explanation}</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
