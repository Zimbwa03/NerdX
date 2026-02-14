// Web Gamification Service
// Mirrors the mobile GamificationService.ts — levels, XP, badges, streaks, activity tracking
// Uses localStorage for persistence; syncs with backend /api/mobile/user/stats
// Also writes to Supabase student_weekly_activity for dashboard analytics

import { userStatsApi, type UserStats } from './api/userStatsApi';
import { recordDailyActivity } from './dashboardDataService';

// ============= TYPE DEFINITIONS =============

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate?: string;
    category: 'milestone' | 'streak' | 'mastery' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    isUnlocked: boolean;
}

export interface LevelInfo {
    level: number;
    currentXP: number;
    xpForNextLevel: number;
    totalXP: number;
    rank: string;
    rankIcon: string;
}

export interface DailyGoal {
    id: string;
    title: string;
    icon: string;
    current: number;
    target: number;
    unit: string;
}

export interface DailyActivity {
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
}

export interface OverallStats {
    streak: number;
    longestStreak: number;
    accuracy: number;
    totalQuestions: number;
    totalXP: number;
    totalQuizzes: number;
    perfectScores: number;
}

export interface SubjectMasteryData {
    subject: string;
    displayName: string;
    icon: string;
    color: string;
    mastery: number; // 0-100
    skillsCount: number;
    masteredSkills: number;
}

interface UserProgress {
    totalXP: number;
    streak: number;
    longestStreak: number;
    totalQuestionsAnswered: number;
    correctAnswers: number;
    totalQuizzes: number;
    perfectScores: number;
    lastActiveDate: string;
    badges: string[]; // IDs of unlocked badges
    streakHistory: boolean[]; // last 30 days
    weeklyActivity: DailyActivity[];
    todayQuestionsAnswered: number;
    todayCorrectAnswers: number;
}

// ============= CONSTANTS =============

const STORAGE_KEY = 'nerdx_web_gamification_v1';

