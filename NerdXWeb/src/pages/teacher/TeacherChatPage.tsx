import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teacherApi } from '../../services/api/teacherApi';
import { attachmentsApi } from '../../services/api/attachmentsApi';
import { API_BASE_URL } from '../../services/api/config';
import { MathRenderer } from '../../components/MathRenderer';
import { DEFAULT_QUICK_QUESTIONS, QUICK_QUESTIONS } from '../../data/teacherConstants';
import {
  Send,
  Plus,
  FileText,
  Image as ImageIcon,
  Search,
  Camera,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  X,
  MessageSquarePlus,
  History,
  MoreHorizontal,
  Mic,
  Square,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  graph_url?: string;
  video_url?: string;
  image_urls?: string[];
}

interface SelectedImage {
  id: string;
  file: File;
  previewUrl: string;
}

const MAX_IMAGES = 10;
const MAX_INPUT_LENGTH = 1200;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64 || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createSelectedImage(file: File): SelectedImage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

function revokeSelectedImages(images: SelectedImage[]) {
  images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    return maybeAxiosError.response?.data?.message || maybeAxiosError.message || fallback;
  }

  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
}

function isPaymentRequired(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybeAxiosError = error as { response?: { status?: number } };
  return maybeAxiosError.response?.status === 402;
}

