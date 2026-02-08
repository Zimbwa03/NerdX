import { supabase, isSupabaseAuthSignedIn } from './supabase';

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

export async function getUnreadCount(): Promise<number> {
  try {
    const signedIn = await isSupabaseAuthSignedIn();
    if (!signedIn) return 0;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notification_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null);

    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

export async function getNotifications(limit: number = 20, offset: number = 0): Promise<NotificationRecipient[]> {
  try {
    const signedIn = await isSupabaseAuthSignedIn();
    if (!signedIn) return [];

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from('notification_recipients')
      .select(
        `
        *,
        notification:notifications(*)
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return [];

    const notifications = (data || []).map((item: any) => ({
      ...item,
      notification: item.notification?.[0] || item.notification,
    }));

    return notifications;
  } catch {
    return [];
  }
}

export async function markAsRead(recipientId: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return false;

    const { error } = await supabase
      .from('notification_recipients')
      .update({ read_at: new Date().toISOString() })
      .eq('id', recipientId)
      .eq('user_id', user.id);

    return !error;
  } catch {
    return false;
  }
}

export async function markAllAsRead(): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return false;

    const { error } = await supabase
      .from('notification_recipients')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);

    return !error;
  } catch {
    return false;
  }
}

export async function dismissNotification(recipientId: string): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return false;

    const { error } = await supabase
      .from('notification_recipients')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', recipientId)
      .eq('user_id', user.id);

    return !error;
  } catch {
    return false;
  }
}

export async function fetchNotificationRecipient(recipientId: string): Promise<NotificationRecipient | null> {
  try {
    const { data, error } = await supabase
      .from('notification_recipients')
      .select(
        `
        *,
        notification:notifications(*)
      `
      )
      .eq('id', recipientId)
      .single();

    if (error || !data) return null;

    return {
      ...(data as any),
      notification: (data as any).notification?.[0] || (data as any).notification,
    };
  } catch {
    return null;
  }
}

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
      async (payload: any) => {
        const fullRecipient = await fetchNotificationRecipient(payload.new?.id as string);
        onInsert(fullRecipient ?? (payload.new as NotificationRecipient));
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
      (payload: any) => {
        onUpdate(payload.new as NotificationRecipient);
      }
    )
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch {
      /* ignore */
    }
  };
}

