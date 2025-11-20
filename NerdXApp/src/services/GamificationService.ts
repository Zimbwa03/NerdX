// Gamification Service
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate?: string;
}

export interface UserProgress {
    points: number;
    streak: number;
    lastActiveDate: string;
    badges: Badge[];
    subjectMastery: {
        [subject: string]: number; // 0-100
    };
}

const BADGES: Badge[] = [
    { id: 'first_quiz', name: 'Quiz Rookie', description: 'Completed your first quiz', icon: '🎯' },
    { id: 'streak_3', name: 'On Fire', description: '3-day learning streak', icon: '🔥' },
    { id: 'science_lab', name: 'Lab Rat', description: 'Completed a Virtual Lab', icon: '🧪' },
    { id: 'math_whiz', name: 'Math Whiz', description: 'Scored 100% in a Math quiz', icon: '📐' },
];

const STORAGE_KEY = '@nerdx_gamification';

export const gamificationService = {
    getProgress: async (): Promise<UserProgress> => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
            return {
                points: 0,
                streak: 0,
                lastActiveDate: new Date().toISOString(),
                badges: [],
                subjectMastery: {},
            };
        } catch (error) {
            console.error('Error getting progress:', error);
            return {
                points: 0,
                streak: 0,
                lastActiveDate: new Date().toISOString(),
                badges: [],
                subjectMastery: {},
            };
        }
    },

    saveProgress: async (progress: UserProgress) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    },

    addPoints: async (points: number) => {
        const progress = await gamificationService.getProgress();
        progress.points += points;
        await gamificationService.saveProgress(progress);
        return progress;
    },

    checkStreak: async () => {
        const progress = await gamificationService.getProgress();
        const lastActive = new Date(progress.lastActiveDate);
        const now = new Date();

        // Check if last active was yesterday (simple check)
        const isYesterday = (
            now.getDate() - lastActive.getDate() === 1 &&
            now.getMonth() === lastActive.getMonth() &&
            now.getFullYear() === lastActive.getFullYear()
        );

        const isToday = (
            now.getDate() === lastActive.getDate() &&
            now.getMonth() === lastActive.getMonth() &&
            now.getFullYear() === lastActive.getFullYear()
        );

        if (isYesterday) {
            progress.streak += 1;
        } else if (!isToday) {
            progress.streak = 1; // Reset if missed a day
        }

        progress.lastActiveDate = now.toISOString();
        await gamificationService.saveProgress(progress);
        return progress.streak;
    },

    awardBadge: async (badgeId: string): Promise<Badge | null> => {
        const progress = await gamificationService.getProgress();
        const hasBadge = progress.badges.some(b => b.id === badgeId);

        if (!hasBadge) {
            const badge = BADGES.find(b => b.id === badgeId);
            if (badge) {
                const earnedBadge = { ...badge, earnedDate: new Date().toISOString() };
                progress.badges.push(earnedBadge);
                await gamificationService.saveProgress(progress);
                return earnedBadge;
            }
        }
        return null;
    },

    updateMastery: async (subject: string, score: number) => {
        const progress = await gamificationService.getProgress();
        const current = progress.subjectMastery[subject] || 0;
        // Simple moving average or increment
        const newMastery = Math.min(100, current + (score > 70 ? 5 : 1));
        progress.subjectMastery[subject] = newMastery;
        await gamificationService.saveProgress(progress);
    }
};
