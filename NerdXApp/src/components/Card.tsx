// Professional Card Component - Theme Aware
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '../theme/useThemedStyles';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  gradientColors?: string[];
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * Professional Card Component
 * Provides consistent card styling with multiple variants
 * Now theme-aware - automatically adapts to light/dark mode
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  gradientColors,
  onPress,
  disabled = false,
  ...props
}) => {
  const colors = useThemedColors();

  // Use themed colors for card background and borders
  const cardStyle = [
    variant !== 'gradient' && {
      backgroundColor: colors.background.paper,
      borderRadius: 16,
      padding: 16,
    },
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && {
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    variant === 'gradient' && styles.gradientContainer,
    style,
  ];

  if (variant === 'gradient') {
    const finalGradientColors = gradientColors || colors.gradients.card;
    const GradientContent = (
      <LinearGradient
        colors={[finalGradientColors[0], finalGradientColors[1]] as [string, string]}
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
  gradientContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
});

export default Card;

