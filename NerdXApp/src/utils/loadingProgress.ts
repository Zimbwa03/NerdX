export interface LoadingProgressStep {
    label: string;
    emoji?: string;
}

const MATH_STEPS: LoadingProgressStep[] = [
    { emoji: '📥', label: 'Loading topic context' },
    { emoji: '🧠', label: 'Generating question' },
    { emoji: '📚', label: 'Selecting syllabus objectives' },
    { emoji: '🧮', label: 'Balancing difficulty' },
    { emoji: '📝', label: 'Drafting marking points' },
    { emoji: '🧩', label: 'Refining marking points' },
    { emoji: '🔍', label: 'Checking method and accuracy' },
    { emoji: '✅', label: 'Complete' },
];

const GENERIC_STEPS: LoadingProgressStep[] = [
    { emoji: '📥', label: 'Loading topic context' },
    { emoji: '🧠', label: 'Generating question' },
    { emoji: '📝', label: 'Drafting answer key' },
    { emoji: '🔍', label: 'Checking accuracy' },
    { emoji: '✅', label: 'Complete' },
];

const CS_STEPS: LoadingProgressStep[] = [
    { emoji: '💻', label: 'Loading topic context' },
    { emoji: '🧠', label: 'Generating question' },
    { emoji: '📋', label: 'Selecting syllabus objectives' },
    { emoji: '📝', label: 'Drafting marking scheme' },
    { emoji: '🔍', label: 'Checking accuracy' },
    { emoji: '✅', label: 'Complete' },
];

export const getSubjectLoadingSteps = (subjectId?: string): LoadingProgressStep[] => {
    const id = subjectId?.toLowerCase() || '';
    if (id.includes('math')) return MATH_STEPS;
    if (id === 'computer_science') return CS_STEPS;
    return GENERIC_STEPS;
};

export const getSubjectDisplayName = (subjectId?: string, fallback?: string): string => {
    if (!subjectId) return fallback || 'Subject';
    const id = subjectId.toLowerCase();
    if (id === 'mathematics') return 'All-Level Mathematics';
    if (id === 'pure_math' || id === 'a_level_pure_math') return 'A-Level Pure Mathematics';
    if (id === 'computer_science') return 'Computer Science';
    if (fallback) return fallback;
    return subjectId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getExamLoadingConfig = (
    subjectId?: string,
    phase: 'setup' | 'question' = 'setup'
) => {
    const subjectName = getSubjectDisplayName(subjectId);
    const steps = getSubjectLoadingSteps(subjectId);
    const message = phase === 'setup'
        ? `Preparing your ${subjectName} exam...`
        : `Loading your next ${subjectName} question...`;

    return {
        message,
        stage: 'Preparing',
        steps,
        estimatedTime: phase === 'setup' ? 6 : 5,
    };
};
