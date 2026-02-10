import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, RefreshCw, Save, SlidersHorizontal } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { accountApi, type UserPreferences } from '../../services/api/accountApi';

const SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', icon: 'Math' },
  { id: 'physics', name: 'Physics', icon: 'Physics' },
  { id: 'chemistry', name: 'Chemistry', icon: 'Chem' },
  { id: 'biology', name: 'Biology', icon: 'Bio' },
  { id: 'english', name: 'English', icon: 'Eng' },
  { id: 'history', name: 'History', icon: 'Hist' },
  { id: 'geography', name: 'Geography', icon: 'Geo' },
  { id: 'accounting', name: 'Accounting', icon: 'Acc' },
  { id: 'economics', name: 'Economics', icon: 'Econ' },
  { id: 'commerce', name: 'Commerce', icon: 'Comm' },
];

const DIFFICULTY_OPTIONS = [
  { id: 'easy', name: 'Easy', desc: 'Start with basics' },
  { id: 'medium', name: 'Medium', desc: 'Balanced challenge' },
  { id: 'hard', name: 'Hard', desc: 'Maximum challenge' },
  { id: 'adaptive', name: 'Adaptive', desc: 'AI adjusts to you' },
] as const;

const DEFAULT_PREFS: UserPreferences = {
  preferred_subjects: [],
  exam_level: 'O Level',
  target_exam_date: null,
  daily_question_goal: 10,
  study_time_goal_minutes: 30,
  difficulty_preference: 'adaptive',
  notification_reminders: true,
  notification_achievements: true,
  notification_tips: true,
  theme_preference: 'system',
  school_name: null,
  grade_level: null,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function LearningPreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverPrefs, setServerPrefs] = useState<UserPreferences | null>(null);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [examLevel, setExamLevel] = useState<'O Level' | 'A Level'>('O Level');
  const [dailyGoal, setDailyGoal] = useState(10);
  const [studyTimeGoal, setStudyTimeGoal] = useState(30);
  const [difficulty, setDifficulty] = useState<UserPreferences['difficulty_preference']>('adaptive');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [notificationReminders, setNotificationReminders] = useState(true);
  const [notificationAchievements, setNotificationAchievements] = useState(true);
  const [notificationTips, setNotificationTips] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const applyPrefsToForm = (prefs: UserPreferences) => {
    setSelectedSubjects(prefs.preferred_subjects || []);
    setExamLevel(prefs.exam_level || 'O Level');
    setDailyGoal(typeof prefs.daily_question_goal === 'number' ? prefs.daily_question_goal : 10);
    setStudyTimeGoal(typeof prefs.study_time_goal_minutes === 'number' ? prefs.study_time_goal_minutes : 30);
    setDifficulty((prefs.difficulty_preference || 'adaptive') as any);
    setSchoolName(prefs.school_name || '');
    setGradeLevel(prefs.grade_level || '');
    setNotificationReminders(prefs.notification_reminders ?? true);
    setNotificationAchievements(prefs.notification_achievements ?? true);
    setNotificationTips(prefs.notification_tips ?? true);
  };

  const loadData = useCallback(async () => {
    try {
      const data = await accountApi.getPreferences();
      const prefs = data ?? DEFAULT_PREFS;
      setServerPrefs(prefs);
      applyPrefsToForm(prefs);
    } catch {
      setServerPrefs(DEFAULT_PREFS);
      applyPrefsToForm(DEFAULT_PREFS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast('Updated');
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => (prev.includes(subjectId) ? prev.filter((s) => s !== subjectId) : [...prev, subjectId]));
  };

  const currentPrefs: UserPreferences = useMemo(
    () => ({
      ...(serverPrefs ?? DEFAULT_PREFS),
      preferred_subjects: selectedSubjects,
      exam_level: examLevel,
      daily_question_goal: clamp(dailyGoal, 5, 100),
      study_time_goal_minutes: clamp(studyTimeGoal, 10, 300),
      difficulty_preference: difficulty,
      school_name: schoolName.trim() ? schoolName.trim() : null,
      grade_level: gradeLevel.trim() ? gradeLevel.trim() : null,
      notification_reminders: notificationReminders,
      notification_achievements: notificationAchievements,
      notification_tips: notificationTips,
      theme_preference: (serverPrefs?.theme_preference ?? 'system') as any,
    }),
    [
      dailyGoal,
      difficulty,
      examLevel,
      gradeLevel,
      notificationAchievements,
      notificationReminders,
      notificationTips,
      schoolName,
      selectedSubjects,
      serverPrefs,
      studyTimeGoal,
    ]
  );

  const hasChanges = useMemo(() => {
    if (!serverPrefs) return true;
    return JSON.stringify(currentPrefs) !== JSON.stringify(serverPrefs);
  }, [currentPrefs, serverPrefs]);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await accountApi.updatePreferences(currentPrefs);
      const next = updated ?? currentPrefs;
      setServerPrefs(next);
      applyPrefsToForm(next);
      showToast('Saved');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="preferences-page">
      <FloatingParticles count={10} />

      {toast && (
        <div className="preferences-toast" role="status">
          {toast}
        </div>
      )}

      <header className="preferences-header">
        <Link to="/app/account" className="back-link">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <div className="preferences-title">
          <h1>
            <SlidersHorizontal size={20} /> Learning Preferences
          </h1>
          <p>Study goals, difficulty, and reminders</p>
        </div>
        <div className="preferences-actions">
          <button type="button" className="preferences-btn" onClick={onRefresh} disabled={refreshing || loading}>
            <RefreshCw size={16} /> {refreshing ? 'Refreshing' : 'Refresh'}
          </button>
          <button type="button" className="preferences-btn primary" onClick={save} disabled={saving || loading || !hasChanges}>
            <Save size={16} /> {saving ? 'Saving' : 'Save'}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="preferences-loading">Loading preferences...</div>
      ) : (
        <div className="preferences-grid">
          <section className="preferences-card">
            <h2>Exam level</h2>
            <div className="preferences-toggle">
              <button type="button" className={examLevel === 'O Level' ? 'active' : ''} onClick={() => setExamLevel('O Level')}>
                O Level
              </button>
              <button type="button" className={examLevel === 'A Level' ? 'active' : ''} onClick={() => setExamLevel('A Level')}>
                A Level
              </button>
            </div>
          </section>

          <section className="preferences-card">
            <h2>Preferred subjects</h2>
            <p className="preferences-subtitle">Choose what you want to focus on</p>
            <div className="preferences-subjects">
              {SUBJECTS.map((s) => {
                const active = selectedSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`preferences-subject ${active ? 'active' : ''}`}
                    onClick={() => toggleSubject(s.id)}
                  >
                    <span className="preferences-subject-icon">{s.icon}</span>
                    <span className="preferences-subject-name">{s.name}</span>
                    {active && (
                      <span className="preferences-subject-check">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="preferences-card">
            <h2>Daily goals</h2>
            <div className="preferences-goals">
              <div className="preferences-goal">
                <div className="preferences-goal-info">
                  <div className="preferences-goal-label">Questions per day</div>
                  <div className="preferences-goal-desc">How many questions you aim to answer</div>
                </div>
                <div className="preferences-stepper">
                  <button type="button" onClick={() => setDailyGoal((v) => clamp(v - 5, 5, 100))}>
                    -
                  </button>
                  <span>{dailyGoal}</span>
                  <button type="button" onClick={() => setDailyGoal((v) => clamp(v + 5, 5, 100))}>
                    +
                  </button>
                </div>
              </div>

              <div className="preferences-goal">
                <div className="preferences-goal-info">
                  <div className="preferences-goal-label">Study time (minutes)</div>
                  <div className="preferences-goal-desc">Target daily study duration</div>
                </div>
                <div className="preferences-stepper">
                  <button type="button" onClick={() => setStudyTimeGoal((v) => clamp(v - 10, 10, 300))}>
                    -
                  </button>
                  <span>{studyTimeGoal}</span>
                  <button type="button" onClick={() => setStudyTimeGoal((v) => clamp(v + 10, 10, 300))}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="preferences-card">
            <h2>Difficulty</h2>
            <div className="preferences-difficulty">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`preferences-difficulty-opt ${difficulty === opt.id ? 'active' : ''}`}
                  onClick={() => setDifficulty(opt.id as any)}
                >
                  <div className="preferences-difficulty-name">{opt.name}</div>
                  <div className="preferences-difficulty-desc">{opt.desc}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="preferences-card">
            <h2>School and grade</h2>
            <div className="preferences-form">
              <label className="preferences-label">
                School name (optional)
                <input className="preferences-input" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Example: Mufakose High School" />
              </label>
              <label className="preferences-label">
                Grade level (optional)
                <input className="preferences-input" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="Example: Form 3" />
              </label>
            </div>
          </section>

          <section className="preferences-card">
            <h2>Notifications</h2>
            <div className="preferences-switches">
              <label className="preferences-switch">
                <input type="checkbox" checked={notificationReminders} onChange={(e) => setNotificationReminders(e.target.checked)} />
                <span>Study reminders</span>
              </label>
              <label className="preferences-switch">
                <input type="checkbox" checked={notificationAchievements} onChange={(e) => setNotificationAchievements(e.target.checked)} />
                <span>Achievements</span>
              </label>
              <label className="preferences-switch">
                <input type="checkbox" checked={notificationTips} onChange={(e) => setNotificationTips(e.target.checked)} />
                <span>Tips</span>
              </label>
            </div>
            <div className="preferences-note">
              Web push notifications are optional later; these settings sync with your account.
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

