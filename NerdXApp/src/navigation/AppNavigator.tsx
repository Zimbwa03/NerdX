// Main App Navigator
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { useAuth } from '../context/AuthContext';
import { checkUpdateRequired } from '../services/appVersion';

// Auth screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UpdateRequiredScreen from '../screens/UpdateRequiredScreen';

// Main tab navigator (authenticated experience)
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createStackNavigator();

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6366F1" />
    <Text style={styles.loadingText}>Loading NerdX...</Text>
  </View>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [updateRequired, setUpdateRequired] = React.useState<{
    required: boolean;
    isHardUpdate: boolean;
    versionInfo: any;
    installedVersion: string;
  } | null>(null);
  const [checkingUpdate, setCheckingUpdate] = React.useState(true);

  React.useEffect(() => {
    const checkUpdate = async () => {
      try {
        const updateInfo = await checkUpdateRequired();
        if (updateInfo.updateRequired) {
          setUpdateRequired(updateInfo);
        }
      } catch (error) {
        console.error('Error checking update:', error);
      } finally {
        setCheckingUpdate(false);
      }
    };

    if (isAuthenticated) {
      checkUpdate();
    } else {
      setCheckingUpdate(false);
    }
  }, [isAuthenticated]);

  if (isLoading || checkingUpdate) {
    return <LoadingScreen />;
  }

  // Hard update — show standalone screen, no tab bar
  if (updateRequired && updateRequired.isHardUpdate) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="UpdateRequired"
            component={UpdateRequiredScreen}
            initialParams={{
              versionInfo: updateRequired.versionInfo,
              installedVersion: updateRequired.installedVersion,
            }}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Deep linking — password reset and OAuth callbacks
  const linking = {
    prefixes: [
      'nerdx://',
      'https://nerdx.app',
      'com.Ngoni03.nerdxapp://',
      'nerdxapp://',
      'https://lzteiewcvxoazqfxfjgg.supabase.co',
    ],
    config: {
      screens: {
        ResetPassword: {
          path: 'reset-password',
          parse: {
            token_hash:    (v: string) => v,
            type:          (v: string) => v,
            access_token:  (v: string) => v,
            refresh_token: (v: string) => v,
            token:         (v: string) => v,
            hash:          (v: string) => v,
          },
        },
        Login: {
          path: 'auth/callback',
          parse: {
            access_token:  (v: string) => v,
            refresh_token: (v: string) => v,
            type:          (v: string) => v,
            token_hash:    (v: string) => v,
          },
        },
        ForgotPassword: 'forgot-password',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // ── Auth flow ─────────────────────────────────────────────────────
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerShown: true,
                title: 'Create Account',
                headerStyle: { backgroundColor: '#6366F1' },
                headerTintColor: '#FFFFFF',
              }}
            />
            <Stack.Screen
              name="EmailVerification"
              component={require('../screens/EmailVerificationScreen').default}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={require('../screens/ForgotPasswordScreen').default}
            />
            <Stack.Screen
              name="ResetPassword"
              component={require('../screens/ResetPasswordScreen').default}
            />
          </Stack.Group>
        ) : (
          // ── Authenticated app — all navigation lives inside MainTabNavigator
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E1A',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#8B9CC8',
  },
});

export default AppNavigator;
