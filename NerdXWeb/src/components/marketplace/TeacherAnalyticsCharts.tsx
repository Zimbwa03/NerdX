import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import type { WeeklyLessonData, EngagementData, MonthlyRatingData, SubjectDistribution } from '../../types';
import { BookOpen, TrendingUp, Star, PieChart as PieIcon } from 'lucide-react';

interface TeacherAnalyticsChartsProps {
  weeklyData: WeeklyLessonData[];
  engagementData: EngagementData[];
  ratingTrend: MonthlyRatingData[];
  subjectDistribution: SubjectDistribution[];
  loading?: boolean;
}

const CHART_COLORS = ['#7C4DFF', '#00E5FF', '#FF6B6B', '#FFAB00', '#00E676', '#FF4081', '#536DFE'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="td-v2-chart-tooltip">
      <p className="td-v2-chart-tooltip__label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="td-v2-chart-tooltip__value" style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

export function TeacherAnalyticsCharts({
  weeklyData,
  engagementData,
  ratingTrend,
  subjectDistribution,
  loading,
}: TeacherAnalyticsChartsProps) {
  const hasData = weeklyData.length > 0 || engagementData.length > 0;

  // Generate placeholder data if empty
  const displayWeekly = useMemo(() => {
    if (weeklyData.some(d => d.lessons > 0)) return weeklyData;
    return weeklyData.length > 0
      ? weeklyData
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, date: '', lessons: 0 }));
  }, [weeklyData]);

  const displayEngagement = useMemo(() => {
    if (engagementData.some(d => d.bookings > 0)) return engagementData;
    return engagementData.length > 0
      ? engagementData
      : [1, 2, 3, 4].map(w => ({ week: `Week ${w}`, bookings: 0, completed: 0 }));
  }, [engagementData]);

  const displayRating = useMemo(() => {
    if (ratingTrend.some(d => d.avgRating > 0)) return ratingTrend;
    return ratingTrend.length > 0
      ? ratingTrend
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ month: m, avgRating: 0, reviewCount: 0 }));
  }, [ratingTrend]);

  const displaySubjects = useMemo(() => {
    if (subjectDistribution.length > 0) return subjectDistribution;
    return [{ subject: 'No data yet', count: 1, percentage: 100 }];
  }, [subjectDistribution]);

  if (loading) {
    return (
      <div className="td-v2-charts-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="td-v2-chart-card td-v2-chart-card--loading">
            <div className="td-v2-skeleton td-v2-skeleton--header" />
            <div className="td-v2-skeleton td-v2-skeleton--chart" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="td-v2-charts-grid">
      {/* Lessons This Week - Bar Chart */}
      <div className="td-v2-chart-card">
        <div className="td-v2-chart-card__header">
          <div className="td-v2-chart-card__icon td-v2-chart-card__icon--purple">
            <BookOpen size={16} />
          </div>
          <div>
            <h4>Lessons This Week</h4>
            <p>{hasData ? `${displayWeekly.reduce((s, d) => s + d.lessons, 0)} total` : 'No lessons yet'}</p>
          </div>
        </div>
        <div className="td-v2-chart-card__body">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={displayWeekly} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="lessons" fill="#7C4DFF" radius={[6, 6, 0, 0]} name="Lessons" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Engagement - Area Chart */}
      <div className="td-v2-chart-card">
        <div className="td-v2-chart-card__header">
          <div className="td-v2-chart-card__icon td-v2-chart-card__icon--cyan">
            <TrendingUp size={16} />
          </div>
          <div>
            <h4>Student Engagement</h4>
            <p>Bookings over 4 weeks</p>
          </div>
        </div>
        <div className="td-v2-chart-card__body">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={displayEngagement}>
              <defs>
                <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="bookings" stroke="#00E5FF" fill="url(#engagementGrad)" strokeWidth={2} name="Bookings" />
              <Area type="monotone" dataKey="completed" stroke="#00E676" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating Trend - Line Chart */}
      <div className="td-v2-chart-card">
        <div className="td-v2-chart-card__header">
          <div className="td-v2-chart-card__icon td-v2-chart-card__icon--gold">
            <Star size={16} />
          </div>
          <div>
            <h4>Rating Trend</h4>
            <p>Monthly average (6 months)</p>
          </div>
        </div>
        <div className="td-v2-chart-card__body">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={displayRating}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgRating" stroke="#FFAB00" strokeWidth={2.5} dot={{ r: 4, fill: '#FFAB00' }} name="Avg Rating" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Distribution - Donut Chart */}
      <div className="td-v2-chart-card">
        <div className="td-v2-chart-card__header">
          <div className="td-v2-chart-card__icon td-v2-chart-card__icon--pink">
            <PieIcon size={16} />
          </div>
          <div>
            <h4>Subject Distribution</h4>
            <p>{displaySubjects.length} subject{displaySubjects.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="td-v2-chart-card__body td-v2-chart-card__body--donut">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={displaySubjects}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="count"
                nameKey="subject"
                paddingAngle={3}
                stroke="none"
              >
                {displaySubjects.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} lessons`, name]}
                contentStyle={{
                  background: 'rgba(10,14,33,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="td-v2-chart-legend">
            {displaySubjects.slice(0, 4).map((s, i) => (
              <span key={s.subject} className="td-v2-chart-legend__item">
                <span className="td-v2-chart-legend__dot" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {s.subject}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
