// Syntax-highlighted code display for Programming Lab

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { ProgrammingLanguage } from '../../../types/programmingLabTypes';
import { TokenType, type SyntaxToken } from '../../../types/programmingLabTypes';
import { tokenizeCode } from '../../../utils/programmingLab/syntaxTokenizer';

export interface SyntaxHighlighterProps {
    code: string;
    language: ProgrammingLanguage;
    theme: 'light' | 'dark';
    showLineNumbers?: boolean;
    errorLines?: Set<number>;
    fontSize?: number;
}

const getTokenColors = (theme: 'light' | 'dark') => {
    const isDark = theme === 'dark';
    return {
        [TokenType.Keyword]: isDark ? '#FF7B42' : '#AF00DB',
        [TokenType.String]: isDark ? '#7EC699' : '#0E639C',
        [TokenType.Number]: isDark ? '#6B9EFF' : '#098658',
        [TokenType.Comment]: isDark ? '#6A9955' : '#008000',
        [TokenType.Operator]: isDark ? '#FF7B42' : '#0000FF',
        [TokenType.Builtin]: isDark ? '#9B59B6' : '#795E26',
        [TokenType.Type]: isDark ? '#3498DB' : '#267F99',
        [TokenType.Function]: isDark ? '#E74C3C' : '#795E26',
        [TokenType.Identifier]: isDark ? '#D4D4D4' : '#001080',
        [TokenType.Whitespace]: 'transparent',
        [TokenType.Error]: isDark ? '#E74C3C' : '#E74C3C',
    };
};

function groupTokensByLine(tokens: SyntaxToken[]): SyntaxToken[][] {
    const lines: SyntaxToken[][] = [];
    let currentLine: SyntaxToken[] = [];
    let lastLine = 0;
    for (const t of tokens) {
        if (t.line > lastLine && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = [];
        }
        lastLine = t.line;
        currentLine.push(t);
    }
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }
    return lines;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
    code,
    language,
    theme,
    showLineNumbers = true,
    errorLines,
    fontSize = 14,
}) => {
    const tokenColors = useMemo(() => getTokenColors(theme), [theme]);
    const tokens = useMemo(() => tokenizeCode(code, language), [code, language]);
    const lines = useMemo(() => groupTokensByLine(tokens), [tokens]);
    const lineCount = lines.length || 1;

    const lineNumberWidth = String(lineCount).length * 10 + 16;

    return (
        <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
            {showLineNumbers && (
                <View style={[styles.lineNumbers, { width: lineNumberWidth }]}>
                    {Array.from({ length: lineCount }, (_, i) => i + 1).map((num) => (
                        <Text
                            key={num}
                            style={[
                                styles.lineNumber,
                                { fontSize },
                                theme === 'dark' ? styles.lineNumberDark : styles.lineNumberLight,
                                errorLines?.has(num) && styles.lineNumberError,
                            ]}
                        >
                            {num}
                        </Text>
                    ))}
                </View>
            )}
            <ScrollView
                style={styles.codeScroll}
                contentContainerStyle={styles.codeContent}
                showsVerticalScrollIndicator={true}
            >
                {lines.map((lineTokens, lineIndex) => (
                    <View
                        key={lineIndex}
                        style={[
                            styles.line,
                            errorLines?.has(lineIndex + 1) && (theme === 'dark' ? styles.lineErrorDark : styles.lineErrorLight),
                        ]}
                    >
                        {lineTokens.map((token, tokenIndex) => (
                            <Text
                                key={tokenIndex}
                                style={{
                                    color: tokenColors[token.type] ?? (theme === 'dark' ? '#D4D4D4' : '#24292F'),
                                    fontSize,
                                    fontFamily: 'monospace',
                                    fontWeight: token.type === TokenType.Keyword ? 'bold' : 'normal',
                                    textDecorationLine: token.type === TokenType.Error ? 'underline' : 'none',
                                    textDecorationColor: '#E74C3C',
                                }}
                            >
                                {token.value}
                            </Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        minHeight: 200,
    },
    containerDark: {
        backgroundColor: '#1E1E1E',
    },
    lineNumbers: {
        paddingVertical: 8,
        paddingRight: 12,
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.1)',
    },
    lineNumber: {
        height: 20,
        lineHeight: 20,
    },
    lineNumberLight: {
        color: '#6E7681',
    },
    lineNumberDark: {
        color: '#858585',
    },
    lineNumberError: {
        color: '#E74C3C',
    },
    codeScroll: {
        flex: 1,
    },
    codeContent: {
        padding: 8,
    },
    line: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 20,
        lineHeight: 20,
    },
    lineErrorLight: {
        backgroundColor: 'rgba(255, 0, 0, 0.08)',
    },
    lineErrorDark: {
        backgroundColor: 'rgba(255, 0, 0, 0.15)',
    },
});

export default SyntaxHighlighter;
