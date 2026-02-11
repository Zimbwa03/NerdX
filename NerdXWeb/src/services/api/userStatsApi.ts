// User Stats API service for NerdX Web
// Fetches user statistics from the backend (level, XP, streak, accuracy, etc.)
import api from './config';

export interface UserStats {
    credits: number;
    total_points: number;
    streak_count: number;
    accuracy: number;
    questions_answered: number;
    last_activity?: string;
}

export const userStatsApi = {
    getStats: async (): Promise<UserStats | null> => {
        try {
            const response = await api.get('/api/mobile/user/stats');
            return (response.data?.data ?? null) as UserStats | null;
        } catch (error) {
            console.error('User stats API error:', error);
            return null;
        }
    },
};
