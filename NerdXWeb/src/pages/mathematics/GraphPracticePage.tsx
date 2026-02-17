import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { graphApi, getGraphImageUrl, type GraphData } from '../../services/api/graphApi';
import { API_BASE_URL } from '../../services/api/config';
import { MathRenderer } from '../../components/MathRenderer';
import { ArrowLeft, ZoomIn, Upload, X } from 'lucide-react';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    const msg = res?.data?.message;
    if (typeof msg === 'string' && msg.trim()) return msg.trim();
  }
  return 'Something went wrong. Please try again.';
}

type Mode = 'generate' | 'custom' | 'upload' | 'linear';
type Level = 'o_level' | 'a_level';

const GRAPH_TYPES = [
  { id: 'linear', name: 'Linear', icon: '📈' },
  { id: 'quadratic', name: 'Quadratic', icon: '📊' },
  { id: 'exponential', name: 'Exponential', icon: '📉' },
  { id: 'trigonometric', name: 'Trigonometric', icon: '🌊' },
  { id: 'statistics', name: 'Statistics', icon: '📋' },
];

const GRAPH_CREDIT = 1;
const IMAGE_SOLVE_CREDIT = 3;

function hasLatex(text: string): boolean {
  return /\\\(|\\\[|\$/.test(text);
}

export function GraphPracticePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [mode, setMode] = useState<Mode>('generate');
  const [level, setLevel] = useState<Level>('o_level');
  const [graphType, setGraphType] = useState('linear');
  const [customEquation, setCustomEquation] = useState('');
  const [constraints, setConstraints] = useState(['', '']);
  const [objective, setObjective] = useState('');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [imageSolution, setImageSolution] = useState<{
    processed_text: string;
    solution: string;
    analysis?: string;
  } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [answerFiles, setAnswerFiles] = useState<File[]>([]);
  const [analyzingImages, setAnalyzingImages] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const resetView = () => {
    setGraphData(null);
    setAnswer('');
    setShowSolution(false);
    setImageSolution(null);
    setVideoUrl(null);
    setVideoError(null);
    setAnswerFiles([]);
    setErrorMessage(null);
  };

  const tryLoadAnimation = async (data: GraphData) => {
    const spec = data.graph_spec;
    if (!spec) return;
    const specType = spec.graph_type || graphType;
    const coeffs = spec.coefficients;
    const cleanExpr = spec.clean_expression ?? spec.equation;
    try {
      setVideoLoading(true);
      setVideoError(null);
      let anim: { video_path: string } | null = null;
      if (specType === 'quadratic' && coeffs && coeffs.a !== undefined) {
        anim = await graphApi.generateQuadraticAnimation(
          coeffs.a ?? 1,
          coeffs.b ?? 0,
          coeffs.c ?? 0,
          spec.x_range,
          spec.y_range
        );
      } else if (specType === 'linear' && coeffs && coeffs.m !== undefined) {
        anim = await graphApi.generateLinearAnimation(
          coeffs.m ?? 1,
          coeffs.c ?? 0,
          spec.x_range,
          spec.y_range
        );
      } else if (cleanExpr) {
        anim = await graphApi.generateExpressionAnimation(
          cleanExpr,
          spec.x_range,
          spec.y_range
        );
      }
      if (anim?.video_path) {
        const path = anim.video_path.startsWith('/') ? anim.video_path : '/' + anim.video_path;
        const base = API_BASE_URL.replace(/\/$/, '');
        setVideoUrl(`${base}${path}`);
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setVideoError(msg !== 'Something went wrong. Please try again.' ? msg : 'Animation service is currently unavailable.');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleGenerate = async () => {
    const credits = user?.credits ?? 0;
    if (credits < GRAPH_CREDIT) return;
    if (mode === 'linear') {
      const valid = constraints.filter((c) => c.trim());
      if (valid.length < 2) return;
    }
    setLoading(true);
    resetView();
    try {
      let data: GraphData | null = null;
      if (mode === 'custom' && customEquation.trim()) {
        data = await graphApi.generateCustomGraph(customEquation.trim());
      } else if (mode === 'linear') {
        const valid = constraints.filter((c) => c.trim());
        data = await graphApi.generateLinearProgramming(
          valid,
          objective.trim() || undefined
        );
      } else {
        data = await graphApi.generateGraph(graphType, undefined, level);
      }
      if (data) {
        setErrorMessage(null);
        setGraphData(data);
        if (data.credits_remaining !== undefined) updateUser({ credits: data.credits_remaining });
        tryLoadAnimation(data);
      }
    } catch (err) {
      console.error(err);
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadGraph = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || (user?.credits ?? 0) < IMAGE_SOLVE_CREDIT) return;
    e.target.value = '';
    setLoading(true);
    resetView();
    try {
      const res = await graphApi.solveGraphFromImage(file);
      if (res) {
        setErrorMessage(null);
        setImageSolution({
          processed_text: res.processed_text || '',
          solution: res.solution || '',
          analysis: res.analysis,
        });
        if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
      }
    } catch (err) {
      console.error(err);
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (answer.trim()) setShowSolution(true);
  };

  const handleSubmitImages = async () => {
    if (!graphData?.question || answerFiles.length === 0) return;
    setErrorMessage(null);
    setAnalyzingImages(true);
    try {
      const res = await graphApi.submitAnswerImages(graphData.question, answerFiles);
      if (res) {
        setImageSolution({
          processed_text: res.processed_text || 'Images analyzed.',
          solution: res.solution || res.feedback || 'See analysis above.',
          analysis: res.analysis,
        });
        setShowSolution(true);
        setAnswerFiles([]);
        if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
      }
    } catch (err) {
      console.error(err);
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      setErrorMessage(getErrorMessage(err));
    } finally {
      setAnalyzingImages(false);
    }
  };

  const removeAnswerFile = (i: number) => {
    setAnswerFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const userCredits = user?.credits ?? 0;
  const graphTypeResp = graphData?.graph_spec?.graph_type ?? graphData?.graph_type;
  const isStats = (graphTypeResp?.toLowerCase() === 'statistics') || !!graphData?.no_plot;

  return (
    <div className="graph-practice-page">
      <header className="graph-practice-header">
        <Link to="/app/mathematics" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1>📊 Graph Practice</h1>
        <p className="graph-practice-subtitle">Practice reading and analyzing graphs</p>
        <p className="graph-practice-credits">Credits: {userCredits}</p>
        <div className="graph-practice-level">
          <button
            type="button"
            className={level === 'o_level' ? 'active' : ''}
            onClick={() => setLevel('o_level')}
          >
            O-Level
          </button>
          <button
            type="button"
            className={level === 'a_level' ? 'active' : ''}
            onClick={() => setLevel('a_level')}
          >
            A-Level
          </button>
        </div>
      </header>

      {/* Mode tabs */}
      <div className="graph-practice-mode">
        {(['generate', 'custom', 'upload', 'linear'] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={mode === m ? 'active' : ''}
            onClick={() => {
              setMode(m);
              resetView();
            }}
          >
            {m === 'generate' && '📈 Generate'}
            {m === 'custom' && '✏️ Custom'}
            {m === 'upload' && '📷 Upload'}
            {m === 'linear' && '⭐ Linear Prog'}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="graph-practice-error" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Generate mode */}
      {mode === 'generate' && (
        <div className="graph-mode-section">
          <h3>Select Graph Type</h3>
          <div className="graph-type-buttons">
            {GRAPH_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={graphType === t.id ? 'active' : ''}
                onClick={() => setGraphType(t.id)}
              >
                <span className="graph-type-icon">{t.icon}</span>
                {t.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="graph-generate-btn"
            onClick={handleGenerate}
            disabled={loading || userCredits < GRAPH_CREDIT}
          >
            {loading ? 'Generating…' : `Generate Graph (${GRAPH_CREDIT} credit)`}
          </button>
        </div>
      )}

      {/* Custom mode */}
      {mode === 'custom' && (
        <div className="graph-mode-section">
          <h3>Enter Custom Equation</h3>
          <p className="graph-hint">Examples: y = 2x + 3, y = x^2, y = sin(x), y = 2^x</p>
          <input
            type="text"
            className="graph-equation-input"
            value={customEquation}
            onChange={(e) => setCustomEquation(e.target.value)}
            placeholder="e.g., y = 2x + 3"
          />
          <button
            type="button"
            className="graph-generate-btn"
            onClick={handleGenerate}
            disabled={loading || !customEquation.trim() || userCredits < GRAPH_CREDIT}
          >
            {loading ? 'Generating…' : `Generate Graph (${GRAPH_CREDIT} credit)`}
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === 'upload' && (
        <div className="graph-mode-section">
          <h3>Upload Graph Image</h3>
          <p className="graph-hint">Upload an image of a graph problem to get AI-powered solution</p>
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadGraph}
            className="graph-file-hidden"
          />
          <button
            type="button"
            className="graph-generate-btn"
            onClick={() => uploadInputRef.current?.click()}
            disabled={loading || userCredits < IMAGE_SOLVE_CREDIT}
          >
            {loading ? 'Processing…' : `Select Image (${IMAGE_SOLVE_CREDIT} credits)`}
          </button>
        </div>
      )}

      {/* Linear Programming mode */}
      {mode === 'linear' && (
        <div className="graph-mode-section">
          <h3>Linear Programming</h3>
          <p className="graph-hint">Enter constraints (e.g., &quot;2x + 3y ≤ 12&quot;, &quot;x + y ≤ 8&quot;)</p>
          {constraints.map((c, i) => (
            <input
              key={i}
              type="text"
              className="graph-constraint-input"
              value={c}
              onChange={(e) => {
                const next = [...constraints];
                next[i] = e.target.value;
                setConstraints(next);
              }}
              placeholder={`Constraint ${i + 1} (e.g., 2x + 3y ≤ 12)`}
            />
          ))}
          <button
            type="button"
            className="graph-add-constraint"
            onClick={() => setConstraints([...constraints, ''])}
          >
            + Add Constraint
          </button>
          <label className="graph-mode-label">Objective Function (Optional)</label>
          <input
            type="text"
            className="graph-equation-input"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g., maximize 3x + 2y"
          />
          <button
            type="button"
            className="graph-generate-btn"
            onClick={handleGenerate}
            disabled={loading || constraints.filter((c) => c.trim()).length < 2 || userCredits < GRAPH_CREDIT}
          >
            {loading ? 'Generating…' : `Generate Graph (${GRAPH_CREDIT} credit)`}
          </button>
        </div>
      )}

      {/* Graph result */}
      {graphData && (
        <div className="graph-result-section">
          {graphData.graph_url && (
            <button
              type="button"
              className="graph-image-clickable"
              onClick={() => setZoomImage(getGraphImageUrl(graphData.graph_url))}
            >
              <img
                src={getGraphImageUrl(graphData.graph_url)}
                alt="Graph"
              />
              <span className="graph-zoom-hint"><ZoomIn size={20} /> Tap to zoom</span>
            </button>
          )}
          {isStats && (
            <div className="graph-stats-placeholder">
              <h4>📋 Statistics / Statistical Graphs</h4>
              <p>Draw your graph on paper (bar chart, pie chart, histogram, etc.).</p>
              <p>You can upload a photo of your work below for AI feedback.</p>
            </div>
          )}

          {/* Video / Animation */}
          {(videoUrl || videoLoading || videoError || graphData.graph_spec) && (
            <div className="graph-video-section">
              <h4>Visualization:</h4>
              {videoLoading && <p>Generating animation…</p>}
              {videoError && <p className="graph-video-error">⚠️ {videoError}</p>}
              {videoUrl && (
                <video
                  src={videoUrl}
                  controls
                  className="graph-video"
                  onError={() => setVideoError('Animation failed to load.')}
                />
              )}
            </div>
          )}

          {/* Question card */}
          <div className="graph-question-card">
            {!isStats && graphData.equation_display && (
              <>
                <h4>Equation:</h4>
                <p className="graph-equation-display">{graphData.equation_display}</p>
              </>
            )}
            {graphData.constraints?.length && (
              <>
                <h4>Constraints:</h4>
                {graphData.constraints.map((c, i) => (
                  <p key={i} className="graph-equation-display">{c}</p>
                ))}
              </>
            )}
            {graphData.corner_points?.length && (
              <>
                <h4>Corner Points:</h4>
                <p className="graph-equation-display">
                  {graphData.corner_points.map((p) => `(${p[0]}, ${p[1]})`).join(', ')}
                </p>
              </>
            )}
            <h4>Question:</h4>
            {hasLatex(graphData.question) ? (
              <MathRenderer content={graphData.question} fontSize={16} />
            ) : (
              <p>{graphData.question}</p>
            )}

            {!showSolution && (
              <div className="graph-answer-section">
                <label>Your Answer:</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  rows={4}
                />
                <label>Or submit images of your work (AI analysis):</label>
                <div className="graph-answer-image-row">
                  <input
                    ref={answerInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="graph-file-hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) setAnswerFiles((prev) => [...prev, ...Array.from(files)]);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    className="graph-upload-answer-btn"
                    onClick={() => answerInputRef.current?.click()}
                  >
                    <Upload size={18} /> Upload image
                  </button>
                </div>
                {answerFiles.length > 0 && (
                  <div className="graph-answer-thumbnails">
                    {answerFiles.map((f, i) => (
                      <span key={i} className="graph-thumbnail">
                        {f.name}
                        <button type="button" onClick={() => removeAnswerFile(i)} aria-label="Remove">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      className="graph-analyze-btn"
                      onClick={handleSubmitImages}
                      disabled={analyzingImages}
                    >
                      {analyzingImages ? 'Analyzing…' : 'Submit images for AI analysis'}
                    </button>
                  </div>
                )}
                <div className="graph-answer-actions">
                  <button
                    type="button"
                    className="graph-submit-btn"
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                  >
                    Submit Answer
                  </button>
                  <button type="button" className="graph-skip-btn" onClick={resetView}>
                    Skip / Next
                  </button>
                </div>
              </div>
            )}

            {showSolution && (
              <div className="graph-solution-box">
                <h4>Solution:</h4>
                {graphData.solution?.trim() ? (
                  hasLatex(graphData.solution) ? (
                    <MathRenderer content={graphData.solution} fontSize={15} />
                  ) : (
                    <p>{graphData.solution}</p>
                  )
                ) : (
                  <p className="graph-solution-fallback">No solution text provided.</p>
                )}
                <button type="button" className="graph-new-btn" onClick={resetView}>
                  Generate New Graph
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image solution (upload mode) */}
      {imageSolution && (
        <div className="graph-result-section">
          <div className="graph-solution-box">
            <h4>Processed Text:</h4>
            <p>{imageSolution.processed_text}</p>
            <h4>Solution:</h4>
            <p>{imageSolution.solution}</p>
            {imageSolution.analysis && (
              <>
                <h4>Analysis:</h4>
                <p>{imageSolution.analysis}</p>
              </>
            )}
            <button type="button" className="graph-new-btn" onClick={resetView}>
              Try Another Image
            </button>
          </div>
        </div>
      )}

      {/* Zoom modal */}
      {zoomImage && (
        <div
          className="graph-zoom-overlay"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Graph zoomed"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
