import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teacherApi } from '../../services/api/teacherApi';
import { attachmentsApi } from '../../services/api/attachmentsApi';
import { DEFAULT_QUICK_QUESTIONS, QUICK_QUESTIONS } from '../../data/teacherConstants';
import {
  Send,
  ArrowLeft,
  Plus,
  FileText,
  Image as ImageIcon,
  Search,
  Camera,
  X,
  MessageSquarePlus,
  History,
  MoreHorizontal,
  Mic,
  Square,
  Loader2,
  Sparkles,
  Share2,
} from 'lucide-react';
import type { TeacherChatMessage, TeacherChatSelectedImage, TeacherChatLocationState } from './teacherChatTypes';
import {
  TEACHER_CHAT_MAX_IMAGES,
  TEACHER_CHAT_MAX_INPUT_LENGTH,
  fileToBase64,
  fileToDataUrl,
  createSelectedImage,
  revokeSelectedImages,
  getErrorMessage,
  isPaymentRequired,
  copyTextToClipboard,
} from './teacherChatUtils';
import { useTeacherChatSession } from './hooks/useTeacherChatSession';
import { useScrollToBottom } from './hooks/useScrollToBottom';
import { TeacherChatMessageRows, TeacherChatTypingRow } from './components/TeacherChatMessageRows';

