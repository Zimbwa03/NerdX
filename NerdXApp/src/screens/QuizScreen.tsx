// Quiz Screen Component
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
import { useRoute, useNavigation } from '@react-navigation/native';
import { quizApi, Question, AnswerResult } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz Question</Text>
        <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question_text}</Text>

        {question.options && question.options.length > 0 && (
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === option;
              const isCorrect = result?.correct && option === question.correct_answer;
              const isWrong = result && !result.correct && isSelected && option !== question.correct_answer;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    isCorrect && styles.optionButtonCorrect,
                    isWrong && styles.optionButtonWrong,
                  ]}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={!!result}
                >
                  <Text style={styles.optionLabel}>{optionLabel}.</Text>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, result.correct && styles.resultTextCorrect]}>
              {result.correct ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
            <Text style={styles.feedbackText}>{result.feedback}</Text>
            {result.solution && (
              <View style={styles.solutionContainer}>
                <Text style={styles.solutionTitle}>Solution:</Text>
                <Text style={styles.solutionText}>{result.solution}</Text>
              </View>
            )}
            <Text style={styles.pointsText}>Points earned: {result.points_earned}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {!result ? (
            <TouchableOpacity
              style={[styles.submitButton, !selectedAnswer && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!selectedAnswer || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Submit Answer</Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Next Question</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>Back to Topics</Text>
              </TouchableOpacity>
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
