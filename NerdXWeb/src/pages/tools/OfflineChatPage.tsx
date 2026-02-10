import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Send, Wifi, WifiOff } from 'lucide-react';
import { scienceTopics } from '../../data/scienceNotes';

type OfflineLink = { label: string; to: string };

type OfflineMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  links?: OfflineLink[];
};

const STORAGE_KEY = 'nerdx_offline_chat_v1';

type ScienceSubject = 'Biology' | 'Chemistry' | 'Physics';

function subjectToSlug(subject: ScienceSubject): string {
  return subject.toLowerCase();
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function buildDefaultMessages(): OfflineMessage[] {
  return [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Offline Chat is a lightweight mode for when you donâ€™t have data.\n\nI canâ€™t generate new AI answers offline yet, but I can help you jump into downloaded resources (Science Notes, Formula Sheet, Past Papers). Try:\n- \"search osmosis\"\n- \"open formula sheet\"\n- \"biology topics\"",
      links: [
        { label: 'Formula Sheet', to: '/app/formula-sheet' },
        { label: 'Past Papers', to: '/app/past-papers' },
        { label: 'Science Hub', to: '/app/sciences' },
      ],
    },
  ];
}

function normalizeQuery(q: string): string {
  return (q || '').trim().toLowerCase();
}

function searchScience(query: string): Array<{ subject: ScienceSubject; topic: string }> {
  const q = normalizeQuery(query);
  if (!q) return [];
  const out: Array<{ subject: ScienceSubject; topic: string }> = [];
  const subjects: ScienceSubject[] = ['Biology', 'Chemistry', 'Physics'];
  for (const s of subjects) {
    const topics = scienceTopics[s] ?? [];
    for (const t of topics) {
      if (t.toLowerCase().includes(q)) out.push({ subject: s, topic: t });
    }
  }
  return out;
}

function respondOffline(message: string): OfflineMessage {
  const q = normalizeQuery(message);

  if (!q) {
    return { id: `a-${Date.now()}`, role: 'assistant', content: 'Type something and Iâ€™ll try to route you to offline resources.' };
  }

  if (q.includes('formula')) {
    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: 'Open the Formula Sheet (works offline).',
      links: [{ label: 'Formula Sheet', to: '/app/formula-sheet' }],
    };
  }

  if (q.includes('past paper') || q.includes('past papers')) {
    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: 'Open Past Papers.',
      links: [{ label: 'Past Papers', to: '/app/past-papers' }],
    };
  }

  if (q.includes('project')) {
    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content:
        'Project Assistant needs the server (online) to chat. If youâ€™re offline, you can still prepare:\n- your topic idea\n- research questions\n- data collection plan\n\nWhen youâ€™re online, open Project Assistant.',
      links: [{ label: 'Project Assistant', to: '/app/project-assistant' }],
    };
  }

  if (q.includes('biology')) {
    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: 'Open Biology, or search for a topic name (e.g. "osmosis").',
      links: [{ label: 'Biology', to: '/app/biology' }, { label: 'Science Hub', to: '/app/sciences' }],
    };
  }
  if (q.includes('chemistry')) {
    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: 'Open Chemistry, or search for a topic name.',
      links: [{ label: 'Chemistry', to: '/app/chemistry' }, { label: 'Science Hub', to: '/app/sciences' }],
    };
  }
  if (q.includes('physics')) {
    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: 'Open Physics, or search for a topic name.',
      links: [{ label: 'Physics', to: '/app/physics' }, { label: 'Science Hub', to: '/app/sciences' }],
    };
  }

  const matches = searchScience(q);
  if (matches.length > 0) {
    const top = matches.slice(0, 8);
    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: `Found ${matches.length} Science Notes matches. Open one:`,
      links: top.map((m) => ({
        label: `${m.subject}: ${m.topic}`,
        to: `/app/${subjectToSlug(m.subject)}/notes/${encodeURIComponent(m.topic)}`,
      })),
    };
  }

  return {
    id: `a-${Date.now()}`,
    role: 'assistant',
    content:
      "I couldnâ€™t find that in downloaded Science Notes. Try a shorter keyword (e.g. \"diffusion\", \"mitosis\", \"acids\").\n\nOffline tools available:\n- Formula Sheet\n- Past Papers\n- Science Notes",
    links: [
      { label: 'Formula Sheet', to: '/app/formula-sheet' },
      { label: 'Past Papers', to: '/app/past-papers' },
      { label: 'Science Hub', to: '/app/sciences' },
    ],
  };
}

export function OfflineChatPage() {
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [messages, setMessages] = useState<OfflineMessage[]>(() => {
    const cached = safeJsonParse<OfflineMessage[]>(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(cached) && cached.length ? cached : buildDefaultMessages();
  });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const placeholder = useMemo(() => (isOnline ? 'Search downloaded notes or open tools...' : 'Offline: search downloaded notes...'), [isOnline]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: OfflineMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg, respondOffline(text)]);
    setInput('');
  };

  return (
    <div className="teacher-mode-page teacher-chat-gpt-layout offline-chat-page">
      <aside className="teacher-chat-sidebar">
        <Link to="/app" className="teacher-chat-sidebar-item" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>
        <div className="teacher-chat-sidebar-spacer" />
        <div className="teacher-chat-sidebar-user" title={isOnline ? 'Online' : 'Offline'}>
          <span className="teacher-chat-sidebar-credits">{isOnline ? 'ON' : 'OFF'}</span>
          <span className="teacher-chat-sidebar-credits-label">{isOnline ? 'online' : 'offline'}</span>
        </div>
      </aside>

      <div className="teacher-chat-main">
        <header className="teacher-chat-topbar">
          <div className="teacher-chat-topbar-title">
            <span className="teacher-chat-topbar-icon" aria-hidden="true">
              {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
            </span>
            <span>Offline Chat</span>
            <span className="teacher-chat-topbar-sub">
              {isOnline ? 'Offline-friendly tools' : 'No internet connection'}
            </span>
          </div>
        </header>

        {!isOnline && (
          <div className="teacher-chat-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <WifiOff size={16} /> Youâ€™re offline. AI features are disabled, but notes/tools still work.
          </div>
        )}

        <div className="teacher-mode-chat">
          <div className="teacher-messages">
            {messages.map((m) => (
              <div key={m.id} className={`teacher-msg-row ${m.role === 'user' ? 'teacher-msg-row-user' : 'teacher-msg-row-assistant'}`}>
                <div className={`teacher-msg-bubble ${m.role === 'user' ? 'teacher-msg-bubble-user' : 'teacher-msg-bubble-assistant'}`}>
                  <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                  {m.links?.length ? (
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {m.links.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          className="teacher-chat-topbar-btn"
                          style={{ textDecoration: 'none' }}
                        >
                          <Search size={16} />
                          <span>{l.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <div className="teacher-chat-input-wrap">
            <div className="teacher-chat-input-bar">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={placeholder}
                rows={1}
                className="teacher-chat-input-field"
              />
              <button
                type="button"
                className="teacher-chat-send-btn"
                onClick={send}
                disabled={!input.trim()}
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
