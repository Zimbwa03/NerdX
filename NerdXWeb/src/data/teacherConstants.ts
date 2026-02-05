// Teacher Mode constants (parity with mobile TeacherModeSetupScreen / TeacherModeScreen)

export const SUBJECT_TOPICS: Record<string, string[]> = {
  'O Level Mathematics': [
    'Real Numbers', 'Fractions, Decimals & Percentages', 'Ratio and Proportion',
    'Algebraic Expressions', 'Quadratic Equations', 'Linear Equations & Inequalities',
    'Indices and Logarithms', 'Angles and Polygons', 'Pythagoras Theorem', 'Trigonometry',
    'Circle Theorems', 'Statistics', 'Probability', 'Mensuration', 'Sets',
    'Sequences and Series', 'Matrices', 'Vectors', 'Coordinate Geometry', 'Functions and Graphs',
  ],
  English: [
    'Parts of Speech', 'Sentence Structure', 'Tenses', 'Active and Passive Voice',
    'Direct and Indirect Speech', 'Punctuation', 'Comprehension Skills', 'Summary Writing',
    'Essay Writing', 'Vocabulary and Word Meaning', 'Figures of Speech', 'Formal Letter Writing',
    'Informal Letter Writing', 'Report Writing',
  ],
  Biology: [
    'Cell Structure and Organisation', 'Movement of Substances', 'Enzymes', 'Nutrition in Plants',
    'Nutrition in Humans', 'Transport in Plants', 'Transport in Humans', 'Respiration', 'Excretion',
    'Homeostasis', 'Coordination and Response', 'Reproduction in Plants', 'Reproduction in Humans', 'Inheritance',
  ],
  Chemistry: [
    'Particulate Nature of Matter', 'Atomic Structure', 'Chemical Bonding', 'Stoichiometry',
    'Electricity and Chemistry', 'Energy Changes', 'Chemical Reactions', 'Acids, Bases and Salts',
    'The Periodic Table', 'Metals', 'Air and Water', 'Organic Chemistry',
  ],
  Physics: [
    'Measurements', 'Kinematics', 'Forces and Motion', 'Pressure', 'Energy, Work and Power',
    'Thermal Physics', 'Waves', 'Light', 'Sound', 'Electricity', 'Magnetism and Electromagnetism', 'Radioactivity',
  ],
  'Computer Science': [
    'Hardware and Software', 'Application of Computer Science', 'Data Representation',
    'Communication Networks and Internet Technologies', 'Security and Ethics', 'Systems Analysis and Design',
    'Algorithm Design and Problem-Solving', 'Programming', 'Databases', 'Web Design and Internet Uses',
    'Automated and Emerging Technologies',
  ],
  Geography: [
    'Weather and Climate', 'Landforms and Landscape Processes', 'Ecosystems', 'Natural Resources',
    'Energy and Power Development', 'Map Work and Geographical Information Systems (GIS)', 'Minerals and Mining',
    'Environmental Management', 'Agriculture and Land Reform', 'Industry', 'Settlement and Population', 'Transport and Trade',
  ],
  Commerce: [
    'Business Ownership', 'Production', 'Trade', 'Retail and Wholesale Trade', 'Advertising',
    'Transport', 'Insurance', 'Banking', 'Money and Prices', 'Entrepreneurship',
  ],
};

