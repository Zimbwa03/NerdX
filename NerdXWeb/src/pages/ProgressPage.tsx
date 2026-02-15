// Enhanced Student Progress Dashboard
// Premium glassmorphism design matching DashboardPage quality
// Loads live data from dashboardDataService + gamificationService for consistency
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CircleHelp,
  Flame,
  Gem,
  MapPinned,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { dktApi, type KnowledgeMap, type AIInsights } from '../services/api/dktApi';
import {
  gamificationService,
  type LevelInfo,
  type OverallStats,
  type Badge,
  type DailyActivity,
  type SubjectMasteryData,
} from '../services/gamificationService';
import { fetchDashboardData, type DashboardData } from '../services/dashboardDataService';

// ============= SVG COMPONENTS =============

function LevelRingSVG({ level, currentXP, xpForNextLevel, rank, rankIcon }: LevelInfo) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = xpForNextLevel > 0 ? Math.min(currentXP / xpForNextLevel, 1) : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="progress-level-ring">
      <svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle stroke="rgba(255,255,255,0.15)" fill="transparent" strokeWidth={stroke}
          r={normalizedRadius} cx={radius} cy={radius} />
        <circle className="level-ring-progress" stroke="url(#xpGradient)" fill="transparent"
          strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }} r={normalizedRadius} cx={radius} cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`} />
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <text x={radius} y={radius - 10} textAnchor="middle" className="level-ring-number"
          fill="white" fontSize="32" fontWeight="bold">{level}</text>
        <text x={radius} y={radius + 14} textAnchor="middle" fill="rgba(255,255,255,0.85)"
          fontSize="11" fontWeight="500">LEVEL</text>
      </svg>
      <div className="level-ring-info">
        <span className="rank-icon">{rankIcon}</span>
        <span className="rank-name">{rank}</span>
      </div>
    </div>
  );
}

function WeeklyActivityChart({ data }: { data: DailyActivity[] }) {
  const maxVal = Math.max(...data.map(d => d.questionsAnswered), 5);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const barWidth = 36;
  const gap = 12;
  const chartHeight = 160;
  const chartWidth = data.length * (barWidth + gap);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="weekly-chart-container">
      <svg width="100%" viewBox={`0 0 ${chartWidth + 20} ${chartHeight + 40}`} preserveAspectRatio="xMidYMid meet">
        {data.map((d, i) => {
          const barH = maxVal > 0 ? (d.questionsAnswered / maxVal) * chartHeight : 0;
          const x = 10 + i * (barWidth + gap);
          const y = chartHeight - barH;
          const accuracy = d.questionsAnswered > 0 ? Math.round((d.correctAnswers / d.questionsAnswered) * 100) : 0;
          const fill = d.questionsAnswered === 0 ? 'rgba(148,163,184,0.25)' :
            accuracy >= 70 ? 'url(#barGreen)' : 'url(#barAmber)';
          return (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={barWidth} height={Math.max(barH, 3)} rx={6} fill={fill}
                className="weekly-bar" style={{ animationDelay: `${i * 80}ms` }} />
              <text x={x + barWidth / 2} y={chartHeight + 18} textAnchor="middle"
                fill="var(--text-secondary, #94A3B8)" fontSize="11" fontWeight="500">
                {dayLabels[i] || ''}
              </text>
              {hoveredIdx === i && (
                <g>
                  <rect x={x - 20} y={Math.max(y - 46, 0)} width={barWidth + 40} height={40} rx={8}
                    fill="var(--card-bg, #1E293B)" stroke="var(--border-color, #334155)" />
                  <text x={x + barWidth / 2} y={Math.max(y - 28, 14)} textAnchor="middle"
                    fill="var(--text-primary, #F1F5F9)" fontSize="11" fontWeight="bold">
                    {d.questionsAnswered} Q&apos;s
                  </text>
                  <text x={x + barWidth / 2} y={Math.max(y - 12, 30)} textAnchor="middle"
                    fill={accuracy >= 70 ? '#22C55E' : '#F59E0B'} fontSize="10">
                    {accuracy}% acc
                  </text>
                </g>
              )}
            </g>
          );
        })}
        <defs>
          <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="barAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function WeeklyMomentumChart({ data }: { data: DailyActivity[] }) {
  const safeData = data.length > 0 ? data : Array.from({ length: 7 }, () => ({ questionsAnswered: 0, correctAnswers: 0 } as DailyActivity));
  const values = safeData.map((d) => d.questionsAnswered);
  const maxVal = Math.max(...values, 1);

  const width = 420;
  const height = 190;
  const padX = 24;
  const padY = 20;
  const baseY = height - 30;
  const graphHeight = baseY - padY;
  const stepX = safeData.length > 1 ? (width - padX * 2) / (safeData.length - 1) : 0;

  const points = safeData.map((item, idx) => {
    const x = padX + idx * stepX;
    const y = padY + ((maxVal - item.questionsAnswered) / maxVal) * graphHeight;
    return { x, y };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padX} ${baseY} L ${points[0]?.x ?? padX} ${baseY} Z`;
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="momentum-chart-wrap">
      <svg className="momentum-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="momentumAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(41,121,255,0.42)" />
            <stop offset="100%" stopColor="rgba(41,121,255,0.03)" />
          </linearGradient>
          <linearGradient id="momentumLineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2979FF" />
            <stop offset="100%" stopColor="#00E676" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((tick) => {
          const y = padY + (graphHeight / 3) * tick;
          return (
            <line
              key={tick}
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="rgba(148,163,184,0.2)"
              strokeDasharray="4 6"
            />
          );
        })}

        <path d={areaPath} fill="url(#momentumAreaFill)" />
        <path d={linePath} fill="none" stroke="url(#momentumLineStroke)" strokeWidth="3" strokeLinecap="round" />

        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#0F172A" stroke="#60A5FA" strokeWidth="2" />
            <text x={p.x} y={baseY + 18} textAnchor="middle" className="momentum-chart-label">
              {dayLabels[idx]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function SubjectPerformanceTable({ subjects }: { subjects: SubjectMasteryData[] }) {
  const rows = [...subjects].sort((a, b) => b.mastery - a.mastery).slice(0, 6);

  return (
    <div className="performance-table-wrap">
      <table className="performance-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Mastery</th>
            <th>Skills</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((subject) => {
            const status = subject.mastery >= 75 ? 'Advanced' : subject.mastery >= 50 ? 'Building' : 'Needs Focus';
            const statusClass = subject.mastery >= 75 ? 'status-advanced' : subject.mastery >= 50 ? 'status-building' : 'status-focus';
            return (
              <tr key={subject.subject}>
                <td>{subject.displayName}</td>
                <td>
                  <div className="table-mastery-cell">
                    <span>{subject.mastery}%</span>
                    <div className="table-mastery-track">
                      <span style={{ width: `${subject.mastery}%`, background: subject.color }} />
                    </div>
                  </div>
                </td>
                <td>{subject.masteredSkills}/{subject.skillsCount}</td>
                <td><span className={`performance-status ${statusClass}`}>{status}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DonutChart({ mastery, color, icon, displayName }: SubjectMasteryData) {
  const r = 32;
  const stroke = 7;
  const nr = r - stroke;
  const circ = nr * 2 * Math.PI;
  const offset = circ - (mastery / 100) * circ;

  return (
    <div className="donut-chart-card">
      <svg height={r * 2} width={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`}>
        <circle stroke="rgba(148,163,184,0.15)" fill="transparent" strokeWidth={stroke} r={nr} cx={r} cy={r} />
        <circle stroke={color} fill="transparent" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`} style={{ strokeDashoffset: offset }}
          r={nr} cx={r} cy={r} transform={`rotate(-90 ${r} ${r})`}
          className="donut-ring-progress" />
        <text x={r} y={r + 4} textAnchor="middle" fill="var(--text-primary, white)"
          fontSize="13" fontWeight="bold">{mastery}%</text>
      </svg>
      <div className="donut-label">
        <span className="donut-icon">{icon}</span>
        <span className="donut-name">{displayName}</span>
      </div>
    </div>
  );
}

function StreakCalendar({ history, streak }: { history: boolean[]; streak: number }) {
  return (
    <div className="streak-calendar-section">
      <div className="streak-header">
        <span className="streak-fire"><Flame size={16} /></span>
        <span className="streak-num">{streak}</span>
        <span className="streak-label">day streak</span>
      </div>
      <div className="streak-grid">
        {history.map((active, i) => (
          <div key={i} className={`streak-day ${active ? 'streak-active' : ''}`}
            title={`${30 - i} days ago`} />
        ))}
      </div>
      <div className="streak-legend">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const rarityColors: Record<string, string> = {
    common: '#94A3B8', rare: '#3B82F6', epic: '#A855F7', legendary: '#F59E0B',
  };
  return (
    <div className={`badge-card ${badge.isUnlocked ? 'unlocked' : 'locked'}`}
      style={{ borderColor: badge.isUnlocked ? rarityColors[badge.rarity] : undefined }}>
      <span className="badge-icon">{badge.icon}</span>
      <span className="badge-name">{badge.name}</span>
      <span className="badge-desc">{badge.description}</span>
      <span className="badge-rarity" style={{ color: rarityColors[badge.rarity] }}>
        {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
      </span>
    </div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const r = 50;
  const stroke = 8;
  const nr = r - stroke;
  const halfCirc = nr * Math.PI;
  const offset = halfCirc - (score / 100) * halfCirc;
  const gaugeColor = score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <svg height={r + 10} width={r * 2} viewBox={`0 0 ${r * 2} ${r + 10}`}>
      <path d={`M ${stroke} ${r} A ${nr} ${nr} 0 0 1 ${r * 2 - stroke} ${r}`}
        fill="transparent" stroke="rgba(148,163,184,0.2)" strokeWidth={stroke} strokeLinecap="round" />
      <path d={`M ${stroke} ${r} A ${nr} ${nr} 0 0 1 ${r * 2 - stroke} ${r}`}
        fill="transparent" stroke={gaugeColor} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${halfCirc} ${halfCirc}`} style={{ strokeDashoffset: offset }}
        className="gauge-progress" />
      <text x={r} y={r - 4} textAnchor="middle" fill="var(--text-primary, white)"
        fontSize="22" fontWeight="bold">{score}</text>
      <text x={r} y={r + 10} textAnchor="middle" fill="var(--text-secondary, #94A3B8)"
        fontSize="9">HEALTH SCORE</text>
    </svg>
  );
}

// Level progress bar component matching dashboard sidebar style
function LevelProgressSection({ levels }: { levels: DashboardData['levels'] }) {
  return (
    <div className="progress-levels-section">
      {levels.map((level) => {
        const barColor = level.percent >= 100 ? '#22C55E' :
          level.percent >= 50 ? 'linear-gradient(90deg, #7C4DFF, #00E676)' :
          level.percent > 0 ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' :
          'rgba(148,163,184,0.3)';
        return (
          <div key={level.label} className="progress-level-item">
            <div className="progress-level-meta">
              <span className="progress-level-name">{level.label}</span>
              <span className={`progress-level-status status-${level.status.toLowerCase().replace(' ', '-')}`}>
                {level.status}
              </span>
            </div>
            <div className="progress-level-bar-track">
              <div className="progress-level-bar-fill"
                style={{ width: `${level.percent}%`, background: barColor }} />
            </div>
            <span className="progress-level-pct">{level.percent}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ============= MAIN PAGE =============

export function ProgressPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [streakHistory, setStreakHistory] = useState<boolean[]>(Array(30).fill(false));
  const [subjectMastery, setSubjectMastery] = useState<SubjectMasteryData[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [knowledgeMap, setKnowledgeMap] = useState<KnowledgeMap | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Sync gamification data with backend, passing userId for Supabase sync
      const progress = await gamificationService.syncWithBackend(user?.id);

      // Load gamification data
      setLevelInfo(gamificationService.getLevelInfo(progress));
      setOverallStats(gamificationService.getOverallStats(progress));
      setBadges(gamificationService.getAllBadges(progress));
      setWeeklyActivity(gamificationService.getWeeklyActivity(progress));
      setStreakHistory(gamificationService.getStreakHistory(progress));
      setSubjectMastery(gamificationService.getDefaultSubjectData());

      // Load API data + dashboard data in parallel
      const [insightsData, kmData, dbData] = await Promise.all([
        dktApi.getAIInsights().catch(() => null),
        dktApi.getKnowledgeMap().catch(() => null),
        user?.id ? fetchDashboardData(user.id).catch(() => null) : Promise.resolve(null),
      ]);

      setAiInsights(insightsData);
      setKnowledgeMap(kmData);
      setDashboardData(dbData);

      // Update subject mastery from knowledge map if available
      if (kmData?.skills) {
        const subjects = gamificationService.getDefaultSubjectData();
        const skillsBySubject = new Map<string, { mastered: number; total: number; sumMastery: number }>();

        kmData.skills.forEach(skill => {
          const subj = (skill.subject || 'mathematics').toLowerCase();
          const entry = skillsBySubject.get(subj) || { mastered: 0, total: 0, sumMastery: 0 };
          entry.total++;
          entry.sumMastery += skill.mastery;
          if (skill.mastery_level >= 0.7) entry.mastered++;
          skillsBySubject.set(subj, entry);
        });

        const updated = subjects.map(s => {
          const data = skillsBySubject.get(s.subject);
          if (data && data.total > 0) {
            return {
              ...s,
              mastery: Math.round((data.sumMastery / data.total) * 100),
              skillsCount: data.total,
              masteredSkills: data.mastered,
            };
          }
          return s;
        });
        setSubjectMastery(updated);
      }
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  // Derived values - use dashboardData health_score for consistency with dashboard
  const healthScore = useMemo(() => {
    // Prefer dashboard data for consistency
    if (dashboardData?.insights.masteryScore) return dashboardData.insights.masteryScore;
    if (!aiInsights) return 0;
    const { mastered_count = 0, learning_count = 0, struggling_count = 0 } = aiInsights;
    const total = mastered_count + learning_count + struggling_count;
    return total > 0 ? Math.round(((mastered_count + learning_count * 0.5) / total) * 100) : 50;
  }, [aiInsights, dashboardData]);

  const unlockedBadges = useMemo(() => badges.filter(b => b.isUnlocked), [badges]);
  const lockedBadges = useMemo(() => badges.filter(b => !b.isUnlocked), [badges]);
  const displayBadges = showAllBadges ? badges : [...unlockedBadges.slice(0, 6), ...lockedBadges.slice(0, 4)];

  const kmSkills = useMemo(() => {
    if (!knowledgeMap?.skills) return { mastered: 0, learning: 0, needsWork: 0, all: [] as KnowledgeMap['skills'] };
    const mastered = knowledgeMap.skills.filter(s => s.mastery_level >= 0.7).length;
    const learning = knowledgeMap.skills.filter(s => s.mastery_level >= 0.3 && s.mastery_level < 0.7).length;
    const needsWork = knowledgeMap.skills.filter(s => s.mastery_level < 0.3).length;
    return { mastered, learning, needsWork, all: knowledgeMap.skills };
  }, [knowledgeMap]);

  // Level progress from dashboard data for consistency
  const levelProgress = dashboardData?.levels || [
    { label: 'Foundation', percent: 0, status: 'Locked' },
    { label: 'Core Skills', percent: 0, status: 'Locked' },
    { label: 'Exam Readiness', percent: 0, status: 'Locked' },
    { label: 'Top Performer', percent: 0, status: 'Locked' },
  ];

  const weeklyOverview = useMemo(() => {
    const totals = weeklyActivity.reduce((acc, day) => {
      acc.questions += day.questionsAnswered;
      acc.correct += day.correctAnswers;
      if (day.questionsAnswered > 0) acc.activeDays += 1;
      return acc;
    }, { questions: 0, correct: 0, activeDays: 0 });

    const avgPerDay = totals.activeDays > 0 ? Math.round(totals.questions / totals.activeDays) : 0;
    const accuracy = totals.questions > 0 ? Math.round((totals.correct / totals.questions) * 100) : 0;

    return {
      totalQuestions: totals.questions,
      totalCorrect: totals.correct,
      activeDays: totals.activeDays,
      avgPerDay,
      accuracy,
    };
  }, [weeklyActivity]);

  if (isLoading) {
    return (
      <div className="progress-dashboard loading-state">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-dashboard progress-dashboard--premium">
      {/* === Hero Section with gradient backdrop === */}
      <section className="progress-hero progress-hero--glass">
        <div className="hero-gradient" />
        <div className="hero-content">
          {levelInfo && <LevelRingSVG {...levelInfo} />}
          <div className="hero-xp-info">
            <div className="xp-bar-track">
              <div className="xp-bar-fill"
                style={{ width: `${levelInfo ? (levelInfo.currentXP / levelInfo.xpForNextLevel) * 100 : 0}%` }} />
            </div>
            <p className="xp-text">
              {levelInfo?.currentXP ?? 0} / {levelInfo?.xpForNextLevel ?? 100} XP to Level {(levelInfo?.level ?? 0) + 1}
            </p>
            <p className="hero-greeting">Keep going, {user?.name || 'Student'}!</p>
          </div>
        </div>
      </section>

      {/* === Quick Stats Grid with glass cards === */}
      <section className="stats-grid stats-grid--glass">
        <div className="stat-card stat-streak glass-stat">
          <span className="stat-icon"><Flame size={22} /></span>
          <span className="stat-value">{overallStats?.streak ?? 0}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-card stat-accuracy glass-stat">
          <span className="stat-icon"><BarChart3 size={22} /></span>
          <span className="stat-value">{overallStats?.accuracy ?? 0}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
        <div className="stat-card stat-questions glass-stat">
          <span className="stat-icon"><CircleHelp size={22} /></span>
          <span className="stat-value">{overallStats?.totalQuestions ?? 0}</span>
          <span className="stat-label">Questions</span>
        </div>
        <div className="stat-card stat-xp glass-stat">
          <span className="stat-icon"><Gem size={22} /></span>
          <span className="stat-value">{overallStats?.totalXP ?? 0}</span>
          <span className="stat-label">Total XP</span>
        </div>
      </section>

      <section className="progress-analytics-grid section-card--fade-in">
        <article className="glass-card analytics-panel">
          <div className="section-title">
            <TrendingUp size={18} />
            <h3>Weekly Momentum</h3>
          </div>
          <p className="section-subtitle">Consistent dashboard-style activity tracking for the last 7 days</p>
          <div className="momentum-kpi-row">
            <div className="momentum-kpi">
              <span>Total Questions</span>
              <strong>{weeklyOverview.totalQuestions}</strong>
            </div>
            <div className="momentum-kpi">
              <span>Weekly Accuracy</span>
              <strong>{weeklyOverview.accuracy}%</strong>
            </div>
            <div className="momentum-kpi">
              <span>Active Days</span>
              <strong>{weeklyOverview.activeDays}/7</strong>
            </div>
            <div className="momentum-kpi">
              <span>Avg / Active Day</span>
              <strong>{weeklyOverview.avgPerDay}</strong>
            </div>
          </div>
          <WeeklyMomentumChart data={weeklyActivity} />
        </article>

        <article className="glass-card analytics-panel">
          <div className="section-title">
            <Target size={18} />
            <h3>Performance Board</h3>
          </div>
          <p className="section-subtitle">Top subjects, mastery progress, and skill coverage</p>
          <SubjectPerformanceTable subjects={subjectMastery} />
        </article>
      </section>

      {/* === Learning Level Progress (matches dashboard sidebar) === */}
      <section className="glass-card section-card section-card--fade-in">
        <div className="section-title">
          <TrendingUp size={18} />
          <h3>Your Learning Level</h3>
        </div>
        <p className="section-subtitle">Track your progression through mastery tiers</p>
        <LevelProgressSection levels={levelProgress} />
      </section>

      {/* === AI Insights Card with glass effect === */}
      <section className="insights-summary glass-card section-card--fade-in">
        <div className="insights-header-row">
          <div>
            <div className="section-title">
              <Brain size={18} />
              <h3>AI Learning Insights</h3>
            </div>
            {aiInsights?.personalized_message && (
              <p className="insights-message">{aiInsights.personalized_message}</p>
            )}
          </div>
          <HealthGauge score={healthScore} />
        </div>
        <div className="insights-counts">
          <div className="insights-count green">
            <span className="cnt-num">{aiInsights?.mastered_count ?? dashboardData?.aiInsights?.mastered_count ?? 0}</span>
            <span className="cnt-label">Mastered</span>
          </div>
          <div className="insights-count amber">
            <span className="cnt-num">{aiInsights?.learning_count ?? dashboardData?.aiInsights?.learning_count ?? 0}</span>
            <span className="cnt-label">Learning</span>
          </div>
          <div className="insights-count red">
            <span className="cnt-num">{aiInsights?.struggling_count ?? dashboardData?.aiInsights?.struggling_count ?? 0}</span>
            <span className="cnt-label">Needs Work</span>
          </div>
        </div>
        {aiInsights?.study_plan && aiInsights.study_plan.length > 0 && (
          <div className="insights-expand">
            <button className="expand-btn" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? 'Hide Study Plan' : 'View Study Plan'}
            </button>
            {showDetails && (
              <div className="study-plan-list">
                {aiInsights.study_plan.map((item, i) => (
                  <div key={i} className={`study-plan-item priority-${item.priority || 'medium'}`}>
                    <span
                      className={`plan-priority-dot ${
                        item.priority === 'high' ? 'is-high' : item.priority === 'low' ? 'is-low' : 'is-medium'
                      }`}
                    />
                    <div className="plan-content">
                      <span className="plan-action">{item.action}</span>
                      <span className="plan-desc">{item.description}</span>
                    </div>
                    <span className="plan-time">{item.estimated_time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* === Weekly Activity Chart === */}
      <section className="glass-card section-card section-card--fade-in">
        <div className="section-title">
          <BarChart3 size={18} />
          <h3>Weekly Activity</h3>
        </div>
        <p className="section-subtitle">Questions answered this week</p>
        <WeeklyActivityChart data={weeklyActivity} />
      </section>

      {/* === Subject Mastery === */}
      <section className="glass-card section-card section-card--fade-in">
        <div className="section-title">
          <BookOpen size={18} />
          <h3>Subject Mastery</h3>
        </div>
        <p className="section-subtitle">Your progress across subjects</p>
        <div className="mastery-grid">
          {subjectMastery.map(s => (
            <DonutChart key={s.subject} {...s} />
          ))}
        </div>
      </section>

      {/* === Streak Calendar === */}
      <section className="glass-card section-card section-card--fade-in">
        <div className="section-title">
          <Flame size={18} />
          <h3>Consistency Tracker</h3>
        </div>
        <StreakCalendar history={streakHistory} streak={overallStats?.streak ?? 0} />
      </section>

      {/* === Focus Areas === */}
      {aiInsights?.focus_areas && aiInsights.focus_areas.length > 0 && (
        <section className="glass-card section-card section-card--fade-in">
          <div className="section-title">
            <Target size={18} />
            <h3>Focus Areas</h3>
          </div>
          <p className="section-subtitle">Skills that need your attention</p>
          <div className="focus-areas-list">
            {aiInsights.focus_areas.map((area, i) => (
              <div key={i} className="focus-area-item">
                <div className="focus-info">
                  <span className="focus-name">{area.skill_name || area.topic}</span>
                  <span className="focus-level">{area.status || 'Learning'}</span>
                </div>
                <div className="focus-bar-track">
                  <div className="focus-bar-fill" style={{
                    width: `${(area.mastery || 0.3) * 100}%`,
                    background: (area.mastery || 0) >= 0.5 ? '#F59E0B' : '#EF4444',
                  }} />
                </div>
                <button className="focus-practice-btn" onClick={() => navigate('/app/teacher', {
                  state: { subject: area.subject || 'Mathematics', topic: area.skill_name || area.topic }
                })}>
                  Practice
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === Achievement Gallery === */}
      <section className="glass-card section-card section-card--fade-in">
        <div className="section-header-row">
          <div className="section-title">
            <Trophy size={18} />
            <h3>Achievements</h3>
          </div>
          <span className="badge-count">{unlockedBadges.length} / {badges.length} unlocked</span>
        </div>
        <div className="badge-gallery">
          {displayBadges.map(b => <BadgeCard key={b.id} badge={b} />)}
        </div>
        {badges.length > 10 && (
          <button className="show-all-btn" onClick={() => setShowAllBadges(!showAllBadges)}>
            {showAllBadges ? 'Show Less' : `Show All ${badges.length} Badges`}
          </button>
        )}
      </section>

      {/* === Knowledge Map === */}
      <section className="glass-card section-card section-card--fade-in">
        <div className="section-title">
          <MapPinned size={18} />
          <h3>Knowledge Map</h3>
        </div>
        <div className="km-summary">
          <div className="km-stat green"><span>{kmSkills.mastered}</span><label>Mastered</label></div>
          <div className="km-stat amber"><span>{kmSkills.learning}</span><label>Learning</label></div>
          <div className="km-stat red"><span>{kmSkills.needsWork}</span><label>Needs Work</label></div>
        </div>
        {kmSkills.all.length > 0 && (
          <div className="km-skills-table">
            {kmSkills.all.slice(0, 12).map((skill, i) => (
              <div key={i} className="km-skill-row">
                <span className="km-skill-name">{skill.skill_name}</span>
                <div className="km-bar-track">
                  <div className="km-bar-fill" style={{
                    width: `${skill.mastery_level * 100}%`,
                    background: skill.mastery_level >= 0.7 ? '#22C55E' :
                      skill.mastery_level >= 0.3 ? '#F59E0B' : '#EF4444',
                  }} />
                </div>
                <span className="km-pct">{Math.round(skill.mastery_level * 100)}%</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* === Lifetime Statistics === */}
      <section className="glass-card section-card lifetime-stats section-card--fade-in">
        <div className="section-title">
          <BarChart3 size={18} />
          <h3>Lifetime Statistics</h3>
        </div>
        <div className="lifetime-grid">
          <div className="lifetime-item glass-stat">
            <span className="lt-icon"><BookOpen size={22} /></span>
            <span className="lt-value">{overallStats?.totalQuizzes ?? 0}</span>
            <span className="lt-label">Quizzes Completed</span>
          </div>
          <div className="lifetime-item glass-stat">
            <span className="lt-icon"><Zap size={22} /></span>
            <span className="lt-value">{overallStats?.totalXP ?? 0}</span>
            <span className="lt-label">Total XP Earned</span>
          </div>
          <div className="lifetime-item glass-stat">
            <span className="lt-icon"><Target size={22} /></span>
            <span className="lt-value">{overallStats?.perfectScores ?? 0}</span>
            <span className="lt-label">Perfect Scores</span>
          </div>
          <div className="lifetime-item glass-stat">
            <span className="lt-icon"><Award size={22} /></span>
            <span className="lt-value">{overallStats?.longestStreak ?? 0}</span>
            <span className="lt-label">Longest Streak</span>
          </div>
        </div>
      </section>

      {/* === Motivational Footer === */}
      <section className="progress-footer">
        <div className="footer-gradient">
          <p className="footer-message">
            {(overallStats?.streak ?? 0) > 0
              ? `Amazing ${overallStats?.streak}-day streak! You're on fire!`
              : 'Start your learning journey today! Every question counts!'}
          </p>
          <button className="footer-cta" onClick={() => navigate('/app')}>
            Start Learning
          </button>
        </div>
      </section>
    </div>
  );
}
