import { useQuery } from '@tanstack/react-query';
import { userStatsApi } from '../../services/api/userStatsApi';
import { useAuth } from '../../context/AuthContext';

export const USER_STATS_QUERY_KEY = ['user', 'stats'] as const;

/**
 * Fetches user stats (XP, streak, accuracy, questions answered).
 * Cached for 2 minutes — dashboard and progress pages share this data
 * without triggering duplicate network requests.
 */
export function useUserStatsQuery() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: [...USER_STATS_QUERY_KEY, user?.id],
    queryFn: () => userStatsApi.getStats(),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 2 * 60 * 1000,
  });
}
