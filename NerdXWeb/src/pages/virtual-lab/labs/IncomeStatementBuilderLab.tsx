import { useCallback } from 'react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { virtualLabApi } from '../../../services/api/virtualLabApi';
import { AccountingQuestionLab, type AccountingLabQuestion } from './AccountingQuestionLab';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-income-statement',
  question_type: 'income_statement',
  difficulty_level: 'intermediate',
  marks: 18,
  time_estimate: '22 minutes',
  scenario: {
    business_name: 'Chipo General Dealer',
    financial_year_end: '31 December 2025',
    context:
      'Sole trader. Prepare an Income Statement (Profit and Loss Account) for the year ended 31 December 2025 showing Gross Profit and Net Profit.',
    additional_info: '',
  },
  question_data: {
    trial_balance: [
      { account: 'Sales', debit: null, credit: 240000 },
      { account: 'Sales Returns', debit: 4000, credit: null },
      { account: 'Purchases', debit: 140000, credit: null },
      { account: 'Purchases Returns', debit: null, credit: 3000 },
      { account: 'Inventory (1 Jan 2025)', debit: 20000, credit: null },
      { account: 'Wages and Salaries', debit: 45000, credit: null },
      { account: 'Rent', debit: 18000, credit: null },
      { account: 'Insurance', debit: 3600, credit: null },
      { account: 'Electricity', debit: 5400, credit: null },
      { account: 'Discount Received', debit: null, credit: 1200 },
    ],
    adjustments: [
      { id: 'adj_1', type: 'closing_stock', description: 'Closing inventory valued at $25,000.' },
      { id: 'adj_2', type: 'accrual', description: 'Wages owing at year-end: $3,000.' },
      { id: 'adj_3', type: 'prepayment', description: 'Insurance prepaid at year-end: $600.' },
      { id: 'adj_4', type: 'accrual', description: 'Electricity owing at year-end: $500.' },
    ],
  },
  requirements: [
    'Prepare an Income Statement for the year ended 31 December 2025',
    'Show: Net Sales, Cost of Sales, Gross Profit, and Net Profit',
  ],
  step_by_step_guidance: [
    { step: 1, instruction: 'Calculate Net Sales', hint: 'Sales minus sales returns.' },
    { step: 2, instruction: 'Calculate Cost of Sales', hint: 'Opening stock + purchases - returns - closing stock.' },
    { step: 3, instruction: 'Calculate Gross Profit', hint: 'Net Sales - Cost of Sales.' },
    { step: 4, instruction: 'Calculate Net Profit', hint: '(Gross Profit + other income) - expenses (adjusted).' },
  ],
  model_answer_summary: {
    net_sales: 236000,
    cost_of_sales: 132000,
    gross_profit: 104000,
    net_profit: 31700,
  },
  source: 'fallback',
};

export function IncomeStatementBuilderLab({ simulation }: { simulation: SimulationMetadata }) {
  const fetchQuestion = useCallback(async () => {
    return await virtualLabApi.getIncomeStatementQuestion({
      business_type: 'sole_trader',
      difficulty_level: 'intermediate',
      format: 'vertical',
    });
  }, []);

  return <AccountingQuestionLab simulation={simulation} fallbackQuestion={FALLBACK_QUESTION} fetchQuestion={fetchQuestion} />;
}

