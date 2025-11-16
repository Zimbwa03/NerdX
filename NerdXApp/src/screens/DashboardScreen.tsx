// Dashboard Screen Component
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { creditsApi } from '../services/api/creditsApi';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name}!</Text>
        <Text style={styles.nerdxId}>ID: {user?.nerdx_id}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user?.credits || 0}</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={navigateToSubjects}>
          <Text style={styles.menuButtonText}>📚 Start Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={navigateToCredits}>
          <Text style={styles.menuButtonText}>💰 Buy Credits</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={navigateToProgress}>
          <Text style={styles.menuButtonText}>📊 Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={navigateToProfile}>
          <Text style={styles.menuButtonText}>👤 Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={navigateToProjectAssistant}>
          <Text style={styles.menuButtonText}>🎓 Project Assistant</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  nerdxId: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statsContainer: {
    padding: 20,
  },
  statCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statLabel: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  menuContainer: {
    padding: 20,
  },
  menuButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#212121',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
