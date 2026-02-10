// Web Design Lab - Curriculum & Exercises
// ZIMSEC + Cambridge focused subset for HTML/CSS

import type { WebLanguage } from '../../../types/webDesignLabTypes';

export type Board = 'cambridge' | 'zimsec';

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export type ExerciseType = 'guided' | 'challenge' | 'project' | 'exam-prep';

export interface Hint {
    level: 1 | 2 | 3;
    text: string;
    cost: number;
    unlockAfterSeconds?: number;
}

export interface TestCase {
    id: string;
    name: string;
    expectedOutputDescription: string;
}

export interface RubricCriterion {
    id: string;
    name: string;
    description: string;
    points: number;
    autoGraded: boolean;
}

export interface Rubric {
    criteria: RubricCriterion[];
    maxScore: number;
}

export interface Exercise {
    id: string;
    title: string;
    difficulty: ExerciseDifficulty;
    type: ExerciseType;
    description: string;
    problemStatement: string;
    language: WebLanguage;
    starterCode?: string;
    hints: Hint[];
    testCases: TestCase[];
    solutionOutline: string;
    rubric: Rubric;
    timeEstimateMinutes: number;
    points: number;
    tags: string[];
    board: Board;
}

export interface CodeExample {
    id: string;
    title: string;
    description: string;
    language: WebLanguage;
    code: string;
    explanation: string;
    concepts: string[];
    canEdit: boolean;
    canRun: boolean;
}

export interface Subtopic {
    id: string;
    title: string;
    contentMarkdown: string;
    codeExamples: CodeExample[];
    exercises: Exercise[];
}

export interface Topic {
    id: string;
    number: string;
    title: string;
    description: string;
    learningObjectives: string[];
    prerequisites: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedHours: number;
    subtopics: Subtopic[];
}

export interface Curriculum {
    id: string;
    name: string;
    board: Board;
    level: 'O-Level' | 'A-Level';
    code: string;
    topics: Topic[];
}

const BASIC_PAGE_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>School Homepage</title>
</head>
<body>
  <h1>Welcome to Example High School</h1>
  <p>This is a simple web page created in the Web Design Lab.</p>
</body>
</html>`;

// ----- ZIMSEC O-Level Web Design subset -----

export const ZimsecWebDesignCurriculum: Curriculum = {
    id: 'zimsec-6023-web-design',
    name: 'ZIMSEC O-Level Computer Science (Web Design)',
    board: 'zimsec',
    level: 'O-Level',
    code: '6023',
    topics: [
        {
            id: 'zim-web-topic-1',
            number: '1',
            title: 'HTML Basics',
            description: 'Introduction to HTML structure and common tags.',
            learningObjectives: [
                'Identify the structure of an HTML document',
                'Use basic tags such as <h1>, <p>, <a>, and <img>',
                'Create simple school or personal web pages',
            ],
            prerequisites: [],
            difficulty: 'beginner',
            estimatedHours: 6,
            subtopics: [
                {
                    id: 'zim-web-subtopic-1-1',
                    title: 'HTML Structure',
                    contentMarkdown:
                        '# HTML Structure\\n\\nEvery HTML page uses <!DOCTYPE html>, <html>, <head>, and <body> tags. This topic shows how to assemble a complete page.',
                    codeExamples: [
                        {
                            id: 'zim-html-example-basic-page',
                            title: 'Basic School Homepage',
                            description: 'A minimal HTML5 page for a school website.',
                            language: 'html',
                            code: BASIC_PAGE_CODE,
                            explanation:
                                'Demonstrates the required structure and uses headings and paragraphs to present information.',
                            concepts: ['doctype', 'html element', 'head', 'body', 'paragraph'],
                            canEdit: true,
                            canRun: true,
                        },
                    ],
                    exercises: [
                        {
                            id: 'zim-web-ex-1',
                            title: 'Create a School Homepage',
                            difficulty: 'easy',
                            type: 'guided',
                            description:
                                'Design a school homepage containing the school name, a heading, and at least two paragraphs describing the school.',
                            problemStatement:
                                'Create an HTML page with a main heading showing the school name and two paragraphs describing activities at the school.',
                            language: 'html',
                            starterCode: BASIC_PAGE_CODE,
                            hints: [
                                {
                                    level: 1,
                                    text: 'Use <h1> for the school name and <p> for each paragraph.',
                                    cost: 5,
                                },
                            ],
                            testCases: [
                                {
                                    id: 'zim-web-ex-1-tc-1',
                                    name: 'Uses main heading',
                                    expectedOutputDescription: 'The page contains an <h1> element with the school name.',
                                },
                                {
                                    id: 'zim-web-ex-1-tc-2',
                                    name: 'Includes two paragraphs',
                                    expectedOutputDescription: 'There are at least two <p> elements describing the school.',
                                },
                            ],
                            solutionOutline:
                                'Wrap content in standard HTML structure; place <h1> inside <body> followed by two <p> tags with suitable text.',
                            rubric: {
                                criteria: [
                                    {
                                        id: 'zim-web-ex-1-structure',
                                        name: 'Correct HTML structure',
                                        description: 'Page uses <!DOCTYPE html>, <html>, <head>, and <body> correctly.',
                                        points: 40,
                                        autoGraded: false,
                                    },
                                    {
                                        id: 'zim-web-ex-1-content',
                                        name: 'Content and headings',
                                        description: 'Meaningful heading and paragraphs for the school.',
                                        points: 60,
                                        autoGraded: false,
                                    },
                                ],
                                maxScore: 100,
                            },
                            timeEstimateMinutes: 20,
                            points: 80,
                            tags: ['html', 'structure', 'school-website'],
                            board: 'zimsec',
                        },
                    ],
                },
            ],
        },
    ],
};

// ----- Cambridge AS/A Level Web Design subset -----

export const CambridgeWebDesignCurriculum: Curriculum = {
    id: 'cambridge-9618-web-design',
    name: 'Cambridge International AS & A Level Computer Science (Web Design)',
    board: 'cambridge',
    level: 'A-Level',
    code: '9618',
    topics: [
        {
            id: 'cam-web-topic-1',
            number: '1',
            title: 'HTML5 & Semantic Tags',
            description: 'Use semantic elements to build accessible web pages.',
            learningObjectives: [
                'Differentiate between structural and semantic HTML elements',
                'Use <header>, <nav>, <section>, and <footer> appropriately',
                'Relate semantic tags to accessibility and maintainability',
            ],
            prerequisites: [],
            difficulty: 'intermediate',
            estimatedHours: 8,
            subtopics: [
                {
                    id: 'cam-web-subtopic-1-1',
                    title: 'Semantic Layout',
                    contentMarkdown:
                        '# Semantic Layout\\n\\nSemantic tags such as <header>, <nav>, <main>, <section>, and <footer> describe the purpose of content on the page.',
                    codeExamples: [
                        {
                            id: 'cam-html-example-semantic',
                            title: 'College Landing Page Skeleton',
                            description: 'A semantic layout using header, nav, and footer.',
                            language: 'html',
                            code: `<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\" />
  <title>College Landing Page</title>
