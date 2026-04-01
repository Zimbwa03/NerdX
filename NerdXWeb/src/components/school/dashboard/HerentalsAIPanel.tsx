import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { schoolApi } from '../../../services/api/schoolDashboardApi';
import '../../../styles/school-dashboard.css';

export interface HerentalsAIMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface HerentalsAIPanelProps {
  open: boolean;
  onClose: () => void;
  token: string;
  pageContext: string;
}

export function HerentalsAIPanel({ open, onClose, token, pageContext }: HerentalsAIPanelProps) {
  const [messages, setMessages] = useState<HerentalsAIMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(t);
  }, [messages, open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setError(null);
    const nextUser: HerentalsAIMessage = { role: 'user', text };
    setMessages((m) => [...m, nextUser]);
    setSending(true);
    const historyForApi = messages.map((msg) => ({
      role: msg.role,
      text: msg.text,
    }));
    const res = await schoolApi.herentalsAIChat(token, text, { history: historyForApi, pageContext });
    setSending(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    const reply = (res.reply || '').trim() || 'No response.';
    setMessages((m) => [...m, { role: 'assistant', text: reply }]);
  }, [input, sending, messages, token, pageContext]);

  if (!open) return null;

  return (
    <>
      <button type="button" className="sd-ai-backdrop" aria-label="Close panel" onClick={onClose} />
      <aside className="sd-ai-panel" aria-label="Herentals AI">
        <div className="sd-ai-panel__head">
          <span className="sd-ai-panel__title">Herentals AI</span>
          <button type="button" className="sd-ai-panel__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="sd-ai-panel__meta">
          Read-only · grounded on your portal data · {pageContext || 'Dashboard'}
        </div>
        <div className="sd-ai-panel__messages" ref={listRef}>
          {messages.length === 0 && (
            <p className="sd-ai-panel__hint" style={{ padding: '8px 0' }}>
              Ask about learner counts, activity, subscription, or finances. Answers use only data visible to this school
              portal—not live admin tools.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}`}
              className={`sd-ai-bubble ${msg.role === 'user' ? 'sd-ai-bubble--user' : 'sd-ai-bubble--assistant'}`}
            >
              {msg.text}
            </div>
          ))}
          {sending && (
            <div className="sd-ai-bubble sd-ai-bubble--assistant" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={18} className="sd-spin" />
              Thinking…
            </div>
          )}
          {error && (
            <div className="sd-ai-bubble sd-ai-bubble--assistant" style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
              {error}
            </div>
          )}
        </div>
        <form
          className="sd-ai-panel__form"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <textarea
            className="sd-ai-panel__input"
            placeholder="Ask a question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
            rows={3}
          />
          <div className="sd-ai-panel__actions">
            <button type="submit" className="sd-ai-panel__send" disabled={sending || !input.trim()}>
              Send
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
