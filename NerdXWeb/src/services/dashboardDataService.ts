// Dashboard Data Service
// Single point of data fetching for the student dashboard and progress page.
// Aggregates data from user_stats, dktApi, knowledgeMap, and Supabase tables.

import { supabase } from './supabase';
import { userStatsApi, type UserStats } from './api/userStatsApi';
import { dktApi, type AIInsights, type KnowledgeMap } from './api/dktApi';

// ============= TYPE DEFINITIONS =============

export interface InsightsSnapshot {
  masteryScore: number;       // 0-100
  studyStreak: number;        // days
  predictedGrade: string;     // e.g. "B+" or "A-"
  masteryTrend: string;       // e.g. "+6%"
  streakTrend: string;        // e.g. "+2"
  gradeTrend: string;         // e.g. "Rising"
}

export interface SubjectProgress {
  label: string;
  value: number;  // 0-100
  subject: string;
}

export interface LevelProgress {
  label: string;
  percent: number;
  status: string;
}

export interface RecommendedFocus {
  title: string;
  detail: string;
  tone: string;           // 'focus-high' | 'focus-med' | 'focus-low'
  studyTip: string;       // practical tip for how to improve
  subject: string;        // subject name
  accuracy: number;       // 0-100, how the student did on this topic
  attempts: number;       // total attempts on this topic
}

export interface WeeklyActivityDay {
  dayLabel: string;
  value: number;       // questions answered
  accuracy: number;    // 0-100
}

export interface DashboardData {
  insights: InsightsSnapshot;
  progress: {
    subjects: SubjectProgress[];
    nextStudyPlan: string;
  };
  levels: LevelProgress[];
  weeklyActivity: WeeklyActivityDay[];
  recommendedFocus: RecommendedFocus[];
  // Raw data for detailed views (Progress Page)
  aiInsights: AIInsights | null;
  knowledgeMap: KnowledgeMap | null;
  userStats: UserStats | null;
}

// ============= HELPERS =============

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDayLabel(date: Date): string {
  const dayIndex = date.getDay(); // 0=Sun, 1=Mon...
  const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return map[dayIndex];
}

function computePredictedGrade(masteryScore: number): string {
  if (masteryScore >= 90) return 'A*';
  if (masteryScore >= 80) return 'A';
  if (masteryScore >= 70) return 'B';
  if (masteryScore >= 60) return 'C';
  if (masteryScore >= 50) return 'D';
  if (masteryScore >= 40) return 'E';
  return 'U';
}

function computeGradeTrend(aiInsights: AIInsights | null): string {
  if (!aiInsights?.weekly_trend) return 'Stable';
  const { accuracy } = aiInsights.weekly_trend;
  if (accuracy >= 80) return 'Rising';
  if (accuracy >= 60) return 'Stable';
  return 'Needs Focus';
}

function computeLevelStatus(percent: number): string {
  if (percent >= 100) return 'Complete';
  if (percent >= 50) return 'In Progress';
  if (percent > 0) return 'Building';
  return 'Locked';
}

function buildSubjectProgress(knowledgeMap: KnowledgeMap | null): SubjectProgress[] {
  const defaultSubjects: SubjectProgress[] = [
    { label: 'Mathematics', value: 0, subject: 'mathematics' },
    { label: 'Biology', value: 0, subject: 'biology' },
    { label: 'Chemistry', value: 0, subject: 'chemistry' },
    { label: 'Physics', value: 0, subject: 'physics' },
    { label: 'English', value: 0, subject: 'english' },
    { label: 'Geography', value: 0, subject: 'geography' },
    { label: 'History', value: 0, subject: 'history' },
    { label: 'Commerce', value: 0, subject: 'commerce' },
  ];

  if (!knowledgeMap?.skills?.length) return defaultSubjects;

  // Group skills by subject and compute average mastery
  const skillsBySubject = new Map<string, { total: number; mastered: number; sumMastery: number }>();

  knowledgeMap.skills.forEach(skill => {
    const subj = (skill.subject || 'mathematics').toLowerCase();
    const entry = skillsBySubject.get(subj) || { total: 0, mastered: 0, sumMastery: 0 };
    entry.total++;
    // Handle both 'mastery' (typed) and 'mastery_level' (runtime API response)
    const masteryVal = skill.mastery ?? (skill as any).mastery_level ?? 0;
    entry.sumMastery += masteryVal;
    if (masteryVal >= 0.7) entry.mastered++;
    skillsBySubject.set(subj, entry);
  });

  return defaultSubjects.map(s => {
    const data = skillsBySubject.get(s.subject);
    if (data && data.total > 0) {
      return { ...s, value: Math.round((data.sumMastery / data.total) * 100) };
    }
    return s;
  });
}

