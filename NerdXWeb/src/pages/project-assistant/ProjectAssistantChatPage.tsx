import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Send,
  Share2,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MathRenderer } from '../../components/MathRenderer';
import { attachmentsApi } from '../../services/api/attachmentsApi';
import {
  projectAssistantApi,
  type ProjectDetail,
  type ProjectHistoryItem,
} from '../../services/api/projectAssistantApi';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_urls?: string[];
};

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

function historyToMessages(history: ProjectHistoryItem[]): Message[] {
  return history
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
    .map((h, idx) => ({
      id: `h-${h.id ?? idx}-${h.timestamp ?? idx}`,
      role: h.role,
      content: h.content,
    }));
}

function displayTitle(project: ProjectDetail | null): string {
  const raw = typeof project?.title === 'string' ? project.title.trim() : '';
  return raw || 'Untitled Project';
}

function displayMeta(project: ProjectDetail | null): string {
  const subject = typeof project?.subject === 'string' ? project.subject.trim() : '';
  const stage = project?.current_stage;
  const stageText = typeof stage === 'string' ? stage.trim() : typeof stage === 'number' ? `Stage ${stage}` : '';
  const parts = [subject, stageText].filter(Boolean);
  return parts.join(' â€¢ ');
}

export function ProjectAssistantChatPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user, updateUser } = useAuth();

  const pid = useMemo(() => {
    const n = Number(projectId);
    return Number.isFinite(n) ? n : null;
  }, [projectId]);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    if (pid == null) return;
    setStarting(true);
    setError(null);
    try {
      const [proj, history] = await Promise.all([
        projectAssistantApi.getProject(pid),
        projectAssistantApi.getHistory(pid),
      ]);

      if (!proj) {
        setError('Project not found.');
        setProject(null);
        setMessages([]);
        setStarting(false);
        return;
      }

      setProject(proj);

      const msgs = historyToMessages(history);
      if (msgs.length === 0) {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content:
              "Iâ€™m your NerdX Project Assistant. Tell me your project idea (even if itâ€™s rough), your subject, and what your teacher expects. Iâ€™ll guide you through Stage 1â€“6 with a clear plan.",
          },
        ]);
      } else {
        setMessages(msgs);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load project.');
      setProject(null);
      setMessages([]);
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (pid == null) {
      navigate('/app/project-assistant', { replace: true });
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({ title: 'NerdX Project Assistant', text: content }).catch(() => copyToClipboard(content));
    } else {
      copyToClipboard(content);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || pid == null || sending) return;
    e.target.value = '';
    setSending(true);
    setShowAddMenu(false);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      const mime = file.type || 'application/pdf';
      const analysis = await projectAssistantApi.analyzeDocument(pid, base64, mime);
      if (analysis?.analysis) {
        setMessages((prev) => [
          ...prev,
          {
            id: `doc-${Date.now()}`,
            role: 'assistant',
            content: `ðŸ“„ **Document Analysis**\n\n**File:** ${file.name}\n\n${analysis.analysis}`,
          },
        ]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to analyze document.');
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    setSelectedFiles((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
    setShowAddMenu(false);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (overrideText?: string) => {
    if (pid == null || sending) return;
    const query = (overrideText ?? input).trim();
    const hasImages = selectedFiles.length > 0;
    if (!query && !hasImages) return;

    const credits = user?.credits ?? 0;
    if (credits <= 0) {
      setError('You need credits to use Project Assistant. Please top up.');
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query || 'ðŸ“· (images)',
      image_urls: hasImages ? await Promise.all(selectedFiles.map((f) => fileToDataUrl(f))) : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSelectedFiles([]);
    setShowAddMenu(false);
    setSending(true);
    setError(null);

    try {
      let contextPackId: string | undefined;
      if (hasImages) {
        const pack = await attachmentsApi.analyzeImages({
          images: selectedFiles,
          prompt: query || undefined,
          chatId: `project_${pid}`,
        });
        contextPackId = pack?.id;
      }

      const res = await projectAssistantApi.sendMessage(pid, query || 'What do you see in these images?', contextPackId);
      if (res?.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: res.response,
          },
        ]);
      }
      if (res?.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });

      const updated = await projectAssistantApi.getProject(pid);
      if (updated) setProject(updated);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 402) {
        navigate('/app/credits');
        return;
      }
      const msg = err?.response?.data?.message || err?.message || 'Failed to send message.';
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  if (pid == null) return null;

  if (starting) {
    return (
      <div className="teacher-mode-page">
        <div className="teacher-mode-loading">{error || 'Loading Project Assistantâ€¦'}</div>
        {error && (
          <div className="teacher-chat-actions-row">
            <Link to="/app/project-assistant" className="teacher-chat-back-btn">Back to Projects</Link>
          </div>
        )}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="teacher-mode-page">
        <div className="teacher-mode-loading">{error || 'Project not found'}</div>
        <div className="teacher-chat-actions-row">
          <button type="button" onClick={() => void load()}>Retry</button>
          <Link to="/app/project-assistant">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-mode-page teacher-chat-gpt-layout project-assistant-chat">
      <aside className="teacher-chat-sidebar">
        <Link to="/app/project-assistant" className="teacher-chat-sidebar-item" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>
        <button
          type="button"
          className="teacher-chat-sidebar-item"
          onClick={() => void load()}
          aria-label="Refresh"
          title="Refresh"
          disabled={sending}
        >
          <RefreshCw size={20} />
        </button>
        <div className="teacher-chat-sidebar-spacer" />
        <div className="teacher-chat-sidebar-user" title={`${user?.credits ?? 0} credits`}>
          <span className="teacher-chat-sidebar-credits">{user?.credits ?? 0}</span>
          <span className="teacher-chat-sidebar-credits-label">credits</span>
        </div>
      </aside>

      <div className="teacher-chat-main">
        <header className="teacher-chat-topbar">
          <div className="teacher-chat-topbar-title">
            <span className="teacher-chat-topbar-icon">ðŸŽ“</span>
            <span>{displayTitle(project)}</span>
            {displayMeta(project) ? <span className="teacher-chat-topbar-sub">{displayMeta(project)}</span> : null}
          </div>
          <div className="teacher-chat-topbar-actions">
            <button
              type="button"
              className="teacher-chat-topbar-btn"
              onClick={() => shareMessage(messages[messages.length - 1]?.content || '')}
              title="Share"
            >
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
                          <button
                            key={i}
                            type="button"
                            className="teacher-graph-clickable"
                            onClick={() => setZoomImage(url)}
                            aria-label="View image"
                          >
                            <img src={url} alt="" className="teacher-msg-thumb" />
                          </button>
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
                    </div>
                    <div className="teacher-msg-actions">
                      <button type="button" onClick={() => copyToClipboard(m.content)} title="Copy">
                        <Copy size={14} />
                      </button>
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

          <div className="teacher-chat-input-wrap">
            {selectedFiles.length > 0 && (
              <div className="teacher-selected-images-inline">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="teacher-selected-img-wrap">
                    <img src={URL.createObjectURL(file)} alt="" className="teacher-selected-img" />
                    <button
                      type="button"
                      className="teacher-selected-img-remove"
                      onClick={() => removeSelectedImage(i)}
                      aria-label="Remove"
                    >
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Ask anything about your projectâ€¦"
                rows={1}
                disabled={sending}
                className="teacher-chat-input-field"
              />

              <button
                type="button"
                className="teacher-chat-send-btn"
                onClick={() => void handleSend()}
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
        <div className="teacher-zoom-overlay" onClick={() => setZoomImage(null)} role="dialog" aria-label="Zoom image">
          <img src={zoomImage} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

