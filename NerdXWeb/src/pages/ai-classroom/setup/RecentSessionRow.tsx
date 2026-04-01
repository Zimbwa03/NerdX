import { ChevronRight } from 'lucide-react';
import type { MaicHistorySession } from '../../../services/api/aiClassroomApi';
import { subjectOptionFromLine } from './subjectData';
import { formatSessionRelative } from './aiClassroomSetupUtils';

type Props = {
  session: MaicHistorySession;
  busy: boolean;
  onResume: () => void;
};

export function RecentSessionRow({ session, busy, onResume }: Props) {
  const subj = session.subject || '';
  const opt = subjectOptionFromLine(subj);
  const iconId = opt?.id ?? 'default';
  const Icon = opt?.Icon;
  const stage = (session.stage || '').replace(/_/g, ' ') || '—';
  const done = session.stage === 'complete' || Boolean(session.completed_at);
  const ago = formatSessionRelative(session.started_at);
  const agoDisplay = ago ? ago.charAt(0).toUpperCase() + ago.slice(1) : '';

  return (
    <div className="flex gap-3 rounded-xl border border-classroom-border bg-classroom-elevated/50 p-3 font-dm">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ac-session-icon--${iconId}`}
        aria-hidden
      >
        {Icon ? <Icon className="h-4 w-4" aria-hidden /> : <span className="text-xs font-bold">{subj.slice(0, 1) || '?'}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-classroom-text-primary">
          {subj || 'Subject'} — {session.form_level || 'Form'}
        </p>
        <p className="truncate text-xs text-classroom-text-secondary">{session.topic || 'Topic'}</p>
        <p className="mt-1 text-[11px] text-classroom-text-muted">
          {agoDisplay}{' '}
          {done ? (
            <span className="text-classroom-brand">● Complete</span>
          ) : (
            <span>
              ● <span className="capitalize">{stage}</span>
            </span>
          )}
        </p>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onResume}
        className="inline-flex shrink-0 items-center gap-0.5 self-center rounded-lg border border-classroom-border bg-classroom-surface px-2.5 py-1.5 text-xs font-semibold text-classroom-brand hover:bg-classroom-elevated disabled:opacity-50"
      >
        Resume
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
