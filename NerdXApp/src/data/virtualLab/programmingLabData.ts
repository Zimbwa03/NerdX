// Virtual Programming Lab - Computer Science simulations
// Programming Lab, Web Design Lab, Database Lab

import { SimulationMetadata } from './simulationTypes';

export const PROGRAMMING_LAB_SIMULATIONS: SimulationMetadata[] = [
    {
        id: 'programming-lab',
        title: 'Programming Lab',
        subject: 'computer_science',
        topic: 'Programming',
        description:
            'Write and run code in Python, VB.NET, or Java. Get real-time syntax highlighting, error detection, and run your programs. Cambridge & ZIMSEC aligned.',
        difficulty: 'medium',
        xpReward: 150,
        estimatedTime: '15-30 mins',
        icon: 'code-slash',
        color: '#0066CC',
        learningObjectives: [
            { id: 'pl-1', text: 'Write and edit code in Python, VB.NET, or Java' },
            { id: 'pl-2', text: 'Use syntax highlighting and real-time error detection' },
            { id: 'pl-3', text: 'Run code and view output (Execution coming in Part 4)' },
            { id: 'pl-4', text: 'Use AI Assistant and hints (coming in Part 5)' },
        ],
        quizQuestions: [
            {
                id: 'pl-q1',
                question: 'Which keyword starts a function definition in Python?',
                options: ['function', 'def', 'func', 'fn'],
                correctIndex: 1,
                explanation: 'In Python, functions are defined with the "def" keyword.',
            },
            {
                id: 'pl-q2',
                question: 'In VB.NET, which keyword declares a variable?',
                options: ['var', 'Dim', 'let', 'declare'],
                correctIndex: 1,
                explanation: 'Dim is used to declare variables in VB.NET.',
            },
            {
                id: 'pl-q3',
                question: 'In Java, the entry point of a program is:',
                options: ['main()', 'start()', 'run()', 'execute()'],
                correctIndex: 0,
                explanation: 'The main() method is the entry point for Java applications.',
            },
        ],
    },
    {
        id: 'web-design-lab',
        title: 'Web Design Lab',
        subject: 'computer_science',
        topic: 'Web Design',
        description:
            'Learn HTML and CSS by designing real web pages. Write markup, preview your page, and get AI guidance aligned with ZIMSEC and Cambridge web design topics.',
        difficulty: 'medium',
        xpReward: 150,
        estimatedTime: '15-30 mins',
        icon: 'globe-outline',
        color: '#00897B',
        learningObjectives: [
            { id: 'wd-1', text: 'Understand basic HTML structure (head, body, tags)' },
            { id: 'wd-2', text: 'Use CSS to style text, colours and simple layouts' },
            { id: 'wd-3', text: 'Build simple web pages such as profiles, timetables and forms' },
            { id: 'wd-4', text: 'Relate examples to ZIMSEC and Cambridge web design requirements' },
        ],
        quizQuestions: [
            {
                id: 'wd-q1',
                question: 'Which HTML tag is used to create a main heading on a page?',
                options: ['<p>', '<head>', '<h1>', '<title>'],
                correctIndex: 2,
                explanation: '<h1> is the main heading tag used for the most important heading.',
            },
            {
                id: 'wd-q2',
                question: 'Which CSS property changes the background colour of a page?',
                options: ['color', 'background-color', 'font-color', 'page-color'],
                correctIndex: 1,
                explanation: 'Use background-color in CSS to change the background colour of an element or page.',
            },
            {
                id: 'wd-q3',
                question: 'Which of these is a valid HTML link tag?',
                options: [
                    '<a href=\"page.html\">Click here</a>',
                    '<link url=\"page.html\">Click here</link>',
                    '<href=\"page.html\">Click here</href>',
                    '<a link=\"page.html\">Click here</a>',
                ],
                correctIndex: 0,
                explanation: 'The <a> tag with an href attribute is used to create hyperlinks in HTML.',
            },
        ],
    },
    {
        id: 'database-lab',
        title: 'Database Lab',
        subject: 'computer_science',
        topic: 'Databases',
        description:
            'Learn what a database is and practice SQL. Create tables, insert data, and run SELECT, INSERT, UPDATE, DELETE. Cambridge & ZIMSEC aligned.',
        difficulty: 'medium',
        xpReward: 150,
        estimatedTime: '15-30 mins',
        icon: 'server-outline',
        color: '#5C6BC0',
        learningObjectives: [
            { id: 'db-1', text: 'Understand what a database is (tables, records, fields)' },
            { id: 'db-2', text: 'Create tables with CREATE TABLE (columns, data types, primary key)' },
            { id: 'db-3', text: 'Write SELECT with WHERE and ORDER BY' },
            { id: 'db-4', text: 'Write INSERT, UPDATE, DELETE and see the effect on data' },
            { id: 'db-5', text: 'Understand primary keys and simple relationships' },
        ],
        quizQuestions: [
            {
                id: 'db-q1',
                question: 'Which SQL command is used to retrieve data from a database?',
                options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
                correctIndex: 1,
                explanation: 'SELECT is used to retrieve (query) data from a database.',
            },
            {
                id: 'db-q2',
                question: 'What is a primary key?',
                options: [
                    'A key that opens the database',
                    'A unique identifier for each record in a table',
                    'The first column in a table',
                    'A password for the database',
                ],
                correctIndex: 1,
                explanation: 'A primary key uniquely identifies each record in a table.',
            },
            {
                id: 'db-q3',
                question: 'Which SQL statement adds a new row to a table?',
                options: ['SELECT', 'ADD', 'INSERT', 'CREATE'],
                correctIndex: 2,
                explanation: 'INSERT adds new rows (records) to a table.',
            },
        ],
    },
];
