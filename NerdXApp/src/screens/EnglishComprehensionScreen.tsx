// English Comprehension Screen Component
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { englishApi, ComprehensionData, GradingResult, SummaryGradingResult } from '../services/api/englishApi';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const EnglishComprehensionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [comprehension, setComprehension] = useState<ComprehensionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [summaryAnswer, setSummaryAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummaryGradingResult | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'summary'>('questions');

  const handleGenerate = async () => {
    if ((user?.credits || 0) < 3) {
      Alert.alert(
        'Insufficient Credits',
        'Comprehension requires 3 credits. Please buy credits first.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setSubmitted(false);
      setGradingResult(null);
      setSummaryResult(null);
      setAnswers({});
      setSummaryAnswer('');
      const data = await englishApi.generateComprehension();
      if (data) {
        setComprehension(data);
        // Update credits
        if (user) {
          const newCredits = (user.credits || 0) - 3;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate comprehension');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!comprehension) return;

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < comprehension.questions.length) {
      Alert.alert(
        'Incomplete',
        `Please answer all ${comprehension.questions.length} questions before submitting.`
      );
      return;
    }

    if (comprehension.summary_question && !summaryAnswer.trim()) {
      Alert.alert('Incomplete', 'Please write your summary before submitting.');
      return;
    }

    setLoading(true);
    try {
      // Grade questions
      const gradeResult = await englishApi.gradeComprehension(
        comprehension.passage,
        comprehension.questions,
        answers
      );
      setGradingResult(gradeResult);

      // Grade summary if exists
      if (comprehension.summary_question && summaryAnswer) {
        const sumResult = await englishApi.gradeSummary(
          comprehension.passage,
          comprehension.summary_question.question,
          summaryAnswer
        );
        setSummaryResult(sumResult);
      }

      setSubmitted(true);

      const totalScore = (gradeResult?.total_score || 0) + (summaryResult?.total_score || 0);
      const maxScore = (gradeResult?.total_possible || 0) + (summaryResult?.max_score || 0);
      const percentage = Math.round((totalScore / maxScore) * 100) || 0;

      Alert.alert(
        'Grading Complete',
        `You scored ${percentage}%!\n\nCheck the detailed feedback for each question.`,
        [{ text: 'View Feedback' }]
      );

    } catch (error: any) {
      Alert.alert('Error', 'Failed to grade answers. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/english_background.png')}
      style={styles.container}
      resizeMode="cover"
      onError={(error) => {
        console.warn('Failed to load background image:', error.nativeEvent.error);
      }}
    >
      <LinearGradient
        colors={[Colors.gradients.primary[0], 'rgba(255,255,255,0.8)']}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comprehension</Text>
          <View style={styles.creditContainer}>
            <Ionicons name="wallet-outline" size={16} color="#FFF" />
            <Text style={styles.creditText}>{user?.credits || 0}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!comprehension && (
            <View style={styles.welcomeCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.glassCard}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="book-outline" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.welcomeTitle}>Master Comprehension</Text>
                <Text style={styles.welcomeText}>
                  Practice with AI-generated passages tailored to the ZIMSEC syllabus.
                  Improve your reading and analytical skills.
                </Text>

                <TouchableOpacity
                  style={[styles.generateButton, loading && styles.generateButtonDisabled]}
                  onPress={handleGenerate}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#BDBDBD', '#9E9E9E'] : Colors.gradients.primary}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.generateButtonText}>Start Practice</Text>
                        <Text style={styles.costText}>(3 Credits)</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {comprehension && (
            <View style={styles.contentContainer}>
              <View style={styles.passageCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                  style={styles.glassCard}
                >
                  <Text style={styles.passageTitle}>Reading Passage</Text>
                  <Text style={styles.passage}>{comprehension.passage}</Text>
                </LinearGradient>
              </View>

              {/* Tabs */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
                  onPress={() => setActiveTab('questions')}
                >
                  <Text style={[styles.tabText, activeTab === 'questions' && styles.activeTabText]}>Questions</Text>
                </TouchableOpacity>
                {comprehension.summary_question && (
                  <TouchableOpacity
                    style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
                    onPress={() => setActiveTab('summary')}
                  >
                    <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>Summary</Text>
                  </TouchableOpacity>
                )}
              </View>

              {activeTab === 'questions' ? (
                <>
                  <Text style={styles.sectionTitle}>Comprehension Questions</Text>
                  {comprehension.questions.map((question, index) => {
                    const grade = gradingResult?.question_grades.find(g => g.question_index === index);
                    return (
                      <View key={index} style={styles.questionCard}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                          style={styles.glassCard}
                        >
                          <View style={styles.questionHeader}>
                            <Text style={styles.questionNumber}>Q{index + 1}</Text>
                            <View style={styles.marksContainer}>
                              <Text style={styles.questionMarks}>{question.marks} marks</Text>
                              {submitted && grade && (
                                <Text style={[styles.awardedMarks, { color: grade.marks_awarded === grade.max_marks ? Colors.success : Colors.warning }]}>
                                  {grade.marks_awarded}/{grade.max_marks}
                                </Text>
                              )}
                            </View>
                          </View>
                          <Text style={styles.questionText}>{question.question}</Text>
                          <TextInput
                            style={[styles.answerInput, submitted && grade && { borderColor: grade.marks_awarded > 0 ? Colors.success : Colors.error, borderWidth: 2 }]}
                            value={answers[index] || ''}
                            onChangeText={(text) => setAnswers({ ...answers, [index]: text })}
                            placeholder="Type your answer here..."
                            placeholderTextColor="#9E9E9E"
                            multiline
                            editable={!submitted}
                          />
                          {submitted && grade && (
                            <View style={styles.feedbackContainer}>
                              <Text style={styles.feedbackLabel}>AI Feedback:</Text>
                              <Text style={styles.feedbackText}>{grade.feedback}</Text>
                              <Text style={[styles.feedbackLabel, { marginTop: 10 }]}>Correct Answer:</Text>
                              <Text style={styles.feedbackText}>{question.answer}</Text>
                            </View>
                          )}
                        </LinearGradient>
                      </View>
                    );
                  })}
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Summary Writing</Text>
                  {comprehension.summary_question && (
                    <View style={styles.questionCard}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                        style={styles.glassCard}
                      >
                        <View style={styles.questionHeader}>
                          <Text style={styles.questionNumber}>Summary Question</Text>
                          <Text style={styles.questionMarks}>{comprehension.summary_question.marks} marks</Text>
                        </View>
                        <Text style={styles.questionText}>{comprehension.summary_question.question}</Text>
                        <Text style={styles.limitText}>Max words: {comprehension.summary_question.max_words}</Text>

                        <TextInput
                          style={styles.summaryInput}
                          value={summaryAnswer}
                          onChangeText={setSummaryAnswer}
                          placeholder="Write your summary here..."
                          placeholderTextColor="#9E9E9E"
                          multiline
                          editable={!submitted}
                        />
                        <Text style={styles.wordCount}>
                          Word count: {summaryAnswer.trim().split(/\s+/).filter(w => w.length > 0).length}
                        </Text>

                        {submitted && summaryResult && (
                          <View style={styles.feedbackContainer}>
                            <Text style={styles.feedbackLabel}>Summary Feedback:</Text>
                            <Text style={styles.feedbackText}>{summaryResult.feedback}</Text>

                            <View style={styles.scoreRow}>
                              <Text style={styles.scoreItem}>Content: {summaryResult.content_points}/10</Text>
                              <Text style={styles.scoreItem}>Language: {summaryResult.language_mark}/10</Text>
                            </View>

                            {summaryResult.key_points_missed && summaryResult.key_points_missed.length > 0 && (
                              <>
                                <Text style={[styles.feedbackLabel, { marginTop: 10 }]}>Missed Points:</Text>
                                {summaryResult.key_points_missed.map((point, i) => (
                                  <Text key={i} style={styles.bulletPoint}>• {point}</Text>
                                ))}
                              </>
                            )}
                          </View>
                        )}
                      </LinearGradient>
                    </View>
                  )}
                </>
              )}

              {!submitted && (
                <TouchableOpacity
                  style={[styles.actionButton, loading && styles.generateButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#BDBDBD', '#9E9E9E'] : Colors.gradients.success}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.actionButtonText}>Submit All Answers</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {submitted && gradingResult && (
                <View style={styles.resultCard}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                    style={styles.glassCard}
                  >
                    <Text style={styles.resultTitle}>Practice Complete!</Text>
                    <View style={styles.scoreCircle}>
                      <Text style={styles.scoreValue}>
                        {Math.round(((gradingResult.total_score + (summaryResult?.total_score || 0)) /
                          (gradingResult.total_possible + (summaryResult?.max_score || 0))) * 100)}%
                      </Text>
                      <Text style={styles.scoreLabel}>Total Score</Text>
                    </View>
                    <Text style={styles.overallFeedback}>{gradingResult.overall_feedback}</Text>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setComprehension(null);
                        setAnswers({});
                        setSummaryAnswer('');
                        setSubmitted(false);
                        setGradingResult(null);
                        setSummaryResult(null);
                        setActiveTab('questions');
                      }}
                    >
                      <LinearGradient
                        colors={Colors.gradients.primary}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.actionButtonText}>New Practice</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  creditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  creditText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  welcomeCard: {
    margin: 20,
    marginTop: 40,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  glassCard: {
    padding: 20,
    borderRadius: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  generateButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  costText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  contentContainer: {
    padding: 20,
  },
  passageCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 10,
  },
  passage: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 26,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 15,
    marginLeft: 5,
  },
  questionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  questionMarks: {
    fontSize: 12,
    color: Colors.text.secondary,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 15,
    lineHeight: 22,
  },
  answerInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  feedbackContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    borderWidth: 4,
    borderColor: Colors.success,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.success,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  awardedMarks: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  limitText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  summaryInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 200,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  wordCount: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 5,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  scoreItem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  bulletPoint: {
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 10,
    marginBottom: 4,
  },
  overallFeedback: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
});

export default EnglishComprehensionScreen;
