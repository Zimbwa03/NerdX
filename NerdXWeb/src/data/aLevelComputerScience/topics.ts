// ZIMSEC A Level Computer Science Topics Data (Code: 6023)
// Comprehensive coverage of the entire ZIMSEC A Level Computer Science syllabus
// Forms 5-6 (Lower Sixth - Upper Sixth)
// Valid Period: 2024-2030

export interface ALevelComputerScienceTopic {
    id: string;
    name: string;
    description: string;
    learningObjectives: string[];
    keyTerms?: string[];
    level: 'Form 5' | 'Form 6' | 'Both';
    form5Content?: boolean;
    form6Content?: boolean;
    paperRelevance: 'Paper 1' | 'Paper 2' | 'Paper 3' | 'Paper 4' | 'All';
    practicalComponent?: boolean;
    hasSimulation?: boolean;
    hasProgrammingExercise?: boolean;
    hasDatabaseExercise?: boolean;
    hasSDLCProject?: boolean;
}

// Question types available for A Level Computer Science
export type ComputerScienceQuestionType = 'mcq' | 'structured' | 'essay';

export interface ComputerScienceQuestionTypeInfo {
    id: ComputerScienceQuestionType;
    name: string;
    description: string;
    icon: string;
    color: string;
    marks: string;
    timeGuide: string;
}

export const computerScienceQuestionTypes: ComputerScienceQuestionTypeInfo[] = [
    {
        id: 'mcq',
        name: 'Multiple Choice',
        description: 'Test your knowledge with 4-option questions',
        icon: 'checkbox-marked-circle-outline',
        color: '#0288D1',
        marks: '1-2 marks each',
        timeGuide: '~1-2 min per question'
    },
    {
        id: 'structured',
        name: 'Structured Questions',
        description: 'Multi-part questions requiring detailed answers',
        icon: 'format-list-numbered',
        color: '#1976D2',
        marks: '10-15 marks',
        timeGuide: '~15-20 min per question'
    },
    {
        id: 'essay',
        name: 'Essay Questions',
        description: 'In-depth essays demonstrating comprehensive understanding',
        icon: 'file-document-edit-outline',
        color: '#0D47A1',
        marks: '20-25 marks',
        timeGuide: '~30-40 min per essay'
    }
];

