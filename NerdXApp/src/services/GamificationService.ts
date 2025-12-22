// Enhanced Gamification Service
// Complete gamification system with levels, XP, badges, streaks, and progress tracking
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============= TYPE DEFINITIONS =============

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate?: string;
    category: 'milestone' | 'streak' | 'mastery' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
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
    quizzesCompleted: number;
    studyTimeMinutes: number;
}

export interface UserProgress {
    // Core stats
    points: number;
    totalXP: number;
    streak: number;
    longestStreak: number;
    lastActiveDate: string;
    badges: Badge[];

    // Subject mastery
    subjectMastery: {
        [subject: string]: number; // 0-100
    };

    // Learning stats
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    totalQuizzesCompleted: number;
    perfectScores: number;

    // Virtual Lab stats
    labsCompleted: number;
    labXPEarned: number;

    // Activity tracking
    streakHistory: boolean[]; // Last 30 days
    weeklyActivity: DailyActivity[];

    // Daily goals
    dailyGoalsCompleted: number;
    lastGoalsResetDate: string;
    todayQuestionsAnswered: number;
    todayQuizzesCompleted: number;
    todayStudyMinutes: number;
}

// ============= CONSTANTS =============

// XP required for each level (exponential growth)
const XP_PER_LEVEL = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Ranks based on level
const RANKS = [
    { minLevel: 1, name: 'Novice Explorer', icon: '🌱' },
    { minLevel: 5, name: 'Knowledge Seeker', icon: '📚' },
    { minLevel: 10, name: 'Star Explorer', icon: '⭐' },
    { minLevel: 15, name: 'Galaxy Scholar', icon: '🌟' },
    { minLevel: 20, name: 'Cosmic Master', icon: '💫' },
    { minLevel: 25, name: 'Universe Champion', icon: '🏆' },
    { minLevel: 30, name: 'Legendary Genius', icon: '👑' },
];