export function TeacherChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as {
    subject?: string;
    gradeLevel?: string;
    topic?: string;
    initialMessage?: string;
    prefillMessage?: string;
  };

  const { subject, gradeLevel, topic, initialMessage, prefillMessage } = state;
  const { user, updateUser } = useAuth();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showQuickAsk, setShowQuickAsk] = useState(true);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionEnded, setSessionEnded] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribingAudio, setTranscribingAudio] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
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

  // Close mobile menu when clicking outside
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
    creditsRef.current = user?.credits ?? 0;
  }, [user?.credits]);

  useEffect(() => {
    if (!showAddMenu) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!addMenuRef.current) return;
      if (!addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [showAddMenu]);

  useEffect(() => {
    if (!subject || !gradeLevel) {
      navigate('/app/teacher', { replace: true });
      return;
    }

    initialMessageSentRef.current = false;
    prefillAppliedRef.current = false;
    setSessionId(null);
    setMessages([]);
    setInput('');
    clearSelectedImages();
    setShowQuickAsk(true);
    setShowAddMenu(false);
    setSessionEnded(null);
    setMobileMenuOpen(false);

    let cancelled = false;

    (async () => {
      setStarting(true);
      setError(null);
      try {
        const credits = creditsRef.current;
        if (credits <= 0) {
          setError('You need credits to use Teacher Mode. Please top up.');
          setStarting(false);
          return;
        }

        const session = await teacherApi.startSession(subject, gradeLevel, topic);
        if (cancelled) return;

        if (session?.session_id) {
          setSessionId(session.session_id);
          setMessages([
            {
              id: '0',
              role: 'assistant',
              content: session.initial_message || 'Welcome to Teacher Mode. How can I help you learn today?',
            },
          ]);
          if (session.credits_remaining !== undefined) {
            updateUser({ credits: session.credits_remaining });
          }
        } else {
          setError('Failed to start session. Please try again.');
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, 'Failed to start session.'));
        }
      } finally {
        if (!cancelled) {
          setStarting(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subject, gradeLevel, topic, navigate, user?.id, updateUser, clearSelectedImages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

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

      const userMsg: Message = {
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
      } catch (error: unknown) {
        const msg = getErrorMessage(error, 'Failed to send message.');
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setError(msg);
        if (isPaymentRequired(error)) {
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
      const openSlots = Math.max(0, MAX_IMAGES - prev.length);
      const nextBatch = accepted.slice(0, openSlots).map(createSelectedImage);
      return [...prev, ...nextBatch];
    });

    if (selectedImages.length + accepted.length > MAX_IMAGES) {
      setError(`You can attach up to ${MAX_IMAGES} images per message.`);
    }

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
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((image) => image.id !== imageId);
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareMessage = (content: string) => {
    if (!content.trim()) return;

    if (navigator.share) {
      navigator
        .share({ title: 'Teacher Mode', text: content })
        .catch(() => copyToClipboard(content));
    } else {
      copyToClipboard(content);
    }
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
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
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

      const audioFile = new File([blob], `teacher-voice-${Date.now()}.webm`, {
        type: 'audio/webm',
      });

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

  if (!subject || !gradeLevel) return null;

  if (starting) {
    return (
      <div className="teacher-mode-page teacher-mode-page--v3">
        <div className="teacher-mode-loading">{error || 'Starting Teacher Mode...'}</div>
        {error && (
          <div className="teacher-chat-actions-row">
            <Link to="/app/teacher" className="teacher-chat-back-btn">
              Back to setup
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (!sessionId && !starting) {
    return (
      <div className="teacher-mode-page teacher-mode-page--v3">
        <div className="teacher-mode-loading">{error || 'Unable to start session.'}</div>
        <div className="teacher-chat-actions-row">
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
          <Link to="/app/teacher">Back to setup</Link>
        </div>
      </div>
    );
  }

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
                  <span>Session active</span>
                </div>
              </div>
            </div>
            <div className="teacher-chat-header-actions-v3">
              <button
                type="button"
                className="teacher-chat-topbar-btn"
                onClick={() => shareMessage(messages[messages.length - 1]?.content || '')}
                title="Share latest response"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </header>

          <section className="teacher-chat-scroll">
            <div className="teacher-chat-stream">
              {messages.map((message) =>
                message.role === 'user' ? (
                  <div key={message.id} className="teacher-msg-row teacher-msg-row-user">
                    <div className="teacher-msg-bubble teacher-msg-bubble-user">
                      {message.image_urls?.length ? (
                        <div className="teacher-msg-images">
                          {message.image_urls.slice(0, MAX_IMAGES).map((url, index) => (
                            <img key={`${message.id}-img-${index}`} src={url} alt="Attachment" className="teacher-msg-thumb" />
                          ))}
                        </div>
                      ) : null}
                      <span>{message.content}</span>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="teacher-msg-row teacher-msg-row-assistant">
                    <div className="teacher-msg-bubble teacher-msg-bubble-assistant">
                      <div className="teacher-msg-assistant-content">
                        <MathRenderer content={message.content} fontSize={16} />

                        {message.graph_url && (
                          <div className="teacher-graph-wrap">
                            <button
                              type="button"
                              className="teacher-graph-clickable"
                              onClick={() => setZoomImage(`${API_BASE_URL}${message.graph_url}`)}
                            >
                              <img src={`${API_BASE_URL}${message.graph_url}`} alt="Generated graph" />
                            </button>
                            <span className="teacher-graph-caption">Generated graph</span>
                          </div>
                        )}

                        {message.video_url && (
                          <div className="teacher-video-wrap">
                            <video src={`${API_BASE_URL}${message.video_url}`} controls className="teacher-video-el" />
                          </div>
                        )}
                      </div>

                      <div className="teacher-msg-actions">
                        <button type="button" onClick={() => copyToClipboard(message.content)} title="Copy response">
                          <Copy size={14} />
                        </button>
                        <button type="button" title="Helpful" aria-label="Helpful">
                          <ThumbsUp size={14} />
                        </button>
                        <button type="button" title="Needs improvement" aria-label="Needs improvement">
                          <ThumbsDown size={14} />
                        </button>
                        <button type="button" onClick={() => shareMessage(message.content)} title="Share response">
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}

              {sending && (
                <div className="teacher-msg-row teacher-msg-row-assistant">
                  <div className="teacher-msg-bubble teacher-msg-bubble-assistant teacher-typing-wrap">
                    <span className="teacher-typing-dot" />
                    <span className="teacher-typing-dot" />
                    <span className="teacher-typing-dot" />
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </section>

          {error && <div className="teacher-chat-error">{error}</div>}

          {showQuickAsk && quickQuestions.length > 0 && (
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
                  <Sparkles size={14} />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          )}

          <footer className="teacher-chat-composer-wrap">
            {selectedImages.length > 0 && (
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
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {transcribingAudio && (
              <div className="teacher-audio-status" role="status" aria-live="polite">
                <Loader2 size={14} className="spin" />
                <span>Transcribing audio...</span>
              </div>
            )}

            <div className="teacher-chat-composer" ref={addMenuRef}>
              <div className="teacher-add-wrap">
                <button
                  type="button"
                  className="teacher-chat-input-add"
                  onClick={() => setShowAddMenu((prev) => !prev)}
                  disabled={sending || isRecording || transcribingAudio}
                  aria-label="Add content"
                >
                  <Plus size={20} />
                </button>

                {showAddMenu && (
                  <div className="teacher-add-menu teacher-add-menu--v3">
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      <FileText size={16} />
                      <span>Upload document</span>
                    </button>
                    <button type="button" onClick={() => imageInputRef.current?.click()}>
                      <ImageIcon size={16} />
                      <span>Attach images (up to {MAX_IMAGES})</span>
                    </button>
                    <button type="button" onClick={() => cameraInputRef.current?.click()}>
                      <Camera size={16} />
                      <span>Capture photo</span>
                    </button>
                    <button type="button" onClick={handleWebSearch}>
                      <Search size={16} />
                      <span>Web search</span>
                    </button>
                  </div>
                )}
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
                  setInput(event.target.value.slice(0, MAX_INPUT_LENGTH));
                  if (event.target.value.trim()) setShowQuickAsk(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder={isRecording ? 'Recording... tap stop to transcribe' : 'Ask anything...'}
                rows={1}
                disabled={sending || isRecording || transcribingAudio}
                className="teacher-chat-input-field"
              />

              <button
                type="button"
                className={`teacher-chat-mic-btn${isRecording ? ' is-recording' : ''}`}
                onClick={() => {
                  if (isRecording) {
                    void stopRecording();
                  } else {
                    void startRecording();
                  }
                }}
                disabled={sending || transcribingAudio}
                aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                title={isRecording ? 'Stop recording' : 'Record voice'}
              >
                {isRecording ? <Square size={16} /> : <Mic size={16} />}
              </button>

              <button
                type="button"
                className="teacher-chat-send-btn"
                onClick={() => void handleSend()}
                disabled={!hasMessageContent || sending || isRecording || transcribingAudio}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </footer>
        </main>
      </div>

      {zoomImage && (
        <div className="teacher-zoom-overlay" onClick={() => setZoomImage(null)} role="dialog" aria-label="Zoomed graph">
          <img src={zoomImage} alt="Zoomed graph" onClick={(event) => event.stopPropagation()} />
        </div>
      )}

      {sessionEnded && (
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
      )}
    </div>
  );
}
