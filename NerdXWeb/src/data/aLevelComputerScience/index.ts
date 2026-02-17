// A Level Computer Science Data Exports
export {
    aLevelComputerScienceTopics,
    computerScienceQuestionTypes,
    getTopicById,
    getTopicsByLevel,
    getAllTopicNames,
    getTopicsByPaper,
    getTopicsWithSimulation,
    getTopicsWithProgramming,
    getTopicsWithDatabase,
    getTopicsWithSDLC,
    topicCounts
} from './topics';

// Notes exports (to be created)
// export {
//     aLevelComputerScienceNotes,
//     getTopicNotes,
//     getAllTopicNames as getAllNoteTopicNames
// } from './notes';

export type {
    ALevelComputerScienceTopic,
    ComputerScienceQuestionType,
    ComputerScienceQuestionTypeInfo
} from './topics';

export type {
    TopicNotes,
    NotesSection,
    Topic,
    Simulation,
    ProgrammingExercise,
    DatabaseExercise,
    SDLCProject
} from './types';
