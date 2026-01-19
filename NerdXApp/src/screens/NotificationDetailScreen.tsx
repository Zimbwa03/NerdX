// Notification Detail Screen - Shows full notification content
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { markAsRead, NotificationRecipient } from '../services/notifications';
import { Colors } from '../theme/colors';

const NotificationDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { recipient } = route.params as { recipient: NotificationRecipient };

  const notification = recipient.notification;

  useEffect(() => {
    // Mark as read when opened
    if (!recipient.read_at) {
      markAsRead(recipient.id);
    }
  }, [recipient.id, recipient.read_at]);

  const handleAction = async () => {
    if (notification?.metadata?.action_url) {
      const canOpen = await Linking.canOpenURL(notification.metadata.action_url);
      if (canOpen) {
        await Linking.openURL(notification.metadata.action_url);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  if (!notification) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <Text style={[styles.errorText, { color: themedColors.text.primary }]}>
          Notification not found
        </Text>
      </View>
    );
  }

  const iconName = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);

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
          Notification
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={iconName} size={48} color={iconColor} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: themedColors.text.primary }]}>
          {notification.title}
        </Text>

        {/* Timestamp */}
        <Text style={[styles.timestamp, { color: themedColors.text.tertiary }]}>
          {formatDate(recipient.created_at)}
        </Text>

        {/* Body */}
        <View style={[styles.bodyContainer, { backgroundColor: themedColors.background.secondary }]}>
          <Text style={[styles.body, { color: themedColors.text.secondary }]}>
            {notification.body}
          </Text>
        </View>

        {/* Action Button */}
        {notification.metadata?.action_url && (
          <TouchableOpacity
            onPress={handleAction}
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary.main, Colors.primary.dark]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="open-outline" size={20} color="#FFFFFF" style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>
                {notification.metadata.action_label || 'Open'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    marginBottom: 24,
  },
  bodyContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  actionButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default NotificationDetailScreen;