export const A_LEVEL_TOPICS: Record<string, string[]> = {
  'Pure Mathematics': [
    'Polynomials', 'Rational Functions', 'Indices, Surds and Logarithms', 'Quadratic Functions', 'Functions',
    'Coordinate Geometry', 'Sequences and Series', 'Binomial Theorem', 'Trigonometry (Identities & Equations)',
    'Differentiation', 'Applications of Differentiation', 'Integration', 'Further Trigonometry', 'Hyperbolic Functions',
    'Further Differentiation', 'Further Integration Techniques', 'Differential Equations', 'Complex Numbers',
    'Matrices and Determinants', 'Vectors in 3D', 'Summation of Series', 'Numerical Methods', 'Proof and Mathematical Induction', 'Group Theory',
  ],
  English: [
    'Advanced Grammar and Usage', 'Argumentative Writing', 'Analytical Essay Writing', 'Comprehension and Inference',
    'Summary Techniques', 'Vocabulary Building', 'Literary Devices', 'Critical Reading',
  ],
  Biology: [
    'Cell Structure', 'Biological Molecules', 'Enzymes', 'Cell Membranes and Transport', 'The Cell Cycle and Mitosis',
    'Nucleic Acids and Protein Synthesis', 'Transport in Plants', 'Transport in Mammals', 'Gas Exchange', 'Infectious Diseases',
    'Immunity', 'Smoking and Health', 'Energy and Respiration', 'Photosynthesis', 'Homeostasis', 'Excretion',
    'Coordination: Nervous System', 'Coordination: Hormones', 'Inherited Change', 'Selection and Evolution',
    'Biodiversity and Classification', 'Genetic Technology', 'Ecology', 'Human Impact on Environment', 'Reproduction',
  ],
  Chemistry: [
    'Atomic Structure', 'Atoms, Molecules and Stoichiometry', 'Chemical Bonding', 'States of Matter', 'Chemical Energetics',
    'Electrochemistry', 'Equilibria', 'Reaction Kinetics', 'The Periodic Table: Chemical Periodicity', 'Group 2 Elements',
    'Group 17 Elements', 'Nitrogen and Sulfur', 'Introduction to Organic Chemistry', 'Hydrocarbons', 'Halogen Compounds',
    'Hydroxy Compounds', 'Carbonyl Compounds', 'Carboxylic Acids and Derivatives', 'Nitrogen Compounds', 'Polymerisation',
    'Organic Synthesis', 'Analytical Techniques', 'Chemistry of Transition Elements', 'Benzene and Aromatic Compounds', 'Phenols',
    'Carbonyl Compounds (Advanced)', 'Carboxylic Acids and Derivatives (Advanced)', 'Nitrogen Compounds (Advanced)',
    'Polymerisation (Advanced)', 'Organic Synthesis (Advanced)', 'Analytical Techniques (Advanced)',
  ],
  Physics: [
    'Physical Quantities and Units', 'Kinematics', 'Dynamics', 'Forces, Density, and Pressure', 'Work, Energy, and Power',
    'Deformation of Solids', 'Waves', 'Superposition', 'Electricity', 'D.C. Circuits', 'Particle Physics', 'Motion in a Circle',
    'Gravitational Fields', 'Temperature', 'Ideal Gases', 'Thermodynamics', 'Oscillations', 'Electric Fields', 'Capacitance',
    'Magnetic Fields', 'Alternating Currents', 'Quantum Physics', 'Nuclear Physics', 'Astronomy and Cosmology',
  ],
  'A-Level Geography': [
    'Climatology', 'Hydrology & Fluvial Geomorphology', 'Geomorphology', 'Biogeography',
    'Population Geography', 'Settlement Geography', 'Agriculture & Food Production', 'Industry, Mining & Energy', 'Environmental Management',
  ],
  'A-Level Computer Science': [
    'Data Representation - Number Systems', 'Data Representation - Binary Arithmetic', 'Data Representation - Character Encoding',
    'Computer Architecture - CPU Structure', 'Networking - Network Topologies', 'SDLC - Analysis and Fact-Finding',
    'Algorithms - Algorithm Design', 'Programming - Programming Fundamentals', 'Databases - Database Concepts',
    'Security and Ethics - Threats and Countermeasures', 'Enterprising - Entrepreneurship in ICT',
  ],
};

export const SUBJECT_COLORS: Record<string, string> = {
  'O Level Mathematics': '#667eea',
  'Pure Mathematics': '#5A67D8',
  English: '#8B5CF6',
  Biology: '#4CAF50',
  Chemistry: '#FF9800',
  Physics: '#2196F3',
  'Computer Science': '#009688',
  'A-Level Computer Science': '#0D47A1',
  Geography: '#2E7D32',
  'A-Level Geography': '#2E7D32',
};

export const SUBJECT_ICONS: Record<string, string> = {
  'O Level Mathematics': '📐',
  'Pure Mathematics': '∫',
  English: '📚',
  Biology: '🧬',
  Chemistry: '⚗️',
  Physics: '⚛️',
  'Computer Science': '💻',
  'A-Level Computer Science': '💻',
  Geography: '🌍',
  'A-Level Geography': '🌍',
};

export const TEACHER_SUBJECTS = [
  'O Level Mathematics', 'Pure Mathematics', 'English', 'Biology', 'Chemistry', 'Physics',
  'Computer Science', 'A-Level Computer Science', 'Geography', 'A-Level Geography',
] as const;

export const GRADE_LEVELS = ['Form 1-2', 'Form 3-4 (O-Level)', 'A-Level'] as const;

export const QUICK_QUESTIONS: Record<string, string[]> = {
  Biology: ['Explain Photosynthesis', 'What is a Cell?', 'Define Osmosis', 'Functions of the Heart'],
  Chemistry: ['Periodic Table trends', 'What is a Mole?', 'Acids and Bases', 'Bonding types'],
  Physics: ["Newton's Laws", "Ohm's Law", 'Types of Energy', 'Reflection vs Refraction'],
  'O Level Mathematics': [
    'Algebra Basics', 'Pythagoras Theorem', 'Trigonometry Rules', 'Matrices', 'Vectors',
    'Circle Theorems', 'Probability', 'Statistics', 'Sequences & Series', 'Mensuration', 'Transformations',
  ],
  'Pure Mathematics': [
    'Differentiation', 'Integration', 'Trigonometry Identities', 'Complex Numbers', 'Vector Geometry',
    'Sequences & Series', 'Binomial Expansion', 'Functions', 'Coordinate Geometry',
  ],
  'Combined Science': ['Scientific Method', 'Lab Safety', 'Units of Measurement'],
};
