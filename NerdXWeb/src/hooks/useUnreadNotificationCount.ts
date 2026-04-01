import { useEffect, useState } from 'react';
import { getUnreadCount, subscribeToNotifications } from '../services/notifications';
import { getSupabaseAuthUserId } from '../services/supabase';

/** Shared unread count for AppLayout chrome and dashboard Topbar. */
export function useUnreadNotificationCount(isSupabaseAuthReady: boolean) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const refreshUnread = async () => {
      const count = await getUnreadCount();
      if (!active) return;
      setUnreadCount(count);
    };

    if (!isSupabaseAuthReady) {
      setUnreadCount(0);
      return () => {
        active = false;
      };
    }

    void refreshUnread();

    (async () => {
      const supabaseUserId = await getSupabaseAuthUserId();
      if (!active || !supabaseUserId) return;
      unsubscribe = subscribeToNotifications(
        supabaseUserId,
        () => void refreshUnread(),
        () => void refreshUnread(),
      );
    })();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isSupabaseAuthReady]);

  return unreadCount;
}
