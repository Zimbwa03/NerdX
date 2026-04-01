import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, Target, Zap } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export interface AIInsightsCardProps {
  loading?: boolean;
  masteryScore: number;
  masteryTrend: string;
  studyStreak: number;
  streakTrend: string;
  predictedGrade: string;
  gradeTrend: string;
  topicsCovered: number;
  topicsTrend: string;
  weeklyActivity: { dayLabel: string; value: number }[];
}

function trendPillClass(trend: string) {
  const t = trend.trim();
  if (/^\+|Rising|Up|improv/i.test(t)) return 'bg-emerald-500/15 text-emerald-400';
  if (/^−|^\-|Falling|Needs|Down|−/i.test(t)) return 'bg-rose-500/15 text-rose-400';
  return 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]';
}

export function AIInsightsCard({
  loading,
  masteryScore,
  masteryTrend,
  studyStreak,
  streakTrend,
  predictedGrade,
  gradeTrend,
  topicsCovered,
  topicsTrend,
  weeklyActivity,
}: AIInsightsCardProps) {
  const maxVal = Math.max(...weeklyActivity.map((d) => d.value), 1);
  const chartData = weeklyActivity.map((d) => ({
    name: d.dayLabel,
    v: Math.round((d.value / maxVal) * 100),
  }));

  return (
    <section
      id="ai-insights"
      className="animate-dash-fade-up mb-10 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 opacity-0 [animation-delay:240ms] [animation-fill-mode:forwards]"
      aria-labelledby="ai-insights-title"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="ai-insights-title" className="font-sora text-[17px] font-semibold text-[var(--text-primary)]">
            AI Insights
          </h2>
          <p className="mt-1 font-dm text-xs text-[var(--text-secondary)]">
            Real-time learning analytics tailored to you
          </p>
        </div>
        <Link
          to="/app/ai-insights"
          className="inline-flex items-center gap-1 font-dm text-sm font-medium text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] sm:shrink-0"
          aria-label="Open AI insights dashboard"
        >
          Open Dashboard <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>

      {loading ? (
        <p className="font-dm text-sm text-[var(--text-secondary)]">Loading insights…</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]">
                <Target className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-jetbrains text-2xl font-bold tabular-nums text-[var(--text-primary)]">{masteryScore}%</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Mastery score</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 font-dm text-[11px] font-medium ${trendPillClass(masteryTrend)}`}
                >
                  {masteryTrend}
                </span>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
                <Zap className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-jetbrains text-2xl font-bold tabular-nums text-[var(--text-primary)]">{studyStreak}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Study streak</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 font-dm text-[11px] font-medium ${trendPillClass(streakTrend)}`}
                >
                  {streakTrend}
                </span>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
                <BarChart3 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-jetbrains text-2xl font-bold tabular-nums text-[var(--text-primary)]">{predictedGrade}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Predicted grade</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 font-dm text-[11px] font-medium ${trendPillClass(gradeTrend)}`}
                >
                  {gradeTrend}
                </span>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
                <BookOpen className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-jetbrains text-2xl font-bold tabular-nums text-[var(--text-primary)]">{topicsCovered}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Topics covered</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 font-dm text-[11px] font-medium ${trendPillClass(topicsTrend)}`}
                >
                  {topicsTrend}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2">
            <p className="mb-1 font-dm text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Last 7 days
            </p>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height={48}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
