// ZIMSEC O-Level Principles of Accounting (7112) - 15 topics
// Paper 1: 40 MCQs | Paper 2: Structured

export interface AccountingTopic {
  id: string;
  name: string;
  description: string;
  hasNotes?: boolean;
}

export const accountingTopics: AccountingTopic[] = [
  {
    id: 'introduction_to_principles_of_accounting',
    name: 'Introduction to Principles of Accounting',
    description: 'Purpose of accounting; users of financial information; accounting concepts.',
    hasNotes: true,
  },
  {
    id: 'types_of_business_organizations',
    name: 'Types of Business Organizations',
    description: 'Sole trader; partnership; limited companies; accounting implications.',
    hasNotes: true,
  },
  {
    id: 'source_documents_and_books_of_prime_entry',
    name: 'Source Documents and Books of Prime Entry',
    description: 'Invoices; receipts; cash book; sales/purchases day books.',
    hasNotes: true,
  },
  {
    id: 'ledger_and_double_entry',
    name: 'Ledger and Double Entry',
    description: 'Double-entry bookkeeping; ledger accounts; balancing.',
    hasNotes: true,
  },
  {
    id: 'trial_balance',
    name: 'Trial Balance',
    description: 'Extracting a trial balance; errors revealed and not revealed.',
    hasNotes: true,
  },
  {
    id: 'correction_of_errors',
    name: 'Correction of Errors',
    description: 'Types of errors; journal entries to correct errors.',
    hasNotes: true,
  },
  {
    id: 'financial_statements_sole_trader',
    name: 'Financial Statements (Sole Trader)',
    description: 'Income statement; statement of financial position.',
    hasNotes: true,
  },
  {
    id: 'adjustments',
    name: 'Adjustments (Accruals, Prepayments, Depreciation)',
    description: 'Accruals and prepayments; depreciation methods.',
    hasNotes: true,
  },
  {
    id: 'incomplete_records',
    name: 'Incomplete Records',
    description: 'Preparing accounts from incomplete records.',
    hasNotes: true,
  },
  {
    id: 'partnership_accounts',
    name: 'Partnership Accounts',
    description: 'Capital and current accounts; profit sharing; appropriation.',
    hasNotes: true,
  },
  {
    id: 'company_accounts',
    name: 'Company Accounts',
    description: 'Share capital; reserves; company financial statements.',
    hasNotes: true,
  },
  {
    id: 'cash_flow',
    name: 'Cash Flow',
    description: 'Cash flow statement; operating, investing, financing activities.',
    hasNotes: true,
  },
  {
    id: 'interpretation_of_financial_statements',
    name: 'Interpretation of Financial Statements',
    description: 'Ratios; profitability; liquidity; efficiency.',
    hasNotes: true,
  },
  {
    id: 'not_for_profit_organizations',
    name: 'Not-for-Profit Organizations',
    description: 'Receipts and payments; income and expenditure.',
    hasNotes: true,
  },
  {
    id: 'manufacturing_accounts',
    name: 'Manufacturing Accounts',
    description: 'Manufacturing account; cost of production.',
    hasNotes: true,
  },
];

export const getTopicById = (id: string): AccountingTopic | undefined => accountingTopics.find((t) => t.id === id);
export const getTopicByName = (name: string): AccountingTopic | undefined => accountingTopics.find((t) => t.name === name);
export const getTopicsWithNotes = (): AccountingTopic[] => accountingTopics.filter((t) => t.hasNotes);
export const getAllTopicNames = (): string[] => accountingTopics.map((t) => t.name);

