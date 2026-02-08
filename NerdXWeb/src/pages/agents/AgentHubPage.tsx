import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Calculator, FlaskConical, BookOpen, ClipboardCheck, ClipboardList, GraduationCap, LineChart, PenLine, RefreshCw, Target } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { SubjectCard } from '../../components/SubjectCard';
import { GRADE_LEVELS } from '../../data/teacherConstants';
import { type LearningProfile, loadLearningProfile, saveLearningProfile } from '../../utils/learningProfile';
import { CUSTOM_AGENT_ICONS } from '../../utils/customAgentIcons';
import { CUSTOM_AGENTS_STORAGE_KEY, loadCustomAgents } from '../../utils/customAgents';
import { dktApi, type AIInsights, type DailyReviewResponse } from '../../services/api/dktApi';

type MissionTask = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedTime: string;
  subject: string;
  topic?: string;
  initialMessage: string;
};

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

function buildDailyMission(insights: AIInsights | null, review: DailyReviewResponse): MissionTask[] {
  const tasks: MissionTask[] = [];

  const plan = insights?.study_plan ?? [];
  if (plan.length > 0) {
    for (let i = 0; i < Math.min(3, plan.length); i += 1) {
      const item = plan[i];
      tasks.push({
        id: `plan-${i}`,
        priority: item.priority,
        title: item.action,
        description: item.description,
        estimatedTime: item.estimated_time,
        subject: 'Learning Coach',
        initialMessage: [
          'Act as my Learning Coach.',
          `Task: ${item.action}.`,
          item.description,
          'Teach briefly, then ask me questions and wait for my answers. Correct me and end with a 5-question checkpoint.',
        ].join('\n'),
      });
    }
    return tasks;
  }

  const due = review.reviews ?? [];
  if (due.length > 0) {
    for (let i = 0; i < Math.min(3, due.length); i += 1) {
      const item = due[i];
      tasks.push({
        id: `review-${item.skill_id}`,
        priority: 'high',
        title: `Review: ${item.skill_name}`,
        description: `${item.subject} - ${item.topic}`,
        estimatedTime: '8-12 min',
        subject: dktSubjectToTeacherSubject(item.subject),
        topic: item.topic,
        initialMessage: [
          `Quickly review ${item.topic}.`,
          'Give me a short summary, then 5 quick questions (mixed difficulty).',
          'Mark my answers and explain the correct reasoning.',
        ].join('\n'),
      });
    }
    return tasks;
  }

  const focus = insights?.focus_areas ?? [];
  for (let i = 0; i < Math.min(3, focus.length); i += 1) {
    const item = focus[i];
    const topic = item.topic || item.skill_name;
    tasks.push({
      id: `focus-${i}`,
      priority: item.mastery < 0.3 ? 'high' : 'medium',
      title: `Practice: ${item.skill_name}`,
      description: `${item.subject} - ${topic} (${Math.round(item.mastery * 100)}% mastery)`,
      estimatedTime: '15-20 min',
      subject: dktSubjectToTeacherSubject(item.subject),
      topic,
      initialMessage: [
        `Teach me ${topic}.`,
        'Explain briefly, then give me 5 exam-style questions.',
        'Mark my answers and correct my mistakes.',
      ].join('\n'),
    });
  }
  return tasks;
}

