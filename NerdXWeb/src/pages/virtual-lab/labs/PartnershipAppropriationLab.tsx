import { useCallback } from 'react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { virtualLabApi } from '../../../services/api/virtualLabApi';
import { AccountingQuestionLab, type AccountingLabQuestion } from './AccountingQuestionLab';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-partnership-appropriation',
  question_type: 'partnership_appropriation',
  difficulty_level: 'intermediate',
  marks: 20,
  time_estimate: '25 minutes',
  scenario: {
    business_name: 'Moyo & Dube Traders',
    financial_year_end: '31 December 2025',
    context:
      'Partnership. Prepare the Appropriation Account for the year ended 31 December 2025 and update partners’ capital/current accounts.',
    additional_info: 'Profit sharing ratio: 3:2 (Moyo:Dube). Interest on capital at 10% p.a.',
  },
  question_data: {
    trial_balance: [
      { account: 'Net Profit before appropriation', debit: null, credit: 90000 },
      { account: 'Moyo Capital', debit: null, credit: 150000 },
      { account: 'Dube Capital', debit: null, credit: 100000 },
      { account: 'Moyo Drawings', debit: 12000, credit: null },
      { account: 'Dube Drawings', debit: 8000, credit: null },
    ],
    adjustments: [
      { id: 'adj_1', type: 'partner_salary', description: 'Moyo salary: $18,000; Dube salary: $12,000.' },
      { id: 'adj_2', type: 'interest_on_capital', description: 'Apply 10% interest on partners’ capital balances.' },
      { id: 'adj_3', type: 'interest_on_drawings', description: 'Charge interest on drawings: Moyo $600; Dube $400.' },
    ],
  },
  requirements: [
    'Prepare the Appropriation Account for the year ended 31 December 2025',
    'Allocate the remaining profit in the ratio 3:2',
    'Update partners’ balances (capital/current) after appropriations and drawings',
  ],
  step_by_step_guidance: [
    { step: 1, instruction: 'Start with net profit', hint: 'Use net profit before appropriation as the base.' },
    { step: 2, instruction: 'Add interest on drawings', hint: 'Interest on drawings increases profit available for appropriation.' },
    { step: 3, instruction: 'Deduct salaries and interest on capital', hint: 'These are appropriations, not expenses.' },
    { step: 4, instruction: 'Share the residual profit', hint: 'Split remaining profit in the given ratio.' },
  ],
  model_answer_summary: {
    net_profit_before_appropriation: 90000,
    total_salaries: 30000,
    interest_on_capital_total: 25000,
    residual_profit: 35200,
  },
  source: 'fallback',
};

export function PartnershipAppropriationLab({ simulation }: { simulation: SimulationMetadata }) {
  const fetchQuestion = useCallback(async () => {
    return await virtualLabApi.getPartnershipAppropriationQuestion({
      difficulty_level: 'intermediate',
      format: 'vertical',
    });
  }, []);

  return <AccountingQuestionLab simulation={simulation} fallbackQuestion={FALLBACK_QUESTION} fetchQuestion={fetchQuestion} />;
}

