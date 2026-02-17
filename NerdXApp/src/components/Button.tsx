// Professional Button Component
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from './Icons';

// Inline colors to avoid module loading issues
const COLORS = {
  primary: { main: '#1976D2', dark: '#1565C0' },
  secondary: { main: '#9C27B0', dark: '#7B1FA2' },
  text: { white: '#FFFFFF' },
};

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  gradient?: boolean;
  titleNumberOfLines?: number;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  gradient = false,
  titleNumberOfLines = 2,
  style,
  ...rest
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
    };

    // Size styles
    if (size === 'small') {
      baseStyle.paddingVertical = 8;
      baseStyle.paddingHorizontal = 16;
    } else if (size === 'large') {
      baseStyle.paddingVertical = 16;
      baseStyle.paddingHorizontal = 24;
    } else {
      baseStyle.paddingVertical = 12;
      baseStyle.paddingHorizontal = 20;
    }

    // Variant styles
    if (variant === 'primary') {
      baseStyle.backgroundColor = COLORS.primary.main;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = COLORS.secondary.main;
    } else if (variant === 'outline') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = COLORS.primary.main;
    } else if (variant === 'ghost') {
      baseStyle.backgroundColor = 'transparent';
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      flexShrink: 1,
    };

    // Size text styles
    if (size === 'small') {
      baseStyle.fontSize = 14;
    } else if (size === 'large') {
      baseStyle.fontSize = 18;
    } else {
      baseStyle.fontSize = 16;
    }

    // Variant text colors
    if (variant === 'primary' || variant === 'secondary') {
      baseStyle.color = COLORS.text.white;
    } else if (variant === 'outline' || variant === 'ghost') {
      baseStyle.color = COLORS.primary.main;
    }

    return baseStyle;
  };

  const getIconColor = (): string => {
    if (variant === 'primary' || variant === 'secondary') {
      return COLORS.text.white;
    }
    return COLORS.primary.main;
  };

  const buttonContent = (
    <View style={[getButtonStyle(), style]}>
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              <Icon name={icon} size={20} color={getIconColor()} library="ionicons" />
            </View>
          )}
          <View style={styles.textWrap}>
            <Text
              style={getTextStyle()}
              numberOfLines={titleNumberOfLines}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.15}
            >
              {title}
            </Text>
          </View>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>
              <Icon name={icon} size={20} color={getIconColor()} library="ionicons" />
            </View>
          )}
        </>
      )}
    </View>
  );

  if (gradient && (variant === 'primary' || variant === 'secondary')) {
    const gradientColors: [string, string] =
      variant === 'primary'
        ? [COLORS.primary.main, COLORS.primary.dark]
        : [COLORS.secondary.main, COLORS.secondary.dark];

    return (
      <TouchableOpacity
        disabled={disabled || loading}
        style={fullWidth ? styles.fullWidthTouchable : undefined}
        {...rest}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[getButtonStyle(), style]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.text.white} size="small" />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <View style={styles.iconLeft}>
                  <Icon name={icon} size={20} color={COLORS.text.white} library="ionicons" />
                </View>
              )}
              <View style={styles.textWrap}>
                <Text
                  style={getTextStyle()}
                  numberOfLines={titleNumberOfLines}
                  ellipsizeMode="tail"
                  maxFontSizeMultiplier={1.15}
                >
                  {title}
                </Text>
              </View>
              {icon && iconPosition === 'right' && (
                <View style={styles.iconRight}>
                  <Icon name={icon} size={20} color={COLORS.text.white} library="ionicons" />
                </View>
              )}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={fullWidth ? styles.fullWidthTouchable : undefined}
      {...rest}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  textWrap: {
    flexShrink: 1,
    minWidth: 0,
  },
  fullWidthTouchable: {
    alignSelf: 'stretch',
  },
});

export default Button;
