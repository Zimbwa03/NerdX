import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  quizApi,
  type Question,
  type Topic,
  type AnswerResult,
} from '../../services/api/quizApi';
import { calculateQuizCreditCost } from '../../utils/creditCalculator';
import { formatQuestionParts } from '../../utils/formatQuestionText';
import { MathRenderer } from '../../components/MathRenderer';
import { isMathRenderSubject, hasLatex } from '../../utils/mathSubjects';
import { ArrowLeft, Upload, Camera, Mic, Square, Loader2, Check, X } from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';

/* ---- helpers ---- */
function fileToBase64(file: File): Promise<{ base64: string; mime_type: string }> {
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

interface Subject {
  id: string;
  name: string;
  color: string;
}

export function QuizPage() {
  const { state } = useLocation() as {
    state?: {
      question: Question;
      subject: Subject;
      topic?: Topic;
      mixImagesEnabled?: boolean;
      backTo?: string;
      board?: 'zimsec' | 'cambridge';
      questionFormat?: 'mcq' | 'structured' | 'essay';
      formLevel?: string;
    };
  };
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const subject = state?.subject ?? { id: 'mathematics', name: 'O Level Mathematics', color: '#2979FF' };
  const topic = state?.topic;
  const mixImagesEnabled = state?.mixImagesEnabled ?? false;
  const backTo = state?.backTo ?? '/app/mathematics';
  const quizBoard = state?.board;
  const quizQuestionFormat = state?.questionFormat;
  const formLevel = state?.formLevel;

  const [question, setQuestion] = useState<Question | null>(state?.question ?? null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [structuredAnswers, setStructuredAnswers] = useState<Record<string, string>>({});
  const [answerImage, setAnswerImage] = useState<File | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);
  const questionStartTime = useRef(Date.now());
  const answerImageInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const useMathRenderer = isMathRenderSubject(subject?.id);
  const isComputerScience = subject?.id === 'computer_science' || subject?.id === 'a_level_computer_science';
  const isGeography = subject?.id === 'geography' || subject?.id === 'a_level_geography';
  const isCommerce = subject?.id === 'commerce';
  const isBES = subject?.id === 'business_enterprise_skills';
  const isStructured =
    question?.question_type === 'structured' && question.structured_question;
  const structParts = question?.structured_question?.parts ?? [];
  const hasStructAnswer = structParts.some(
    (p) => (structuredAnswers[p.label] ?? '').trim().length > 0
  );
  const hasOptions = Array.isArray(question?.options) && (question?.options?.length ?? 0) > 0;
  const allowsImageUpload =
    (useMathRenderer && (isStructured || !hasOptions)) ||
    (isComputerScience && (question?.question_type === 'structured' || question?.question_type === 'essay')) ||
    (isGeography && (question?.question_type === 'structured' || question?.question_type === 'essay')) ||
    (isCommerce && question?.question_type === 'essay') ||
    (isBES && question?.question_type === 'essay');
  const canSubmit = isStructured
    ? hasStructAnswer || !!answerImage
    : hasOptions
      ? !!selectedAnswer
      : !!textAnswer.trim() || !!answerImage;

  // Cleanup media streams on unmount
  useEffect(() => {
    return () => {
      try { mediaRecorderRef.current?.stop(); } catch { /* no-op */ }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const generateNext = useCallback(async () => {
    setGenerating(true);
    setResult(null);
    setSelectedAnswer('');
    setTextAnswer('');
    setStructuredAnswers({});
    setAnswerImage(null);
    try {
      const canStream = !!topic?.id && subject.id === 'mathematics';
      let q: Question | null = null;
      if (canStream) {
        q = await quizApi.generateQuestionStream(subject.id, topic!.id, 'medium', {}, formLevel);
      }
      if (!q) {
        const csFormat = isComputerScience ? quizQuestionFormat : undefined;
        const csBoard = isComputerScience ? quizBoard : undefined;
        const geoFormat = isGeography ? quizQuestionFormat : undefined;
        const commerceFormat = isCommerce ? quizQuestionFormat : undefined;
        const besFormat = isBES ? quizQuestionFormat : undefined;
        const aLevelPureMathFormat = subject.id === 'a_level_pure_math' ? quizQuestionFormat : undefined;
        const aLevelPhysicsFormat = subject.id === 'a_level_physics' ? quizQuestionFormat : undefined;
        const aLevelChemistryFormat = subject.id === 'a_level_chemistry' ? quizQuestionFormat : undefined;
        const topicParam = isGeography || isCommerce || isBES ? (topic?.name ?? topic?.id) : topic?.id;
        q = await quizApi.generateQuestion(
          subject.id,
          topicParam,
          'medium',
          topic ? 'topical' : 'exam',
          undefined,
          undefined,
          csFormat ?? geoFormat ?? commerceFormat ?? besFormat ?? aLevelPureMathFormat ?? aLevelPhysicsFormat ?? aLevelChemistryFormat,
          mixImagesEnabled,
          undefined,
          csBoard,
          formLevel
        );
      }
      const creditsRemaining = (q as Question & { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) updateUser({ credits: creditsRemaining });
      setQuestion(q);
      questionStartTime.current = Date.now();
    } catch (err) {
      console.error('Generate question error', err);
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
    } finally {
      setGenerating(false);
    }
  }, [subject.id, topic, mixImagesEnabled, updateUser, isComputerScience, isGeography, isCommerce, isBES, quizQuestionFormat, quizBoard, formLevel, navigate]);

  const uploadAnswerImage = async (): Promise<string | undefined> => {
    if (!answerImage) return undefined;
    setUploadingImage(true);
    try {
      const url = await quizApi.uploadImage(answerImage);
      return url ?? undefined;
    } finally {
      setUploadingImage(false);
    }
  };

  /* ---- OCR from image (upload / capture) ---- */
  const handleImageOcr = async (file: File | null | undefined) => {
    if (!file) return;
    setOcrLoading(true);
    try {
      const payload = await fileToBase64(file);
      // Use the extract-from-images endpoint (same as History/English)
      const res = await fetch('/api/mobile/english/essay/extract-from-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
        body: JSON.stringify({ images: [payload] }),
      });
      const json = await res.json();
      if (json.success && json.data?.extracted_text) {
        if (isStructured) {
          // Append to the first empty structured part
          const firstEmpty = structParts.find((p) => !(structuredAnswers[p.label] ?? '').trim());
          const targetLabel = firstEmpty?.label ?? structParts[0]?.label;
          if (targetLabel) {
            setStructuredAnswers((prev) => ({
              ...prev,
              [targetLabel]: ((prev[targetLabel] ?? '') + '\n' + json.data.extracted_text).trim(),
            }));
          }
        } else {
          setTextAnswer((prev) => (prev.trim() ? prev + '\n' : '') + json.data.extracted_text.trim());
        }
      }
      // Also store the raw image for submission
      setAnswerImage(file);
    } catch (err) {
      console.error('OCR failed:', err);
    } finally {
      setOcrLoading(false);
    }
  };

  /* ---- Voice recording ---- */
  const startRecording = async () => {
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
      setRecordingActive(true);
    } catch {
      console.error('Microphone access failed');
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    setVoiceLoading(true);
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
      const audioFile = new File([blob], 'quiz-voice.webm', { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioFile);
      const res = await fetch('/api/mobile/voice/transcribe', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.text) {
        setTextAnswer((prev) => (prev.trim() ? prev + '\n' : '') + json.text.trim());
      }
    } catch {
      console.error('Voice transcription failed');
    } finally {
      setRecordingActive(false);
      setVoiceLoading(false);
      mediaRecorderRef.current = null;
    }
  };

  const handleSubmit = async () => {
    if (!question || !canSubmit) return;
    setLoading(true);
    try {
      let answerToSubmit: string;
      if (isStructured) {
        answerToSubmit = structParts
          .map((p) => `${p.label}: ${structuredAnswers[p.label] ?? ''}`)
          .join('\n\n');
      } else {
        answerToSubmit = hasOptions ? selectedAnswer : textAnswer.trim();
      }
      let imageUrl: string | undefined;
      if (allowsImageUpload && answerImage) {
        imageUrl = await uploadAnswerImage();
      }
      const res = await quizApi.submitAnswer(
        question.id,
        answerToSubmit,
        imageUrl,
        subject.id,
        question.correct_answer,
        question.solution,
        question.hint,
        question.question_text,
        question.options,
        isStructured ? question.structured_question : undefined,
        question.question_type
      );
      if (res) {
        setResult(res);
        const creditsRemaining = (res as AnswerResult & { credits_remaining?: number })?.credits_remaining;
        if (creditsRemaining !== undefined) updateUser({ credits: creditsRemaining });
      }
    } catch (err) {
      console.error('Submit answer error', err);
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (generating) return;
    const userCredits = user?.credits ?? 0;
    const cost = calculateQuizCreditCost({
      subject: subject.id,
      questionType: topic ? 'topical' : 'exam',
      isImageQuestion: mixImagesEnabled,
      questionFormat:
        (isComputerScience || isCommerce || isBES || isGeography || subject.id === 'a_level_pure_math' || subject.id === 'a_level_physics' || subject.id === 'a_level_chemistry')
          ? quizQuestionFormat
          : undefined,
    });
    if (userCredits < cost) {
      navigate('/app/credits');
      return;
    }
    generateNext();
  };

  const handleBack = () => {
    navigate(backTo);
  };

  /* ---- Answer toolbar (Upload / Capture / Voice) ---- */
  const renderAnswerToolbar = () => {
    if (!allowsImageUpload || !!result) return null;
    return (
      <div className="quiz-answer-toolbar">
        <button
          type="button"
          className="quiz-tool-btn"
          disabled={ocrLoading || loading || generating}
          onClick={() => answerImageInputRef.current?.click()}
        >
          <Upload size={14} /> Upload
        </button>
        <button
          type="button"
          className="quiz-tool-btn"
          disabled={ocrLoading || loading || generating}
          onClick={() => captureInputRef.current?.click()}
        >
          <Camera size={14} /> Capture
        </button>
        {recordingActive ? (
          <button
            type="button"
            className="quiz-tool-btn recording"
            disabled={voiceLoading || loading || generating}
            onClick={() => { void stopRecording(); }}
          >
            <Square size={14} /> Stop
          </button>
        ) : (
          <button
            type="button"
            className="quiz-tool-btn"
            disabled={recordingActive || voiceLoading || loading || generating}
            onClick={() => { void startRecording(); }}
          >
            <Mic size={14} /> Voice
          </button>
        )}
        {ocrLoading && (
          <span className="quiz-tool-status">
            <Loader2 size={14} className="spin" /> Analyzing image...
          </span>
        )}
        {voiceLoading && (
          <span className="quiz-tool-status">
            <Loader2 size={14} className="spin" /> Transcribing...
          </span>
        )}
        {/* hidden file inputs */}
        <input
          ref={answerImageInputRef}
          type="file"
          accept="image/*"
          className="quiz-file-hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.currentTarget.value = '';
            void handleImageOcr(file);
          }}
        />
        <input
          ref={captureInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="quiz-file-hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.currentTarget.value = '';
            void handleImageOcr(file);
          }}
        />
        {answerImage && <span className="quiz-image-name">{answerImage.name}</span>}
      </div>
    );
  };

  if (!question && !generating) {
    return (
      <div className="quiz-page">
        <Link to={backTo} className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p className="quiz-no-question">No question loaded. Start from the Topics page.</p>
      </div>
    );
  }

  if (generating && !question) {
    return (
      <div className="quiz-page">
        <AILoadingOverlay
          isVisible={true}
          title="Generating Question"
          subtitle="Crafting a mathematics problem"
          accentColor={subject.color}
          variant="inline"
        />
      </div>
    );
  }

  if (!question) return null;

  const questionText = question.structured_question
    ? question.structured_question.stem
    : question.question_text;
  const formattedQuestion = formatQuestionParts(questionText);

  return (
    <div className="quiz-page">
      <header className="quiz-header-bar">
        <button type="button" className="back-link" onClick={handleBack}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="quiz-title">Practice</h1>
        <span className="quiz-credits">Credits: {user?.credits ?? 0}</span>
        {topic && <span className="quiz-topic-badge">{topic.name}</span>}
      </header>

      <main className="quiz-main">
        <div className="quiz-question-card">
          <h2 className="quiz-question-label">QUESTION</h2>
          {(useMathRenderer || hasLatex(formattedQuestion)) ? (
            <MathRenderer content={formattedQuestion} fontSize={16} className="quiz-question-math" />
          ) : (
            <p className="quiz-question-text">{formattedQuestion}</p>
          )}
          {question.question_image_url && (
            <div className="quiz-question-image-wrap">
              <img
                src={question.question_image_url}
                alt="Question"
                className="quiz-question-image"
              />
            </div>
          )}
        </div>

        {isStructured ? (
          <div className="quiz-structured-block">
            {question.structured_question && (
              <>
                <div className="quiz-structured-header">
                  <span>Structured Question</span>
                  <span className="quiz-structured-marks">
                    Total: {question.structured_question.total_marks} marks
                  </span>
                </div>
                {structParts.map((part) => (
                  <div key={part.label} className="quiz-struct-part-card">
                    <div className="quiz-struct-part-header">
                      <span className="quiz-struct-label">{part.label}</span>
                      <span className="quiz-struct-marks">[{part.marks}]</span>
                    </div>
                    {(useMathRenderer || hasLatex(part.question)) ? (
                      <MathRenderer content={formatQuestionParts(part.question)} fontSize={15} className="quiz-struct-math" />
                    ) : (
                      <p className="quiz-struct-question">{formatQuestionParts(part.question)}</p>
                    )}
                    {!result && (
                      <div className="quiz-struct-input-wrap">
                        <label>Your Answer</label>
                        <textarea
                          value={structuredAnswers[part.label] ?? ''}
                          onChange={(e) =>
                            setStructuredAnswers((prev) => ({
                              ...prev,
                              [part.label]: e.target.value.slice(0, 200),
                            }))
                          }
                          placeholder={`Brief answer for ${part.label}…`}
                          rows={2}
                          maxLength={200}
                        />
                      </div>
                    )}
                    {result && structuredAnswers[part.label] && (
                      <div className="quiz-struct-your-answer">
                        <strong>Your Answer:</strong> {structuredAnswers[part.label]}
                      </div>
                    )}
                  </div>
                ))}
                {renderAnswerToolbar()}
              </>
            )}
          </div>
        ) : hasOptions ? (
          <div className="quiz-options">
            {question.options!.map((opt, index) => {
              const label = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === opt;
              const isCorrect = result?.correct && opt === question.correct_answer;
              const isWrong = result && !result.correct && isSelected;

              return (
                <button
                  key={index}
                  type="button"
                  className={`quiz-option-btn ${isSelected ? 'selected' : ''} ${
                    isCorrect ? 'correct' : isWrong ? 'wrong' : ''
                  }`}
                  onClick={() => !result && setSelectedAnswer(opt)}
                  disabled={!!result}
                >
                  <span className="quiz-option-label">{label}</span>
                  {(useMathRenderer || hasLatex(opt)) ? (
                    <MathRenderer content={opt} fontSize={15} className="quiz-option-math" />
                  ) : (
                    <span>{opt}</span>
                  )}
                  {(isCorrect || isWrong) && (
                    <span className="quiz-option-icon">
                      {isCorrect ? <Check size={20} /> : <X size={20} />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="quiz-text-answer-block">
            {renderAnswerToolbar()}
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Enter your answer...\nYou can also upload a photo of your handwritten answer or use voice input."
              rows={4}
              disabled={!!result}
            />
          </div>
        )}

        {!result && (
          <div className="quiz-result-actions">
            <button type="button" className="quiz-next-btn" onClick={handleNext} disabled={generating || loading}>
              Next Question
            </button>
            <button
              type="button"
              className="quiz-submit-btn"
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
            >
              {loading ? 'Checking...' : 'Submit'}
            </button>
          </div>
        )}

        {result && (
          <div className="quiz-result-block">
            <div className={`quiz-result-badge ${result.correct ? 'correct' : 'incorrect'}`}>
              {result.correct ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            {result.points_earned > 0 && (
              <span className="quiz-points">+{result.points_earned} points</span>
            )}
            <div className="quiz-feedback">
              {(useMathRenderer || hasLatex(result.feedback)) ? (
                <MathRenderer content={result.feedback} fontSize={15} className="quiz-feedback-math" />
              ) : (
                <p>{result.feedback}</p>
              )}
            </div>
            {(result.what_went_right || result.what_went_wrong) && (
              <div className="quiz-feedback-details">
                {result.what_went_right && (
                  <div className="quiz-what-right">
                    <span className="quiz-feedback-icon">✓</span>
                    {(useMathRenderer || hasLatex(result.what_went_right)) ? (
                      <MathRenderer content={result.what_went_right} fontSize={14} />
                    ) : (
                      <span>{result.what_went_right}</span>
                    )}
                  </div>
                )}
                {result.what_went_wrong && (
                  <div className="quiz-what-wrong">
                    <span className="quiz-feedback-icon">✗</span>
                    {(useMathRenderer || hasLatex(result.what_went_wrong)) ? (
                      <MathRenderer content={result.what_went_wrong} fontSize={14} />
                    ) : (
                      <span>{result.what_went_wrong}</span>
                    )}
                  </div>
                )}
              </div>
            )}
            {result.improvement_tips && (
              <div className="quiz-tips">
                <span className="quiz-feedback-icon">💡</span>
                {(useMathRenderer || hasLatex(result.improvement_tips)) ? (
                  <MathRenderer content={result.improvement_tips} fontSize={14} />
                ) : (
                  <span>{result.improvement_tips}</span>
                )}
              </div>
            )}
            <div className="quiz-solution-block">
              <h3>Solution</h3>
              {(useMathRenderer || hasLatex(result.solution)) ? (
                <MathRenderer content={result.solution} fontSize={15} className="quiz-solution-math" />
              ) : (
                <p>{result.solution}</p>
              )}
            </div>
            {result.hint && !result.correct && (
              <div className="quiz-hint-block">
                <h3>Hint</h3>
                {(useMathRenderer || hasLatex(result.hint)) ? (
                  <MathRenderer content={result.hint} fontSize={14} className="quiz-hint-math" />
                ) : (
                  <p>{result.hint}</p>
                )}
              </div>
            )}
            {result.encouragement && (
              <div className="quiz-encouragement">
                {(useMathRenderer || hasLatex(result.encouragement)) ? (
                  <MathRenderer content={result.encouragement} fontSize={14} />
                ) : (
                  <p>{result.encouragement}</p>
                )}
              </div>
            )}
            <div className="quiz-result-actions">
              <button type="button" className="quiz-next-btn" onClick={handleNext}>
                Next Question
              </button>
              <button type="button" className="quiz-back-btn" onClick={handleBack}>
                Back to Topics
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
