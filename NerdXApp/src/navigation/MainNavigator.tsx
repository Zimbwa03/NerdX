import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../theme/ThemeContext';
import {RootStackParamList} from '../types';

// Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import SubjectsScreen from '../screens/subjects/SubjectsScreen';
import TopicsScreen from '../screens/subjects/TopicsScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import CreditsScreen from '../screens/credits/CreditsScreen';
import PackagesScreen from '../screens/credits/PackagesScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import MathGraphScreen from '../screens/math/MathGraphScreen';
import EnglishComprehensionScreen from '../screens/english/EnglishComprehensionScreen';
import EnglishEssayScreen from '../screens/english/EnglishEssayScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Subjects"
        component={SubjectsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="menu-book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Credits"
        component={CreditsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account-balance-wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Topics" component={TopicsScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Packages" component={PackagesScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MathGraph" component={MathGraphScreen} />
      <Stack.Screen name="EnglishComprehension" component={EnglishComprehensionScreen} />
      <Stack.Screen name="EnglishEssay" component={EnglishEssayScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

