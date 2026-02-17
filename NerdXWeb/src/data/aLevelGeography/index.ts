// A Level Geography Data - Main Entry Point
export {
    aLevelGeographyTopics,
    getTopicById,
    getTopicsByPaper,
    getAllTopicNames,
    topicCounts,
} from './topics';
export type { ALevelGeographyTopic } from './topics';

export {
    aLevelGeographyNotes,
    getTopicNotes,
    getAllTopicNames as getAllGeographyNoteTopicNames,
} from './notes';
