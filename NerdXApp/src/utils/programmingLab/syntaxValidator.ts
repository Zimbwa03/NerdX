// Real-time syntax validation for Python, VB.NET, Java

import type { ProgrammingLanguage } from '../../types/programmingLabTypes';
import type { SyntaxError } from '../../types/programmingLabTypes';

export function syntaxValidator(
    code: string,
    language: ProgrammingLanguage,
): SyntaxError[] {
    const lines = code.split('\n');
    if (language === 'python') {
        return validatePython(lines);
    }
    if (language === 'vbnet') {
        return validateVBNet(lines);
    }
    if (language === 'java') {
        return validateJava(lines);
    }
    return [];
}

function validatePython(lines: string[]): SyntaxError[] {
    const errors: SyntaxError[] = [];

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('#')) return;

        // Missing colon after keywords
        if (
            /^(if|elif|else|for|while|def|class|try|except|finally|with)$/.test(trimmedLine) ||
            (/^(if|elif|else|for|while|def|class|try|except|finally|with)\s/.test(trimmedLine) && !trimmedLine.endsWith(':'))
        ) {
            if (!trimmedLine.endsWith(':')) {
                errors.push({
                    line: lineNum,
                    column: line.length,
                    message: 'Expected colon (:) at end of statement',
                    severity: 'error',
                    rule: 'missing-colon',
                    suggestions: [line.trimEnd() + ':'],
                });
            }
        }

        // Mismatched parentheses (simple per-line check)
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            errors.push({
                line: lineNum,
                column: line.length,
                message: 'Mismatched parentheses',
                severity: 'error',
                rule: 'mismatched-parens',
            });
        }

        // PEP 8: variable names should start with lowercase
        const assignmentMatch = trimmedLine.match(/^\s*([A-Z][a-zA-Z0-9_]*)\s*=/);
        if (assignmentMatch) {
            const varName = assignmentMatch[1];
            if (!/^[A-Z][A-Z0-9_]+$/.test(varName)) {
                errors.push({
                    line: lineNum,
                    column: line.indexOf(varName),
                    message: 'Variable names should start with lowercase (PEP 8)',
                    severity: 'warning',
                    rule: 'naming-convention',
                    suggestions: [varName.charAt(0).toLowerCase() + varName.slice(1)],
                });
            }
        }
    });

    return errors;
}

function validateVBNet(lines: string[]): SyntaxError[] {
    const errors: SyntaxError[] = [];

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmedLine = line.trim();

        if (!trimmedLine) return;

        // If without Then
        if (trimmedLine.startsWith('If ') && !trimmedLine.includes(' Then') && !trimmedLine.startsWith("'")) {
            errors.push({
                line: lineNum,
                column: line.indexOf('If') + 2,
                message: 'If statement requires Then',
                severity: 'error',
                rule: 'missing-then',
                suggestions: [trimmedLine + ' Then'],
            });
        }
    });

    return errors;
}

function validateJava(lines: string[]): SyntaxError[] {
    const errors: SyntaxError[] = [];

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) return;

        // Statement should end with semicolon (simple heuristic)
        if (
            trimmedLine &&
            !trimmedLine.endsWith(';') &&
            !trimmedLine.endsWith('{') &&
            !trimmedLine.endsWith('}') &&
            !trimmedLine.endsWith(')')
        ) {
            if (/^\s*(int|String|double|boolean|char|float|long|short|byte)\s+\w+\s*=/.test(trimmedLine) ||
                /^\s*return\s+/.test(trimmedLine) ||
                (/^\s*\w+\s*=/.test(trimmedLine) && !trimmedLine.includes(' if ') && !trimmedLine.includes(' for '))) {
                errors.push({
                    line: lineNum,
                    column: line.length,
                    message: 'Statement should end with semicolon (;)',
                    severity: 'error',
                    rule: 'missing-semicolon',
                    suggestions: [trimmedLine + ';'],
                });
            }
        }
    });

    return errors;
}
