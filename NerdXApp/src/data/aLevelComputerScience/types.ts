// A-Level Computer Science Notes Type Definitions
// Types for ZIMSEC A-Level Computer Science 6023 (Forms 5-6)

export interface NotesSection {
    title: string;
    content: string; // Markdown formatted
    diagrams: Array<string | number>;
    subsections?: NotesSection[];
    interactive?: {
        type: 'simulation' | 'calculator' | 'builder' | 'practice';
        id: string;
        description: string;
    };
}

export interface TopicNotes {
    topic: string;
    subject: 'A-Level Computer Science';
    level: 'Form 5' | 'Form 6' | 'Both';
    summary: string;
    sections: NotesSection[];
    key_points: string[];
    exam_tips: string[];
    learning_objectives: string[];
    practical_activities?: string[];
    assessment_practice?: {
        past_papers: string[];
        mark_schemes: string[];
        examiner_reports: string[];
    };
}

export interface Topic {
    id: string;
    name: string;
    level: 'Form 5' | 'Form 6' | 'Both';
    form5_content?: boolean;
    form6_content?: boolean;
    parent_topic?: string;
}

export interface Simulation {
    id: string;
    name: string;
    description: string;
    topic: string;
    type: 'cpu_cycle' | 'osi_model' | 'floating_point' | 'database_normalization' | 'algorithm_visualization' | 'network_topology';
}

export interface ProgrammingExercise {
    id: string;
    title: string;
    description: string;
    topic: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    language: 'python' | 'java' | 'both';
    starter_code?: string;
    test_cases: Array<{
        input: any;
        expected_output: any;
        description: string;
    }>;
}

export interface DatabaseExercise {
    id: string;
    title: string;
    description: string;
    topic: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    erd_required: boolean;
    sql_queries_required: string[];
    sample_data?: any;
}

export interface SDLCProject {
    id: string;
    title: string;
    description: string;
    stages: Array<{
        stage: 'analysis' | 'design' | 'development' | 'testing' | 'evaluation';
        name: string;
        deliverables: string[];
        templates: string[];
    }>;
}
