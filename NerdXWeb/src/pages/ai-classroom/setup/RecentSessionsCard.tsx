import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Telescope } from 'lucide-react';
import type { MaicHistorySession } from '../../../services/api/aiClassroomApi';
import { RecentSessionRow } from './RecentSessionRow';

type Props = {
  loading: boolean;
  items: MaicHistorySession[];
  resumingId: string | null;
  onResume: (id: string) => void;
};

function SkeletonRow() {
  return (
    <div className="flex animate-classroom-shimmer gap-3 rounded-xl border border-classroom-border/60 bg-classroom-elevated/30 p-3">
      <div className="h-10 w-10 shrink-0 rounded-full bg-classroom-border/50" />
      <div className="flex flex-1 flex-col justify-center gap-2">
        <div className="h-3 w-[120px] rounded bg-classroom-border/50" />
        <div className="h-2.5 w-[80px] rounded bg-classroom-border/40" />
      </div>
    </div>
  );
}

export function RecentSessionsCard({ loading, items, resumingId, onResume }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = useMemo(() => (showAll ? items : items.slice(0, 4)), [items, showAll]);

  return (
    <motion.section
      className="mt-4 rounded-[20px] border border-classroom-border bg-classroom-surface p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      id="recent-sessions"
      aria-labelledby="recent-sessions-heading"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 id="recent-sessions-heading" className="font-sora text-[15px] font-semibold text-classroom-text-primary">
          Recent sessions
        </h2>
        {items.length > 4 ? (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="text-xs font-semibold text-classroom-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface"
          >
            {showAll ? 'Show less' : 'View all →'}
          </button>
        ) : (
          <span className="text-xs text-classroom-text-muted">{items.length ? `${items.length} saved` : ''}</span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading recent sessions">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <Telescope className="h-16 w-16 text-classroom-text-muted opacity-80" aria-hidden />
          <p className="mt-4 font-sora text-sm font-semibold text-classroom-text-primary">No sessions yet</p>
          <p className="mt-1 max-w-xs text-xs text-classroom-text-secondary">
            Start your first AI classroom session using the form on the left.
          </p>
        </div>
      ) : (
        <ul className="flex max-h-[min(420px,55vh)] flex-col gap-3 overflow-y-auto pr-1">
          {visible.map((h) => (
            <li key={h.id}>
              <RecentSessionRow session={h} busy={resumingId === h.id} onResume={() => onResume(h.id)} />
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
