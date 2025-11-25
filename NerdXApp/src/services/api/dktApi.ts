// Deep Knowledge Tracing API Service
// Handles interaction logging, knowledge tracking, and personalized recommendations

import axios from 'axios';
import { storage } from './storage';

const API_URL = 'https://nerdx.onrender.com/api/mobile';

// Types
export interface Interaction {
    id: number;
    skill_id: string;
    correct: boolean;
    confidence?: 'low' | 'medium' | 'high';
    time_spent?: number;
    hints_used?: number;
    timestamp: string;
}

export interface SkillMastery {
    skill_id: string;
    skill_name: string;
    subject: string;
    topic: string;
    mastery: number; // 0.0 to 1.0
    confidence: number;
    last_practiced?: string;
    status: 'mastered' | 'proficient' | 'learning' | 'struggling' | 'unknown';
}

export interface KnowledgeMap {
    user_id: string;
    total_skills: number;
    mastered_skills: number;
    learning_skills: number;
    struggling_skills: number;
    skills: SkillMastery[];
}

export interface QuestionRecommendation {
    recommended: boolean;
    skill_id?: string;
    skill_name?: string;
    topic?: string;
    current_mastery?: number;
    suggested_difficulty?: 'easy' | 'medium' | 'hard';
    reason?: string;
    error?: string;
}

class DKTService {
    private getAuthHeader() {
        const token = storage.getString('authToken');
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    /**
     * Log a student interaction after answering a question
     * This builds the learning history for DKT predictions
     */
    async logInteraction(params: {
        subject: string;
        topic: string;
        skill_id: string;
        question_id: string;
        correct: boolean;
        confidence?: 'low' | 'medium' | 'high';
        time_spent?: number; // seconds
        hints_used?: number;
        session_id?: string;
        device_id?: string;
    }): Promise<{ success: boolean; skill_mastery?: number; error?: string }> {
        try {
            const response = await axios.post(
                `${API_URL}/dkt/log-interaction`,
                params,
                { headers: this.getAuthHeader() }
            );

            return {
                success: true,
                skill_mastery: response.data.data?.skill_mastery,
            };
        } catch (error: any) {
            console.error('DKT log interaction error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to log interaction',
            };
        }
    }

    /**
     * Get visual knowledge map showing mastery across all skills
     * Use for dashboard visualization
     */
    async getKnowledgeMap(subject?: string): Promise<KnowledgeMap | null> {
        try {
            const params = subject ? { subject } : {};
            const response = await axios.get(`${API_URL}/dkt/knowledge-map`, {
                headers: this.getAuthHeader(),
                params,
            });

            return response.data.data as KnowledgeMap;
        } catch (error: any) {
            console.error('DKT get knowledge map error:', error);
            return null;
        }
    }

    /**
     * Get current mastery probability for a specific skill
     */
    async getSkillMastery(skill_id: string): Promise<{
        skill_id: string;
        mastery_probability: number;
        status: string;
        total_interactions: number;
        recent_history: Interaction[];
    } | null> {
        try {
            const response = await axios.get(`${API_URL}/dkt/mastery/${skill_id}`, {
                headers: this.getAuthHeader(),
            });

            return response.data.data;
        } catch (error: any) {
            console.error('DKT get skill mastery error:', error);
            return null;
        }
    }

    /**
     * Get personalized question recommendation based on DKT predictions
     * Returns optimal skill and difficulty to practice next
     */
    async getRecommendation(
        subject: string,
        topic?: string
    ): Promise<QuestionRecommendation> {
        try {
            const response = await axios.post(
                `${API_URL}/dkt/recommend-next`,
                { subject, topic },
                { headers: this.getAuthHeader() }
            );

            return response.data.data as QuestionRecommendation;
        } catch (error: any) {
            console.error('DKT get recommendation error:', error);
            return {
                recommended: false,
                error: error.response?.data?.message || 'Failed to get recommendation',
            };
        }
    }

    /**
     * Get student's interaction history
     */
    async getInteractionHistory(
        skill_id?: string,
        limit: number = 100
    ): Promise<Interaction[]> {
        try {
            const params: any = { limit };
            if (skill_id) params.skill_id = skill_id;

            const response = await axios.get(`${API_URL}/dkt/interaction-history`, {
                headers: this.getAuthHeader(),
                params,
            });

            return response.data.data.interactions as Interaction[];
        } catch (error: any) {
            console.error('DKT get interaction history error:', error);
            return [];
        }
    }

    /**
     * Helper: Get mastery status color for UI
     */
    getMasteryColor(mastery: number): string {
        if (mastery >= 0.8) return '#4CAF50'; // Green - Mastered
        if (mastery >= 0.6) return '#2196F3'; // Blue - Proficient
        if (mastery >= 0.4) return '#FF9800'; // Orange - Learning
        return '#F44336'; // Red - Struggling
    }

    /**
     * Helper: Get mastery status label
     */
    getMasteryLabel(mastery: number): string {
        if (mastery >= 0.8) return 'Mastered';
        if (mastery >= 0.6) return 'Proficient';
        if (mastery >= 0.4) return 'Learning';
        return 'Needs Practice';
    }

    /**
     * Helper: Map topic to skill_id
     * This is a simplified version - in production, fetch from taxonomy API
     */
    mapTopicToSkillId(subject: string, topic: string): string {
        // Basic skill ID generation
        // Format: subject_topic_normalized
        const normalized = topic.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        return `${subject.toLowerCase()}_${normalized}`;
    }
}

export const dktService = new DKTService();