// Study tip templates per subject with practical advice
const STUDY_TIPS: Record<string, string[]> = {
  mathematics: [
    'Rework each problem step by step on paper, not just in your head',
    'Focus on understanding the formula derivation, not just memorising it',
    'Try 5 similar practice problems before moving on to the next topic',
    'Draw diagrams to visualise the problem before solving',
  ],
  biology: [
    'Draw and label diagrams from memory, then check against your notes',
    'Create flashcards for key processes and terminology',
    'Summarise each process as a flow chart with arrows showing steps',
    'Read the textbook section, then close it and write what you remember',
  ],
  chemistry: [
    'Balance equations by hand and verify each element count',
    'Build a summary table of reactions, products, and conditions',
    'Practice drawing molecular structures to reinforce bonding concepts',
    'Use the periodic table to find patterns, do not just memorise facts',
  ],
  physics: [
    'Identify the given variables, the unknown, and the formula before solving',
    'Sketch a free-body diagram for every forces question',
    'Convert all units to SI before substituting into equations',
    'Relate each concept to a real-world example you can picture',
  ],
  english: [
    'Read the passage twice: first for meaning, then for detail questions',
    'Practice writing one paragraph answers using the PEE structure (Point, Evidence, Explain)',
    'Build a vocabulary list and use 3 new words in sentences daily',
    'Time yourself answering comprehension questions under exam conditions',
  ],
  geography: [
    'Use case studies to support every answer with named examples',
    'Draw sketch maps from memory to reinforce location knowledge',
    'Create comparison tables for contrasting concepts (e.g., rural vs urban)',
    'Practise interpreting graphs, maps, and data tables from past papers',
  ],
  history: [
    'Create a timeline of key dates and events for each topic',
    'Use source analysis practice: identify origin, purpose, and bias',
    'Write short essay plans with 3 key arguments per question',
    'Connect causes and consequences using a mind map',
  ],
  accounting: [
    'Practice the full double-entry process for each transaction type',
    'Work through a complete set of financial statements from start to finish',
    'Make a quick-reference list of common adjustments and their journal entries',
    'Check your trial balance after every 5 entries to catch errors early',
  ],
  commerce: [
    'Create concept maps linking trade, business, and economic terms',
    'Use real-world examples from Zimbabwe to illustrate each concept',
    'Practice definition questions by covering the answer and recalling',
    'Focus on understanding the "why" behind each business concept',
  ],
  computer_science: [
    'Trace through your algorithms by hand with sample data',
    'Write pseudocode before actual code to plan your logic',
    'Build a glossary of key terms and their precise definitions',
    'Practice past paper questions under timed conditions',
  ],
  default: [
    'Review your wrong answers and understand why each is incorrect',
    'Teach the concept to someone else to test your understanding',
    'Break the topic into small sub-topics and tackle one at a time',
    'Use active recall: close your notes and write everything you remember',
  ],
};

function getStudyTip(subject: string, accuracy: number): string {
  const subjectKey = subject.toLowerCase().replace(/\s+/g, '_');
  const tips = STUDY_TIPS[subjectKey] || STUDY_TIPS['default'];

  // Pick tip based on accuracy level for variety
  if (accuracy <= 20) return tips[0]; // most fundamental tip
  if (accuracy <= 40) return tips[1];
  if (accuracy <= 60) return tips[2];
  return tips[Math.floor(Math.random() * tips.length)];
}

