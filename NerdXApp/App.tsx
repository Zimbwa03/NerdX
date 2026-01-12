// Main App Component
import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { NerdXLiveButton } from './src/components/NerdXLiveButton';
import NotificationComponent from './src/components/NotificationComponent';
import { CreditNotification } from './src/components/CreditNotification';

// Inner component that uses theme and auth
const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#0A0E21" : "#FAFAFA"}
      />
      <AppNavigator />
      {/* NerdX Live floating button - only available when logged in */}
      {isAuthenticated && <NerdXLiveButton />}
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