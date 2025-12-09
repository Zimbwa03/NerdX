// Combined Science Exam Screen - Complete Exam Flow
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
import { quizApi, Question, AnswerResult } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { StatusBar } from 'react-native';

interface ExamQuestion extends Question {
  userAnswer?: string;
  isCorrect?: boolean;
  subject?: string; // Biology, Chemistry, or Physics
}

type ExamStep = 'select' | 'exam' | 'summary' | 'review';

const CombinedScienceExamScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { subject } = route.params as { subject: any };

  const [step, setStep] = useState<ExamStep>('select');
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: AnswerResult }>({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const questionCounts = [10, 20, 30, 40, 50];

  // Step 1: Select number of questions
  const handleSelectCount = (count: number) => {
    setSelectedCount(count);
  };

  const handleStartExam = async () => {
    if (!selectedCount) {
      Alert.alert('Error', 'Please select the number of questions');
      return;
    }

    if (!user || (user.credits || 0) < selectedCount) {
      Alert.alert(
        'Insufficient Credits',
        `You need at least ${selectedCount} credits to start this exam. Please buy credits first.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setGenerating(true);

      // Initialize question structure - we'll generate questions on-demand
      // Pre-plan the distribution across subjects
      const questionsPerSubject = Math.ceil(selectedCount / 3);
      const subjects = ['Biology', 'Chemistry', 'Physics'];
      const questionPlan: { subject: string; topicId?: string }[] = [];

      // Plan which subject each question should come from
      for (let i = 0; i < selectedCount; i++) {
        const subjectIndex = Math.floor(i / questionsPerSubject) % 3;
        questionPlan.push({ subject: subjects[subjectIndex] });
      }

      // Shuffle the plan for better distribution
      const shuffledPlan = questionPlan.sort(() => Math.random() - 0.5);

      // Initialize questions array with placeholders
      const initialQuestions: ExamQuestion[] = shuffledPlan.map((plan, index) => ({
        id: `placeholder-${index}`,
        question_text: 'Loading question...',
        question_type: 'multiple_choice',
        options: [],
        correct_answer: '',
        solution: '',
        points: 10,
        topic: '',
        difficulty: 'medium',
        subject: plan.subject,
      }));

      setQuestions(initialQuestions);
      setStep('exam');
      setCurrentQuestionIndex(0);
      setCurrentAnswer('');

      // Deduct credits upfront
      if (user) {
        const newCredits = (user.credits || 0) - selectedCount;
        updateUser({ credits: newCredits });
      }

      // Generate first question immediately
      await loadQuestion(0, shuffledPlan[0].subject);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to start exam');
    } finally {
      setGenerating(false);
    }
  };

  const loadQuestion = async (index: number, parentSubject: string) => {
    try {
      setLoadingQuestion(true);
      // Get topics for the subject
      const topics = await quizApi.getTopics('combined_science', parentSubject);
      if (topics.length === 0) {
        // Fallback to Biology if no topics found
        const bioTopics = await quizApi.getTopics('combined_science', 'Biology');
        if (bioTopics.length > 0) {
          const randomTopic = bioTopics[Math.floor(Math.random() * bioTopics.length)];
          const question = await quizApi.generateQuestion(
            'combined_science',
            randomTopic.id,
            'medium',
            'exam',
            'Biology'
          );
          if (question) {
            const updatedQuestions = [...questions];
            updatedQuestions[index] = { ...question, subject: 'Biology' };
            setQuestions(updatedQuestions);
          }
        }
        return;
      }

      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const question = await quizApi.generateQuestion(
        'combined_science',
        randomTopic.id,
        'medium',
        'exam',
        parentSubject
      );

      if (question) {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...question, subject: parentSubject };
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error('Error loading question:', error);
      Alert.alert('Error', 'Failed to load question. Please try again.');
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Step 2: Exam flow
  const handleAnswerSelect = (answer: string) => {
    setCurrentAnswer(answer);
  };

  const handleNextQuestion = async () => {
    // Save current answer
    setAnswers({ ...answers, [currentQuestionIndex]: currentAnswer });

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentAnswer(answers[nextIndex] || '');

      // Load next question if it's a placeholder
      const nextQuestion = questions[nextIndex];
      if (nextQuestion && nextQuestion.question_text === 'Loading question...' && nextQuestion.subject) {
        await loadQuestion(nextIndex, nextQuestion.subject);
      }
    } else {
      // Last question - submit all answers
      handleSubmitExam();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer(answers[currentQuestionIndex - 1] || '');
    }
  };

  const handleSubmitExam = async () => {
    // Save last answer
    const finalAnswers = { ...answers, [currentQuestionIndex]: currentAnswer };
    setAnswers(finalAnswers);

    try {
      setLoading(true);

      // Submit all answers and get results
      const examResults: { [key: number]: AnswerResult } = {};
      let correctCount = 0;
      const subjectBreakdown: { [key: string]: { correct: number; total: number } } = {
        Biology: { correct: 0, total: 0 },
        Chemistry: { correct: 0, total: 0 },
        Physics: { correct: 0, total: 0 },
      };

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = finalAnswers[i] || '';

        if (userAnswer) {
          const result = await quizApi.submitAnswer(
            question.id,
            userAnswer,
            undefined,
            'combined_science',
            question.correct_answer,
            question.solution,
            question.hint
          );

          if (result) {
            examResults[i] = result;
            question.isCorrect = result.correct;
            question.userAnswer = userAnswer;

            if (result.correct) {
              correctCount++;
              if (question.subject) {
                subjectBreakdown[question.subject].correct++;
              }
            }

            if (question.subject) {
              subjectBreakdown[question.subject].total++;
            }
          }
        } else {
          // No answer provided
          question.isCorrect = false;
          question.userAnswer = '';
          if (question.subject) {
            subjectBreakdown[question.subject].total++;
          }
        }
      }

      setResults(examResults);
      setStep('summary');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to submit exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = () => {
    setStep('review');
  };

  const handleBackToTopics = () => {
    navigation.goBack();
  };

  // Calculate score breakdown
  const getScoreBreakdown = () => {
    const breakdown: { [key: string]: { correct: number; total: number } } = {
      Biology: { correct: 0, total: 0 },
      Chemistry: { correct: 0, total: 0 },
      Physics: { correct: 0, total: 0 },
    };

    questions.forEach((q, index) => {
      if (q.subject && breakdown[q.subject]) {
        breakdown[q.subject].total++;
        if (q.isCorrect) {
          breakdown[q.subject].correct++;
        }
      }
    });

    return breakdown;
  };

  const getTotalScore = () => {
    const correct = questions.filter(q => q.isCorrect).length;
    return { correct, total: questions.length };
  };

  // Render Step 1: Select number of questions
  if (step === 'select') {
    return (
      <ScrollView style={[styles.container, { backgroundColor: themedColors.background.default }]} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <LinearGradient
          colors={themedColors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Combined Science Exam</Text>
              <Text style={styles.subtitle}>Select the number of questions</Text>
            </View>
            {Icons.science(32, '#FFFFFF')}
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <Card variant="elevated" style={[styles.infoCard, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.infoTitle, { color: themedColors.text.primary }]}>📝 Exam Information</Text>
            <Text style={[styles.infoText, { color: themedColors.text.secondary }]}>
              • Questions will be randomly selected from Biology, Chemistry, and Physics{'\n'}
              • Questions are evenly distributed across all three subjects{'\n'}
              • Each question costs 1 credit{'\n'}
              • You'll receive detailed feedback after completion
            </Text>
          </Card>

          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Select Number of Questions</Text>
          <View style={styles.countGrid}>
            {questionCounts.map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.countButton,
                  {
                    backgroundColor: themedColors.background.paper,
                    borderColor: themedColors.primary.main
                  },
                  selectedCount === count && { backgroundColor: themedColors.primary.main },
                ]}
                onPress={() => handleSelectCount(count)}
              >
                <Text
                  style={[
                    styles.countButtonText,
                    { color: themedColors.primary.main },
                    selectedCount === count && { color: '#FFF' },
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.creditsInfo, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.creditsText, { color: themedColors.text.primary }]}>
              Your Credits: {user?.credits || 0}
            </Text>
            {selectedCount && (
              <Text style={[styles.creditsText, { color: themedColors.text.primary }]}>
                Required: {selectedCount} credits
              </Text>
            )}
          </View>

          <Button
            title="Start Exam"
            variant="primary"
            size="large"
            fullWidth
            onPress={handleStartExam}
            disabled={!selectedCount || generating}
            loading={generating}
            icon="play-circle"
            iconPosition="left"
          />
        </View>
      </ScrollView>
    );
  }

  // Render Step 2: Exam questions
  if (step === 'exam') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <ScrollView style={[styles.container, { backgroundColor: themedColors.background.default }]} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <LinearGradient
          colors={themedColors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Combined Science Exam</Text>
              <Text style={styles.subtitle}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {loadingQuestion ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary.main} />
              <Text style={styles.loadingText}>Loading question...</Text>
            </View>
          ) : currentQuestion && currentQuestion.question_text !== 'Loading question...' ? (
            <>
              <Card variant="elevated" style={[styles.questionCard, { backgroundColor: themedColors.background.paper }]}>
                <View style={styles.questionHeader}>
                  <IconCircle
                    icon={Icons.info(24, themedColors.primary.main)}
                    size={40}
                    backgroundColor={isDarkMode ? 'rgba(255,255,255,0.1)' : Colors.iconBg.mathematics}
                  />
                  <View style={styles.questionHeaderText}>
                    <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Question</Text>
                    {currentQuestion.subject && (
                      <Text style={[styles.questionSubject, { color: themedColors.text.secondary }]}>{currentQuestion.subject}</Text>
                    )}
                  </View>
                </View>
                <Text style={[styles.questionText, { color: themedColors.text.primary }]}>{currentQuestion.question_text}</Text>
              </Card>

              <View style={styles.optionsContainer}>
                {currentQuestion.options?.map((option, index) => {
                  const optionLabel = String.fromCharCode(65 + index);
                  const isSelected = currentAnswer === option;

                  return (
                    <Card
                      key={index}
                      variant={isSelected ? 'outlined' : 'default'}
                      onPress={() => handleAnswerSelect(option)}
                      style={[
                        styles.optionCard,
                        { backgroundColor: themedColors.background.paper },
                        isSelected && { borderColor: themedColors.primary.main, backgroundColor: isDarkMode ? 'rgba(98, 0, 234, 0.1)' : Colors.iconBg.mathematics },
                      ]}
                    >
                      <View style={styles.optionContent}>
                        <View
                          style={[
                            styles.optionLabelCircle,
                            { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : Colors.iconBg.default },
                            isSelected && { backgroundColor: themedColors.primary.main },
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionLabelText,
                              { color: themedColors.text.primary },
                              isSelected && { color: '#FFF' },
                            ]}
                          >
                            {optionLabel}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.optionText,
                            { color: themedColors.text.primary },
                            isSelected && { color: themedColors.primary.dark },
                          ]}
                        >
                          {option}
                        </Text>
                      </View>
                    </Card>
                  );
                })}
              </View>

              <View style={styles.navigationButtons}>
                <Button
                  title="Previous"
                  variant="outline"
                  onPress={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  icon="arrow-back"
                  iconPosition="left"
                />
                <Button
                  title={currentQuestionIndex === questions.length - 1 ? 'Submit Exam' : 'Next'}
                  variant="primary"
                  onPress={handleNextQuestion}
                  disabled={!currentAnswer || loading}
                  loading={loading}
                  icon={currentQuestionIndex === questions.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
                  iconPosition="right"
                />
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary.main} />
              <Text style={styles.loadingText}>Preparing exam...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  // Render Step 3: Summary
  if (step === 'summary') {
    const score = getTotalScore();
    const breakdown = getScoreBreakdown();
    const percentage = Math.round((score.correct / score.total) * 100);

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.primary.main, Colors.primary.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Exam Complete!</Text>
              <Text style={styles.subtitle}>Review your results</Text>
            </View>
            {Icons.success(32, '#FFFFFF')}
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <Card variant="gradient" gradientColors={themedColors.gradients.success} style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Your Score</Text>
            <Text style={styles.scoreValue}>
              {score.correct}/{score.total}
            </Text>
            <Text style={styles.scorePercentage}>{percentage}%</Text>
          </Card>

          <Card variant="elevated" style={[styles.breakdownCard, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.breakdownTitle, { color: themedColors.text.primary }]}>Subject Breakdown</Text>
            {Object.entries(breakdown).map(([subject, stats]) => (
              <View key={subject} style={[styles.breakdownRow, { borderBottomColor: themedColors.border.light }]}>
                <Text style={[styles.breakdownSubject, { color: themedColors.text.primary }]}>{subject}</Text>
                <Text style={[styles.breakdownScore, { color: themedColors.text.primary }]}>
                  {stats.correct}/{stats.total}
                </Text>
                <Text style={[styles.breakdownPercentage, { color: themedColors.primary.main }]}>
                  {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
                </Text>
              </View>
            ))}
          </Card>

          <View style={styles.summaryButtons}>
            <Button
              title="View Detailed Review"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleViewReview}
              icon="document-text"
              iconPosition="left"
            />
            <Button
              title="Back to Topics"
              variant="outline"
              fullWidth
              onPress={handleBackToTopics}
              icon="arrow-back"
              iconPosition="left"
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  // Render Step 4: Detailed Review
  if (step === 'review') {
    const score = getTotalScore();

    return (
      <ScrollView style={[styles.container, { backgroundColor: themedColors.background.default }]} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <LinearGradient
          colors={themedColors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Detailed Review</Text>
              <Text style={styles.subtitle}>
                {score.correct}/{score.total} Correct
              </Text>
            </View>
            {Icons.info(32, '#FFFFFF')}
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {questions.map((question, index) => {
            const result = results[index];
            const isCorrect = question.isCorrect;
            const userAnswer = question.userAnswer || 'Not answered';

            return (
              <Card
                key={index}
                variant="elevated"
                style={[
                  styles.reviewCard,
                  { backgroundColor: themedColors.background.paper },
                  isCorrect
                    ? { borderColor: themedColors.success.main, backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : '#E8F5E9', borderWidth: 2 }
                    : { borderColor: themedColors.error.main, backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE', borderWidth: 2 },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewHeaderLeft}>
                    <Text style={[styles.reviewQuestionNumber, { color: themedColors.text.primary }]}>Question {index + 1}</Text>
                    {question.subject && (
                      <Text style={[styles.reviewSubject, { color: themedColors.text.secondary }]}>{question.subject}</Text>
                    )}
                  </View>
                  <View style={styles.reviewIcon}>
                    {isCorrect ? (
                      <IconCircle
                        icon={Icons.success(24, themedColors.success.main)}
                        size={40}
                        backgroundColor={isDarkMode ? 'rgba(76, 175, 80, 0.2)' : '#E8F5E9'}
                      />
                    ) : (
                      <IconCircle
                        icon={Icons.error(24, themedColors.error.main)}
                        size={40}
                        backgroundColor={isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFEBEE'}
                      />
                    )}
                  </View>
                </View>

                <Text style={[styles.reviewQuestionText, { color: themedColors.text.primary }]}>{question.question_text}</Text>

                <View style={[styles.reviewAnswerSection, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : Colors.background.default }]}>
                  <View style={styles.reviewAnswerRow}>
                    <Text style={[styles.reviewAnswerLabel, { color: themedColors.text.secondary }]}>Your Answer:</Text>
                    <Text
                      style={[
                        styles.reviewAnswerValue,
                        isCorrect ? { color: themedColors.success.main } : { color: themedColors.error.main },
                      ]}
                    >
                      {userAnswer}
                    </Text>
                  </View>
                  <View style={styles.reviewAnswerRow}>
                    <Text style={[styles.reviewAnswerLabel, { color: themedColors.text.secondary }]}>Correct Answer:</Text>
                    <Text style={[styles.reviewAnswerCorrect, { color: themedColors.success.main }]}>
                      {question.correct_answer}
                    </Text>
                  </View>
                </View>

                {result?.solution && (
                  <View style={styles.reviewExplanation}>
                    <Text style={[styles.reviewExplanationTitle, { color: themedColors.text.primary }]}>📚 Explanation:</Text>
                    <Text style={[styles.reviewExplanationText, { color: themedColors.text.secondary }]}>{result.solution}</Text>
                  </View>
                )}

                {question.explanation && (
                  <View style={styles.reviewExplanation}>
                    <Text style={[styles.reviewExplanationTitle, { color: themedColors.text.primary }]}>📖 Teaching Note:</Text>
                    <Text style={[styles.reviewExplanationText, { color: themedColors.text.secondary }]}>{question.explanation}</Text>
                  </View>
                )}
              </Card>
            );
          })}

          <View style={styles.reviewButtons}>
            <Button
              title="Back to Summary"
              variant="outline"
              fullWidth
              onPress={() => setStep('summary')}
              icon="arrow-back"
              iconPosition="left"
            />
            <Button
              title="Back to Topics"
              variant="primary"
              fullWidth
              onPress={handleBackToTopics}
              icon="home"
              iconPosition="left"
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.paper,
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
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.text.white,
    borderRadius: 3,
  },
  contentContainer: {
    padding: 20,
  },
  infoCard: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  countGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  countButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.background.default,
    borderWidth: 2,
    borderColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonSelected: {
    backgroundColor: Colors.primary.main,
  },
  countButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.main,
  },
  countButtonTextSelected: {
    color: Colors.text.white,
  },
  creditsInfo: {
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  creditsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  questionCard: {
    marginBottom: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  questionHeaderText: {
    flex: 1,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  questionSubject: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  questionText: {
    fontSize: 18,
    color: Colors.text.primary,
    lineHeight: 28,
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    marginBottom: 12,
  },
  optionCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary.main,
    backgroundColor: Colors.iconBg.mathematics,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 16,
  },
  optionLabelCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.iconBg.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelCircleSelected: {
    backgroundColor: Colors.primary.main,
  },
  optionLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  optionLabelTextSelected: {
    color: Colors.text.white,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  optionTextSelected: {
    color: Colors.primary.dark,
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  scoreCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.white,
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginBottom: 8,
  },
  scorePercentage: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.white,
    opacity: 0.9,
  },
  breakdownCard: {
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.default,
  },
  breakdownSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  breakdownScore: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 12,
  },
  breakdownPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.main,
    minWidth: 50,
    textAlign: 'right',
  },
  summaryButtons: {
    gap: 12,
  },
  reviewCard: {
    marginBottom: 20,
  },
  reviewCardCorrect: {
    borderWidth: 2,
    borderColor: Colors.success.main,
    backgroundColor: '#E8F5E9',
  },
  reviewCardWrong: {
    borderWidth: 2,
    borderColor: Colors.error.main,
    backgroundColor: '#FFEBEE',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  reviewQuestionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  reviewSubject: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  reviewIcon: {
    marginLeft: 12,
  },
  reviewQuestionText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: 16,
  },
  reviewAnswerSection: {
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewAnswerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAnswerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  reviewAnswerValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  reviewAnswerCorrect: {
    color: Colors.success.dark,
  },
  reviewAnswerWrong: {
    color: Colors.error.dark,
  },
  reviewExplanation: {
    marginTop: 12,
  },
  reviewExplanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  reviewExplanationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  reviewButtons: {
    gap: 12,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
  },
});

export default CombinedScienceExamScreen;

