import { API_BASE_URL, getAuthToken } from './config';
import type { MaicBoardSpec } from '../../types/maicBoard';

export interface MaicLessonOutline {
  title?: string;
  objectives?: string[];
  segments?: string[];
}

export interface MaicStartData {
  session_id: string;
  lesson_outline: MaicLessonOutline | null;
  stage: string;
}

export interface MaicStartJobData {
  job_id: string;
  status: 'queued' | 'working' | 'succeeded' | 'failed';
  message?: string;
  data?: MaicStartData | null;
  credits_remaining?: number;
}

export interface MaicQuizQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correct_index?: number;
  rubric?: string;
}

export interface MaicHistorySession {
  id: string;
  subject?: string;
  topic?: string;
  form_level?: string;
  stage?: string;
  started_at?: string;
  completed_at?: string | null;
  credits_used?: number;
  lesson_outline?: MaicLessonOutline | null;
}

export interface MaicPlaybackMessage {
  id?: string;
  sender: string;
  content: string;
  message_type?: string;
  created_at?: string;
}

export interface MaicPlaybackData {
  session: MaicHistorySession & Record<string, unknown>;
  messages: MaicPlaybackMessage[];
}

export interface MaicStreamHandlers {
  onStart?: (creditsRemaining?: number) => void;
  onTeacherToken?: (chunk: string) => void;
  onTeacherSegmentEnd?: () => void;
  onTeacherQuiz?: (questions: MaicQuizQuestion[]) => void;
  onClassmateMessage?: (content: string) => void;
  onNoteTakerMessage?: (content: string) => void;
  onStage?: (stage: string, creditsRemaining?: number) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}

const MAIC_ROUTE_MISSING_ERROR =
  'AI Classroom API is not available on this backend (404). Restart the backend with the latest code (python main.py).';

function buildHttpError(
  res: Response,
  payload: { message?: string; error?: unknown } | null | undefined
): string {
  if (res.status === 404) return MAIC_ROUTE_MISSING_ERROR;
  const msg = (payload?.message || String(payload?.error || '') || '').trim();
  return msg || `Request failed (${res.status})`;
}

function readCreditsRemaining(payload: unknown): number | undefined {
  if (payload && typeof payload === 'object' && 'credits_remaining' in payload) {
    const v = (payload as { credits_remaining?: number }).credits_remaining;
    return typeof v === 'number' ? v : undefined;
  }
  return undefined;
}