export function TeacherChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as TeacherChatLocationState;
  const { subject, gradeLevel, topic, initialMessage, prefillMessage } = state;
  const { user, updateUser } = useAuth();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showQuickAsk, setShowQuickAsk] = useState(true);
  const [selectedImages, setSelectedImages] = useState<TeacherChatSelectedImage[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionEnded, setSessionEnded] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribingAudio, setTranscribingAudio] = useState(false);
  const [sessionRetryKey, setSessionRetryKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const initialMessageSentRef = useRef(false);
  const prefillAppliedRef = useRef(false);
  const creditsRef = useRef<number>(user?.credits ?? 0);
  const railRef = useRef<HTMLElement>(null);

  const quickQuestions = useMemo(
    () => (subject ? (QUICK_QUESTIONS[subject] ?? DEFAULT_QUICK_QUESTIONS) : DEFAULT_QUICK_QUESTIONS),
    [subject],
  );

  const subjectInitials = useMemo(() => {
    if (!subject) return 'AI';
    return subject
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [subject]);

  const clearSelectedImages = useCallback(() => {
    setSelectedImages((prev) => {
      if (prev.length) revokeSelectedImages(prev);
      return [];
    });
  }, []);

  const resetChatChrome = useCallback(() => {
    initialMessageSentRef.current = false;
    prefillAppliedRef.current = false;
    setInput('');
    setError(null);
    clearSelectedImages();
    setShowQuickAsk(true);
    setShowAddMenu(false);
    setSessionEnded(null);
    setMobileMenuOpen(false);
  }, [clearSelectedImages]);

  const { sessionId, messages, setMessages, starting, bootstrapError } = useTeacherChatSession({
    subject,
    gradeLevel,
    topic,
    navigate,
    updateUser,
    creditsRef,
    onResetUi: resetChatChrome,
    retryKey: sessionRetryKey,
  });

  const scrollContainerRef = useScrollToBottom(messages.length, sending);

  useEffect(() => {
    creditsRef.current = user?.credits ?? 0;
  }, [user?.credits]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (railRef.current && !railRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      clearSelectedImages();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [clearSelectedImages]);

  useEffect(() => {
    if (!showAddMenu) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!addMenuRef.current?.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [showAddMenu]);

  const handleCopy = useCallback((text: string) => {
    void copyTextToClipboard(text);
  }, []);

  const shareMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    if (navigator.share) {
      navigator.share({ title: 'Teacher Mode', text: content }).catch(() => void copyTextToClipboard(content));
    } else {
      void copyTextToClipboard(content);
    }
  }, []);

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const query = (overrideText ?? input).trim();
      const queuedImages = [...selectedImages];
      const hasImages = queuedImages.length > 0;

      if ((!query && !hasImages) || !sessionId || sending || isRecording || transcribingAudio) return;

      const credits = creditsRef.current;
      if (credits <= 0) {
        setError('You need credits to continue. Please top up.');
        return;
      }

      const userMsg: TeacherChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: query || '[images attached]',
        image_urls: hasImages ? await Promise.all(queuedImages.map((img) => fileToDataUrl(img.file))) : undefined,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      clearSelectedImages();
      setShowQuickAsk(false);
      setSending(true);
      setError(null);
      setShowAddMenu(false);

      try {
        let contextPackId: string | undefined;

        if (hasImages) {
          const pack = await attachmentsApi.analyzeImages({
            images: queuedImages.map((img) => img.file),
            prompt: query || undefined,
            chatId: sessionId,
          });
          contextPackId = pack?.id;
        }

        const response = await teacherApi.sendMessage(
          sessionId,
          query || 'What do you see in these images?',
          contextPackId,
        );

        if (response?.session_ended) {
          setSessionEnded(response.response);
          setSending(false);
          return;
        }

        if (response?.response) {
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: response.response,
              graph_url: response.graph_url,
              video_url: response.video_url,
            },
          ]);
        }

        if (response?.credits_remaining !== undefined) {
          updateUser({ credits: response.credits_remaining });
        }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to send message.');
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setError(msg);
        if (isPaymentRequired(err)) {
          setSessionEnded(msg);
        }
      } finally {
        setSending(false);
      }
    },
    [
      clearSelectedImages,
      input,
      isRecording,
      selectedImages,
      sending,
      sessionId,
      setMessages,
      transcribingAudio,
      updateUser,
    ],
  );

  useEffect(() => {
    if (!sessionId || starting || sending) return;
    const msg = (initialMessage || '').trim();
    if (!msg || initialMessageSentRef.current) return;
    initialMessageSentRef.current = true;
    void handleSend(msg);
  }, [handleSend, initialMessage, sending, sessionId, starting]);

  useEffect(() => {
    if (!sessionId || starting) return;
    if ((initialMessage || '').trim()) return;
    const msg = (prefillMessage || '').trim();
    if (!msg || prefillAppliedRef.current) return;
    prefillAppliedRef.current = true;
    setInput(msg);
    setShowQuickAsk(false);
  }, [initialMessage, prefillMessage, sessionId, starting]);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId || sending) return;
    e.target.value = '';
    setSending(true);
    setShowAddMenu(false);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      const mime = file.type || 'application/pdf';
      const analysis = await teacherApi.analyzeDocument(base64, mime);
      if (analysis?.analysis) {
        setMessages((prev) => [
          ...prev,
          {
            id: `doc-${Date.now()}`,
            role: 'assistant',
            content: `Document analysis\n\nFile: ${file.name}\n\n${analysis.analysis}`,
          },
        ]);
      }
    } catch {
      setError('Failed to analyze document.');
    } finally {
      setSending(false);
    }
  };

  const pushImages = (incomingFiles: File[]) => {
    const accepted = incomingFiles.filter((file) => file.type.startsWith('image/'));
    if (!accepted.length) return;

    setSelectedImages((prev) => {
      const openSlots = Math.max(0, TEACHER_CHAT_MAX_IMAGES - prev.length);
      const nextBatch = accepted.slice(0, openSlots).map(createSelectedImage);
      if (accepted.length > openSlots) {
        queueMicrotask(() =>
          setError(`You can attach up to ${TEACHER_CHAT_MAX_IMAGES} images per message.`),
        );
      }
      return [...prev, ...nextBatch];
    });
    setShowAddMenu(false);
    setShowQuickAsk(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    pushImages(files);
  };

  const handleWebSearch = async () => {
    const query = window.prompt('Search the web for:');
    if (!query?.trim() || !sessionId || sending) return;
    setSending(true);
    setShowAddMenu(false);
    setError(null);
    try {
      const result = await teacherApi.searchWeb(query);
      if (result?.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: `search-${Date.now()}`,
            role: 'assistant',
            content: `Web search results\n\nQuery: "${query}"\n\n${result.response}`,
          },
        ]);
      }
    } catch {
      setError('Search failed.');
    } finally {
      setSending(false);
    }
  };

  const removeSelectedImage = (imageId: string) => {
    setSelectedImages((prev) => {
      const target = prev.find((image) => image.id === imageId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((image) => image.id !== imageId);
    });
  };

  const startRecording = async () => {
    if (sending || transcribingAudio) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Audio recording is not supported in this browser.');
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data?.size) audioChunksRef.current.push(event.data);
      };
      recorder.start();
      setIsRecording(true);
      setShowAddMenu(false);
    } catch {
      setError('Microphone access failed. Please allow microphone permission and try again.');
    }
  };

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    setTranscribingAudio(true);
    try {
      recorder.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];
      if (!blob.size) {
        setError('No audio was captured. Please try again.');
        return;
      }
      const audioFile = new File([blob], `teacher-voice-${Date.now()}.webm`, { type: 'audio/webm' });
      const result = await teacherApi.transcribeAudio(audioFile);
      if (result.success && result.text?.trim()) {
        setInput((prev) => (prev.trim() ? `${prev}\n${result.text!.trim()}` : result.text!.trim()));
        setShowQuickAsk(false);
      } else {
        setError(result.message || 'Voice transcription failed.');
      }
    } catch {
      setError('Voice transcription failed. Please try again.');
    } finally {
      setIsRecording(false);
      setTranscribingAudio(false);
      mediaRecorderRef.current = null;
    }
  };

  const hasMessageContent = input.trim().length > 0 || selectedImages.length > 0;
  const sessionReady = Boolean(sessionId);
  const composerDisabled = !sessionReady || starting || sending || isRecording || transcribingAudio;
  const showStreamLoader = starting && !sessionId;
  const showBootstrapFailure = !starting && !sessionId && bootstrapError;
  const sessionStatusLabel = showBootstrapFailure
    ? 'Connection failed'
    : starting && !sessionId
      ? 'Connecting…'
      : 'Session active';

  if (!subject || !gradeLevel) return null;

  return (
    <div className="teacher-mode-page teacher-mode-page--v3">
      <div className={`teacher-chat-overlay ${mobileMenuOpen ? 'visible' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className="teacher-chat-shell">
        <aside ref={railRef} className={`teacher-chat-rail ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Teacher actions">
          <Link to="/app/teacher" className="teacher-chat-rail-btn" aria-label="New session" title="New session">
            <MessageSquarePlus size={18} />
          </Link>
          <Link to="/app/teacher/history" className="teacher-chat-rail-btn" aria-label="History" title="History">
            <History size={18} />
          </Link>
          <div className="teacher-chat-rail-spacer" />
          <div className="teacher-chat-rail-credits" title={`${user?.credits ?? 0} credits`}>
            <span className="teacher-chat-rail-credits-value">{user?.credits ?? 0}</span>
            <span className="teacher-chat-rail-credits-label">credits</span>
          </div>
        </aside>

        <main className="teacher-chat-main-v3">
          <header className="teacher-chat-header-v3">
            <div className="teacher-chat-header-main">
              <Link
                to="/app/teacher"
                className="teacher-chat-back teacher-chat-back--header-v3"
                aria-label="Back to Teacher setup"
                title="Back to setup"
              >
                <ArrowLeft size={20} aria-hidden />
              </Link>
              <button
                type="button"
                className="teacher-chat-mobile-toggle"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Menu"
              >
                <MoreHorizontal size={20} className={mobileMenuOpen ? 'rotate-90' : ''} />
              </button>
              <div className="teacher-chat-subject-avatar">{subjectInitials}</div>
              <div className="teacher-chat-header-text-v3">
                <h1>{subject} Tutor</h1>
                <div className="teacher-chat-meta-row-v3">
                  <span>{gradeLevel}</span>
                  {topic ? <span>Topic: {topic}</span> : <span>Topic: Any</span>}
                  <span>{sessionStatusLabel}</span>
                </div>
              </div>
            </div>
            <div className="teacher-chat-header-actions-v3">
              <button
                type="button"
                className="teacher-chat-topbar-btn"
                onClick={() => shareMessage(messages[messages.length - 1]?.content || '')}
                title="Share latest response"
                aria-label="Share latest assistant response"
              >
                <Share2 size={16} aria-hidden />
                <span>Share</span>
              </button>
            </div>
          </header>

          <section ref={scrollContainerRef} className="teacher-chat-scroll">
            <div className="teacher-chat-stream">
              {showStreamLoader ? (
                <div className="teacher-chat-stream-status" role="status" aria-live="polite">
                  <Loader2 size={22} className="spin teacher-chat-stream-status-icon" aria-hidden />
                  <span>Connecting to your tutor…</span>
                </div>
              ) : null}

              {showBootstrapFailure ? (
                <div className="teacher-chat-stream-status teacher-chat-stream-status--error" role="alert">
                  <p>{bootstrapError}</p>
                  <div className="teacher-chat-stream-status-actions">
                    <button type="button" onClick={() => setSessionRetryKey((k) => k + 1)}>
                      Try again
                    </button>
                    <Link to="/app/teacher" className="teacher-chat-back-btn">
                      Back to setup
                    </Link>
                  </div>
                </div>
              ) : null}

              {sessionReady ? (
                <>
                  <TeacherChatMessageRows
                    messages={messages}
                    onCopy={handleCopy}
                    onShare={shareMessage}
                    onOpenGraph={setZoomImage}
                  />
                  {sending ? <TeacherChatTypingRow /> : null}
                </>
              ) : null}
            </div>
          </section>

          {error ? <div className="teacher-chat-error">{error}</div> : null}

          {sessionReady && showQuickAsk && quickQuestions.length > 0 ? (
            <div className="teacher-quick-ask teacher-quick-ask--v3">
              {quickQuestions.map((question, index) => (
                <button
                  key={`${question}-${index}`}
                  type="button"
                  className="teacher-quick-ask-chip"
                  onClick={() => {
                    setInput(question);
                    setShowQuickAsk(false);
                  }}
                  disabled={sending || isRecording || transcribingAudio}
                >
                  <Sparkles size={14} aria-hidden />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          ) : null}

          <footer className="teacher-chat-composer-wrap">
            {selectedImages.length > 0 ? (
              <div className="teacher-selected-images-inline">
                {selectedImages.map((image) => (
                  <div key={image.id} className="teacher-selected-img-wrap">
                    <img src={image.previewUrl} alt={image.file.name} className="teacher-selected-img" />
                    <button
                      type="button"
                      className="teacher-selected-img-remove"
                      onClick={() => removeSelectedImage(image.id)}
                      aria-label="Remove image"
                    >
                      <X size={14} aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {transcribingAudio ? (
              <div className="teacher-audio-status" role="status" aria-live="polite">
                <Loader2 size={14} className="spin" aria-hidden />
                <span>Transcribing audio…</span>
              </div>
            ) : null}

            <div className="teacher-chat-composer" ref={addMenuRef}>
              <div className="teacher-add-wrap">
                <button
                  type="button"
                  className="teacher-chat-input-add"
                  onClick={() => setShowAddMenu((prev) => !prev)}
                  disabled={composerDisabled}
                  aria-label="Add content"
                >
                  <Plus size={20} aria-hidden />
                </button>

                {showAddMenu ? (
                  <div className="teacher-add-menu teacher-add-menu--v3">
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      <FileText size={16} aria-hidden />
                      <span>Upload document</span>
                    </button>
                    <button type="button" onClick={() => imageInputRef.current?.click()}>
                      <ImageIcon size={16} aria-hidden />
                      <span>Attach images (up to {TEACHER_CHAT_MAX_IMAGES})</span>
                    </button>
                    <button type="button" onClick={() => cameraInputRef.current?.click()}>
                      <Camera size={16} aria-hidden />
                      <span>Capture photo</span>
                    </button>
                    <button type="button" onClick={handleWebSearch}>
                      <Search size={16} aria-hidden />
                      <span>Web search</span>
                    </button>
                  </div>
                ) : null}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="teacher-hidden-input"
                onChange={handleDocumentUpload}
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="teacher-hidden-input"
                onChange={handleImageSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="teacher-hidden-input"
                onChange={handleImageSelect}
              />

              <textarea
                value={input}
                onChange={(event) => {
                  setInput(event.target.value.slice(0, TEACHER_CHAT_MAX_INPUT_LENGTH));
                  if (event.target.value.trim()) setShowQuickAsk(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder={
                  !sessionReady
                    ? 'Connecting…'
                    : isRecording
                      ? 'Recording… tap stop to transcribe'
                      : 'Ask anything…'
                }
                rows={1}
                disabled={composerDisabled}
                className="teacher-chat-input-field"
              />

              <button
                type="button"
                className={`teacher-chat-mic-btn${isRecording ? ' is-recording' : ''}`}
                onClick={() => {
                  if (isRecording) void stopRecording();
                  else void startRecording();
                }}
                disabled={!sessionReady || sending || transcribingAudio}
                aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                title={isRecording ? 'Stop recording' : 'Record voice'}
              >
                {isRecording ? <Square size={16} aria-hidden /> : <Mic size={16} aria-hidden />}
              </button>

              <button
                type="button"
                className="teacher-chat-send-btn"
                onClick={() => void handleSend()}
                disabled={!hasMessageContent || composerDisabled}
                aria-label="Send message"
              >
                <Send size={18} aria-hidden />
              </button>
            </div>
          </footer>
        </main>
      </div>

      {zoomImage ? (
        <div className="teacher-zoom-overlay" onClick={() => setZoomImage(null)} role="dialog" aria-label="Zoomed graph">
          <img src={zoomImage} alt="Zoomed graph" onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}

      {sessionEnded ? (
        <div className="teacher-session-ended-overlay">
          <div className="teacher-session-ended-box">
            <h3>Session ended</h3>
            <p>{sessionEnded}</p>
            <div className="teacher-chat-actions-row">
              <button
                type="button"
                onClick={() => {
                  setSessionEnded(null);
                  navigate('/app/teacher');
                }}
              >
                Back to setup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
