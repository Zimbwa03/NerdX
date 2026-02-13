import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Mic, Send, Square, Upload, Camera, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import {
  historyApi,
  type HistoryEssayQuestion,
  type HistoryMarkingResult,
} from '../../services/api/historyApi';

const SUBJECT_COLOR = '#5D4037';
type PartKey = 'a' | 'b' | 'c';

type LocationState = {
  topic?: { id: string; name: string };
  subject?: { id: string; name: string; color: string };
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

export function HistoryEssayPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const { updateUser } = useAuth();

  const topic = state.topic ?? null;
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
    setPartA('');
    setPartB('');
    setPartC('');
    setResult(null);
    setError(null);
  };

  const generateQuestion = async () => {
    if (!topic) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await historyApi.generateQuestion(topic);
      if (res.success && res.data) {
        setQuestion(res.data);
        resetAnswers();
        if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
      } else {
        setError(res.message ?? 'Failed to generate question.');
      }
    } catch {
      setError('Failed to generate question. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (question || !topic) return;
    void generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, question]);

  useEffect(() => {
    return () => {
      try {
        mediaRecorderRef.current?.stop();
      } catch {
        // no-op
      }
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
      });
      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.credits_remaining !== undefined) updateUser({ credits: res.data.credits_remaining });
      } else {
        setError(res.message ?? res.data?.error ?? 'Failed to submit.');
      }
    } catch {
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
      <div className="commerce-topics-page history-essay-page">
        <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT_COLOR }}>
          <Link to={backTo} className="back-link"><ArrowLeft size={20} /> Back</Link>
          <h1 className="commerce-topics-title">History Study Exam</h1>
        </header>
        <p className="commerce-notes-detail-not-found">No topic selected. Choose a topic from the History page.</p>
      </div>
    );
  }

  if (generating && !question) {
    return (
      <div className="commerce-topics-page history-essay-page">
        <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT_COLOR }}>
          <Link to={backTo} className="back-link"><ArrowLeft size={20} /> Back</Link>
          <h1 className="commerce-topics-title">History Study Exam</h1>
        </header>
        <AILoadingOverlay
          isVisible={true}
          title="Generating Question"
          subtitle="Creating a ZIMSEC-aligned question"
          accentColor="#F59E0B"
          variant="inline"
        />
      </div>
    );
  }

  if (!question) return null;

  const totalMarks = question.total_marks ?? 32;
  const partAInfo = question.parts[0] ?? { label: '[a]', question_text: '', marks: 5 };
  const partBInfo = question.parts[1] ?? { label: '[b]', question_text: '', marks: 12 };
  const partCInfo = question.parts[2] ?? { label: '[c]', question_text: '', marks: 15 };

  const partRows: Array<{
    id: PartKey;
    title: string;
    marks: number;
    questionText: string;
    answer: string;
    setAnswer: (v: string) => void;
    feedback?: string;
    analysis?: string;
    expectedPoints?: string[];
    modelAnswer?: string;
    score?: number;
  }> = [
    {
      id: 'a',
      title: 'Question 1',
      marks: partAInfo.marks ?? 5,
      questionText: partAInfo.question_text ?? '',
      answer: partA,
      setAnswer: (v) => setPartValue('a', v),
      feedback: result?.part_a_feedback,
      analysis: result?.breakdown?.part_a_analysis,
      expectedPoints: result?.part_a_expected_points,
      modelAnswer: result?.part_a_model_answer,
      score: result?.part_a_score,
    },
    {
      id: 'b',
      title: 'Question 2',
      marks: partBInfo.marks ?? 12,
      questionText: partBInfo.question_text ?? '',
      answer: partB,
      setAnswer: (v) => setPartValue('b', v),
      feedback: result?.part_b_feedback,
      analysis: result?.breakdown?.part_b_analysis,
      expectedPoints: result?.part_b_expected_points,
      modelAnswer: result?.part_b_model_answer,
      score: result?.part_b_score,
    },
    {
      id: 'c',
      title: 'Question 3',
      marks: partCInfo.marks ?? 15,
      questionText: partCInfo.question_text ?? '',
      answer: partC,
      setAnswer: (v) => setPartValue('c', v),
      feedback: result?.part_c_feedback,
      analysis: result?.breakdown?.part_c_analysis,
      expectedPoints: result?.part_c_expected_points,
      modelAnswer: result?.part_c_model_answer,
      score: result?.part_c_score,
    },
  ];

  return (
    <div className="commerce-topics-page history-essay-page">
      <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT_COLOR }}>
        <Link to={backTo} className="back-link"><ArrowLeft size={20} /> Back</Link>
        <h1 className="commerce-topics-title">History Study Exam</h1>
        <p className="commerce-topics-subtitle">Topic: {question.topic}</p>
      </header>

      <main className="commerce-notes-detail-content" style={{ maxWidth: '880px', margin: '0 auto' }}>
        <div className="commerce-notes-detail-card" style={{ marginBottom: '1rem' }}>
          <h2 className="commerce-notes-detail-card-title">Exam Context</h2>
          <div className="commerce-notes-detail-body">
            <p style={{ marginBottom: '0.5rem' }}>{question.question_text}</p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Fill all 3 questions. You can type, upload/capture image for OCR, or record voice for transcription.
            </p>
          </div>
        </div>

        {partRows.map((row) => (
          <div className="commerce-notes-detail-card" style={{ marginBottom: '1rem' }} key={row.id}>
            <h3 className="commerce-notes-detail-card-title">{row.title} ({row.marks} marks)</h3>
            <p className="commerce-notes-detail-para" style={{ marginBottom: '0.5rem' }}>{row.questionText}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <button
                type="button"
                className="commerce-modal-cancel"
                disabled={!!ocrLoadingPart || submitting || generating}
                onClick={() => uploadInputsRef.current[row.id]?.click()}
              >
                <Upload size={16} style={{ marginRight: '0.25rem' }} />
                Upload Image
              </button>
              <button
                type="button"
                className="commerce-modal-cancel"
                disabled={!!ocrLoadingPart || submitting || generating}
                onClick={() => captureInputsRef.current[row.id]?.click()}
              >
                <Camera size={16} style={{ marginRight: '0.25rem' }} />
                Capture Image
              </button>
              {recordingPart === row.id ? (
                <button
                  type="button"
                  className="commerce-modal-start"
                  disabled={!!voiceLoadingPart || submitting || generating}
                  onClick={() => { void stopRecording(); }}
                >
                  <Square size={16} style={{ marginRight: '0.25rem' }} />
                  Stop Recording
                </button>
              ) : (
                <button
                  type="button"
                  className="commerce-modal-start"
                  disabled={!!recordingPart || !!voiceLoadingPart || submitting || generating}
                  onClick={() => { void startRecording(row.id); }}
                >
                  <Mic size={16} style={{ marginRight: '0.25rem' }} />
                  Record Voice
                </button>
              )}
              {ocrLoadingPart === row.id && <span style={{ fontSize: '0.9rem' }}>Analyzing image...</span>}
              {voiceLoadingPart === row.id && <span style={{ fontSize: '0.9rem' }}>Transcribing voice...</span>}
            </div>

            <input
              ref={(el) => { uploadInputsRef.current[row.id] = el; }}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.currentTarget.value = '';
                void handleImagePick(row.id, file);
              }}
            />
            <input
              ref={(el) => { captureInputsRef.current[row.id] = el; }}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.currentTarget.value = '';
                void handleImagePick(row.id, file);
              }}
            />

            <textarea
              className="commerce-notes-detail-body"
              rows={row.id === 'a' ? 4 : 6}
              placeholder={`Your answer for ${row.title}...`}
              value={row.answer}
              onChange={(e) => row.setAnswer(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', resize: 'vertical' }}
            />

            {result && (
              <div style={{ marginTop: '0.75rem' }}>
                <p style={{ marginBottom: '0.25rem' }}>
                  <strong>Score:</strong> {row.score ?? 0}/{row.marks}
                </p>
                {row.feedback ? (
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Feedback:</strong> {row.feedback}
                  </p>
                ) : null}
                {row.analysis ? (
                  <p style={{ marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
                    <strong>Explanation:</strong> {row.analysis}
                  </p>
                ) : null}
                {row.expectedPoints && row.expectedPoints.length > 0 ? (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Expected points:</strong>
                    <ul style={{ margin: '0.25rem 0 0 1rem' }}>
                      {row.expectedPoints.map((pt, idx) => (<li key={`${row.id}-pt-${idx}`}>{pt}</li>))}
                    </ul>
                  </div>
                ) : null}
                {row.modelAnswer ? (
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    <strong>Model answer:</strong> {row.modelAnswer}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        ))}

        {error && <p className="commerce-modal-error" style={{ marginBottom: '1rem' }}>{error}</p>}

        {result && (
          <div className="commerce-notes-detail-card" style={{ marginBottom: '1rem' }}>
            <h3 className="commerce-notes-detail-card-title">Total Mark</h3>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{result.total ?? 0}/{totalMarks}</strong>
            </p>
            {result.teacher_feedback || result.constructive_feedback ? (
              <p style={{ marginBottom: 0 }}>
                <strong>Teacher feedback:</strong> {result.teacher_feedback || result.constructive_feedback}
              </p>
            ) : null}
          </div>
        )}

        <div className="commerce-modal-actions">
          <button
            type="button"
            className="commerce-modal-start"
            onClick={handleSubmitAll}
            disabled={submitting || generating}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ marginRight: '0.25rem' }} />
                Submitting All...
              </>
            ) : (
              <>
                <Send size={18} style={{ marginRight: '0.25rem' }} />
                Submit All Answers
              </>
            )}
          </button>
          <button
            type="button"
            className="commerce-modal-cancel"
            onClick={() => { void generateQuestion(); }}
            disabled={generating || submitting}
          >
            {generating ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ marginRight: '0.25rem' }} />
                Loading Next...
              </>
            ) : (
              <>
                Next
                <ChevronRight size={18} style={{ marginLeft: '0.25rem' }} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
