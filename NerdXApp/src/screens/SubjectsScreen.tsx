// Subjects Screen Component
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
import { useNavigation } from '@react-navigation/native';
import { quizApi, Subject } from '../services/api/quizApi';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Subject</Text>
        <Text style={styles.subtitle}>Select a subject to start practicing</Text>
      </View>

      <View style={styles.subjectsContainer}>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={[styles.subjectCard, { borderLeftColor: subject.color }]}
            onPress={() => handleSubjectPress(subject)}
          >
            <View style={styles.subjectContent}>
              <Text style={styles.subjectIcon}>{getSubjectIcon(subject.icon)}</Text>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectDescription}>
                  Practice questions and improve your skills
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const getSubjectIcon = (icon: string): string => {
  const icons: { [key: string]: string } = {
    calculate: '🔢',
    science: '🔬',
    'menu-book': '📚',
  };
  return icons[icon] || '📖';
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
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  subjectsContainer: {
    padding: 20,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderLeftWidth: 4,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subjectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  subjectIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 5,
  },
  subjectDescription: {
    fontSize: 14,
    color: '#757575',
  },
  arrow: {
    fontSize: 20,
    color: '#757575',
  },
});

export default SubjectsScreen;
