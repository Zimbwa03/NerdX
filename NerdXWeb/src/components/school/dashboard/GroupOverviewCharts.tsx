import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyActivity, GroupNetworkAnalytics, SchoolOverview } from '../../../services/api/schoolDashboardApi';

const PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const tip = {
  background: 'rgba(15, 23, 42, 0.96)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: 10,
  color: '#f1f5f9',
  fontSize: 12,
};

function filterByDays(rows: DailyActivity[], days: number): DailyActivity[] {
  if (!rows.length) return [];
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.slice(-days);
}

function cumulativeModel(monthly: number, n: number) {
  let acc = 0;
  return Array.from({ length: n }, (_, i) => {
    acc += monthly;
    return { m: `M${i + 1}`, monthly, cumulative: Math.round(acc * 100) / 100 };
  });
}

interface Props {
  groupAnalytics: GroupNetworkAnalytics | null;
  overview: SchoolOverview | null;
  dateRangeDays: 7 | 30 | 90;
  campusSchoolId: 'all' | string;
  showGroupBlock: boolean;
}

export function GroupOverviewCharts({
  groupAnalytics,
  overview,
  dateRangeDays,
  campusSchoolId,
  showGroupBlock,
}: Props) {
  const networkDaily = useMemo(() => {
    const raw = groupAnalytics?.network_daily_activity || [];
    return filterByDays(raw, dateRangeDays);
  }, [groupAnalytics, dateRangeDays]);

  const campusRow = useMemo(() => {
    if (!groupAnalytics || campusSchoolId === 'all') return null;
    return groupAnalytics.schools.find((s) => s.school_id === campusSchoolId) ?? null;
  }, [groupAnalytics, campusSchoolId]);

  const revenueComposed = useMemo(() => {
    const m = groupAnalytics?.totals.revenue_model_monthly_usd ?? overview?.revenue.total_monthly ?? 0;
    const months = Math.min(12, Math.max(3, Math.ceil(dateRangeDays / 30)));
    return cumulativeModel(m, months);
  }, [groupAnalytics, overview, dateRangeDays]);

  if (!showGroupBlock || !groupAnalytics) return null;

  return (
    <div className="sd-overview-dense">
      {campusRow && (
        <div className="sd-card" style={{ marginBottom: 16, borderLeft: '3px solid var(--sd-brand-gold, #f59e0b)' }}>
          <h3 className="sd-card__title sd-font-display">Campus focus</h3>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            KPIs below are for <strong style={{ color: '#e2e8f0' }}>{campusRow.name || campusRow.school_id}</strong>. Detailed NerdX activity charts still reflect the portal login school unless you sign in with that campus.
          </p>
          <div className="sd-stats-grid">
            <div className="sd-stat-card">
              <span className="sd-stat-card__value sd-font-mono">{campusRow.portal_students}</span>
              <span className="sd-stat-card__label">Portal students</span>
            </div>
            <div className="sd-stat-card">
              <span className="sd-stat-card__value sd-font-mono">{campusRow.active_30d}</span>
              <span className="sd-stat-card__label">Active (30d)</span>
            </div>
            <div className="sd-stat-card">
              <span className="sd-stat-card__value sd-font-mono">{campusRow.subscription_pct?.toFixed?.(1) ?? 0}%</span>
              <span className="sd-stat-card__label">Subscribed</span>
            </div>
            <div className="sd-stat-card">
              <span className="sd-stat-card__value sd-font-mono">{campusRow.avg_topic_accuracy != null ? `${campusRow.avg_topic_accuracy}%` : '—'}</span>
              <span className="sd-stat-card__label">Avg topic accuracy</span>
            </div>
          </div>
        </div>
      )}

      <div className="sd-exec-grid2" style={{ marginBottom: 24 }}>
        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3 style={{ fontFamily: 'var(--sd-font-display, Sora), sans-serif' }}>Network activity</h3>
            <span className="sd-exec-card__hint">Last {dateRangeDays} days · all campuses</span>
          </div>
          <div className="sd-exec-chart" style={{ height: 280 }}>
            {networkDaily.length === 0 ? (
              <p className="sd-exec-empty">No telemetry in this window.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkDaily}>
                  <defs>
                    <linearGradient id="gNetS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} tickFormatter={(v) => String(v).slice(5)} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
                  <Tooltip contentStyle={tip} />
                  <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#10b981" fill="url(#gNetS)" />
                  <Area type="monotone" dataKey="questions" name="Questions" stroke="#3b82f6" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Top campuses · activity</h3>
            <span className="sd-exec-card__hint">Horizontal bars</span>
          </div>
          <div className="sd-exec-chart" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={(groupAnalytics.top_schools_by_activity || []).slice(0, 8)}
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 10 }} />
                <Tooltip contentStyle={tip} />
                <Bar dataKey="activity" name="Score" radius={[0, 6, 6, 0]}>
                  {(groupAnalytics.top_schools_by_activity || []).slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="sd-exec-grid2" style={{ marginBottom: 24 }}>
        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Revenue model trajectory</h3>
            <span className="sd-exec-card__hint">Illustrative · same monthly model repeated</span>
          </div>
          <div className="sd-exec-chart" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueComposed}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="m" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
                <YAxis yAxisId="l" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} />
                <Tooltip contentStyle={tip} formatter={(v: number) => [`$${v.toFixed(0)}`, '']} />
                <Legend />
                <Bar yAxisId="l" dataKey="monthly" name="Monthly (model)" fill="rgba(245, 158, 11, 0.75)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="r" type="monotone" dataKey="cumulative" name="Cumulative (model)" stroke="#10b981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Subject touches (network)</h3>
            <span className="sd-exec-card__hint">Weighted daily subject access</span>
          </div>
          <div className="sd-exec-chart sd-exec-chart--pie" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={groupAnalytics.subject_distribution_network || []}
                  dataKey="count"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {(groupAnalytics.subject_distribution_network || []).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="sd-exec-card sd-exec-card--wide" style={{ marginBottom: 24 }}>
        <div className="sd-exec-card__head">
          <h3>Schools at a glance</h3>
          <span className="sd-exec-card__hint">Click a row to set campus focus (top bar)</span>
        </div>
        <div className="sd-exec-table-wrap">
          <table className="sd-exec-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Students</th>
                <th>Active 30d</th>
                <th>Sub %</th>
                <th>Sessions</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {(groupAnalytics.schools || []).map((s) => (
                <tr key={s.school_id}>
                  <td>
                    <strong>{s.name || s.school_id}</strong>
                    <div className="sd-exec-code">{s.school_id}</div>
                  </td>
                  <td className="sd-font-mono">{s.portal_students}</td>
                  <td className="sd-font-mono">{s.active_30d}</td>
                  <td className="sd-font-mono">{s.subscription_pct?.toFixed?.(1)}%</td>
                  <td className="sd-font-mono">{s.sessions_30d}</td>
                  <td className="sd-font-mono">{s.avg_topic_accuracy != null ? `${s.avg_topic_accuracy}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