</head>
<body>
  <header>
    <h1>NerdX College</h1>
  </header>
  <nav>
    <a href=\"#courses\">Courses</a> |
    <a href=\"#admissions\">Admissions</a> |
    <a href=\"#contact\">Contact</a>
  </nav>
  <main>
    <section id=\"courses\">
      <h2>Courses</h2>
      <p>Details about Computer Science and Web Design courses.</p>
    </section>
  </main>
  <footer>
    <p>&copy; 2026 NerdX College</p>
  </footer>
</body>
</html>`,
                            explanation:
                                'Shows how semantic tags divide the page into logical regions which is important for Cambridge exam style questions.',
                            concepts: ['semantic-html', 'header', 'nav', 'footer'],
                            canEdit: true,
                            canRun: true,
                        },
                    ],
                    exercises: [
                        {
                            id: 'cam-web-ex-1',
                            title: 'Design a College Landing Page',
                            difficulty: 'medium',
                            type: 'project',
                            description:
                                'Create a landing page for a college using semantic HTML5 tags and a clear navigation structure.',
                            problemStatement:
                                'Using semantic tags, create a landing page with sections for Courses, Admissions, and Contact, plus a consistent header and footer.',
                            language: 'html',
                            starterCode: '',
                            hints: [
                                {
                                    level: 1,
                                    text: 'Start with <header>, <nav>, <main>, and <footer> sections.',
                                    cost: 5,
                                },
                            ],
                            testCases: [
                                {
                                    id: 'cam-web-ex-1-tc-1',
                                    name: 'Uses semantic tags',
                                    expectedOutputDescription:
                                        'Page includes <header>, <nav>, at least one <section>, and <footer>.',
                                },
                            ],
                            solutionOutline:
                                'Organise the layout using semantic tags and ensure each section has clear headings and descriptive text.',
                            rubric: {
                                criteria: [
                                    {
                                        id: 'cam-web-ex-1-semantic',
                                        name: 'Semantic structure',
                                        description:
                                            'Appropriate use of semantic tags to organise page content.',
                                        points: 60,
                                        autoGraded: false,
                                    },
                                    {
                                        id: 'cam-web-ex-1-content',
                                        name: 'Content and clarity',
                                        description:
                                            'Clear headings, navigation links, and descriptive text for each section.',
                                        points: 40,
                                        autoGraded: false,
                                    },
                                ],
                                maxScore: 100,
                            },
                            timeEstimateMinutes: 30,
                            points: 100,
                            tags: ['semantic-html', 'layout'],
                            board: 'cambridge',
                        },
                    ],
                },
            ],
        },
    ],
};

// Helper lookup

export const findWebDesignExerciseById = (exerciseId: string | undefined | null): Exercise | undefined => {
    if (!exerciseId) return undefined;

    const curricula: Curriculum[] = [ZimsecWebDesignCurriculum, CambridgeWebDesignCurriculum];

    for (const curriculum of curricula) {
        for (const topic of curriculum.topics) {
            for (const sub of topic.subtopics) {
                const match = sub.exercises.find((ex) => ex.id === exerciseId);
                if (match) {
                    return match;
                }
            }
        }
    }
    return undefined;
};

