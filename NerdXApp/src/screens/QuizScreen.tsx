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
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
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
  const { question: initialQuestion, subject, topic } = route.params as { question: Question; subject: any; topic?: any };
  
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (!result) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = async () => {
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
      const newQuestion = await quizApi.generateQuestion(
        subject.id,
        topic?.id,
        'medium',
        topic ? 'topical' : 'exam',
        topic?.parent_subject
      );
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
                icon={Icons.info(24, Colors.primary.main)}
                size={36}
                backgroundColor={Colors.iconBg.mathematics}
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
      </View>
    </ScrollView>
  );
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
  },
  optionCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary.main,
    backgroundColor: Colors.iconBg.mathematics,
  },
  optionCardCorrect: {
    borderWidth: 2,
    borderColor: Colors.success.main,
    backgroundColor: '#E8F5E9',
  },
  optionCardWrong: {
    borderWidth: 2,
    borderColor: Colors.error.main,
    backgroundColor: '#FFEBEE',
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
  optionLabelCircleCorrect: {
    backgroundColor: Colors.success.main,
  },
  optionLabelCircleWrong: {
    backgroundColor: Colors.error.main,
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
    color: Colors.primary.dark,
    fontWeight: '500',
  },
  optionTextCorrect: {
    color: Colors.success.dark,
    fontWeight: '500',
  },
  optionTextWrong: {
    color: Colors.error.dark,
    fontWeight: '500',
  },
  optionIcon: {
    marginLeft: 'auto',
  },
  resultCard: {
    marginBottom: 20,
  },
  resultCardSuccess: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: Colors.success.main,
  },
  resultCardError: {
    backgroundColor: '#FFEBEE',
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
    color: Colors.success.dark,
  },
  resultTextError: {
    color: Colors.error.dark,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success.main,
  },
  feedbackText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: 12,
  },
  solutionContainer: {
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
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
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.main,
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
    backgroundColor: Colors.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageUploadButtonText: {
    color: Colors.text.white,
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
    backgroundColor: Colors.background.default,
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
    backgroundColor: Colors.iconBg.mathematics,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  hintButtonText: {
    color: Colors.primary.main,
    fontSize: 16,
    fontWeight: '600',
  },
  hintCard: {
    marginBottom: 20,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFD700',
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
    color: Colors.text.primary,
  },
  hintText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  hintContainer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  explanationContainer: {
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
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
});

export default QuizScreen;
