// Main App Navigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import TopicsScreen from '../screens/TopicsScreen';
import QuizScreen from '../screens/QuizScreen';
import CreditsScreen from '../screens/CreditsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TeacherModeSetupScreen from '../screens/TeacherModeSetupScreen';
import TeacherModeScreen from '../screens/TeacherModeScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can return a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1976D2',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Create Account',
                headerStyle: { backgroundColor: '#1976D2' },
                headerTintColor: '#FFFFFF',
              }}
            />
          </Stack.Group>
        ) : (
          // Main App Stack
          <Stack.Group>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                title: 'NerdX Dashboard',
                headerLeft: null,
              }}
            />
            <Stack.Screen
              name="Subjects"
              component={SubjectsScreen}
              options={{
                title: 'Choose Subject',
              }}
            />
            <Stack.Screen
              name="Topics"
              component={TopicsScreen}
              options={{
                title: 'Choose Topic',
              }}
            />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{
                title: 'Quiz',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="Credits"
              component={CreditsScreen}
              options={{
                title: 'Buy Credits',
              }}
            />
            <Stack.Screen
              name="Progress"
              component={ProgressScreen}
              options={{
                title: 'Your Progress',
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: 'Profile',
              }}
            />
            <Stack.Screen
              name="TeacherModeSetup"
              component={TeacherModeSetupScreen}
              options={{
                title: 'Teacher Mode Setup',
              }}
            />
            <Stack.Screen
              name="TeacherMode"
              component={TeacherModeScreen}
              options={{
                title: 'Teacher Mode',
                headerBackTitle: 'Back',
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
