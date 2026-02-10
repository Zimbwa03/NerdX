// Virtual Programming Lab - shared types for Code Editor

export type ProgrammingLanguage = 'python' | 'vbnet' | 'java' | 'html';

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
  type: 'text' | 'graphics' | 'table' | 'test_results' | 'html';
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

