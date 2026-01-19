import { supabase } from './supabase';

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notification_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getUnreadCount:', error);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

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
      console.error('Error fetching notifications:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      ...item,
      notification: item.notification?.[0] || item.notification,
    }));
  } catch (error) {
    console.error('Error in getNotifications:', error);
    return [];
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(recipientId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('notification_recipients')
      .update({ read_at: new Date().toISOString() })
      .eq('id', recipientId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markAsRead:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for current user
 */
export async function markAllAsRead(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('notification_recipients')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) {
      console.error('Error marking all as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    return false;
  }
}

/**
 * Dismiss a notification
 */
export async function dismissNotification(recipientId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('notification_recipients')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', recipientId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error dismissing notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in dismissNotification:', error);
    return false;
  }
}

/**
 * Subscribe to realtime notification updates
 */
export function subscribeToNotifications(
  userId: string,
  onInsert: (recipient: NotificationRecipient) => void,
  onUpdate: (recipient: NotificationRecipient) => void
) {
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
      (payload) => {
        onInsert(payload.new as NotificationRecipient);
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
        onUpdate(payload.new as NotificationRecipient);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
