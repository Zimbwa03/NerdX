// Professional Card Component
import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  gradientColors?: string[];
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * Professional Card Component
 * Provides consistent card styling with multiple variants
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  gradientColors = ['#FFFFFF', '#F5F5F5'],
  onPress,
  disabled = false,
  ...props
}) => {
  const cardStyle = [
    variant !== 'gradient' && styles.card, // Don't apply default background for gradient
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'gradient' && { 
      borderRadius: 16, 
      overflow: 'hidden',
      backgroundColor: 'transparent', // Ensure no white background shows through
    }, // Ensure gradient fills card
    style,
  ];

  if (variant === 'gradient') {
    const GradientContent = (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
          style={cardStyle}
          {...props}
        >
          {GradientContent}
        </TouchableOpacity>
      );
    }

    return (
      <View style={cardStyle} {...props}>
        {GradientContent}
      </View>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={cardStyle}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
});

export default Card;

