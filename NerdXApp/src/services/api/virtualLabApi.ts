// Virtual Lab API services
import api from './config';

export type VirtualLabSubject = 'biology' | 'chemistry' | 'physics' | 'mathematics';
export type VirtualLabDifficulty = 'easy' | 'medium' | 'hard';

export interface VirtualLabKnowledgeCheckQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface GenerateKnowledgeCheckPayload {
  simulation_id?: string;
  subject: VirtualLabSubject;
  topic: string;
  difficulty?: VirtualLabDifficulty;
  count: number;
}

// Geography Maps Lab – map_actions for AI feedback (DeepSeek)
export interface GeoMapsFeedbackPayload {
  level?: 'O' | 'A';
  topic?: string;
  task_type?: string;
  map_actions: {
    markers?: Array<{ name: string; lat: number; lon: number; student_label?: string }>;
    lines?: Array<{ points: Array<{ lat: number; lon: number }>; label?: string }>;
    measurements?: { distance_km?: number; bearing_deg?: number };
    selected_place?: { name: string; lat: number; lon: number };
  };
  student_answer_text?: string;
}

export interface GeoMapsFeedbackResult {
  response: string;
}

// Balance Sheet Lab – Vertex AI–generated question (different question each time)
export type BalanceSheetBusinessType = 'sole_trader' | 'partnership' | 'limited_company' | 'non_profit';
export type BalanceSheetDifficulty = 'basic' | 'intermediate' | 'advanced';

export interface BalanceSheetQuestion {
  question_id: string;
  question_type: string;
  business_type: string;
  difficulty_level: string;
  marks?: number;
  time_estimate?: string;
  scenario: {
    business_name: string;
    financial_year_end: string;
    context: string;
    additional_info?: string;
  };
  question_data: {
    trial_balance: Array<{ account: string; debit: number | null; credit: number | null }>;
    adjustments: Array<{ id: string; type: string; description: string }>;
  };
  requirements?: string[];
  step_by_step_guidance?: Array<{ step: number; instruction: string; hint: string }>;
  model_answer_summary?: Record<string, number>;
  source?: string;
}

export interface GetBalanceSheetQuestionPayload {
  business_type?: BalanceSheetBusinessType;
  difficulty_level?: BalanceSheetDifficulty;
  format?: 'horizontal' | 'vertical';
}

// Income Statement Lab – Vertex AI–generated question
export type IncomeStatementBusinessType = 'sole_trader' | 'partnership' | 'limited_company' | 'non_profit';
export type IncomeStatementDifficulty = 'basic' | 'intermediate' | 'advanced';

export interface IncomeStatementQuestion {
  question_id: string;
  question_type: string;
  business_type: string;
  difficulty_level: string;
  marks?: number;
  time_estimate?: string;
  scenario: {
    business_name: string;
    financial_year_end: string;
    context: string;
    additional_info?: string;
  };
  question_data: {
    trial_balance: Array<{ account: string; debit: number | null; credit: number | null }>;
    adjustments: Array<{ id: string; type: string; description: string }>;
  };
  requirements?: string[];
  step_by_step_guidance?: Array<{ step: number; instruction: string; hint: string }>;
  model_answer_summary?: {
    net_sales?: number;
    cost_of_sales?: number;
    gross_profit?: number;
    total_expenses?: number;
    net_profit?: number;
  };
  source?: string;
}

export interface GetIncomeStatementQuestionPayload {
  business_type?: IncomeStatementBusinessType;
  difficulty_level?: IncomeStatementDifficulty;
  format?: 'horizontal' | 'vertical';
}

// Shared question shape for accounting labs (scenario, question_data with trial_balance + adjustments, steps, model_answer_summary)
export interface AccountingLabQuestion {
  question_id: string;
  question_type: string;
  difficulty_level: string;
  marks?: number;
  time_estimate?: string;
  scenario: {
    business_name: string;
    financial_year_end: string;
    context: string;
    additional_info?: string;
  };
  question_data: {
    trial_balance: Array<{ account: string; debit: number | null; credit: number | null }>;
    adjustments: Array<{ id: string; type: string; description: string }>;
    errors?: Array<{ id: string; type: string; description: string }>;
  };
  requirements?: string[];
  step_by_step_guidance?: Array<{ step: number; instruction: string; hint: string }>;
  model_answer_summary?: Record<string, number>;
  source?: string;
}