export function AgentHubPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LearningProfile>(() => loadLearningProfile());
  const [missionLoading, setMissionLoading] = useState(true);
  const [missionTasks, setMissionTasks] = useState<MissionTask[]>([]);
  const [missionHealthScore, setMissionHealthScore] = useState<number | null>(null);
  const [customAgents, setCustomAgents] = useState(() => loadCustomAgents());

  useEffect(() => {
    saveLearningProfile(profile);
  }, [profile]);

  useEffect(() => {
    const sync = () => setCustomAgents(loadCustomAgents());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CUSTOM_AGENTS_STORAGE_KEY) sync();
    };
    window.addEventListener('focus', sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const loadMission = useCallback(async () => {
    setMissionLoading(true);
    const [insights, review] = await Promise.all([dktApi.getAIInsights(), dktApi.getDailyReview()]);
    setMissionHealthScore(insights?.health_score ?? null);
    setMissionTasks(buildDailyMission(insights, review));
    setMissionLoading(false);
  }, []);

  useEffect(() => {
    void loadMission();
  }, [loadMission]);

  const startTask = (task: MissionTask) => {
    navigate('/app/teacher/chat', {
      state: {
        subject: task.subject,
        gradeLevel: profile.gradeLevel,
        topic: task.topic,
        initialMessage: task.initialMessage,
      },
    });
  };

  const startMission = () => {
    const list = missionTasks
      .slice(0, 3)
      .map((t, i) => `${i + 1}. ${t.title} (${t.estimatedTime})`)
      .join('\n');

    navigate('/app/teacher/chat', {
      state: {
        subject: 'Learning Coach',
        gradeLevel: profile.gradeLevel,
        initialMessage: [
          'Act as my Learning Coach.',
          `I have ${profile.dailyMinutes} minutes today.`,
          'My daily mission tasks are:',
          list || 'No tasks yet. Ask me 2 quick questions to assess my level, then build a plan.',
          'Guide me through them one-by-one with short explanations and quick tests. Start with task 1.',
        ].join('\n'),
      },
    });
  };

  const agents = useMemo(
    () => [
      {
        id: 'agent_builder',
        title: 'Build Agent',
        subtitle: 'Create your own subject tutor persona',
        icon: PenLine,
        from: '#111827',
        to: '#7C4DFF',
        onClick: () => navigate('/app/agents/builder'),
      },
      {
        id: 'learning_coach',
        title: 'Learning Coach',
        subtitle: 'Daily plan - accountability - mastery checks',
        icon: Sparkles,
        from: '#7C4DFF',
        to: '#00E676',
        onClick: () =>
          navigate('/app/teacher/chat', {
            state: {
              subject: 'Learning Coach',
              gradeLevel: profile.gradeLevel,
              initialMessage: `Act as my Learning Coach. Build a ${profile.dailyMinutes}-minute study plan for today using spaced revision and quick tests. Start by asking 2 questions to measure my level.`,
            },
          }),
      },
      {
        id: 'math_agent',
        title: 'Math Agent',
        subtitle: 'Step-by-step - practice - exam style',
        icon: Calculator,
        from: '#2979FF',
        to: '#1565C0',
        onClick: () =>
          navigate('/app/teacher/chat', {
            state: {
              subject: 'O Level Mathematics',
              gradeLevel: profile.gradeLevel,
              initialMessage:
                'Tutor me using the Socratic method. Explain briefly, then give 3 practice questions and mark my answers.',
            },
          }),
      },
      {
        id: 'science_agent',
        title: 'Science Agent',
        subtitle: 'Concepts - diagrams - past paper reasoning',
        icon: FlaskConical,
        from: '#00BCD4',
        to: '#0097A7',
        onClick: () =>
          navigate('/app/teacher', {
            state: { gradeLevel: profile.gradeLevel },
          }),
      },
      {
        id: 'science_proctor',
        title: 'Science Proctor',
        subtitle: 'Oral exam - marking - weak area drills',
        icon: ClipboardList,
        from: '#06B6D4',
        to: '#00E676',
        onClick: () =>
          navigate('/app/teacher/chat', {
            state: {
              subject: 'Combined Science',
              gradeLevel: profile.gradeLevel,
              initialMessage: [
                'You are my Science Proctor.',
                `Grade level: ${profile.gradeLevel}.`,
                `Time today: ${profile.dailyMinutes} minutes.`,
                '',
                'Rules:',
                '- Ask one question at a time and wait for my answer.',
                '- Mark my answer (correct/incorrect) with a short explanation.',
                '- Keep a running score and identify misconceptions.',
                '',
                'Start by asking:',
                '1) Which science: Biology, Chemistry, or Physics?',
                '2) Which exam: ZIMSEC or Cambridge?',
                'Then run a 10-question diagnostic and finish with a 3-step study plan.',
              ].join('\n'),
            },
          }),
      },
      {
        id: 'english_agent',
        title: 'English Agent',
        subtitle: 'Writing - comprehension - feedback',
        icon: BookOpen,
        from: '#FF9100',
        to: '#FF6D00',
        onClick: () =>
          navigate('/app/teacher/chat', {
            state: {
              subject: 'English',
              gradeLevel: profile.gradeLevel,
              initialMessage:
                'Coach my English writing. Ask me what task I have (essay, comprehension, summary), then help me plan, write, and improve with feedback.',
            },
          }),
      },
      {
        id: 'essay_marker',
        title: 'Essay Marker',
        subtitle: 'Grade - correct - improve your writing',
        icon: PenLine,
        from: '#FF9100',
        to: '#7C4DFF',
        onClick: () =>
          navigate('/app/teacher/chat', {
            state: {
              subject: 'English',
              gradeLevel: profile.gradeLevel,
              initialMessage: [
                'You are my Essay Marker.',
                `Grade level: ${profile.gradeLevel}.`,
                '',
                'First ask me for:',
                '- The essay question/prompt',
                '- The essay type (narrative/descriptive/argumentative/report/letter)',
                '- The marking scheme (if I have one)',
                '',
                'Then ask me to paste my essay (or upload images).',
                'When marking, do:',
                '1) A score with brief justification',
                '2) Strengths (max 3)',
                '3) Mistakes with corrections (grammar + structure)',
                '4) A rewritten improved paragraph',
                '5) 3 targeted practice tasks for tomorrow',
              ].join('\n'),
            },
          }),
      },
      {
        id: 'project_mentor',
        title: 'Project Mentor',
        subtitle: 'Plan - research - write - submit',
        icon: GraduationCap,
        from: '#14B8A6',
        to: '#3B82F6',
        onClick: () =>
          navigate('/app/teacher/chat', {
            state: {
              subject: 'Project Mentor',
              gradeLevel: profile.gradeLevel,
              initialMessage: [
                'You are my Project Mentor.',
                `Grade level: ${profile.gradeLevel}.`,
                '',
                'Start by asking 5 questions:',
                '1) Subject and topic area',
                '2) What the teacher wants (rubric/requirements)',
                '3) Deadline and length',
                '4) What work I have already done',
                '5) My weakest part (research/writing/structure/analysis)',
                '',
                'Then produce:',
                '- A clear project title',
                '- 3 research questions + hypothesis (if applicable)',
                '- A step-by-step plan with milestones',
                '- Evidence checklist (what to collect/prove)',
                '- A simple outline with headings',
                '- A reference list template',
                '',
                'After that, guide me step-by-step and ask for my input before writing big sections.',
              ].join('\n'),
            },
          }),
      },
      {
        id: 'exam_proctor',
        title: 'Exam Proctor',
        subtitle: 'Timed exam - mark - review mistakes',
        icon: ClipboardCheck,
        from: '#EF4444',
        to: '#B91C1C',
        onClick: () => navigate('/app/exam/setup'),
      },
      {
        id: 'insights',
        title: 'AI Insights',
        subtitle: 'Weak areas - daily review - progress map',
        icon: LineChart,
        from: '#a18cd1',
        to: '#8B7FD1',
        onClick: () => navigate('/app/progress'),
      },
      ...customAgents.map((a) => ({
        id: `custom_${a.id}`,
        title: a.title,
        subtitle: a.subtitle,
        icon: CUSTOM_AGENT_ICONS[a.iconKey] ?? Sparkles,
        from: a.gradientFrom,
        to: a.gradientTo,
        onClick: () =>
          navigate('/app/teacher/chat', {
            state: {
              subject: a.subject,
              gradeLevel: profile.gradeLevel,
              topic: a.topic || undefined,
              ...(a.sendMode === 'auto' ? { initialMessage: a.prompt } : { prefillMessage: a.prompt }),
            },
          }),
      })),
    ],
    [customAgents, navigate, profile.dailyMinutes, profile.gradeLevel]
  );

  return (
    <div className="agent-hub-page">
      <FloatingParticles count={16} />

      <header className="agent-hub-header">
        <Link to="/app" className="agent-hub-back">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <div className="agent-hub-title">
          <h1>Agent Hub</h1>
          <p>Choose a subject agent or your Learning Coach.</p>
        </div>
      </header>

      <section className="agent-hub-profile">
        <div className="agent-hub-profile-card">
          <div className="agent-hub-profile-head">
            <h2>Learning Profile</h2>
            <span className="agent-hub-profile-hint">Saved on this device</span>
          </div>

          <div className="agent-hub-profile-row">
            <div className="agent-hub-profile-label">Grade level</div>
            <div className="agent-hub-grade-buttons">
              {GRADE_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`agent-hub-grade-btn ${profile.gradeLevel === level ? 'active' : ''}`}
                  onClick={() => setProfile((p) => ({ ...p, gradeLevel: level }))}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="agent-hub-profile-row">
            <div className="agent-hub-profile-label">Daily study time</div>
            <div className="agent-hub-minutes">
              <input
                type="range"
                min={10}
                max={180}
                step={5}
                value={profile.dailyMinutes}
                onChange={(e) => setProfile((p) => ({ ...p, dailyMinutes: Number(e.target.value) }))}
                aria-label="Daily study minutes"
              />
              <div className="agent-hub-minutes-value">{profile.dailyMinutes} min</div>
            </div>
          </div>
        </div>
      </section>

      <section className="agent-hub-mission">
        <div className="agent-hub-mission-card">
          <div className="mission-head">
            <div className="mission-title">
              <h2>Daily Mission</h2>
              <p>Top 3 tasks based on your learning data</p>
            </div>
            <div className="mission-score">
              <span>Health</span>
              <strong>{missionHealthScore != null ? `${missionHealthScore}/100` : '--'}</strong>
            </div>
          </div>

          {missionLoading ? (
            <div className="mission-loading">Building your mission...</div>
          ) : missionTasks.length === 0 ? (
            <div className="mission-empty">
              Practice a quiz or a Teacher Mode session to generate your mission.
            </div>
          ) : (
            <div className="mission-task-list">
              {missionTasks.slice(0, 3).map((t) => (
                <div key={t.id} className={`mission-task priority-${t.priority}`}>
                  <div className="mission-task-left">
                    <div className="mission-task-top">
                      <div className="mission-priority">
                        <Target size={14} />
                        <span>{t.priority}</span>
                      </div>
                      <div className="mission-time">{t.estimatedTime}</div>
                    </div>
                    <div className="mission-task-title">{t.title}</div>
                    <div className="mission-task-desc">{t.description}</div>
                  </div>
                  <button type="button" className="mission-start-btn" onClick={() => startTask(t)}>
                    Start
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mission-actions">
            <button
              type="button"
              className="mission-primary-btn"
              onClick={startMission}
              disabled={missionLoading}
              title="Start the mission with your Learning Coach"
            >
              Start Mission
            </button>
            <button type="button" className="mission-secondary-btn" onClick={() => void loadMission()} disabled={missionLoading}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="agent-hub-grid">
        {agents.map((agent) => (
          <SubjectCard
            key={agent.id}
            title={agent.title}
            subtitle={agent.subtitle}
            icon={agent.icon}
            gradientFrom={agent.from}
            gradientTo={agent.to}
            onClick={agent.onClick}
          />
        ))}
      </section>
    </div>
  );
}
