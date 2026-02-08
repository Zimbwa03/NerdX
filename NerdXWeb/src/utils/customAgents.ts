import { CUSTOM_AGENT_ICON_OPTIONS, type CustomAgentIconKey } from './customAgentIcons';

export type AgentSendMode = 'auto' | 'prefill';

export type CustomAgent = {
  id: string;
  title: string;
  subtitle: string;
  subject: string;
  topic?: string;
  prompt: string;
  sendMode: AgentSendMode;
  iconKey: CustomAgentIconKey;
  gradientFrom: string;
  gradientTo: string;
  createdAt: string;
  updatedAt: string;
};

export const CUSTOM_AGENTS_STORAGE_KEY = 'nerdx_custom_agents_v1';

const DEFAULT_AGENT: Omit<CustomAgent, 'id'> = {
  title: 'New Agent',
  subtitle: 'Custom tutor persona',
  subject: 'O Level Mathematics',
  topic: '',
  prompt: 'Act as my tutor. Ask me 2 questions to assess my level, then teach step-by-step with short quizzes.',
  sendMode: 'prefill',
  iconKey: 'Sparkles',
  gradientFrom: '#7C4DFF',
  gradientTo: '#00E676',
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function normalizeSendMode(value: unknown): AgentSendMode {
  return value === 'auto' ? 'auto' : 'prefill';
}

function normalizeIconKey(value: unknown): CustomAgentIconKey {
  if (typeof value !== 'string') return 'Sparkles';
  return (CUSTOM_AGENT_ICON_OPTIONS as readonly string[]).includes(value) ? (value as CustomAgentIconKey) : 'Sparkles';
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeOptionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeIsoDate(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d.toISOString();
}

function normalizeCustomAgentsArray(arr: unknown[]): CustomAgent[] {
  const now = new Date().toISOString();
  const normalized: CustomAgent[] = [];
  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;
    const candidate = item as Partial<CustomAgent>;
    const id = typeof candidate.id === 'string' ? candidate.id.trim() : '';
    if (!id) continue;

    normalized.push({
      id,
      title: normalizeText(candidate.title, DEFAULT_AGENT.title),
      subtitle: normalizeText(candidate.subtitle, DEFAULT_AGENT.subtitle),
      subject: normalizeText(candidate.subject, DEFAULT_AGENT.subject),
      topic: normalizeOptionalText(candidate.topic),
      prompt: normalizeText(candidate.prompt, DEFAULT_AGENT.prompt),
      sendMode: normalizeSendMode(candidate.sendMode),
      iconKey: normalizeIconKey((candidate as any).iconKey ?? (candidate as any).icon),
      gradientFrom: isHexColor((candidate as any).gradientFrom) ? (candidate as any).gradientFrom : DEFAULT_AGENT.gradientFrom,
      gradientTo: isHexColor((candidate as any).gradientTo) ? (candidate as any).gradientTo : DEFAULT_AGENT.gradientTo,
      createdAt: normalizeIsoDate(candidate.createdAt, now),
      updatedAt: normalizeIsoDate(candidate.updatedAt, now),
    });
  }

  // Sort stable: newest updated first.
  normalized.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return normalized;
}

export function createCustomAgentDraft(overrides?: Partial<CustomAgent>): CustomAgent {
  const now = new Date().toISOString();
  const id = overrides?.id ?? `agent_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  return {
    ...DEFAULT_AGENT,
    id,
    ...overrides,
    createdAt: overrides?.createdAt ?? now,
    updatedAt: overrides?.updatedAt ?? now,
  };
}

export function loadCustomAgents(): CustomAgent[] {
  try {
    const raw = localStorage.getItem(CUSTOM_AGENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : parsed?.agents;
    if (!Array.isArray(arr)) return [];
    return normalizeCustomAgentsArray(arr);
  } catch {
    return [];
  }
}

export function saveCustomAgents(agents: CustomAgent[]) {
  try {
    localStorage.setItem(CUSTOM_AGENTS_STORAGE_KEY, JSON.stringify(agents));
  } catch {
    /* ignore */
  }
}

export function upsertCustomAgent(next: CustomAgent): CustomAgent[] {
  const list = loadCustomAgents();
  const now = new Date().toISOString();
  const updated: CustomAgent = { ...next, updatedAt: now, createdAt: next.createdAt || now };
  const idx = list.findIndex((a) => a.id === updated.id);
  if (idx >= 0) {
    const clone = [...list];
    clone[idx] = updated;
    saveCustomAgents(clone);
    return clone;
  }
  const merged = [{ ...updated, createdAt: updated.createdAt || now }, ...list];
  saveCustomAgents(merged);
  return merged;
}

export function deleteCustomAgent(id: string): CustomAgent[] {
  const list = loadCustomAgents();
  const next = list.filter((a) => a.id !== id);
  saveCustomAgents(next);
  return next;
}

export function exportCustomAgentsJson(agents: CustomAgent[]): string {
  return JSON.stringify({ version: 1, agents }, null, 2);
}

export function importCustomAgentsJson(payload: string): CustomAgent[] {
  const parsed = JSON.parse(payload);
  const arr = Array.isArray(parsed) ? parsed : parsed?.agents;
  if (!Array.isArray(arr)) return [];
  return normalizeCustomAgentsArray(arr);
}
