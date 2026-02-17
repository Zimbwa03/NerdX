import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader2, Mic, Send, Square, Upload, Camera,
  ChevronRight, Scroll, BookOpen, Award, ChevronDown, ChevronUp,
  AlertCircle, Clock, Target,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import {
  historyApi,
  type HistoryEssayQuestion,
  type HistoryMarkingResult,
  type HistoryFormLevel,
} from '../../services/api/historyApi';
import './HistoryEssay.css';

const SUBJECT_COLOR = '#5D4037';
type PartKey = 'a' | 'b' | 'c';

type LocationState = {
  topic?: { id: string; name: string };
  subject?: { id: string; name: string; color: string };
  formLevel?: HistoryFormLevel;
  backTo?: string;
  question?: HistoryEssayQuestion;
};

function fileToBase64Payload(file: File): Promise<{ base64: string; mime_type: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const out = String(reader.result || '');
      const commaIdx = out.indexOf(',');
      const base64 = commaIdx >= 0 ? out.slice(commaIdx + 1) : out;
      resolve({ base64, mime_type: file.type || 'image/png' });
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function ScoreRing({ score, max, size = 120 }: { score: number; max: number; size?: number }) {
  const pct = max > 0 ? Math.min(score / max, 1) : 0;
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct >= 0.7 ? '#10B981' : pct >= 0.4 ? '#F59E0B' : '#EF4444';
  return (
    <div className="hist-essay-score-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle className="ring-bg" cx={size / 2} cy={size / 2} r={r} />
        <circle
          className="ring-fill"
          cx={size / 2} cy={size / 2} r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="hist-essay-score-value">
        <span className="num" style={{ color }}>{score}</span>
        <span className="den">/ {max}</span>
      </div>
    </div>
  );
}

function getGradeLabel(pct: number) {
  if (pct >= 0.8) return { label: 'Excellent', icon: '🌟' };
  if (pct >= 0.65) return { label: 'Good', icon: '👍' };
  if (pct >= 0.5) return { label: 'Average', icon: '📝' };
  if (pct >= 0.35) return { label: 'Below Average', icon: '📖' };
  return { label: 'Needs Improvement', icon: '💪' };
}

function getScoreClass(score: number, max: number) {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.65) return 'good';
  if (pct >= 0.4) return 'mid';
  return 'low';
}

