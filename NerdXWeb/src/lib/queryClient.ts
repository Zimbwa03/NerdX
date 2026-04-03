import { QueryClient } from '@tanstack/react-query';

// Shared QueryClient instance — import this wherever you need queryClient.invalidateQueries etc.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes before it's considered stale
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests up to 2 times with exponential backoff
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't re-fetch when window regains focus (avoids API storm on tab switch)
      refetchOnWindowFocus: false,
      // Re-fetch on reconnect so stale data is refreshed after offline periods
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
