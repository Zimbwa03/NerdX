import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import api from './api/config';
import { getSupabaseAuthUserId } from './supabase';

class PushNotificationService {
  private registeredToken: string | null = null;

  private async ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync('engagement', {
      name: 'Engagement Notifications',
      description: 'Study reminders, achievements, and exam countdown alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2E7D32',
      sound: 'default',
    });
  }

  private resolveProjectId(): string | undefined {
    const projectIdFromConfig = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId;
    const constantsAny = Constants as any;
    const projectIdFromEas = constantsAny?.easConfig?.projectId as string | undefined;
    return projectIdFromConfig || projectIdFromEas;
  }

  public async registerForPushNotifications(): Promise<string | null> {
    try {
      await this.ensureAndroidChannel();

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      const projectId = this.resolveProjectId();
      const tokenResponse = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenResponse.data;

      if (!expoPushToken) {
        return null;
      }

      const supabaseUserId = await getSupabaseAuthUserId();
      const appVersion = Constants.expoConfig?.version || null;
      const deviceId = Constants.deviceName || Platform.OS;

      await api.post('/api/mobile/notifications/push-token', {
        expo_push_token: expoPushToken,
        platform: Platform.OS,
        device_id: deviceId,
        app_version: appVersion,
        supabase_user_id: supabaseUserId,
      });

      this.registeredToken = expoPushToken;
      return expoPushToken;
    } catch (error) {
      console.warn('[PushNotificationService] Registration failed:', error);
      return null;
    }
  }

  public async unregisterPushToken(): Promise<void> {
    try {
      if (!this.registeredToken) return;
      await api.delete('/api/mobile/notifications/push-token', {
        data: { expo_push_token: this.registeredToken },
      });
      this.registeredToken = null;
    } catch (error) {
      console.warn('[PushNotificationService] Unregister failed:', error);
    }
  }
}

export default new PushNotificationService();
