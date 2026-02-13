// Teacher Marketplace constants – subject/level taxonomy for ZIMSEC & Cambridge

export const MARKETPLACE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Computer Science',
  'Geography',
  'Commerce',
  'History',
  'Accounting',
  'Business Enterprise Skills',
] as const;

export type MarketplaceSubject = (typeof MARKETPLACE_SUBJECTS)[number];

export const ACADEMIC_LEVELS = ['O-Level', 'A-Level'] as const;

export const FORM_LEVELS = [
  'Form 1',
  'Form 2',
  'Form 3',
  'Form 4',
  'Form 5',
  'Form 6',
] as const;

export const CURRICULA = ['ZIMSEC', 'Cambridge'] as const;

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const QUALIFICATION_TYPES = [
  'ZIMSEC',
  'Cambridge',
  'Diploma',
  'Degree',
  'Other',
] as const;

/** Maps academic levels to their corresponding form levels */
export const LEVEL_FORM_MAP: Record<string, string[]> = {
  'O-Level': ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
  'A-Level': ['Form 5', 'Form 6'],
};

/** Subject colors for the marketplace UI */
export const MARKETPLACE_SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#667eea',
  Physics: '#2196F3',
  Chemistry: '#FF9800',
  Biology: '#4CAF50',
  English: '#8B5CF6',
  'Computer Science': '#009688',
  Geography: '#2E7D32',
  Commerce: '#FF6D00',
  History: '#FF6E40',
  Accounting: '#448AFF',
  'Business Enterprise Skills': '#E040FB',
};

/** Subject icons (emoji) for quick visual identification */
export const MARKETPLACE_SUBJECT_ICONS: Record<string, string> = {
  Mathematics: '📐',
  Physics: '⚛️',
  Chemistry: '⚗️',
  Biology: '🧬',
  English: '📚',
  'Computer Science': '💻',
  Geography: '🌍',
  Commerce: '🛒',
  History: '🏛️',
  Accounting: '📊',
  'Business Enterprise Skills': '💼',
};

/** Featured / mock teacher data for the landing page preview */
export const FEATURED_TEACHERS = [
  {
    id: 'demo-1',
    full_name: 'Mr. Tendai',
    surname: 'Moyo',
    bio: 'Experienced Mathematics teacher with 8 years in ZIMSEC O-Level & A-Level curriculum. I make complex topics simple and fun.',
    subjects: ['Mathematics', 'Physics'],
    rating: 4.9,
    reviews: 127,
    image: null,
    level: 'O-Level & A-Level',
  },
  {
    id: 'demo-2',
    full_name: 'Mrs. Rudo',
    surname: 'Chikwanha',
    bio: 'Passionate Biology & Chemistry educator. Cambridge and ZIMSEC certified. Specialising in practical exam preparation.',
    subjects: ['Biology', 'Chemistry'],
    rating: 4.8,
    reviews: 93,
    image: null,
    level: 'O-Level',
  },
  {
    id: 'demo-3',
    full_name: 'Mr. Kudzai',
    surname: 'Nyathi',
    bio: 'Computer Science specialist helping students master programming and theory for both ZIMSEC and Cambridge syllabi.',
    subjects: ['Computer Science', 'Mathematics'],
    rating: 4.7,
    reviews: 64,
    image: null,
    level: 'O-Level & A-Level',
  },
];

/** Time slots for availability selection (30-min increments) */
export const TIME_SLOTS: string[] = [];
for (let h = 6; h <= 21; h++) {
  for (const m of ['00', '30']) {
    const hour = h.toString().padStart(2, '0');
    TIME_SLOTS.push(`${hour}:${m}`);
  }
}
