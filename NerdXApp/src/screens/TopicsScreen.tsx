// Topics Screen Component - Professional UI/UX Design
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
import { useRoute, useNavigation } from '@react-navigation/native';
import { quizApi, Topic, Subject } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';

const TopicsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { subject, parentSubject } = route.params as { subject: Subject; parentSubject?: string };
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParentSubject, setCurrentParentSubject] = useState<string | undefined>(parentSubject);

  useEffect(() => {
    loadTopics();
  }, [currentParentSubject]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await quizApi.getTopics(subject.id, currentParentSubject);
      setTopics(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load topics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicPress = async (topic: Topic) => {
    // For Combined Science, if topic is a parent (Biology/Chemistry/Physics), show subtopics
    if (topic.is_parent && subject.id === 'combined_science') {
      setCurrentParentSubject(topic.name);
      // Update the navigation params to show we're in a submenu
      navigation.setParams({ parentSubject: topic.name } as never);
    } else {
      // Otherwise, start quiz with this topic
      handleStartQuiz(topic);
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
                  topic ? 'topical' : 'exam',
                  topic?.parent_subject || currentParentSubject
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Professional Header */}
      <LinearGradient
        colors={[subject.color || Colors.primary.main, Colors.primary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                if (currentParentSubject) {
                  setCurrentParentSubject(undefined);
                  navigation.setParams({ parentSubject: undefined } as never);
                } else {
                  navigation.goBack();
                }
              }}
              style={{ marginBottom: 8 }}
            >
              {currentParentSubject && (
                <Text style={styles.backButton}>← Back</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.title}>
              {currentParentSubject ? currentParentSubject : subject.name}
            </Text>
            <Text style={styles.subtitle}>
              {currentParentSubject
                ? 'Choose a subtopic to practice'
                : 'Choose a topic or start an exam'}
            </Text>
          </View>
          {getSubjectIcon(subject.id)}
        </View>
      </LinearGradient>

      {/* Special Features */}
      <View style={styles.featuresContainer}>
        {subject.id === 'mathematics' && (
          <Card variant="elevated" onPress={handleGraphPractice} style={styles.featureCard}>
            <View style={styles.featureContent}>
              <IconCircle
                icon={Icons.graph(28, Colors.subjects.mathematics)}
                size={56}
                backgroundColor={Colors.iconBg.mathematics}
              />
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Graph Practice</Text>
                <Text style={styles.featureSubtitle}>Practice reading and analyzing graphs</Text>
              </View>
              {Icons.arrowRight(24, Colors.text.secondary)}
            </View>
          </Card>
        )}

        {subject.id === 'english' && (
          <>
            <Card variant="elevated" onPress={handleEnglishComprehension} style={styles.featureCard}>
              <View style={styles.featureContent}>
                <IconCircle
                  icon={Icons.comprehension(28, Colors.subjects.english)}
                  size={56}
                  backgroundColor={Colors.iconBg.english}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Comprehension</Text>
                  <Text style={styles.featureSubtitle}>Reading comprehension practice</Text>
                </View>
                {Icons.arrowRight(24, Colors.text.secondary)}
              </View>
            </Card>
            <Card variant="elevated" onPress={handleEnglishEssay} style={styles.featureCard}>
              <View style={styles.featureContent}>
                <IconCircle
                  icon={Icons.essay(28, Colors.subjects.english)}
                  size={56}
                  backgroundColor={Colors.iconBg.english}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Essay Writing</Text>
                  <Text style={styles.featureSubtitle}>Write and get your essay marked</Text>
                </View>
                {Icons.arrowRight(24, Colors.text.secondary)}
              </View>
            </Card>
          </>
        )}

        {/* Exam Quiz Card - Only show at top level */}
        {!currentParentSubject && (
          <Card variant="gradient" gradientColors={[Colors.primary.main, Colors.primary.dark]} onPress={() => handleStartQuiz()} style={styles.examCard}>
            <View style={styles.examContent}>
              <IconCircle
                icon={Icons.quiz(32, '#FFFFFF')}
                size={64}
                backgroundColor="rgba(255, 255, 255, 0.2)"
              />
              <View style={styles.examInfo}>
                <Text style={styles.examTitle}>Start Exam Quiz</Text>
                <Text style={styles.examSubtitle}>Mixed questions from all topics</Text>
              </View>
            </View>
          </Card>
        )}
      </View>

      {/* Topics List */}
      <View style={styles.topicsContainer}>
        <Text style={styles.sectionTitle}>
          {currentParentSubject ? 'Subtopics' : 'Topics'}
        </Text>
        {topics.length === 0 && !loading && (
          <Text style={styles.noTopicsText}>No topics available</Text>
        )}
        {topics
          .filter((topic) => {
            if (subject.id === 'english' && topic.name === 'Comprehension Skills') {
              return false;
            }
            return true;
          })
          .map((topic) => (
            <Card
              key={topic.id}
              variant="elevated"
              onPress={() => handleTopicPress(topic)}
              style={styles.topicCard}
            >
              <View style={styles.topicContent}>
                <IconCircle
                  icon={getTopicIcon(topic, subject.id)}
                  size={40}
                  backgroundColor={getTopicIconBg(topic, subject.id)}
                />
                <View style={styles.topicInfo}>
                  <Text style={styles.topicName}>{topic.name}</Text>
                  {topic.is_parent && (
                    <Text style={styles.topicSubtitle}>Tap to view subtopics</Text>
                  )}
                </View>
                {Icons.arrowRight(24, Colors.text.secondary)}
              </View>
            </Card>
          ))}
      </View>
    </ScrollView>
  );
};

const getSubjectIcon = (subjectId: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    mathematics: Icons.mathematics(32, '#FFFFFF'),
    combined_science: Icons.science(32, '#FFFFFF'),
    english: Icons.english(32, '#FFFFFF'),
  };
  return iconMap[subjectId] || Icons.quiz(32, '#FFFFFF');
};

const getTopicIcon = (topic: Topic, subjectId: string): React.ReactNode => {
  if (subjectId === 'combined_science' && topic.is_parent) {
    // Different icons for Biology, Chemistry, Physics
    if (topic.name === 'Biology') {
      return Icons.science(24, '#4CAF50');
    } else if (topic.name === 'Chemistry') {
      return Icons.science(24, '#2196F3');
    } else if (topic.name === 'Physics') {
      return Icons.science(24, '#FF9800');
    }
  }
  if (subjectId === 'english') {
    if (topic.name.toLowerCase().includes('grammar')) {
      return Icons.grammar(24, Colors.primary.main);
    } else if (topic.name.toLowerCase().includes('vocabulary')) {
      return Icons.vocabulary(24, Colors.primary.main);
    }
  }
  return Icons.quiz(24, Colors.primary.main);
};

const getTopicIconBg = (topic: Topic, subjectId: string): string => {
  if (subjectId === 'combined_science' && topic.is_parent) {
    if (topic.name === 'Biology') {
      return '#E8F5E9';
    } else if (topic.name === 'Chemistry') {
      return '#E3F2FD';
    } else if (topic.name === 'Physics') {
      return '#FFF3E0';
    }
  }
  return Colors.iconBg.default;
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
  featuresContainer: {
    padding: 20,
    paddingTop: 10,
  },
  featureCard: {
    marginBottom: 12,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  examCard: {
    marginBottom: 20,
    marginTop: 8,
  },
  examContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  examInfo: {
    marginLeft: 20,
    flex: 1,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginBottom: 4,
  },
  examSubtitle: {
    fontSize: 14,
    color: Colors.text.white,
    opacity: 0.9,
  },
  topicsContainer: {
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
  topicCard: {
    marginBottom: 12,
  },
  topicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 16,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  topicSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  noTopicsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    fontSize: 16,
    color: Colors.text.white,
    opacity: 0.9,
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
});

export default TopicsScreen;
