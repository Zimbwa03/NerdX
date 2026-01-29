import api from './config';

export interface DatabaseLabExecuteResult {
  columns?: string[];
  rows?: any[][];
  message?: string;
  rowsAffected?: number;
  error?: string;
}

export const databaseLabApi = {
  executeSql: async (sql: string): Promise<DatabaseLabExecuteResult> => {
    const response = await api.post<{ success: boolean; data: DatabaseLabExecuteResult }>(
      '/api/mobile/virtual-database-lab/execute',
      { sql },
      { timeout: 15000 }
    );
    return response.data.data;
  },
};
