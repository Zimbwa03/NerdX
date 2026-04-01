import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  Building2,
  DollarSign,
  GraduationCap,
  Monitor,
  Percent,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { GroupNetworkAnalytics } from '../../services/api/schoolDashboardApi';

const ACCENT = '#a78bfa';
const MINT = '#34d399';
const SKY = '#38bdf8';
const AMBER = '#fbbf24';
const ROSE = '#fb7185';
const CHART_PALETTE = ['#8b5cf6', '#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#06b6d4', '#f97316', '#a855f7'];

function fmtUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

const tooltipStyle = {
  background: 'rgba(15, 23, 42, 0.96)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: 10,
  color: '#f1f5f9',
  fontSize: 12,
};

interface Props {
  data: GroupNetworkAnalytics;
  loading?: boolean;
}

export function GroupNetworkAnalyticsPanel({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="sd-exec-shell">
        <div className="sd-exec-loading">Loading executive analytics…</div>
      </div>
    );
  }

  const { totals, network_daily_activity, top_schools_by_activity, payments_by_school, monetization_funnel, channel_engagement, channel_devices, subject_distribution_network } = data;

  const funnelChart = monetization_funnel.map((f) => ({
    ...f,
    label: f.stage.replace(' on NerdX', ''),
  }));

  return (
    <div className="sd-exec-shell">
      <header className="sd-exec-header">
        <div className="sd-exec-header__titles">
          <span className="sd-exec-eyebrow">Group intelligence</span>
          <h2 className="sd-exec-title">Network executive overview</h2>
          <p className="sd-exec-sub">
            {data.network_name || 'Your group'} · {data.school_count} campus{data.school_count !== 1 ? 'es' : ''} ·
            Real-time signals from portal usage, subscriptions, collections, and AI classroom mastery
          </p>
        </div>
        <div className="sd-exec-header__badge">
          <Activity size={18} stroke={ACCENT} />
          <span>Last 30 days + rolling model</span>
        </div>
      </header>

      {/* KPI strip */}
      <div className="sd-exec-kpis">
        <div className="sd-exec-kpi sd-exec-kpi--violet">
          <Users size={20} />
          <div>
            <span className="sd-exec-kpi__val">{totals.portal_students.toLocaleString()}</span>
            <span className="sd-exec-kpi__lab">Portal learners</span>
          </div>
        </div>
        <div className="sd-exec-kpi sd-exec-kpi--green">
          <TrendingUp size={20} />
          <div>
            <span className="sd-exec-kpi__val">{totals.retention_pct_30d.toFixed(1)}%</span>
            <span className="sd-exec-kpi__lab">30-day retention</span>
          </div>
        </div>
        <div className="sd-exec-kpi sd-exec-kpi--sky">
          <Percent size={20} />
          <div>
            <span className="sd-exec-kpi__val">{totals.subscription_pct.toFixed(1)}%</span>
            <span className="sd-exec-kpi__lab">Active subscription</span>
          </div>
        </div>
        <div className="sd-exec-kpi sd-exec-kpi--amber">
          <DollarSign size={20} />
          <div>
            <span className="sd-exec-kpi__val">{fmtUsd(totals.payments_paid_usd)}</span>
            <span className="sd-exec-kpi__lab">Verified payments</span>
          </div>
        </div>
        <div className="sd-exec-kpi sd-exec-kpi--rose">
          <Activity size={20} />
          <div>
            <span className="sd-exec-kpi__val">{(totals.sessions_30d + totals.questions_30d / 8).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span className="sd-exec-kpi__lab">Engagement index</span>
          </div>
        </div>
        <div className="sd-exec-kpi sd-exec-kpi--slate">
          <GraduationCap size={20} />
          <div>
            <span className="sd-exec-kpi__val">{totals.teachers_registered.toLocaleString()}</span>
            <span className="sd-exec-kpi__lab">Teachers (ecosystem)</span>
          </div>
        </div>
      </div>

      <div className="sd-exec-grid2">
        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Network engagement trend</h3>
            <span className="sd-exec-card__hint">Sessions & questions · all campuses</span>
          </div>
          <div className="sd-exec-chart">
            {network_daily_activity.length === 0 ? (
              <p className="sd-exec-empty">No activity telemetry in the last 30 days. Students will appear here once they study on NerdX.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={network_daily_activity} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="execSess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={MINT} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={MINT} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="execQ" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={SKY} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={SKY} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(226,232,240,0.45)', fontSize: 10 }} tickFormatter={(v) => String(v).slice(5)} />
                  <YAxis tick={{ fill: 'rgba(226,232,240,0.45)', fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="sessions" name="Sessions" stroke={MINT} fill="url(#execSess)" strokeWidth={2} />
                  <Area type="monotone" dataKey="questions" name="Questions" stroke={SKY} fill="url(#execQ)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Highest activity campuses</h3>
            <span className="sd-exec-card__hint">Score blends sessions, questions & time</span>
          </div>
          <div className="sd-exec-chart">
            {top_schools_by_activity.length === 0 ? (
              <p className="sd-exec-empty">No campus-level activity yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={top_schools_by_activity} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'rgba(226,232,240,0.45)', fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'rgba(226,232,240,0.55)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [value.toFixed(1), 'Activity score']}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.full_name || ''}
                  />
                  <Bar dataKey="activity" name="Activity" radius={[0, 6, 6, 0]}>
                    {top_schools_by_activity.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <div className="sd-exec-grid2">
        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Learner journey funnel</h3>
            <span className="sd-exec-card__hint">Registered → paying → active this month</span>
          </div>
          <div className="sd-exec-chart">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={funnelChart} margin={{ top: 8, right: 8, left: 0, bottom: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(226,232,240,0.5)', fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={48} />
                <YAxis tick={{ fill: 'rgba(226,232,240,0.45)', fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Learners" fill={ACCENT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Channel mix</h3>
            <span className="sd-exec-card__hint">Mobile = active Expo push token · Web-first = no active token</span>
          </div>
          <div className="sd-exec-split">
            <div className="sd-exec-chart sd-exec-chart--pie">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={channel_engagement}
                    dataKey="learners"
                    nameKey="channel"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {channel_engagement.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? SKY : MINT} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="sd-exec-channel-list">
              {channel_engagement.map((c) => (
                <li key={c.channel}>
                  <span className="sd-exec-channel-list__icon">{c.channel.includes('Mobile') ? <Smartphone size={16} /> : <Monitor size={16} />}</span>
                  <div>
                    <strong>{c.learners.toLocaleString()}</strong>
                    <span>{c.channel}</span>
                    <small>{c.detail}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {channel_devices.length > 0 && (
            <div className="sd-exec-devices">
              <span className="sd-exec-card__hint" style={{ display: 'block', marginBottom: 8 }}>
                Mobile installs by platform (device tokens)
              </span>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={channel_devices} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(226,232,240,0.5)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(226,232,240,0.45)', fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {channel_devices.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[(i + 2) % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <div className="sd-exec-grid2">
        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Collections by campus</h3>
            <span className="sd-exec-card__hint">Verified vs pending (USD)</span>
          </div>
          <div className="sd-exec-chart">
            {payments_by_school.every((p) => p.paid === 0 && p.pending === 0) ? (
              <p className="sd-exec-empty">No payment records across the network yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={payments_by_school} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(226,232,240,0.5)', fontSize: 9 }} angle={-20} textAnchor="end" height={56} />
                  <YAxis tick={{ fill: 'rgba(226,232,240,0.45)', fontSize: 10 }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtUsd(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="paid" name="Paid / verified" stackId="a" fill={MINT} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill={AMBER} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="sd-exec-card">
          <div className="sd-exec-card__head">
            <h3>Subject attention (network)</h3>
            <span className="sd-exec-card__hint">Weighted by daily subject touches</span>
          </div>
          <div className="sd-exec-chart">
            {subject_distribution_network.length === 0 ? (
              <p className="sd-exec-empty">Subject signals will populate as learners access content.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={subject_distribution_network}
                    dataKey="count"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
                    label={({ name, percent }) => `${String(name).slice(0, 14)}${String(name).length > 14 ? '…' : ''} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'rgba(148,163,184,0.35)' }}
                  >
                    {subject_distribution_network.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <section className="sd-exec-card sd-exec-card--wide">
        <div className="sd-exec-card__head">
          <h3>Revenue model vs recorded cash</h3>
          <span className="sd-exec-card__hint">Model uses standard per-learner economics on portal headcount</span>
        </div>
        <div className="sd-exec-revenue-row">
          <div>
            <span className="sd-exec-revenue-row__lab">Model monthly (gross)</span>
            <strong>{fmtUsd(totals.revenue_model_monthly_usd)}</strong>
          </div>
          <div>
            <span className="sd-exec-revenue-row__lab">Group share (model)</span>
            <strong style={{ color: MINT }}>{fmtUsd(totals.school_share_model_usd)}</strong>
          </div>
          <div>
            <span className="sd-exec-revenue-row__lab">Platform fee (model)</span>
            <strong>{fmtUsd(totals.nerdx_share_model_usd)}</strong>
          </div>
          <div>
            <span className="sd-exec-revenue-row__lab">Verified payments</span>
            <strong style={{ color: SKY }}>{fmtUsd(totals.payments_paid_usd)}</strong>
          </div>
          <div>
            <span className="sd-exec-revenue-row__lab">Pending</span>
            <strong style={{ color: AMBER }}>{fmtUsd(totals.payments_pending_usd)}</strong>
          </div>
        </div>
      </section>

      {/* AI-style executive projection */}
      <section className="sd-exec-ai">
        <div className="sd-exec-ai__head">
          <Sparkles size={22} className="sd-exec-ai__spark" />
          <div>
            <h3>Executive insight & examination readiness model</h3>
            <p className="sd-exec-ai__sub">Model-assisted estimate from aggregated AI classroom mastery (topic accuracy × attempts). Not a statutory forecast.</p>
          </div>
        </div>
        <div className="sd-exec-ai__body">
          <div className="sd-exec-ai__metric">
            <Target size={28} stroke={ACCENT} />
            <div>
              <span className="sd-exec-ai__metric-label">Indicative group pass readiness</span>
              {data.projected_pass_rate_pct != null ? (
                <>
                  <span className="sd-exec-ai__metric-value">{data.projected_pass_rate_pct.toFixed(1)}%</span>
                  {data.projected_pass_band && <span className="sd-exec-ai__band">{data.projected_pass_band}</span>}
                </>
              ) : (
                <span className="sd-exec-ai__na">Awaiting assessment depth</span>
              )}
            </div>
          </div>
          <div className="sd-exec-ai__stats">
            <div>
              <span>Weighted topic accuracy</span>
              <strong>{totals.weighted_avg_accuracy != null ? `${totals.weighted_avg_accuracy.toFixed(1)}%` : '—'}</strong>
            </div>
            <div>
              <span>Learners with AI marks</span>
              <strong>{totals.performance_rows_students.toLocaleString()}</strong>
            </div>
            <div>
              <span>Ecosystem enrolments</span>
              <strong>{totals.eco_students.toLocaleString()}</strong>
            </div>
          </div>
        </div>
        <p className="sd-exec-ai__narrative">{data.executive_insight}</p>
      </section>

      <section className="sd-exec-card sd-exec-card--table">
        <div className="sd-exec-card__head">
          <h3>
            <Building2 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
            Campus scorecard
          </h3>
        </div>
        <div className="sd-exec-table-wrap">
          <table className="sd-exec-table">
            <thead>
              <tr>
                <th>Campus</th>
                <th>Learners</th>
                <th>30d %</th>
                <th>Sub %</th>
                <th>Sessions</th>
                <th>Accuracy</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {data.schools.slice(0, 24).map((s) => (
                <tr key={s.school_id}>
                  <td>
                    <strong>{s.name || s.school_id}</strong>
                    <code className="sd-exec-code">{s.school_id}</code>
                  </td>
                  <td>{s.portal_students.toLocaleString()}</td>
                  <td>{s.retention_pct.toFixed(0)}%</td>
                  <td>{s.subscription_pct.toFixed(0)}%</td>
                  <td>{s.sessions_30d.toLocaleString()}</td>
                  <td>{s.avg_topic_accuracy != null ? `${s.avg_topic_accuracy.toFixed(0)}%` : '—'}</td>
                  <td>{fmtUsd(s.payments_paid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
