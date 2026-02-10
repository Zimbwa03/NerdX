// English Learning Virtual Labs - Immersive Communication Simulations
// Designed for African learners to build practical English skills

import type { HandsOnActivityConfig, SimulationMetadata } from './simulationTypes';

// ----------------------------
// Helper functions
// ----------------------------

const match = (prompt: string, pairs: { left: string; right: string }[], requiredCorrectToUnlock = 3): HandsOnActivityConfig => ({
    type: 'matching',
    prompt,
    pairs,
    requiredCorrectToUnlock,
});

const seq = (prompt: string, steps: string[]): HandsOnActivityConfig => ({
    type: 'sequencing',
    prompt,
    steps,
    requiredCorrectToUnlock: steps.length,
});

// ----------------------------
// English Simulations (12 Total)
// ----------------------------

export const ENGLISH_SIMULATIONS: SimulationMetadata[] = [
    // ==========================
    // 1. MARKET NEGOTIATION
    // ==========================
    {
        id: 'eng-market-negotiation',
        title: 'Market Negotiation',
        subject: 'english',
        topic: 'Practical Communication',
        description: 'Learn to greet vendors, negotiate prices politely, and complete purchases at a local African market using confident English.',
        difficulty: 'easy',
        xpReward: 150,
        estimatedTime: '10-15 mins',
        icon: 'cart',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'mn-1', text: 'Use polite greetings and inquiry phrases' },
            { id: 'mn-2', text: 'Negotiate prices respectfully' },
            { id: 'mn-3', text: 'Complete transactions with appropriate vocabulary' },
            { id: 'mn-4', text: 'Understand cultural context of African market bargaining' },
        ],
        handsOnActivity: seq('Arrange the market negotiation steps in the correct order:', [
            'Greet the vendor warmly and ask about their day',
            'Inquire about the product and its price',
            'Express interest but suggest a lower price politely',
            'Listen to counter-offer and find middle ground',
            'Agree on final price and complete payment',
            'Thank the vendor and wish them well',
        ]),
        quizQuestions: [
            {
                id: 'mn-q1',
                question: 'Which is the most polite way to ask about a price?',
                options: ['How much?', 'What\'s the price?', 'Good morning! Could you tell me how much these tomatoes cost, please?', 'Give me the price.'],
                correctIndex: 2,
                explanation: 'A greeting followed by a polite question with "please" shows respect and creates a positive interaction.',
            },
            {
                id: 'mn-q2',
                question: 'When negotiating, which phrase is most effective?',
                options: ['That\'s too expensive, give me a discount!', 'I really like these, but I was hoping for a better price. Would you consider...?', 'I can get this cheaper somewhere else.', 'Lower the price now.'],
                correctIndex: 1,
                explanation: 'Starting with a compliment and using "I was hoping" softens the request and shows respect.',
            },
            {
                id: 'mn-q3',
                question: 'What vocabulary is essential for completing a purchase?',
                options: ['Restaurant terms', 'Payment, change, receipt, total, quantity', 'Medical terms', 'Travel vocabulary'],
                correctIndex: 1,
                explanation: 'Transaction vocabulary like payment, change, and receipt helps complete purchases smoothly.',
            },
            {
                id: 'mn-q4',
                question: 'Why is it important to greet vendors before starting negotiations?',
                options: ['It\'s not important', 'It shows respect and creates a positive relationship', 'It wastes time', 'It confuses the vendor'],
                correctIndex: 1,
                explanation: 'In African culture, greetings establish respect and a friendly relationship before business discussions.',
            },
        ],
    },

    // ==========================
    // 2. JOB INTERVIEW
    // ==========================
    {
        id: 'eng-job-interview',
        title: 'Professional Job Interview',
        subject: 'english',
        topic: 'Professional Communication',
        description: 'Master self-introduction, articulate your strengths with evidence, and handle behavioral questions using the STAR method.',
        difficulty: 'hard',
        xpReward: 225,
        estimatedTime: '20-25 mins',
        icon: 'briefcase',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'ji-1', text: 'Introduce yourself professionally with relevant qualifications' },
            { id: 'ji-2', text: 'Discuss strengths with specific examples' },
            { id: 'ji-3', text: 'Use the STAR method for behavioral questions' },
            { id: 'ji-4', text: 'Demonstrate confidence without arrogance' },
        ],
        handsOnActivity: match('Match the interview phrase to its purpose:', [
            { left: 'Thank you for this opportunity...', right: 'Opening with gratitude' },
            { left: 'In my previous role, I successfully...', right: 'Providing evidence of experience' },
            { left: 'I am passionate about...', right: 'Showing genuine interest' },
            { left: 'The result was a 20% improvement in...', right: 'Quantifying achievements (STAR-Result)' },
            { left: 'Could you tell me more about the team?', right: 'Asking thoughtful questions' },
        ]),
        quizQuestions: [
            {
                id: 'ji-q1',
                question: 'What does the "A" in the STAR method stand for?',
                options: ['Attitude', 'Achievement', 'Action', 'Application'],
                correctIndex: 2,
                explanation: 'STAR = Situation, Task, Action, Result. The "A" describes the specific actions you took.',
            },
            {
                id: 'ji-q2',
                question: 'Which is the best way to discuss a weakness in an interview?',
                options: ['I don\'t have any weaknesses', 'I sometimes work too hard', 'I\'m working on improving my public speaking by attending workshops', 'My weakness is I\'m perfect'],
                correctIndex: 2,
                explanation: 'Acknowledging a real weakness and explaining how you\'re improving shows self-awareness and growth mindset.',
            },
            {
                id: 'ji-q3',
                question: 'Why should you ask questions at the end of an interview?',
                options: ['To waste time', 'It shows genuine interest and helps you evaluate the company', 'It\'s not necessary', 'To prove you\'re smart'],
                correctIndex: 1,
                explanation: 'Asking thoughtful questions demonstrates your interest and helps you decide if the role is right for you.',
            },
            {
                id: 'ji-q4',
                question: 'Which phrase best shows confidence without arrogance?',
                options: ['I\'m the best candidate you\'ll find', 'I believe my experience in... makes me well-suited for this role', 'I know everything about this job', 'Hire me or you\'ll regret it'],
                correctIndex: 1,
                explanation: 'Using "I believe" with specific experience shows confidence while remaining humble and professional.',
            },
        ],
    },

    // ==========================
    // 3. UNIVERSITY CAMPUS
    // ==========================
    {
        id: 'eng-university-campus',
        title: 'University Campus Life',
        subject: 'english',
        topic: 'Academic Communication',
        description: 'Participate in class discussions, collaborate in group projects, and deliver structured academic presentations.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'school',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'uc-1', text: 'Contribute to academic debates with evidence' },
            { id: 'uc-2', text: 'Collaborate effectively in group settings' },
            { id: 'uc-3', text: 'Use academic discourse markers' },
            { id: 'uc-4', text: 'Deliver structured presentations with signposting' },
        ],
        handsOnActivity: seq('Order these steps for delivering an academic presentation:', [
            'Greet the audience and introduce your topic',
            'Outline the structure: "I will discuss three main points..."',
            'Present your first point with supporting evidence',
            'Use transitions: "Moving on to my second point..."',
            'Summarize key findings and draw conclusions',
            'Thank the audience and invite questions',
        ]),
        quizQuestions: [
            {
                id: 'uc-q1',
                question: 'Which phrase is best for disagreeing respectfully in class?',
                options: ['You\'re completely wrong', 'I see your point, however...', 'That\'s stupid', 'Whatever'],
                correctIndex: 1,
                explanation: '"I see your point, however..." acknowledges the other person\'s view before presenting your perspective.',
            },
            {
                id: 'uc-q2',
                question: 'What is a signposting phrase in presentations?',
                options: ['A phrase used to give directions', 'Language that guides the audience through your structure', 'A type of greeting', 'A conclusion'],
                correctIndex: 1,
                explanation: 'Signposting phrases like "Moving on to..." help your audience follow your presentation structure.',
            },
            {
                id: 'uc-q3',
                question: 'When collaborating in a group, which is the best approach?',
                options: ['Do all the work yourself', 'Volunteer for a role that matches your strengths', 'Let others decide everything', 'Criticize others\' ideas'],
                correctIndex: 1,
                explanation: 'Volunteering for suitable roles shows initiative while respecting team dynamics.',
            },
            {
                id: 'uc-q4',
                question: 'Which academic discourse marker introduces evidence?',
                options: ['In conclusion', 'According to research by...', 'Moving on', 'Finally'],
                correctIndex: 1,
                explanation: '"According to..." introduces credible evidence to support your argument.',
            },
        ],
    },

    // ==========================
    // 4. MEDICAL CONSULTATION
    // ==========================
    {
        id: 'eng-medical-consultation',
        title: 'Medical Consultation',
        subject: 'english',
        topic: 'Health Communication',
        description: 'Describe symptoms clearly, understand prescriptions, and advocate for your health by asking follow-up questions.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'medkit',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'mc-1', text: 'Describe symptoms with duration and intensity' },
            { id: 'mc-2', text: 'Understand and confirm medical instructions' },
            { id: 'mc-3', text: 'Ask about side effects and precautions' },
            { id: 'mc-4', text: 'Communicate health history accurately' },
        ],
        handsOnActivity: match('Match the medical phrase to its purpose:', [
            { left: 'I\'ve been experiencing... for three days', right: 'Describing symptom duration' },
            { left: 'Could you explain what this medication does?', right: 'Understanding prescriptions' },
            { left: 'Are there any side effects I should watch for?', right: 'Asking about precautions' },
            { left: 'So I should take this twice daily with food?', right: 'Confirming instructions' },
            { left: 'I\'m allergic to penicillin', right: 'Sharing medical history' },
        ]),
        quizQuestions: [
            {
                id: 'mc-q1',
                question: 'Why is it important to describe how long symptoms have lasted?',
                options: ['It\'s not important', 'It helps the doctor assess severity and progression', 'It wastes the doctor\'s time', 'It\'s just polite conversation'],
                correctIndex: 1,
                explanation: 'Duration helps doctors understand whether conditions are acute or chronic and guide treatment decisions.',
            },
            {
                id: 'mc-q2',
                question: 'Which phrase best confirms you understood prescription instructions?',
                options: ['OK', 'What?', 'So if I understand correctly, I should take two tablets every eight hours?', 'Sure, whatever you say'],
                correctIndex: 2,
                explanation: 'Paraphrasing instructions back to the doctor ensures you understood correctly and catches any errors.',
            },
            {
                id: 'mc-q3',
                question: 'Is asking questions about your treatment a sign of disrespect to the doctor?',
                options: ['Yes, always', 'No, it shows you\'re taking responsibility for your health', 'Sometimes', 'Doctors prefer you don\'t ask'],
                correctIndex: 1,
                explanation: 'Good doctors encourage questions. Asking shows responsibility and helps prevent misunderstandings.',
            },
            {
                id: 'mc-q4',
                question: 'What does "dosage" mean?',
                options: ['The color of the medication', 'The amount of medicine to take at one time', 'The pharmacy name', 'The doctor\'s name'],
                correctIndex: 1,
                explanation: 'Dosage refers to the specific amount of medication to take at each interval.',
            },
        ],
    },

    // ==========================
    // 5. INTERNATIONAL TRAVEL
    // ==========================
    {
        id: 'eng-international-travel',
        title: 'International Travel',
        subject: 'english',
        topic: 'Travel Communication',
        description: 'Navigate airports, resolve hotel issues professionally, and ask for directions in unfamiliar places.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'airplane',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'it-1', text: 'Navigate airport check-in and security procedures' },
            { id: 'it-2', text: 'Handle hotel issues calmly and professionally' },
            { id: 'it-3', text: 'Ask for and understand directions' },
            { id: 'it-4', text: 'Use travel-specific vocabulary confidently' },
        ],
        handsOnActivity: seq('Order the airport arrival process:', [
            'Approach check-in counter with passport and ticket',
            'Present documents and answer check-in agent\'s questions',
            'Confirm seat preference and receive boarding pass',
            'Proceed to security and follow instructions',
            'Find your departure gate on the information screens',
            'Board the flight when your zone is called',
        ]),
        quizQuestions: [
            {
                id: 'it-q1',
                question: 'If the hotel can\'t find your reservation, what\'s the best response?',
                options: ['Scream at the receptionist', 'Calmly provide your confirmation number and ask them to check again', 'Leave immediately', 'Cry'],
                correctIndex: 1,
                explanation: 'Staying calm and providing documentation helps resolve the issue professionally.',
            },
            {
                id: 'it-q2',
                question: 'What does "boarding pass" mean?',
                options: ['A train ticket', 'A document that allows you to board your flight', 'A hotel key card', 'A bus pass'],
                correctIndex: 1,
                explanation: 'A boarding pass is the document you need to get on your flight, showing your seat and gate.',
            },
            {
                id: 'it-q3',
                question: 'Which phrase is best for asking directions?',
                options: ['Where is it?', 'Could you tell me how to get to the train station from here?', 'Train station!', 'I need directions now'],
                correctIndex: 1,
                explanation: 'A complete, polite question with context helps people give you accurate directions.',
            },
            {
                id: 'it-q4',
                question: 'What should you do at passport control?',
                options: ['Run through quickly', 'Wait patiently, present your passport, and answer questions honestly', 'Avoid eye contact', 'Refuse to answer questions'],
                correctIndex: 1,
                explanation: 'Being patient, honest, and cooperative makes the process smooth and trouble-free.',
            },
        ],
    },

    // ==========================
    // 6. SOCIAL GATHERINGS
    // ==========================
    {
        id: 'eng-social-gatherings',
        title: 'Social Gatherings',
        subject: 'english',
        topic: 'Social Communication',
        description: 'Make great first impressions, discuss shared interests, and arrange future meetups at social events.',
        difficulty: 'easy',
        xpReward: 150,
        estimatedTime: '10-15 mins',
        icon: 'people',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'sg-1', text: 'Introduce yourself confidently' },
            { id: 'sg-2', text: 'Keep conversations flowing with follow-up questions' },
            { id: 'sg-3', text: 'Find common ground and shared interests' },
            { id: 'sg-4', text: 'Make plans for future meetings' },
        ],
        handsOnActivity: match('Match the social phrase to its function:', [
            { left: 'Hi, I\'m Tendai. Nice to meet you!', right: 'Self-introduction' },
            { left: 'That sounds interesting! How did you get into that?', right: 'Showing genuine interest' },
            { left: 'I love football too! Do you support a local team?', right: 'Finding common ground' },
            { left: 'It was great chatting. We should grab coffee sometime!', right: 'Suggesting future plans' },
        ]),
        quizQuestions: [
            {
                id: 'sg-q1',
                question: 'What\'s the best way to keep a conversation going?',
                options: ['Talk only about yourself', 'Ask follow-up questions about what the other person says', 'Stay silent', 'Check your phone frequently'],
                correctIndex: 1,
                explanation: 'Follow-up questions show you\'re listening and interested, encouraging the other person to share more.',
            },
            {
                id: 'sg-q2',
                question: 'Which phrase shows you\'re interested in someone\'s hobby?',
                options: ['That\'s boring', 'Oh, I don\'t care about that', 'That\'s fascinating! What got you started?', 'Whatever'],
                correctIndex: 2,
                explanation: 'Enthusiasm followed by a question invites them to share more and shows genuine interest.',
            },
            {
                id: 'sg-q3',
                question: 'What\'s the best way to end a conversation at a party?',
                options: ['Walk away without saying anything', 'It was lovely meeting you. Let\'s connect on social media!', 'Ignore them', 'Say something rude'],
                correctIndex: 1,
                explanation: 'A polite closing with a suggestion to stay connected leaves a positive lasting impression.',
            },
            {
                id: 'sg-q4',
                question: 'How can you find common ground quickly?',
                options: ['Ask about their work, hobbies, or where they\'re from', 'Don\'t ask any questions', 'Only talk about yourself', 'Avoid all topics'],
                correctIndex: 0,
                explanation: 'Open-ended questions about work, interests, or background help discover shared interests.',
            },
        ],
    },

    // ==========================
    // 7. BANKING SERVICES
    // ==========================
    {
        id: 'eng-banking-services',
        title: 'Banking & Financial Services',
        subject: 'english',
        topic: 'Financial Communication',
        description: 'Open bank accounts, understand financial terms, and conduct banking transactions with confidence.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'card',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'bs-1', text: 'Request banking services professionally' },
            { id: 'bs-2', text: 'Understand common financial vocabulary' },
            { id: 'bs-3', text: 'Ask clarifying questions about terms and fees' },
            { id: 'bs-4', text: 'Complete transactions accurately' },
        ],
        handsOnActivity: match('Match the banking term to its meaning:', [
            { left: 'Savings account', right: 'An account for storing money and earning interest' },
            { left: 'Current account', right: 'An account for daily transactions' },
            { left: 'Interest rate', right: 'The percentage earned or paid on money' },
            { left: 'Balance', right: 'The amount of money currently in your account' },
            { left: 'Transaction', right: 'Any activity involving money in/out of account' },
        ]),
        quizQuestions: [
            {
                id: 'bs-q1',
                question: 'What documents are typically needed to open a bank account?',
                options: ['Nothing', 'ID, proof of address, and sometimes proof of income', 'Just your name', 'Only a phone number'],
                correctIndex: 1,
                explanation: 'Banks require identification and proof of address to verify your identity and comply with regulations.',
            },
            {
                id: 'bs-q2',
                question: 'What is an "overdraft"?',
                options: ['Extra money you deposit', 'When you spend more than your account balance', 'A type of savings plan', 'Interest earned'],
                correctIndex: 1,
                explanation: 'An overdraft occurs when you withdraw more money than available, which usually incurs fees.',
            },
            {
                id: 'bs-q3',
                question: 'Which question should you ask before opening an account?',
                options: ['What\'s your favorite color?', 'Are there any monthly fees or minimum balance requirements?', 'What\'s your name?', 'Do you like this bank?'],
                correctIndex: 1,
                explanation: 'Understanding fees and requirements helps you choose the right account and avoid unexpected charges.',
            },
            {
                id: 'bs-q4',
                question: 'What does "transfer funds" mean?',
                options: ['Withdraw cash', 'Move money from one account to another', 'Close an account', 'Check your balance'],
                correctIndex: 1,
                explanation: 'Transferring funds means moving money between accounts, whether your own or to another person.',
            },
        ],
    },

    // ==========================
    // 8. RESTAURANT DINING
    // ==========================
    {
        id: 'eng-restaurant-dining',
        title: 'Restaurant Dining',
        subject: 'english',
        topic: 'Social Communication',
        description: 'Order food confidently, handle service issues politely, and understand dining etiquette in various settings.',
        difficulty: 'easy',
        xpReward: 150,
        estimatedTime: '10-15 mins',
        icon: 'restaurant',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'rd-1', text: 'Order food and drinks politely' },
            { id: 'rd-2', text: 'Handle complaints professionally' },
            { id: 'rd-3', text: 'Ask for recommendations and modifications' },
            { id: 'rd-4', text: 'Request and pay the bill correctly' },
        ],
        handsOnActivity: seq('Order the dining experience from start to finish:', [
            'Greet the host and request a table',
            'Review the menu and ask about recommendations',
            'Place your order with any dietary requirements',
            'Enjoy your meal and request any additional items',
            'Politely address any issues with the order if needed',
            'Request the bill and leave appropriate gratuity',
        ]),
        quizQuestions: [
            {
                id: 'rd-q1',
                question: 'What\'s a polite way to call the waiter\'s attention?',
                options: ['Snap your fingers', 'Shout loudly', 'Make eye contact and raise your hand slightly, or say "Excuse me"', 'Bang on the table'],
                correctIndex: 2,
                explanation: 'Eye contact with a raised hand or saying "Excuse me" is respectful and effective.',
            },
            {
                id: 'rd-q2',
                question: 'If your food is cold, what\'s the best approach?',
                options: ['Eat it anyway', 'Leave without paying', 'Politely say: "Excuse me, my food seems to have gone cold. Would it be possible to warm it up?"', 'Throw the food at the waiter'],
                correctIndex: 2,
                explanation: 'A polite, specific request is more likely to get a positive response and resolution.',
            },
            {
                id: 'rd-q3',
                question: 'What does "dietary requirement" mean?',
                options: ['How hungry you are', 'Special food needs due to allergies, religion, or health', 'The restaurant\'s rules', 'The price of food'],
                correctIndex: 1,
                explanation: 'Dietary requirements are restrictions or preferences based on health, religion, or lifestyle.',
            },
            {
                id: 'rd-q4',
                question: 'How do you request the bill in English?',
                options: ['Give me money!', 'Could I have the bill, please?', 'I want to leave now', 'Pay me'],
                correctIndex: 1,
                explanation: '"Could I have the bill, please?" is polite and clear.',
            },
        ],
    },

    // ==========================
    // 9. PHONE CONVERSATIONS
    // ==========================
    {
        id: 'eng-phone-conversations',
        title: 'Phone Conversations',
        subject: 'english',
        topic: 'Professional Communication',
        description: 'Handle professional calls confidently, leave effective voicemails, and manage conference calls.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'call',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'pc-1', text: 'Answer calls professionally' },
            { id: 'pc-2', text: 'Leave clear, effective voicemails' },
            { id: 'pc-3', text: 'Transfer calls and take messages' },
            { id: 'pc-4', text: 'Handle difficult callers calmly' },
        ],
        handsOnActivity: match('Match the phone phrase to its situation:', [
            { left: 'Good morning, this is Chipo speaking. How may I help you?', right: 'Answering a professional call' },
            { left: 'May I ask who\'s calling?', right: 'Requesting caller identification' },
            { left: 'I\'ll transfer you to the relevant department now', right: 'Transferring a call' },
            { left: 'Please leave your name, number, and a brief message', right: 'Voicemail greeting' },
            { left: 'I understand your frustration. Let me see how I can help', right: 'Handling a difficult caller' },
        ]),
        quizQuestions: [
            {
                id: 'pc-q1',
                question: 'What should a professional voicemail include?',
                options: ['Just your phone number', 'Your name, reason for calling, a callback number, and the best time to reach you', 'Random sounds', 'Only your name'],
                correctIndex: 1,
                explanation: 'A complete voicemail helps the recipient understand your needs and return your call effectively.',
            },
            {
                id: 'pc-q2',
                question: 'How should you answer a business call?',
                options: ['What do you want?', 'Hello', 'Good morning, [Company Name], this is [Your Name] speaking. How may I assist you?', 'Yeah?'],
                correctIndex: 2,
                explanation: 'A professional greeting includes company name, your name, and an offer to help.',
            },
            {
                id: 'pc-q3',
                question: 'If a caller is upset, what\'s the best first response?',
                options: ['Hang up', 'Argue with them', 'Listen actively and acknowledge their feelings', 'Transfer them immediately'],
                correctIndex: 2,
                explanation: 'Active listening and acknowledgment helps calm the situation before problem-solving.',
            },
            {
                id: 'pc-q4',
                question: 'What does "put you on hold" mean?',
                options: ['End the call', 'Ask you to wait while music plays', 'Transfer you', 'Ignore you'],
                correctIndex: 1,
                explanation: 'Being put on hold means waiting temporarily, often with background music.',
            },
        ],
    },

    // ==========================
    // 10. WORKPLACE MEETINGS
    // ==========================
    {
        id: 'eng-workplace-meetings',
        title: 'Workplace Meetings',
        subject: 'english',
        topic: 'Professional Communication',
        description: 'Present ideas effectively, agree and disagree professionally, and contribute meaningfully to team discussions.',
        difficulty: 'hard',
        xpReward: 225,
        estimatedTime: '20-25 mins',
        icon: 'business',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'wm-1', text: 'Present ideas clearly and persuasively' },
            { id: 'wm-2', text: 'Agree and disagree diplomatically' },
            { id: 'wm-3', text: 'Ask for clarification effectively' },
            { id: 'wm-4', text: 'Summarize and action items' },
        ],
        handsOnActivity: match('Match the meeting phrase to its purpose:', [
            { left: 'I\'d like to propose that we...', right: 'Presenting an idea' },
            { left: 'I agree with your point about...', right: 'Showing agreement' },
            { left: 'I see your perspective, however...', right: 'Disagreeing diplomatically' },
            { left: 'Could you elaborate on that?', right: 'Asking for clarification' },
            { left: 'To summarize, we\'ve agreed to...', right: 'Wrapping up with action items' },
        ]),
        quizQuestions: [
            {
                id: 'wm-q1',
                question: 'What\'s the best way to disagree with a colleague in a meeting?',
                options: ['That\'s a stupid idea', 'You\'re wrong', 'I understand your point, but have we considered...?', 'I disagree. Next topic.'],
                correctIndex: 2,
                explanation: 'Acknowledging their point before presenting an alternative shows respect and opens dialogue.',
            },
            {
                id: 'wm-q2',
                question: 'Why is it important to summarize action items at the end of a meeting?',
                options: ['It\'s not important', 'To ensure everyone knows their responsibilities', 'To waste time', 'To show off'],
                correctIndex: 1,
                explanation: 'Clear action items ensure accountability and prevent misunderstandings about next steps.',
            },
            {
                id: 'wm-q3',
                question: 'Which phrase is best for asking someone to explain more?',
                options: ['I don\'t get it', 'Huh?', 'Could you expand on that point, please?', 'What?'],
                correctIndex: 2,
                explanation: 'A polite, specific request for elaboration shows professionalism and genuine interest.',
            },
            {
                id: 'wm-q4',
                question: 'What does "table the discussion" mean in business English?',
                options: ['Put papers on the table', 'Postpone the topic for later', 'End the meeting', 'Stand on the table'],
                correctIndex: 1,
                explanation: 'To "table" something means to set it aside for discussion at a later time.',
            },
        ],
    },

    // ==========================
    // 11. RENTING ACCOMMODATION
    // ==========================
    {
        id: 'eng-renting-accommodation',
        title: 'Renting Accommodation',
        subject: 'english',
        topic: 'Practical Communication',
        description: 'View properties, understand lease terms, and communicate with landlords professionally.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'home',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'ra-1', text: 'Ask relevant questions during property viewings' },
            { id: 'ra-2', text: 'Understand key lease terminology' },
            { id: 'ra-3', text: 'Negotiate rental terms professionally' },
            { id: 'ra-4', text: 'Report maintenance issues clearly' },
        ],
        handsOnActivity: seq('Order the steps in the rental process:', [
            'Search for properties and schedule viewings',
            'View the property and ask questions about utilities, repairs, etc.',
            'Review the lease agreement carefully',
            'Negotiate terms if needed and pay deposit',
            'Sign the lease and collect keys',
            'Document the property condition before moving in',
        ]),
        quizQuestions: [
            {
                id: 'ra-q1',
                question: 'What is a "deposit" in rental terms?',
                options: ['Monthly rent', 'Money paid upfront as security against damages', 'A gift to the landlord', 'Furniture payment'],
                correctIndex: 1,
                explanation: 'A deposit is money held by the landlord as security, usually returned when you leave if no damage occurred.',
            },
            {
                id: 'ra-q2',
                question: 'What should you ask about during a property viewing?',
                options: ['Nothing', 'Utilities included, repair responsibility, lease duration, and notice period', 'Only the price', 'The landlord\'s personal life'],
                correctIndex: 1,
                explanation: 'Asking about utilities, repairs, and terms helps you understand the full cost and your responsibilities.',
            },
            {
                id: 'ra-q3',
                question: 'What does "give notice" mean in renting?',
                options: ['Look at something', 'Formally inform the landlord you\'re leaving', 'Pay extra rent', 'Break the door'],
                correctIndex: 1,
                explanation: 'Giving notice means formally telling your landlord in advance that you plan to move out.',
            },
            {
                id: 'ra-q4',
                question: 'Why is it important to document the property condition before moving in?',
                options: ['It\'s a waste of time', 'To avoid being blamed for pre-existing damage when you leave', 'For social media', 'To show friends'],
                correctIndex: 1,
                explanation: 'Documenting conditions protects you from losing your deposit due to damage that existed before you moved in.',
            },
        ],
    },

    // ==========================
    // 12. EMERGENCY SITUATIONS
    // ==========================
    {
        id: 'eng-emergency-situations',
        title: 'Emergency Situations',
        subject: 'english',
        topic: 'Safety Communication',
        description: 'Report emergencies clearly, provide accurate information to authorities, and remain calm under pressure.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'warning',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'es-1', text: 'Call emergency services and provide clear information' },
            { id: 'es-2', text: 'Describe locations and situations accurately' },
            { id: 'es-3', text: 'Stay calm and follow instructions' },
            { id: 'es-4', text: 'Report incidents to police clearly' },
        ],
        handsOnActivity: match('Match the emergency phrase to its purpose:', [
            { left: 'There\'s been an accident at...', right: 'Reporting the type and location' },
            { left: 'The person is conscious but bleeding heavily', right: 'Describing the victim\'s condition' },
            { left: 'I need police and an ambulance', right: 'Requesting specific services' },
            { left: 'I\'m at the corner of Main Street and 5th Avenue', right: 'Providing exact location' },
            { left: 'I\'ll stay on the line until help arrives', right: 'Confirming availability' },
        ]),
        quizQuestions: [
            {
                id: 'es-q1',
                question: 'What information should you provide first when calling emergency services?',
                options: ['Your life story', 'The emergency type and location', 'What you had for breakfast', 'Your opinions'],
                correctIndex: 1,
                explanation: 'The type of emergency and location help dispatchers send the right help to the right place quickly.',
            },
            {
                id: 'es-q2',
                question: 'Why should you stay calm during an emergency call?',
                options: ['It doesn\'t matter', 'Clear communication helps dispatchers understand the situation', 'To sound cool', 'Emergency services prefer calm people'],
                correctIndex: 1,
                explanation: 'Calm, clear communication ensures accurate information is transmitted for faster, effective response.',
            },
            {
                id: 'es-q3',
                question: 'What does "stay on the line" mean?',
                options: ['Stand in a queue', 'Keep the phone call connected', 'Hang up immediately', 'Draw a line'],
                correctIndex: 1,
                explanation: 'Staying on the line means keeping the phone connection active, which lets operators give instructions.',
            },
            {
                id: 'es-q4',
                question: 'When reporting to police, what details are most helpful?',
                options: ['Vague descriptions', 'Specific details: time, location, description of people/vehicles', 'Rumors', 'Assumptions'],
                correctIndex: 1,
                explanation: 'Specific, factual details help police investigate effectively and take appropriate action.',
            },
        ],
    },
];