// Complete ZIMSEC A Level Computer Science Topics (9 Core Topics)
export const aLevelComputerScienceTopics: ALevelComputerScienceTopic[] = [
    // ============================================
    // TOPIC 1: DATA REPRESENTATION
    // ============================================
    {
        id: 'data_representation_form5',
        name: 'Data Representation (Form 5)',
        description: 'Number systems, binary arithmetic, character representation, image and sound representation',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSimulation: true,
        learningObjectives: [
            'Convert between binary, denary, and hexadecimal number systems',
            'Perform binary arithmetic (addition, subtraction, multiplication, division)',
            'Understand two\'s complement representation for negative numbers',
            'Explain ASCII and Unicode character encoding',
            'Describe how images are represented using bitmaps and vectors',
            'Understand sound representation using sampling, sample rate, and bit depth',
            'Calculate file sizes for different data types',
            'Understand floating-point representation (IEEE 754)'
        ],
        keyTerms: ['binary', 'denary', 'hexadecimal', 'two\'s complement', 'ASCII', 'Unicode', 'bitmap', 'vector', 'sampling', 'sample rate', 'bit depth', 'floating-point', 'IEEE 754', 'normalization', 'mantissa', 'exponent']
    },
    {
        id: 'data_representation_form6',
        name: 'Data Representation (Form 6)',
        description: 'Advanced data representation: floating-point precision, compression, encryption representation',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSimulation: true,
        learningObjectives: [
            'Understand IEEE 754 single and double precision formats',
            'Perform floating-point arithmetic and normalization',
            'Explain data compression techniques (lossless vs lossy)',
            'Understand run-length encoding, Huffman coding',
            'Describe encryption representation and key management',
            'Analyze trade-offs between precision and storage',
            'Evaluate compression algorithms for different data types'
        ],
        keyTerms: ['IEEE 754', 'single precision', 'double precision', 'normalization', 'lossless compression', 'lossy compression', 'run-length encoding', 'Huffman coding', 'encryption', 'key management', 'precision', 'rounding errors']
    },

    // ============================================
    // TOPIC 2: COMPUTER ARCHITECTURE
    // ============================================
    {
        id: 'computer_architecture_form5',
        name: 'Computer Architecture (Form 5)',
        description: 'CPU structure, fetch-decode-execute cycle, memory hierarchy, I/O devices',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSimulation: true,
        learningObjectives: [
            'Describe the structure and function of the CPU (ALU, CU, registers)',
            'Explain the fetch-decode-execute cycle in detail',
            'Understand the role of different types of memory (RAM, ROM, cache)',
            'Describe the memory hierarchy and access speeds',
            'Explain input/output devices and their interfaces',
            'Understand buses (address bus, data bus, control bus)',
            'Describe secondary storage devices and their characteristics'
        ],
        keyTerms: ['CPU', 'ALU', 'CU', 'registers', 'fetch-decode-execute cycle', 'RAM', 'ROM', 'cache', 'memory hierarchy', 'bus', 'address bus', 'data bus', 'control bus', 'secondary storage', 'HDD', 'SSD']
    },
    {
        id: 'computer_architecture_form6',
        name: 'Computer Architecture (Form 6)',
        description: 'Advanced architecture: pipelining, parallel processing, RISC vs CISC, performance optimization',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSimulation: true,
        learningObjectives: [
            'Explain pipelining and its impact on performance',
            'Understand parallel processing (multi-core, multi-threading)',
            'Compare RISC and CISC architectures',
            'Analyze factors affecting CPU performance',
            'Understand virtual memory and paging',
            'Describe interrupt handling and priority systems',
            'Evaluate performance optimization techniques'
        ],
        keyTerms: ['pipelining', 'parallel processing', 'multi-core', 'multi-threading', 'RISC', 'CISC', 'virtual memory', 'paging', 'interrupt', 'performance optimization', 'clock speed', 'cache hit', 'cache miss']
    },

    // ============================================
    // TOPIC 3: NETWORKING
    // ============================================
    {
        id: 'networking_form5',
        name: 'Networking (Form 5)',
        description: 'Network topologies, protocols, OSI model, network hardware, internet technologies',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSimulation: true,
        learningObjectives: [
            'Describe different network topologies (star, bus, ring, mesh)',
            'Understand the OSI model and TCP/IP model',
            'Explain network protocols (HTTP, HTTPS, FTP, SMTP, POP3, IMAP)',
            'Describe network hardware (routers, switches, hubs, modems)',
            'Understand IP addressing and subnetting basics',
            'Explain MAC addresses and their role',
            'Describe wireless networking (Wi-Fi, Bluetooth)'
        ],
        keyTerms: ['topology', 'star', 'bus', 'ring', 'mesh', 'OSI model', 'TCP/IP', 'protocol', 'HTTP', 'HTTPS', 'FTP', 'SMTP', 'IP address', 'MAC address', 'router', 'switch', 'hub', 'modem', 'Wi-Fi', 'Bluetooth']
    },
    {
        id: 'networking_form6',
        name: 'Networking (Form 6)',
        description: 'Advanced networking: security, encryption, network design, troubleshooting, cloud computing',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSimulation: true,
        learningObjectives: [
            'Understand network security threats and countermeasures',
            'Explain encryption protocols (SSL/TLS, VPN)',
            'Design network topologies for specific requirements',
            'Troubleshoot network problems systematically',
            'Understand cloud computing models (IaaS, PaaS, SaaS)',
            'Describe network monitoring and management tools',
            'Evaluate network performance and optimization strategies'
        ],
        keyTerms: ['network security', 'firewall', 'encryption', 'SSL', 'TLS', 'VPN', 'cloud computing', 'IaaS', 'PaaS', 'SaaS', 'network monitoring', 'bandwidth', 'latency', 'QoS']
    },

    // ============================================
    // TOPIC 4: SYSTEMS DEVELOPMENT LIFE CYCLE
    // ============================================
    {
        id: 'sdlc_form5',
        name: 'Systems Development Life Cycle (Form 5)',
        description: 'SDLC stages, fact-finding techniques, feasibility studies, system design',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSDLCProject: true,
        learningObjectives: [
            'Describe the stages of the SDLC (analysis, design, development, testing, implementation, evaluation)',
            'Understand fact-finding techniques (questionnaires, interviews, observations, document analysis)',
            'Perform feasibility studies (STOLE: Social, Technical, Operational, Legal, Economic)',
            'Create data flow diagrams (DFDs)',
            'Design system inputs, outputs, and interfaces',
            'Understand file structures and data models',
            'Create structure charts and Jackson diagrams'
        ],
        keyTerms: ['SDLC', 'analysis', 'design', 'development', 'testing', 'implementation', 'evaluation', 'fact-finding', 'questionnaire', 'interview', 'observation', 'feasibility study', 'STOLE', 'DFD', 'data flow diagram', 'structure chart', 'Jackson diagram']
    },
    {
        id: 'sdlc_form6',
        name: 'Systems Development Life Cycle (Form 6)',
        description: 'Advanced SDLC: project management, methodologies, testing strategies, maintenance',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasSDLCProject: true,
        learningObjectives: [
            'Compare different SDLC methodologies (Waterfall, Agile, Spiral)',
            'Understand project management techniques (Gantt charts, critical path)',
            'Design comprehensive test plans (normal, abnormal, boundary test data)',
            'Understand different testing strategies (unit, integration, system, acceptance)',
            'Evaluate system performance and user satisfaction',
            'Understand system maintenance (corrective, adaptive, perfective)',
            'Create professional project documentation'
        ],
        keyTerms: ['Waterfall', 'Agile', 'Spiral', 'project management', 'Gantt chart', 'critical path', 'test plan', 'test data', 'unit testing', 'integration testing', 'system testing', 'acceptance testing', 'maintenance', 'corrective', 'adaptive', 'perfective']
    },

    // ============================================
    // TOPIC 5: SECURITY AND ETHICS
    // ============================================
    {
        id: 'security_ethics_form5',
        name: 'Security and Ethics (Form 5)',
        description: 'Threats to computer systems, security measures, ethical issues, data protection',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Identify threats to computer systems (viruses, malware, hacking, phishing)',
            'Understand security measures (passwords, encryption, firewalls, antivirus)',
            'Explain ethical issues in computing (privacy, intellectual property, cyberbullying)',
            'Understand data protection principles',
            'Describe authentication and authorization methods',
            'Explain backup and recovery strategies',
            'Understand Ubuntu/Unhu principles in ICT'
        ],
        keyTerms: ['virus', 'malware', 'hacking', 'phishing', 'password', 'encryption', 'firewall', 'antivirus', 'authentication', 'authorization', 'backup', 'recovery', 'privacy', 'intellectual property', 'cyberbullying', 'Ubuntu', 'Unhu']
    },
    {
        id: 'security_ethics_form6',
        name: 'Security and Ethics (Form 6)',
        description: 'Advanced security: cryptography, network security, legal frameworks, professional ethics',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Understand cryptography (symmetric, asymmetric encryption, digital signatures)',
            'Explain network security protocols and implementations',
            'Understand legal frameworks (data protection laws, computer misuse acts)',
            'Analyze ethical dilemmas in computing',
            'Evaluate security policies and procedures',
            'Understand incident response and disaster recovery',
            'Apply professional codes of conduct'
        ],
        keyTerms: ['cryptography', 'symmetric encryption', 'asymmetric encryption', 'public key', 'private key', 'digital signature', 'certificate', 'PKI', 'legal framework', 'data protection', 'incident response', 'disaster recovery', 'code of conduct']
    },

    // ============================================
    // TOPIC 6: ALGORITHM DESIGN AND DATA STRUCTURES
    // ============================================
    {
        id: 'algorithms_data_structures_form5',
        name: 'Algorithm Design and Data Structures (Form 5)',
        description: 'Algorithm design, flowcharts, pseudocode, basic data structures, searching and sorting',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasProgrammingExercise: true,
        hasSimulation: true,
        learningObjectives: [
            'Design algorithms using flowcharts and pseudocode',
            'Understand algorithm efficiency (time and space complexity)',
            'Implement basic data structures (arrays, lists, stacks, queues)',
            'Understand searching algorithms (linear search, binary search)',
            'Understand sorting algorithms (bubble sort, insertion sort, selection sort)',
            'Trace algorithms using trace tables',
            'Validate algorithms with test data'
        ],
        keyTerms: ['algorithm', 'flowchart', 'pseudocode', 'array', 'list', 'stack', 'queue', 'linear search', 'binary search', 'bubble sort', 'insertion sort', 'selection sort', 'trace table', 'time complexity', 'space complexity']
    },
    {
        id: 'algorithms_data_structures_form6',
        name: 'Algorithm Design and Data Structures (Form 6)',
        description: 'Advanced algorithms: trees, graphs, hash tables, advanced sorting, dynamic programming',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        hasProgrammingExercise: true,
        hasSimulation: true,
        learningObjectives: [
            'Implement advanced data structures (trees, graphs, hash tables)',
            'Understand tree traversal algorithms (pre-order, in-order, post-order)',
            'Implement advanced sorting (merge sort, quick sort, heap sort)',
            'Understand graph algorithms (depth-first search, breadth-first search)',
            'Analyze algorithm complexity using Big O notation',
            'Design recursive algorithms',
            'Optimize algorithms for efficiency'
        ],
        keyTerms: ['tree', 'graph', 'hash table', 'binary tree', 'BST', 'AVL tree', 'tree traversal', 'pre-order', 'in-order', 'post-order', 'merge sort', 'quick sort', 'heap sort', 'DFS', 'BFS', 'Big O notation', 'recursion', 'dynamic programming']
    },

    // ============================================
    // TOPIC 7: PROGRAMMING
    // ============================================
    {
        id: 'programming_form5',
        name: 'Programming (Form 5)',
        description: 'Programming fundamentals, control structures, functions, file handling, basic OOP',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        hasProgrammingExercise: true,
        learningObjectives: [
            'Write programs using sequence, selection, and iteration',
            'Use variables, constants, and data types appropriately',
            'Implement functions and procedures with parameters',
            'Handle file operations (read, write, append)',
            'Understand basic object-oriented concepts (classes, objects, methods)',
            'Implement error handling and validation',
            'Debug programs systematically'
        ],
        keyTerms: ['sequence', 'selection', 'iteration', 'variable', 'constant', 'data type', 'function', 'procedure', 'parameter', 'file handling', 'class', 'object', 'method', 'OOP', 'error handling', 'validation', 'debugging']
    },
    {
        id: 'programming_form6',
        name: 'Programming (Form 6)',
        description: 'Advanced programming: OOP principles, inheritance, polymorphism, exception handling, GUI',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        hasProgrammingExercise: true,
        learningObjectives: [
            'Implement advanced OOP principles (inheritance, polymorphism, encapsulation, abstraction)',
            'Design and implement class hierarchies',
            'Handle exceptions and errors effectively',
            'Create graphical user interfaces (GUI)',
            'Work with libraries and APIs',
            'Implement design patterns',
            'Optimize code for performance and maintainability'
        ],
        keyTerms: ['inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'class hierarchy', 'exception', 'try-catch', 'GUI', 'API', 'library', 'design pattern', 'refactoring', 'code optimization']
    },

    // ============================================
    // TOPIC 8: DATABASES
    // ============================================
    {
        id: 'databases_form5',
        name: 'Databases (Form 5)',
        description: 'Database concepts, ERD design, normalization, SQL queries, forms and reports',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        hasDatabaseExercise: true,
        learningObjectives: [
            'Design Entity Relationship Diagrams (ERDs)',
            'Understand normalization (1NF, 2NF, 3NF)',
            'Write SQL queries (SELECT, INSERT, UPDATE, DELETE)',
            'Create database tables with appropriate data types',
            'Design and create forms for data entry',
            'Create reports for data presentation',
            'Understand primary keys, foreign keys, and relationships'
        ],
        keyTerms: ['database', 'ERD', 'entity', 'relationship', 'attribute', 'primary key', 'foreign key', 'normalization', '1NF', '2NF', '3NF', 'SQL', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'form', 'report']
    },
    {
        id: 'databases_form6',
        name: 'Databases (Form 6)',
        description: 'Advanced databases: complex queries, transactions, indexing, database security, optimization',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        hasDatabaseExercise: true,
        learningObjectives: [
            'Write complex SQL queries (JOINs, subqueries, aggregate functions)',
            'Understand database transactions and ACID properties',
            'Implement database indexing for performance',
            'Design database security and access control',
            'Optimize database performance',
            'Understand database backup and recovery',
            'Design distributed database systems'
        ],
        keyTerms: ['JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'subquery', 'aggregate function', 'GROUP BY', 'HAVING', 'transaction', 'ACID', 'index', 'database security', 'access control', 'backup', 'recovery', 'distributed database']
    },

    // ============================================
    // TOPIC 9: ENTERPRISING
    // ============================================
    {
        id: 'enterprising_form5',
        name: 'Enterprising (Form 5)',
        description: 'Entrepreneurship in ICT, business planning, market research, innovation',
        level: 'Form 5',
        form5Content: true,
        paperRelevance: 'Paper 4',
        learningObjectives: [
            'Understand entrepreneurship in the ICT sector',
            'Conduct market research for ICT products/services',
            'Create business plans for technology ventures',
            'Understand funding sources for tech startups',
            'Identify opportunities for innovation',
            'Understand intellectual property in technology',
            'Develop marketing strategies for ICT products'
        ],
        keyTerms: ['entrepreneurship', 'business plan', 'market research', 'startup', 'funding', 'venture capital', 'innovation', 'intellectual property', 'patent', 'copyright', 'trademark', 'marketing', 'target market']
    },
    {
        id: 'enterprising_form6',
        name: 'Enterprising (Form 6)',
        description: 'Advanced entrepreneurship: scaling businesses, technology commercialization, social impact',
        level: 'Form 6',
        form6Content: true,
        paperRelevance: 'Paper 4',
        learningObjectives: [
            'Understand scaling technology businesses',
            'Evaluate technology commercialization strategies',
            'Analyze social impact of ICT solutions',
            'Understand e-commerce and digital business models',
            'Develop sustainable business practices',
            'Understand global ICT markets',
            'Create comprehensive business proposals'
        ],
        keyTerms: ['scaling', 'commercialization', 'social impact', 'e-commerce', 'digital business model', 'sustainability', 'global market', 'business proposal', 'pitch', 'ROI', 'revenue model']
    }
];

// Helper functions
export function getTopicById(id: string): ALevelComputerScienceTopic | undefined {
    return aLevelComputerScienceTopics.find(topic => topic.id === id);
}

export function getTopicsByLevel(level: 'Form 5' | 'Form 6' | 'Both'): ALevelComputerScienceTopic[] {
    return aLevelComputerScienceTopics.filter(topic => 
        topic.level === level || 
        (level === 'Both' && (topic.level === 'Form 5' || topic.level === 'Form 6'))
    );
}

export function getAllTopicNames(): string[] {
    return aLevelComputerScienceTopics.map(topic => topic.name);
}

export function getTopicsByPaper(paper: 'Paper 1' | 'Paper 2' | 'Paper 3' | 'Paper 4' | 'All'): ALevelComputerScienceTopic[] {
    if (paper === 'All') return aLevelComputerScienceTopics;
    return aLevelComputerScienceTopics.filter(topic => 
        topic.paperRelevance === paper || topic.paperRelevance === 'All'
    );
}

export function getTopicsWithSimulation(): ALevelComputerScienceTopic[] {
    return aLevelComputerScienceTopics.filter(topic => topic.hasSimulation);
}

export function getTopicsWithProgramming(): ALevelComputerScienceTopic[] {
    return aLevelComputerScienceTopics.filter(topic => topic.hasProgrammingExercise);
}

export function getTopicsWithDatabase(): ALevelComputerScienceTopic[] {
    return aLevelComputerScienceTopics.filter(topic => topic.hasDatabaseExercise);
}

export function getTopicsWithSDLC(): ALevelComputerScienceTopic[] {
    return aLevelComputerScienceTopics.filter(topic => topic.hasSDLCProject);
}

export const topicCounts = {
    total: aLevelComputerScienceTopics.length,
    form5: aLevelComputerScienceTopics.filter(t => t.level === 'Form 5').length,
    form6: aLevelComputerScienceTopics.filter(t => t.level === 'Form 6').length,
    withSimulation: aLevelComputerScienceTopics.filter(t => t.hasSimulation).length,
    withProgramming: aLevelComputerScienceTopics.filter(t => t.hasProgrammingExercise).length,
    withDatabase: aLevelComputerScienceTopics.filter(t => t.hasDatabaseExercise).length,
    withSDLC: aLevelComputerScienceTopics.filter(t => t.hasSDLCProject).length
};
