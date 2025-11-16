// Dashboard Screen Component - Professional UI/UX Design
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { creditsApi } from '../services/api/creditsApi';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';

const { width } = Dimensions.get('window');

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Professional Header with Gradient */}
      <LinearGradient
        colors={['#1976D2', '#1565C0', '#0D47A1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}!</Text>
            <Text style={styles.nerdxId}>ID: {user?.nerdx_id || 'N/A'}</Text>
          </View>
          <IconCircle
            icon={Icons.profile(32, '#FFFFFF')}
            size={56}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
        </View>
      </LinearGradient>

      {/* Credits Card with Professional Design */}
      <View style={styles.statsContainer}>
        <Card variant="gradient" gradientColors={['#4CAF50', '#388E3C']} style={styles.creditsCard}>
          <View style={styles.creditsContent}>
            <IconCircle
              icon={Icons.credits(32, '#FFFFFF')}
              size={64}
              backgroundColor="rgba(255, 255, 255, 0.2)"
            />
            <View style={styles.creditsInfo}>
              <Text style={styles.creditsLabel}>Available Credits</Text>
              <Text style={styles.creditsAmount}>{user?.credits || 0}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Professional Menu Grid */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <Card variant="elevated" onPress={navigateToSubjects} style={styles.menuCard}>
          <View style={styles.menuCardContent}>
            <IconCircle
              icon={Icons.quiz(28, '#1976D2')}
              size={56}
              backgroundColor="#E3F2FD"
            />
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardTitle}>Start Quiz</Text>
              <Text style={styles.menuCardSubtitle}>Practice with questions</Text>
            </View>
            {Icons.arrowRight(24, '#757575')}
          </View>
        </Card>

        <Card variant="elevated" onPress={navigateToCredits} style={styles.menuCard}>
          <View style={styles.menuCardContent}>
            <IconCircle
              icon={Icons.credits(28, '#4CAF50')}
              size={56}
              backgroundColor="#E8F5E9"
            />
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardTitle}>Buy Credits</Text>
              <Text style={styles.menuCardSubtitle}>Top up your account</Text>
            </View>
            {Icons.arrowRight(24, '#757575')}
          </View>
        </Card>

        <Card variant="elevated" onPress={navigateToProgress} style={styles.menuCard}>
          <View style={styles.menuCardContent}>
            <IconCircle
              icon={Icons.progress(28, '#FF9800')}
              size={56}
              backgroundColor="#FFF3E0"
            />
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardTitle}>Progress</Text>
              <Text style={styles.menuCardSubtitle}>Track your performance</Text>
            </View>
            {Icons.arrowRight(24, '#757575')}
          </View>
        </Card>

        <Card variant="elevated" onPress={navigateToProfile} style={styles.menuCard}>
          <View style={styles.menuCardContent}>
            <IconCircle
              icon={Icons.profile(28, '#9C27B0')}
              size={56}
              backgroundColor="#F3E5F5"
            />
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardTitle}>Profile</Text>
              <Text style={styles.menuCardSubtitle}>Manage your account</Text>
            </View>
            {Icons.arrowRight(24, '#757575')}
          </View>
        </Card>

        <Card variant="elevated" onPress={navigateToProjectAssistant} style={styles.menuCard}>
          <View style={styles.menuCardContent}>
            <IconCircle
              icon={Icons.projectAssistant(28, '#9C27B0')}
              size={56}
              backgroundColor="#F3E5F5"
            />
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardTitle}>Project Assistant</Text>
              <Text style={styles.menuCardSubtitle}>Get help with projects</Text>
            </View>
            {Icons.arrowRight(24, '#757575')}
          </View>
        </Card>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutContent}>
            {Icons.logout(20, '#FFFFFF')}
            <Text style={styles.logoutButtonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  nerdxId: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.85,
    fontFamily: 'monospace',
  },
  statsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  creditsCard: {
    marginTop: -30,
  },
  creditsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  creditsInfo: {
    marginLeft: 20,
    flex: 1,
  },
  creditsLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  creditsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    marginLeft: 4,
  },
  menuCard: {
    marginBottom: 12,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  menuCardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  menuCardSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
