// Virtual Programming Lab - Curriculum & Exercises (Part 4)
// Cambridge 9618 + ZIMSEC 6023 (Programming-focused subset)

import type { ProgrammingLanguage } from '../../../types/programmingLabTypes';

export type Board = 'cambridge' | 'zimsec';

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export type ExerciseType = 'guided' | 'challenge' | 'project' | 'exam-prep';

export interface Hint {
    level: 1 | 2 | 3;
    text: string;
    cost: number; // points deducted for viewing (future use)
    unlockAfterSeconds?: number;
}

export interface TestCase {
    id: string;
    name: string;
    input: string;
    expectedOutput: string;
    explanation?: string;
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
    language: ProgrammingLanguage;
    starterCode?: string;
    hints: Hint[];
    testCases: TestCase[];
    solutionCode: string;
    solutionExplanation: string;
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
    language: ProgrammingLanguage;
    code: string;
    explanation: string;
    output: string;
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

// ----- Cambridge 9618: Programming & Number Systems subset -----

export const CambridgeProgrammingCurriculum: Curriculum = {
    id: 'cambridge-9618-programming',
    name: 'Cambridge International AS & A Level Computer Science (Programming)',
    board: 'cambridge',
    level: 'A-Level',
    code: '9618',
    topics: [
        {
            id: 'cam-topic-1',
            number: '1',
            title: 'Information Representation',
            description: 'Understanding data representation in computers',
            learningObjectives: [
                'Convert between denary, binary, and hexadecimal number systems',
                'Perform binary arithmetic',
                'Understand how data is represented in computer systems',
            ],
            prerequisites: [],
            difficulty: 'beginner',
            estimatedHours: 8,
            subtopics: [
                {
                    id: 'cam-subtopic-1-1',
                    title: 'Number Systems',
                    contentMarkdown:
                        '# Number Systems\\n\\nBinary, denary, and hexadecimal representations and conversions.',
                    codeExamples: [
                        {
                            id: 'cam-example-1-1-1',
                            title: 'Binary to Denary Converter',
                            description: 'Convert binary numbers to denary using Python',
                            language: 'python',
                            code: `def binary_to_denary(binary_str):
    """Convert binary string to denary (decimal)"""
    denary = 0
    power = 0

    # Process from right to left
    for digit in reversed(binary_str):
        if digit == '1':
            denary += 2 ** power
        power += 1

    return denary


# Test cases
print(binary_to_denary("1010"))      # 10
print(binary_to_denary("11111111"))  # 255
print(binary_to_denary("10110101"))  # 181
`,
                            explanation:
                                'Iterates through the binary string from right to left and accumulates the value based on powers of 2.',
                            output: '10\\n255\\n181',
                            concepts: ['Number systems', 'Loops', 'Powers of 2'],
                            canEdit: true,
                            canRun: true,
                        },
                    ],
                    exercises: [
                        {
                            id: 'cam-exercise-1-1-1',
                            title: 'Binary Addition Calculator',
                            difficulty: 'medium',
                            type: 'guided',
                            description: 'Create a program that adds two binary numbers.',
                            problemStatement: `Write a program that:
1. Takes two binary numbers as input (as strings)
2. Converts them to denary
3. Adds them together
4. Converts the result back to binary
5. Displays the result`,
                            language: 'python',
                            starterCode: `def add_binary(bin1, bin2):
    """Add two binary numbers and return result as binary"""
    # TODO: Convert bin1 to denary

    # TODO: Convert bin2 to denary

    # TODO: Add the denary numbers

    # TODO: Convert sum back to binary

    # TODO: Return binary result
    pass


result = add_binary("1010", "1100")
print(f"Result: {result}")
`,
                            hints: [
                                {
                                    level: 1,
                                    text: 'Use int(binary_string, 2) to convert binary to denary.',
                                    cost: 5,
                                },
                                {
                                    level: 2,
                                    text: 'Use bin(denary_value)[2:] to convert denary back to binary.',
                                    cost: 10,
                                },
                                {
                                    level: 3,
                                    text: 'denary1 = int(bin1, 2); denary2 = int(bin2, 2); return bin(denary1 + denary2)[2:]',
                                    cost: 20,
                                },
                            ],
                            testCases: [
                                {
                                    id: 'cam-tc-1',
                                    name: 'Simple addition',
                                    input: '1010,1100',
                                    expectedOutput: '10110',
                                    explanation: '10 + 12 = 22 = 10110 in binary',
                                },
                                {
                                    id: 'cam-tc-2',
                                    name: 'Carry case',
                                    input: '1111,1',
                                    expectedOutput: '10000',
                                    explanation: '15 + 1 = 16 = 10000 in binary',
                                },
                            ],
                            solutionCode: `def add_binary(bin1, bin2):
    \"\"\"Add two binary numbers and return result as binary\"\"\"
    denary1 = int(bin1, 2)
    denary2 = int(bin2, 2)
    sum_denary = denary1 + denary2
    return bin(sum_denary)[2:]
`,
                            solutionExplanation:
                                'Uses Python built-ins int(x, 2) and bin() for base conversions instead of manual loops.',
                            rubric: {
                                criteria: [
                                    {
                                        id: 'correct-conversion',
                                        name: 'Binary to Denary Conversion',
                                        description: 'Correctly converts both binary inputs to denary.',
                                        points: 30,
                                        autoGraded: true,
                                    },
                                    {
                                        id: 'correct-addition',
                                        name: 'Addition Logic',
                                        description: 'Correctly adds denary values.',
                                        points: 20,
                                        autoGraded: true,
                                    },
                                    {
                                        id: 'correct-output',
                                        name: 'Denary to Binary Conversion',
                                        description: 'Correctly converts the sum back to binary.',
                                        points: 30,
                                        autoGraded: true,
                                    },
                                    {
                                        id: 'code-quality',
                                        name: 'Code Quality',
                                        description: 'Clear variable names and structure.',
                                        points: 20,
                                        autoGraded: false,
                                    },
                                ],
                                maxScore: 100,
                            },
                            timeEstimateMinutes: 20,
                            points: 100,
                            tags: ['number-systems', 'binary', 'conversion'],
                            board: 'cambridge',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cam-topic-4',
            number: '4',
            title: 'Programming Fundamentals',
            description: 'Core programming concepts and problem-solving.',
            learningObjectives: [
                'Use variables and data types',
                'Apply sequence, selection, and iteration',
                'Solve problems using Python programs',
            ],
            prerequisites: ['cam-topic-1'],
            difficulty: 'intermediate',
            estimatedHours: 25,
            subtopics: [
                {
                    id: 'cam-subtopic-4-1',
                    title: 'Variables and Data Types',
                    contentMarkdown:
                        '# Variables and Data Types\\n\\nIntroduction to variables, basic types and simple calculations.',
                    codeExamples: [],
                    exercises: [
                        {
                            id: 'cam-exercise-4-1-1',
                            title: 'Temperature Converter',
                            difficulty: 'easy',
                            type: 'guided',
                            description: 'Convert temperatures between Celsius and Fahrenheit.',
                            problemStatement: `Create a program that:
1. Asks the user for a temperature in Celsius
2. Converts it to Fahrenheit using F = (C × 9/5) + 32
3. Displays both temperatures rounded to 1 decimal place`,
                            language: 'python',
                            starterCode: `celsius = float(input("Enter temperature in Celsius: "))

# TODO: Convert to Fahrenheit

# TODO: Display result
`,
                            hints: [
                                {
                                    level: 1,
                                    text: 'Use fahrenheit = (celsius * 9/5) + 32',
                                    cost: 5,
                                },
                                {
                                    level: 2,
                                    text: 'Use round(value, 1) to round to 1 decimal place.',
                                    cost: 10,
                                },
                            ],
                            testCases: [
                                {
                                    id: 'cam-tc-4-1',
                                    name: 'Freezing point',
                                    input: '0',
                                    expectedOutput: '0.0°C = 32.0°F',
                                },
                                {
                                    id: 'cam-tc-4-2',
                                    name: 'Room temperature',
                                    input: '25',
                                    expectedOutput: '25.0°C = 77.0°F',
                                },
                            ],
                            solutionCode: `celsius = float(input("Enter temperature in Celsius: "))
fahrenheit = (celsius * 9/5) + 32
print(f"{round(celsius, 1)}°C = {round(fahrenheit, 1)}°F")
`,
                            solutionExplanation:
                                'Applies the Celsius to Fahrenheit formula and uses f-strings plus round() for formatting.',
                            rubric: {
                                criteria: [
                                    {
                                        id: 'input',
                                        name: 'Input Handling',
                                        description: 'Correctly reads numeric input.',
                                        points: 20,
                                        autoGraded: true,
                                    },
                                    {
                                        id: 'calculation',
                                        name: 'Conversion Calculation',
                                        description: 'Uses the correct formula.',
                                        points: 40,
                                        autoGraded: true,
                                    },
                                    {
                                        id: 'output',
                                        name: 'Output Format',
                                        description: 'Displays result in the expected format.',
                                        points: 40,
                                        autoGraded: true,
                                    },
                                ],
                                maxScore: 100,
                            },
                            timeEstimateMinutes: 10,
                            points: 50,
                            tags: ['variables', 'arithmetic', 'input-output'],
                            board: 'cambridge',
                        },
                    ],
                },
            ],
        },
    ],
};

// ----- ZIMSEC 6023: O-Level Programming & Data Representation subset -----

export const ZimsecProgrammingCurriculum: Curriculum = {
    id: 'zimsec-6023-programming',
    name: 'ZIMSEC O-Level Computer Science (Programming)',
    board: 'zimsec',
    level: 'O-Level',
    code: '6023',
    topics: [
        {
            id: 'zim-topic-1',
            number: '1',
            title: 'Data Representation',
            description: 'Understanding how data is represented in computers.',
            learningObjectives: [
                'Understand binary number system',
                'Convert between number systems',
                'Apply binary in simple programs',
            ],
            prerequisites: [],
            difficulty: 'beginner',
            estimatedHours: 6,
            subtopics: [
                {
                    id: 'zim-subtopic-1-1',
                    title: 'Binary and Number Systems',
                    contentMarkdown:
                        '# Binary Number System\\n\\nBinary is the foundation of all computer operations.',
                    codeExamples: [
                        {
                            id: 'zim-example-1-1-1',
                            title: 'Simple Binary Counter',
                            description: 'Count from 0 to 15 in binary.',
                            language: 'python',
                            code: `print("Denary | Binary")
print("-------|--------")

for number in range(16):
    binary = bin(number)[2:]
    binary = binary.zfill(4)
    print(f"  {number:2d}   | {binary}")
`,
                            explanation: 'Uses bin() for conversion and zfill() for padding.',
                            output: 'Denary | Binary\\n-------|--------\\n   0   | 0000\\n   1   | 0001\\n...\\n  15   | 1111',
                            concepts: ['Binary', 'Loops', 'String formatting'],
                            canEdit: true,
                            canRun: true,
                        },
                    ],
                    exercises: [
                        {
                            id: 'zim-exercise-1-1-1',
                            title: 'Binary Quiz Game',
                            difficulty: 'medium',
                            type: 'challenge',
                            description: 'Create an interactive binary conversion quiz.',
                            problemStatement:
                                'Create a quiz game that generates random numbers (1-255), asks the learner to convert them to binary, and keeps score over 5 rounds.',
                            language: 'python',
                            starterCode: `import random

score = 0
rounds = 5

for round_num in range(1, rounds + 1):
    # TODO: Generate random number

    # TODO: Get user's answer

    # TODO: Check if correct and update score
    pass

print(f"Final Score: {score}/{rounds}")
`,
                            hints: [
                                {
                                    level: 1,
                                    text: 'Use random.randint(1, 255) to generate a random number.',
                                    cost: 5,
                                },
                                {
                                    level: 2,
                                    text: 'Use bin(number)[2:] to get the binary string.',
                                    cost: 10,
                                },
                            ],
                            testCases: [],
                            solutionCode: `import random

score = 0
rounds = 5

for round_num in range(1, rounds + 1):
    number = random.randint(1, 255)
    correct_binary = bin(number)[2:]

    print(f"\\nRound {round_num}: Convert {number} to binary")
    user_answer = input("Your answer: ")

    if user_answer == correct_binary:
        print("Correct!")
        score += 1
    else:
        print(f"Wrong! The answer was {correct_binary}")

    print(f"Score: {score}/{round_num}")

print(f"\\nFinal Score: {score}/{rounds}")
`,
                            solutionExplanation:
                                'Combines random number generation, binary conversion and simple scoring to create a quiz game.',
                            rubric: {
                                criteria: [
                                    {
                                        id: 'random-gen',
                                        name: 'Random Generation',
                                        description: 'Generates numbers in the range 1-255.',
                                        points: 20,
                                        autoGraded: false,
                                    },
                                    {
                                        id: 'conversion',
                                        name: 'Binary Conversion',
                                        description: 'Correctly converts numbers to binary.',
                                        points: 30,
                                        autoGraded: false,
                                    },
                                    {
                                        id: 'scoring',
                                        name: 'Score Tracking',
                                        description: 'Tracks and displays scores correctly.',
                                        points: 30,
                                        autoGraded: false,
                                    },
                                    {
                                        id: 'ux',
                                        name: 'User Experience',
                                        description: 'Provides clear prompts and feedback.',
                                        points: 20,
                                        autoGraded: false,
                                    },
                                ],
                                maxScore: 100,
                            },
                            timeEstimateMinutes: 30,
                            points: 120,
                            tags: ['binary', 'loops', 'game'],
                            board: 'zimsec',
                        },
                    ],
                },
            ],
        },
        {
            id: 'zim-topic-7',
            number: '7',
            title: 'Programming Concepts',
            description: 'Introduction to programming logic and algorithms.',
            learningObjectives: [
                'Understand input, process, output model',
                'Use selection to solve grading problems',
            ],
            prerequisites: [],
            difficulty: 'beginner',
            estimatedHours: 15,
            subtopics: [
                {
                    id: 'zim-subtopic-7-1',
                    title: 'Input, Process, Output',
                    contentMarkdown:
                        '# Input, Process, Output (IPO)\\n\\nEvery program follows the IPO model: get data, process it, and output results.',
                    codeExamples: [],
                    exercises: [
                        {
                            id: 'zim-exercise-7-1-1',
                            title: 'Grade Calculator',
                            difficulty: 'easy',
                            type: 'guided',
                            description: 'Calculate student grades from a numeric score.',
                            problemStatement: `Write a program that:
1. Asks for a student score (0-100)
2. Determines the grade:
   - 80-100: A
   - 70-79: B
   - 60-69: C
   - 50-59: D
   - Below 50: F
3. Displays the grade.`,
                            language: 'python',
                            starterCode: `score = int(input("Enter score: "))

# TODO: Determine grade using if-elif-else

# TODO: Display grade
`,
                            hints: [
                                {
                                    level: 1,
                                    text: 'Use if score >= 80, elif score >= 70, etc.',
                                    cost: 5,
                                },
                            ],
                            testCases: [
                                {
                                    id: 'zim-tc-7-1',
                                    name: 'Grade A',
                                    input: '85',
                                    expectedOutput: 'Grade: A',
                                },
                                {
                                    id: 'zim-tc-7-2',
                                    name: 'Grade C',
                                    input: '65',
                                    expectedOutput: 'Grade: C',
                                },
                            ],
                            solutionCode: `score = int(input("Enter score: "))

if score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 60:
    grade = "C"
elif score >= 50:
    grade = "D"
else:
    grade = "F"

print(f"Grade: {grade}")
`,
                            solutionExplanation:
                                'Maps numeric ranges to letter grades using an if-elif-else chain.',
                            rubric: {
                                criteria: [
                                    {
                                        id: 'logic',
                                        name: 'Conditional Logic',
                                        description: 'Correct if-elif-else structure for grade ranges.',
                                        points: 50,
                                        autoGraded: true,
                                    },
                                    {
                                        id: 'ranges',
                                        name: 'Grade Ranges',
                                        description: 'All grade ranges implemented correctly.',
                                        points: 50,
                                        autoGraded: true,
                                    },
                                ],
                                maxScore: 100,
                            },
                            timeEstimateMinutes: 15,
                            points: 60,
                            tags: ['selection', 'if-else', 'beginner'],
                            board: 'zimsec',
                        },
                    ],
                },
            ],
        },
    ],
};

// ----- Helper lookup -----

export const findExerciseById = (exerciseId: string | undefined | null): Exercise | undefined => {
    if (!exerciseId) return undefined;

    const allCurricula: Curriculum[] = [CambridgeProgrammingCurriculum, ZimsecProgrammingCurriculum];

    for (const curriculum of allCurricula) {
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

