// App update/version check API (shared across platforms)
import api from './config';

export type AppUpdateInfo = {
  platform: string;
  current_version?: string | null;
  min_supported_version?: string | null;
  latest_version?: string | null;
  update_required: boolean;
  soft_update: boolean;
  update_message?: string | null;
  update_url?: string | null;
};

export const appUpdateApi = {
  check: async (platform: string = 'web', version?: string): Promise<AppUpdateInfo | null> => {
    try {
      const res = await api.get('/api/mobile/app/version-check', {
        params: {
          platform,
          ...(version ? { version } : {}),
        },
      });
      return (res.data?.data ?? null) as AppUpdateInfo | null;
    } catch {
      return null;
    }
  },
};

