import { useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
}

export function AiAssistantPanel({
    code,
    language,
    onClose,
    onExplain
}: {
    code: string;
    language: string;
    onClose: () => void;
    onExplain?: () => void;
}) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            text: `Hi! I'm your AI coding tutor. I can help you understand your ${language} code, fix errors, or suggest improvements. What can I do for you today?`
        }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Mock AI response (In production, this would call an LLM API)
        setTimeout(() => {
            let responseText = "That's an interesting question! I'm simulating a response right now. Once connected to the real backend, I'll analyze your code line-by-line.";

            if (input.toLowerCase().includes('error') || input.toLowerCase().includes('fix')) {
                responseText = "I see you're asking about an error. Check line 3 - you might be missing a semicolon or parenthesis. Syntax errors are common! try adding it and running again.";
            } else if (input.toLowerCase().includes('explain')) {
                responseText = "This code appears to be a basic script. It initializes variables and prints output to the console. The logic flows from top to bottom.";
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText };
            setMessages(prev => [...prev, aiMsg]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="vl-ai-panel">
            <div className="vl-ai-header">
                <div className="vl-row compact">
                    <div className="subject-icon-v2 small" style={{ background: 'linear-gradient(135deg, #7C4DFF, #651FFF)' }}>
                        <Bot size={16} />
                    </div>
                    <span style={{ fontWeight: 'bold' }}>AI Tutor</span>
                </div>
                <button onClick={onClose} className="vl-icon-btn"><X size={16} /></button>
            </div>

            <div className="vl-ai-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`vl-msg ${msg.role}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="vl-msg assistant typing">...</div>}
            </div>

            <div className="vl-ai-suggestions">
                <button className="vl-pill" onClick={() => { setInput("Explain this code"); sendMessage(); }}>Explain Code</button>
                <button className="vl-pill" onClick={() => { setInput("Find bugs"); sendMessage(); }}>Find Bugs</button>
                <button className="vl-pill" onClick={() => { setInput("How do I add a loop?"); sendMessage(); }}>Add Loop</button>
            </div>

            <div className="vl-ai-input">
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} disabled={!input.trim() || loading}>
                    <Send size={16} />
                </button>
            </div>

            <style>{`
        .vl-ai-panel {
          position: fixed; bottom: 20px; right: 20px; 
          width: min(320px, calc(100vw - 24px));
          height: min(450px, calc(100vh - 24px));
          background: #1A1D26; border: 1px solid #333;
          border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          display: flex; flex-direction: column; z-index: 1000;
        }
        @supports (height: 100dvh) {
          .vl-ai-panel {
            height: min(450px, calc(100dvh - 24px));
          }
        }
        .vl-ai-header {
          padding: 12px; border-bottom: 1px solid #333;
          display: flex; justify-content: space-between; align-items: center;
          background: #14161F; border-radius: 12px 12px 0 0;
        }
        .vl-ai-messages {
          flex: 1; overflow-y: auto; padding: 12px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .vl-msg {
          padding: 10px; border-radius: 8px; font-size: 13px; line-height: 1.4;
          max-width: 85%; word-wrap: break-word;
        }
        .vl-msg.assistant { background: #2A2D3A; align-self: flex-start; color: #E0E0E0; border-bottom-left-radius: 2px; }
        .vl-msg.user { background: #651FFF; align-self: flex-end; color: #fff; border-bottom-right-radius: 2px; }
        .vl-ai-input {
          padding: 12px; border-top: 1px solid #333;
          display: flex; gap: 8px;
        }
        .vl-ai-input input {
          flex: 1; background: #0A0C10; border: 1px solid #333;
          border-radius: 20px; padding: 8px 12px; color: #fff;
          outline: none; font-size: 13px;
        }
        .vl-ai-input input:focus { border-color: #651FFF; }
        .vl-ai-input button {
          width: 32px; height: 32px; border-radius: 50%;
          background: #651FFF; color: #fff; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .vl-ai-suggestions {
            padding: 8px 12px 0; display: flex; gap: 6px; overflow-x: auto;
        }
        .vl-pill {
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; padding: 4px 8px; font-size: 11px; color: #aaa;
            cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }
        .vl-pill:hover { background: rgba(255,255,255,0.1); color: #fff; }
        @media (max-width: 640px) {
          .vl-ai-panel {
            left: 12px;
            right: 12px;
            bottom: 12px;
            width: auto;
            height: min(62vh, 420px);
          }
          .vl-msg {
            max-width: 92%;
          }
          .vl-ai-input input {
            font-size: 16px;
          }
        }
      `}</style>
        </div>
    );
}
