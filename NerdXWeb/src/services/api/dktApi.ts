// Deep Knowledge Tracing (DKT) + AI Insights API (web)
// Uses existing mobile endpoints for parity without backend changes.
import api from './config';

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

export interface DailyReviewItem {
  skill_id: string;
  skill_name: string;
  subject: string;
  topic: string;
  due_date: string;
}

export interface DailyReviewResponse {
  count: number;
  reviews: DailyReviewItem[];
}

export interface AIInsightsSkill {
  skill_name: string;
  subject: string;
  topic: string;
  mastery: number;
  status: string;
  recommendation?: string | null;
}

export interface AIInsightsStudyPlanItem {
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  estimated_time: string;
}

export interface AIInsightsWeeklyTrend {
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  active_days: number;
  daily_breakdown: Array<{ date: string; count: number }>;
}

export interface AIInsightsFailedArea {
  skill_id: string;
  skill_name: string;
  subject: string;
  topic: string;
  fail_count: number;
}

export interface AIInsights {
  health_score: number;
  total_skills: number;
  mastered_count: number;
  learning_count: number;
  struggling_count: number;
  strengths: AIInsightsSkill[];
  focus_areas: AIInsightsSkill[];
  weekly_trend: AIInsightsWeeklyTrend;
  study_plan: AIInsightsStudyPlanItem[];
  personalized_message: string;
  failed_areas: AIInsightsFailedArea[];
  net_decks_message: string;
  last_updated: string;
}

export const dktApi = {
  getKnowledgeMap: async (subject?: string): Promise<KnowledgeMap | null> => {
    try {
      const params = subject ? { subject } : undefined;
      const response = await api.get('/api/mobile/dkt/knowledge-map', { params });
      return (response.data?.data ?? null) as KnowledgeMap | null;
    } catch (error) {
      console.error('DKT getKnowledgeMap error:', error);
      return null;
    }
  },

  getDailyReview: async (): Promise<DailyReviewResponse> => {
    try {
      const response = await api.get('/api/mobile/dkt/daily-review');
      const count = typeof response.data?.count === 'number' ? response.data.count : 0;
      const reviews = Array.isArray(response.data?.reviews) ? (response.data.reviews as DailyReviewItem[]) : [];
      return { count, reviews };
    } catch (error) {
      console.error('DKT getDailyReview error:', error);
      return { count: 0, reviews: [] };
    }
  },

  getAIInsights: async (): Promise<AIInsights | null> => {
    try {
      const response = await api.get('/api/mobile/dkt/ai-insights');
      return (response.data?.data ?? null) as AIInsights | null;
    } catch (error) {
      console.error('DKT getAIInsights error:', error);
      return null;
    }
  },
};

export function getMasteryColor(mastery: number): string {
  if (mastery >= 0.8) return '#22C55E'; // Green
  if (mastery >= 0.6) return '#3B82F6'; // Blue
  if (mastery >= 0.4) return '#F59E0B'; // Orange
  return '#EF4444'; // Red
}

export function getMasteryLabel(mastery: number): string {
  if (mastery >= 0.8) return 'Mastered';
  if (mastery >= 0.6) return 'Proficient';
  if (mastery >= 0.4) return 'Learning';
  return 'Needs Practice';
}

