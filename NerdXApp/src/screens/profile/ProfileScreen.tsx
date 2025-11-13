import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Text, Card, Button, List, ActivityIndicator, Divider} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../theme/ThemeContext';
import {userApi} from '../../services/api';
import {UserStats} from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({navigation}: any) => {
  const {user, logout} = useAuth();
  const {theme} = useTheme();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await userApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Icon name="account-circle" size={64} color={theme.colors.primary} />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.name}>
                {user?.name} {user?.surname}
              </Text>
              <Text variant="bodyMedium" style={styles.nerdxId}>
                NerdX ID: {user?.nerdx_id}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {stats && (
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Statistics
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.total_points}
                </Text>
                <Text variant="bodySmall">Total Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.streak_count}
                </Text>
                <Text variant="bodySmall">Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.accuracy.toFixed(0)}%
                </Text>
                <Text variant="bodySmall">Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {stats.questions_answered}
                </Text>
                <Text variant="bodySmall">Questions</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.menuCard}>
        <Card.Content>
          <List.Item
            title="Settings"
            left={props => <List.Icon {...props} icon="settings" />}
            onPress={() => navigation.navigate('Settings')}
          />
          <Divider />
          <List.Item
            title="Referral Code"
            left={props => <List.Icon {...props} icon="share" />}
            onPress={async () => {
              try {
                const code = await userApi.getReferralCode();
                // Show referral code dialog
              } catch (error) {
                console.error('Failed to get referral code:', error);
              }
            }}
          />
          <Divider />
          <List.Item
            title="Logout"
            left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={handleLogout}
            titleStyle={{color: theme.colors.error}}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nerdxId: {
    opacity: 0.7,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
  },
});

export default ProfileScreen;

