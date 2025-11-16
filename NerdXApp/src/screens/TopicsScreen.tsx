// Topics Screen Component
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
import { useRoute, useNavigation } from '@react-navigation/native';
import { quizApi, Topic, Subject } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';

const TopicsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { subject } = route.params as { subject: Subject };
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await quizApi.getTopics(subject.id);
      setTopics(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load topics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGraphPractice = () => {
    navigation.navigate('GraphPractice' as never);
  };

  const handleEnglishComprehension = () => {
    navigation.navigate('EnglishComprehension' as never);
  };

  const handleEnglishEssay = () => {
    navigation.navigate('EnglishEssay' as never);
  };

  const handleStartQuiz = async (topic?: Topic) => {
    try {
      if (!user || (user.credits || 0) < 1) {
        Alert.alert(
          'Insufficient Credits',
          'You need at least 1 credit to start a quiz. Please buy credits first.',
          [{ text: 'OK' }]
        );
        return;
      }

      Alert.alert(
        'Start Quiz',
        `Start ${topic ? topic.name : 'Exam'} quiz for ${subject.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start',
            onPress: async () => {
              try {
                const question = await quizApi.generateQuestion(
                  subject.id,
                  topic?.id,
                  'medium',
                  topic ? 'topical' : 'exam'
                );
                if (question) {
                  navigation.navigate('Quiz' as never, { question, subject, topic } as never);
                  // Update user credits
                  const newCredits = (user.credits || 0) - 1;
                  updateUser({ credits: newCredits });
                }
              } catch (error: any) {
                Alert.alert('Error', error.response?.data?.message || 'Failed to start quiz');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start quiz');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading topics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{subject.name}</Text>
        <Text style={styles.subtitle}>Choose a topic or start an exam</Text>
      </View>

      <View style={styles.topicsContainer}>
        {subject.id === 'mathematics' && (
          <TouchableOpacity
            style={[styles.examButton, { backgroundColor: '#2196F3' }]}
            onPress={handleGraphPractice}
          >
            <Text style={styles.examButtonText}>📊 Graph Practice</Text>
            <Text style={styles.examButtonSubtext}>Practice reading and analyzing graphs</Text>
          </TouchableOpacity>
        )}

        {subject.id === 'english' && (
          <>
            <TouchableOpacity
              style={[styles.examButton, { backgroundColor: '#FF9800' }]}
              onPress={handleEnglishComprehension}
            >
              <Text style={styles.examButtonText}>📖 Comprehension</Text>
              <Text style={styles.examButtonSubtext}>Reading comprehension practice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.examButton, { backgroundColor: '#FF9800' }]}
              onPress={handleEnglishEssay}
            >
              <Text style={styles.examButtonText}>✍️ Essay Writing</Text>
              <Text style={styles.examButtonSubtext}>Write and get your essay marked</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.examButton}
          onPress={() => handleStartQuiz()}
        >
          <Text style={styles.examButtonText}>📝 Start Exam Quiz</Text>
          <Text style={styles.examButtonSubtext}>Mixed questions from all topics</Text>
        </TouchableOpacity>

        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicCard}
            onPress={() => handleStartQuiz(topic)}
          >
            <Text style={styles.topicName}>{topic.name}</Text>
            <Text style={styles.topicArrow}>→</Text>
          </TouchableOpacity>
        ))}
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
  topicsContainer: {
    padding: 20,
  },
  examButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  examButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  examButtonSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  topicName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  topicArrow: {
    fontSize: 20,
    color: '#757575',
  },
});

export default TopicsScreen;
