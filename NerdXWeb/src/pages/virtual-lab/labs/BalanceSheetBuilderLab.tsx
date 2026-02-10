import { useCallback } from 'react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { virtualLabApi } from '../../../services/api/virtualLabApi';
import { AccountingQuestionLab, type AccountingLabQuestion } from './AccountingQuestionLab';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-balance-sheet',
  question_type: 'balance_sheet',
  difficulty_level: 'intermediate',
  marks: 18,
  time_estimate: '22 minutes',
  scenario: {
    business_name: 'Chipo General Dealer',
    financial_year_end: '31 December 2025',
    context:
      'Sole trader. Prepare a Statement of Financial Position for the year ended 31 December 2025 using the trial balance and adjustments.',
    additional_info: '',
  },
  question_data: {
    trial_balance: [
      { account: 'Premises', debit: 120000, credit: null },
      { account: 'Motor vehicles', debit: 60000, credit: null },
      { account: 'Inventory (closing)', debit: 25000, credit: null },
      { account: 'Trade receivables', debit: 18000, credit: null },
      { account: 'Bank', debit: 9500, credit: null },
      { account: 'Trade payables', debit: null, credit: 14000 },
      { account: 'Capital (1 Jan 2025)', debit: null, credit: 145000 },
      { account: 'Drawings', debit: 12000, credit: null },
      { account: 'Profit for the year', debit: null, credit: 31700 },
    ],
    adjustments: [
      { id: 'adj_1', type: 'depreciation', description: 'Depreciate motor vehicles by 10% per annum on cost.' },
      { id: 'adj_2', type: 'accrual', description: 'Electricity owing at year-end: $500.' },
      { id: 'adj_3', type: 'prepayment', description: 'Insurance prepaid at year-end: $600.' },
    ],
  },
  requirements: [
    'Prepare a Statement of Financial Position (Balance Sheet) at 31 December 2025',
    'Classify assets and liabilities correctly',
    'Show working capital and capital calculations clearly',
  ],
  step_by_step_guidance: [
    { step: 1, instruction: 'List non-current assets', hint: 'Premises, motor vehicles, equipment, etc.' },
    { step: 2, instruction: 'List current assets', hint: 'Inventory, trade receivables, bank/cash, prepayments.' },
    { step: 3, instruction: 'List liabilities', hint: 'Trade payables, accruals, loans.' },
    { step: 4, instruction: 'Calculate capital', hint: 'Opening capital + profit - drawings.' },
  ],
  model_answer_summary: {
    non_current_assets_total: 174000,
    current_assets_total: 52500,
    current_liabilities_total: 14500,
    working_capital: 38000,
    capital_total: 164700,
  },
  source: 'fallback',
};

export function BalanceSheetBuilderLab({ simulation }: { simulation: SimulationMetadata }) {
  const fetchQuestion = useCallback(async () => {
    return await virtualLabApi.getBalanceSheetQuestion({
      business_type: 'sole_trader',
      difficulty_level: 'intermediate',
      format: 'vertical',
    });
  }, []);

  return <AccountingQuestionLab simulation={simulation} fallbackQuestion={FALLBACK_QUESTION} fetchQuestion={fetchQuestion} />;
}