function formatTopicName(topic: string): string {
  // Clean up topic names that may have underscores or long descriptions
  return topic
    .replace(/_/g, ' ')
    .replace(/\(.*?\)/g, '') // remove parenthetical descriptions for display
    .trim()
    .split(' ')
    .slice(0, 4) // keep first 4 words max for display
    .join(' ');
}

function computeEstimatedTime(accuracy: number, attempts: number): string {
  // Lower accuracy and fewer attempts = more time needed
  if (accuracy <= 20) return '30 min';
  if (accuracy <= 40) return '25 min';
  if (accuracy <= 60) return '20 min';
  return '15 min';
}

// Fetch the student's weakest topics from actual interaction data in Supabase
async function fetchWeakTopicsFromInteractions(userId: string): Promise<RecommendedFocus[]> {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const sinceDate = fourteenDaysAgo.toISOString();

    // Query the student's recent interactions grouped by topic
    const { data: interactions, error } = await supabase
      .from('student_interactions')
      .select('subject, topic, skill_id, response, time_spent_seconds')
      .eq('user_id', userId)
      .gte('timestamp', sinceDate)
      .order('timestamp', { ascending: false });

    if (error || !interactions?.length) {
      return [];
    }

    // Group by topic and compute accuracy
    const topicStats = new Map<string, {
      subject: string;
      topic: string;
      total: number;
      correct: number;
      totalTime: number;
    }>();

    interactions.forEach((row: any) => {
      const key = row.skill_id || `${row.subject}_${row.topic}`;
      const entry = topicStats.get(key) || {
        subject: row.subject || 'Unknown',
        topic: row.topic || 'Unknown',
        total: 0,
        correct: 0,
        totalTime: 0,
      };
      entry.total++;
      if (row.response === true) entry.correct++;
      entry.totalTime += row.time_spent_seconds || 0;
      topicStats.set(key, entry);
    });

    // Convert to array and sort by worst accuracy first (lowest correct rate)
    const weakTopics = Array.from(topicStats.values())
      .map(t => ({
        ...t,
        accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
      }))
      .filter(t => t.accuracy < 70) // Only topics where student is struggling
      .sort((a, b) => {
        // Primary: lowest accuracy first
        if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
        // Secondary: more attempts = more persistent problem
        return b.total - a.total;
      });

    // Build recommendations from actual weak topics
    return weakTopics.slice(0, 3).map(t => {
      const priority = t.accuracy <= 30 ? 'High' : t.accuracy <= 50 ? 'Medium' : 'Low';
      const tone = t.accuracy <= 30 ? 'focus-high' : t.accuracy <= 50 ? 'focus-med' : 'focus-low';
      const estTime = computeEstimatedTime(t.accuracy, t.total);

      return {
        title: formatTopicName(t.topic),
        detail: `${t.subject} - ${t.correct}/${t.total} correct (${t.accuracy}%) - ${estTime}`,
        tone,
        studyTip: getStudyTip(t.subject, t.accuracy),
        subject: t.subject,
        accuracy: t.accuracy,
        attempts: t.total,
      };
    });
  } catch (err) {
    console.warn('Failed to fetch weak topics:', err);
    return [];
  }
}

// Also check knowledge state for topics with low mastery that haven't been practiced recently
async function fetchLowMasteryTopics(userId: string): Promise<RecommendedFocus[]> {
  try {
    const { data: states, error } = await supabase
      .from('student_knowledge_state')
      .select('skill_id, mastery_probability, last_practiced_at')
      .eq('user_id', userId)
      .lt('mastery_probability', 0.4)
      .order('mastery_probability', { ascending: true })
      .limit(5);

    if (error || !states?.length) return [];

    // Look up skill names from skills_taxonomy
    const skillIds = states.map((s: any) => s.skill_id);
    const { data: skills } = await supabase
      .from('skills_taxonomy')
      .select('skill_id, skill_name, subject, topic')
      .in('skill_id', skillIds);

    const skillMap = new Map<string, { skill_name: string; subject: string; topic: string }>();
    if (skills) {
      skills.forEach((s: any) => skillMap.set(s.skill_id, s));
    }

    return states.slice(0, 2).map((state: any) => {
      const skill = skillMap.get(state.skill_id);
      const masteryPct = Math.round((state.mastery_probability || 0) * 100);
      const subject = skill?.subject || 'General';
      const topicName = skill?.topic || skill?.skill_name || state.skill_id.replace(/_/g, ' ');

      return {
        title: formatTopicName(topicName),
        detail: `${subject} - Mastery: ${masteryPct}% - Needs review`,
        tone: masteryPct <= 15 ? 'focus-high' : 'focus-med',
        studyTip: getStudyTip(subject, masteryPct),
        subject,
        accuracy: masteryPct,
        attempts: 0,
      };
    });
  } catch (err) {
    console.warn('Failed to fetch low mastery topics:', err);
    return [];
  }
}

