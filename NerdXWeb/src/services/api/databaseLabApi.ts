import api from './config';

export interface DatabaseLabExecuteResult {
  columns?: string[];
  rows?: unknown[][];
  message?: string;
  rowsAffected?: number;
  error?: string;
}

export const databaseLabApi = {
  executeSql: async (sql: string): Promise<DatabaseLabExecuteResult> => {
    const response = await api.post<{ success?: boolean; data?: DatabaseLabExecuteResult; message?: string }>(
      '/api/mobile/virtual-database-lab/execute',
      { sql },
      { timeout: 15000 }
    );
    const data = response.data?.data;
    if (data !== undefined && data !== null) return data;
    return { error: response.data?.message || 'Data not loading. Please try again.' };
  },
};

