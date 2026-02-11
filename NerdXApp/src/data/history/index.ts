// ZIMSEC O-Level History – Data exports
export {
  historyTopics,
  historyFormLevels,
  getTopicById,
  getTopicByName,
  getTopicsWithNotes,
  getAllTopicNames,
  getHistoryTopicsByForm,
  historyTopicsForQuiz,
  getHistoryTopicsForQuizByForm,
} from './topics';
export type { HistoryTopic, HistoryFormLevel } from './topics';

export {
  historyNotes,
  getTopicNotes,
  getAllHistoryNoteTopicNames,
} from './notes';
