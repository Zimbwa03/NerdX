// Virtual Programming Lab - Computer Science simulations
// Programming Lab entry; extend with Web Design Lab, Database Lab later

import { SimulationMetadata } from './simulationTypes';

export const PROGRAMMING_LAB_SIMULATIONS: SimulationMetadata[] = [
    {
        id: 'programming-lab',
        title: 'Programming Lab',
        subject: 'computer_science',
        topic: 'Programming',
        description: 'Write and run code in Python, VB.NET, or Java. Get real-time syntax highlighting, error detection, and run your programs. Cambridge & ZIMSEC aligned.',
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
];
