import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, RefreshCw, Target, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { dktApi, getMasteryColor, getMasteryLabel, type AIInsights, type DailyReviewResponse, type KnowledgeMap } from '../services/api/dktApi';
import { loadLearningProfile } from '../utils/learningProfile';

type InsightsCache = {
  savedAt: string;
  data: AIInsights;
};

const INSIGHTS_CACHE_KEY = 'nerdx_ai_insights_cache_v1';
const INSIGHTS_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function loadCachedInsights(): AIInsights | null {
  try {
    const raw = localStorage.getItem(INSIGHTS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InsightsCache>;
    if (!parsed.savedAt || !parsed.data) return null;
    const savedAtMs = Date.parse(parsed.savedAt);
    if (!Number.isFinite(savedAtMs)) return null;
    if (Date.now() - savedAtMs > INSIGHTS_CACHE_TTL_MS) return null;
    return parsed.data as AIInsights;
  } catch {
    return null;
  }
}

function saveCachedInsights(data: AIInsights) {
  try {
    const payload: InsightsCache = { savedAt: new Date().toISOString(), data };
    localStorage.setItem(INSIGHTS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

function dktSubjectToTeacherSubject(subject: string): string {
  const s = (subject || '').toLowerCase();
  if (s.includes('math')) return 'O Level Mathematics';
  if (s.includes('bio')) return 'Biology';
  if (s.includes('chem')) return 'Chemistry';
  if (s.includes('phys')) return 'Physics';
  if (s.includes('eng')) return 'English';
  if (s.includes('computer')) return 'Computer Science';
  if (s.includes('geo')) return 'Geography';
  if (s.includes('history')) return 'History';
  if (s.includes('commerce')) return 'Commerce';
  return subject || 'O Level Mathematics';
}

export function ProgressPage() {
  const navigate = useNavigate();
  const profile = useMemo(() => loadLearningProfile(), []);

  const [insights, setInsights] = useState<AIInsights | null>(() => loadCachedInsights());
  const [insightsLoading, setInsightsLoading] = useState(insights == null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [dailyReview, setDailyReview] = useState<DailyReviewResponse>({ count: 0, reviews: [] });
  const [dailyReviewLoading, setDailyReviewLoading] = useState(true);
  const [knowledgeMap, setKnowledgeMap] = useState<KnowledgeMap | null>(null);
  const [knowledgeMapLoading, setKnowledgeMapLoading] = useState(true);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const refreshInsights = async (force = false) => {
    if (!force) {
      const cached = loadCachedInsights();
      if (cached) {
        setInsights(cached);
        setInsightsLoading(false);
        setInsightsError(null);
        return;
      }
    }

    setInsightsLoading(true);
    setInsightsError(null);
    const data = await dktApi.getAIInsights();
    if (!data) {
      setInsightsLoading(false);
      setInsightsError('Failed to load insights. Try again.');
      return;
    }
    setInsights(data);
    saveCachedInsights(data);
    setInsightsLoading(false);
  };

  const loadDailyReview = async () => {
    setDailyReviewLoading(true);
    const res = await dktApi.getDailyReview();
    setDailyReview(res);
    setDailyReviewLoading(false);
  };

  const loadKnowledgeMap = async () => {
    setKnowledgeMapLoading(true);
    const map = await dktApi.getKnowledgeMap();
    setKnowledgeMap(map);
    setKnowledgeMapLoading(false);
  };

  useEffect(() => {
    void refreshInsights(false);
    void loadDailyReview();
    void loadKnowledgeMap();
  }, []);

  const practice = (subject: string, topic?: string, skillName?: string) => {
    const teacherSubject = dktSubjectToTeacherSubject(subject);
    const preface = topic ? `Teach me ${topic}.` : `Teach me ${skillName || 'this topic'}.`;
    const initialMessage = `${preface} Explain briefly, then give 5 exam-style questions. Mark my answers and correct my mistakes.`;

    navigate('/app/teacher/chat', {
      state: {
        subject: teacherSubject,
        gradeLevel: profile.gradeLevel,
        topic: topic || undefined,
        initialMessage,
      },
    });
  };

  const sortedSkills = useMemo(() => {
    const skills = knowledgeMap?.skills ?? [];
    return [...skills].sort((a, b) => (a.mastery ?? 0) - (b.mastery ?? 0));
  }, [knowledgeMap?.skills]);

  const visibleSkills = showAllSkills ? sortedSkills : sortedSkills.slice(0, 18);

  const trendMax = useMemo(() => {
    const breakdown = insights?.weekly_trend?.daily_breakdown ?? [];
    return Math.max(1, ...breakdown.map((d) => d.count || 0));
  }, [insights?.weekly_trend?.daily_breakdown]);

  return (
    <div className="progress-page insights-page">
      <Link to="/app" className="back-link">
        <span>←</span> Back to Dashboard
      </Link>

      <div className="progress-card glass-card insights-card">
        <div className="progress-header insights-hero-header">
          <BarChart3 size={48} className="progress-icon" />
          <h1>AI Insights</h1>
          <p className="progress-message">
            Personalized guidance from your learning history. Grade level: <strong>{profile.gradeLevel}</strong>
          </p>
        </div>

        <div className="insights-hero-actions">
          <button
            type="button"
            className="insights-refresh-btn"
            onClick={() => refreshInsights(true)}
            disabled={insightsLoading}
            title="Refresh insights"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="insights-metrics">
          <div className="insights-metric">
            <span className="insights-metric-label">Health</span>
            <span className="insights-metric-value">{insights ? `${insights.health_score}/100` : '—'}</span>
          </div>
          <div className="insights-metric">
            <span className="insights-metric-label">Mastered</span>
            <span className="insights-metric-value">{insights ? insights.mastered_count : '—'}</span>
          </div>
          <div className="insights-metric">
            <span className="insights-metric-label">Learning</span>
            <span className="insights-metric-value">{insights ? insights.learning_count : '—'}</span>
          </div>
          <div className="insights-metric">
            <span className="insights-metric-label">Needs work</span>
            <span className="insights-metric-value">{insights ? insights.struggling_count : '—'}</span>
          </div>
        </div>

        {insightsError && <div className="insights-error">{insightsError}</div>}

        {insightsLoading ? (
          <div className="insights-loading">Loading insights…</div>
        ) : (
          insights?.personalized_message && (
            <div className="insights-message">
              <Flame size={18} />
              <span>{insights.personalized_message}</span>
            </div>
          )
        )}
      </div>

      <div className="insights-grid">
        <section className="glass-card insights-card insights-section">
          <div className="insights-section-head">
            <h2>Today’s Plan</h2>
            <span className="insights-section-meta">~{profile.dailyMinutes} min</span>
          </div>

          {!insights?.study_plan?.length ? (
            <p className="insights-empty">Practice a few questions to generate a plan.</p>
          ) : (
            <div className="insights-plan-list">
              {insights.study_plan.map((item, idx) => (
                <div key={`${item.action}-${idx}`} className={`insights-plan-item priority-${item.priority}`}>
                  <div className="insights-plan-title">
                    <Target size={16} />
                    <span>{item.action}</span>
                  </div>
                  <div className="insights-plan-desc">{item.description}</div>
                  <div className="insights-plan-meta">{item.estimated_time}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card insights-card insights-section">
          <div className="insights-section-head">
            <h2>Daily Review</h2>
            <span className="insights-section-meta">{dailyReview.count} due</span>
          </div>

          {dailyReviewLoading ? (
            <div className="insights-loading">Loading review queue…</div>
          ) : dailyReview.reviews.length === 0 ? (
            <p className="insights-empty">Nothing due today. Great work.</p>
          ) : (
            <div className="insights-review-list">
              {dailyReview.reviews.slice(0, 8).map((r) => (
                <div key={r.skill_id} className="insights-review-item">
                  <div className="insights-review-text">
                    <div className="insights-review-skill">{r.skill_name}</div>
                    <div className="insights-review-meta">
                      {r.subject} • {r.topic}
                    </div>
                  </div>
                  <button type="button" className="insights-action-btn" onClick={() => practice(r.subject, r.topic, r.skill_name)}>
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" className="insights-secondary-btn" onClick={() => loadDailyReview()} disabled={dailyReviewLoading}>
            Reload daily review
          </button>
        </section>
      </div>

      <section className="glass-card insights-card insights-section">
        <div className="insights-section-head">
          <h2>Focus Areas</h2>
          <span className="insights-section-meta">Practice these to level up</span>
        </div>

        {!insights?.focus_areas?.length ? (
          <p className="insights-empty">No focus areas yet. Keep practicing to unlock personalized focus.</p>
        ) : (
          <div className="insights-skill-list">
            {insights.focus_areas.map((s, idx) => (
              <div key={`${s.skill_name}-${idx}`} className="insights-skill-row">
                <div className="insights-skill-main">
                  <div className="insights-skill-top">
                    <span className="insights-skill-name">{s.skill_name}</span>
                    <span className="insights-skill-badge" style={{ color: getMasteryColor(s.mastery), borderColor: `${getMasteryColor(s.mastery)}55` }}>
                      {getMasteryLabel(s.mastery)} • {Math.round(s.mastery * 100)}%
                    </span>
                  </div>
                  <div className="insights-skill-meta">{s.subject} • {s.topic}</div>
                  <div className="insights-bar">
                    <div className="insights-bar-fill" style={{ width: `${Math.round(s.mastery * 100)}%`, backgroundColor: getMasteryColor(s.mastery) }} />
                  </div>
                </div>
                <button type="button" className="insights-action-btn" onClick={() => practice(s.subject, s.topic, s.skill_name)}>
                  Practice
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card insights-card insights-section">
        <div className="insights-section-head">
          <h2>Weekly Activity</h2>
          <span className="insights-section-meta">
            {insights?.weekly_trend ? `${insights.weekly_trend.total_questions} questions • ${insights.weekly_trend.accuracy}% accuracy` : '—'}
          </span>
        </div>

        {!insights?.weekly_trend?.daily_breakdown?.length ? (
          <p className="insights-empty">No activity yet. Do a short practice session to get started.</p>
        ) : (
          <div className="insights-trend">
            {insights.weekly_trend.daily_breakdown.map((d) => (
              <div key={d.date} className="insights-trend-day" title={`${d.date}: ${d.count} questions`}>
                <div className="insights-trend-bar" style={{ height: `${Math.round((Math.max(0, d.count) / trendMax) * 100)}%` }} />
                <div className="insights-trend-label">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card insights-card insights-section">
        <div className="insights-section-head">
          <h2>Knowledge Map</h2>
          <span className="insights-section-meta">
            {knowledgeMap ? `${knowledgeMap.total_skills} skills` : knowledgeMapLoading ? 'Loading…' : '—'}
          </span>
        </div>

        {knowledgeMapLoading ? (
          <div className="insights-loading">Loading knowledge map…</div>
        ) : !knowledgeMap ? (
          <div className="insights-error">
            <AlertTriangle size={16} /> Failed to load knowledge map.
          </div>
        ) : (
          <>
            <div className="insights-knowledge-summary">
              <div className="insights-chip">
                <CheckCircle2 size={14} /> {knowledgeMap.mastered_skills} mastered
              </div>
              <div className="insights-chip">
                <Target size={14} /> {knowledgeMap.learning_skills} learning
              </div>
              <div className="insights-chip">
                <AlertTriangle size={14} /> {knowledgeMap.struggling_skills} need work
              </div>
            </div>

            <div className="insights-skill-table">
              {visibleSkills.map((s) => (
                <div key={s.skill_id} className="insights-skill-table-row">
                  <div className="insights-skill-table-left">
                    <div className="insights-skill-table-name">{s.skill_name}</div>
                    <div className="insights-skill-table-meta">{s.subject} • {s.topic}</div>
                  </div>
                  <div className="insights-skill-table-right">
                    <div className="insights-bar small">
                      <div className="insights-bar-fill" style={{ width: `${Math.round((s.mastery ?? 0) * 100)}%`, backgroundColor: getMasteryColor(s.mastery ?? 0) }} />
                    </div>
                    <button type="button" className="insights-action-btn small" onClick={() => practice(s.subject, s.topic, s.skill_name)}>
                      Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sortedSkills.length > 18 && (
              <button type="button" className="insights-secondary-btn" onClick={() => setShowAllSkills((v) => !v)}>
                {showAllSkills ? 'Show less' : `Show all (${sortedSkills.length})`}
              </button>
            )}

            <button type="button" className="insights-secondary-btn" onClick={() => loadKnowledgeMap()} disabled={knowledgeMapLoading}>
              Reload knowledge map
            </button>
          </>
        )}

        <div className="insights-footer-note">
          Want a guided path? Go to <button type="button" className="insights-link-btn" onClick={() => navigate('/app/agents')}>Agent Hub</button> and start the Learning Coach.
        </div>
      </section>
    </div>
  );
}
