import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  englishApi,
  type FreeResponseTopic,
  type GuidedCompositionPrompt,
  type EssayMarkingResult,
  type EssaySubmission,
} from '../../services/api/englishApi';
import { ArrowLeft, PenLine, List, FileText, Camera, History, Download } from 'lucide-react';

const ESSAY_CREDITS = 2;

const MARK_ESSAY_TOPICS: FreeResponseTopic[] = [
  { title: 'Narrative', description: 'Write a story or account of events.', type: 'narrative', suggested_length: '350-450 words' },
  { title: 'Descriptive', description: 'Describe a person, place, or experience.', type: 'descriptive', suggested_length: '350-450 words' },
  { title: 'Expository', description: 'Explain or inform on a topic.', type: 'expository', suggested_length: '350-450 words' },
  { title: 'Argumentative', description: 'Argue a point of view with evidence.', type: 'argumentative', suggested_length: '350-450 words' },
  { title: 'Letter (formal)', description: 'Formal letter – e.g. to a headmaster, organisation.', type: 'argumentative', suggested_length: '350-450 words' },
  { title: 'Letter (informal)', description: 'Informal letter – e.g. to a friend or relative.', type: 'narrative', suggested_length: '350-450 words' },
  { title: 'Speech or Report', description: 'Speech or report on a given topic.', type: 'expository', suggested_length: '350-450 words' },
];

type EssayType = 'free_response' | 'guided' | 'mark_essay' | null;