// Build recommendations from real student data, with AI insights as fallback
async function buildRecommendedFocus(userId: string, aiInsights: AIInsights | null): Promise<RecommendedFocus[]> {
  // Primary: get weak topics from actual recent interactions
  const weakTopics = await fetchWeakTopicsFromInteractions(userId);

  if (weakTopics.length >= 3) {
    return weakTopics.slice(0, 3);
  }

  // Secondary: supplement with low-mastery knowledge state topics
  const lowMastery = await fetchLowMasteryTopics(userId);
  const combined = [...weakTopics, ...lowMastery];

  // Deduplicate by title
  const seen = new Set<string>();
  const unique = combined.filter(item => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (unique.length >= 1) {
    return unique.slice(0, 3);
  }

  // Tertiary fallback: use AI insights focus areas if available
  if (aiInsights?.focus_areas?.length) {
    return aiInsights.focus_areas.slice(0, 3).map(area => ({
      title: formatTopicName(area.skill_name || area.topic),
      detail: `${area.subject} - AI recommended focus`,
      tone: 'focus-high',
      studyTip: getStudyTip(area.subject, (area.mastery || 0) * 100),
      subject: area.subject,
      accuracy: Math.round((area.mastery || 0) * 100),
      attempts: 0,
    }));
  }

  // Final fallback: no data yet
  return [{
    title: 'Start Practicing',
    detail: 'Answer questions to unlock personalized recommendations',
    tone: 'focus-med',
    studyTip: 'Try answering 10 questions in any subject to get started. The AI will then identify your weak areas and create a tailored study plan for you.',
    subject: '',
    accuracy: 0,
    attempts: 0,
  }];
}

// ============= SUPABASE QUERIES =============

async function fetchWeeklyActivity(userId: string): Promise<WeeklyActivityDay[]> {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('student_weekly_activity')
      .select('activity_date, questions_answered, correct_answers')
      .eq('user_id', userId)
      .gte('activity_date', startDate)
      .lte('activity_date', endDate)
      .order('activity_date', { ascending: true });

    if (error) {
      console.warn('Failed to fetch weekly activity:', error);
    }

    // Build a 7-day array, filling gaps with zeros
    const activityMap = new Map<string, { questions: number; correct: number }>();
    if (data) {
      data.forEach((row: any) => {
        activityMap.set(row.activity_date, {
          questions: row.questions_answered || 0,
          correct: row.correct_answers || 0,
        });
      });
    }

    const result: WeeklyActivityDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = activityMap.get(dateStr);
      const questions = dayData?.questions || 0;
      const correct = dayData?.correct || 0;
      result.push({
        dayLabel: getDayLabel(d),
        value: questions,
        accuracy: questions > 0 ? Math.round((correct / questions) * 100) : 0,
      });
    }

    return result;
  } catch (err) {
    console.warn('Weekly activity fetch error:', err);
    // Return empty 7-day array
    const result: WeeklyActivityDay[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      result.push({ dayLabel: getDayLabel(d), value: 0, accuracy: 0 });
    }
    return result;
  }
}

