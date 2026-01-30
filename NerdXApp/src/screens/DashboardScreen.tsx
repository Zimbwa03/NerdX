// Dashboard Screen Component - World-Class UI/UX Design ✨
// Featuring: Animated cards, Motivational quotes, Floating particles
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCreditMonitor } from '../hooks/useCreditMonitor';
import { creditsApi } from '../services/api/creditsApi';
import type { Subject } from '../services/api/quizApi';
import { Icons, IconCircle } from '../components/Icons';
import { Ionicons } from '@expo/vector-icons';
import { Colors, getColors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { gamificationService, UserProgress, Badge } from '../services/GamificationService';
import { dktService, KnowledgeMap } from '../services/api/dktApi';
import { KnowledgeMapWidget } from '../components/KnowledgeMapWidget';

// ✨ New animated components
import MotivationalSlider from '../components/MotivationalSlider';
import AnimatedCard from '../components/AnimatedCard';
import FloatingParticles from '../components/FloatingParticles';
// NerdX Live - removed floating toggle, using Dashboard button instead

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

import { sync } from '../services/SyncService';
import { getUnreadCount, subscribeToNotifications } from '../services/notifications';
import { checkUpdateRequired } from '../services/appVersion';
import { formatCreditBalance } from '../utils/creditCalculator';
import { getSupabaseAuthUserId } from '../services/supabase';




const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const themedColors = useThemedColors();
  useCreditMonitor(); // Monitor credits and show warnings
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [knowledgeMap, setKnowledgeMap] = useState<KnowledgeMap | null>(null);
  const [loadingKnowledgeMap, setLoadingKnowledgeMap] = useState(false);
  const [dailyReview, setDailyReview] = useState<{ count: number, reviews: any[] } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'O Level' | 'A Level'>('O Level');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUpdateScreen, setShowUpdateScreen] = useState(false);

  // A Level subject colors
  const aLevelColors = {
    pure_mathematics: '#8B5CF6', // Purple
    chemistry: '#10B981', // Green
    physics: '#3B82F6', // Blue
    biology: '#14B8A6', // Teal
    computer_science: '#0D47A1', // Deep blue (Master Code, Algorithms & Systems)
    geography: '#2E7D32', // Green (same as O-Level Geography)
  };

  // Load unread notification count and subscribe to realtime updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupNotifications = async () => {
      // Load initial unread count
      const count = await getUnreadCount();
      setUnreadCount(count);

      // Get Supabase Auth user ID for realtime subscription (required for RLS)
      const supabaseUserId = await getSupabaseAuthUserId();
      if (supabaseUserId) {
        console.log('[Dashboard] Setting up notification subscription for Supabase user:', supabaseUserId);
        unsubscribe = subscribeToNotifications(
          supabaseUserId,
          async () => {
            // New notification received - refresh count
            const newCount = await getUnreadCount();
            setUnreadCount(newCount);
          },
          async () => {
            // Notification updated (e.g., marked as read) - refresh count
            const newCount = await getUnreadCount();
            setUnreadCount(newCount);
          }
        );
      } else {
        console.log('[Dashboard] No Supabase Auth session - notifications disabled');
      }
    };

    setupNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id]);

  // Check for app update requirement
  useEffect(() => {
    const checkUpdate = async () => {
      const updateInfo = await checkUpdateRequired();
      if (updateInfo.updateRequired && updateInfo.isHardUpdate) {
        setShowUpdateScreen(true);
      }
    };
    checkUpdate();
  }, []);

  const navigateToNotifications = () => {
    navigation.navigate('Notifications' as never);
  };

  useEffect(() => {
    // Refresh credits and gamification progress
    const refreshData = async () => {
      try {
        // Trigger background sync
        sync().catch(err => console.error('Sync failed:', err));

        const balance = await creditsApi.getBalance();
        if (user && balance !== user.credits) {
          updateUser({ credits: balance });
        }

        const progress = await gamificationService.getProgress();
        setUserProgress(progress);

        // Load DKT knowledge map
        try {
          setLoadingKnowledgeMap(true);
          const map = await dktService.getKnowledgeMap();
          setKnowledgeMap(map);
        } catch (error) {
          console.error('Failed to load knowledge map:', error);
        } finally {
          setLoadingKnowledgeMap(false);
        }

        // Load Daily Review
        try {
          const reviewData = await dktService.getDailyReview();
          setDailyReview(reviewData);
        } catch (error) {
          console.error('Failed to load daily review:', error);
        }
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
    // Navigate directly to Practice Mode (Topics screen)
    const subject: Partial<Subject> = {
      id: 'combined_science',
      name: 'Combined Science',
      icon: 'science',
      color: Colors.subjects.science,
    };
    navigation.navigate('Topics' as never, { subject } as never);
  };

  const handleComputerSciencePress = () => {
    const subject: Partial<Subject> = {
      id: 'computer_science',
      name: 'Computer Science',
      icon: 'hardware-chip',
      color: '#0288D1',
    };
    navigation.navigate('Topics' as never, { subject } as never);
  };

  const handleGeographyPress = () => {
    const subject: Partial<Subject> = {
      id: 'geography',
      name: 'Geography',
      icon: 'public',
      color: '#2E7D32',
    };
    navigation.navigate('Topics' as never, { subject } as never);
  };

  const handleTeacherMode = () => {
    navigation.navigate('TeacherModeSetup' as never);
  };

  const navigateToVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const startDailyReview = () => {
    if (dailyReview && dailyReview.reviews.length > 0) {
      navigation.navigate('Quiz' as never, {
        isReviewMode: true,
        reviewItems: dailyReview.reviews
      } as never);
    }
  };

  const navigateToCredits = () => {
    navigation.navigate('Credits' as never);
  };

  const navigateToProgress = () => {
    navigation.navigate('Progress' as never);
  };

  const navigateToNerdXLive = () => {
    navigation.navigate('NerdXLiveAudio' as never);
  };

  const navigateToOfflineChat = () => {
    navigation.navigate('OfflineChat' as never);
  };

  const navigateToProfile = () => {
    navigation.navigate('Account' as never);
  };

  const navigateToProjectAssistant = () => {
    // Check if user has sufficient credits before navigating
    const userCredits = formatCreditBalance(user?.credits);
    const requiredCredits = 1; // 1 credit per AI response
    
    if (userCredits < requiredCredits) {
      Alert.alert(
        'Insufficient Credits',
        `Project Assistant requires at least ${requiredCredits} credit to use. You currently have ${userCredits} credit${userCredits === 1 ? '' : 's'}.\n\nPlease purchase more credits to continue.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy Credits',
            onPress: () => navigation.navigate('Credits' as never),
          },
        ]
      );
      return;
    }

    navigation.navigate('ProjectAssistantSetup' as never);
  };

  const navigateToProjectList = () => {
    navigation.navigate('ProjectList' as never);
  };

  const navigateToALevelSubject = (subjectId: string, subjectName: string) => {
    // Navigate to dedicated A Level Physics screen
    if (subjectId === 'physics') {
      navigation.navigate('ALevelPhysics' as never);
      return;
    }

    // Navigate to dedicated A Level Chemistry screen
    if (subjectId === 'chemistry') {
      navigation.navigate('ALevelChemistry' as never);
      return;
    }

    // Navigate to dedicated A Level Pure Mathematics screen
    if (subjectId === 'pure_mathematics') {
      navigation.navigate('ALevelPureMath' as never);
      return;
    }

    // Navigate to dedicated A Level Biology screen
    if (subjectId === 'biology') {
      navigation.navigate('ALevelBiology' as never);
      return;
    }

    // Navigate to A Level Computer Science (Topics screen with board selection)
    if (subjectId === 'computer_science') {
      const subject: Partial<Subject> = {
        id: 'a_level_computer_science',
        name: 'A-Level Computer Science',
        icon: 'code-working',
        color: aLevelColors.computer_science,
      };
      navigation.navigate('Topics' as never, { subject } as never);
      return;
    }

    // Navigate to A Level Geography (Topics screen)
    if (subjectId === 'geography') {
      const subject: Partial<Subject> = {
        id: 'a_level_geography',
        name: 'A-Level Geography',
        icon: 'map',
        color: aLevelColors.geography,
      };
      navigation.navigate('Topics' as never, { subject } as never);
      return;
    }

    // For other A Level subjects, use Topics screen (to be implemented)
    const subject: Partial<Subject> = {
      id: `a_level_${subjectId}`,
      name: `A Level ${subjectName}`,
      icon: 'science',
      color: aLevelColors[subjectId as keyof typeof aLevelColors] || Colors.primary.main,
    };
    navigation.navigate('Topics' as never, { subject } as never);
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

  const renderDailyReviewWidget = () => {
    if (!dailyReview || dailyReview.count === 0) return null;

    return (
      <View style={styles.reviewWidget}>
        <LinearGradient
          colors={['#6A1B9A', '#4A148C']} // Purple gradient for "Brain/Memory"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.reviewGradient}
        >
          <View style={styles.reviewContent}>
            <View>
              <Text style={styles.reviewTitle}>Daily Review</Text>
              <Text style={styles.reviewSubtitle}>
                {dailyReview.count} topics due for review
              </Text>
            </View>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={startDailyReview}
            >
              <Text style={styles.reviewButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

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
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      {/* 🎨 Professional Background Image */}
      <ImageBackground
        source={require('../../assets/images/default_background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* ✨ Floating Particles Background */}
        <FloatingParticles count={20} />

        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={themedColors.background.default}
        />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* ✨ Modern Compact Transparent Header */}
          <View style={styles.modernHeader}>
            {/* Top Row - Icons and Actions */}
            <View style={styles.topRow}>
              <View style={styles.leftSection}>
                <Text style={styles.appTitle}>NerdX</Text>
              </View>

              <View style={styles.rightSection}>
                {/* Theme Toggle */}
                <TouchableOpacity
                  onPress={toggleTheme}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.iconEmoji}>
                    {isDarkMode ? '☀️' : '🌙'}
                  </Text>
                </TouchableOpacity>

                {/* Notification Bell */}
                <TouchableOpacity
                  onPress={navigateToNotifications}
                  style={styles.notificationButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color={themedColors.text.primary}
                  />
                  {unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Profile Button */}
                <TouchableOpacity
                  onPress={navigateToProfile}
                  style={styles.profileButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Colors.primary.main, Colors.primary.dark]}
                    style={styles.profileGradient}
                  >
                    <Text style={styles.profileInitial}>
                      {(user?.name || 'N')[0].toUpperCase()}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* User Info Row - Compact */}
            <View style={styles.userRow}>
              <View style={styles.userNameSection}>
                <Text style={styles.greeting}>Welcome back 👋</Text>
                <Text style={styles.displayName}>
                  {user?.name ? `${user.name} ${user.surname || ''}` : 'Student'}
                </Text>
                <View style={styles.compactIdBadge}>
                  <Text style={styles.compactId}>ID: {user?.nerdx_id || 'N/A'}</Text>
                </View>
              </View>

              {/* Floating Credits Badge */}
              <TouchableOpacity
                onPress={navigateToCredits}
                style={styles.floatingCreditsBadge}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['rgba(124, 77, 255, 0.2)', 'rgba(63, 29, 203, 0.2)']}
                  style={styles.creditsBadgeGradient}
                >
                  <Text style={styles.creditsValue}>{formatCreditBalance(user?.credits)}</Text>
                  <Text style={styles.creditsLabelSmall}>Credits</Text>
                  <View style={styles.topUpIndicator}>
                    <Text style={styles.topUpText}>+</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainContent}>
            {/* ✨ Motivational Quotes Slider - Rotates every 3 seconds */}
            <MotivationalSlider intervalMs={3000} showCategory={true} showAuthor={true} />

            {renderDailyReviewWidget()}

            <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Learning Hub</Text>

            {/* O Level / A Level Tab Selector */}
            <View style={styles.levelTabContainer}>
              <TouchableOpacity
                style={[
                  styles.levelTab,
                  selectedLevel === 'O Level' && styles.levelTabActive
                ]}
                onPress={() => setSelectedLevel('O Level')}
                activeOpacity={0.8}
              >
                {selectedLevel === 'O Level' ? (
                  <LinearGradient
                    colors={[Colors.primary.main, Colors.primary.dark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.levelTabGradient}
                  >
                    <Text style={styles.levelTabTextActive}>O Level</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.levelTabText}>O Level</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.levelTab,
                  selectedLevel === 'A Level' && styles.levelTabActive
                ]}
                onPress={() => setSelectedLevel('A Level')}
                activeOpacity={0.8}
              >
                {selectedLevel === 'A Level' ? (
                  <LinearGradient
                    colors={['#8B5CF6', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.levelTabGradient}
                  >
                    <Text style={styles.levelTabTextActive}>A Level</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.levelTabText}>A Level</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.gridContainer}>
              {selectedLevel === 'O Level' ? (
                <>
                  {/* Row 1: O Level Mathematics + Sciences */}
                  <View style={styles.cardRow}>
                    <AnimatedCard
                      title="O Level Mathematics"
                      subtitle="Build Strong Math Foundations"
                      imageSource={require('../../assets/images/olevel_mathematics_card.png')}
                      onPress={() => navigateToSubject('mathematics')}
                      glowColor={Colors.subjects.mathematics}
                      index={0}
                      hideText={true}
                    />
                    <AnimatedCard
                      title="Sciences"
                      subtitle="Explore the World Around You"
                      imageSource={require('../../assets/images/olevel_sciences_card.png')}
                      onPress={handleSciencePress}
                      glowColor={Colors.subjects.science}
                      index={1}
                      hideText={true}
                    />
                  </View>
                  {/* Row 2: English + Computer Science */}
                  <View style={styles.cardRow}>
                    <AnimatedCard
                      title="English"
                      subtitle="Read, Write & Communicate"
                      imageSource={require('../../assets/images/olevel_english_card.png')}
                      onPress={() => navigateToSubject('english')}
                      glowColor={Colors.subjects.english}
                      index={2}
                      hideText={true}
                    />
                    <AnimatedCard
                      title="Computer Science"
                      subtitle="ZimSec & Cambridge O Level"
                      imageSource={require('../../assets/images/olevel_computer_science_card.png')}
                      onPress={handleComputerSciencePress}
                      glowColor="#0288D1"
                      index={3}
                      hideText={true}
                    />
                  </View>
                  {/* Row 3: Geography + Project Assistant */}
                  <View style={styles.cardRow}>
                    <AnimatedCard
                      title="Geography"
                      subtitle="All Level ZIMSEC Geography"
                      imageSource={require('../../assets/images/olevel_geography_card.png')}
                      onPress={handleGeographyPress}
                      glowColor="#2E7D32"
                      index={4}
                      hideText={true}
                    />
                    <AnimatedCard
                      title="Project Assistant"
                      subtitle="Plan, Research & Succeed"
                      imageSource={require('../../assets/images/project_assistant_card_new.png')}
                      onPress={navigateToProjectList}
                      glowColor={Colors.primary.main}
                      index={5}
                      hideText={true}
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* Row 1: A Level Pure Math + Chemistry */}
                  <View style={styles.cardRow}>
                    <AnimatedCard
                      title="A Level Pure Mathematics"
                      subtitle="Build Logical & Analytical Skills"
                      imageSource={require('../../assets/images/alevel_pure_math_card.png')}
                      onPress={() => navigateToALevelSubject('pure_mathematics', 'Pure Mathematics')}
                      glowColor={aLevelColors.pure_mathematics}
                      index={0}
                      hideText={true}
                    />
                    <AnimatedCard
                      title="A Level Chemistry"
                      subtitle="Explore Matter & Reactions"
                      imageSource={require('../../assets/images/alevel_chemistry_card.png')}
                      onPress={() => navigateToALevelSubject('chemistry', 'Chemistry')}
                      glowColor={aLevelColors.chemistry}
                      index={1}
                      hideText={true}
                    />
                  </View>
                  {/* Row 2: Physics + Biology */}
                  <View style={styles.cardRow}>
                    <AnimatedCard
                      title="A Level Physics"
                      subtitle="Understand the Laws of Nature"
                      imageSource={require('../../assets/images/alevel_physics_card.png')}
                      onPress={() => navigateToALevelSubject('physics', 'Physics')}
                      glowColor={aLevelColors.physics}
                      index={2}
                      hideText={true}
                    />
                    <AnimatedCard
                      title="A Level Biology"
                      subtitle="Cell biology & genetics"
                      imageSource={require('../../assets/images/alevel_biology_card.png')}
                      onPress={() => navigateToALevelSubject('biology', 'Biology')}
                      glowColor={aLevelColors.biology}
                      index={3}
                      hideText={true}
                    />
                  </View>
                  {/* Row 3: Computer Science + Geography */}
                  <View style={styles.cardRow}>
                    <AnimatedCard
                      title="A Level Computer Science"
                      subtitle="Master Code, Algorithms & Systems"
                      imageSource={require('../../assets/images/alevel_computer_science_card.png')}
                      onPress={() => navigateToALevelSubject('computer_science', 'Computer Science')}
                      glowColor={aLevelColors.computer_science}
                      index={4}
                      hideText={true}
                    />
                    <AnimatedCard
                      title="A Level Geography"
                      subtitle="Explore Advanced Concepts & Systems"
                      imageSource={require('../../assets/images/alevel_geography_card.png')}
                      onPress={() => navigateToALevelSubject('geography', 'Geography')}
                      glowColor={aLevelColors.geography}
                      index={5}
                      hideText={true}
                    />
                  </View>
                </>
              )}

              {/* Row: Teacher Mode + Virtual Labs */}
              <View style={styles.cardRow}>
                <AnimatedCard
                  title="Teacher Mode"
                  subtitle="Interactive AI Teaching"
                  imageSource={require('../../assets/images/teacher_mode_card.png')}
                  onPress={handleTeacherMode}
                  glowColor={Colors.subjects.science}
                  index={5}
                  hideText={true}
                />
                <AnimatedCard
                  title="Virtual Labs"
                  subtitle="Interactive Science Simulations"
                  imageSource={require('../../assets/images/virtual_labs_card.png')}
                  onPress={navigateToVirtualLab}
                  glowColor={Colors.subjects.science}
                  index={6}
                  hideText={true}
                />
              </View>

              {/* Full Width Cards - Always visible */}
              <AnimatedCard
                title="Offline Chat"
                subtitle="Free • Basic Questions • Works Offline"
                imageSource={require('../../assets/images/offline_chat_card.png')}
                onPress={navigateToOfflineChat}
                glowColor="#10B981"
                fullWidth={true}
                index={6}
                hideText={true}
              />

              <AnimatedCard
                title="NerdX Live"
                subtitle="Real-time Speech-to-Speech Conversations"
                imageSource={require('../../assets/images/nerdx_live_card.png')}
                onPress={navigateToNerdXLive}
                glowColor="#6C63FF"
                fullWidth={true}
                index={7}
                hideText={true}
              />

              <AnimatedCard
                title="My Progress"
                subtitle="Track Your Learning Journey"
                imageSource={require('../../assets/images/my_progress_card.png')}
                onPress={navigateToProgress}
                glowColor="#a18cd1"
                fullWidth={true}
                index={8}
                hideText={true}
              />

              <AnimatedCard
                title="Credits & Store"
                subtitle="Redeem Rewards & Boost Learning"
                imageSource={require('../../assets/images/credits_card_new.png')}
                onPress={navigateToCredits}
                glowColor="#fbc2eb"
                fullWidth={true}
                index={9}
                hideText={true}
              />


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

      </ImageBackground>

      {/* NerdX Live - Now accessed via Dashboard button */}
    </View >
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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // ✨ Modern Compact Header Styles
  modernHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: Colors.primary.main,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconEmoji: {
    fontSize: 18,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userNameSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: Colors.primary.main,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  compactIdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  compactId: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  floatingCreditsBadge: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.3)',
  },
  creditsBadgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  creditsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  creditsLabelSmall: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  topUpIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topUpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  // O Level / A Level Tab Styles
  levelTabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  levelTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  levelTabActive: {
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  levelTabGradient: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  levelTabTextActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gridContainer: {
    width: '100%',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
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
    color: '#666666',
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
  reviewWidget: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  reviewGradient: {
    padding: 20,
  },
  reviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reviewSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  reviewButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reviewButtonText: {
    color: '#6A1B9A',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DashboardScreen;
