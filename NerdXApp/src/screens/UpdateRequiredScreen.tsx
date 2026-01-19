// Update Required Screen - Forces users to update the app
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { checkUpdateRequired, AppVersion } from '../services/appVersion';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const UpdateRequiredScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { versionInfo, installedVersion } = (route.params as any) || {};
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [isOpening, setIsOpening] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsOpening(true);
      const url = versionInfo?.update_url;
      if (!url) {
        // Fallback URLs
        const fallbackUrl = Platform.OS === 'ios'
          ? 'https://apps.apple.com/app/nerdx'
          : 'https://play.google.com/store/apps/details?id=com.Ngoni03.nerdxapp';
        await Linking.openURL(fallbackUrl);
        return;
      }
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback: try to open Play Store/App Store directly
        const storeUrl = Platform.OS === 'ios'
          ? `https://apps.apple.com/app/id${url.split('/').pop()}`
          : `https://play.google.com/store/apps/details?id=${url.split('=').pop()}`;
        await Linking.openURL(storeUrl);
      }
    } catch (error) {
      console.error('Error opening update URL:', error);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themedColors.background.default}
      />

      <LinearGradient
        colors={isDarkMode ? ['#1a1a2e', '#16213e', '#0f3460'] : ['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
      >
        <View style={styles.content}>
          {/* NerdX Logo */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Colors.primary.main, Colors.primary.dark]}
              style={styles.logoGradient}
            >
              <Ionicons name="shield-checkmark" size={64} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.logoText}>NerdX</Text>
          </View>

          {/* Update Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.updateIconGradient}
            >
              <Ionicons name="refresh" size={48} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: themedColors.text.primary }]}>
            Update Required
          </Text>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: themedColors.text.secondary }]}>
              {versionInfo?.update_message || 'A new version of NerdX is available. Please update to continue using the app.'}
            </Text>
          </View>

          {/* Version Info */}
          <View style={styles.versionInfo}>
            <Text style={[styles.versionText, { color: themedColors.text.secondary }]}>
              Current Version: {installedVersion || 'Unknown'}
            </Text>
            <Text style={[styles.versionText, { color: themedColors.text.secondary }]}>
              Latest Version: {versionInfo?.latest_version || 'Unknown'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleUpdate}
              style={styles.updateButton}
              activeOpacity={0.8}
              disabled={isOpening}
            >
              <LinearGradient
                colors={[Colors.primary.main, Colors.primary.dark]}
                style={styles.updateButtonGradient}
              >
                <Ionicons name="download" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.updateButtonText}>
                  {isOpening ? 'Opening Store...' : 'Update Now'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {versionInfo.soft_update && onLater && (
              <TouchableOpacity
                onPress={onLater}
                style={[styles.laterButton, { borderColor: themedColors.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.laterButtonText, { color: themedColors.text.secondary }]}>
                  Later
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Note */}
          <Text style={[styles.footerNote, { color: themedColors.text.tertiary }]}>
            Updating ensures you have the latest features and security improvements.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  iconContainer: {
    marginBottom: 24,
  },
  updateIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  versionInfo: {
    marginBottom: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    marginBottom: 8,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  updateButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  updateButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  laterButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default UpdateRequiredScreen;