async function fetchLevelProgress(userId: string): Promise<LevelProgress[]> {
  const defaultLevels: LevelProgress[] = [
    { label: 'Foundation', percent: 0, status: 'Locked' },
    { label: 'Core Skills', percent: 0, status: 'Locked' },
    { label: 'Exam Readiness', percent: 0, status: 'Locked' },
    { label: 'Top Performer', percent: 0, status: 'Locked' },
  ];

  try {
    const { data, error } = await supabase
      .from('student_level_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return defaultLevels;
    }

    return [
      { label: 'Foundation', percent: data.foundation_percent || 0, status: computeLevelStatus(data.foundation_percent || 0) },
      { label: 'Core Skills', percent: data.core_skills_percent || 0, status: computeLevelStatus(data.core_skills_percent || 0) },
      { label: 'Exam Readiness', percent: data.exam_readiness_percent || 0, status: computeLevelStatus(data.exam_readiness_percent || 0) },
      { label: 'Top Performer', percent: data.top_performer_percent || 0, status: computeLevelStatus(data.top_performer_percent || 0) },
    ];
  } catch (err) {
    console.warn('Level progress fetch error:', err);
    return defaultLevels;
  }
}

// Compute and upsert level progress based on knowledge state and user stats
export async function computeAndUpdateLevelProgress(
  userId: string,
  knowledgeMap: KnowledgeMap | null,
  userStats: UserStats | null,
): Promise<LevelProgress[]> {
  // Foundation: Based on total questions answered (0-50 questions = 0-100%)
  const questionsAnswered = userStats?.questions_answered || 0;
  const foundationPercent = Math.min(100, Math.round((questionsAnswered / 50) * 100));

  // Core Skills: Based on average mastery across all skills (need at least 60% mastery on 5+ skills)
  let coreSkillsPercent = 0;
  if (knowledgeMap?.skills?.length) {
    const avgMastery = knowledgeMap.skills.reduce((sum, s) => sum + (s.mastery ?? (s as any).mastery_level ?? 0), 0) / knowledgeMap.skills.length;
    coreSkillsPercent = Math.min(100, Math.round(avgMastery * 100 * 1.3)); // slight boost factor
  }

  // Exam Readiness: Based on how many skills are at proficient level (>= 0.6 mastery)
  let examReadinessPercent = 0;
  if (knowledgeMap?.skills?.length) {
    const proficientSkills = knowledgeMap.skills.filter(s => (s.mastery ?? (s as any).mastery_level ?? 0) >= 0.6).length;
    const totalSkills = knowledgeMap.skills.length;
    examReadinessPercent = totalSkills > 0 ? Math.min(100, Math.round((proficientSkills / totalSkills) * 100)) : 0;
  }

  // Top Performer: Based on mastered skills (>= 0.8) and high accuracy
  let topPerformerPercent = 0;
  if (knowledgeMap?.skills?.length) {
    const masteredSkills = knowledgeMap.skills.filter(s => (s.mastery ?? (s as any).mastery_level ?? 0) >= 0.8).length;
    const totalSkills = knowledgeMap.skills.length;
    const accuracyBonus = (userStats?.accuracy || 0) >= 85 ? 10 : 0;
    topPerformerPercent = totalSkills > 0
      ? Math.min(100, Math.round((masteredSkills / totalSkills) * 100) + accuracyBonus)
      : 0;
  }

  // Upsert into Supabase
  try {
    const { error } = await supabase
      .from('student_level_progress')
      .upsert({
        user_id: userId,
        foundation_percent: foundationPercent,
        core_skills_percent: coreSkillsPercent,
        exam_readiness_percent: examReadinessPercent,
        top_performer_percent: topPerformerPercent,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.warn('Failed to upsert level progress:', error);
    }
  } catch (err) {
    console.warn('Level progress upsert error:', err);
  }

  return [
    { label: 'Foundation', percent: foundationPercent, status: computeLevelStatus(foundationPercent) },
    { label: 'Core Skills', percent: coreSkillsPercent, status: computeLevelStatus(coreSkillsPercent) },
    { label: 'Exam Readiness', percent: examReadinessPercent, status: computeLevelStatus(examReadinessPercent) },
    { label: 'Top Performer', percent: topPerformerPercent, status: computeLevelStatus(topPerformerPercent) },
  ];
}

// Upsert today's activity into student_weekly_activity
export async function recordDailyActivity(
  userId: string,
  questionsAnswered: number,
  correctAnswers: number,
  timeSpentMinutes: number = 0,
  subjects: string[] = [],
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  try {
    // Try to get existing record for today
    const { data: existing } = await supabase
      .from('student_weekly_activity')
      .select('id, questions_answered, correct_answers, time_spent_minutes, subjects_practiced')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .single();

    if (existing) {
      // Merge subjects
      const existingSubjects: string[] = existing.subjects_practiced || [];
      const mergedSubjects = [...new Set([...existingSubjects, ...subjects])];

      await supabase
        .from('student_weekly_activity')
        .update({
          questions_answered: (existing.questions_answered || 0) + questionsAnswered,
          correct_answers: (existing.correct_answers || 0) + correctAnswers,
          time_spent_minutes: (existing.time_spent_minutes || 0) + timeSpentMinutes,
          subjects_practiced: mergedSubjects,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('student_weekly_activity')
        .insert({
          user_id: userId,
          activity_date: today,
          questions_answered: questionsAnswered,
          correct_answers: correctAnswers,
          time_spent_minutes: timeSpentMinutes,
          subjects_practiced: subjects,
        });
    }
  } catch (err) {
    console.warn('Failed to record daily activity:', err);
  }
}

// ============= MAIN FETCH =============

export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  // Fetch all data sources in parallel
  const [userStats, aiInsights, knowledgeMap, weeklyActivity] = await Promise.all([
    userStatsApi.getStats().catch(() => null),
    dktApi.getAIInsights().catch(() => null),
    dktApi.getKnowledgeMap().catch(() => null),
    fetchWeeklyActivity(userId),
  ]);

  // Compute level progress (also persists to Supabase)
  const levels = await computeAndUpdateLevelProgress(userId, knowledgeMap, userStats);

  // Build insights
  const masteryScore = aiInsights?.health_score ?? (userStats?.accuracy || 0);
  const studyStreak = userStats?.streak_count || 0;
  const predictedGrade = computePredictedGrade(masteryScore);

  // Compute trends from weekly data
  const totalWeekQuestions = weeklyActivity.reduce((sum, d) => sum + d.value, 0);
  const totalWeekCorrect = weeklyActivity.reduce((sum, d) => sum + Math.round(d.value * d.accuracy / 100), 0);
  const weekAccuracy = totalWeekQuestions > 0 ? Math.round((totalWeekCorrect / totalWeekQuestions) * 100) : 0;

  const masteryTrend = weekAccuracy > (userStats?.accuracy || 0) ? `+${weekAccuracy - (userStats?.accuracy || 0)}%` : 'Stable';
  const streakTrend = studyStreak > 0 ? `+${Math.min(studyStreak, 7)}` : '0';
  const gradeTrend = computeGradeTrend(aiInsights);

  const insights: InsightsSnapshot = {
    masteryScore,
    studyStreak,
    predictedGrade,
    masteryTrend,
    streakTrend,
    gradeTrend,
  };

  // Build subject progress from knowledge map
  const subjectProgress = buildSubjectProgress(knowledgeMap);

  // Build next study plan recommendation
  let nextStudyPlan = 'Start answering questions to get personalized study plans';
  if (aiInsights?.study_plan?.length) {
    const topPlan = aiInsights.study_plan[0];
    nextStudyPlan = `Recommended: ${topPlan.estimated_time} on ${topPlan.action}`;
  } else if (aiInsights?.focus_areas?.length) {
    const topFocus = aiInsights.focus_areas[0];
    nextStudyPlan = `Focus on ${topFocus.skill_name || topFocus.topic} in ${topFocus.subject}`;
  }

  // Build recommended focus from real student interaction data
  const recommendedFocus = await buildRecommendedFocus(userId, aiInsights);

  return {
    insights,
    progress: {
      subjects: subjectProgress,
      nextStudyPlan,
    },
    levels,
    weeklyActivity,
    recommendedFocus,
    aiInsights,
    knowledgeMap,
    userStats,
  };
}
