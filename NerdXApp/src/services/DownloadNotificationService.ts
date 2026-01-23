// Download Notification Service - Handles local notifications for model downloads
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class DownloadNotificationService {
  private notificationPermissionGranted: boolean = false;

  /**
   * Request notification permissions
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      this.notificationPermissionGranted = finalStatus === 'granted';
      
      if (this.notificationPermissionGranted && Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('downloads', {
          name: 'Download Notifications',
          description: 'Notifications for model downloads',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4F46E5',
        });
      }

      return this.notificationPermissionGranted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Send notification when download completes
   */
  public async notifyDownloadComplete(): Promise<void> {
    try {
      if (!this.notificationPermissionGranted) {
        const granted = await this.requestPermissions();
        if (!granted) {
          console.log('Notification permission not granted, skipping notification');
          return;
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Model Download Complete!',
          body: 'Your offline AI model is ready to use. Open NerdX to start chatting offline!',
          data: { type: 'download_complete' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });

      console.log('✅ Download completion notification sent');
    } catch (error) {
      console.error('Error sending download notification:', error);
    }
  }

  /**
   * Send notification when download starts
   */
  public async notifyDownloadStarted(): Promise<void> {
    try {
      if (!this.notificationPermissionGranted) {
        await this.requestPermissions();
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📥 Model Download Started',
          body: 'Your model is downloading in the background. You can continue using the app!',
          data: { type: 'download_started' },
          sound: false,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending download start notification:', error);
    }
  }
}

export default new DownloadNotificationService();
