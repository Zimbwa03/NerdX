import api from './config';

export type ProgrammingLanguage = 'python' | 'vbnet' | 'java' | 'html';

export interface ProgrammingLabTestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface ProgrammingLabExecutionRequest {
  code: string;
  language: ProgrammingLanguage;
  input?: string[];
  timeoutSeconds?: number;
  testCases?: ProgrammingLabTestCase[];
}

export interface ProgrammingLabExecutionResponse {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
  output: {
    type: 'text' | 'html' | 'table';
    content: string;
    metadata?: {
      lineCount?: number;
      characterCount?: number;
    };
  };
  errors?: {
    compilationError?: string;
    runtimeError?: string;
    timeoutError?: boolean;
    memoryError?: boolean;
  };
  testResults?: {
    testCaseId: string;
    passed: boolean;
    actual: string;
    expected: string;
    executionTime: number;
    feedback?: string;
  }[];
}

export const programmingLabApi = {
  executeCode: async (
    payload: ProgrammingLabExecutionRequest
  ): Promise<ProgrammingLabExecutionResponse> => {
    const response = await api.post('/api/mobile/virtual-programming-lab/execute', payload, {
      timeout: (payload.timeoutSeconds || 5) * 1000 + 2000,
    });
    return response.data.data as ProgrammingLabExecutionResponse;
  },
};

