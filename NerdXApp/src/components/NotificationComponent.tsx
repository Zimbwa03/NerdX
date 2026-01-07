// Notification Component for displaying toast-style notifications
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';
import { Icons, Icon } from './Icons';

const { width } = Dimensions.get('window');

const NotificationComponent: React.FC = () => {
  const { currentNotification, hideNotification } = useNotification();
  const { isDarkMode } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(-200)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentNotification) {
      // Slide in animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -200,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentNotification, slideAnim, opacityAnim]);

  if (!currentNotification) {
    return null;
  }

  const getNotificationColors = () => {
    switch (currentNotification.type) {
      case 'success':
        return {
          gradient: isDarkMode ? ['#00E676', '#00B248'] : ['#4CAF50', '#388E3C'],
          icon: Icons.checkCircle(24, '#FFFFFF'),
          bg: 'rgba(0, 230, 118, 0.15)',
        };
      case 'error':
        return {
          gradient: isDarkMode ? ['#FF1744', '#C4001D'] : ['#F44336', '#D32F2F'],
          icon: Icons.alertCircle(24, '#FFFFFF'),
          bg: 'rgba(255, 23, 68, 0.15)',
        };
      case 'warning':
        return {
          gradient: isDarkMode ? ['#FFC400', '#C79400'] : ['#FF9800', '#F57C00'],
          icon: Icons.alertTriangle(24, '#FFFFFF'),
          bg: 'rgba(255, 196, 0, 0.15)',
        };
      case 'info':
      default:
        return {
          gradient: isDarkMode ? ['#2979FF', '#004ECB'] : ['#2196F3', '#1976D2'],
          icon: Icons.info(24, '#FFFFFF'),
          bg: 'rgba(41, 121, 255, 0.15)',
        };
    }
  };

  const colors = getNotificationColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideNotification}
        style={styles.touchable}
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.notification}
        >
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
              {colors.icon}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.message} numberOfLines={3}>
                {currentNotification.message}
              </Text>
            </View>
              <TouchableOpacity
                onPress={hideNotification}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={20} color="#FFFFFF" library="ionicons" />
              </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 10,
  },
  touchable: {
    width: '100%',
  },
  notification: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default NotificationComponent;

