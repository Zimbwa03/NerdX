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
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { quizApi, Topic, Subject } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const TopicsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { subject, parentSubject } = route.params as { subject: Subject; parentSubject?: string };

  // State for Combined Science Tabs
  const [activeTab, setActiveTab] = useState<string>(parentSubject || (subject.id === 'combined_science' ? 'Biology' : ''));
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParentSubject, setCurrentParentSubject] = useState<string | undefined>(parentSubject);
  const [pharmaModalVisible, setPharmaModalVisible] = useState(false);
  const [selectedPharmaTopic, setSelectedPharmaTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (subject.id === 'combined_science') {
      // For Combined Science, load topics based on the active tab
      loadTopics(activeTab);
    } else {
      // For other subjects, load normally
      loadTopics(currentParentSubject);
    }
  }, [currentParentSubject, activeTab, subject.id]);

  const loadTopics = async (parent?: string) => {
    try {
      setLoading(true);
      // If it's Combined Science, we always want to fetch topics for the specific sub-subject (Biology/Chemistry/Physics)
      const targetParent = subject.id === 'combined_science' ? parent : currentParentSubject;

      const data = await quizApi.getTopics(subject.id, targetParent);

      // Fallback for Mathematics if API returns empty
      if (subject.id === 'mathematics' && (!data || data.length === 0)) {
        const mathTopics: Topic[] = [
          { id: 'num', name: 'Number Theory', subject: 'mathematics' },
          { id: 'sets', name: 'Sets', subject: 'mathematics' },
          { id: 'ind', name: 'Indices & Standard Form', subject: 'mathematics' },
          { id: 'alg', name: 'Algebra', subject: 'mathematics' },
          { id: 'ineq', name: 'Inequalities', subject: 'mathematics' },
          { id: 'seq', name: 'Sequences & Series', subject: 'mathematics' },
          { id: 'mat', name: 'Matrices', subject: 'mathematics' },
          { id: 'vec', name: 'Vectors', subject: 'mathematics' },
          { id: 'geo', name: 'Geometry', subject: 'mathematics' },
          { id: 'mens', name: 'Mensuration', subject: 'mathematics' },
          { id: 'trig', name: 'Trigonometry', subject: 'mathematics' },
          { id: 'trans', name: 'Transformation Geometry', subject: 'mathematics' },
          { id: 'stat', name: 'Statistics', subject: 'mathematics' },
          { id: 'prob', name: 'Probability', subject: 'mathematics' },
          { id: 'graph', name: 'Graphs', subject: 'mathematics' },
          { id: 'var', name: 'Variation', subject: 'mathematics' },
          { id: 'loci', name: 'Loci & Construction', subject: 'mathematics' },
        ];
        setTopics(mathTopics);
      } else {
        setTopics(data);
      }
    } catch (error) {
      // Fallback for Mathematics on error
      if (subject.id === 'mathematics') {
        const mathTopics: Topic[] = [
          { id: 'num', name: 'Number Theory', subject: 'mathematics' },
          { id: 'sets', name: 'Sets', subject: 'mathematics' },
          { id: 'ind', name: 'Indices & Standard Form', subject: 'mathematics' },
          { id: 'alg', name: 'Algebra', subject: 'mathematics' },
          { id: 'ineq', name: 'Inequalities', subject: 'mathematics' },
          { id: 'seq', name: 'Sequences & Series', subject: 'mathematics' },
          { id: 'mat', name: 'Matrices', subject: 'mathematics' },
          { id: 'vec', name: 'Vectors', subject: 'mathematics' },
          { id: 'geo', name: 'Geometry', subject: 'mathematics' },
          { id: 'mens', name: 'Mensuration', subject: 'mathematics' },
          { id: 'trig', name: 'Trigonometry', subject: 'mathematics' },
          { id: 'trans', name: 'Transformation Geometry', subject: 'mathematics' },
          { id: 'stat', name: 'Statistics', subject: 'mathematics' },
          { id: 'prob', name: 'Probability', subject: 'mathematics' },
          { id: 'graph', name: 'Graphs', subject: 'mathematics' },
          { id: 'var', name: 'Variation', subject: 'mathematics' },
          { id: 'loci', name: 'Loci & Construction', subject: 'mathematics' },
        ];
        setTopics(mathTopics);
      } else {
        Alert.alert('Error', 'Failed to load topics. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTopicPress = async (topic: Topic) => {
    // For Combined Science, if topic is a parent (Biology/Chemistry/Physics), show subtopics
    // BUT with tabs, we are already "inside" a parent. 
    // So we likely just start the quiz or go deeper if there are more levels.
    // Assuming 2 levels: Subject -> [Bio/Chem/Phys] -> Topics

    if (topic.is_parent && subject.id !== 'combined_science') {
      // Standard nested behavior for non-combined subjects
      setCurrentParentSubject(topic.name);
      navigation.setParams({ parentSubject: topic.name } as never);
    } else if (subject.id === 'pharmacology') {
      // Show Pharmacology Question Type Modal
      setSelectedPharmaTopic(topic);
      setPharmaModalVisible(true);
    } else {
      // Start quiz
      handleStartQuiz(topic);
    }
  };

  const handlePharmaQuizStart = (type: 'MCQ' | 'True/False') => {
    setPharmaModalVisible(false);
    if (selectedPharmaTopic) {
      handleStartQuiz(selectedPharmaTopic, type);
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

  const handleVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const handleStartQuiz = async (topic?: Topic, questionType?: string) => {
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
                  'medium',
                  topic ? 'topical' : 'exam',
                  topic?.parent_subject || (subject.id === 'combined_science' ? activeTab : currentParentSubject),
                  questionType // Pass question type (e.g., for Pharmacology)
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

  // Determine gradient colors based on subject
  const getHeaderGradient = () => {
    if (subject.id === 'mathematics') return [Colors.subjects.mathematics, Colors.primary.dark];
    if (subject.id === 'combined_science') {
      if (activeTab === 'Biology') return [Colors.subjects.science, Colors.secondary.dark];
      if (activeTab === 'Chemistry') return [Colors.subjects.combinedScience, Colors.primary.dark];
      if (activeTab === 'Physics') return [Colors.subjects.mathematics, Colors.primary.darker];
      return [Colors.subjects.science, Colors.secondary.dark];
    }
    if (subject.id === 'english') return [Colors.subjects.english, Colors.warning.dark];
    return Colors.gradients.primary;
  };

  const renderTabs = () => {
    if (subject.id !== 'combined_science') return null;

    const tabs = ['Biology', 'Chemistry', 'Physics'];

    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          let activeColor = Colors.subjects.science;
          if (tab === 'Chemistry') activeColor = Colors.subjects.combinedScience;
          if (tab === 'Physics') activeColor = Colors.subjects.mathematics;

          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                isActive && { backgroundColor: activeColor, borderColor: activeColor }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                isActive && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.default} />

      {/* Professional Header */}
      <LinearGradient
        colors={getHeaderGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                if (currentParentSubject && subject.id !== 'combined_science') {
                  setCurrentParentSubject(undefined);
                  navigation.setParams({ parentSubject: undefined } as never);
                } else {
                  navigation.goBack();
                }
              }}
              style={{ marginBottom: 8 }}
            >
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {subject.id === 'combined_science' ? activeTab : (currentParentSubject || subject.name)}
            </Text>
            <Text style={styles.subtitle}>
              {subject.id === 'combined_science'
                ? `Master ${activeTab} concepts`
                : (currentParentSubject ? 'Choose a subtopic' : 'Choose a topic or start an exam')}
            </Text>
          </View>
          {getSubjectIcon(subject.id)}
        </View>
      </LinearGradient>

      {/* Tabs for Combined Science */}
      {renderTabs()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

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

          {/* Virtual Lab for Science */}
          {subject.id === 'combined_science' && (
            <Card variant="elevated" onPress={handleVirtualLab} style={styles.featureCard}>
              <View style={styles.featureContent}>
                <IconCircle
                  icon={Icons.science(28, Colors.subjects.combinedScience)}
                  size={56}
                  backgroundColor={Colors.iconBg.science}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Virtual Labs</Text>
                  <Text style={styles.featureSubtitle}>Interactive experiments for {activeTab}</Text>
                </View>
                {Icons.arrowRight(24, Colors.text.secondary)}
              </View>
            </Card>
          )}

          {/* Exam Quiz Card - Only show at top level or for Combined Science tabs */}
          {(!currentParentSubject || subject.id === 'combined_science') && (
            <Card
              variant="gradient"
              gradientColors={getHeaderGradient()}
              onPress={() => {
                if (subject.id === 'combined_science') {
                  // For combined science, maybe we want a subject specific exam?
                  // Or just the general one. Let's keep general for now, or pass the activeTab
                  handleStartQuiz(); // This will use activeTab as parent_subject
                } else {
                  handleStartQuiz();
                }
              }}
              style={styles.examCard}
            >
              <View style={styles.examContent}>
                <IconCircle
                  icon={Icons.quiz(32, '#FFFFFF')}
                  size={64}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                />
                <View style={styles.examInfo}>
                  <Text style={styles.examTitle}>Start {subject.id === 'combined_science' ? activeTab : ''} Exam</Text>
                  <Text style={styles.examSubtitle}>Mixed questions from all {subject.id === 'combined_science' ? activeTab : ''} topics</Text>
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

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary.main} />
            </View>
          ) : (
            <>
              {topics.length === 0 && (
                <Text style={styles.noTopicsText}>No topics available for {activeTab}</Text>
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
                        {topic.is_parent && subject.id !== 'combined_science' && (
                          <Text style={styles.topicSubtitle}>Tap to view subtopics</Text>
                        )}
                      </View>
                      {Icons.arrowRight(24, Colors.text.secondary)}
                      <Text style={styles.modalDescription}>Choose how you want to practice {selectedPharmaTopic?.name}:</Text>
                      <ModalOptionCard
                        icon="📝"
                        title="Multiple Choice"
                        description="Standard 4-option questions"
                        onPress={() => handlePharmaQuizStart('MCQ')}
                        color={Colors.primary.main}
                      />
                      <ModalOptionCard
                        icon="✅"
                        title="True / False"
                        description="Quick concept verification"
                        onPress={() => handlePharmaQuizStart('True/False')}
                        color={Colors.secondary.main}
                      />
                    </Modal>
                  </View >
                );
};

const getSubjectIcon = (subjectId: string): React.ReactNode => {
  const iconMap: {[key: string]: React.ReactNode } = {
                mathematics: Icons.mathematics(32, '#FFFFFF'),
              combined_science: Icons.science(32, '#FFFFFF'),
              english: Icons.english(32, '#FFFFFF'),
  };
              return iconMap[subjectId] || Icons.quiz(32, '#FFFFFF');
};

const getTopicIcon = (topic: Topic, subjectId: string): React.ReactNode => {
  if (subjectId === 'combined_science') {
    // We can use generic science icon or specific if available
    return Icons.science(24, Colors.subjects.science);
  }
              if (subjectId === 'english') {
    if (topic.name.toLowerCase().includes('grammar')) {
      return Icons.grammar(24, Colors.subjects.english);
    } else if (topic.name.toLowerCase().includes('vocabulary')) {
      return Icons.vocabulary(24, Colors.subjects.english);
    }
  }
              return Icons.quiz(24, Colors.primary.main);
};

const getTopicIconBg = (topic: Topic, subjectId: string): string => {
  if (subjectId === 'combined_science') {
    return Colors.iconBg.science;
  }
              return Colors.iconBg.default;
};

              const styles = StyleSheet.create({
                container: {
                flex: 1,
              backgroundColor: Colors.background.default,
  },
              scrollView: {
                flex: 1,
  },
              centerContainer: {
                padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
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
              shadowColor: Colors.primary.dark,
              shadowOffset: {width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
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
              tabContainer: {
                flexDirection: 'row',
              paddingHorizontal: 20,
              paddingVertical: 15,
              gap: 10,
  },
              tab: {
                flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.border.medium,
              backgroundColor: Colors.background.paper,
              alignItems: 'center',
              justifyContent: 'center',
  },
              tabText: {
                fontSize: 14,
              fontWeight: '600',
              color: Colors.text.secondary,
  },
              activeTabText: {
                color: Colors.text.white,
              fontWeight: 'bold',
  },
              featuresContainer: {
                padding: 20,
              paddingTop: 10,
  },
              featureCard: {
                marginBottom: 12,
              backgroundColor: Colors.background.paper,
              borderColor: Colors.border.light,
              borderWidth: 1,
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
              backgroundColor: Colors.background.paper,
              borderColor: Colors.border.light,
              borderWidth: 1,
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
});

              export default TopicsScreen;
