import { useQuery, useQueryClient } from '@tanstack/react-query';
import { creditsApi } from '../../services/api/creditsApi';
import { useAuth } from '../../context/AuthContext';

export const CREDITS_QUERY_KEY = ['credits', 'balance'] as const;
export const CREDIT_INFO_QUERY_KEY = ['credits', 'info'] as const;
export const CREDIT_PACKAGES_QUERY_KEY = ['credits', 'packages'] as const;
export const CREDIT_TRANSACTIONS_QUERY_KEY = (limit: number) => ['credits', 'transactions', limit] as const;

/**
 * Fetches the credit balance and keeps it fresh every 30 seconds.
 * Replaces the manual setInterval in AuthContext — only polls when
 * the window is focused, so 100k idle tabs don't hammer the backend.
 */
export function useCreditsBalanceQuery() {
  const { isAuthenticated, updateUser } = useAuth();

  return useQuery({
    queryKey: CREDITS_QUERY_KEY,
    queryFn: async () => {
      const balance = await creditsApi.getBalance();
      if (balance !== null) {
        // Keep AuthContext in sync so the rest of the app sees the updated value
        updateUser({ credits: balance });
      }
      return balance;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,       // 30 s — matches existing polling interval
    refetchInterval: 30 * 1000, // auto-refetch every 30 s
    refetchIntervalInBackground: false, // pause when tab is not visible
  });
}

/**
 * Fetches full credit breakdown (purchased, school, free).
 * Used on the Credits page and account pages.
 */
export function useCreditInfoQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CREDIT_INFO_QUERY_KEY,
    queryFn: () => creditsApi.getCreditInfo(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/**
 * Fetches available credit packages for purchase.
 */
export function useCreditPackagesQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CREDIT_PACKAGES_QUERY_KEY,
    queryFn: () => creditsApi.getPackages(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // packages rarely change
  });
}

/**
 * Fetches transaction history.
 */
export function useCreditTransactionsQuery(limit = 20) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CREDIT_TRANSACTIONS_QUERY_KEY(limit),
    queryFn: () => creditsApi.getTransactions(limit),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/**
 * Returns a function that invalidates all credit queries, forcing a fresh fetch.
 * Call this after a purchase or any action that changes credits.
 */
export function useInvalidateCredits() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['credits'] });
}
