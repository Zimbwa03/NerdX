// Main App Component
import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import NotificationComponent from './src/components/NotificationComponent';
import { CreditNotification } from './src/components/CreditNotification';
import ModelDownloadService from './src/services/ModelDownloadService';
import DownloadNotificationService from './src/services/DownloadNotificationService';
import PushNotificationService from './src/services/PushNotificationService';

// Inner component that uses theme and auth
const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  // Check for incomplete downloads and register push token on app start
  useEffect(() => {
    if (!isAuthenticated) {
      PushNotificationService.unregisterPushToken().catch(() => {});
      return;
    }

    const checkDownloads = async () => {
      try {
        // Request notification permissions and register backend push token
        await DownloadNotificationService.requestPermissions();
        await PushNotificationService.registerForPushNotifications();

        // Check if there's an incomplete download
        const hasIncompleteDownload = await ModelDownloadService.checkAndResumeDownload();

        if (hasIncompleteDownload) {
          console.log('Found incomplete download, checking status...');
          // The download service will handle resumption if needed
        }
      } catch (error) {
        console.error('Error checking downloads:', error);
      }
    };

    checkDownloads();
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#0A0E21" : "#FAFAFA"}
      />
      <AppNavigator />
      {/* Global notification component */}
      <NotificationComponent />
      {/* Credit System Notifications */}
      <CreditNotification />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
