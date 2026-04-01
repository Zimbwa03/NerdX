import { MessageSquare, Mic } from 'lucide-react';

export type VoiceMode = 'voice' | 'text';

type Props = {
  value: VoiceMode;
  onChange: (v: VoiceMode) => void;
};

export function VoiceToggle({ value, onChange }: Props) {
  return (
    <div className="font-dm">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-classroom-text-muted">Voice Mode</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          role="radio"
          aria-checked={value === 'voice'}
          onClick={() => onChange('voice')}
          className={`rounded-xl p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-accent-voice focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface ${
            value === 'voice'
              ? 'border-2 border-classroom-accent-voice bg-[rgba(129,140,248,0.06)]'
              : 'border border-classroom-border bg-transparent'
          }`}
        >
          <div className="flex items-start gap-2">
            <Mic className="mt-0.5 h-5 w-5 text-classroom-accent-voice" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-classroom-text-primary">Voice + Text</p>
              <p className="mt-1 text-xs text-classroom-text-secondary">
                AI teacher speaks; you can reply by voice or typing.
              </p>
              {value === 'voice' ? (
                <span className="mt-2 inline-block rounded-full bg-classroom-accent-voice px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Recommended
                </span>
              ) : null}
            </div>
          </div>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={value === 'text'}
          onClick={() => onChange('text')}
          className={`rounded-xl p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface ${
            value === 'text'
              ? 'border-2 border-classroom-brand bg-emerald-500/[0.08]'
              : 'border border-classroom-border bg-transparent'
          }`}
        >
          <div className="flex items-start gap-2">
            <MessageSquare className="mt-0.5 h-5 w-5 text-classroom-text-secondary" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-classroom-text-primary">Text Only</p>
              <p className="mt-1 text-xs text-classroom-text-secondary">Standard chat mode. No mic required.</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
