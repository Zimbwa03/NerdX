// A Level Biology Data Exports
export {
    aLevelBiologyTopics,
    biologyQuestionTypes,
    getTopicById,
    getTopicsByLevel,
    getAllTopicNames,
    getPracticalTopics,
    getTopicsByPaper,
    topicCounts
} from './topics';

// Notes exports
export {
    aLevelBiologyNotes,
    getTopicNotes,
    getAllTopicNames as getAllNoteTopicNames
} from './notes';

export type {
    ALevelBiologyTopic,
    BiologyQuestionType,
    BiologyQuestionTypeInfo
} from './topics';

