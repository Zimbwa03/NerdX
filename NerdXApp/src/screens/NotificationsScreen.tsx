// Notifications Screen - Displays all user notifications
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { useAuth } from '../context/AuthContext';
import {
  getNotifications,
  markAllAsRead,
  NotificationRecipient,
  subscribeToNotifications,
} from '../services/notifications';
import { getSupabaseAuthUserId } from '../services/supabase';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [notifications, setNotifications] = useState<NotificationRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadNotifications = useCallback(async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const data = await getNotifications(20, currentOffset);

      if (reset) {
        setNotifications(data);
      } else {
        setNotifications(prev => [...prev, ...data]);
      }

      setHasMore(data.length === 20);
      setOffset(currentOffset + data.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [offset]);

  useEffect(() => {
    loadNotifications(true);
  }, []);

  // Subscribe to realtime updates using Supabase Auth user ID
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      // Get Supabase Auth user ID for realtime subscription (required for RLS)
      const supabaseUserId = await getSupabaseAuthUserId();
      if (supabaseUserId) {
        console.log('[Notifications] Setting up realtime subscription for Supabase user:', supabaseUserId);
        unsubscribe = subscribeToNotifications(
          supabaseUserId,
          (newRecipient) => {
            // New notification received - prepend to list
            console.log('[Notifications] New notification received:', newRecipient.notification?.title);
            setNotifications(prev => [newRecipient, ...prev]);
          },
          (updatedRecipient) => {
            // Notification updated (e.g., marked as read)
            setNotifications(prev =>
              prev.map(n => n.id === updatedRecipient.id ? { ...n, ...updatedRecipient } : n)
            );
          }
        );
      } else {
        console.log('[Notifications] No Supabase Auth session - realtime updates disabled');
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications(true);
  }, [loadNotifications]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadNotifications(false);
    }
  }, [loadingMore, hasMore, loadNotifications]);

  const handleMarkAllRead = useCallback(async () => {
    const success = await markAllAsRead();
    if (success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
    }
  }, []);

  const handleNotificationPress = useCallback((recipient: NotificationRecipient) => {
    navigation.navigate('NotificationDetail' as never, { recipient } as never);
  }, [navigation]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'update':
        return 'refresh';
      case 'promo':
        return 'gift';
      default:
        return 'information-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return '#FF6B6B';
      case 'update':
        return '#4ECDC4';
      case 'promo':
        return '#FFD93D';
      default:
        return Colors.primary.main;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotificationItem = ({ item }: { item: NotificationRecipient }) => {
    const notification = item.notification;
    if (!notification) return null;

    const isUnread = !item.read_at;
    const iconName = getNotificationIcon(notification.type);
    const iconColor = getNotificationColor(notification.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          {
            backgroundColor: themedColors.background.secondary,
            borderLeftColor: iconColor,
          },
          isUnread && styles.unreadItem,
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            <Ionicons name={iconName} size={24} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text
                style={[
                  styles.title,
                  { color: themedColors.text.primary },
                  isUnread && styles.unreadTitle,
                ]}
                numberOfLines={1}
              >
                {notification.title}
              </Text>
              {isUnread && <View style={styles.unreadDot} />}
            </View>
            <Text
              style={[styles.body, { color: themedColors.text.secondary }]}
              numberOfLines={2}
            >
              {notification.body}
            </Text>
            <Text style={[styles.timestamp, { color: themedColors.text.tertiary }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="notifications-outline"
        size={64}
        color={themedColors.text.tertiary}
      />
      <Text style={[styles.emptyTitle, { color: themedColors.text.primary }]}>
        No notifications yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: themedColors.text.secondary }]}>
        We'll post updates here when available.
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary.main} />
      </View>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={themedColors.background.default}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themedColors.background.default}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: themedColors.background.secondary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={themedColors.text.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themedColors.text.primary }]}>
          Notifications
        </Text>
        <TouchableOpacity
          onPress={handleMarkAllRead}
          style={styles.markAllButton}
        >
          <Text style={[styles.markAllText, { color: Colors.primary.main }]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary.main}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadItem: {
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
  },
  notificationContent: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.main,
    marginLeft: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default NotificationsScreen;