export function EnglishEssayPage() {
  const { user, updateUser } = useAuth();
  const [essayType, setEssayType] = useState<EssayType>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [freeTopics, setFreeTopics] = useState<FreeResponseTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<FreeResponseTopic | null>(null);
  const [guidedPrompt, setGuidedPrompt] = useState<GuidedCompositionPrompt | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [essayText, setEssayText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [markingResult, setMarkingResult] = useState<EssayMarkingResult | null>(null);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [history, setHistory] = useState<EssaySubmission[]>([]);
  const [refreshingHistory, setRefreshingHistory] = useState(false);
  const [essayImages, setEssayImages] = useState<Array<{ file: File; dataUrl: string }>>([]);
  const [extractingText, setExtractingText] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [writingStarted, setWritingStarted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchHistory = async () => {
    setRefreshingHistory(true);
    try {
      const data = await englishApi.getEssayHistory();
      setHistory(data);
    } catch {
      setError('Failed to load essay history');
    } finally {
      setRefreshingHistory(false);
    }
  };

  const handleToggleHistory = () => {
    if (!viewingHistory) fetchHistory();
    setViewingHistory(!viewingHistory);
    setEssayType(null);
    setSubmitted(false);
    setError(null);
  };

  const handleViewHistoryItem = (submission: EssaySubmission) => {
    setViewingHistory(false);
    setEssayType(submission.essay_type);
    setEssayText(submission.original_essay);
    setStudentName('Student');
    setStudentSurname('');
    const result: EssayMarkingResult = {
      essay_type: submission.essay_type,
      score: submission.score,
      max_score: submission.max_score,
      breakdown: (submission.detailed_feedback as { breakdown?: EssayMarkingResult['breakdown'] })?.breakdown ?? {},
      corrections: (submission.detailed_feedback as { corrections?: EssayMarkingResult['corrections'] })?.corrections ?? [],
      teacher_comment: submission.teacher_comment,
      corrected_essay: submission.corrected_essay,
      detailed_feedback: typeof submission.detailed_feedback === 'string'
        ? submission.detailed_feedback
        : (submission.detailed_feedback as { detailed_feedback?: string })?.detailed_feedback ?? JSON.stringify(submission.detailed_feedback),
      pdf_report: '',
    };
    setMarkingResult(result);
    setSubmitted(true);
  };

  const handleSelectEssayType = async (type: 'free_response' | 'guided' | 'mark_essay') => {
    setError(null);
    if (type === 'mark_essay') {
      setEssayType('mark_essay');
      setFreeTopics(MARK_ESSAY_TOPICS);
      setEssayImages([]);
      return;
    }
    setLoading(true);
    setIsGenerating(true);
    try {
      if (type === 'free_response') {
        const topics = await englishApi.getFreeResponseTopics();
        setFreeTopics(topics.length ? topics : MARK_ESSAY_TOPICS);
        setEssayType('free_response');
      } else {
        const prompt = await englishApi.getGuidedComposition();
        if (prompt) {
          setGuidedPrompt(prompt);
          setEssayType('guided');
        } else setError('Failed to load guided composition');
      }
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to load essay prompts';
      setError(msg || 'Failed to load');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fileList = Array.from(files).slice(0, 10);
    const next: Array<{ file: File; dataUrl: string }> = [];
    let done = 0;
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        next.push({ file, dataUrl: reader.result as string });
        done++;
        if (done === fileList.length) {
          setEssayImages((prev) => [...prev, ...next].slice(0, 10));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setEssayImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getBase64FromDataUrl = (dataUrl: string): string => {
    const base64 = dataUrl.split(',')[1];
    return base64 || '';
  };

  const handleExtractText = async () => {
    if (!essayImages.length) {
      setError('Please add at least one image first.');
      return;
    }
    setExtractingText(true);
    setError(null);
    try {
      const images = essayImages.map((img) => ({
        base64: getBase64FromDataUrl(img.dataUrl),
        mime_type: img.file.type || 'image/jpeg',
      }));
      const extracted = await englishApi.extractEssayTextFromImages(images);
      if (extracted) {
        setEssayText((prev) => (prev.trim() ? prev.trimEnd() + '\n\n' + extracted : extracted));
      } else {
        setError('No text found in images. Try clearer photos or type manually.');
      }
    } catch (e: unknown) {
      setError('Failed to extract text from images. Please try again.');
      console.error(e);
    } finally {
      setExtractingText(false);
    }
  };

  const handleSubmit = async () => {
    if (!studentName.trim() || !studentSurname.trim()) {
      setError('Please enter your name and surname.');
      return;
    }
    if (!essayText.trim() || essayText.trim().length < 100) {
      setError('Your essay must be at least 100 characters long.');
      return;
    }
    if ((user?.credits ?? 0) < ESSAY_CREDITS) {
      setError(`Essay marking requires ${ESSAY_CREDITS} credits. Please buy credits first.`);
      return;
    }
    if ((essayType === 'free_response' || essayType === 'mark_essay') && !selectedTopic) {
      setError('Please select a topic.');
      return;
    }
    if (essayType === 'guided' && !guidedPrompt) {
      setError('Guided composition not loaded.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await englishApi.submitEssayForMarking(
        essayType === 'mark_essay' ? 'free_response' : essayType!,
        studentName.trim(),
        studentSurname.trim(),
        essayText.trim(),
        (essayType === 'free_response' || essayType === 'mark_essay') ? selectedTopic! : undefined,
        essayType === 'guided' ? guidedPrompt! : undefined
      );
      if (result) {
        setMarkingResult(result);
        setSubmitted(true);
        if (result.credits_remaining !== undefined) updateUser({ credits: result.credits_remaining });
      } else setError('Failed to mark essay.');
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to mark essay';
      setError(msg || 'Failed to mark essay');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!markingResult?.pdf_report) return;
    try {
      const bytes = Uint8Array.from(atob(markingResult.pdf_report), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Essay_${studentName}_${studentSurname}_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to download PDF');
    }
  };

  const handleReset = () => {
    setEssayType(null);
    setFreeTopics([]);
    setSelectedTopic(null);
    setGuidedPrompt(null);
    setWritingStarted(false);
    setStudentName('');
    setStudentSurname('');
    setEssayText('');
    setEssayImages([]);
    setSubmitted(false);
    setMarkingResult(null);
    setError(null);
  };

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
  const showTopicList = (essayType === 'free_response' || essayType === 'mark_essay') && !selectedTopic && !submitted;
  const showGuidedPrompt = essayType === 'guided' && guidedPrompt && !writingStarted && !submitted;
  const showWritingForm =
    ((essayType === 'free_response' || essayType === 'mark_essay') && selectedTopic) ||
    (essayType === 'guided' && guidedPrompt && writingStarted);
  const showWritingFormResolved = showWritingForm && !submitted;

  return (
    <div className="english-essay-page">
      <header className="english-essay-header">
        <Link to="/app/english" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="english-essay-title">Essay Writing</h1>
        <span className="english-essay-credits">Credits: {user?.credits ?? 0}</span>
      </header>

      <main className="english-essay-main">
        {!essayType && !viewingHistory && !submitted && (
          <section className="english-essay-welcome">
            <div className="english-essay-welcome-card">
              <div className="english-essay-welcome-icon">
                <PenLine size={48} />
              </div>
              <h2>Essay Writing</h2>
              <p>Choose your composition type and get professional marking with detailed feedback.</p>
              {error && <p className="english-essay-error">{error}</p>}

              <button
                type="button"
                className="english-essay-menu-btn english-essay-history-btn"
                onClick={handleToggleHistory}
                disabled={loading}
              >
                <History size={24} />
                <div>
                  <strong>View Past Essays</strong>
                  <span>Review your previous submissions and feedback</span>
                </div>
              </button>

              <button
                type="button"
                className="english-essay-menu-btn"
                onClick={() => handleSelectEssayType('free_response')}
                disabled={loading}
              >
                {loading && !isGenerating ? 'Loading…' : <List size={24} />}
                <div>
                  <strong>Free Response</strong>
                  <span>Choose from 7 topics · 30 marks</span>
                </div>
              </button>

              <button
                type="button"
                className="english-essay-menu-btn english-essay-guided-btn"
                onClick={() => handleSelectEssayType('guided')}
                disabled={loading}
              >
                {loading && !isGenerating ? 'Loading…' : <FileText size={24} />}
                <div>
                  <strong>Guided Composition</strong>
                  <span>Letter, Speech, Report · 20 marks</span>
                </div>
              </button>

              <button
                type="button"
                className="english-essay-menu-btn english-essay-mark-btn"
                onClick={() => handleSelectEssayType('mark_essay')}
                disabled={loading}
              >
                <Camera size={24} />
                <div>
                  <strong>Mark Essay</strong>
                  <span>Upload your composition (photos or type) · Extract text from images</span>
                </div>
              </button>

              <p className="english-essay-cost-note">Essay marking costs {ESSAY_CREDITS} credits</p>
            </div>
          </section>
        )}

        {viewingHistory && (
          <section className="english-essay-history-section">
            <button type="button" className="english-essay-back-link" onClick={handleToggleHistory}>
              <ArrowLeft size={20} /> Back to Menu
            </button>
            <h2>Your Essay History</h2>
            {refreshingHistory ? (
              <p>Loading…</p>
            ) : history.length === 0 ? (
              <p className="english-essay-empty">No past essays found.</p>
            ) : (
              <ul className="english-essay-history-list">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="english-essay-history-item"
                      onClick={() => handleViewHistoryItem(item)}
                    >
                      <span className="english-essay-history-badge">{item.essay_type.replace('_', ' ')}</span>
                      <span className="english-essay-history-date">{new Date(item.created_at).toLocaleDateString()}</span>
                      <strong>{item.topic_title || 'Untitled'}</strong>
                      <span className="english-essay-history-score">{item.score}/{item.max_score}</span>
                      <em>{item.teacher_comment}</em>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {showTopicList && (
          <section className="english-essay-topics-section">
            <button type="button" className="english-essay-back-link" onClick={handleReset}>
              <ArrowLeft size={20} /> Change Essay Type
            </button>
            <h2>Select Your Topic</h2>
            <p className="english-essay-subtitle">
              {essayType === 'mark_essay' ? 'Which topic does your essay answer? You can upload images next.' : 'Choose one topic (350-450 words).'}
            </p>
            <div className="english-essay-topic-grid">
              {freeTopics.map((topic, index) => (
                <button
                  key={index}
                  type="button"
                  className="english-essay-topic-card"
                  onClick={() => setSelectedTopic(topic)}
                >
                  <span className="english-essay-topic-type">{topic.type}</span>
                  <strong>{topic.title}</strong>
                  <p>{topic.description}</p>
                  <span className="english-essay-topic-length">{topic.suggested_length}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {showGuidedPrompt && guidedPrompt && (
          <section className="english-essay-guided-section">
            <button type="button" className="english-essay-back-link" onClick={handleReset}>
              <ArrowLeft size={20} /> Change Essay Type
            </button>
            <div className="english-essay-prompt-card">
              <span className="english-essay-prompt-format">{guidedPrompt.format.replace('_', ' ')}</span>
              <h2>{guidedPrompt.title}</h2>
              <p>{guidedPrompt.context}</p>
              <h3>Key points to cover</h3>
              <ul>
                {guidedPrompt.key_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <p className="english-essay-prompt-length">{guidedPrompt.suggested_length}</p>
              <button
                type="button"
                className="english-essay-btn-primary"
                onClick={() => setWritingStarted(true)}
              >
                Start Writing
              </button>
            </div>
          </section>
        )}

        {showWritingFormResolved && (
          <section className="english-essay-writing-section">
            <button type="button" className="english-essay-back-link" onClick={handleReset}>
              <ArrowLeft size={20} /> Change Topic
            </button>

            <div className="english-essay-form-block">
              <h3>Student Information</h3>
              <div className="english-essay-form-row">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="First name"
                  />
                </label>
                <label>
                  <span>Surname</span>
                  <input
                    type="text"
                    value={studentSurname}
                    onChange={(e) => setStudentSurname(e.target.value)}
                    placeholder="Last name"
                  />
                </label>
              </div>
            </div>

            <div className="english-essay-form-block">
              <h3>{essayType === 'guided' ? 'Your Task' : 'Your Topic'}</h3>
              <p className="english-essay-selected-title">
                {(essayType === 'free_response' || essayType === 'mark_essay') ? selectedTopic?.title : guidedPrompt?.title}
              </p>
              <p className="english-essay-selected-desc">
                {(essayType === 'free_response' || essayType === 'mark_essay') ? selectedTopic?.description : guidedPrompt?.context}
              </p>
            </div>

            {essayType === 'mark_essay' && (
              <div className="english-essay-form-block english-essay-images-block">
                <h3>Attach essay images</h3>
                <p>Upload photos of your handwritten or typed essay (up to 10). Then click &quot;Extract text&quot; to convert to text.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="english-essay-file-input"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  className="english-essay-btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose images
                </button>
                {essayImages.length > 0 && (
                  <>
                    <div className="english-essay-thumbnails">
                      {essayImages.map((img, index) => (
                        <div key={index} className="english-essay-thumb-wrap">
                          <img src={img.dataUrl} alt={`Page ${index + 1}`} className="english-essay-thumb" />
                          <button type="button" className="english-essay-thumb-remove" onClick={() => removeImage(index)} aria-label="Remove">×</button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="english-essay-btn-secondary"
                      onClick={handleExtractText}
                      disabled={extractingText}
                    >
                      {extractingText ? 'Extracting…' : 'Extract text from images'}
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="english-essay-form-block">
              <h3>{essayType === 'mark_essay' ? 'Your essay (type or paste extracted text)' : 'Write Your Essay'}</h3>
              <span className="english-essay-word-count">{wordCount} words</span>
              <textarea
                className="english-essay-textarea"
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder={essayType === 'mark_essay' ? 'Type here or extract text from images above, then edit before submitting.' : 'Start writing your essay here...'}
                rows={12}
              />
              <p className="english-essay-hint">
                Recommended: {(essayType === 'free_response' || essayType === 'mark_essay') ? selectedTopic?.suggested_length : guidedPrompt?.suggested_length}
              </p>
            </div>

            {error && <p className="english-essay-error">{error}</p>}
            <button
              type="button"
              className="english-essay-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting…' : `Submit for Marking (${ESSAY_CREDITS} Credits)`}
            </button>
          </section>
        )}

        {submitted && markingResult && (
          <section className="english-essay-result-section">
            <button type="button" className="english-essay-back-link" onClick={handleReset}>
              <ArrowLeft size={20} /> {viewingHistory ? 'Back to History' : 'Back to Menu'}
            </button>
            <div className="english-essay-result-card">
              <h2>Marking Complete!</h2>
              <div className="english-essay-score-circle">
                <span className="english-essay-score-value">{markingResult.score}</span>
                <span className="english-essay-score-max">/ {markingResult.max_score}</span>
              </div>
              <p className="english-essay-score-pct">
                {Math.round((markingResult.score / markingResult.max_score) * 100)}%
              </p>
              <div className="english-essay-teacher-comment">
                <strong>Teacher comment</strong>
                <p>{markingResult.teacher_comment}</p>
              </div>
              {Object.keys(markingResult.breakdown).length > 0 && (
                <div className="english-essay-breakdown">
                  <strong>Mark breakdown</strong>
                  {Object.entries(markingResult.breakdown).map(([key, value]) => (
                    <div key={key}>
                      {key.replace(/_/g, ' ')}: {value} marks
                    </div>
                  ))}
                </div>
              )}
            </div>
            {markingResult.corrections?.length > 0 && (
              <div className="english-essay-corrections">
                <h3>Corrections ({markingResult.corrections.length})</h3>
                {markingResult.corrections.slice(0, 10).map((c, i) => (
                  <div key={i} className="english-essay-correction-item">
                    <p><strong>Wrong:</strong> {c.wrong}</p>
                    <p><strong>Correct:</strong> {c.correct}</p>
                    <span className="english-essay-correction-type">{c.type}</span>
                    <p className="english-essay-correction-explanation">{c.explanation}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="english-essay-feedback-block">
              <h3>Detailed feedback</h3>
              <p>{markingResult.detailed_feedback}</p>
            </div>
            {markingResult.corrected_essay && (
              <div className="english-essay-corrected-block">
                <h3>Corrected version</h3>
                <div className="english-essay-corrected-text">{markingResult.corrected_essay}</div>
              </div>
            )}
            {markingResult.pdf_report && (
              <button type="button" className="english-essay-btn-primary" onClick={handleDownloadPDF}>
                <Download size={20} /> Download PDF Report
              </button>
            )}
            <button type="button" className="english-essay-btn-secondary" onClick={handleReset}>
              Write New Essay
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
