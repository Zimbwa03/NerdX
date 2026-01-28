// Syntax tokenizer for Python, VB.NET, Java - state machine

import type { ProgrammingLanguage } from '../../types/programmingLabTypes';
import { TokenType, type SyntaxToken } from '../../types/programmingLabTypes';
import { LanguageDefinitions } from '../../data/virtualLab/programmingLab/languageDefinitions';

export function tokenizeCode(code: string, language: ProgrammingLanguage): SyntaxToken[] {
    const tokens: SyntaxToken[] = [];
    const langDef = LanguageDefinitions[language];
    // Sort operators by length descending so we match longest first (e.g. ** before *)
    const operators = [...langDef.operators].sort((a, b) => b.length - a.length);
    let line = 1;
    let column = 1;
    let i = 0;

    while (i < code.length) {
        // Python: # comment
        if (language === 'python' && code[i] === '#') {
            const endOfLine = code.indexOf('\n', i);
            const commentText = code.substring(i, endOfLine === -1 ? code.length : endOfLine);
            tokens.push({
                type: TokenType.Comment,
                value: commentText,
                line,
                startColumn: column,
                endColumn: column + commentText.length,
            });
            i += commentText.length;
            column += commentText.length;
            continue;
        }

        // VB.NET: ' comment
        if (language === 'vbnet' && code[i] === "'") {
            const endOfLine = code.indexOf('\n', i);
            const commentText = code.substring(i, endOfLine === -1 ? code.length : endOfLine);
            tokens.push({
                type: TokenType.Comment,
                value: commentText,
                line,
                startColumn: column,
                endColumn: column + commentText.length,
            });
            i += commentText.length;
            column += commentText.length;
            continue;
        }

        // Java: // comment
        if (language === 'java' && code.substring(i).startsWith('//')) {
            const endOfLine = code.indexOf('\n', i);
            const commentText = code.substring(i, endOfLine === -1 ? code.length : endOfLine);
            tokens.push({
                type: TokenType.Comment,
                value: commentText,
                line,
                startColumn: column,
                endColumn: column + commentText.length,
            });
            i += commentText.length;
            column += commentText.length;
            continue;
        }

        // Java: /* ... */ block comment (simplified: consume until */)
        if (language === 'java' && code.substring(i).startsWith('/*')) {
            const endBlock = code.indexOf('*/', i);
            const commentText = endBlock === -1
                ? code.substring(i)
                : code.substring(i, endBlock + 2);
            tokens.push({
                type: TokenType.Comment,
                value: commentText,
                line,
                startColumn: column,
                endColumn: column + commentText.length,
            });
            i += commentText.length;
            column += commentText.length;
            continue;
        }

        // Strings: " or '
        if (code[i] === '"' || code[i] === "'") {
            const quote = code[i];
            let stringContent = quote;
            i++;
            let escaped = false;
            while (i < code.length && (code[i] !== quote || escaped)) {
                if (code[i] === '\\' && !escaped) {
                    escaped = true;
                } else {
                    escaped = false;
                }
                stringContent += code[i];
                i++;
            }
            if (i < code.length) {
                stringContent += code[i];
                i++;
            }
            tokens.push({
                type: TokenType.String,
                value: stringContent,
                line,
                startColumn: column,
                endColumn: column + stringContent.length,
            });
            column += stringContent.length;
            continue;
        }

        // Numbers
        if (/\d/.test(code[i]) || (code[i] === '.' && i + 1 < code.length && /\d/.test(code[i + 1]))) {
            let numStr = '';
            while (i < code.length && /[\d.]/.test(code[i])) {
                numStr += code[i];
                i++;
            }
            tokens.push({
                type: TokenType.Number,
                value: numStr,
                line,
                startColumn: column,
                endColumn: column + numStr.length,
            });
            column += numStr.length;
            continue;
        }

        // Identifiers and keywords
        if (/[a-zA-Z_]/.test(code[i])) {
            let identifier = '';
            while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
                identifier += code[i];
                i++;
            }
            let type: TokenType = TokenType.Identifier;
            if (langDef.keywords.includes(identifier)) {
                type = TokenType.Keyword;
            } else if (langDef.builtins?.includes(identifier)) {
                type = TokenType.Builtin;
            } else if (langDef.types.includes(identifier)) {
                type = TokenType.Type;
            }
            tokens.push({
                type,
                value: identifier,
                line,
                startColumn: column,
                endColumn: column + identifier.length,
            });
            column += identifier.length;
            continue;
        }

        // Operators
        const operatorMatch = operators.find(op => code.substring(i).startsWith(op));
        if (operatorMatch) {
            tokens.push({
                type: TokenType.Operator,
                value: operatorMatch,
                line,
                startColumn: column,
                endColumn: column + operatorMatch.length,
            });
            i += operatorMatch.length;
            column += operatorMatch.length;
            continue;
        }

        // Newlines
        if (code[i] === '\n') {
            line++;
            column = 1;
            i++;
            continue;
        }

        // Whitespace (non-newline)
        if (/\s/.test(code[i])) {
            let whitespace = '';
            while (i < code.length && /\s/.test(code[i]) && code[i] !== '\n') {
                whitespace += code[i];
                i++;
            }
            tokens.push({
                type: TokenType.Whitespace,
                value: whitespace,
                line,
                startColumn: column,
                endColumn: column + whitespace.length,
            });
            column += whitespace.length;
            continue;
        }

        // Single character fallback
        tokens.push({
            type: TokenType.Identifier,
            value: code[i],
            line,
            startColumn: column,
            endColumn: column + 1,
        });
        i++;
        column++;
    }

    return tokens;
}

export { TokenType, type SyntaxToken };
