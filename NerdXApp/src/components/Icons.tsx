// Professional Icon Component System
import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle | TextStyle;
  library?: 'ionicons' | 'material' | 'materialCommunity' | 'fontAwesome5';
}

/**
 * Professional Icon Component
 * Provides consistent icon rendering across the app
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#212121',
  style,
  library = 'ionicons',
}) => {
  const iconProps = {
    name: name as any,
    size,
    color,
    style,
  };

  switch (library) {
    case 'material':
      return <MaterialIcons {...iconProps} />;
    case 'materialCommunity':
      return <MaterialCommunityIcons {...iconProps} />;
    case 'fontAwesome5':
      return <FontAwesome5 {...iconProps} />;
    default:
      return <Ionicons {...iconProps} />;
  }
};

/**
 * Predefined icon mappings for common use cases
 * Returns React elements for easy use in JSX
 */
export const Icons = {
  // Navigation & Actions
  home: (size = 24, color = '#1976D2') => (
    <Icon key="home" name="home" size={size} color={color} library="ionicons" />
  ),
  quiz: (size = 24, color = '#1976D2') => (
    <Icon key="quiz" name="book" size={size} color={color} library="ionicons" />
  ),
  credits: (size = 24, color = '#4CAF50') => (
    <Icon key="credits" name="diamond" size={size} color={color} library="materialCommunity" />
  ),
  progress: (size = 24, color = '#FF9800') => (
    <Icon key="progress" name="trending-up" size={size} color={color} library="ionicons" />
  ),
  profile: (size = 24, color = '#9C27B0') => (
    <Icon key="profile" name="person" size={size} color={color} library="ionicons" />
  ),
  logout: (size = 24, color = '#D32F2F') => (
    <Icon key="logout" name="log-out" size={size} color={color} library="ionicons" />
  ),

  // Subjects
  mathematics: (size = 32, color = '#2196F3') => (
    <Icon key="mathematics" name="calculator" size={size} color={color} library="ionicons" />
  ),
  science: (size = 32, color = '#4CAF50') => (
    <Icon key="science" name="flask" size={size} color={color} library="ionicons" />
  ),
  english: (size = 32, color = '#FF9800') => (
    <Icon key="english" name="book-open" size={size} color={color} library="ionicons" />
  ),

  // Features
  teacherMode: (size = 24, color = '#9C27B0') => (
    <Icon key="teacherMode" name="school" size={size} color={color} library="ionicons" />
  ),
  projectAssistant: (size = 24, color = '#9C27B0') => (
    <Icon key="projectAssistant" name="briefcase" size={size} color={color} library="ionicons" />
  ),
  graph: (size = 24, color = '#2196F3') => (
    <Icon key="graph" name="analytics" size={size} color={color} library="ionicons" />
  ),
  comprehension: (size = 24, color = '#FF9800') => (
    <Icon key="comprehension" name="document-text" size={size} color={color} library="ionicons" />
  ),
  essay: (size = 24, color = '#FF9800') => (
    <Icon key="essay" name="create" size={size} color={color} library="ionicons" />
  ),
  grammar: (size = 24, color = '#FF9800') => (
    <Icon key="grammar" name="text" size={size} color={color} library="ionicons" />
  ),
  vocabulary: (size = 24, color = '#FF9800') => (
    <Icon key="vocabulary" name="library" size={size} color={color} library="ionicons" />
  ),

  // Status & Actions
  check: (size = 24, color = '#4CAF50') => (
    <Icon key="check" name="checkmark-circle" size={size} color={color} library="ionicons" />
  ),
  close: (size = 24, color = '#D32F2F') => (
    <Icon key="close" name="close-circle" size={size} color={color} library="ionicons" />
  ),
  arrowRight: (size = 20, color = '#757575') => (
    <Icon key="arrowRight" name="chevron-forward" size={size} color={color} library="ionicons" />
  ),
  arrowBack: (size = 24, color = '#212121') => (
    <Icon key="arrowBack" name="arrow-back" size={size} color={color} library="ionicons" />
  ),
  refresh: (size = 24, color = '#1976D2') => (
    <Icon key="refresh" name="refresh" size={size} color={color} library="ionicons" />
  ),
  settings: (size = 24, color = '#757575') => (
    <Icon key="settings" name="settings" size={size} color={color} library="ionicons" />
  ),
  info: (size = 24, color = '#2196F3') => (
    <Icon key="info" name="information-circle" size={size} color={color} library="ionicons" />
  ),
  warning: (size = 24, color = '#FF9800') => (
    <Icon key="warning" name="warning" size={size} color={color} library="ionicons" />
  ),
  success: (size = 24, color = '#4CAF50') => (
    <Icon key="success" name="checkmark-circle" size={size} color={color} library="ionicons" />
  ),
  error: (size = 24, color = '#D32F2F') => (
    <Icon key="error" name="close-circle" size={size} color={color} library="ionicons" />
  ),

  // Payment & Credits
  payment: (size = 24, color = '#4CAF50') => (
    <Icon key="payment" name="card" size={size} color={color} library="ionicons" />
  ),
  wallet: (size = 24, color = '#FF9800') => (
    <Icon key="wallet" name="wallet" size={size} color={color} library="ionicons" />
  ),

  // Chat & Communication
  send: (size = 24, color = '#1976D2') => (
    <Icon key="send" name="send" size={size} color={color} library="ionicons" />
  ),
  chat: (size = 24, color = '#9C27B0') => (
    <Icon key="chat" name="chatbubbles" size={size} color={color} library="ionicons" />
  ),
};

/**
 * Icon Container with background circle
 */
export const IconCircle: React.FC<{
  icon: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}> = ({ icon, size = 48, backgroundColor = '#F5F5F5', style }) => {
  return (
    <View
      style={[
        styles.iconCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Icon;

