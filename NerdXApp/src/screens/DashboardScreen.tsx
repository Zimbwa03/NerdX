// Dashboard Screen Component - Professional UI/UX Design
import React, { useEffect, useState } from 'react';
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
import { Colors } from '../theme/colors';
import { Modal, ModalOptionCard } from '../components/Modal';
import { gamificationService, UserProgress, Badge } from '../services/GamificationService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useAuth();
  const [scienceModalVisible, setScienceModalVisible] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    // Refresh credits and gamification progress
    const refreshData = async () => {
      try {
        const balance = await creditsApi.getBalance();
        if (user && balance !== user.credits) {
          updateUser({ credits: balance });
        }

        const progress = await gamificationService.getProgress();
        setUserProgress(progress);
      } catch (error) {
        console.error('Failed to refresh data:', error);
      }
    };
    refreshData();
  }, []);

  const navigateToSubject = (subjectId: string) => {
    // Create a minimal Subject object for navigation
    // In a real app, we might want to fetch the full subject details or have them available
    const subject: Partial<Subject> = {
      id: subjectId,
      name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
      icon: subjectId === 'mathematics' ? 'calculate' : 'menu-book', // Simplified mapping
      color: Colors.subjects[subjectId as keyof typeof Colors.subjects] || Colors.primary.main,
    };
    navigation.navigate('Topics' as never, { subject } as never);
  };

  const handleSciencePress = () => {
    setScienceModalVisible(true);
  };

  const handleTeacherMode = () => {
    setScienceModalVisible(false);
    const subject: Partial<Subject> = {
      id: 'combined_science',
      name: 'Combined Science',
      icon: 'science',
      color: Colors.subjects.science,
    };
    navigation.navigate('TeacherModeSetup' as never, { subject } as never);
  };

  const handlePracticeMode = () => {
    setScienceModalVisible(false);
    const subject: Partial<Subject> = {
      id: 'combined_science',
      name: 'Combined Science',
      icon: 'science',
      color: Colors.subjects.science,
    };
    navigation.navigate('Topics' as never, { subject } as never);
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
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
          onError={(error) => {
            console.warn('Failed to load card image:', error.nativeEvent.error);
          }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(10, 14, 33, 0.9)']}
          style={styles.cardGradient}
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProgressWidget = () => {
    if (!userProgress) return null;

    const getMasteryColor = (score: number) => {
      if (score >= 80) return Colors.success.main;
      if (score >= 50) return Colors.warning.main;
      return Colors.error.main;
    };

    return (
      <View style={styles.progressWidget}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Science Mastery</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {userProgress.streak} Day Streak</Text>
          </View>
        </View>

        <View style={styles.masteryContainer}>
          {['Biology', 'Chemistry', 'Physics'].map((subj) => {
            const score = userProgress.subjectMastery[subj] || 0;
            return (
              <View key={subj} style={styles.masteryRow}>
                <Text style={styles.masteryLabel}>{subj}</Text>
                <View style={styles.masteryBarBg}>
                  <View
                    style={[
                      styles.masteryBarFill,
                      { width: `${score}%`, backgroundColor: getMasteryColor(score) }
                    ]}
                  />
                </View>
                <Text style={styles.masteryScore}>{score}%</Text>
              </View>
            );
          })}
        </View>

        {userProgress.badges.length > 0 && (
          <View style={styles.badgesContainer}>
            <Text style={styles.badgesTitle}>Recent Badges</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {userProgress.badges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.default} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professional Header with Space Gradient */}
        <LinearGradient
          colors={Colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Explorer'}</Text>
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
          {renderProgressWidget()}

          <Text style={styles.sectionTitle}>Learning Hub</Text>

          <View style={styles.gridContainer}>
            {/* Main Subject Cards */}
            {renderFeatureCard(
              'Mathematics',
              'Master numbers & logic',
              require('../../assets/images/math_card.png'),
              () => navigateToSubject('mathematics')
            )}

            {renderFeatureCard(
              'Science',
              'Explore the universe',
              require('../../assets/images/science_card.png'),
              handleSciencePress
            )}

            {renderFeatureCard(
              'English',
              'Perfect your language',
              require('../../assets/images/english_card.png'),
              () => navigateToSubject('english')
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

      {/* Science Mode Selection Modal */}
      <Modal
        visible={scienceModalVisible}
        onClose={() => setScienceModalVisible(false)}
        title="Combined Science"
      >
        <Text style={styles.modalDescription}>Choose your learning mode:</Text>
        <ModalOptionCard
          icon="👨‍🏫"
          title="Teacher Mode"
          description="Interactive AI teaching with personalized explanations and notes"
          onPress={handleTeacherMode}
          color={Colors.subjects.science}
        />
        <ModalOptionCard
          icon="📝"
          title="Practice Mode"
          description="Practice questions by topic and test your knowledge"
          onPress={handlePracticeMode}
          color={Colors.primary.main}
        />
      </Modal>
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
    shadowOpacity: 0.5,
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
    textShadowColor: Colors.primary.main,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nerdxId: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  creditsSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
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
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
    backgroundColor: Colors.background.paper,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    height: '80%',
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
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 23, 68, 0.3)',
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
  modalDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  progressWidget: {
    backgroundColor: Colors.background.paper,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border.light,
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warning.main,
  },
  streakText: {
    color: Colors.warning.main,
    fontWeight: 'bold',
    fontSize: 12,
  },
  masteryContainer: {
    marginBottom: 16,
  },
  masteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  masteryLabel: {
    width: 80,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  masteryBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.background.subtle,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  masteryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  masteryScore: {
    width: 40,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  badgesContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  badgesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 10,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

export default DashboardScreen;
