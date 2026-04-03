import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { useEffect } from 'react';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;
export const UNREAD_COUNT_QUERY_KEY = ['notifications', 'unread-count'] as const;

// Minimal type — extend as the notifications API evolves
export interface Notification {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  type?: string;
}

async function fetchUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.warn('[useNotificationsQuery] fetchUnreadCount error:', error.message);
    return 0;
  }
  return count ?? 0;
}

/**
 * Fetches and caches the unread notification count.
 * Also subscribes to Supabase realtime so the badge updates instantly
 * when a new notification arrives, without polling.
 */
export function useUnreadCountQuery(supabaseUserId: string | null) {
  const { isSupabaseAuthReady } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...UNREAD_COUNT_QUERY_KEY, supabaseUserId],
    queryFn: () => fetchUnreadCount(supabaseUserId!),
    enabled: isSupabaseAuthReady && !!supabaseUserId,
    staleTime: 60 * 1000,
  });

  // Supabase realtime subscription — invalidate the query on any notification change
  useEffect(() => {
    if (!isSupabaseAuthReady || !supabaseUserId) return;

    const channel = supabase
      .channel(`notifications:${supabaseUserId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${supabaseUserId}` }, () => {
        void queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isSupabaseAuthReady, supabaseUserId, queryClient]);

  return query;
}