export function HistoryEssayPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as LocationState;
  const { updateUser } = useAuth();

  const topic = state.topic ?? null;
  const formLevel = state.formLevel ?? 'Form 1';
  const backTo = state.backTo ?? '/app/history';

  const [question, setQuestion] = useState<HistoryEssayQuestion | null>(state.question ?? null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HistoryMarkingResult | null>(null);

  const [partA, setPartA] = useState('');
  const [partB, setPartB] = useState('');
  const [partC, setPartC] = useState('');
  const [recordingPart, setRecordingPart] = useState<PartKey | null>(null);
  const [ocrLoadingPart, setOcrLoadingPart] = useState<PartKey | null>(null);
  const [voiceLoadingPart, setVoiceLoadingPart] = useState<PartKey | null>(null);
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const uploadInputsRef = useRef<Record<PartKey, HTMLInputElement | null>>({ a: null, b: null, c: null });
  const captureInputsRef = useRef<Record<PartKey, HTMLInputElement | null>>({ a: null, b: null, c: null });

  const setPartValue = (part: PartKey, value: string) => {
    if (part === 'a') setPartA(value);
    if (part === 'b') setPartB(value);
    if (part === 'c') setPartC(value);
  };

  const appendPartValue = (part: PartKey, value: string) => {
    if (!value.trim()) return;
    if (part === 'a') setPartA((prev) => `${prev}${prev.trim() ? '\n' : ''}${value.trim()}`);
    if (part === 'b') setPartB((prev) => `${prev}${prev.trim() ? '\n' : ''}${value.trim()}`);
    if (part === 'c') setPartC((prev) => `${prev}${prev.trim() ? '\n' : ''}${value.trim()}`);
  };

  const resetAnswers = () => {
    setPartA(''); setPartB(''); setPartC('');
    setResult(null); setError(null); setExpandedModels({});
  };

  const generateQuestion = async () => {
    if (!topic) return;
    setGenerating(true);
    setError(null);
    setQuestion(null);
    resetAnswers();
    try {
      const res = await historyApi.generateQuestion(topic, 'medium', formLevel);
      if (res.success && res.data) {
        setQuestion(res.data);
        resetAnswers();
        if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
      } else {
        setError(res.message ?? 'Failed to generate question.');
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      setError('Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (question || !topic) return;
    void generateQuestion();
  }, [topic, question]);

  useEffect(() => {
    return () => {
      try { mediaRecorderRef.current?.stop(); } catch { /* no-op */ }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleSubmitAll = async () => {
    if (!question) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await historyApi.submitEssay(question, {
        part_a: partA.trim(),
        part_b: partB.trim(),
        part_c: partC.trim(),
      }, formLevel);
      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.credits_remaining !== undefined) updateUser({ credits: res.data.credits_remaining });
      } else {
        setError(res.message ?? res.data?.error ?? 'Failed to submit.');
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImagePick = async (part: PartKey, file?: File | null) => {
    if (!file) return;
    setError(null);
    setOcrLoadingPart(part);
    try {
      const payload = await fileToBase64Payload(file);
      const res = await historyApi.extractEssayFromImages([payload]);
      if (res.success && res.data?.extracted_text) {
        appendPartValue(part, res.data.extracted_text);
      } else {
        setError(res.message ?? 'Image analysis failed.');
      }
    } catch {
      setError('Image analysis failed. Please try again.');
    } finally {
      setOcrLoadingPart(null);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !recordingPart) return;
    const currentPart = recordingPart;
    setVoiceLoadingPart(currentPart);
    try {
      mediaRecorderRef.current.stop();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      await new Promise<void>((resolve) => {
        if (!mediaRecorderRef.current) return resolve();
        mediaRecorderRef.current.onstop = () => resolve();
      });
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      chunksRef.current = [];
      const audioFile = new File([blob], `history-part-${currentPart}.webm`, { type: 'audio/webm' });
      const res = await historyApi.transcribeAudio(audioFile);
      if (res.success && res.text) {
        appendPartValue(currentPart, res.text);
      } else {
        setError(res.message ?? 'Voice transcription failed.');
      }
    } catch {
      setError('Voice transcription failed. Please try again.');
    } finally {
      setRecordingPart(null);
      setVoiceLoadingPart(null);
      mediaRecorderRef.current = null;
    }
  };

  const startRecording = async (part: PartKey) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingPart(part);
    } catch {
      setError('Microphone access failed. Allow microphone permission and try again.');
    }
  };

  if (!topic && !question) {
    return (
      <div className="hist-essay-page">
        <div className="hist-essay-bg" />
        <Link to={backTo} className="hist-essay-back"><ArrowLeft size={20} /></Link>
        <div className="hist-essay-container" style={{ textAlign: 'center', paddingTop: 140 }}>
          <Scroll size={48} style={{ color: '#8D6E63', marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No Topic Selected</h2>
          <p style={{ opacity: 0.6 }}>Go back and choose a topic from the History page.</p>
        </div>
      </div>
    );
  }

  if (generating && !question) {
    return (
      <div className="hist-essay-page">
        <div className="hist-essay-bg" />
        <Link to={backTo} className="hist-essay-back"><ArrowLeft size={20} /></Link>
        <div className="hist-essay-container">
          <AILoadingOverlay
            isVisible={true}
            title="Generating Question"
            subtitle={`Creating a ${formLevel} ZIMSEC essay question...`}
            accentColor="#8D6E63"
            variant="inline"
          />
        </div>
      </div>
    );
  }

  if (!question) return null;

  const totalMarks = question.total_marks ?? 32;
  const partAInfo = question.parts[0] ?? { label: '[a]', question_text: '', marks: 5 };
  const partBInfo = question.parts[1] ?? { label: '[b]', question_text: '', marks: 12 };
  const partCInfo = question.parts[2] ?? { label: '[c]', question_text: '', marks: 15 };

  const partLabelA = (partAInfo.label ?? '[a]').replace(/[\[\]]/g, '');
  const partLabelB = (partBInfo.label ?? '[b]').replace(/[\[\]]/g, '');
  const partLabelC = (partCInfo.label ?? '[c]').replace(/[\[\]]/g, '');

  const partRows: Array<{
    id: PartKey;
    partLabel: string;
    marks: number;
    questionText: string;
    answer: string;
    setAnswer: (v: string) => void;
    textareaClass: string;
    feedback?: string;
    analysis?: string;
    expectedPoints?: string[];
    modelAnswer?: string;
    score?: number;
  }> = [
    {
      id: 'a', partLabel: partLabelA, marks: partAInfo.marks ?? 5,
      questionText: partAInfo.question_text ?? '', answer: partA,
      setAnswer: (v) => setPartValue('a', v), textareaClass: 'short',
      feedback: result?.part_a_feedback, analysis: result?.breakdown?.part_a_analysis,
      expectedPoints: result?.part_a_expected_points, modelAnswer: result?.part_a_model_answer,
      score: result?.part_a_score,
    },
    {
      id: 'b', partLabel: partLabelB, marks: partBInfo.marks ?? 12,
      questionText: partBInfo.question_text ?? '', answer: partB,
      setAnswer: (v) => setPartValue('b', v), textareaClass: '',
      feedback: result?.part_b_feedback, analysis: result?.breakdown?.part_b_analysis,
      expectedPoints: result?.part_b_expected_points, modelAnswer: result?.part_b_model_answer,
      score: result?.part_b_score,
    },
    {
      id: 'c', partLabel: partLabelC, marks: partCInfo.marks ?? 15,
      questionText: partCInfo.question_text ?? '', answer: partC,
      setAnswer: (v) => setPartValue('c', v), textareaClass: 'tall',
      feedback: result?.part_c_feedback, analysis: result?.breakdown?.part_c_analysis,
      expectedPoints: result?.part_c_expected_points, modelAnswer: result?.part_c_model_answer,
      score: result?.part_c_score,
    },
  ];

  const anyAnswerFilled = partA.trim() || partB.trim() || partC.trim();
  const totalScore = result ? (result.total ?? 0) : 0;
  const gradePct = totalMarks > 0 ? totalScore / totalMarks : 0;
  const grade = getGradeLabel(gradePct);

  return (
    <div className="hist-essay-page">
      <div className="hist-essay-bg" />
      <Link to={backTo} className="hist-essay-back"><ArrowLeft size={20} /></Link>

      <div className="hist-essay-container">
        <div className="hist-essay-header">
          <div className="hist-essay-badge">
            <Scroll size={12} />
            <span>{formLevel} · History</span>
          </div>
          <h1>{question.topic}</h1>
          <p>Paper 1 Essay — 3-Part ZIMSEC Format</p>
          <div className="hist-essay-meta-row">
            <div className="hist-essay-meta-chip">
              <Target size={14} />
              <span>{totalMarks} marks</span>
            </div>
            <div className="hist-essay-meta-chip">
              <Clock size={14} />
              <span>~45 minutes</span>
            </div>
            <div className="hist-essay-meta-chip">
              <BookOpen size={14} />
              <span>{question.parts.length} parts</span>
            </div>
          </div>
        </div>

        <div className="hist-essay-context-card">
          <div className="hist-essay-context-title">
            <BookOpen size={16} />
            Exam Context
          </div>
          <p className="hist-essay-context-text">{question.question_text}</p>
        </div>

        {partRows.map((row) => (
          <div className="hist-essay-part-card" key={row.id}>
            <div className="hist-essay-part-header">
              <div className="hist-essay-part-label">
                <div className="hist-essay-part-num">{row.partLabel}</div>
                <h3 className="hist-essay-part-title">Part ({row.partLabel})</h3>
              </div>
              <div className="hist-essay-part-marks">{row.marks} marks</div>
            </div>

            <div className="hist-essay-part-question">{row.questionText}</div>

            {!result && (
              <>
                <div className="hist-essay-toolbar">
                  <button
                    type="button"
                    className="hist-essay-tool-btn"
                    disabled={!!ocrLoadingPart || submitting || generating}
                    onClick={() => uploadInputsRef.current[row.id]?.click()}
                  >
                    <Upload size={14} /> Upload
                  </button>
                  <button
                    type="button"
                    className="hist-essay-tool-btn"
                    disabled={!!ocrLoadingPart || submitting || generating}
                    onClick={() => captureInputsRef.current[row.id]?.click()}
                  >
                    <Camera size={14} /> Capture
                  </button>
                  {recordingPart === row.id ? (
                    <button
                      type="button"
                      className="hist-essay-tool-btn recording"
                      disabled={!!voiceLoadingPart || submitting || generating}
                      onClick={() => { void stopRecording(); }}
                    >
                      <Square size={14} /> Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="hist-essay-tool-btn"
                      disabled={!!recordingPart || !!voiceLoadingPart || submitting || generating}
                      onClick={() => { void startRecording(row.id); }}
                    >
                      <Mic size={14} /> Voice
                    </button>
                  )}
                  {ocrLoadingPart === row.id && (
                    <span className="hist-essay-tool-status">
                      <Loader2 size={14} className="spin" /> Analyzing image...
                    </span>
                  )}
                  {voiceLoadingPart === row.id && (
                    <span className="hist-essay-tool-status">
                      <Loader2 size={14} className="spin" /> Transcribing...
                    </span>
                  )}
                </div>

                <input
                  ref={(el) => { uploadInputsRef.current[row.id] = el; }}
                  type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.currentTarget.value = '';
                    void handleImagePick(row.id, file);
                  }}
                />
                <input
                  ref={(el) => { captureInputsRef.current[row.id] = el; }}
                  type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.currentTarget.value = '';
                    void handleImagePick(row.id, file);
                  }}
                />

                <textarea
                  className={`hist-essay-textarea ${row.textareaClass}`}
                  placeholder={`Write your answer for part (${row.partLabel}) here...\nYou can also upload a photo of your handwritten answer or use voice input.`}
                  value={row.answer}
                  onChange={(e) => row.setAnswer(e.target.value)}
                  disabled={submitting}
                />
                <div className="hist-essay-char-count">
                  {row.answer.length > 0
                    ? `${row.answer.split(/\s+/).filter(Boolean).length} words`
                    : ''}
                </div>
              </>
            )}

            {result && row.score !== undefined && (
              <>
                <div className="hist-essay-fb-header">
                  <div className="hist-essay-fb-header-left">
                    <div className="hist-essay-part-num" style={{ width: 28, height: 28, fontSize: 12 }}>{row.partLabel}</div>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Part ({row.partLabel}) Score</span>
                  </div>
                  <div className={`hist-essay-fb-score-pill ${getScoreClass(row.score, row.marks)}`}>
                    {row.score}/{row.marks}
                  </div>
                </div>

                {row.answer.trim() && (
                  <div className="hist-essay-submitted-answer">
                    <div className="hist-essay-fb-section-title">Your Answer</div>
                    <p className="hist-essay-fb-text" style={{ whiteSpace: 'pre-wrap' }}>{row.answer}</p>
                  </div>
                )}

                <div className="hist-essay-fb-body">
                  {row.feedback && (
                    <div className="hist-essay-fb-section">
                      <div className="hist-essay-fb-section-title">Feedback</div>
                      <p className="hist-essay-fb-text">{row.feedback}</p>
                    </div>
                  )}
                  {row.analysis && (
                    <div className="hist-essay-fb-section">
                      <div className="hist-essay-fb-section-title">Detailed Analysis</div>
                      <p className="hist-essay-fb-text">{row.analysis}</p>
                    </div>
                  )}
                  {row.expectedPoints && row.expectedPoints.length > 0 && (
                    <div className="hist-essay-fb-section">
                      <div className="hist-essay-fb-section-title">Expected Points</div>
                      <ul className="hist-essay-fb-points">
                        {row.expectedPoints.map((pt, idx) => (<li key={idx}>{pt}</li>))}
                      </ul>
                    </div>
                  )}
                  {row.modelAnswer && (
                    <>
                      <button
                        type="button"
                        className="hist-essay-model-toggle"
                        onClick={() => setExpandedModels((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                      >
                        <BookOpen size={14} />
                        {expandedModels[row.id] ? 'Hide' : 'Show'} Model Answer
                        {expandedModels[row.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      {expandedModels[row.id] && (
                        <div className="hist-essay-model-answer" style={{ marginTop: 12, borderRadius: 14 }}>
                          <div className="hist-essay-model-answer-title">Model Answer</div>
                          <p className="hist-essay-model-answer-text">{row.modelAnswer}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {error && (
          <div className="hist-essay-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {!result && (
          <div className="hist-essay-actions">
            <button
              type="button"
              className="hist-essay-submit-btn"
              onClick={handleSubmitAll}
              disabled={submitting || generating || !anyAnswerFilled}
            >
              {submitting ? (
                <><Loader2 size={20} className="spin" /> Marking Your Essay...</>
              ) : (
                <><Send size={20} /> Submit All Answers</>
              )}
            </button>
            <button
              type="button"
              className="hist-essay-next-btn"
              onClick={() => { void generateQuestion(); }}
              disabled={generating || submitting}
            >
              {generating ? (
                <><Loader2 size={18} className="spin" /> Loading...</>
              ) : (
                <>New Question <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        )}

        {result && (
          <div className="hist-essay-results">
            <div className="hist-essay-score-banner">
              <ScoreRing score={totalScore} max={totalMarks} />
              <div className="hist-essay-score-label">Total Score</div>
              <div className="hist-essay-score-grade">
                <span>{grade.icon}</span>
                <span>{grade.label}</span>
              </div>
            </div>

            {(result.teacher_feedback || result.constructive_feedback) && (
              <div className="hist-essay-teacher-card">
                <h3><Award size={18} /> Teacher's Comment</h3>
                <p>{result.teacher_feedback || result.constructive_feedback}</p>
              </div>
            )}

            <div className="hist-essay-actions">
              <button
                type="button"
                className="hist-essay-submit-btn"
                onClick={() => { void generateQuestion(); }}
                disabled={generating}
              >
                {generating ? (
                  <><Loader2 size={20} className="spin" /> Generating...</>
                ) : (
                  <><ChevronRight size={20} /> Try Another Question</>
                )}
              </button>
              <Link to={backTo} className="hist-essay-next-btn" style={{ textDecoration: 'none' }}>
                <ArrowLeft size={18} /> Back to Topics
              </Link>
            </div>
          </div>
        )}
      </div>

      <AILoadingOverlay
        isVisible={submitting}
        title="Marking Your Essay"
        subtitle="AI is analyzing your answers and providing detailed feedback..."
        accentColor={SUBJECT_COLOR}
        variant="fullscreen"
      />
    </div>
  );
}
