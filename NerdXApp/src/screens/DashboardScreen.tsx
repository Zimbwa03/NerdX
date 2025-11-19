// Dashboard Screen Component - Professional UI/UX Design
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { creditsApi } from '../services/api/creditsApi';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useAuth();

  useEffect(() => {
    // Refresh credits when screen loads
    const refreshCredits = async () => {
      try {
        const balance = await creditsApi.getBalance();
        if (user && balance !== user.credits) {
          updateUser({ credits: balance });
        }
      } catch (error) {
        console.error('Failed to refresh credits:', error);
      }
    };
    refreshCredits();
  }, []);

  const navigateToSubjects = () => {
    navigation.navigate('Subjects' as never);
  };

  const navigateToCredits = () => {
    navigation.navigate('Credits' as never);
  };

  const navigateToProgress = () => {
    navigation.navigate('Progress' as never);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile' as never);
  };

  const navigateToProjectAssistant = () => {
    navigation.navigate('ProjectAssistantSetup' as never);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderFeatureCard = (
    title: string,
    subtitle: string,
    imageSource: any,
    onPress: () => void,
    fullWidth: boolean = false
  ) => (
    <TouchableOpacity
      style={[styles.featureCard, fullWidth ? styles.fullWidthCard : styles.halfWidthCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardImageContainer}>
        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.cardGradient}
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professional Header with Gradient */}
        <LinearGradient
          colors={Colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Student'}</Text>
              <View style={styles.idBadge}>
                <Text style={styles.nerdxId}>ID: {user?.nerdx_id || 'N/A'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={navigateToProfile}>
              <IconCircle
                icon={Icons.profile(32, Colors.primary.main)}
                size={56}
                backgroundColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Credits Summary */}
          <View style={styles.creditsSummary}>
            <View style={styles.creditRow}>
              <Text style={styles.creditsLabel}>Available Credits</Text>
              <TouchableOpacity onPress={navigateToCredits} style={styles.addCreditsBtn}>
                <Text style={styles.addCreditsText}>+ Top Up</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.creditsAmount}>{user?.credits || 0}</Text>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Learning Hub</Text>

          <View style={styles.gridContainer}>
            {/* Main Subject Cards */}
            {renderFeatureCard(
              'Mathematics',
              'Master numbers & logic',
              require('../../assets/images/math_card.png'),
              navigateToSubjects
            )}

            {renderFeatureCard(
              'Science',
              'Explore the universe',
              require('../../assets/images/science_card.png'),
              navigateToSubjects
            )}

            {renderFeatureCard(
              'English',
              'Perfect your language',
              require('../../assets/images/english_card.png'),
              navigateToSubjects
            )}

            {renderFeatureCard(
              'Project Assistant',
              'AI-powered help',
              require('../../assets/images/project_assistant_card.png'),
              navigateToProjectAssistant
            )}

            {/* Full Width Cards */}
            {renderFeatureCard(
              'My Progress',
              'Track your learning journey and achievements',
              require('../../assets/images/profile_card.png'),
              navigateToProgress,
              true
            )}

            {renderFeatureCard(
              'Credits & Store',
              'Manage your wallet and subscriptions',
              require('../../assets/images/credits_card.png'),
              navigateToCredits,
              true
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.logoutContent}>
              {Icons.logout(20, Colors.error.main)}
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: Colors.primary.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  nerdxId: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  creditsSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  addCreditsBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addCreditsText: {
    color: Colors.primary.main,
    fontSize: 12,
    fontWeight: '700',
  },
  creditsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  mainContent: {
    padding: 24,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
    marginLeft: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  halfWidthCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
  },
  fullWidthCard: {
    width: '100%',
    height: 140,
    flexDirection: 'row',
  },
  cardImageContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: Colors.error.main,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
