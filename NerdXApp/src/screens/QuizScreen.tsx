// Quiz Screen Component - Professional UI/UX Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { quizApi, Question, AnswerResult } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';

const QuizScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { question: initialQuestion, subject, topic, isExamMode, year, paper } = route.params as {
    question?: Question;
    subject: any;
    topic?: any;
    isExamMode?: boolean;
    year?: string;
    paper?: string;
  };

  const [question, setQuestion] = useState<Question | undefined>(initialQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  // Initial fetch for exam mode if no question provided
  useEffect(() => {
    const fetchFirstExamQuestion = async () => {
      if (isExamMode && !initialQuestion) {
        try {
          setLoading(true);
          const firstQuestion = await quizApi.getNextExamQuestion(1, year, paper);
          if (firstQuestion) {
            setQuestion(firstQuestion);
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to start exam');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFirstExamQuestion();
  }, [isExamMode, initialQuestion, year, paper]);

  // Determine gradient colors based on subject
  const getHeaderGradient = () => {
    if (subject?.id === 'mathematics') return [Colors.subjects.mathematics, Colors.primary.dark];
    if (subject?.id === 'combined_science') return [Colors.subjects.science, Colors.secondary.dark];
    if (subject?.id === 'english') return [Colors.subjects.english, Colors.warning.dark];
    return Colors.gradients.primary;
  };

  const handleAnswerSelect = (answer: string) => {
    if (!result) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = async () => {
    if (!question) return;

    const answerToSubmit = question.allows_text_input ? textAnswer : selectedAnswer;

    if (!answerToSubmit && !answerImage) {
      Alert.alert('Error', 'Please enter your answer or upload an image');
      return;
    }

    try {
      setLoading(true);
      const answerResult = await quizApi.submitAnswer(
        question.id,
        answerToSubmit,
        answerImage || undefined,
        subject?.id,
        question.correct_answer,
        question.solution,
        question.hint
      );
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

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAnswerImage(result.assets[0].uri);
        // TODO: Upload image to server and get URL
        // For now, using local URI
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      let newQuestion: Question | null = null;

      if (isExamMode) {
        const nextCount = questionCount + 1;
        newQuestion = await quizApi.getNextExamQuestion(nextCount, year, paper);
        setQuestionCount(nextCount);
      } else {
        // Ensure we keep the same topic context for continuous practice
        newQuestion = await quizApi.generateQuestion(
          subject.id,
          topic?.id,
          'medium',
          topic ? 'topical' : 'exam',
          topic?.parent_subject
        );
      }

      if (newQuestion) {
        setQuestion(newQuestion);
        setSelectedAnswer('');
        setTextAnswer('');
        setAnswerImage(null);
        setResult(null);
        setShowHint(false);
        if (user) {
          const newCredits = (user.credits || 0) - 1;
          updateUser({ credits: newCredits });
        }
      } else {
        Alert.alert('Notice', 'No more questions available right now.');
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.default} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professional Header */}
        <LinearGradient
          colors={getHeaderGradient()}
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
          {!question ? (
            <ActivityIndicator size="large" color={Colors.primary.main} style={{ marginTop: 50 }} />
          ) : (
            <>
              <Card variant="elevated" style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <IconCircle
                    icon={Icons.info(24, Colors.primary.main)}
                    size={40}
                    backgroundColor={Colors.background.subtle}
                  />
                  <Text style={styles.questionLabel}>Question</Text>
                </View>
                <Text style={styles.questionText}>{question.question_text}</Text>

                {/* Question Image */}
                {question.question_image_url && (
                  <View style={styles.questionImageContainer}>
                    <Image
                      source={{ uri: question.question_image_url }}
                      style={styles.questionImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </Card>

              {/* Options - for multiple choice questions */}
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

          {/* Text Input - for math and short answer questions */}
          {question.allows_text_input && !result && (
            <View style={styles.answerInputContainer}>
              <Text style={styles.answerInputLabel}>Your Answer:</Text>
              <TextInput
                style={styles.answerInput}
                value={textAnswer}
                onChangeText={setTextAnswer}
                placeholder="Enter your answer here..."
                placeholderTextColor={Colors.text.secondary}
                multiline
                editable={!result}
              />
            </View>
          )}

          {/* Image Upload - for math questions */}
          {question.allows_image_upload && !result && (
            <View style={styles.imageUploadContainer}>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={handleImageUpload}
                disabled={!!result}
              >
                <Text style={styles.imageUploadButtonText}>
                  {answerImage ? '📷 Change Image' : '📷 Upload Answer Image'}
                </Text>
              </TouchableOpacity>
              {answerImage && (
                <View style={styles.imagePreview}>
                  <Image
                    source={{ uri: answerImage }}
                    style={styles.uploadedImage}
                    onError={(error) => {
                      console.warn('Failed to load answer image:', error.nativeEvent.error);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setAnswerImage(null)}
                  >
                    <Text style={styles.removeImageText}>✕ Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Hint Button - for math questions */}
          {question.hint && !result && (
            <TouchableOpacity
              style={styles.hintButton}
              onPress={() => setShowHint(!showHint)}
            >
              <Text style={styles.hintButtonText}>
                {showHint ? '💡 Hide Hint' : '💡 Show Hint'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Hint Display */}
          {showHint && question.hint && (
            <Card variant="elevated" style={styles.hintCard}>
              <View style={styles.hintHeader}>
                <IconCircle
                  icon={Icons.info(24, Colors.warning.main)}
                  size={36}
                  backgroundColor={Colors.warning.light}
                />
                <Text style={styles.hintTitle}>Hint</Text>
              </View>
              <Text style={styles.hintText}>{question.hint}</Text>
            </Card>
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
                  backgroundColor={result.correct ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)'}
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

              {/* Answer Images (for DB questions) */}
              {question?.answer_image_urls && question.answer_image_urls.length > 0 && (
                <View style={styles.solutionContainer}>
                  <Text style={styles.solutionTitle}>📸 Solution Images:</Text>
                  {question.answer_image_urls.map((url, index) => (
                    url ? (
                      <Image
                        key={index}
                        source={{ uri: url }}
                        style={styles.solutionImage}
                        resizeMode="contain"
                      />
                    ) : null
                  ))}
                </View>
              )}

              {result.solution && (
                <View style={styles.solutionContainer}>
                  <Text style={styles.solutionTitle}>📚 Detailed Solution:</Text>
                  <Text style={styles.solutionText}>{result.solution}</Text>
                </View>
              )}
              {result.hint && !result.correct && (
                <View style={styles.hintContainer}>
                  <Text style={styles.hintTitle}>💡 Additional Hint:</Text>
                  <Text style={styles.hintText}>{result.hint}</Text>
                </View>
              )}
              {question.explanation && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationTitle}>📖 Teaching Explanation:</Text>
                  <Text style={styles.explanationText}>{question.explanation}</Text>
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
                disabled={(!selectedAnswer && !textAnswer && !answerImage) || loading}
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
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: Colors.primary.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginBottom: 4,
  },
  credits: {
    fontSize: 14,
    color: Colors.text.white,
    opacity: 0.9,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
  },
  questionCard: {
    marginBottom: 20,
    backgroundColor: Colors.background.paper,
    borderColor: Colors.border.light,
    borderWidth: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
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
    backgroundColor: Colors.background.paper,
    borderColor: Colors.border.light,
    borderWidth: 1,
  },
  optionCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary.main,
    backgroundColor: 'rgba(124, 77, 255, 0.1)', // Primary tint
  },
  optionCardCorrect: {
    borderWidth: 2,
    borderColor: Colors.success.main,
    backgroundColor: 'rgba(0, 230, 118, 0.1)', // Success tint
  },
  optionCardWrong: {
    borderWidth: 2,
    borderColor: Colors.error.main,
    backgroundColor: 'rgba(255, 23, 68, 0.1)', // Error tint
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
    backgroundColor: Colors.background.subtle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  optionLabelCircleSelected: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  optionLabelCircleCorrect: {
    backgroundColor: Colors.success.main,
    borderColor: Colors.success.main,
  },
  optionLabelCircleWrong: {
    backgroundColor: Colors.error.main,
    borderColor: Colors.error.main,
  },
  optionLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  optionLabelTextSelected: {
    color: Colors.text.white,
  },
  optionLabelTextCorrect: {
    color: Colors.text.white,
  },
  optionLabelTextWrong: {
    color: Colors.text.white,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  optionTextSelected: {
    color: Colors.primary.light,
    fontWeight: '500',
  },
  optionTextCorrect: {
    color: Colors.success.light,
    fontWeight: '500',
  },
  optionTextWrong: {
    color: Colors.error.light,
    fontWeight: '500',
  },
  optionIcon: {
    marginLeft: 'auto',
  },
  resultCard: {
    marginBottom: 20,
    backgroundColor: Colors.background.paper,
    borderColor: Colors.border.light,
    borderWidth: 1,
  },
  resultCardSuccess: {
    backgroundColor: 'rgba(0, 230, 118, 0.05)',
    borderWidth: 2,
    borderColor: Colors.success.main,
  },
  resultCardError: {
    backgroundColor: 'rgba(255, 23, 68, 0.05)',
    borderWidth: 2,
    borderColor: Colors.error.main,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  resultTextCorrect: {
    color: Colors.success.main,
  },
  resultTextError: {
    color: Colors.error.main,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success.light,
  },
  feedbackText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: 12,
  },
  solutionContainer: {
    backgroundColor: Colors.background.subtle,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  solutionText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 30,
  },
  nextButton: {
    marginBottom: 8,
  },
  answerInputContainer: {
    marginBottom: 20,
  },
  answerInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  answerInput: {
    backgroundColor: Colors.background.paper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageUploadContainer: {
    marginBottom: 20,
  },
  imageUploadButton: {
    backgroundColor: Colors.background.paper,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    borderStyle: 'dashed',
  },
  imageUploadButtonText: {
    color: Colors.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: Colors.background.subtle,
  },
  removeImageButton: {
    backgroundColor: Colors.error.main,
    padding: 8,
    alignItems: 'center',
  },
  removeImageText: {
    color: Colors.text.white,
    fontSize: 14,
    fontWeight: '600',
  },
  hintButton: {
    backgroundColor: 'rgba(255, 171, 0, 0.1)', // Warning tint
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.warning.main,
  },
  hintButtonText: {
    color: Colors.warning.main,
    fontSize: 16,
    fontWeight: '600',
  },
  hintCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 171, 0, 0.05)',
    borderWidth: 1,
    borderColor: Colors.warning.main,
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  hintTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.warning.main,
  },
  hintText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  hintContainer: {
    backgroundColor: 'rgba(255, 171, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.warning.main,
  },
  explanationContainer: {
    backgroundColor: Colors.background.subtle,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  questionImageContainer: {
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.subtle,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  questionImage: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.background.subtle,
  },
  solutionImage: {
    width: '100%',
    height: 250,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: Colors.background.subtle,
  },
});

export default QuizScreen;
