// Virtual Programming Lab - shared types for Code Editor (Part 2)

export type ProgrammingLanguage = 'python' | 'vbnet' | 'java';

export type UserLevel = 'o-level' | 'a-level';

export interface CodeFileMetadata {
    exerciseId?: string;
    exerciseName?: string;
}

export interface CodeFile {
    id: string;
    name: string;
    language: ProgrammingLanguage;
    content: string;
    lastModified: Date;
    metadata: CodeFileMetadata;
}

export interface CursorPosition {
    line: number;
    column: number;
}

export interface SelectionRange {
    start: { line: number; column: number };
    end: { line: number; column: number };
}

export interface SyntaxError {
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    rule: string;
    suggestions?: string[];
}

export interface OutputDisplay {
    type: 'text' | 'graphics' | 'table' | 'test_results';
    data?: unknown;
}

export interface ExecutionResult {
    success: boolean;
    stdout: string;
    stderr: string;
    executionTime: number;
    memoryUsed: number;
    testsPassed?: number;
    testsFailed?: number;
    output?: OutputDisplay;
}

export interface CodeSuggestion {
    text: string;
    description?: string;
    range?: SelectionRange;
}

export enum TokenType {
    Keyword = 'keyword',
    Identifier = 'identifier',
    String = 'string',
    Number = 'number',
    Comment = 'comment',
    Operator = 'operator',
    Whitespace = 'whitespace',
    Error = 'error',
    Function = 'function',
    Type = 'type',
    Builtin = 'builtin',
}

export interface SyntaxToken {
    type: TokenType;
    value: string;
    line: number;
    startColumn: number;
    endColumn: number;
}

export interface EditorState {
    code: string;
    files: CodeFile[];
    activeFileId: string;
    unsavedChanges: boolean;
    selectedText?: SelectionRange;
    cursorPosition: CursorPosition;
    isExecuting: boolean;
    executionResult: ExecutionResult | null;
    syntaxErrors: SyntaxError[];
    aiSuggestions: CodeSuggestion[];
    breakpoints: Set<number>;
    theme: 'light' | 'dark';
}