export interface GetAccountingLabQuestionPayload {
  difficulty_level?: 'basic' | 'intermediate' | 'advanced';
  format?: 'horizontal' | 'vertical';
}

export const virtualLabApi = {
  getBalanceSheetQuestion: async (
    payload?: GetBalanceSheetQuestionPayload
  ): Promise<BalanceSheetQuestion> => {
    const response = await api.post<{ success: boolean; data: BalanceSheetQuestion }>(
      '/api/mobile/virtual-lab/balance-sheet-question',
      payload || {},
      { timeout: 60000 }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error((response.data as any)?.message || 'Failed to load question');
    }
    return response.data.data;
  },

  getIncomeStatementQuestion: async (
    payload?: GetIncomeStatementQuestionPayload
  ): Promise<IncomeStatementQuestion> => {
    const response = await api.post<{ success: boolean; data: IncomeStatementQuestion }>(
      '/api/mobile/virtual-lab/income-statement-question',
      payload || {},
      { timeout: 60000 }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error((response.data as any)?.message || 'Failed to load question');
    }
    return response.data.data;
  },

  getPartnershipAppropriationQuestion: async (
    payload?: GetAccountingLabQuestionPayload
  ): Promise<AccountingLabQuestion> => {
    const response = await api.post<{ success: boolean; data: AccountingLabQuestion }>(
      '/api/mobile/virtual-lab/partnership-appropriation-question',
      payload || {},
      { timeout: 60000 }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error((response.data as any)?.message || 'Failed to load question');
    }
    return response.data.data;
  },

  getCashFlowQuestion: async (
    payload?: GetAccountingLabQuestionPayload
  ): Promise<AccountingLabQuestion> => {
    const response = await api.post<{ success: boolean; data: AccountingLabQuestion }>(
      '/api/mobile/virtual-lab/cash-flow-question',
      payload || {},
      { timeout: 60000 }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error((response.data as any)?.message || 'Failed to load question');
    }
    return response.data.data;
  },

  getManufacturingAccountQuestion: async (
    payload?: GetAccountingLabQuestionPayload
  ): Promise<AccountingLabQuestion> => {
    const response = await api.post<{ success: boolean; data: AccountingLabQuestion }>(
      '/api/mobile/virtual-lab/manufacturing-account-question',
      payload || {},
      { timeout: 60000 }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error((response.data as any)?.message || 'Failed to load question');
    }
    return response.data.data;
  },

  getCorrectionOfErrorsQuestion: async (
    payload?: GetAccountingLabQuestionPayload
  ): Promise<AccountingLabQuestion> => {
    const response = await api.post<{ success: boolean; data: AccountingLabQuestion }>(
      '/api/mobile/virtual-lab/correction-of-errors-question',
      payload || {},
      { timeout: 60000 }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error((response.data as any)?.message || 'Failed to load question');
    }
    return response.data.data;
  },

  getNotForProfitQuestion: async (
    payload?: GetAccountingLabQuestionPayload
  ): Promise<AccountingLabQuestion> => {
    const response = await api.post<{ success: boolean; data: AccountingLabQuestion }>(
      '/api/mobile/virtual-lab/not-for-profit-question',
      payload || {},
      { timeout: 60000 }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error((response.data as any)?.message || 'Failed to load question');
    }
    return response.data.data;
  },

  generateKnowledgeCheck: async (
    payload: GenerateKnowledgeCheckPayload
  ): Promise<{ questions: VirtualLabKnowledgeCheckQuestion[]; credits_remaining?: number }> => {
    const response = await api.post('/api/mobile/virtual-lab/knowledge-check', payload, {
      timeout: 120000, // Increase timeout to 120s for AI generation
    });
    const data = response.data.data || [];
    const credits_remaining = response.data.credits_remaining;
    return { questions: Array.isArray(data) ? data : [], credits_remaining };
  },

  getGeoMapsFeedback: async (
    payload: GeoMapsFeedbackPayload
  ): Promise<{ response: string; credits_remaining?: string }> => {
    const res = await api.post<{
      success: boolean;
      data: GeoMapsFeedbackResult;
      credits_remaining?: string;
    }>('/api/mobile/virtual-lab/geo-maps-feedback', payload, {
      timeout: 90000,
    });
    if (!res.data.success || !res.data.data) {
      throw new Error((res.data as any)?.message || 'Failed to get feedback');
    }
    return {
      response: res.data.data.response,
      credits_remaining: res.data.credits_remaining,
    };
  },
};