// Comprehensive badge system
const ALL_BADGES: Badge[] = [
    // Milestone Badges (Common)
    { id: 'first_quiz', name: 'Quiz Rookie', description: 'Complete your first quiz', icon: '🎯', category: 'milestone', rarity: 'common' },
    { id: 'quiz_10', name: 'Quiz Enthusiast', description: 'Complete 10 quizzes', icon: '📝', category: 'milestone', rarity: 'common' },
    { id: 'quiz_50', name: 'Quiz Expert', description: 'Complete 50 quizzes', icon: '🏅', category: 'milestone', rarity: 'rare' },
    { id: 'quiz_100', name: 'Quiz Legend', description: 'Complete 100 quizzes', icon: '👑', category: 'milestone', rarity: 'epic' },

    // Questions Answered
    { id: 'questions_50', name: 'Curious Mind', description: 'Answer 50 questions', icon: '❓', category: 'milestone', rarity: 'common' },
    { id: 'questions_200', name: 'Knowledge Hunter', description: 'Answer 200 questions', icon: '🔍', category: 'milestone', rarity: 'rare' },
    { id: 'questions_500', name: 'Question Master', description: 'Answer 500 questions', icon: '🧠', category: 'milestone', rarity: 'epic' },

    // Streak Badges
    { id: 'streak_3', name: 'Getting Started', description: '3-day learning streak', icon: '🔥', category: 'streak', rarity: 'common' },
    { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', icon: '⚔️', category: 'streak', rarity: 'rare' },
    { id: 'streak_14', name: 'Fortnight Fighter', description: '14-day learning streak', icon: '💪', category: 'streak', rarity: 'rare' },
    { id: 'streak_30', name: 'Monthly Champion', description: '30-day learning streak', icon: '🏆', category: 'streak', rarity: 'epic' },
    { id: 'streak_100', name: 'Century Streak', description: '100-day learning streak', icon: '🌟', category: 'streak', rarity: 'legendary' },

    // Subject Mastery
    { id: 'math_adept', name: 'Math Adept', description: '50% mastery in Mathematics', icon: '➕', category: 'mastery', rarity: 'common' },
    { id: 'math_master', name: 'Math Master', description: '80% mastery in Mathematics', icon: '📐', category: 'mastery', rarity: 'epic' },
    { id: 'science_adept', name: 'Science Adept', description: '50% mastery in Science', icon: '🔬', category: 'mastery', rarity: 'common' },
    { id: 'science_master', name: 'Science Master', description: '80% mastery in Science', icon: '🧬', category: 'mastery', rarity: 'epic' },
    { id: 'english_adept', name: 'English Adept', description: '50% mastery in English', icon: '📖', category: 'mastery', rarity: 'common' },
    { id: 'english_master', name: 'English Master', description: '80% mastery in English', icon: '✍️', category: 'mastery', rarity: 'epic' },

    // Virtual Lab
    { id: 'first_lab', name: 'Lab Initiate', description: 'Complete your first Virtual Lab', icon: '🧪', category: 'special', rarity: 'common' },
    { id: 'lab_explorer', name: 'Lab Explorer', description: 'Complete 5 Virtual Labs', icon: '🔮', category: 'special', rarity: 'rare' },
    { id: 'lab_scientist', name: 'Lab Scientist', description: 'Complete 10 Virtual Labs', icon: '👨‍🔬', category: 'special', rarity: 'epic' },

    // Perfect Scores
    { id: 'perfect_first', name: 'Perfect Start', description: 'Score 100% on a quiz', icon: '💯', category: 'special', rarity: 'common' },
    { id: 'perfect_5', name: 'Perfectionist', description: 'Score 100% on 5 quizzes', icon: '🌟', category: 'special', rarity: 'rare' },
    { id: 'perfect_10', name: 'Flawless', description: 'Score 100% on 10 quizzes', icon: '💎', category: 'special', rarity: 'epic' },

    // XP Milestones
    { id: 'xp_500', name: 'Rising Star', description: 'Earn 500 XP', icon: '⭐', category: 'milestone', rarity: 'common' },
    { id: 'xp_2000', name: 'Shining Star', description: 'Earn 2000 XP', icon: '🌟', category: 'milestone', rarity: 'rare' },
    { id: 'xp_5000', name: 'Superstar', description: 'Earn 5000 XP', icon: '💫', category: 'milestone', rarity: 'epic' },
    { id: 'xp_10000', name: 'Supernova', description: 'Earn 10000 XP', icon: '✨', category: 'milestone', rarity: 'legendary' },
];

const STORAGE_KEY = '@nerdx_gamification_v2';

// ============= DEFAULT PROGRESS =============

const getDefaultProgress = (): UserProgress => ({
    points: 0,
    totalXP: 0,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString(),
    badges: [],
    subjectMastery: {},
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    totalQuizzesCompleted: 0,
    perfectScores: 0,
    labsCompleted: 0,
    labXPEarned: 0,
    streakHistory: Array(30).fill(false),
    weeklyActivity: [],
    dailyGoalsCompleted: 0,
    lastGoalsResetDate: new Date().toISOString(),
    todayQuestionsAnswered: 0,
    todayQuizzesCompleted: 0,
    todayStudyMinutes: 0,
});

// ============= SERVICE =============

export const gamificationService = {
    // Get full progress data
    getProgress: async (): Promise<UserProgress> => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                // Merge with defaults for any missing fields
                return { ...getDefaultProgress(), ...parsed };
            }
            return getDefaultProgress();
        } catch (error) {
            console.error('Error getting progress:', error);
            return getDefaultProgress();
        }
    },

    // Save progress
    saveProgress: async (progress: UserProgress) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    },

    // Calculate level from total XP
    getLevelInfo: async (): Promise<LevelInfo> => {
        const progress = await gamificationService.getProgress();
        let totalXP = progress.totalXP;
        let level = 1;
        let xpForLevel = XP_PER_LEVEL(1);

        while (totalXP >= xpForLevel && level < 100) {
            totalXP -= xpForLevel;
            level++;
            xpForLevel = XP_PER_LEVEL(level);
        }

        // Find rank
        let rank = RANKS[0];
        for (const r of RANKS) {
            if (level >= r.minLevel) {
                rank = r;
            }
        }

        return {
            level,
            currentXP: totalXP,
            xpForNextLevel: xpForLevel,
            totalXP: progress.totalXP,
            rank: rank.name,
            rankIcon: rank.icon,
        };
    },

    // Add XP and check for level up
    addXP: async (xp: number): Promise<{ newXP: number; leveledUp: boolean; newLevel?: number }> => {
        const progress = await gamificationService.getProgress();
        const oldLevelInfo = await gamificationService.getLevelInfo();

        progress.totalXP += xp;
        progress.points += xp; // Also add to points for backward compatibility
        await gamificationService.saveProgress(progress);

        const newLevelInfo = await gamificationService.getLevelInfo();
        const leveledUp = newLevelInfo.level > oldLevelInfo.level;

        // Check for XP badges
        await gamificationService.checkXPBadges(progress.totalXP);

        return {
            newXP: progress.totalXP,
            leveledUp,
            newLevel: leveledUp ? newLevelInfo.level : undefined,
        };
    },

    // Add points (backward compatibility)
    addPoints: async (points: number) => {
        const progress = await gamificationService.getProgress();
        progress.points += points;
        await gamificationService.saveProgress(progress);
        return progress;
    },

    // Log a question answered
    logQuestionAnswered: async (correct: boolean) => {
        const progress = await gamificationService.getProgress();

        // Reset daily counters if new day
        const today = new Date().toDateString();
        const lastDate = new Date(progress.lastGoalsResetDate).toDateString();
        if (today !== lastDate) {
            progress.todayQuestionsAnswered = 0;
            progress.todayQuizzesCompleted = 0;
            progress.todayStudyMinutes = 0;
            progress.lastGoalsResetDate = new Date().toISOString();
        }

        progress.totalQuestionsAnswered++;
        progress.todayQuestionsAnswered++;

        if (correct) {
            progress.totalCorrectAnswers++;
        }

        // Award XP
        const xp = correct ? 10 : 3;
        progress.totalXP += xp;
        progress.points += xp;

        await gamificationService.saveProgress(progress);

        // Check milestone badges
        await gamificationService.checkQuestionBadges(progress.totalQuestionsAnswered);
    },

    // Log quiz completed
    logQuizCompleted: async (score: number, totalQuestions: number) => {
        const progress = await gamificationService.getProgress();

        progress.totalQuizzesCompleted++;
        progress.todayQuizzesCompleted++;

        const isPerfect = score === totalQuestions;
        if (isPerfect) {
            progress.perfectScores++;
        }

        // Award XP based on performance
        const percentage = (score / totalQuestions) * 100;
        let xp = 25; // Base XP
        if (percentage >= 80) xp += 25;
        if (percentage >= 90) xp += 25;
        if (isPerfect) xp += 50;

        progress.totalXP += xp;
        progress.points += xp;

        await gamificationService.saveProgress(progress);

        // Check badges
        await gamificationService.checkQuizBadges(progress.totalQuizzesCompleted);
        if (isPerfect) {
            await gamificationService.checkPerfectBadges(progress.perfectScores);
        }
    },

    // Log lab completed
    logLabCompleted: async (xpEarned: number) => {
        const progress = await gamificationService.getProgress();

        progress.labsCompleted++;
        progress.labXPEarned += xpEarned;
        progress.totalXP += xpEarned;
        progress.points += xpEarned;

        await gamificationService.saveProgress(progress);

        // Check lab badges
        await gamificationService.checkLabBadges(progress.labsCompleted);
    },

    /**
     * Log a Virtual Lab knowledge-check completion.
     * - Adds earned XP/points (from the lab reward calculation)
     * - Updates question/accuracy stats (without awarding extra per-question XP)
     * - Updates daily + weekly activity counters
     */
    logVirtualLabKnowledgeCheck: async (params: {
        xpEarned: number;
        totalQuestions: number;
        correctAnswers: number;
        subjectForMastery?: 'science' | string;
        scorePercent?: number;
    }) => {
        const { xpEarned, totalQuestions, correctAnswers } = params;
        const progress = await gamificationService.getProgress();

        // Reset daily counters if new day
        const todayLabel = new Date().toDateString();
        const lastResetLabel = new Date(progress.lastGoalsResetDate).toDateString();
        if (todayLabel !== lastResetLabel) {
            progress.todayQuestionsAnswered = 0;
            progress.todayQuizzesCompleted = 0;
            progress.todayStudyMinutes = 0;
            progress.lastGoalsResetDate = new Date().toISOString();
        }

        // Update question stats (NO extra XP here)
        const tq = Math.max(0, Number.isFinite(totalQuestions) ? totalQuestions : 0);
        const ca = Math.max(0, Number.isFinite(correctAnswers) ? correctAnswers : 0);
        progress.totalQuestionsAnswered += tq;
        progress.todayQuestionsAnswered += tq;
        progress.totalCorrectAnswers += Math.min(ca, tq);

        // Update weekly activity bucket for today
        const dateStr = new Date().toISOString().split('T')[0];
        const activity = progress.weeklyActivity || [];
        const existing = activity.find(a => a.date === dateStr);
        if (existing) {
            existing.questionsAnswered += tq;
            existing.correctAnswers += Math.min(ca, tq);
        } else {
            activity.push({
                date: dateStr,
                questionsAnswered: tq,
                correctAnswers: Math.min(ca, tq),
                quizzesCompleted: 0,
                studyTimeMinutes: 0,
            });
        }
        progress.weeklyActivity = activity;

        // Award lab XP/points and increment lab counters
        progress.labsCompleted++;
        progress.labXPEarned += xpEarned;
        progress.totalXP += xpEarned;
        progress.points += xpEarned;

        await gamificationService.saveProgress(progress);

        // Badges
        await gamificationService.checkLabBadges(progress.labsCompleted);
        await gamificationService.checkQuestionBadges(progress.totalQuestionsAnswered);
        await gamificationService.checkXPBadges(progress.totalXP);

        // Update streak
        await gamificationService.checkStreak();

        // Subject mastery (Virtual Labs contribute to Science mastery)
        const subjectForMastery = (params.subjectForMastery || 'science').toString();
        const scorePercent =
            typeof params.scorePercent === 'number'
                ? params.scorePercent
                : (tq > 0 ? Math.round((Math.min(ca, tq) / tq) * 100) : 0);
        await gamificationService.updateMastery(subjectForMastery, scorePercent);
    },

    // Check and update streak
    checkStreak: async (): Promise<number> => {
        const progress = await gamificationService.getProgress();
        const lastActive = new Date(progress.lastActiveDate);
        const now = new Date();

        // Reset dates to midnight for comparison
        lastActive.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            progress.streak++;
            if (progress.streak > progress.longestStreak) {
                progress.longestStreak = progress.streak;
            }
        } else if (diffDays > 1) {
            // Missed days - reset streak
            progress.streak = 1;
        }
        // diffDays === 0 means same day, no change

        // Update streak history (shift and add today)
        progress.streakHistory = [...progress.streakHistory.slice(1), true];

        progress.lastActiveDate = now.toISOString();
        await gamificationService.saveProgress(progress);

        // Check streak badges
        await gamificationService.checkStreakBadges(progress.streak);

        return progress.streak;
    },

    // Get streak history for calendar
    getStreakHistory: async (): Promise<boolean[]> => {
        const progress = await gamificationService.getProgress();
        return progress.streakHistory || Array(30).fill(false);
    },

    // Get daily goals
    getDailyGoals: async (): Promise<DailyGoal[]> => {
        const progress = await gamificationService.getProgress();

        // Reset if new day
        const today = new Date().toDateString();
        const lastDate = new Date(progress.lastGoalsResetDate).toDateString();
        if (today !== lastDate) {
            progress.todayQuestionsAnswered = 0;
            progress.todayQuizzesCompleted = 0;
            progress.todayStudyMinutes = 0;
            progress.lastGoalsResetDate = new Date().toISOString();
            await gamificationService.saveProgress(progress);
        }

        return [
            {
                id: 'questions',
                title: 'Answer 10 questions',
                icon: '❓',
                current: progress.todayQuestionsAnswered,
                target: 10,
                unit: 'questions',
            },
            {
                id: 'quizzes',
                title: 'Complete 1 quiz',
                icon: '📝',
                current: progress.todayQuizzesCompleted,
                target: 1,
                unit: 'quizzes',
            },
            {
                id: 'study',
                title: 'Study for 15 minutes',
                icon: '⏱️',
                current: progress.todayStudyMinutes,
                target: 15,
                unit: 'minutes',
            },
        ];
    },

    // Get weekly activity
    getWeeklyActivity: async (): Promise<DailyActivity[]> => {
        const progress = await gamificationService.getProgress();
        const activity = progress.weeklyActivity || [];

        // Fill in missing days with zeros
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const result: DailyActivity[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const existing = activity.find(a => a.date === dateStr);
            result.push(existing || {
                date: dateStr,
                questionsAnswered: 0,
                correctAnswers: 0,
                quizzesCompleted: 0,
                studyTimeMinutes: 0,
            });
        }

        return result;
    },

    // Update subject mastery
    updateMastery: async (subject: string, score: number) => {
        const progress = await gamificationService.getProgress();
        const current = progress.subjectMastery[subject] || 0;

        // Weighted average with new score
        const weight = 0.3;
        const newMastery = Math.min(100, Math.round(current * (1 - weight) + score * weight));
        progress.subjectMastery[subject] = newMastery;

        await gamificationService.saveProgress(progress);

        // Check mastery badges
        await gamificationService.checkMasteryBadges(subject, newMastery);
    },

    // Award badge
    awardBadge: async (badgeId: string): Promise<Badge | null> => {
        const progress = await gamificationService.getProgress();
        const hasBadge = progress.badges.some(b => b.id === badgeId);

        if (!hasBadge) {
            const badge = ALL_BADGES.find(b => b.id === badgeId);
            if (badge) {
                const earnedBadge = { ...badge, earnedDate: new Date().toISOString() };
                progress.badges.push(earnedBadge);
                await gamificationService.saveProgress(progress);

                // Award bonus XP for badge
                const xpBonus = badge.rarity === 'legendary' ? 500 :
                    badge.rarity === 'epic' ? 200 :
                        badge.rarity === 'rare' ? 100 : 50;
                await gamificationService.addXP(xpBonus);

                return earnedBadge;
            }
        }
        return null;
    },

    // Get all badges with unlock status
    getAllBadges: async (): Promise<(Badge & { isUnlocked: boolean; progress?: number })[]> => {
        const progress = await gamificationService.getProgress();
        const earnedBadgeIds = progress.badges.map(b => b.id);

        return ALL_BADGES.map(badge => {
            const isUnlocked = earnedBadgeIds.includes(badge.id);
            const earned = progress.badges.find(b => b.id === badge.id);

            // Calculate progress for locked badges
            let badgeProgress: number | undefined;
            if (!isUnlocked) {
                badgeProgress = gamificationService.calculateBadgeProgress(badge.id, progress);
            }

            return {
                ...badge,
                isUnlocked,
                earnedDate: earned?.earnedDate,
                progress: badgeProgress,
            };
        });
    },

    // Calculate progress toward a specific badge
    calculateBadgeProgress: (badgeId: string, progress: UserProgress): number => {
        switch (badgeId) {
            case 'first_quiz': return progress.totalQuizzesCompleted > 0 ? 100 : 0;
            case 'quiz_10': return Math.min((progress.totalQuizzesCompleted / 10) * 100, 100);
            case 'quiz_50': return Math.min((progress.totalQuizzesCompleted / 50) * 100, 100);
            case 'quiz_100': return Math.min((progress.totalQuizzesCompleted / 100) * 100, 100);

            case 'questions_50': return Math.min((progress.totalQuestionsAnswered / 50) * 100, 100);
            case 'questions_200': return Math.min((progress.totalQuestionsAnswered / 200) * 100, 100);
            case 'questions_500': return Math.min((progress.totalQuestionsAnswered / 500) * 100, 100);

            case 'streak_3': return Math.min((progress.streak / 3) * 100, 100);
            case 'streak_7': return Math.min((progress.streak / 7) * 100, 100);
            case 'streak_14': return Math.min((progress.streak / 14) * 100, 100);
            case 'streak_30': return Math.min((progress.streak / 30) * 100, 100);
            case 'streak_100': return Math.min((progress.streak / 100) * 100, 100);

            case 'math_adept': return Math.min(((progress.subjectMastery['mathematics'] || 0) / 50) * 100, 100);
            case 'math_master': return Math.min(((progress.subjectMastery['mathematics'] || 0) / 80) * 100, 100);
            case 'science_adept': return Math.min(((progress.subjectMastery['science'] || 0) / 50) * 100, 100);
            case 'science_master': return Math.min(((progress.subjectMastery['science'] || 0) / 80) * 100, 100);
            case 'english_adept': return Math.min(((progress.subjectMastery['english'] || 0) / 50) * 100, 100);
            case 'english_master': return Math.min(((progress.subjectMastery['english'] || 0) / 80) * 100, 100);

            case 'first_lab': return progress.labsCompleted > 0 ? 100 : 0;
            case 'lab_explorer': return Math.min((progress.labsCompleted / 5) * 100, 100);
            case 'lab_scientist': return Math.min((progress.labsCompleted / 10) * 100, 100);

            case 'perfect_first': return progress.perfectScores > 0 ? 100 : 0;
            case 'perfect_5': return Math.min((progress.perfectScores / 5) * 100, 100);
            case 'perfect_10': return Math.min((progress.perfectScores / 10) * 100, 100);

            case 'xp_500': return Math.min((progress.totalXP / 500) * 100, 100);
            case 'xp_2000': return Math.min((progress.totalXP / 2000) * 100, 100);
            case 'xp_5000': return Math.min((progress.totalXP / 5000) * 100, 100);
            case 'xp_10000': return Math.min((progress.totalXP / 10000) * 100, 100);

            default: return 0;
        }
    },

    // ============= BADGE CHECK HELPERS =============

    checkQuestionBadges: async (count: number) => {
        if (count >= 50) await gamificationService.awardBadge('questions_50');
        if (count >= 200) await gamificationService.awardBadge('questions_200');
        if (count >= 500) await gamificationService.awardBadge('questions_500');
    },

    checkQuizBadges: async (count: number) => {
        if (count >= 1) await gamificationService.awardBadge('first_quiz');
        if (count >= 10) await gamificationService.awardBadge('quiz_10');
        if (count >= 50) await gamificationService.awardBadge('quiz_50');
        if (count >= 100) await gamificationService.awardBadge('quiz_100');
    },

    checkStreakBadges: async (streak: number) => {
        if (streak >= 3) await gamificationService.awardBadge('streak_3');
        if (streak >= 7) await gamificationService.awardBadge('streak_7');
        if (streak >= 14) await gamificationService.awardBadge('streak_14');
        if (streak >= 30) await gamificationService.awardBadge('streak_30');
        if (streak >= 100) await gamificationService.awardBadge('streak_100');
    },

    checkMasteryBadges: async (subject: string, mastery: number) => {
        const subjectKey = subject.toLowerCase();
        if (subjectKey === 'mathematics' || subjectKey === 'math') {
            if (mastery >= 50) await gamificationService.awardBadge('math_adept');
            if (mastery >= 80) await gamificationService.awardBadge('math_master');
        } else if (subjectKey === 'science' || subjectKey === 'combined_science') {
            if (mastery >= 50) await gamificationService.awardBadge('science_adept');
            if (mastery >= 80) await gamificationService.awardBadge('science_master');
        } else if (subjectKey === 'english') {
            if (mastery >= 50) await gamificationService.awardBadge('english_adept');
            if (mastery >= 80) await gamificationService.awardBadge('english_master');
        }
    },

    checkLabBadges: async (count: number) => {
        if (count >= 1) await gamificationService.awardBadge('first_lab');
        if (count >= 5) await gamificationService.awardBadge('lab_explorer');
        if (count >= 10) await gamificationService.awardBadge('lab_scientist');
    },

    checkPerfectBadges: async (count: number) => {
        if (count >= 1) await gamificationService.awardBadge('perfect_first');
        if (count >= 5) await gamificationService.awardBadge('perfect_5');
        if (count >= 10) await gamificationService.awardBadge('perfect_10');
    },

    checkXPBadges: async (totalXP: number) => {
        if (totalXP >= 500) await gamificationService.awardBadge('xp_500');
        if (totalXP >= 2000) await gamificationService.awardBadge('xp_2000');
        if (totalXP >= 5000) await gamificationService.awardBadge('xp_5000');
        if (totalXP >= 10000) await gamificationService.awardBadge('xp_10000');
    },

    // Get overall stats for display
    getOverallStats: async () => {
        const progress = await gamificationService.getProgress();
        const levelInfo = await gamificationService.getLevelInfo();
        const accuracy = progress.totalQuestionsAnswered > 0
            ? Math.round((progress.totalCorrectAnswers / progress.totalQuestionsAnswered) * 100)
            : 0;

        return {
            level: levelInfo.level,
            rank: levelInfo.rank,
            rankIcon: levelInfo.rankIcon,
            totalXP: progress.totalXP,
            currentLevelXP: levelInfo.currentXP,
            xpForNextLevel: levelInfo.xpForNextLevel,
            streak: progress.streak,
            longestStreak: progress.longestStreak,
            accuracy,
            totalQuestions: progress.totalQuestionsAnswered,
            totalQuizzes: progress.totalQuizzesCompleted,
            perfectScores: progress.perfectScores,
            badgesEarned: progress.badges.length,
            totalBadges: ALL_BADGES.length,
            credits: progress.points,
        };
    },
};