export const aiClassroomApi = {
  startSession: async (
    subject: string,
    formLevel: string,
    topic?: string
  ): Promise<{ data: MaicStartData | null; creditsRemaining?: number; error?: string }> => {
    const token = getAuthToken();
    if (!token) {
      return {
        data: null,
        error: 'Please log in again - your session token is missing.',
      };
    }
    const url = `${API_BASE_URL.replace(/\/$/, '')}/api/mobile/classroom/start`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          form_level: formLevel,
          topic: topic || subject,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        error?: unknown;
        data?: MaicStartData;
        credits_remaining?: number;
      };
      const failMsg = buildHttpError(res, json);
      if (!res.ok || json.success === false) {
        return { data: null, error: failMsg };
      }
      const data = json.data ?? null;
      if (!data?.session_id) {
        return {
          data: null,
          error: json.message || 'Server did not return a session id.',
        };
      }
      return {
        data,
        creditsRemaining:
          typeof json.credits_remaining === 'number' ? json.credits_remaining : undefined,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isNetwork =
        e instanceof TypeError ||
        msg.toLowerCase().includes('fetch') ||
        msg.toLowerCase().includes('network') ||
        msg.toLowerCase().includes('failed');
      const hint = isNetwork
        ? ' Cannot reach the backend. For local dev: run Flask on port 5000 and either leave VITE_API_BASE_URL empty (Vite proxies /api) or set it to your API base URL with CORS enabled.'
        : '';
      return { data: null, error: `Network error: ${msg}.${hint}`.trim() };
    }
  },

  startSessionJob: async (
    subject: string,
    formLevel: string,
    topic?: string
  ): Promise<{
    jobId?: string;
    status?: string;
    message?: string;
    data?: MaicStartData | null;
    creditsRemaining?: number;
    error?: string;
  }> => {
    const token = getAuthToken();
    if (!token) {
      return {
        error: 'Please log in again - your session token is missing.',
      };
    }

    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/start-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject,
        form_level: formLevel,
        topic: topic || subject,
      }),
    });

    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      error?: unknown;
      credits_remaining?: number;
      data?: Partial<MaicStartJobData>;
    };
    if (!res.ok || json.success === false) {
      return { error: buildHttpError(res, json) };
    }

    const data = json.data || {};
    const maybeSession = data.data as MaicStartData | null | undefined;
    return {
      jobId: typeof data.job_id === 'string' ? data.job_id : undefined,
      status: typeof data.status === 'string' ? data.status : undefined,
      message: typeof data.message === 'string' ? data.message : undefined,
      data: maybeSession,
      creditsRemaining:
        typeof data.credits_remaining === 'number'
          ? data.credits_remaining
          : typeof json.credits_remaining === 'number'
            ? json.credits_remaining
            : undefined,
    };
  },

  getStartSessionJob: async (
    jobId: string
  ): Promise<{
    status?: string;
    message?: string;
    data?: MaicStartData | null;
    creditsRemaining?: number;
    error?: string;
  }> => {
    const token = getAuthToken();
    if (!token) {
      return {
        error: 'Please log in again - your session token is missing.',
      };
    }

    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/start-job/${encodeURIComponent(jobId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      error?: unknown;
      data?: Partial<MaicStartJobData>;
    };
    if (!res.ok || json.success === false) {
      return { error: buildHttpError(res, json) };
    }
    const data = json.data || {};
    return {
      status: typeof data.status === 'string' ? data.status : undefined,
      message: typeof data.message === 'string' ? data.message : undefined,
      data: data.data as MaicStartData | null | undefined,
      creditsRemaining:
        typeof data.credits_remaining === 'number' ? data.credits_remaining : undefined,
    };
  },

  postStream: async (
    sessionId: string,
    handlers: MaicStreamHandlers = {}
  ): Promise<void> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/mobile/classroom/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ session_id: sessionId, action: 'next_segment' }),
    });

    if (!response.ok) {
      const text = await response.text();
      handlers.onError?.(text || `Server error: ${response.status}`);
      throw new Error(text || 'Stream failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      handlers.onError?.('No response body');
      return;
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      buffer += decoder.decode(value, { stream: true });
      let boundaryIndex = buffer.indexOf('\n\n');

      while (boundaryIndex >= 0) {
        const rawEvent = buffer.slice(0, boundaryIndex).trim();
        buffer = buffer.slice(boundaryIndex + 2);

        if (rawEvent) {
          for (const line of rawEvent.split('\n')) {
            if (!line.startsWith('data:')) continue;
            const dataStr = line.slice(5).trim();
            if (!dataStr) continue;
            try {
              const ev = JSON.parse(dataStr) as Record<string, unknown>;
              const type = ev.type as string;

              if (type === 'error') {
                handlers.onError?.(String(ev.message || 'Error'));
                return;
              }
              if (type === 'start' && ev.sender === 'system') {
                handlers.onStart?.(readCreditsRemaining(ev));
              }
              if (type === 'start' && ev.sender === 'teacher') {
                // teacher segment start
              }
              if (type === 'token' && ev.sender === 'teacher') {
                const c = String(ev.content || '');
                if (c) handlers.onTeacherToken?.(c);
              }
              if (type === 'end' && ev.sender === 'teacher') {
                handlers.onTeacherSegmentEnd?.();
              }
              if (type === 'quiz') {
                const qs = ev.questions as MaicQuizQuestion[] | undefined;
                if (qs?.length) handlers.onTeacherQuiz?.(qs);
              }
              if (type === 'message' && ev.sender === 'classmate') {
                handlers.onClassmateMessage?.(String(ev.content || ''));
              }
              if (type === 'note' && ev.sender === 'note_taker') {
                handlers.onNoteTakerMessage?.(String(ev.content || ''));
              }
              if (type === 'stage' && ev.sender === 'system') {
                handlers.onStage?.(String(ev.stage || ''), readCreditsRemaining(ev));
              }
              if (type === 'done') {
                handlers.onDone?.();
              }
            } catch {
              /* skip bad chunk */
            }
          }
        }
        boundaryIndex = buffer.indexOf('\n\n');
      }
    }
  },

  sendMessage: async (
    sessionId: string,
    content: string
  ): Promise<{
    response: string;
    whiteboards?: MaicBoardSpec[];
    creditsRemaining?: number;
    error?: string;
  }> => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ session_id: sessionId, content }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        response: '',
        error: (json as { message?: string }).message || `Error ${res.status}`,
      };
    }
    const data = (json as { data?: { response?: string; whiteboards?: MaicBoardSpec[] } }).data;
    return {
      response: data?.response || '',
      whiteboards: data?.whiteboards,
      creditsRemaining: (json as { credits_remaining?: number }).credits_remaining,
    };
  },

  submitQuiz: async (
    sessionId: string,
    answers: Record<string, string | number>
  ): Promise<{
    score: number;
    feedback: string;
    stage?: string;
    creditsRemaining?: number;
    error?: string;
  }> => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/${sessionId}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ answers }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        score: 0,
        feedback: '',
        error: (json as { message?: string }).message || `Error ${res.status}`,
      };
    }
    const data = (json as { data?: { score?: number; feedback?: string; stage?: string } }).data;
    return {
      score: Number(data?.score ?? 0),
      feedback: data?.feedback || '',
      stage: data?.stage,
      creditsRemaining: (json as { credits_remaining?: number }).credits_remaining,
    };
  },

  getSummary: async (
    sessionId: string
  ): Promise<{ summary: string; stage?: string; error?: string }> => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/${sessionId}/summary`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { summary: '', error: (json as { message?: string }).message };
    }
    const data = (json as { data?: { summary?: string; stage?: string } }).data;
    return { summary: data?.summary || '', stage: data?.stage };
  },

  listHistory: async (): Promise<{ data: MaicHistorySession[]; error?: string }> => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/history`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = (await res.json().catch(() => ({}))) as {
      data?: MaicHistorySession[];
      message?: string;
      error?: unknown;
    };
    if (!res.ok) {
      return { data: [], error: buildHttpError(res, json) };
    }
    const data = (json as { data?: MaicHistorySession[] }).data;
    return { data: Array.isArray(data) ? data : [] };
  },

  /**
   * Server TTS (Edge-TTS via Flask). Returns absolute audio URL or null.
   * Falls back to browser speechSynthesis in the UI if this fails.
   */
  transcribeAudio: async (
    audioFile: File
  ): Promise<{ success: boolean; text?: string; language?: string; message?: string }> => {
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: 'Please log in again - your session token is missing.' };
    }
    const formData = new FormData();
    formData.append('audio', audioFile);
    const res = await fetch(`${API_BASE_URL}/api/mobile/voice/transcribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      text?: string;
      language?: string;
      message?: string;
    };
    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message || `Transcription failed (${res.status})`,
      };
    }
    return {
      success: true,
      text: json.text || '',
      language: json.language || 'en',
    };
  },

  speakText: async (text: string): Promise<string | null> => {
    const trimmed = text.replace(/\s+/g, ' ').trim();
    if (!trimmed) return null;
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/mobile/voice/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text: trimmed.slice(0, 2500), voice: 'teacher' }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      audio_url?: string;
    };
    if (!res.ok || !json.success || !json.audio_url) return null;
    const rel = json.audio_url;
    if (rel.startsWith('http://') || rel.startsWith('https://')) return rel;
    const base = API_BASE_URL.replace(/\/$/, '');
    return `${base}${rel.startsWith('/') ? '' : '/'}${rel}`;
  },

  fetchPlayback: async (
    sessionId: string
  ): Promise<{ data: MaicPlaybackData | null; error?: string }> => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/${sessionId}/playback`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        data: null,
        error: (json as { message?: string }).message || `Error ${res.status}`,
      };
    }
    const data = (json as { data?: MaicPlaybackData }).data ?? null;
    return { data };
  },

  endSession: async (sessionId: string): Promise<boolean> => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/mobile/classroom/${sessionId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.ok;
  },
};

