import { supabase, isSupabaseAuthSignedIn, getSupabaseAuthUserId } from './supabase';

export interface Notification {
  id: string;
  created_at: string;
  created_by: string | null;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'update' | 'promo';
  audience: string;
  metadata: Record<string, any>;
  status: string;
  read_at?: string | null;
  delivered_at?: string | null;
  dismissed_at?: string | null;
}

export interface NotificationRecipient {
  id: string;
  notification_id: string;
  user_id: string;
  delivered_at: string | null;
  read_at: string | null;
  dismissed_at: string | null;
  created_at: string;
  notification?: Notification;
}

/**
 * Get unread notification count for current user
 */
export async function getUnreadCount(): Promise<number> {
  try {
    // Check if Supabase Auth session is available
    const isSignedIn = await isSupabaseAuthSignedIn();
    if (!isSignedIn) {
      console.log('[Notifications] No Supabase Auth session - cannot fetch unread count');
      return 0;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('[Notifications] No user from Supabase Auth');
      return 0;
    }

    console.log('[Notifications] Fetching unread count for user:', user.id);

    const { count, error } = await supabase
      .from('notification_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) {
      console.error('[Notifications] Error fetching unread count:', error.message);
      return 0;
    }

    console.log('[Notifications] Unread count:', count);
    return count || 0;
  } catch (error) {
    console.error('[Notifications] Error in getUnreadCount:', error);
    return 0;
  }
}

/**
 * Get all notifications for current user with pagination
 */
export async function getNotifications(
  limit: number = 20,
  offset: number = 0
): Promise<NotificationRecipient[]> {
  try {
    // Check if Supabase Auth session is available
    const isSignedIn = await isSupabaseAuthSignedIn();
    if (!isSignedIn) {
      console.log('[Notifications] No Supabase Auth session - cannot fetch notifications');
      return [];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('[Notifications] No user from Supabase Auth');
      return [];
    }

    console.log('[Notifications] Fetching notifications for user:', user.id, 'limit:', limit, 'offset:', offset);

    const { data, error } = await supabase
      .from('notification_recipients')
      .select(`
        *,
        notification:notifications(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[Notifications] Error fetching notifications:', error.message);
      return [];
    }

    const notifications = (data || []).map((item: any) => ({
      ...item,
      notification: item.notification?.[0] || item.notification,
    }));

    console.log('[Notifications] Fetched', notifications.length, 'notifications');
    return notifications;
  } catch (error) {
    console.error('[Notifications] Error in getNotifications:', error);
    return [];
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(recipientId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('[Notifications] Cannot mark as read - no Supabase Auth user');
      return false;
    }

    console.log('[Notifications] Marking notification as read:', recipientId);

    const { error } = await supabase
      .from('notification_recipients')
      .update({ read_at: new Date().toISOString() })
      .eq('id', recipientId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[Notifications] Error marking notification as read:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Notifications] Error in markAsRead:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for current user
 */
export async function markAllAsRead(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('[Notifications] Cannot mark all as read - no Supabase Auth user');
      return false;
    }

    console.log('[Notifications] Marking all notifications as read for user:', user.id);

    const { error } = await supabase
      .from('notification_recipients')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) {
      console.error('[Notifications] Error marking all as read:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Notifications] Error in markAllAsRead:', error);
    return false;
  }
}

/**
 * Dismiss a notification
 */
export async function dismissNotification(recipientId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('[Notifications] Cannot dismiss - no Supabase Auth user');
      return false;
    }

    console.log('[Notifications] Dismissing notification:', recipientId);

    const { error } = await supabase
      .from('notification_recipients')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', recipientId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[Notifications] Error dismissing notification:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Notifications] Error in dismissNotification:', error);
    return false;
  }
}

/**
 * Fetch a single notification recipient with joined notification data
 */
export async function fetchNotificationRecipient(recipientId: string): Promise<NotificationRecipient | null> {
  try {
    const { data, error } = await supabase
      .from('notification_recipients')
      .select(`
        *,
        notification:notifications(*)
      `)
      .eq('id', recipientId)
      .single();

    if (error) {
      console.error('[Notifications] Error fetching notification recipient:', error.message);
      return null;
    }

    return {
      ...data,
      notification: data.notification?.[0] || data.notification,
    };
  } catch (error) {
    console.error('[Notifications] Error in fetchNotificationRecipient:', error);
    return null;
  }
}

/**
 * Subscribe to realtime notification updates
 * Fetches full notification data on INSERT for proper display
 */
export function subscribeToNotifications(
  userId: string,
  onInsert: (recipient: NotificationRecipient) => void,
  onUpdate: (recipient: NotificationRecipient) => void
) {
  console.log('[Notifications] Subscribing to realtime updates for user:', userId);

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notification_recipients',
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        console.log('[Notifications] Realtime INSERT received:', payload.new);
        // Fetch full notification data including joined notification
        const fullRecipient = await fetchNotificationRecipient(payload.new.id as string);
        if (fullRecipient) {
          onInsert(fullRecipient);
        } else {
          // Fallback to raw payload if fetch fails
          onInsert(payload.new as NotificationRecipient);
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'notification_recipients',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('[Notifications] Realtime UPDATE received:', payload.new);
        onUpdate(payload.new as NotificationRecipient);
      }
    )
    .subscribe((status) => {
      console.log('[Notifications] Realtime subscription status:', status);
    });

  return () => {
    console.log('[Notifications] Unsubscribing from realtime updates');
    supabase.removeChannel(channel);
  };
}
