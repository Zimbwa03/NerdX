import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  FileDown,
  FileText,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MathRenderer } from '../../components/MathRenderer';
import { attachmentsApi } from '../../services/api/attachmentsApi';
import {
  projectAssistantApi,
  type ProjectDetail,
  type ProjectHistoryItem,
  type SubmissionChecklist,
} from '../../services/api/projectAssistantApi';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_urls?: string[];
  image_url?: string | null;
};

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_IMAGES = 10;
const ASPECT_RATIOS = ['1:1', '16:9', '9:16'] as const;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result as string;
      resolve(value.includes(',') ? value.split(',')[1] : value);
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

function parseStage(stage: unknown): number | null {
  if (typeof stage === 'number' && stage >= 1 && stage <= 6) return Math.floor(stage);
  if (typeof stage !== 'string') return null;
  const trimmed = stage.trim();
  if (/^[1-6]$/.test(trimmed)) return Number(trimmed);
  const m = trimmed.match(/stage\s*[-:]?\s*([1-6])/i);
  return m ? Number(m[1]) : null;
}

function mapHistory(history: ProjectHistoryItem[]): Message[] {
  return history
    .filter((h) => h?.role && h?.content)
    .map((h, idx) => ({
      id: `h-${h.id ?? idx}-${h.timestamp ?? idx}`,
      role: h.role,
      content: h.content,
      image_url: h.image_url ?? null,
    }));
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
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState(false);
  const [lastImagePrompt, setLastImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<(typeof ASPECT_RATIOS)[number]>('1:1');
  const [checklist, setChecklist] = useState<SubmissionChecklist | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exporting, setExporting] = useState<'full' | 'stage' | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const railRef = useRef<HTMLElement>(null);

  const stageNumber = parseStage(project?.current_stage);

  const checklistRows = useMemo(() => {
    if (!checklist?.stages) return [];
    return Object.entries(checklist.stages)
      .map(([s, data]) => ({ stage: Number(s), data }))
      .sort((a, b) => a.stage - b.stage);
  }, [checklist]);

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
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    if (!showAddMenu) return;
    const onOutsideClick = (event: MouseEvent) => {
      if (!addMenuRef.current) return;
      if (!addMenuRef.current.contains(event.target as Node)) setShowAddMenu(false);
    };
    window.addEventListener('mousedown', onOutsideClick);
    return () => window.removeEventListener('mousedown', onOutsideClick);
  }, [showAddMenu]);

  useEffect(() => {
    return () => {
      selectedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [selectedImages]);

  const load = async () => {
    if (pid == null) return;
    setStarting(true);
    setError(null);
    setMobileMenuOpen(false);
    try {
      const [proj, history, nextChecklist] = await Promise.all([
        projectAssistantApi.getProject(pid),
        projectAssistantApi.getHistory(pid),
        projectAssistantApi.getSubmissionChecklist(pid).catch(() => null),
      ]);

      if (!proj) {
        setProject(null);
        setMessages([]);
        setChecklist(nextChecklist);
        setError('Project not found.');
        setStarting(false);
        return;
      }

      setProject(proj);
      setChecklist(nextChecklist);
      const mapped = mapHistory(history);
      setMessages(
        mapped.length
          ? mapped
          : [{
            id: 'welcome',
            role: 'assistant',
            content: 'I am your Project Assistant. Share your project idea and I will guide you step by step.',
          }],
      );
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load project.');
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

  const copyText = (text: string) => navigator.clipboard.writeText(text).catch(() => null);

  const shareText = (text: string) => {
    if (!text.trim()) return;
    if (navigator.share) navigator.share({ title: 'NerdX Project Assistant', text }).catch(() => copyText(text));
    else copyText(text);
  };

  const pushImages = (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith('image/'));
    if (!images.length) return;
    setSelectedImages((prev) => {
      const openSlots = Math.max(0, MAX_IMAGES - prev.length);
      const add = images.slice(0, openSlots).map((file) => ({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...add];
    });
    setShowAddMenu(false);
  };

  const removeImage = (id: string) => {
    setSelectedImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || pid == null || sending) return;
    setSending(true);
    setShowAddMenu(false);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      const analysis = await projectAssistantApi.analyzeDocument(pid, base64, file.type || 'application/pdf');
      if (analysis?.analysis) {
        setMessages((prev) => [...prev, {
          id: `doc-${Date.now()}`,
          role: 'assistant',
          content: `Document review for ${file.name}\n\n${analysis.analysis}`,
        }]);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to analyze document.');
    } finally {
      setSending(false);
    }
  };

  const isImageRequest = (query: string): boolean => {
    if (imageMode) return true;
    const q = query.toLowerCase();
    return ['image', 'poster', 'flyer', 'logo', 'banner', 'generate', 'create', 'design'].some((w) => q.includes(w));
  };

  const send = async (override?: string) => {
    if (pid == null || sending) return;
    const query = (override ?? input).trim();
    const queuedImages = [...selectedImages];
    const hasImages = queuedImages.length > 0;
    if (!query && !hasImages) return;
    if ((user?.credits ?? 0) <= 0) {
      setError('You need credits to continue.');
      return;
    }

    const wantsImageGeneration = isImageRequest(query);

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query || '[images attached]',
      image_urls: hasImages ? await Promise.all(queuedImages.map((img) => fileToDataUrl(img.file))) : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    queuedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setSelectedImages([]);
    setShowAddMenu(false);
    setSending(true);
    setError(null);

    try {
      let contextPackId: string | undefined;
      if (hasImages && !wantsImageGeneration) {
        const pack = await attachmentsApi.analyzeImages({
          images: queuedImages.map((img) => img.file),
          prompt: query || undefined,
          chatId: `project_${pid}`,
        });
        contextPackId = pack?.id;
      }

      const response = wantsImageGeneration
        ? await projectAssistantApi.generateImage(pid, query || 'Create a project image', aspectRatio)
        : await projectAssistantApi.sendMessage(pid, query || 'What do you see in these images?', contextPackId);

      if (wantsImageGeneration && query) setLastImagePrompt(query);
      if (wantsImageGeneration) setImageMode(false);

      if (response?.response || response?.image_url) {
        setMessages((prev) => [...prev, {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: response?.response || 'Here is your image.',
          image_url: response?.image_url ?? null,
        }]);
      }

      if (response?.credits_remaining !== undefined) updateUser({ credits: response.credits_remaining });

      const [nextProject, nextChecklist] = await Promise.all([
        projectAssistantApi.getProject(pid),
        projectAssistantApi.getSubmissionChecklist(pid).catch(() => null),
      ]);
      if (nextProject) setProject(nextProject);
      if (nextChecklist) setChecklist(nextChecklist);
    } catch (e: any) {
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      setError(e?.response?.data?.message || e?.message || 'Failed to send message.');
      if (e?.response?.status === 402) navigate('/app/credits');
    } finally {
      setSending(false);
    }
  };

  const exportPdf = async (stage?: number) => {
    if (pid == null) return;
    setExporting(typeof stage === 'number' ? 'stage' : 'full');
    setShowAddMenu(false);
    setError(null);
    try {
      const result = await projectAssistantApi.generateSubmissionPack(pid, stage);
      if (!result?.download_url) {
        setError('PDF generation failed.');
        return;
      }
      const a = document.createElement('a');
      a.href = result.download_url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      if (result.filename) a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      const nextChecklist = await projectAssistantApi.getSubmissionChecklist(pid).catch(() => null);
      if (nextChecklist) setChecklist(nextChecklist);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to export PDF.');
    } finally {
      setExporting(null);
    }
  };

  if (pid == null) return null;

  if (starting) {
    return (
      <div className="teacher-mode-page teacher-mode-page--v3">
        <div className="teacher-mode-loading">{error || 'Loading Project Assistant...'}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="teacher-mode-page teacher-mode-page--v3">
        <div className="teacher-mode-loading">{error || 'Project not found.'}</div>
        <div className="teacher-chat-actions-row">
          <button type="button" onClick={() => void load()}>Retry</button>
          <Link to="/app/project-assistant">Back to projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-mode-page teacher-mode-page--v3 project-assistant-chat-v3">
      <div className={`teacher-chat-overlay ${mobileMenuOpen ? 'visible' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className="teacher-chat-shell">
        <aside ref={railRef} className={`teacher-chat-rail ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Project actions">
          <Link to="/app/project-assistant" className="teacher-chat-rail-btn" aria-label="Back to projects" title="Back to projects">
            <ArrowLeft size={18} />
          </Link>
          <button type="button" className="teacher-chat-rail-btn" onClick={() => void load()} disabled={sending} title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button type="button" className={`teacher-chat-rail-btn${imageMode ? ' project-ai-mode-active' : ''}`} onClick={() => setImageMode((v) => !v)} title="Image Mode">
            <Sparkles size={18} />
          </button>
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
                <ClipboardList size={20} className={mobileMenuOpen ? 'rotate-90' : ''} />
              </button>
              <div className="teacher-chat-subject-avatar">PA</div>
              <div className="teacher-chat-header-text-v3">
                <h1>{typeof project.title === 'string' && project.title.trim() ? project.title : 'Project Assistant'}</h1>
                <div className="teacher-chat-meta-row-v3">
                  <span>{project.subject || 'Project'}</span>
                  <span>{typeof project.current_stage === 'string' ? project.current_stage : `Stage ${project.current_stage ?? '-'}`}</span>
                  <span>{checklist ? `${checklist.overall_completion}% complete` : 'Tracking progress'}</span>
                </div>
              </div>
            </div>
            <div className="teacher-chat-header-actions-v3">
              <button type="button" className="teacher-chat-topbar-btn" onClick={() => setChecklistOpen(true)}>
                <ClipboardList size={16} />
                <span>Checklist</span>
              </button>
              <button type="button" className="teacher-chat-topbar-btn" onClick={() => void exportPdf()} disabled={exporting != null}>
                <FileDown size={16} />
                <span>PDF</span>
              </button>
              <button type="button" className="teacher-chat-topbar-btn teacher-chat-topbar-btn-icon" onClick={() => shareText(messages[messages.length - 1]?.content || '')}>
                <Share2 size={18} />
              </button>
            </div>
          </header>

          <section className="teacher-chat-scroll">
            <div className="teacher-chat-stream">
              {messages.map((m) => (
                m.role === 'user' ? (
                  <div key={m.id} className="teacher-msg-row teacher-msg-row-user">
                    <div className="teacher-msg-bubble teacher-msg-bubble-user">
                      {m.image_urls?.length ? <div className="teacher-msg-images">{m.image_urls.map((url, i) => <img key={`${m.id}-${i}`} src={url} alt="Attachment" className="teacher-msg-thumb" />)}</div> : null}
                      <span>{m.content}</span>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="teacher-msg-row teacher-msg-row-assistant">
                    <div className="teacher-msg-bubble teacher-msg-bubble-assistant">
                      <div className="teacher-msg-assistant-content">
                        <MathRenderer content={m.content} fontSize={16} />
                        {m.image_url ? (
                          <div className="project-assistant-image-wrap">
                            <button type="button" className="teacher-graph-clickable" onClick={() => setZoomImage(m.image_url || null)}>
                              <img src={m.image_url} alt="Generated" className="project-assistant-generated-image" />
                            </button>
                            <div className="project-assistant-image-actions">
                              <button type="button" onClick={() => {
                                const link = document.createElement('a');
                                link.href = m.image_url || '';
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                link.download = `project-image-${Date.now()}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}>
                                <Download size={14} /><span>Download</span>
                              </button>
                              <button type="button" onClick={() => { setImageMode(true); setInput(lastImagePrompt); }}>
                                <Sparkles size={14} /><span>Regenerate</span>
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="teacher-msg-actions">
                        <button type="button" onClick={() => copyText(m.content)}><Copy size={14} /></button>
                        <button type="button" onClick={() => shareText(m.content)}><Share2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                )
              ))}

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

          <footer className="teacher-chat-composer-wrap">
            {imageMode && (
              <div className="project-assistant-mode-indicator">
                <Sparkles size={14} />
                <span>Image mode ({aspectRatio})</span>
                <button type="button" onClick={() => setImageMode(false)}><X size={14} /></button>
              </div>
            )}

            {selectedImages.length > 0 && (
              <div className="teacher-selected-images-inline">
                {selectedImages.map((img) => (
                  <div key={img.id} className="teacher-selected-img-wrap">
                    <img src={img.previewUrl} alt={img.file.name} className="teacher-selected-img" />
                    <button type="button" className="teacher-selected-img-remove" onClick={() => removeImage(img.id)}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="teacher-chat-composer" ref={addMenuRef}>
              <div className="teacher-add-wrap">
                <button type="button" className="teacher-chat-input-add" onClick={() => setShowAddMenu((v) => !v)} disabled={sending || exporting != null}>
                  <Plus size={20} />
                </button>
                {showAddMenu && (
                  <div className="teacher-add-menu teacher-add-menu--v3 project-assistant-add-menu">
                    <button type="button" onClick={() => fileInputRef.current?.click()}><FileText size={16} /><span>Upload document</span></button>
                    <button type="button" onClick={() => imageInputRef.current?.click()}><ImageIcon size={16} /><span>Attach images (up to {MAX_IMAGES})</span></button>
                    <button type="button" onClick={() => { setImageMode(true); setShowAddMenu(false); }}><Sparkles size={16} /><span>Generate image</span></button>
                    <button type="button" onClick={() => { setChecklistOpen(true); setShowAddMenu(false); }}><ClipboardList size={16} /><span>View checklist</span></button>
                    <button type="button" onClick={() => void exportPdf()}><FileDown size={16} /><span>Download full PDF</span></button>
                    <button type="button" disabled={!stageNumber} onClick={() => { if (stageNumber) void exportPdf(stageNumber); }}><CheckCircle2 size={16} /><span>Download stage PDF</span></button>
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="application/pdf,image/*" className="teacher-hidden-input" onChange={handleFileUpload} />
              <input ref={imageInputRef} type="file" accept="image/*" multiple className="teacher-hidden-input" onChange={(e) => { const files = Array.from(e.target.files || []); e.target.value = ''; pushImages(files); }} />

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 900))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder={imageMode ? 'Describe the image you want...' : 'Ask for project help...'}
                rows={1}
                disabled={sending || exporting != null}
                className="teacher-chat-input-field"
              />

              <button type="button" className="project-assistant-aspect-btn" onClick={() => {
                const idx = ASPECT_RATIOS.indexOf(aspectRatio);
                setAspectRatio(ASPECT_RATIOS[(idx + 1) % ASPECT_RATIOS.length]);
              }} disabled={sending || exporting != null}>
                {aspectRatio}
              </button>

              <button type="button" className="teacher-chat-send-btn" onClick={() => void send()} disabled={sending || exporting != null || (!input.trim() && selectedImages.length === 0)}>
                <Send size={18} />
              </button>
            </div>

            <div className="project-assistant-footer-meta">
              <span>Credits: {user?.credits ?? 0}</span>
              {checklist ? <span>Completion: {checklist.overall_completion}%</span> : null}
            </div>
          </footer>
        </main>
      </div>

      {zoomImage && (
        <div className="teacher-zoom-overlay" onClick={() => setZoomImage(null)} role="dialog" aria-label="Zoom image">
          <img src={zoomImage} alt="Zoomed project image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {checklistOpen && (
        <div className="teacher-session-ended-overlay" onClick={() => setChecklistOpen(false)} role="dialog" aria-label="Checklist">
          <div className="teacher-session-ended-box project-assistant-checklist-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Submission Checklist</h3>
            <p>Overall completion: <strong>{checklist?.overall_completion ?? 0}%</strong></p>
            <div className="project-assistant-checklist-grid">
              {checklistRows.map(({ stage, data }) => (
                <div key={stage} className="project-assistant-checklist-card">
                  <div className="project-assistant-checklist-title">
                    <span>Stage {stage}</span>
                    <strong>{data.completed}/{data.total}</strong>
                  </div>
                  <div className="project-assistant-checklist-bar">
                    <div className="project-assistant-checklist-fill" style={{ width: `${data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="project-assistant-checklist-stats">
              <span>Evidence: {checklist?.evidence_count ?? 0}</span>
              <span>References: {checklist?.references_count ?? 0}</span>
              <span>Logbook: {checklist?.logbook_entries_count ?? 0}</span>
            </div>
            <div className="teacher-chat-actions-row">
              <button type="button" onClick={() => void exportPdf()} disabled={exporting != null}>Full PDF</button>
              <button type="button" onClick={() => { if (stageNumber) void exportPdf(stageNumber); }} disabled={exporting != null || !stageNumber}>Stage PDF</button>
              <button type="button" onClick={() => setChecklistOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
