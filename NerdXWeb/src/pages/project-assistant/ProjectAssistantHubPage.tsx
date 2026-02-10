import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  projectAssistantApi,
  type ProjectLevel,
  type ProjectListItem,
} from '../../services/api/projectAssistantApi';

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'Computer Science',
  'English',
  'Geography',
  'History',
  'Commerce',
  'Accounting',
  'Business Enterprise Skills',
  'Combined Science',
  'Other',
] as const;

function formatStage(stage: unknown): string {
  if (typeof stage === 'number') return `Stage ${stage}`;
  if (typeof stage !== 'string') return 'Stage —';
  const trimmed = stage.trim();
  return trimmed.length ? trimmed : 'Stage —';
}

function formatUpdatedAt(updatedAt: unknown): string {
  if (typeof updatedAt !== 'string') return '';
  const ms = Date.parse(updatedAt);
  if (!Number.isFinite(ms)) return '';
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return '';
  }
}

function displayTitle(project: ProjectListItem): string {
  const raw = typeof project.title === 'string' ? project.title.trim() : '';
  return raw || 'Untitled Project';
}

function displaySubject(project: ProjectListItem): string {
  const raw = typeof project.subject === 'string' ? project.subject.trim() : '';
  return raw || 'Subject';
}

export function ProjectAssistantHubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [level, setLevel] = useState<ProjectLevel>('O-Level');
  const [subjectPreset, setSubjectPreset] = useState<(typeof SUBJECT_OPTIONS)[number]>('Mathematics');
  const [subjectCustom, setSubjectCustom] = useState('');
  const [title, setTitle] = useState('');
  const [school, setSchool] = useState('');
  const [form, setForm] = useState('');

  const subject = useMemo(() => {
    const selected = subjectPreset === 'Other' ? subjectCustom : subjectPreset;
    return (selected || '').trim();
  }, [subjectCustom, subjectPreset]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await projectAssistantApi.listProjects();
      setProjects(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load projects.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) return;
    if (!subject) {
      setError('Please choose a subject.');
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const created = await projectAssistantApi.createProject({
        subject,
        level,
        title: title.trim() || undefined,
        school: school.trim() || undefined,
        form: form.trim() || undefined,
      });

      if (!created?.id) {
        setError('Failed to create project. Please try again.');
        setCreating(false);
        return;
      }

      navigate(`/app/project-assistant/${created.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (projectId: number) => {
    if (deleting != null) return;
    const confirm = window.confirm('Delete this project? This cannot be undone.');
    if (!confirm) return;
    setDeleting(projectId);
    setError(null);
    try {
      const ok = await projectAssistantApi.deleteProject(projectId);
      if (!ok) {
        setError('Failed to delete project.');
        return;
      }
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete project.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="project-assistant-page">
      <Link to="/app" className="back-link">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="project-assistant-card glass-card">
        <div className="project-assistant-header">
          <GraduationCap size={44} className="project-assistant-icon" />
          <h1>Project Assistant</h1>
          <p className="project-assistant-subtitle">
            Plan, research, and write your ZIMSEC project with an AI mentor (Stages 1â€“6).
          </p>
          <p className="project-assistant-meta">
            Credits: <strong>{user?.credits ?? 0}</strong>
          </p>
        </div>

        <form className="project-assistant-form" onSubmit={createProject}>
          <div className="project-assistant-form-grid">
            <label className="project-assistant-field">
              <span>Level</span>
              <select value={level} onChange={(e) => setLevel((e.target.value as ProjectLevel) || 'O-Level')}>
                <option value="O-Level">O-Level</option>
                <option value="A-Level">A-Level</option>
              </select>
            </label>

            <label className="project-assistant-field">
              <span>Subject</span>
              <select
                value={subjectPreset}
                onChange={(e) => setSubjectPreset(e.target.value as (typeof SUBJECT_OPTIONS)[number])}
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            {subjectPreset === 'Other' && (
              <label className="project-assistant-field project-assistant-field-span">
                <span>Custom Subject</span>
                <input value={subjectCustom} onChange={(e) => setSubjectCustom(e.target.value)} placeholder="e.g., Agriculture" />
              </label>
            )}

            <label className="project-assistant-field project-assistant-field-span">
              <span>Project Title (optional)</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="You can refine this in chat" />
            </label>

            <label className="project-assistant-field">
              <span>School (optional)</span>
              <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Your school name" />
            </label>

            <label className="project-assistant-field">
              <span>Form/Class (optional)</span>
              <input value={form} onChange={(e) => setForm(e.target.value)} placeholder="e.g., Form 4" />
            </label>
          </div>

          <button type="submit" className="gradient-btn project-assistant-create" disabled={creating}>
            <Plus size={18} /> {creating ? 'Startingâ€¦' : 'Start New Project'}
          </button>
        </form>

        <div className="project-assistant-divider" />

        <div className="project-assistant-projects-head">
          <h2>Your Projects</h2>
          <button type="button" className="project-assistant-refresh" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {error && <div className="project-assistant-error">{error}</div>}

        {loading ? (
          <div className="project-assistant-loading">Loading projectsâ€¦</div>
        ) : projects.length === 0 ? (
          <p className="project-assistant-empty">No projects yet. Create one above to get started.</p>
        ) : (
          <div className="project-assistant-projects">
            {projects.map((p) => (
              <div key={p.id} className="project-assistant-project-row">
                <button
                  type="button"
                  className="project-assistant-project-open"
                  onClick={() => navigate(`/app/project-assistant/${p.id}`)}
                >
                  <div className="project-assistant-project-title">{displayTitle(p)}</div>
                  <div className="project-assistant-project-sub">
                    {displaySubject(p)} â€¢ {formatStage(p.current_stage)}
                    {p.updated_at ? ` â€¢ ${formatUpdatedAt(p.updated_at)}` : ''}
                  </div>
                </button>
                <button
                  type="button"
                  className="project-assistant-project-delete"
                  onClick={() => deleteProject(p.id)}
                  disabled={deleting === p.id}
                  aria-label="Delete project"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

