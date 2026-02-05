import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teacherApi } from '../../services/api/teacherApi';
import { attachmentsApi } from '../../services/api/attachmentsApi';
import { API_BASE_URL } from '../../services/api/config';
import { MathRenderer } from '../../components/MathRenderer';
import { QUICK_QUESTIONS, SUBJECT_ICONS } from '../../data/teacherConstants';
import {
  Send,
  Plus,
  FileText,
  Image as ImageIcon,
  Search,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  X,
  MessageSquarePlus,
  History,
  MoreHorizontal,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  graph_url?: string;
  video_url?: string;
  image_urls?: string[];
}

const MAX_IMAGES = 10;

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

export function TeacherChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as { subject?: string; gradeLevel?: string; topic?: string };
  const { subject, gradeLevel, topic } = state;
  const { user, updateUser } = useAuth();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showQuickAsk, setShowQuickAsk] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = subject ? (QUICK_QUESTIONS[subject] ?? QUICK_QUESTIONS['Combined Science']) : QUICK_QUESTIONS['Combined Science'];

  useEffect(() => {
    if (!subject || !gradeLevel) {
      navigate('/app/teacher', { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      setStarting(true);
      setError(null);
      try {
        const credits = user?.credits ?? 0;
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
              content: session.initial_message || 'Welcome to Teacher Mode! How can I help you learn today?',
            },
          ]);
          if (session.credits_remaining !== undefined) updateUser({ credits: session.credits_remaining });
        } else {
          setError('Failed to start session. Please try again.');
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to start session.');
        }
      } finally {
        if (!cancelled) setStarting(false);
      }
    })();
    return () => { cancelled = true; };
  }, [subject, gradeLevel, topic, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const query = input.trim();
    const hasImages = selectedFiles.length > 0;
    if ((!query && !hasImages) || !sessionId || sending) return;
    const credits = user?.credits ?? 0;
    if (credits <= 0) {
      setError('You need credits to continue. Please top up.');
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query || '📷 (images)',
      image_urls: selectedFiles.length ? await Promise.all(selectedFiles.map((f) => fileToDataUrl(f))) : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSelectedFiles([]);
    setShowQuickAsk(false);
    setSending(true);
    setError(null);

    try {
      let contextPackId: string | undefined;
      if (hasImages) {
        const pack = await attachmentsApi.analyzeImages({
          images: selectedFiles,
          prompt: query || undefined,
          chatId: sessionId,
        });
        contextPackId = pack?.id;
      }
      const res = await teacherApi.sendMessage(sessionId, query || 'What do you see in these images?', contextPackId);
      if (res?.session_ended) {
        setSessionEnded(res.response);
        setSending(false);
        return;
      }
      if (res?.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: res.response,
            graph_url: res.graph_url,
            video_url: res.video_url,
          },
        ]);
      }
      if (res?.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to send message.';
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setError(msg);
      if (err.response?.status === 402) setSessionEnded(msg);
    } finally {
      setSending(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId || sending) return;
    e.target.value = '';
    setSending(true);
    setShowAddMenu(false);
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
            content: `📄 **Document Analysis**\n\n**File:** ${file.name}\n\n${analysis.analysis}`,
          },
        ]);
      }
    } catch (err) {
      setError('Failed to analyze document.');
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    setSelectedFiles((prev) => {
      const next = [...prev, ...files].slice(0, MAX_IMAGES);
      return next;
    });
    setShowAddMenu(false);
  };

  const handleWebSearch = async () => {
    const query = window.prompt('Search the web for:');
    if (!query?.trim() || !sessionId || sending) return;
    setSending(true);
    setShowAddMenu(false);
    try {
      const result = await teacherApi.searchWeb(query);
      if (result?.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: `search-${Date.now()}`,
            role: 'assistant',
            content: `🌐 **Search Results**\n\nQuery: "${query}"\n\n${result.response}`,
          },
        ]);
      }
    } catch {
      setError('Search failed.');
    } finally {
      setSending(false);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({ title: 'Teacher Mode', text: content }).catch(() => copyToClipboard(content));
    } else {
      copyToClipboard(content);
    }
  };

  if (!subject || !gradeLevel) return null;

  if (starting) {
    return (
      <div className="teacher-mode-page">
        <div className="teacher-mode-loading">
          {error || 'Starting Teacher Mode...'}
        </div>
        {error && (
          <div className="teacher-chat-actions-row">
            <Link to="/app/teacher" className="teacher-chat-back-btn">Back to Setup</Link>
          </div>
        )}
      </div>
    );
  }

  if (!sessionId && !starting) {
    return (
      <div className="teacher-mode-page">
        <div className="teacher-mode-loading">{error || 'Unable to start session'}</div>
        <div className="teacher-chat-actions-row">
          <button type="button" onClick={() => window.location.reload()}>Retry</button>
          <Link to="/app/teacher">Back to Setup</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-mode-page teacher-chat-gpt-layout">
      {/* Left sidebar - ChatGPT style */}
      <aside className="teacher-chat-sidebar">
        <Link to="/app/teacher" className="teacher-chat-sidebar-new" aria-label="New chat">
          <MessageSquarePlus size={20} />
        </Link>
        <Link to="/app/teacher/history" className="teacher-chat-sidebar-item" aria-label="History">
          <History size={20} />
        </Link>
        <div className="teacher-chat-sidebar-spacer" />
        <div className="teacher-chat-sidebar-user" title={`${user?.credits ?? 0} credits`}>
          <span className="teacher-chat-sidebar-credits">{user?.credits ?? 0}</span>
          <span className="teacher-chat-sidebar-credits-label">credits</span>
        </div>
      </aside>

      {/* Main area: top bar + messages + input */}
      <div className="teacher-chat-main">
        <header className="teacher-chat-topbar">
          <div className="teacher-chat-topbar-title">
            <span className="teacher-chat-topbar-icon">{SUBJECT_ICONS[subject] ?? '👨‍🏫'}</span>
            <span>{subject} Tutor</span>
            <span className="teacher-chat-topbar-sub">{gradeLevel}</span>
          </div>
          <div className="teacher-chat-topbar-actions">
            <button type="button" className="teacher-chat-topbar-btn" onClick={() => shareMessage(messages[messages.length - 1]?.content || '')} title="Share">
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button type="button" className="teacher-chat-topbar-btn teacher-chat-topbar-btn-icon" aria-label="More">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        <div className="teacher-mode-chat">
          <div className="teacher-messages">
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="teacher-msg-row teacher-msg-row-user">
                <div className="teacher-msg-bubble teacher-msg-bubble-user">
                  {m.image_urls?.length ? (
                    <div className="teacher-msg-images">
                      {m.image_urls.slice(0, MAX_IMAGES).map((url, i) => (
                        <img key={i} src={url} alt="" className="teacher-msg-thumb" />
                      ))}
                    </div>
                  ) : null}
                  <span>{m.content}</span>
                </div>
              </div>
            ) : (
              <div key={m.id} className="teacher-msg-row teacher-msg-row-assistant">
                <div className="teacher-msg-bubble teacher-msg-bubble-assistant">
                  <div className="teacher-msg-assistant-content">
                    <MathRenderer content={m.content} fontSize={16} />
                    {m.graph_url && (
                      <div className="teacher-graph-wrap">
                        <button
                          type="button"
                          className="teacher-graph-clickable"
                          onClick={() => setZoomImage(`${API_BASE_URL}${m.graph_url}`)}
                        >
                          <img src={`${API_BASE_URL}${m.graph_url}`} alt="Graph" />
                        </button>
                        <span className="teacher-graph-caption">Mathematical Graph</span>
                      </div>
                    )}
                    {m.video_url && (
                      <div className="teacher-video-wrap">
                        <video
                          src={`${API_BASE_URL}${m.video_url}`}
                          controls
                          className="teacher-video-el"
                        />
                      </div>
                    )}
                  </div>
                  <div className="teacher-msg-actions">
                    <button type="button" onClick={() => copyToClipboard(m.content)} title="Copy">
                      <Copy size={14} />
                    </button>
                    <button type="button" title="Good" aria-label="Good"><ThumbsUp size={14} /></button>
                    <button type="button" title="Bad" aria-label="Bad"><ThumbsDown size={14} /></button>
                    <button type="button" onClick={() => shareMessage(m.content)} title="Share">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
          {sending && (
            <div className="teacher-msg-row teacher-msg-row-assistant">
              <div className="teacher-msg-bubble teacher-msg-bubble-assistant teacher-typing-wrap">
                <span className="teacher-typing-dot" /> <span className="teacher-typing-dot" /> <span className="teacher-typing-dot" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {error && <div className="teacher-chat-error">{error}</div>}

        {showQuickAsk && (
          <div className="teacher-quick-ask">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                className="teacher-quick-ask-chip"
                onClick={() => { setInput(q); setShowQuickAsk(false); }}
                disabled={sending}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* ChatGPT-style input bar: centered, rounded */}
        <div className="teacher-chat-input-wrap">
          {selectedFiles.length > 0 && (
            <div className="teacher-selected-images-inline">
              {selectedFiles.map((file, i) => (
                <div key={i} className="teacher-selected-img-wrap">
                  <img src={URL.createObjectURL(file)} alt="" className="teacher-selected-img" />
                  <button type="button" className="teacher-selected-img-remove" onClick={() => removeSelectedImage(i)} aria-label="Remove">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="teacher-chat-input-bar">
            <div className="teacher-add-wrap">
              <button
                type="button"
                className="teacher-chat-input-add"
                onClick={() => setShowAddMenu(!showAddMenu)}
                disabled={sending}
                aria-label="Attach"
              >
                <Plus size={20} />
              </button>
              {showAddMenu && (
                <div className="teacher-add-menu">
                  <button type="button" onClick={() => fileInputRef.current?.click()}>
                    <FileText size={18} /> Upload Document
                  </button>
                  <button type="button" onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon size={18} /> Attach Images (up to {MAX_IMAGES})
                  </button>
                  <button type="button" onClick={handleWebSearch}>
                    <Search size={18} /> Web Search
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
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); if (e.target.value.trim()) setShowQuickAsk(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Ask anything..."
              rows={1}
              disabled={sending}
              className="teacher-chat-input-field"
            />
            <button
              type="button"
              className="teacher-chat-send-btn"
              onClick={handleSend}
              disabled={sending || (!input.trim() && selectedFiles.length === 0)}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      </div>

      {zoomImage && (
        <div
          className="teacher-zoom-overlay"
          onClick={() => setZoomImage(null)}
          role="dialog"
          aria-label="Zoom image"
        >
          <img src={zoomImage} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {sessionEnded && (
        <div className="teacher-session-ended-overlay">
          <div className="teacher-session-ended-box">
            <h3>Session Ended</h3>
            <p>{sessionEnded}</p>
            <div className="teacher-chat-actions-row">
              <button type="button" onClick={() => { setSessionEnded(null); navigate('/app/teacher'); }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
