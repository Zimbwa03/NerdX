import { useState, useCallback, useRef } from 'react';
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
import { ArrowLeft, Upload, Check, X } from 'lucide-react';

function hasLatex(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return /\\\(|\\\[|\$|\\frac|\\sqrt|\\sum|\\int|\\overrightarrow|\\vec|\\cap|\\cup|\\in|\\subseteq|\\mid|\\text|\\begin|\\theta|\\alpha|\\beta|\\pi/.test(text);
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

  const [question, setQuestion] = useState<Question | null>(state?.question ?? null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [structuredAnswers, setStructuredAnswers] = useState<Record<string, string>>({});
  const [answerImage, setAnswerImage] = useState<File | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const questionStartTime = useRef(Date.now());
  const answerImageInputRef = useRef<HTMLInputElement>(null);

  const isMathSubject = subject?.id === 'mathematics';
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
    (isMathSubject && (isStructured || !hasOptions)) ||
    (isComputerScience && (question?.question_type === 'structured' || question?.question_type === 'essay')) ||
    (isGeography && (question?.question_type === 'structured' || question?.question_type === 'essay')) ||
    (isCommerce && question?.question_type === 'essay') ||
    (isBES && question?.question_type === 'essay');
  const canSubmit = isStructured
    ? hasStructAnswer || !!answerImage
    : hasOptions
      ? !!selectedAnswer
      : !!textAnswer.trim() || !!answerImage;

  const generateNext = useCallback(async () => {
    setGenerating(true);
    setResult(null);
    setSelectedAnswer('');
    setTextAnswer('');
    setStructuredAnswers({});
    setAnswerImage(null);
    try {
      // Streaming is only supported for mathematics subjects; English and others use generate only
      const canStream =
        !!topic?.id &&
        (subject.id === 'mathematics' || subject.id === 'a_level_pure_math' || subject.id === 'a_level_statistics');
      let q: Question | null = null;
      if (canStream) {
        q = await quizApi.generateQuestionStream(subject.id, topic!.id, 'medium', {});
      }
      if (!q) {
        const csFormat = isComputerScience ? quizQuestionFormat : undefined;
        const csBoard = isComputerScience ? quizBoard : undefined;
        const geoFormat = isGeography ? quizQuestionFormat : undefined;
        const commerceFormat = isCommerce ? quizQuestionFormat : undefined;
        const besFormat = isBES ? quizQuestionFormat : undefined;
        const topicParam = isGeography || isCommerce || isBES ? (topic?.name ?? topic?.id) : topic?.id;
        q = await quizApi.generateQuestion(
          subject.id,
          topicParam,
          'medium',
          topic ? 'topical' : 'exam',
          undefined,
          undefined,
          csFormat ?? geoFormat ?? commerceFormat ?? besFormat,
          mixImagesEnabled,
          undefined,
          csBoard
        );
      }
      const creditsRemaining = (q as Question & { credits_remaining?: number })?.credits_remaining;
      if (creditsRemaining !== undefined) updateUser({ credits: creditsRemaining });
      setQuestion(q);
      questionStartTime.current = Date.now();
    } catch (err) {
      console.error('Generate question error', err);
    } finally {
      setGenerating(false);
    }
  }, [subject.id, topic, mixImagesEnabled, updateUser, isComputerScience, isGeography, isCommerce, isBES, quizQuestionFormat, quizBoard]);

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
      questionFormat: (isComputerScience || isCommerce) ? quizQuestionFormat : undefined,
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
        <div className="quiz-loading">
          <p>Generating your question…</p>
          <div className="quiz-loading-dots" />
        </div>
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
          <h2 className="quiz-question-label">Question</h2>
          {(isMathSubject || hasLatex(formattedQuestion)) ? (
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
                    {(isMathSubject || hasLatex(part.question)) ? (
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
                {!result && allowsImageUpload && (
                  <div className="quiz-answer-image-block">
                    <input
                      ref={answerImageInputRef}
                      type="file"
                      accept="image/*"
                      className="quiz-file-hidden"
                      onChange={(e) => setAnswerImage(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      className="quiz-upload-btn"
                      onClick={() => answerImageInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      <Upload size={18} /> {answerImage ? 'Change Image' : 'Upload Answer Image'}
                    </button>
                    {answerImage && <span className="quiz-image-name">{answerImage.name}</span>}
                  </div>
                )}
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
                  {(isMathSubject || hasLatex(opt)) ? (
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
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Enter your answer..."
              rows={4}
              disabled={!!result}
            />
            {!result && allowsImageUpload && (
              <div className="quiz-answer-image-block">
                <input
                  ref={answerImageInputRef}
                  type="file"
                  accept="image/*"
                  className="quiz-file-hidden"
                  onChange={(e) => setAnswerImage(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  className="quiz-upload-btn"
                  onClick={() => answerImageInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Upload size={18} /> {answerImage ? 'Change Image' : 'Upload Answer Image'}
                </button>
                {answerImage && <span className="quiz-image-name">{answerImage.name}</span>}
              </div>
            )}
          </div>
        )}

        {!result && (
          <button
            type="button"
            className="quiz-submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
          >
            {loading ? 'Checking…' : 'Submit'}
          </button>
        )}

        {result && (
          <div className="quiz-result-block">
            <div className={`quiz-result-badge ${result.correct ? 'correct' : 'incorrect'}`}>
              {result.correct ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            {result.points_earned > 0 && (
              <span className="quiz-points">+{result.points_earned} points</span>
            )}
            <p className="quiz-feedback">{result.feedback}</p>
            {(result.what_went_right || result.what_went_wrong) && (
              <div className="quiz-feedback-details">
                {result.what_went_right && (
                  <p className="quiz-what-right">✓ {result.what_went_right}</p>
                )}
                {result.what_went_wrong && (
                  <p className="quiz-what-wrong">✗ {result.what_went_wrong}</p>
                )}
              </div>
            )}
            {result.improvement_tips && (
              <p className="quiz-tips">💡 {result.improvement_tips}</p>
            )}
            <div className="quiz-solution-block">
              <h3>Solution</h3>
              {(isMathSubject || hasLatex(result.solution)) ? (
                <MathRenderer content={result.solution} fontSize={15} className="quiz-solution-math" />
              ) : (
                <p>{result.solution}</p>
              )}
            </div>
            {result.hint && !result.correct && (
              <div className="quiz-hint-block">
                <h3>Hint</h3>
                <p>{result.hint}</p>
              </div>
            )}
            {result.encouragement && (
              <p className="quiz-encouragement">{result.encouragement}</p>
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