function XP_PER_LEVEL(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

const RANKS = [
    { minLevel: 1, name: 'Novice Explorer', icon: '🌱' },
    { minLevel: 5, name: 'Knowledge Seeker', icon: '📚' },
    { minLevel: 10, name: 'Star Explorer', icon: '⭐' },
    { minLevel: 15, name: 'Galaxy Scholar', icon: '🌟' },
    { minLevel: 20, name: 'Cosmic Master', icon: '💫' },
    { minLevel: 25, name: 'Universe Champion', icon: '🏆' },
    { minLevel: 30, name: 'Legendary Genius', icon: '👑' },
];

const ALL_BADGES: Omit<Badge, 'isUnlocked'>[] = [
    // Milestone
    { id: 'first_quiz', name: 'Quiz Rookie', description: 'Complete your first quiz', icon: '🎯', category: 'milestone', rarity: 'common' },
    { id: 'quiz_10', name: 'Quiz Explorer', description: 'Complete 10 quizzes', icon: '🧭', category: 'milestone', rarity: 'common' },
    { id: 'quiz_25', name: 'Quiz Adventurer', description: 'Complete 25 quizzes', icon: '🗺️', category: 'milestone', rarity: 'rare' },
    { id: 'quiz_50', name: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🏅', category: 'milestone', rarity: 'epic' },
    { id: 'quiz_100', name: 'Quiz Legend', description: 'Complete 100 quizzes', icon: '👑', category: 'milestone', rarity: 'legendary' },
    { id: 'questions_50', name: 'Curious Mind', description: 'Answer 50 questions', icon: '💡', category: 'milestone', rarity: 'common' },
    { id: 'questions_100', name: 'Quick Thinker', description: 'Answer 100 questions', icon: '⚡', category: 'milestone', rarity: 'common' },
    { id: 'questions_500', name: 'Knowledge Hunter', description: 'Answer 500 questions', icon: '🎓', category: 'milestone', rarity: 'rare' },
    { id: 'questions_1000', name: 'Brain Power', description: 'Answer 1000 questions', icon: '🧠', category: 'milestone', rarity: 'epic' },
    // Streak
    { id: 'streak_3', name: 'Getting Started', description: '3-day streak', icon: '🔥', category: 'streak', rarity: 'common' },
    { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '⚔️', category: 'streak', rarity: 'rare' },
    { id: 'streak_14', name: 'Fortnight Fighter', description: '14-day streak', icon: '💪', category: 'streak', rarity: 'rare' },
    { id: 'streak_30', name: 'Monthly Master', description: '30-day streak', icon: '🌟', category: 'streak', rarity: 'epic' },
    // Mastery
    { id: 'first_perfect', name: 'Perfectionist', description: 'Get a perfect quiz score', icon: '💯', category: 'mastery', rarity: 'rare' },
    { id: 'accuracy_80', name: 'Sharpshooter', description: 'Reach 80% accuracy', icon: '🎯', category: 'mastery', rarity: 'rare' },
    { id: 'accuracy_90', name: 'Precision Expert', description: 'Reach 90% accuracy', icon: '🏆', category: 'mastery', rarity: 'epic' },
    // XP Milestones
    { id: 'xp_100', name: 'First Steps', description: 'Earn 100 XP', icon: '👣', category: 'milestone', rarity: 'common' },
    { id: 'xp_500', name: 'Rising Star', description: 'Earn 500 XP', icon: '⭐', category: 'milestone', rarity: 'common' },
    { id: 'xp_1000', name: 'Bright Mind', description: 'Earn 1000 XP', icon: '✨', category: 'milestone', rarity: 'rare' },
    { id: 'xp_5000', name: 'Superstar', description: 'Earn 5000 XP', icon: '💫', category: 'milestone', rarity: 'epic' },
    { id: 'xp_10000', name: 'Supernova', description: 'Earn 10000 XP', icon: '🌠', category: 'milestone', rarity: 'legendary' },
    // Special
    { id: 'first_lab', name: 'Lab Initiate', description: 'Complete a Virtual Lab', icon: '🧪', category: 'special', rarity: 'common' },
    { id: 'night_owl', name: 'Night Owl', description: 'Study after 10 PM', icon: '🦉', category: 'special', rarity: 'rare' },
    { id: 'early_bird', name: 'Early Bird', description: 'Study before 7 AM', icon: '🐦', category: 'special', rarity: 'rare' },
];

function getDefaultProgress(): UserProgress {
    return {
        totalXP: 0,
        streak: 0,
        longestStreak: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        totalQuizzes: 0,
        perfectScores: 0,
        lastActiveDate: '',
        badges: [],
        streakHistory: Array(30).fill(false),
        weeklyActivity: [],
        todayQuestionsAnswered: 0,
        todayCorrectAnswers: 0,
    };
}

// ============= SERVICE =============

export const gamificationService = {
    // Load progress from localStorage
    getProgress: (): UserProgress => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as UserProgress;
                return { ...getDefaultProgress(), ...parsed };
            }
        } catch { /* ignore */ }
        return getDefaultProgress();
    },

    // Save progress
    saveProgress: (progress: UserProgress): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch { /* ignore */ }
    },

    // Sync with backend stats and merge, also record activity to Supabase
    syncWithBackend: async (userId?: string): Promise<UserProgress> => {
        const local = gamificationService.getProgress();
        try {
            const remote: UserStats | null = await userStatsApi.getStats();
            if (remote) {
                // Use the higher of local vs remote for cumulative stats
                local.totalXP = Math.max(local.totalXP, remote.total_points || 0);
                local.streak = Math.max(local.streak, remote.streak_count || 0);
                local.totalQuestionsAnswered = Math.max(local.totalQuestionsAnswered, remote.questions_answered || 0);
                if (remote.accuracy > 0 && local.totalQuestionsAnswered > 0) {
                    local.correctAnswers = Math.round((remote.accuracy / 100) * local.totalQuestionsAnswered);
                }
                gamificationService.saveProgress(local);

                // Also sync today's local activity to Supabase for dashboard charts
                if (userId && (local.todayQuestionsAnswered > 0 || local.todayCorrectAnswers > 0)) {
                    recordDailyActivity(
                        userId,
                        local.todayQuestionsAnswered,
                        local.todayCorrectAnswers,
                    ).catch(() => { /* non-blocking */ });
                }
            }
        } catch (e) {
            console.warn('Gamification sync failed:', e);
        }
        return local;
    },

    // Calculate level info from XP
    getLevelInfo: (progress?: UserProgress): LevelInfo => {
        const p = progress || gamificationService.getProgress();
        let remainingXP = p.totalXP;
        let level = 1;

        while (remainingXP >= XP_PER_LEVEL(level)) {
            remainingXP -= XP_PER_LEVEL(level);
            level++;
        }

        const rank = [...RANKS].reverse().find(r => level >= r.minLevel) || RANKS[0];

        return {
            level,
            currentXP: remainingXP,
            xpForNextLevel: XP_PER_LEVEL(level),
            totalXP: p.totalXP,
            rank: rank.name,
            rankIcon: rank.icon,
        };
    },

    // Get overall stats
    getOverallStats: (progress?: UserProgress): OverallStats => {
        const p = progress || gamificationService.getProgress();
        const accuracy = p.totalQuestionsAnswered > 0
            ? Math.round((p.correctAnswers / p.totalQuestionsAnswered) * 100)
            : 0;

        return {
            streak: p.streak,
            longestStreak: p.longestStreak,
            accuracy,
            totalQuestions: p.totalQuestionsAnswered,
            totalXP: p.totalXP,
            totalQuizzes: p.totalQuizzes,
            perfectScores: p.perfectScores,
        };
    },

    // Get streak history (30-day boolean array)
    getStreakHistory: (progress?: UserProgress): boolean[] => {
        const p = progress || gamificationService.getProgress();
        return p.streakHistory.length === 30 ? p.streakHistory : Array(30).fill(false);
    },

    // Get all badges with unlock state
    getAllBadges: (progress?: UserProgress): Badge[] => {
        const p = progress || gamificationService.getProgress();
        const stats = gamificationService.getOverallStats(p);
        const levelInfo = gamificationService.getLevelInfo(p);

        // Auto-unlock badges based on current stats
        const autoUnlocked = new Set<string>(p.badges);

        // Milestone checks
        if (stats.totalQuizzes >= 1) autoUnlocked.add('first_quiz');
        if (stats.totalQuizzes >= 10) autoUnlocked.add('quiz_10');
        if (stats.totalQuizzes >= 25) autoUnlocked.add('quiz_25');
        if (stats.totalQuizzes >= 50) autoUnlocked.add('quiz_50');
        if (stats.totalQuizzes >= 100) autoUnlocked.add('quiz_100');
        if (stats.totalQuestions >= 50) autoUnlocked.add('questions_50');
        if (stats.totalQuestions >= 100) autoUnlocked.add('questions_100');
        if (stats.totalQuestions >= 500) autoUnlocked.add('questions_500');
        if (stats.totalQuestions >= 1000) autoUnlocked.add('questions_1000');

        // Streak checks
        if (stats.longestStreak >= 3) autoUnlocked.add('streak_3');
        if (stats.longestStreak >= 7) autoUnlocked.add('streak_7');
        if (stats.longestStreak >= 14) autoUnlocked.add('streak_14');
        if (stats.longestStreak >= 30) autoUnlocked.add('streak_30');

        // Mastery checks
        if (stats.perfectScores >= 1) autoUnlocked.add('first_perfect');
        if (stats.accuracy >= 80) autoUnlocked.add('accuracy_80');
        if (stats.accuracy >= 90) autoUnlocked.add('accuracy_90');

        // XP checks
        if (levelInfo.totalXP >= 100) autoUnlocked.add('xp_100');
        if (levelInfo.totalXP >= 500) autoUnlocked.add('xp_500');
        if (levelInfo.totalXP >= 1000) autoUnlocked.add('xp_1000');
        if (levelInfo.totalXP >= 5000) autoUnlocked.add('xp_5000');
        if (levelInfo.totalXP >= 10000) autoUnlocked.add('xp_10000');

        // Save updated badges back
        p.badges = Array.from(autoUnlocked);
        gamificationService.saveProgress(p);

        return ALL_BADGES.map(b => ({
            ...b,
            isUnlocked: autoUnlocked.has(b.id),
        }));
    },

    // Get daily goals
    getDailyGoals: (progress?: UserProgress): DailyGoal[] => {
        const p = progress || gamificationService.getProgress();
        return [
            { id: 'questions', title: 'Answer Questions', icon: '❓', current: p.todayQuestionsAnswered, target: 10, unit: 'questions' },
            { id: 'accuracy', title: 'Get Correct', icon: '✅', current: p.todayCorrectAnswers, target: 8, unit: 'correct' },
        ];
    },

    // Get weekly activity (last 7 days)
    getWeeklyActivity: (progress?: UserProgress): DailyActivity[] => {
        const p = progress || gamificationService.getProgress();
        const today = new Date();
        const days: DailyActivity[] = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const existing = p.weeklyActivity.find(a => a.date === dateStr);
            days.push(existing || { date: dateStr, questionsAnswered: 0, correctAnswers: 0 });
        }

        return days;
    },

    // Default subject mastery data
    getDefaultSubjectData: (): SubjectMasteryData[] => [
        { subject: 'mathematics', displayName: 'Mathematics', icon: '📐', color: '#3B82F6', mastery: 0, skillsCount: 0, masteredSkills: 0 },
        { subject: 'biology', displayName: 'Biology', icon: '🧬', color: '#22C55E', mastery: 0, skillsCount: 0, masteredSkills: 0 },
        { subject: 'chemistry', displayName: 'Chemistry', icon: '⚗️', color: '#8B5CF6', mastery: 0, skillsCount: 0, masteredSkills: 0 },
        { subject: 'physics', displayName: 'Physics', icon: '⚡', color: '#F59E0B', mastery: 0, skillsCount: 0, masteredSkills: 0 },
        { subject: 'english', displayName: 'English', icon: '📝', color: '#EC4899', mastery: 0, skillsCount: 0, masteredSkills: 0 },
        { subject: 'geography', displayName: 'Geography', icon: '🌍', color: '#14B8A6', mastery: 0, skillsCount: 0, masteredSkills: 0 },
        { subject: 'history', displayName: 'History', icon: '📜', color: '#78716C', mastery: 0, skillsCount: 0, masteredSkills: 0 },
        { subject: 'commerce', displayName: 'Commerce', icon: '💼', color: '#D97706', mastery: 0, skillsCount: 0, masteredSkills: 0 },
    ],
};
