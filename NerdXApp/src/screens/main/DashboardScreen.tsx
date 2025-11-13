import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Text, Card, Surface, Button, IconButton} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../theme/ThemeContext';
import {userApi, creditApi} from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DashboardScreen = ({navigation}: any) => {
  const {user, refreshUser} = useAuth();
  const {theme} = useTheme();
  const [stats, setStats] = useState({
    credits: 0,
    total_points: 0,
    streak_count: 0,
    accuracy: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userStats, creditBalance] = await Promise.all([
        userApi.getStats(),
        creditApi.getBalance(),
      ]);
      setStats({
        credits: creditBalance,
        total_points: userStats.total_points,
        streak_count: userStats.streak_count,
        accuracy: userStats.accuracy,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), refreshUser()]);
    setRefreshing(false);
  };

  const StatCard = ({title, value, icon, color}: any) => (
    <Card style={styles.statCard}>
      <Card.Content>
        <View style={styles.statContent}>
          <Icon name={icon} size={32} color={color} />
          <View style={styles.statText}>
            <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
              {value}
            </Text>
            <Text variant="bodySmall" style={{color: theme.colors.text}}>
              {title}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Surface style={[styles.header, {backgroundColor: theme.colors.primary}]}>
        <View style={styles.headerContent}>
          <View>
            <Text variant="headlineSmall" style={styles.welcomeText}>
              Welcome back,
            </Text>
            <Text variant="headlineMedium" style={styles.nameText}>
              {user?.name}!
            </Text>
          </View>
          <IconButton
            icon="account-circle"
            size={40}
            iconColor={theme.colors.onPrimary}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </Surface>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <StatCard
            title="Credits"
            value={stats.credits}
            icon="account-balance-wallet"
            color={theme.colors.primary}
          />
          <StatCard
            title="XP Points"
            value={stats.total_points}
            icon="star"
            color={theme.colors.warning}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Streak"
            value={`${stats.streak_count} days`}
            icon="local-fire-department"
            color={theme.colors.error}
          />
          <StatCard
            title="Accuracy"
            value={`${stats.accuracy.toFixed(0)}%`}
            icon="trending-up"
            color={theme.colors.success}
          />
        </View>

        <Card style={styles.quickActions}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Subjects')}>
              <Icon name="menu-book" size={24} color={theme.colors.primary} />
              <Text style={styles.actionText}>Start Quiz</Text>
            </TouchableOpacity>
            {stats.credits <= 20 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Credits')}>
                <Icon name="add-circle" size={24} color={theme.colors.error} />
                <Text style={styles.actionText}>Buy Credits</Text>
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#FFFFFF',
  },
  nameText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  quickActions: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
  },
});

export default DashboardScreen;

