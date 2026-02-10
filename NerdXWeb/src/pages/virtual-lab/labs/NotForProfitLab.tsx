import { useCallback } from 'react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { virtualLabApi } from '../../../services/api/virtualLabApi';
import { AccountingQuestionLab, type AccountingLabQuestion } from './AccountingQuestionLab';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-not-for-profit',
  question_type: 'not_for_profit',
  difficulty_level: 'intermediate',
  marks: 20,
  time_estimate: '25 minutes',
  scenario: {
    business_name: 'Kwekwe Youth Sports Club',
    financial_year_end: '31 December 2025',
    context:
      'Not-for-profit organization. Prepare an Income and Expenditure Account and a Statement of Financial Position using the information provided.',
    additional_info: 'Subscriptions: treat arrears and prepayments correctly.',
  },
  question_data: {
    trial_balance: [
      { account: 'Subscriptions received (cash)', debit: null, credit: 18000 },
      { account: 'Bar takings', debit: null, credit: 6500 },
      { account: 'Wages', debit: 4200, credit: null },
      { account: 'Rent', debit: 2400, credit: null },
      { account: 'Equipment', debit: 12000, credit: null },
      { account: 'Bank balance', debit: 3200, credit: null },
    ],
    adjustments: [
      { id: 'adj_1', type: 'subscriptions', description: 'Subscriptions in arrears: $1,200; subscriptions prepaid: $800.' },
      { id: 'adj_2', type: 'depreciation', description: 'Depreciate equipment by $1,500 for the year.' },
      { id: 'adj_3', type: 'accrual', description: 'Rent owing at year-end: $300.' },
    ],
  },
  requirements: [
    'Prepare an Income and Expenditure Account for the year ended 31 December 2025',
    'Prepare a Statement of Financial Position at 31 December 2025',
    'Show subscriptions adjustment clearly',
  ],
  step_by_step_guidance: [
    { step: 1, instruction: 'Compute subscription income', hint: 'Adjust cash received for arrears and prepayments.' },
    { step: 2, instruction: 'Prepare Income & Expenditure', hint: 'Use accrual basis; include depreciation.' },
    { step: 3, instruction: 'Find surplus/deficit', hint: 'Income - expenditure.' },
    { step: 4, instruction: 'Prepare Statement of Financial Position', hint: 'Assets and liabilities at year-end.' },
  ],
  model_answer_summary: {
    subscription_income: 18400,
    surplus: 8700,
  },
  source: 'fallback',
};

export function NotForProfitLab({ simulation }: { simulation: SimulationMetadata }) {
  const fetchQuestion = useCallback(async () => {
    return await virtualLabApi.getNotForProfitQuestion({ difficulty_level: 'intermediate', format: 'vertical' });
  }, []);

  return <AccountingQuestionLab simulation={simulation} fallbackQuestion={FALLBACK_QUESTION} fetchQuestion={fetchQuestion} />;
}

