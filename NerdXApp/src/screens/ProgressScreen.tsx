// Progress Screen Component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { userApi, UserStats } from '../services/api/userApi';
import { useAuth } from '../context/AuthContext';

const ProgressScreen: React.FC = () => {
  const { user } = useAuth();
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={styles.statValue}>{stats?.credits || user?.credits || 0}</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{stats?.total_points || 0}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{stats?.streak_count || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statValue}>{stats?.accuracy || 0}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Questions Answered</Text>
          <Text style={styles.detailValue}>{stats?.questions_answered || 0}</Text>
        </View>

        {stats?.last_activity && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Last Activity</Text>
            <Text style={styles.detailValue}>
              {new Date(stats.last_activity).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>🏆</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Getting Started</Text>
            <Text style={styles.achievementDescription}>Complete your first quiz</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  detailsContainer: {
    padding: 20,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 16,
    color: '#757575',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  achievementsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#757575',
  },
});

export default ProgressScreen;
