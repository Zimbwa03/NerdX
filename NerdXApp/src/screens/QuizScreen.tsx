// Quiz Screen Component - Professional UI/UX Design
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { quizApi, Question, AnswerResult } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';

const QuizScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { question: initialQuestion } = route.params as { question: Question; subject: any; topic?: any };
  
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (!result) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      Alert.alert('Error', 'Please select an answer');
      return;
    }

    try {
      setLoading(true);
      const answerResult = await quizApi.submitAnswer(question.id, selectedAnswer);
      if (answerResult) {
        setResult(answerResult);
        if (answerResult.correct && user) {
          // Update user stats if needed
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const newQuestion = await quizApi.generateQuestion(
        route.params.subject.id,
        route.params.topic?.id,
        'medium',
        route.params.topic ? 'topical' : 'exam'
      );
      if (newQuestion) {
        setQuestion(newQuestion);
        setSelectedAnswer('');
        setResult(null);
        if (user) {
          const newCredits = (user.credits || 0) - 1;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load next question');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Professional Header */}
      <LinearGradient
        colors={[Colors.primary.main, Colors.primary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {Icons.quiz(28, '#FFFFFF')}
            <View style={styles.headerText}>
              <Text style={styles.title}>Quiz Question</Text>
              <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Question Card */}
      <View style={styles.contentContainer}>
        <Card variant="elevated" style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <IconCircle
              icon={Icons.info(24, Colors.primary.main)}
              size={40}
              backgroundColor={Colors.iconBg.mathematics}
            />
            <Text style={styles.questionLabel}>Question</Text>
          </View>
          <Text style={styles.questionText}>{question.question_text}</Text>
        </Card>

        {/* Options */}
        {question.options && question.options.length > 0 && (
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === option;
              const isCorrect = result?.correct && option === question.correct_answer;
              const isWrong = result && !result.correct && isSelected && option !== question.correct_answer;

              return (
                <Card
                  key={index}
                  variant={isSelected ? 'outlined' : 'default'}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={!!result}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    isCorrect && styles.optionCardCorrect,
                    isWrong && styles.optionCardWrong,
                  ]}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionLabelCircle,
                      isSelected && styles.optionLabelCircleSelected,
                      isCorrect && styles.optionLabelCircleCorrect,
                      isWrong && styles.optionLabelCircleWrong,
                    ]}>
                      <Text style={[
                        styles.optionLabelText,
                        isSelected && styles.optionLabelTextSelected,
                        isCorrect && styles.optionLabelTextCorrect,
                        isWrong && styles.optionLabelTextWrong,
                      ]}>
                        {optionLabel}
                      </Text>
                    </View>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                      isCorrect && styles.optionTextCorrect,
                      isWrong && styles.optionTextWrong,
                    ]}>
                      {option}
                    </Text>
                    {(isCorrect || isWrong) && (
                      <View style={styles.optionIcon}>
                        {isCorrect ? Icons.check(24, Colors.success.main) : Icons.close(24, Colors.error.main)}
                      </View>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* Result Card */}
        {result && (
          <Card
            variant="elevated"
            style={[
              styles.resultCard,
              result.correct ? styles.resultCardSuccess : styles.resultCardError,
            ]}
          >
            <View style={styles.resultHeader}>
              <IconCircle
                icon={result.correct ? Icons.success(28, Colors.success.main) : Icons.error(28, Colors.error.main)}
                size={48}
                backgroundColor={result.correct ? '#E8F5E9' : '#FFEBEE'}
              />
              <View style={styles.resultInfo}>
                <Text style={[
                  styles.resultText,
                  result.correct && styles.resultTextCorrect,
                  !result.correct && styles.resultTextError,
                ]}>
                  {result.correct ? 'Correct!' : 'Incorrect'}
                </Text>
                <Text style={styles.pointsText}>+{result.points_earned} Points</Text>
              </View>
            </View>
            <Text style={styles.feedbackText}>{result.feedback}</Text>
            {result.solution && (
              <View style={styles.solutionContainer}>
                <Text style={styles.solutionTitle}>Solution:</Text>
                <Text style={styles.solutionText}>{result.solution}</Text>
              </View>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!result ? (
            <Button
              title="Submit Answer"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleSubmit}
              disabled={!selectedAnswer || loading}
              loading={loading}
              icon="checkmark-circle"
              iconPosition="left"
            />
          ) : (
            <>
              <Button
                title="Next Question"
                variant="primary"
                size="large"
                fullWidth
                onPress={handleNext}
                disabled={loading}
                loading={loading}
                icon="arrow-forward"
                iconPosition="right"
                style={styles.nextButton}
              />
              <Button
                title="Back to Topics"
                variant="outline"
                fullWidth
                onPress={handleBack}
                icon="arrow-back"
                iconPosition="left"
              />
            </>
          )}
        </View>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  credits: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  questionContainer: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#212121',
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionButtonSelected: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  optionButtonCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionButtonWrong: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
  resultContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F44336',
  },
  resultTextCorrect: {
    color: '#4CAF50',
  },
  feedbackText: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 10,
  },
  solutionContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 5,
  },
  solutionText: {
    fontSize: 14,
    color: '#757575',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default QuizScreen;
