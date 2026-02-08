import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Download, Play, Plus, Save, Trash2, Upload } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { TEACHER_SUBJECTS } from '../../data/teacherConstants';
import { loadLearningProfile } from '../../utils/learningProfile';
import { CUSTOM_AGENT_ICON_OPTIONS, CUSTOM_AGENT_ICONS, type CustomAgentIconKey } from '../../utils/customAgentIcons';
import {
  createCustomAgentDraft,
  deleteCustomAgent,
  exportCustomAgentsJson,
  importCustomAgentsJson,
  loadCustomAgents,
  saveCustomAgents,
  type CustomAgent,
  upsertCustomAgent,
} from '../../utils/customAgents';

type BuilderModal =
  | { kind: 'none' }
  | { kind: 'export'; payload: string }
  | { kind: 'import'; payload: string };

function withUniqueId(baseId: string, existingIds: Set<string>): string {
  if (!existingIds.has(baseId)) return baseId;
  for (let i = 2; i <= 99; i += 1) {
    const next = `${baseId}_${i}`;
    if (!existingIds.has(next)) return next;
  }
  return `${baseId}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function mergeImportedAgents(current: CustomAgent[], imported: CustomAgent[]): CustomAgent[] {
  const ids = new Set(current.map((a) => a.id));
  const merged: CustomAgent[] = [...current];

  for (const agent of imported) {
    const id = withUniqueId(agent.id, ids);
    ids.add(id);
    merged.unshift({
      ...agent,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return merged;
}

function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

export function AgentBuilderPage() {
  const navigate = useNavigate();
  const profile = useMemo(() => loadLearningProfile(), []);

  const initialAgents = useMemo(() => loadCustomAgents(), []);
  const initialDraft = useMemo(() => initialAgents[0] ?? createCustomAgentDraft(), [initialAgents]);

  const [agents, setAgents] = useState<CustomAgent[]>(initialAgents);
  const [selectedId, setSelectedId] = useState<string>(initialDraft.id);
  const [draft, setDraft] = useState<CustomAgent>(initialDraft);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<BuilderModal>({ kind: 'none' });

  const selected = useMemo(() => agents.find((a) => a.id === selectedId) ?? null, [agents, selectedId]);

  useEffect(() => {
    if (!selected) return;
    setDraft(selected);
  }, [selected?.id]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const validate = (agent: CustomAgent): string | null => {
    if (!agent.title.trim()) return 'Title is required.';
    if (!agent.subtitle.trim()) return 'Subtitle is required.';
    if (!agent.subject.trim()) return 'Subject is required.';
    if (!agent.prompt.trim() || agent.prompt.trim().length < 10) return 'Prompt is required (min 10 characters).';
    if (!isHexColor(agent.gradientFrom) || !isHexColor(agent.gradientTo)) return 'Gradient colors must be valid hex (example: #7C4DFF).';
    return null;
  };

  const persist = (next: CustomAgent, message?: string) => {
    const v = validate(next);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    const updatedList = upsertCustomAgent(next);
    setAgents(updatedList);
    setSelectedId(next.id);
    setDraft(next);
    if (message) showToast(message);
  };

  const handleNew = () => {
    const created = createCustomAgentDraft({
      title: 'New Agent',
      subtitle: 'Custom tutor persona',
      subject: 'O Level Mathematics',
      sendMode: 'prefill',
    });
    const updatedList = upsertCustomAgent(created);
    setAgents(updatedList);
    setSelectedId(created.id);
    setDraft(created);
    setError(null);
    showToast('Agent created');
  };

  const handleDuplicate = () => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = draft;
    const copy = createCustomAgentDraft({ ...rest, title: `${draft.title} Copy` });
    const updatedList = upsertCustomAgent(copy);
    setAgents(updatedList);
    setSelectedId(copy.id);
    setDraft(copy);
    showToast('Agent duplicated');
  };

  const handleDelete = () => {
    if (!selected) return;
    const ok = window.confirm(`Delete "${selected.title}"?`);
    if (!ok) return;
    const nextList = deleteCustomAgent(selected.id);
    setAgents(nextList);
    if (nextList.length > 0) {
      setSelectedId(nextList[0].id);
      setDraft(nextList[0]);
    } else {
      const fresh = createCustomAgentDraft();
      setSelectedId(fresh.id);
      setDraft(fresh);
    }
    setError(null);
    showToast('Agent deleted');
  };

  const startAgent = () => {
    const v = validate(draft);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    const state =
      draft.sendMode === 'auto'
        ? { subject: draft.subject, gradeLevel: profile.gradeLevel, topic: draft.topic || undefined, initialMessage: draft.prompt }
        : { subject: draft.subject, gradeLevel: profile.gradeLevel, topic: draft.topic || undefined, prefillMessage: draft.prompt };
    navigate('/app/teacher/chat', { state });
  };

  const openExport = () => {
    const payload = exportCustomAgentsJson(agents);
    setModal({ kind: 'export', payload });
  };

  const applyImport = () => {
    if (modal.kind !== 'import') return;
    try {
      const imported = importCustomAgentsJson(modal.payload);
      if (imported.length === 0) {
        setError('No agents found in import payload.');
        return;
      }
      const merged = mergeImportedAgents(loadCustomAgents(), imported);
      saveCustomAgents(merged);
      setAgents(merged);
      setSelectedId(merged[0].id);
      setDraft(merged[0]);
      setModal({ kind: 'none' });
      setError(null);
      showToast('Agents imported');
    } catch {
      setError('Import failed. Paste valid JSON from an export.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied');
    } catch {
      showToast('Copy failed');
    }
  };

  const iconKey = (draft.iconKey || 'Sparkles') as CustomAgentIconKey;
  const Icon = CUSTOM_AGENT_ICONS[iconKey] ?? CUSTOM_AGENT_ICONS.Sparkles;

  return (
    <div className="agent-builder-page">
      <FloatingParticles count={14} />

      {toast && (
        <div className="agent-builder-toast" role="status">
          {toast}
        </div>
      )}

      <header className="agent-builder-header">
        <Link to="/app/agents" className="agent-builder-back">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <div className="agent-builder-title">
          <h1>Custom Agent Builder</h1>
          <p>Create subject agents that launch Teacher Mode with your own prompt.</p>
        </div>
        <div className="agent-builder-header-actions">
          <button type="button" className="agent-builder-action" onClick={handleNew}>
            <Plus size={16} /> New
          </button>
          <button type="button" className="agent-builder-action" onClick={() => setModal({ kind: 'import', payload: '' })}>
            <Upload size={16} /> Import
          </button>
          <button type="button" className="agent-builder-action" onClick={openExport}>
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      <div className="agent-builder-layout">
        <aside className="agent-builder-sidebar">
          <div className="agent-builder-side-head">
            <h2>My Agents</h2>
            <span className="agent-builder-side-count">{agents.length}</span>
          </div>

          {agents.length === 0 ? (
            <div className="agent-builder-empty">
              No custom agents yet. Click New to create one.
            </div>
          ) : (
            <div className="agent-builder-list" role="list">
              {agents.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`agent-builder-list-item ${a.id === selectedId ? 'active' : ''}`}
                  onClick={() => setSelectedId(a.id)}
                >
                  <div className="agent-builder-list-title">{a.title}</div>
                  <div className="agent-builder-list-meta">{a.subject}</div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <main className="agent-builder-main">
          <div className="agent-builder-card">
            <div className="agent-builder-card-head">
              <div className="agent-builder-card-title">
                <div className="agent-builder-preview-icon" style={{ background: `linear-gradient(135deg, ${draft.gradientFrom}, ${draft.gradientTo})` }}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <h2>Agent Settings</h2>
                  <p>Grade level for testing uses your Learning Profile ({profile.gradeLevel}).</p>
                </div>
              </div>

              <div className="agent-builder-card-actions">
                <button type="button" className="agent-builder-primary" onClick={() => persist(draft, 'Saved')}>
                  <Save size={16} /> Save
                </button>
                <button type="button" className="agent-builder-secondary" onClick={handleDuplicate}>
                  <Copy size={16} /> Duplicate
                </button>
                <button type="button" className="agent-builder-secondary" onClick={startAgent} title="Starts Teacher Mode for this agent">
                  <Play size={16} /> Start
                </button>
                <button type="button" className="agent-builder-danger" onClick={handleDelete} disabled={!selected}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>

            {error && <div className="agent-builder-error">{error}</div>}

            <div className="agent-builder-form">
              <div className="agent-builder-row">
                <label className="agent-builder-label" htmlFor="agent-title">Title</label>
                <input
                  id="agent-title"
                  className="agent-builder-input"
                  value={draft.title}
                  onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Example: Chemistry Drill Sergeant"
                />
              </div>

              <div className="agent-builder-row">
                <label className="agent-builder-label" htmlFor="agent-subtitle">Subtitle</label>
                <input
                  id="agent-subtitle"
                  className="agent-builder-input"
                  value={draft.subtitle}
                  onChange={(e) => setDraft((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="What this agent does in one line"
                />
              </div>

              <div className="agent-builder-grid">
                <div className="agent-builder-row">
                  <label className="agent-builder-label" htmlFor="agent-subject">Subject</label>
                  <input
                    id="agent-subject"
                    list="teacher-subjects"
                    className="agent-builder-input"
                    value={draft.subject}
                    onChange={(e) => setDraft((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="Example: Biology"
                  />
                  <datalist id="teacher-subjects">
                    {TEACHER_SUBJECTS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div className="agent-builder-row">
                  <label className="agent-builder-label" htmlFor="agent-topic">Topic (optional)</label>
                  <input
                    id="agent-topic"
                    className="agent-builder-input"
                    value={draft.topic ?? ''}
                    onChange={(e) => setDraft((p) => ({ ...p, topic: e.target.value }))}
                    placeholder="Example: Stoichiometry"
                  />
                </div>

                <div className="agent-builder-row">
                  <label className="agent-builder-label" htmlFor="agent-icon">Icon</label>
                  <select
                    id="agent-icon"
                    className="agent-builder-input"
                    value={draft.iconKey}
                    onChange={(e) => setDraft((p) => ({ ...p, iconKey: e.target.value as CustomAgentIconKey }))}
                  >
                    {CUSTOM_AGENT_ICON_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="agent-builder-row">
                  <label className="agent-builder-label">Prompt sending</label>
                  <div className="agent-builder-radio">
                    <label className={`agent-builder-radio-opt ${draft.sendMode === 'prefill' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="sendMode"
                        value="prefill"
                        checked={draft.sendMode === 'prefill'}
                        onChange={() => setDraft((p) => ({ ...p, sendMode: 'prefill' }))}
                      />
                      Prefill (recommended)
                    </label>
                    <label className={`agent-builder-radio-opt ${draft.sendMode === 'auto' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="sendMode"
                        value="auto"
                        checked={draft.sendMode === 'auto'}
                        onChange={() => setDraft((p) => ({ ...p, sendMode: 'auto' }))}
                      />
                      Auto send
                    </label>
                  </div>
                  <div className="agent-builder-hint">
                    Prefill shows the prompt in the box without sending. Auto send will send immediately after session start.
                  </div>
                </div>

                <div className="agent-builder-row">
                  <label className="agent-builder-label" htmlFor="agent-from">Gradient from</label>
                  <div className="agent-builder-color">
                    <input
                      id="agent-from"
                      className="agent-builder-input"
                      value={draft.gradientFrom}
                      onChange={(e) => setDraft((p) => ({ ...p, gradientFrom: e.target.value }))}
                      placeholder="#7C4DFF"
                    />
                    <input
                      type="color"
                      aria-label="Gradient from color picker"
                      value={isHexColor(draft.gradientFrom) ? draft.gradientFrom : '#7C4DFF'}
                      onChange={(e) => setDraft((p) => ({ ...p, gradientFrom: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="agent-builder-row">
                  <label className="agent-builder-label" htmlFor="agent-to">Gradient to</label>
                  <div className="agent-builder-color">
                    <input
                      id="agent-to"
                      className="agent-builder-input"
                      value={draft.gradientTo}
                      onChange={(e) => setDraft((p) => ({ ...p, gradientTo: e.target.value }))}
                      placeholder="#00E676"
                    />
                    <input
                      type="color"
                      aria-label="Gradient to color picker"
                      value={isHexColor(draft.gradientTo) ? draft.gradientTo : '#00E676'}
                      onChange={(e) => setDraft((p) => ({ ...p, gradientTo: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="agent-builder-row">
                <label className="agent-builder-label" htmlFor="agent-prompt">Prompt</label>
                <textarea
                  id="agent-prompt"
                  className="agent-builder-textarea"
                  value={draft.prompt}
                  onChange={(e) => setDraft((p) => ({ ...p, prompt: e.target.value }))}
                  placeholder="Write the agent instructions. Keep it specific: questions, marking style, pacing, and output format."
                />
              </div>

              <div className="agent-builder-footer">
                <div className="agent-builder-footer-note">
                  Tip: Use strong rules like "Ask one question at a time" and "Mark my answer then continue".
                </div>
                <button
                  type="button"
                  className="agent-builder-link"
                  onClick={() => copyToClipboard(draft.prompt)}
                  title="Copy prompt"
                >
                  <Copy size={16} /> Copy prompt
                </button>
              </div>
            </div>
          </div>

          <div className="agent-builder-card agent-builder-mini">
            <div className="agent-builder-mini-head">
              <h2>Templates</h2>
              <div className="agent-builder-hint">Load a starting prompt, then edit it.</div>
            </div>
            <div className="agent-builder-template-grid">
              <button
                type="button"
                className="agent-builder-template"
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    title: 'Learning Coach',
                    subtitle: 'Daily plan and accountability',
                    subject: 'Learning Coach',
                    sendMode: 'prefill',
                    prompt: [
                      'Act as my Learning Coach.',
                      'Start by asking 2 diagnostic questions.',
                      'Then build a short study plan and guide me step-by-step.',
                      'Teach briefly, then ask me questions and wait for my answers.',
                      'End with a 5-question checkpoint.',
                    ].join('\n'),
                    iconKey: 'Sparkles',
                    gradientFrom: '#7C4DFF',
                    gradientTo: '#00E676',
                  }))
                }
              >
                <span className="agent-builder-template-title">Learning Coach</span>
                <span className="agent-builder-template-sub">Plan + test + accountability</span>
              </button>

              <button
                type="button"
                className="agent-builder-template"
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    title: 'Exam Proctor',
                    subtitle: 'Timed questions and marking',
                    subject: 'Combined Science',
                    sendMode: 'auto',
                    prompt: [
                      'You are my Exam Proctor.',
                      'Ask one question at a time and wait for my answer.',
                      'Mark my answer (correct/incorrect) with a short reason.',
                      'Keep a running score out of 10.',
                      'After 10 questions, list my 3 weak areas and give me a 3-step revision plan.',
                    ].join('\n'),
                    iconKey: 'ClipboardList',
                    gradientFrom: '#06B6D4',
                    gradientTo: '#00E676',
                  }))
                }
              >
                <span className="agent-builder-template-title">Exam Proctor</span>
                <span className="agent-builder-template-sub">Questions + marking</span>
              </button>

              <button
                type="button"
                className="agent-builder-template"
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    title: 'Essay Marker',
                    subtitle: 'Grade and improve writing',
                    subject: 'English',
                    sendMode: 'prefill',
                    prompt: [
                      'You are my Essay Marker.',
                      'First ask me for the essay prompt and the essay type.',
                      'Then ask me to paste my essay.',
                      'Mark it with: score, strengths (max 3), corrections, and a rewritten improved paragraph.',
                      'Finish with 3 targeted practice tasks for tomorrow.',
                    ].join('\n'),
                    iconKey: 'PenLine',
                    gradientFrom: '#FF9100',
                    gradientTo: '#7C4DFF',
                  }))
                }
              >
                <span className="agent-builder-template-title">Essay Marker</span>
                <span className="agent-builder-template-sub">Marking + feedback</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {modal.kind !== 'none' && (
        <div className="agent-builder-modal-backdrop" role="dialog" aria-modal="true">
          <div className="agent-builder-modal">
            <div className="agent-builder-modal-head">
              <h2>{modal.kind === 'export' ? 'Export Agents' : 'Import Agents'}</h2>
              <button type="button" className="agent-builder-modal-close" onClick={() => setModal({ kind: 'none' })} aria-label="Close">
                x
              </button>
            </div>

            <textarea
              className="agent-builder-modal-textarea"
              value={modal.payload}
              onChange={(e) => setModal((p) => (p.kind === 'none' ? p : { ...p, payload: e.target.value }))}
              placeholder={modal.kind === 'import' ? 'Paste export JSON here...' : ''}
              readOnly={modal.kind === 'export'}
            />

            <div className="agent-builder-modal-actions">
              {modal.kind === 'export' ? (
                <>
                  <button type="button" className="agent-builder-secondary" onClick={() => copyToClipboard(modal.payload)}>
                    <Copy size={16} /> Copy
                  </button>
                  <button type="button" className="agent-builder-primary" onClick={() => setModal({ kind: 'none' })}>
                    Done
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="agent-builder-secondary" onClick={() => setModal({ kind: 'none' })}>
                    Cancel
                  </button>
                  <button type="button" className="agent-builder-primary" onClick={applyImport}>
                    Import
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
