// Computer Science Notes - Main Entry Point
// Topics and exports for O-Level Computer Science

import { TopicNotes } from './types';

// Export types
export { TopicNotes, NotesSection } from './types';

// ZIMSEC O-Level Computer Science 7014 — 11 topics (theory; practical in Virtual Labs)
export const computerScienceTopics: string[] = [
    "Hardware and Software",
    "Application of Computer Science",
    "Data Representation",
    "Communication Networks and Internet Technologies",
    "Security and Ethics",
    "Systems Analysis and Design",
    "Algorithm Design and Problem-Solving",
    "Programming",
    "Databases",
    "Web Design and Internet Uses",
    "Automated and Emerging Technologies",
];

// Computer Science Notes - Basic structure for each topic
export const computerScienceNotes: Record<string, TopicNotes> = {
    "Hardware and Software": {
        topic: "Hardware and Software",
        subject: "Computer Science",
        summary: "Understanding the physical components of computers and the software that runs on them.",
        sections: [
            {
                title: "Hardware Components",
                content: `Hardware refers to the physical components of a computer system that you can touch and see.

**Input Devices** - Used to enter data into the computer:
- Keyboard, Mouse, Scanner, Microphone, Webcam, Touchscreen, Barcode reader

**Output Devices** - Used to display or present processed data:
- Monitor, Printer, Speakers, Projector, Headphones

**Storage Devices** - Used to store data permanently:
- Hard Disk Drive (HDD), Solid State Drive (SSD), USB Flash Drive, Optical discs (CD/DVD/Blu-ray), Cloud storage

**Processing Devices**:
- CPU (Central Processing Unit) - the "brain" of the computer
- RAM (Random Access Memory) - temporary working memory
- GPU (Graphics Processing Unit) - processes graphics`,
                diagrams: [],
            },
            {
                title: "The CPU",
                content: `The CPU (Central Processing Unit) is the main processor that executes instructions.

**Components of the CPU:**
- **ALU (Arithmetic Logic Unit)**: Performs calculations and logical operations
- **CU (Control Unit)**: Controls the sequence of operations
- **Registers**: Small, fast storage locations within the CPU

**The Fetch-Decode-Execute Cycle:**
1. **Fetch**: The next instruction is fetched from memory
2. **Decode**: The instruction is decoded to understand what action is needed
3. **Execute**: The instruction is carried out`,
                diagrams: [],
            },
            {
                title: "Software Types",
                content: `Software is the set of instructions that tell the hardware what to do.

**System Software:**
- Operating Systems (Windows, macOS, Linux, Android, iOS)
- Utility programs (antivirus, disk cleanup, backup software)
- Device drivers (software that allows OS to communicate with hardware)

**Application Software:**
- Word processors (Microsoft Word, Google Docs)
- Spreadsheets (Microsoft Excel, Google Sheets)
- Databases (Microsoft Access, MySQL)
- Graphics software (Photoshop, GIMP)
- Web browsers (Chrome, Firefox, Safari)`,
                diagrams: [],
            }
        ],
        key_points: [
            "Hardware is physical, software is logical/programs",
            "CPU components: ALU, CU, and Registers",
            "Fetch-Decode-Execute cycle describes how CPU processes instructions",
            "System software manages the computer, application software helps users perform tasks",
            "Input devices receive data, output devices display results"
        ],
        exam_tips: [
            "Be able to classify devices as input, output, or storage",
            "Know the difference between system and application software with examples",
            "Understand each stage of the Fetch-Decode-Execute cycle",
            "Remember the functions of different CPU components"
        ]
    },
    "Data Representation": {
        topic: "Data Representation",
        subject: "Computer Science",
        summary: "How computers store and represent different types of data using binary, denary, and hexadecimal systems.",
        sections: [
            {
                title: "Number Systems",
                content: `Computers use different number systems to represent data.

**Binary (Base 2)**: Uses only 0 and 1
- Example: 1101 (binary) = 13 (denary)

**Denary/Decimal (Base 10)**: Our everyday number system using 0-9
- Example: 255

**Hexadecimal (Base 16)**: Uses 0-9 and A-F (where A=10, B=11, C=12, D=13, E=14, F=15)
- Example: FF (hex) = 255 (denary)`,
                diagrams: [],
            },
            {
                title: "Number Conversions",
                content: `**Binary to Denary:**
Each position represents a power of 2: 128, 64, 32, 16, 8, 4, 2, 1
Example: 1101 = 8 + 4 + 0 + 1 = 13

**Denary to Binary:**
Divide by 2 repeatedly and record remainders
Example: 13 ÷ 2 = 6 r1, 6 ÷ 2 = 3 r0, 3 ÷ 2 = 1 r1, 1 ÷ 2 = 0 r1 → 1101

**Hexadecimal to Binary:**
Each hex digit = 4 binary bits
Example: A3 = 1010 0011`,
                diagrams: [],
            },
            {
                title: "Logic Gates",
                content: `Logic gates process binary inputs to produce outputs.

**AND Gate**: Output is 1 only if BOTH inputs are 1
**OR Gate**: Output is 1 if EITHER input is 1
**NOT Gate**: Inverts the input (1 becomes 0, 0 becomes 1)
**NAND Gate**: NOT AND - opposite of AND
**NOR Gate**: NOT OR - opposite of OR
**XOR Gate**: Output is 1 if inputs are DIFFERENT

Logic gates can be combined to create complex circuits.`,
                diagrams: [],
            }
        ],
        key_points: [
            "Binary uses only 0 and 1 (base 2)",
            "Hexadecimal uses 0-9 and A-F (base 16)",
            "1 byte = 8 bits, can store values 0-255",
            "Logic gates: AND, OR, NOT, NAND, NOR, XOR",
            "Truth tables show all possible input/output combinations"
        ],
        exam_tips: [
            "Practice conversions between binary, denary, and hexadecimal",
            "Know the truth tables for all basic logic gates",
            "Binary addition: 1+1=10 (carry the 1)",
            "Remember: 1 nibble = 4 bits = 1 hex digit"
        ]
    },
    "Algorithm Design and Problem-Solving": {
        topic: "Algorithm Design and Problem-Solving",
        subject: "Computer Science",
        summary: "Developing step-by-step solutions using flowcharts, pseudocode, and programming structures.",
        sections: [
            {
                title: "What is an Algorithm?",
                content: `An algorithm is a step-by-step procedure for solving a problem.

**Characteristics of good algorithms:**
- Clear and precise steps
- Finite - must terminate
- Effective - each step is doable
- Input - takes zero or more inputs
- Output - produces at least one output`,
                diagrams: [],
            },
            {
                title: "Flowcharts",
                content: `Flowcharts use symbols to represent algorithms visually.

**Flowchart Symbols:**
- **Oval/Terminator**: Start/End
- **Rectangle**: Process/Action
- **Diamond**: Decision (Yes/No)
- **Parallelogram**: Input/Output
- **Arrow**: Flow direction`,
                diagrams: [],
            },
            {
                title: "Programming Structures",
                content: `**Sequence**: Steps executed one after another in order

**Selection (IF-THEN-ELSE)**:
\`\`\`
IF condition THEN
    action1
ELSE
    action2
ENDIF
\`\`\`

**Iteration (Loops)**:
- FOR loop: Repeats a fixed number of times
- WHILE loop: Repeats while condition is true
- REPEAT-UNTIL: Repeats until condition becomes true`,
                diagrams: [],
            }
        ],
        key_points: [
            "Algorithms are step-by-step problem solutions",
            "Flowcharts use standard symbols to represent algorithms",
            "Three main structures: Sequence, Selection, Iteration",
            "FOR loops have a known number of iterations",
            "WHILE loops may not execute at all if condition is false initially"
        ],
        exam_tips: [
            "Always use correct flowchart symbols",
            "Trace tables help verify algorithm correctness",
            "Pseudocode should be language-independent",
            "Check boundary conditions when testing algorithms"
        ]
    },
    "Programming": {
        topic: "Programming",
        subject: "Computer Science",
        summary: "Writing code using variables, data types, control structures, and functions.",
        sections: [
            {
                title: "Variables and Data Types",
                content: `**Variables** store data that can change during program execution.

**Common Data Types:**
- **Integer**: Whole numbers (e.g., 42, -7)
- **Real/Float**: Decimal numbers (e.g., 3.14, -0.5)
- **String**: Text (e.g., "Hello World")
- **Boolean**: True or False
- **Character**: Single letter/symbol (e.g., 'A')

**Constants**: Values that don't change during execution (e.g., PI = 3.14159)`,
                diagrams: [],
            },
            {
                title: "Operators",
                content: `**Arithmetic Operators:**
+ (addition), - (subtraction), * (multiplication), / (division)
MOD (remainder), DIV (integer division)

**Comparison Operators:**
= (equal), <> (not equal), < (less than), > (greater than)
<= (less than or equal), >= (greater than or equal)

**Logical Operators:**
AND, OR, NOT`,
                diagrams: [],
            },
            {
                title: "Translators",
                content: `Translators convert source code into machine code.

**Compiler**: Translates entire program at once, creates executable file
- Faster execution after compilation
- Errors shown after full compilation

**Interpreter**: Translates and executes line by line
- Slower execution
- Errors shown immediately, easier debugging

**Assembler**: Translates assembly language to machine code`,
                diagrams: [],
            }
        ],
        key_points: [
            "Variables store changeable data, constants don't change",
            "Choose appropriate data types for efficiency",
            "MOD gives remainder, DIV gives integer division",
            "Compilers translate all at once, interpreters line by line",
            "Functions/procedures help organize and reuse code"
        ],
        exam_tips: [
            "Always declare variable data types appropriately",
            "Know the difference between compiler and interpreter",
            "Use meaningful variable names",
            "Test programs with normal, boundary, and erroneous data"
        ]
    },
    "Databases": {
        topic: "Databases",
        subject: "Computer Science",
        summary: "Creating, querying, and managing structured collections of data.",
        sections: [
            {
                title: "Database Concepts",
                content: `A database is an organized collection of structured data.

**Key Terms:**
- **Table**: Collection of related records
- **Record**: A single row containing data about one entity
- **Field**: A single item of data (column)
- **Primary Key**: Unique identifier for each record
- **Foreign Key**: Links records between tables`,
                diagrams: [],
            },
            {
                title: "SQL Basics",
                content: `SQL (Structured Query Language) is used to interact with databases.

**SELECT**: Retrieve data
\`\`\`sql
SELECT FirstName, Surname FROM Students WHERE Age > 16
\`\`\`

**INSERT**: Add new records
\`\`\`sql
INSERT INTO Students (FirstName, Surname, Age) VALUES ('John', 'Doe', 17)
\`\`\`

**UPDATE**: Modify existing records
\`\`\`sql
UPDATE Students SET Age = 18 WHERE StudentID = 1
\`\`\`

**DELETE**: Remove records
\`\`\`sql
DELETE FROM Students WHERE StudentID = 5
\`\`\``,
                diagrams: [],
            }
        ],
        key_points: [
            "Primary keys uniquely identify each record",
            "Foreign keys create relationships between tables",
            "SELECT retrieves data, INSERT adds data",
            "UPDATE modifies existing data, DELETE removes data",
            "WHERE clause filters records based on conditions"
        ],
        exam_tips: [
            "Always include WHERE in UPDATE/DELETE to avoid affecting all records",
            "Use ORDER BY to sort results",
            "Know the difference between flat-file and relational databases",
            "Practice writing SQL queries with multiple conditions"
        ]
    }
};

// Helper function to get topics
export function getTopics(): string[] {
    return computerScienceTopics;
}

// Helper function to get notes for a topic
export function getTopicNotes(topic: string): TopicNotes | null {
    return computerScienceNotes[topic] || null;
}
