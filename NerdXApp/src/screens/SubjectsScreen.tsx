// Subjects Screen Component - Professional UI/UX Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { quizApi, Subject } from '../services/api/quizApi';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';

const SubjectsScreen: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await quizApi.getSubjects();
      setSubjects(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectPress = (subject: Subject) => {
    if (subject.id === 'combined_science') {
      // Show options: Teacher Mode or Practice Mode
      Alert.alert(
        'Combined Science',
        'Choose your learning mode:',
        [
          {
            text: '👨‍🏫 Teacher Mode',
            onPress: () => navigation.navigate('TeacherModeSetup' as never, { subject } as never),
          },
          {
            text: '📝 Practice Mode',
            onPress: () => navigation.navigate('Topics' as never, { subject } as never),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      navigation.navigate('Topics' as never, { subject } as never);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading subjects...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Professional Header */}
      <LinearGradient
        colors={['#1976D2', '#1565C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Choose a Subject</Text>
            <Text style={styles.subtitle}>Select a subject to start practicing</Text>
          </View>
          {Icons.quiz(32, '#FFFFFF')}
        </View>
      </LinearGradient>

      {/* Professional Subject Cards */}
      <View style={styles.subjectsContainer}>
        {subjects.map((subject) => {
          const subjectIcon = getSubjectIcon(subject.icon);
          return (
            <Card
              key={subject.id}
              variant="elevated"
              onPress={() => handleSubjectPress(subject)}
              style={[styles.subjectCard, { borderLeftColor: subject.color }]}
            >
              <View style={styles.subjectContent}>
                <IconCircle
                  icon={subjectIcon}
                  size={64}
                  backgroundColor={getSubjectIconBg(subject.id)}
                />
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectDescription}>
                    Practice questions and improve your skills
                  </Text>
                </View>
                {Icons.arrowRight(24, '#757575')}
              </View>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};

const getSubjectIcon = (icon: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    calculate: Icons.mathematics(32, '#2196F3'),
    science: Icons.science(32, '#4CAF50'),
    'menu-book': Icons.english(32, '#FF9800'),
  };
  return iconMap[icon] || Icons.quiz(32, '#1976D2');
};

const getSubjectIconBg = (subjectId: string): string => {
  const bgMap: { [key: string]: string } = {
    mathematics: '#E3F2FD',
    combined_science: '#E8F5E9',
    english: '#FFF3E0',
  };
  return bgMap[subjectId] || '#F5F5F5';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
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
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  subjectsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  subjectCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  subjectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  subjectInfo: {
    flex: 1,
    marginLeft: 16,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 6,
  },
  subjectDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});

export default SubjectsScreen;
