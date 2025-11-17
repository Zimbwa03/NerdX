// Main App Navigator
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
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
import ProjectAssistantSetupScreen from '../screens/ProjectAssistantSetupScreen';
import ProjectAssistantScreen from '../screens/ProjectAssistantScreen';
import GraphPracticeScreen from '../screens/GraphPracticeScreen';
import EnglishComprehensionScreen from '../screens/EnglishComprehensionScreen';
import EnglishEssayScreen from '../screens/EnglishEssayScreen';

const Stack = createStackNavigator();

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#1976D2" />
    <Text style={styles.loadingText}>Loading NerdX...</Text>
  </View>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
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
            <Stack.Screen
              name="ProjectAssistantSetup"
              component={ProjectAssistantSetupScreen}
              options={{
                title: 'Project Assistant Setup',
              }}
            />
            <Stack.Screen
              name="ProjectAssistant"
              component={ProjectAssistantScreen}
              options={{
                title: 'Project Assistant',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="GraphPractice"
              component={GraphPracticeScreen}
              options={{
                title: 'Graph Practice',
              }}
            />
            <Stack.Screen
              name="EnglishComprehension"
              component={EnglishComprehensionScreen}
              options={{
                title: 'Comprehension',
              }}
            />
            <Stack.Screen
              name="EnglishEssay"
              component={EnglishEssayScreen}
              options={{
                title: 'Essay Writing',
              }}
            />
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
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
});

export default AppNavigator;
