// Enhanced Progress Screen - Gamified Learning Experience
// Complete redesign with level system, achievements, streak tracking, and analytics
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { userApi, UserStats } from '../services/api/userApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Icons, IconCircle, Icon } from '../components/Icons';
import { Card } from '../components/Card';
import Colors from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { gamificationService, LevelInfo, DailyGoal, DailyActivity } from '../services/GamificationService';
import { dktService, KnowledgeMap } from '../services/api/dktApi';

// Import new components
import { LevelProgressRing } from '../components/AnimatedProgressRing';
import { StreakCalendar } from '../components/StreakCalendar';
import { AchievementGallery, BadgeData } from '../components/AchievementBadge';
import { SubjectMasteryCard, getDefaultSubjectData, SubjectMasteryData } from '../components/SubjectMasteryCard';
import { WeeklyActivityChart, DailyGoalsWidget } from '../components/WeeklyActivityChart';

const { width } = Dimensions.get('window');

// Quick Stat Card Component
interface QuickStatProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

const QuickStatCard: React.FC<QuickStatProps> = ({ icon, value, label, color }) => {
  const themedColors = useThemedColors();

  return (
    <View style={[styles.quickStat, { backgroundColor: themedColors.background.paper }]}>
      <View style={[styles.quickStatIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.quickStatEmoji}>{icon}</Text>
      </View>
      <Text style={[styles.quickStatValue, { color: themedColors.text.primary }]}>
        {value}
      </Text>
      <Text style={[styles.quickStatLabel, { color: themedColors.text.secondary }]}>
        {label}
      </Text>
    </View>
  );
};

const EnhancedProgressScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const navigation = useNavigation();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [overallStats, setOverallStats] = useState<any>(null);
  const [streakHistory, setStreakHistory] = useState<boolean[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [subjectMastery, setSubjectMastery] = useState<SubjectMasteryData[]>([]);
  const [knowledgeMap, setKnowledgeMap] = useState<KnowledgeMap | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      console.log('📊 Progress: Loading all data...');

      // Load all gamification data with better error handling
      const [
        levelData,
        statsData,
        streakData,
        badgesData,
        goalsData,
        activityData,
        progressData,
      ] = await Promise.all([
        gamificationService.getLevelInfo().catch(e => { console.error('getLevelInfo error:', e); return null; }),
        gamificationService.getOverallStats().catch(e => { console.error('getOverallStats error:', e); return null; }),
        gamificationService.getStreakHistory().catch(e => { console.error('getStreakHistory error:', e); return []; }),
        gamificationService.getAllBadges().catch(e => { console.error('getAllBadges error:', e); return []; }),
        gamificationService.getDailyGoals().catch(e => { console.error('getDailyGoals error:', e); return []; }),
        gamificationService.getWeeklyActivity().catch(e => { console.error('getWeeklyActivity error:', e); return []; }),
        gamificationService.getProgress().catch(e => { console.error('getProgress error:', e); return null; }),
      ]);

      // Fetch remote knowledge map (server-side DKT data)
      let mapData: KnowledgeMap | null = null;
      try {
        mapData = await dktService.getKnowledgeMap();
      } catch (error) {
        console.log('DKT knowledge map unavailable (offline or no data yet)');
      }

      // Set local gamification data
      if (levelData) setLevelInfo(levelData);
      if (statsData) setOverallStats(statsData);
      setStreakHistory(streakData || []);
      setBadges((badgesData || []) as BadgeData[]);
      setDailyGoals(goalsData || []);
      setWeeklyActivity(activityData || []);
      if (mapData) setKnowledgeMap(mapData);

      // Build subject mastery data
      const defaultSubjects = getDefaultSubjectData();
      const updatedSubjects = defaultSubjects.map(subj => ({
        ...subj,
        mastery: progressData?.subjectMastery?.[subj.subject] || 0,
        skillsCount: mapData?.skills?.filter(s => s.subject.toLowerCase() === subj.subject).length || 0,
        masteredSkills: mapData?.skills?.filter(s =>
          s.subject.toLowerCase() === subj.subject && s.mastery >= 0.8
        ).length || 0,
      }));
      setSubjectMastery(updatedSubjects);

      console.log('✅ Progress: Data loaded successfully');

    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    // Also check streak when screen loads
    gamificationService.checkStreak();

    // Safety timeout - prevent stuck loading state after 10 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loadAllData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  // Format weekly activity for chart
  const formatWeeklyActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weeklyActivity.map((activity, index) => {
      const date = new Date(activity.date);
      return {
        day: days[date.getDay()],
        date: activity.date,
        questionsAnswered: activity.questionsAnswered,
        correctAnswers: activity.correctAnswers,
      };
    });
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
          Loading your progress...
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/default_background.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={themedColors.primary.main}
            />
          }
        >
          {/* Hero Section - Level & XP */}
          <LinearGradient
            colors={themedColors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroSection}
          >
            <View style={styles.heroContent}>
              {/* Level Progress Ring */}
              <View style={styles.levelRingContainer}>
                <LevelProgressRing
                  level={levelInfo?.level || 1}
                  currentXP={levelInfo?.currentXP || 0}
                  xpForNextLevel={levelInfo?.xpForNextLevel || 100}
                  size={160}
                />
              </View>

              {/* Rank Badge */}
              <View style={styles.rankBadge}>
                <Text style={styles.rankIcon}>{levelInfo?.rankIcon || '🌱'}</Text>
                <Text style={styles.rankName}>{levelInfo?.rank || 'Novice Explorer'}</Text>
              </View>

              {/* XP Progress Text */}
              <Text style={styles.xpProgressText}>
                {levelInfo?.currentXP?.toLocaleString() || 0} / {levelInfo?.xpForNextLevel?.toLocaleString() || 100} XP
              </Text>
              <Text style={styles.nextLevelText}>
                {(levelInfo?.xpForNextLevel || 100) - (levelInfo?.currentXP || 0)} XP to Level {(levelInfo?.level || 1) + 1}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.mainContent}>
            {/* Quick Stats Grid */}
            <View style={styles.quickStatsGrid}>
              <QuickStatCard
                icon="🔥"
                value={overallStats?.streak || 0}
                label="Day Streak"
                color={Colors.warning.main}
              />
              <QuickStatCard
                icon="📊"
                value={`${overallStats?.accuracy || 0}%`}
                label="Accuracy"
                color={Colors.success.main}
              />
              <QuickStatCard
                icon="❓"
                value={overallStats?.totalQuestions || 0}
                label="Questions"
                color={Colors.primary.main}
              />
              <QuickStatCard
                icon="💎"
                value={user?.credits || 0}
                label="Credits"
                color={Colors.secondary.main}
              />
            </View>

            {/* Daily Goals Widget */}
            {dailyGoals.length > 0 && (
              <DailyGoalsWidget goals={dailyGoals} />
            )}

            {/* Streak Calendar */}
            <StreakCalendar
              streakHistory={streakHistory}
              currentStreak={overallStats?.streak || 0}
            />

            {/* Subject Mastery Section */}
            <View style={[styles.sectionContainer, { backgroundColor: themedColors.background.paper }]}>
              <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                📚 Subject Mastery
              </Text>
              {subjectMastery.map((subject) => (
                <SubjectMasteryCard
                  key={subject.subject}
                  data={subject}
                  compact
                  onPress={() => {
                    // Navigate to subject topics
                    const subjectObj = {
                      id: subject.subject,
                      name: subject.displayName,
                      icon: subject.icon,
                      color: subject.color,
                    };
                    navigation.navigate('Topics' as never, { subject: subjectObj } as never);
                  }}
                />
              ))}
            </View>

            {/* Weekly Activity Chart */}
            <WeeklyActivityChart data={formatWeeklyActivity()} />

            {/* Achievement Gallery */}
            <AchievementGallery
              badges={badges}
              title={`🏆 Achievements (${badges.filter(b => b.isUnlocked).length}/${badges.length})`}
            />

            {/* Knowledge Map Preview */}
            {knowledgeMap && knowledgeMap.total_skills > 0 && (
              <View style={[styles.sectionContainer, { backgroundColor: themedColors.background.paper }]}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                    📊 Skills Overview
                  </Text>
                  <TouchableOpacity style={styles.viewAllBtn}>
                    <Text style={[styles.viewAllText, { color: Colors.primary.main }]}>
                      View All →
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.skillsGrid}>
                  <View style={[styles.skillStat, { backgroundColor: Colors.success.main + '15' }]}>
                    <Text style={[styles.skillStatValue, { color: Colors.success.main }]}>
                      {knowledgeMap.mastered_skills}
                    </Text>
                    <Text style={[styles.skillStatLabel, { color: themedColors.text.secondary }]}>
                      Mastered
                    </Text>
                  </View>
                  <View style={[styles.skillStat, { backgroundColor: Colors.primary.main + '15' }]}>
                    <Text style={[styles.skillStatValue, { color: Colors.primary.main }]}>
                      {knowledgeMap.learning_skills}
                    </Text>
                    <Text style={[styles.skillStatLabel, { color: themedColors.text.secondary }]}>
                      Learning
                    </Text>
                  </View>
                  <View style={[styles.skillStat, { backgroundColor: Colors.warning.main + '15' }]}>
                    <Text style={[styles.skillStatValue, { color: Colors.warning.main }]}>
                      {knowledgeMap.struggling_skills}
                    </Text>
                    <Text style={[styles.skillStatLabel, { color: themedColors.text.secondary }]}>
                      Needs Work
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Lifetime Stats */}
            <View style={[styles.sectionContainer, { backgroundColor: themedColors.background.paper }]}>
              <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                📈 Lifetime Statistics
              </Text>

              <View style={styles.lifetimeStats}>
                <View style={styles.lifetimeStat}>
                  <IconCircle
                    icon={<Icon name="school" size={20} color={Colors.primary.main} library="ionicons" />}
                    size={40}
                    backgroundColor={Colors.primary.main + '20'}
                  />
                  <View style={styles.lifetimeStatInfo}>
                    <Text style={[styles.lifetimeStatValue, { color: themedColors.text.primary }]}>
                      {overallStats?.totalQuizzes || 0}
                    </Text>
                    <Text style={[styles.lifetimeStatLabel, { color: themedColors.text.secondary }]}>
                      Quizzes Completed
                    </Text>
                  </View>
                </View>

                <View style={styles.lifetimeStat}>
                  <IconCircle
                    icon={<Icon name="star" size={20} color={Colors.warning.main} library="ionicons" />}
                    size={40}
                    backgroundColor={Colors.warning.main + '20'}
                  />
                  <View style={styles.lifetimeStatInfo}>
                    <Text style={[styles.lifetimeStatValue, { color: themedColors.text.primary }]}>
                      {overallStats?.totalXP?.toLocaleString() || 0}
                    </Text>
                    <Text style={[styles.lifetimeStatLabel, { color: themedColors.text.secondary }]}>
                      Total XP Earned
                    </Text>
                  </View>
                </View>

                <View style={styles.lifetimeStat}>
                  <IconCircle
                    icon={<Icon name="trophy" size={20} color={Colors.success.main} library="ionicons" />}
                    size={40}
                    backgroundColor={Colors.success.main + '20'}
                  />
                  <View style={styles.lifetimeStatInfo}>
                    <Text style={[styles.lifetimeStatValue, { color: themedColors.text.primary }]}>
                      {overallStats?.perfectScores || 0}
                    </Text>
                    <Text style={[styles.lifetimeStatLabel, { color: themedColors.text.secondary }]}>
                      Perfect Scores
                    </Text>
                  </View>
                </View>

                <View style={styles.lifetimeStat}>
                  <IconCircle
                    icon={<Icon name="flame" size={20} color={Colors.error.main} library="ionicons" />}
                    size={40}
                    backgroundColor={Colors.error.main + '20'}
                  />
                  <View style={styles.lifetimeStatInfo}>
                    <Text style={[styles.lifetimeStatValue, { color: themedColors.text.primary }]}>
                      {overallStats?.longestStreak || 0}
                    </Text>
                    <Text style={[styles.lifetimeStatLabel, { color: themedColors.text.secondary }]}>
                      Longest Streak
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Motivational Footer */}
            <View style={styles.motivationalFooter}>
              <LinearGradient
                colors={[Colors.secondary.main, Colors.secondary.dark]}
                style={styles.motivationalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.motivationalEmoji}>🚀</Text>
                <Text style={styles.motivationalText}>
                  Keep learning! You're doing amazing!
                </Text>
                <Text style={styles.motivationalSubtext}>
                  Every question brings you closer to mastery
                </Text>
              </LinearGradient>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },

  // Hero Section
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: Colors.primary.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroContent: {
    alignItems: 'center',
  },
  levelRingContainer: {
    marginBottom: 16,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  rankIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  rankName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  xpProgressText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  nextLevelText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },

  // Main Content
  mainContent: {
    padding: 20,
    marginTop: -20,
  },

  // Quick Stats
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickStat: {
    width: (width - 52) / 4,
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickStatEmoji: {
    fontSize: 18,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickStatLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },

  // Section Container
  sectionContainer: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    shadowColor: Colors.primary.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewAllBtn: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Skills Grid
  skillsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  skillStat: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  skillStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  skillStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  // Lifetime Stats
  lifetimeStats: {
    gap: 12,
  },
  lifetimeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lifetimeStatInfo: {
    flex: 1,
  },
  lifetimeStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lifetimeStatLabel: {
    fontSize: 13,
  },

  // Motivational Footer
  motivationalFooter: {
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  motivationalGradient: {
    padding: 24,
    alignItems: 'center',
  },
  motivationalEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  motivationalText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  motivationalSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },

  // Spacing
  bottomSpacer: {
    height: 40,
  },
});

export default EnhancedProgressScreen;
