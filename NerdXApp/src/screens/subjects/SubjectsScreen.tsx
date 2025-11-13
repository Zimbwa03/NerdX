import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Card, ActivityIndicator} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {quizApi} from '../../services/api';
import {Subject} from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SubjectsScreen = ({navigation}: any) => {
  const {theme} = useTheme();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await quizApi.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      // Fallback to default subjects if API fails
      setSubjects([
        {id: 'mathematics', name: 'Mathematics', icon: 'calculate', color: '#2196F3'},
        {id: 'combined_science', name: 'Combined Science', icon: 'science', color: '#4CAF50'},
        {id: 'english', name: 'English', icon: 'menu-book', color: '#FF9800'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectPress = (subject: Subject) => {
    navigation.navigate('Topics', {subject: subject.id});
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Choose a Subject
      </Text>

      {subjects.map(subject => (
        <TouchableOpacity
          key={subject.id}
          onPress={() => handleSubjectPress(subject)}>
          <Card style={styles.subjectCard}>
            <Card.Content>
              <View style={styles.subjectContent}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: subject.color || theme.colors.primary},
                  ]}>
                  <Icon
                    name={subject.icon || 'book'}
                    size={32}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.subjectInfo}>
                  <Text variant="titleLarge" style={styles.subjectName}>
                    {subject.name}
                  </Text>
                  <Text variant="bodyMedium" style={styles.subjectDesc}>
                    Practice questions and exams
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color={theme.colors.text} />
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  subjectCard: {
    marginBottom: 16,
    elevation: 2,
  },
  subjectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subjectDesc: {
    opacity: 0.7,
  },
});

export default SubjectsScreen;

