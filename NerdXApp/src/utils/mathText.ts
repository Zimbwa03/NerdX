export const isMathSubjectId = (subjectId?: string): boolean => {
    const subject = (subjectId || '').toLowerCase();
    return subject.includes('math') ||
        subject === 'mathematics' ||
        subject === 'pure_math' ||
        subject === 'a_level_pure_math';
};

export const shouldRenderMathText = (text?: string): boolean => {
    if (!text) return false;
    return /[\^_×÷=]/.test(text) ||
        /(\d+\s*[x×]\s*\d+)/.test(text) ||
        /\w+\^\w+/.test(text) ||
        /sqrt|\bpi\b/i.test(text);
};

export const toMathLatex = (text: string, enable: boolean): string => {
    if (!text || !enable) return text;

    if (text.includes('$')) return text;

    let processed = text;

    processed = processed.replace(/(\d+|\w+)\s*x\s*(\d+|\w+)/gi, '$1 \\times $2');

    processed = processed.replace(/(\w+)\^(\d+|\w+)/g, (match, base, exp) => {
        if (exp.length > 1 || /[a-zA-Z]/.test(exp)) {
            return `${base}^{${exp}}`;
        }
        return `${base}^{${exp}}`;
    });

    const hasMathNotation = /[\^_\×\÷\+\-\=\(\)]/.test(processed) ||
        /(\d+\s*[x×]\s*\d+)/.test(processed) ||
        /\w+\^\w+/.test(processed);

    if (hasMathNotation && !processed.includes('$')) {
        const mathPattern = /^[\s\w\d\^_×÷\+\-\=\(\)\\]+$/;
        if (mathPattern.test(processed.trim()) || processed.includes('^') || processed.includes('\\times')) {
            return `$${processed}$`;
        }
    }

    return processed;
};
