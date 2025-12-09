// Progress Screen Component - Professional UI/UX Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { userApi, UserStats } from '../services/api/userApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Icons, IconCircle, Icon } from '../components/Icons';
import { Card } from '../components/Card';
import Colors from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

const ProgressScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await userApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Loading progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themedColors.background.default }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
      {/* Professional Header */}
      <LinearGradient
        colors={[Colors.warning.main, Colors.warning.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Your Progress</Text>
            <Text style={styles.subtitle}>Track your learning journey</Text>
          </View>
          {Icons.progress(32, '#FFFFFF')}
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <Card variant="gradient" gradientColors={[Colors.success.main, Colors.success.dark]} style={styles.statCard}>
          <IconCircle
            icon={Icons.credits(28, '#FFFFFF')}
            size={48}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
          <Text style={styles.statValue}>{stats?.credits || user?.credits || 0}</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </Card>

        <Card variant="gradient" gradientColors={[Colors.primary.main, Colors.primary.dark]} style={styles.statCard}>
          <IconCircle
            icon={Icons.success(28, '#FFFFFF')}
            size={48}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
          <Text style={styles.statValue}>{stats?.total_points || 0}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </Card>

        <Card variant="gradient" gradientColors={[Colors.error.main, Colors.error.dark]} style={styles.statCard}>
          <IconCircle
            icon={<Icon name="flame" size={28} color="#FFFFFF" library="ionicons" />}
            size={48}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
          <Text style={styles.statValue}>{stats?.streak_count || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Card>

        <Card variant="gradient" gradientColors={[Colors.secondary.main, Colors.secondary.dark]} style={styles.statCard}>
          <IconCircle
            icon={Icons.progress(28, '#FFFFFF')}
            size={48}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
          <Text style={styles.statValue}>{stats?.accuracy || 0}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </Card>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Activity Details</Text>
        <Card variant="elevated" style={styles.detailCard}>
          <View style={styles.detailContent}>
            <IconCircle
              icon={Icons.quiz(24, Colors.primary.main)}
              size={40}
              backgroundColor={Colors.iconBg.mathematics}
            />
            <View style={styles.detailInfo}>
              <Text style={styles.detailTitle}>Questions Answered</Text>
              <Text style={styles.detailValue}>{stats?.questions_answered || 0}</Text>
            </View>
          </View>
        </Card>

        {stats?.last_activity && (
          <Card variant="elevated" style={styles.detailCard}>
            <View style={styles.detailContent}>
              <IconCircle
                icon={<Icon name="time" size={24} color={Colors.warning.main} library="ionicons" />}
                size={40}
                backgroundColor={Colors.iconBg.english}
              />
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>Last Activity</Text>
                <Text style={styles.detailValue}>
                  {new Date(stats.last_activity).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </Card>
        )}
      </View>

      {/* Achievements Section */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <Card variant="elevated" style={styles.achievementCard}>
          <View style={styles.achievementContent}>
            <IconCircle
              icon={<Icon name="trophy" size={28} color={Colors.warning.main} library="ionicons" />}
              size={56}
              backgroundColor={Colors.iconBg.english}
            />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Getting Started</Text>
              <Text style={styles.achievementDescription}>Complete your first quiz</Text>
            </View>
            {Icons.arrowRight(24, Colors.text.secondary)}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.paper,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.white,
    opacity: 0.9,
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
    marginLeft: 4,
  },
  detailCard: {
    marginBottom: 12,
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 16,
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  achievementsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  achievementCard: {
    marginBottom: 12,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});

export default ProgressScreen;
