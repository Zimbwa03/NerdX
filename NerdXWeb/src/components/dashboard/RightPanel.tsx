import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Flame, Sparkles, Target, TrendingUp, Video } from 'lucide-react';
import type { LessonBooking } from '../../types';

export interface RightPanelProps {
  upcomingLessons: LessonBooking[];
  nextStudyPlan: string;
  masteryScore: number;
  studyStreak: number;
  predictedGrade: string;
  recentActivity: { id: string; title: string; time: string }[];
}

function formatLessonTime(date: string, start: string | undefined) {
  const normalized = start?.split(':').length === 2 ? `${start}:00` : start;
  const d = new Date(`${date}T${normalized || '00:00:00'}`);
  if (Number.isNaN(d.getTime())) return `${date}`;
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function RightPanel({
  upcomingLessons,
  nextStudyPlan,
  masteryScore,
  studyStreak,
  predictedGrade,
  recentActivity,
}: RightPanelProps) {
  const next = upcomingLessons.slice(0, 4);

  return (
    <aside
      className="hidden w-[280px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--bg-surface)] xl:flex"
      aria-label="Study plan and quick stats"
    >
      <div className="flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto p-5">
        <section className="mb-8">
          <h2 className="mb-3 font-sora text-sm font-semibold text-[var(--text-primary)]">Today&apos;s study plan</h2>
          {next.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {next.map((lesson) => (
                <li
                  key={lesson.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-colors hover:border-[var(--border-accent)]"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                    <span>{formatLessonTime(lesson.date, lesson.start_time)}</span>
                  </div>
                  <p className="font-dm text-sm font-medium text-[var(--text-primary)]">{lesson.subject}</p>
                  <p className="mt-1 font-jetbrains text-xs text-[var(--text-secondary)]">
                    {lesson.start_time} – {lesson.end_time}
                  </p>
                  {lesson.room_id ? (
                    <Link
                      to={`/app/classroom/${lesson.id}`}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-dim)] px-3 py-1.5 text-xs font-medium text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
                      aria-label={`Join classroom for ${lesson.subject}`}
                    >
                      <Video className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                      Join
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border-accent)] bg-[var(--bg-elevated)] p-4">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{nextStudyPlan}</p>
              <Link
                to="/app/my-lessons"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)]"
              >
                <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                My Lessons
              </Link>
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-3 font-sora text-sm font-semibold text-[var(--text-primary)]">Quick stats</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]">
                <Target className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <p className="font-jetbrains text-lg font-bold tabular-nums text-[var(--text-primary)]">{masteryScore}%</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Mastery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
                <Flame className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <p className="font-jetbrains text-lg font-bold tabular-nums text-[var(--text-primary)]">{studyStreak}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Day streak</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
                <TrendingUp className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <p className="font-jetbrains text-lg font-bold tabular-nums text-[var(--text-primary)]">
                  {predictedGrade}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Grade outlook</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-sora text-sm font-semibold text-[var(--text-primary)]">Recent activity</h2>
          {recentActivity.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-transparent px-2 py-2 hover:border-[var(--border)] hover:bg-[var(--bg-elevated)]"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" strokeWidth={1.5} aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[var(--text-primary)]">{item.title}</p>
                    <p className="font-jetbrains text-xs text-[var(--text-muted)]">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">Answer questions to see your activity here.</p>
          )}
        </section>
      </div>
    </aside>
  );
}
