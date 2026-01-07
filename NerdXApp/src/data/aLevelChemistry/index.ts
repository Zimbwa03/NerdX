// A Level Chemistry Data - Main Entry Point
export {
    aLevelChemistryTopics,
    getTopicById,
    getTopicsByLevel,
    getTopicsByCategory,
    getAllTopicNames,
} from './topics';
export type { ALevelChemistryTopic } from './topics';

// Export notes
export {
    aLevelChemistryNotes,
    getTopicNotes,
    getAllTopicNames as getAllNoteTopicNames,
} from './notes';