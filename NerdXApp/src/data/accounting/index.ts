// ZIMSEC O-Level Principles of Accounting 7112 — Accounting data
export {
  accountingTopics,
  getTopicById,
  getTopicByName,
  getTopicsWithNotes,
  getAllTopicNames,
} from './topics';
export type { AccountingTopic } from './topics';

export {
  accountingNotes,
  getTopicNotes,
  getAllTopicNames as getAllAccountingNoteTopicNames,
} from './notes';
