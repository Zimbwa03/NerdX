// Update Required Screen - Forces users to update/reinstall the app
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Linking,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { AppVersion } from '../services/appVersion';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

// Default Play Store URL for NerdX
const DEFAULT_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.Ngoni03.nerdxapp';
const DEFAULT_APP_STORE_URL = 'https://apps.apple.com/app/nerdx';

interface UpdateRequiredScreenParams {
  versionInfo?: AppVersion;
  installedVersion?: string;
  onLater?: () => void;
}

const UpdateRequiredScreen: React.FC = () => {
  const route = useRoute();
  const { versionInfo, installedVersion, onLater } = (route.params as UpdateRequiredScreenParams) || {};
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [isOpening, setIsOpening] = useState(false);

  // Determine if this is a "reinstall required" scenario (website APK → Play Store)
  const isReinstallRequired = versionInfo?.update_message?.toLowerCase().includes('uninstall') || 
                               versionInfo?.update_message?.toLowerCase().includes('reinstall');

  const handleUpdate = async () => {
    try {
      setIsOpening(true);
      const url = versionInfo?.update_url;
      if (!url) {
        // Fallback URLs
        const fallbackUrl = Platform.OS === 'ios'
          ? DEFAULT_APP_STORE_URL
          : DEFAULT_PLAY_STORE_URL;
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

  // Default message for reinstall migration
  const defaultMessage = Platform.OS === 'android' 
    ? 'NerdX has moved to the Google Play Store! For improved security and automatic updates, please:\n\n1️⃣ Uninstall this old app\n2️⃣ Install NerdX from Google Play Store\n\nYour account and progress will be preserved after signing in again.'
    : 'A new version of NerdX is available. Please update to continue using the app.';

  const displayMessage = versionInfo?.update_message || defaultMessage;

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a1a2e"
      />

      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* NerdX Logo */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[Colors.primary.main, Colors.primary.dark]}
                style={styles.logoGradient}
              >
                <Ionicons name="school" size={64} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.logoText}>NerdX</Text>
            </View>

            {/* Update Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={isReinstallRequired ? ['#FF6B6B', '#FF8E53'] : ['#4CAF50', '#45a049']}
                style={styles.updateIconGradient}
              >
                <Ionicons 
                  name={isReinstallRequired ? "swap-vertical" : "arrow-up-circle"} 
                  size={48} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              {isReinstallRequired ? 'Migration Required' : 'Update Required'}
            </Text>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                {displayMessage}
              </Text>
            </View>

            {/* Important Notice for Reinstall */}
            {isReinstallRequired && (
              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={24} color="#FFD93D" style={styles.warningIcon} />
                <Text style={styles.warningText}>
                  Important: This old app will no longer receive updates. Uninstall it after installing from the Play Store.
                </Text>
              </View>
            )}

            {/* Version Info */}
            <View style={styles.versionInfo}>
              <Text style={styles.versionText}>
                Current Version: {installedVersion || 'Unknown'}
              </Text>
              {versionInfo?.latest_version && (
                <Text style={styles.versionText}>
                  Latest Version: {versionInfo.latest_version}
                </Text>
              )}
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
                  <Ionicons 
                    name={Platform.OS === 'ios' ? 'logo-apple-appstore' : 'logo-google-playstore'} 
                    size={24} 
                    color="#FFFFFF" 
                    style={styles.buttonIcon} 
                  />
                  <Text style={styles.updateButtonText}>
                    {isOpening 
                      ? 'Opening Store...' 
                      : Platform.OS === 'ios' 
                        ? 'Open App Store' 
                        : 'Open Play Store'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Only show "Later" button if soft_update is true */}
              {versionInfo?.soft_update && onLater && (
                <TouchableOpacity
                  onPress={onLater}
                  style={styles.laterButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.laterButtonText}>
                    Remind Me Later
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Footer Note */}
            <Text style={styles.footerNote}>
              {isReinstallRequired 
                ? '📱 Your learning data is safe! Sign in after installing to continue.'
                : '✨ Updating ensures you have the latest features and security improvements.'}
            </Text>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  iconContainer: {
    marginBottom: 20,
  },
  updateIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 217, 61, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.3)',
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#FFD93D',
    fontWeight: '500',
  },
  versionInfo: {
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 13,
    marginBottom: 4,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  updateButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 14,
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
    marginRight: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  laterButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footerNote: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 16,
  },
});

export default UpdateRequiredScreen;
