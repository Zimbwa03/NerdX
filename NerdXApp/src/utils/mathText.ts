export const isMathSubjectId = (subjectId?: string): boolean => {
    const subject = (subjectId || '').toLowerCase();
    return subject.includes('math') ||
        subject === 'mathematics' ||
        subject === 'pure_math' ||
        subject === 'a_level_pure_math';
};

export const shouldRenderMathText = (text?: string): boolean => {
    if (!text) return false;
    const hasMathTokens = /[\^_×÷=]/.test(text) ||
        /(\d+\s*[x×]\s*\d+)/.test(text) ||
        /\w+\^\w+/.test(text) ||
        /sqrt|\bpi\b/i.test(text);

    if (!hasMathTokens) return false;

    const words = text.match(/\b[a-zA-Z]{2,}\b/g) || [];
    const wordCount = words.length;
    const longWordCount = words.filter(word => word.length > 3).length;
    const mathSymbolCount = (text.match(/[\^_×÷=]/g) || []).length;
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;

    // Avoid rendering full sentences as LaTeX, which strips spacing and colors everything.
    if (wordCount >= 6) return false;
    if (longWordCount >= 4 && mathSymbolCount < 2) return false;
    if (letterCount > 20 && mathSymbolCount < 2) return false;

    return true;
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
