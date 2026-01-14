// Quiz Screen Component - Professional UI/UX Design
import React, { useState, useEffect, useCallback } from 'react';
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
import { quizApi, Question, AnswerResult, StructuredQuestion } from '../services/api/quizApi';
import { mathApi } from '../services/api/mathApi';
import { dktService } from '../services/api/dktApi';
import { gamificationService } from '../services/GamificationService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { database } from '../database';
import Interaction from '../database/models/Interaction';
import { sync as syncDatabase } from '../services/SyncService';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import LoadingProgress from '../components/LoadingProgress';
import MathText from '../components/MathText';
import VoiceMathInput from '../components/VoiceMathInput';

const QuizScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const { question: initialQuestion, subject, topic, isExamMode, year, paper, isReviewMode, reviewItems, questionType } = route.params as {
    question?: Question;
    subject: any;
    topic?: any;
    isExamMode?: boolean;
    year?: string;
    paper?: string;
    isReviewMode?: boolean;
    reviewItems?: any[];
    questionType?: string; // 'mcq', 'structured', or 'essay'
  };

  const normalizeQuestion = useCallback((q: Question | undefined): Question | undefined => {
    if (!q) return undefined;
    const hasOptions = Array.isArray(q.options) && q.options.length > 0;
    return {
      ...q,
      allows_text_input: q.allows_text_input ?? !hasOptions,
      allows_image_upload: q.allows_image_upload ?? (subject?.id === 'mathematics'),
    };
  }, [subject?.id]);

  const [question, setQuestion] = useState<Question | undefined>(normalizeQuestion(initialQuestion));
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  // Store the current question type to preserve it when generating next question
  const [currentQuestionType, setCurrentQuestionType] = useState<string | undefined>(() => {
    // Initialize from route params or detect from initial question
    if (questionType) return questionType;
    if (initialQuestion) {
      if (initialQuestion.question_type === 'essay' || (initialQuestion as any).essay_data) {
        return 'essay';
      } else if (initialQuestion.question_type === 'structured' || initialQuestion.structured_question) {
        return 'structured';
      } else if (initialQuestion.question_type === 'multiple_choice' || (initialQuestion.options && initialQuestion.options.length > 0)) {
        return 'mcq';
      }
    }
    return undefined;
  });

  // Structured question state (Paper 2 style)
  const [structuredAnswers, setStructuredAnswers] = useState<Record<string, string>>({});

  // DKT (Deep Knowledge Tracing) state
  const [selectedConfidence, setSelectedConfidence] = useState<'low' | 'medium' | 'high' | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Voice/STT support (Wispr Flow) â€” enable for A Level sciences and math
  const isMathSubject = subject?.id === 'mathematics' || subject?.id === 'a_level_pure_math';
  const supportsVoiceToText = isMathSubject || ['a_level_physics', 'a_level_chemistry', 'a_level_biology'].includes(subject?.id);
  const voiceInputMode: 'math' | 'general' = isMathSubject ? 'math' : 'general';

  // Initial fetch for exam mode OR review mode if no question provided
  useEffect(() => {
    const fetchFirstQuestion = async () => {
      if (isExamMode && !initialQuestion) {
        try {
          setLoading(true);
          setGeneratingQuestion(true);
          const firstQuestion = await quizApi.getNextExamQuestion(1, year, paper);
          if (firstQuestion) {
            const normalizedQ = normalizeQuestion(firstQuestion);
            setQuestion(normalizedQ);
            // Update question type state
            if (normalizedQ) {
              if (normalizedQ.question_type === 'essay' || (normalizedQ as any).essay_data) {
                setCurrentQuestionType('essay');
              } else if (normalizedQ.question_type === 'structured' || normalizedQ.structured_question) {
                setCurrentQuestionType('structured');
              } else {
                setCurrentQuestionType('mcq');
              }
            }
          }
        } catch (error) {
          showError('âŒ Failed to start exam. Please try again.', 5000);
          Alert.alert('Error', 'Failed to start exam');
          navigation.goBack();
        } finally {
          setLoading(false);
          setGeneratingQuestion(false);
        }
      } else if (isReviewMode && reviewItems && reviewItems.length > 0) {
        // Load first review question
        const firstReviewItem = reviewItems[0];
        if (firstReviewItem.question_data) {
          const qData = firstReviewItem.question_data;
          const mappedQuestion: Question = {
            id: qData.question_id || `review_${firstReviewItem.skill_id}`,
            question_text: qData.question,
            question_type: qData.question_type || 'multiple_choice',
            options: qData.options ? Object.values(qData.options) : [],
            correct_answer: qData.correct_answer,
            explanation: qData.explanation,
            solution: qData.solution,
            hint: qData.hint,
            points: qData.points || 10,
            topic: firstReviewItem.topic || '',
            subject_id: firstReviewItem.subject,
            topic_id: firstReviewItem.topic,
            difficulty: 'medium',
            allows_text_input: !qData.options,
            allows_image_upload: false,
            question_image_url: qData.image_url
          };
          const normalizedQ = normalizeQuestion(mappedQuestion);
          setQuestion(normalizedQ);
          // Update question type state
          if (normalizedQ) {
            const qType = qData.question_type || 'multiple_choice';
            if (qType === 'essay') {
              setCurrentQuestionType('essay');
            } else if (qType === 'structured') {
              setCurrentQuestionType('structured');
            } else {
              setCurrentQuestionType('mcq');
            }
          }
        }
      }
    };

    fetchFirstQuestion();
  }, [isExamMode, initialQuestion, year, paper, isReviewMode, reviewItems]);

  // Update question type state when question changes
  useEffect(() => {
    if (question) {
      if (question.question_type === 'essay' || (question as any).essay_data) {
        setCurrentQuestionType('essay');
      } else if (question.question_type === 'structured' || question.structured_question) {
        setCurrentQuestionType('structured');
      } else if (question.question_type === 'multiple_choice' || (question.options && question.options.length > 0)) {
        setCurrentQuestionType('mcq');
      }
    }
  }, [question]);

  // Determine gradient colors based on subject
  const getHeaderGradient = () => {
    if (isReviewMode) return ['#6A1B9A', '#4A148C'];
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

    // For structured questions, combine all part answers
    const isStructured = question.question_type === 'structured' && question.structured_question;
    let answerToSubmit: string;

    if (isStructured) {
      // Combine all structured answers into a formatted string
      const parts = question.structured_question?.parts || [];
      const answersFormatted = parts.map(part => {
        const answer = structuredAnswers[part.label] || '';
        return `${part.label}: ${answer}`;
      }).join('\n\n');
      answerToSubmit = answersFormatted;

      // Check if at least one answer is filled
      const hasAnyAnswer = Object.values(structuredAnswers).some(a => a.trim().length > 0);
      if (!hasAnyAnswer) {
        Alert.alert('Error', 'Please answer at least one part of the question');
        return;
      }
    } else if (question.question_type === 'essay') {
      // Essay questions - use text answer
      answerToSubmit = textAnswer;

      if (!answerToSubmit || answerToSubmit.trim().length < 10) {
        Alert.alert('Error', 'Please write your essay answer (minimum 10 characters)');
        return;
      }
    } else {
      // Regular text input or MCQ
      answerToSubmit = question.allows_text_input ? textAnswer : selectedAnswer;

      if (!answerToSubmit && !answerImage) {
        Alert.alert('Error', 'Please enter your answer or upload an image');
        return;
      }
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
        question.hint,
        question.question_text,
        question.options,  // Pass options for proper MCQ validation
        isStructured ? question.structured_question : undefined  // Pass structured question for marking
      );
      if (answerResult) {
        setResult(answerResult);

        // Show notification based on result
        if (answerResult.correct) {
          showSuccess(`Correct! You earned ${answerResult.points_earned} points!`, 3000);
        } else {
          showInfo(`${answerResult.feedback || 'Keep practicing!'}`, 4000);
        }

        if (isReviewMode && reviewItems) {
          // Submit review completion
          const currentItem = reviewItems[questionCount - 1];
          await dktService.completeReview({
            skill_id: currentItem.skill_id,
            question_id: question.id,
            correct: answerResult.correct,
            confidence: selectedConfidence || 'medium',
            time_spent: Math.floor((Date.now() - questionStartTime) / 1000),
            subject: currentItem.subject,
            topic: currentItem.topic
          });
        } else {
          await logInteractionToDKT(answerResult.correct);
        }

        // Track progress in gamification service (for Progress screen)
        try {
          // Log question answered for XP and stats
          await gamificationService.logQuestionAnswered(answerResult.correct);

          // Check and update streak
          await gamificationService.checkStreak();

          // Update subject mastery based on quiz performance
          const subjectKey = subject?.id === 'combined_science'
            ? (topic?.parent_subject || 'science')
            : subject?.id || 'general';
          const scorePercent = answerResult.correct ? 100 : 0;
          await gamificationService.updateMastery(subjectKey, scorePercent);

          console.log('âœ… Gamification: Progress tracked successfully');
        } catch (gamError) {
          console.error('Failed to update gamification:', gamError);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit answer';
      showError(`âŒ ${errorMessage}`, 5000);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Log interaction to DKT system (Offline-First with fallback)
  const logInteractionToDKT = async (isCorrect: boolean) => {
    if (!question || !subject) return;

    try {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

      // Determine effective subject for DKT (especially for Combined Science)
      let effectiveSubject = subject.id;
      if (subject.id === 'combined_science') {
        // Try to get sub-subject from topic or question
        if (topic?.parent_subject) {
          effectiveSubject = topic.parent_subject;
        } else if (question.subject_id && question.subject_id !== 'combined_science') {
          // If question has specific subject (e.g. 'biology')
          effectiveSubject = question.subject_id;
        }
      }

      const skill_id = dktService.mapTopicToSkillId(
        effectiveSubject,
        topic?.name || topic?.id || 'general'
      );

      // Try to save to local database if available (WatermelonDB)
      if (database) {
        try {
          await database.write(async () => {
            await database.get<Interaction>('interactions').create(interaction => {
              interaction.userId = user?.id || 'anonymous';
              interaction.questionId = question.id;
              interaction.skillId = skill_id;
              interaction.subject = subject.id;
              interaction.correct = isCorrect;
              interaction.confidence = selectedConfidence || 'medium';
              interaction.timeSpent = timeSpent;
              interaction.hintsUsed = hintsUsed;
              interaction.sessionId = sessionId;
              interaction.timestamp = Date.now();
              interaction.synced = false; // Mark as pending sync
            });
          });
          console.log(`âœ… Offline DKT: Logged interaction for ${skill_id}`);
          // Trigger background sync if online
          syncDatabase();
        } catch (dbError) {
          console.warn('WatermelonDB write failed, using API fallback:', dbError);
        }
      }

      // Also try to log directly to DKT API (online fallback)
      try {
        await dktService.logInteraction({
          subject: effectiveSubject,
          topic: topic?.name || topic?.id || 'general',
          skill_id,
          question_id: question.id,
          correct: isCorrect,
          confidence: selectedConfidence || undefined,
          time_spent: timeSpent,
          hints_used: hintsUsed,
          session_id: sessionId,
        });
        console.log(`âœ… DKT API: Logged interaction for ${skill_id}`);
      } catch (apiError) {
        console.warn('DKT API logging failed (offline?):', apiError);
      }

    } catch (error) {
      console.error('Failed to log interaction:', error);
    }
  };

  const runOCR = async (uri: string) => {
    try {
      const scanResult: any = await mathApi.scanProblem(uri);
      if (scanResult?.success) {
        const recognized = scanResult.latex || scanResult.text || '';
        if (recognized) {
          setTextAnswer(prev => prev ? `${prev}\n${recognized}` : recognized);
        }
      } else {
        Alert.alert('Scan Failed', 'Could not recognize the equation.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process the image for OCR.');
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
        const uri = result.assets[0].uri;
        setAnswerImage(uri);
        await runOCR(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleCameraCapture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera permissions to capture images');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setAnswerImage(uri);
        await runOCR(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      setGeneratingQuestion(true); // Show loading progress
      let newQuestion: Question | null = null;

      if (isExamMode) {
        const nextCount = questionCount + 1;
        newQuestion = await quizApi.getNextExamQuestion(nextCount, year, paper);
        setQuestionCount(nextCount);
      } else if (isReviewMode && reviewItems) {
        const nextIndex = questionCount; // 0-based index for next item (current count is 1-based)
        if (nextIndex < reviewItems.length) {
          const nextItem = reviewItems[nextIndex];
          if (nextItem.question_data) {
            const qData = nextItem.question_data;
            newQuestion = {
              id: qData.question_id || `review_${nextItem.skill_id}`,
              question_text: qData.question,
              question_type: qData.question_type || 'multiple_choice',
              options: qData.options ? Object.values(qData.options) : [],
              correct_answer: qData.correct_answer,
              explanation: qData.explanation,
              solution: qData.solution,
              hint: qData.hint,
              points: qData.points || 10,
              topic: nextItem.topic || '',
              subject_id: nextItem.subject,
              topic_id: nextItem.topic,
              difficulty: 'medium',
              allows_text_input: !qData.options,
              allows_image_upload: subject?.id === 'mathematics',
              question_image_url: qData.image_url
            };
            setQuestionCount(nextIndex + 1);
            // Update question type state
            const qType = qData.question_type || 'multiple_choice';
            if (qType === 'essay') {
              setCurrentQuestionType('essay');
            } else if (qType === 'structured') {
              setCurrentQuestionType('structured');
            } else {
              setCurrentQuestionType('mcq');
            }
          }
        } else {
          Alert.alert('Review Complete', 'You have completed your daily review!', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
          return;
        }
      } else {
        // Ensure we keep the same topic context AND question type for continuous practice
        // Use stored question type (persists through submission) or detect from current question
        let nextQuestionType: string | undefined = currentQuestionType;

        // If no stored type, try to detect from current question
        if (!nextQuestionType && question) {
          if (question.question_type === 'essay' || (question as any).essay_data) {
            nextQuestionType = 'essay';
          } else if (question.question_type === 'structured' || question.structured_question) {
            nextQuestionType = 'structured';
          } else if (question.question_type === 'multiple_choice' || (question.options && question.options.length > 0)) {
            nextQuestionType = 'mcq';
          }
        }

        // Fall back to route param if still not detected
        if (!nextQuestionType) {
          nextQuestionType = questionType;
        }

        console.log(`ðŸ”„ Generating next ${nextQuestionType || 'MCQ'} question for topic: ${topic?.id || 'general'}`);

        newQuestion = await quizApi.generateQuestion(
          subject.id,
          topic?.id,
          'medium',  // difficulty
          topic ? 'topical' : 'exam',  // type
          topic?.parent_subject,  // parent_subject for Combined Science
          nextQuestionType,  // Preserve question type (mcq, structured, essay)
          undefined,  // questionFormat
          nextQuestionType   // Also pass as question_type for backend compatibility
        );
      }

      if (newQuestion) {
        const normalizedQ = normalizeQuestion(newQuestion);
        setQuestion(normalizedQ);

        // Update stored question type based on the new question
        if (normalizedQ) {
          if (normalizedQ.question_type === 'essay' || (normalizedQ as any).essay_data) {
            setCurrentQuestionType('essay');
          } else if (normalizedQ.question_type === 'structured' || normalizedQ.structured_question) {
            setCurrentQuestionType('structured');
          } else if (normalizedQ.question_type === 'multiple_choice' || (normalizedQ.options && normalizedQ.options.length > 0)) {
            setCurrentQuestionType('mcq');
          }
        }

        showSuccess('âœ… Next question loaded!', 2000);
        setSelectedAnswer('');
        setTextAnswer('');
        setAnswerImage(null);
        setResult(null);
        setShowHint(false);
        setSelectedConfidence(null);
        setQuestionStartTime(Date.now());
        setHintsUsed(0);
        setStructuredAnswers({});  // Reset structured question answers
        if (user) {
          const newCredits = (user.credits || 0) - 1;
          updateUser({ credits: newCredits });

          // Show credit deduction notification
          showInfo(`1 credit used. ${newCredits} credits remaining.`, 3000);

          // Check if credits are getting low
          if (newCredits <= 3 && newCredits > 0) {
            setTimeout(() => {
              showWarning(`âš ï¸ Running low on credits! Only ${newCredits} credits left.`, 5000);
            }, 3500);
          }
        }
      } else {
        Alert.alert('Notice', 'No more questions available right now.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load next question');
    } finally {
      setLoading(false);
      setGeneratingQuestion(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatSolutionText = (text?: string) => {
    if (!text) return '';
    let formatted = text.replace(/;\s*/g, ';\n');
    formatted = formatted.replace(/\. (?=[A-Z0-9])/g, '.\n');
    formatted = formatted.replace(/Step\s*/gi, '\nStep ');
    return formatted.trim();
  };

  // Dynamic styles based on theme
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background.default,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      paddingTop: 35,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      shadowColor: themedColors.primary.dark,
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
      padding: 16,
      paddingTop: 8,
    },
    questionCard: {
      marginBottom: 12,
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
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
      color: themedColors.text.primary,
    },
    questionText: {
      fontSize: 18,
      color: themedColors.text.primary,
      lineHeight: 28,
      fontWeight: '500',
    },
    questionTextContainer: {
      marginTop: 4,
    },
    optionsContainer: {
      marginBottom: 20,
    },
    optionCard: {
      marginBottom: 12,
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
      borderWidth: 1,
    },
    optionCardSelected: {
      borderWidth: 2,
      borderColor: Colors.primary.main,
      backgroundColor: 'rgba(124, 77, 255, 0.1)',
    },
    optionCardCorrect: {
      borderWidth: 2,
      borderColor: Colors.success.main,
      backgroundColor: 'rgba(0, 230, 118, 0.1)',
    },
    optionCardWrong: {
      borderWidth: 2,
      borderColor: Colors.error.main,
      backgroundColor: 'rgba(255, 23, 68, 0.1)',
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
      backgroundColor: themedColors.background.subtle,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: themedColors.border.light,
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
      fontWeight: '700',
      color: themedColors.text.primary,
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
      color: themedColors.text.primary,
      lineHeight: 24,
    },
    optionTextSelected: {
      fontWeight: '600',
    },
    optionTextCorrect: {
      color: Colors.success.dark,
      fontWeight: '600',
    },
    optionTextWrong: {
      color: Colors.error.dark,
      fontWeight: '600',
    },
    optionIcon: {
      marginLeft: 'auto',
    },
    resultCard: {
      marginBottom: 20,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    resultLabelCorrect: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.success.main,
    },
    resultLabelIncorrect: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.error.main,
    },
    resultContent: {
      padding: 4,
    },
    feedbackText: {
      fontSize: 16,
      color: themedColors.text.primary,
      lineHeight: 24,
      marginBottom: 12,
    },
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: Colors.primary.light + '30',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 4,
    },
    pointsText: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.primary.main,
    },
    essayFeedbackSection: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: themedColors.border.light,
    },
    essayFeedbackTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.info.main,
      marginBottom: 8,
    },
    essayStrengthsList: {
      marginBottom: 12,
    },
    essayStrengthItem: {
      fontSize: 13,
      color: Colors.success.dark,
      lineHeight: 20,
      marginBottom: 4,
    },
    essayImprovementSection: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: themedColors.border.light,
    },
    essayMistakesTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.warning.main,
      marginBottom: 8,
    },
    essayMistakeItem: {
      fontSize: 13,
      color: themedColors.text.secondary,
      lineHeight: 20,
      marginBottom: 6,
    },
    solutionContainer: {
      backgroundColor: themedColors.background.subtle,
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: themedColors.border.light,
    },
    solutionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: themedColors.text.primary,
      marginBottom: 8,
    },
    solutionText: {
      fontSize: 15,
      color: themedColors.text.secondary,
      lineHeight: 22,
    },
    solutionImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 8,
    },
    hintContainer: {
      backgroundColor: Colors.warning.light + '20',
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: Colors.warning.light,
    },
    hintTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.warning.dark,
      marginBottom: 8,
    },
    hintText: {
      fontSize: 15,
      color: themedColors.text.secondary,
      lineHeight: 22,
    },
    explanationContainer: {
      backgroundColor: Colors.info.light + '20',
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: Colors.info.light,
    },
    explanationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.info.dark,
      marginBottom: 8,
    },
    explanationText: {
      fontSize: 15,
      color: themedColors.text.secondary,
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
      color: themedColors.text.primary,
      marginBottom: 8,
    },
    answerInput: {
      backgroundColor: themedColors.background.paper,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: themedColors.border.light,
      padding: 16,
      fontSize: 16,
      color: themedColors.text.primary,
      minHeight: 70,
      textAlignVertical: 'top',
    },
    answerInputRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    answerInputFlex: {
      flex: 1,
    },
    essayInput: {
      backgroundColor: themedColors.background.paper,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: themedColors.border.light,
      padding: 16,
      fontSize: 16,
      color: themedColors.text.primary,
      minHeight: 200,
      maxHeight: 400,
      textAlignVertical: 'top',
    },
    essayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    essayTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: themedColors.text.primary,
    },
    essayMeta: {
      flexDirection: 'row',
      gap: 12,
    },
    essayMarks: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.primary.main,
    },
    essayTime: {
      fontSize: 14,
      fontWeight: '500',
      color: themedColors.text.secondary,
    },
    essayCommandWord: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.warning.main,
      marginBottom: 12,
      fontStyle: 'italic',
    },
    essayKeyTerms: {
      backgroundColor: themedColors.background.subtle,
      borderRadius: 10,
      padding: 12,
      marginTop: 12,
      borderLeftWidth: 3,
      borderLeftColor: Colors.primary.main,
    },
    essayKeyTermsLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: themedColors.text.primary,
      marginBottom: 6,
    },
    essayKeyTermsList: {
      fontSize: 13,
      color: themedColors.text.secondary,
      lineHeight: 20,
    },
    voiceHintText: {
      fontSize: 12,
      color: themedColors.text.secondary,
      marginTop: 8,
      fontStyle: 'italic',
    },
    scanButtonsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
      flexWrap: 'wrap',
    },
    scanButton: {
      flex: 1,
      backgroundColor: themedColors.background.paper,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: themedColors.border.light,
      alignItems: 'center',
    },
    scanButtonText: {
      color: themedColors.text.primary,
      fontWeight: '600',
      fontSize: 14,
    },
    imageUploadContainer: {
      marginBottom: 20,
    },
    imageUploadButton: {
      backgroundColor: themedColors.background.paper,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 1,
      borderColor: themedColors.border.light,
    },
    secondaryImageButton: {
      backgroundColor: themedColors.background.subtle,
    },
    imageUploadButtonText: {
      fontSize: 16,
      color: themedColors.text.primary,
      fontWeight: '500',
    },
    imagePreview: {
      position: 'relative',
      width: '100%',
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: themedColors.border.light,
    },
    uploadedImage: {
      width: '100%',
      height: '100%',
    },
    removeImageButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    removeImageText: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    hintButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      backgroundColor: Colors.warning.light + '20',
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: Colors.warning.light,
    },
    hintButtonText: {
      fontSize: 16,
      color: Colors.warning.dark,
      fontWeight: '600',
    },
    hintCard: {
      marginBottom: 20,
      backgroundColor: themedColors.background.paper,
      borderColor: Colors.warning.light,
      borderWidth: 1,
    },
    hintHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    confidenceContainer: {
      marginBottom: 24,
      backgroundColor: themedColors.background.paper,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: themedColors.border.light,
    },
    confidenceLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: themedColors.text.primary,
      marginBottom: 12,
      textAlign: 'center',
    },
    confidenceButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    confidenceButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: themedColors.border.light,
      alignItems: 'center',
      backgroundColor: themedColors.background.subtle,
    },
    confidenceButtonSelected: {
      borderWidth: 2,
      backgroundColor: themedColors.background.paper,
    },
    confidenceButtonLow: {
      borderColor: Colors.error.main,
      backgroundColor: 'rgba(255, 23, 68, 0.1)',
    },
    confidenceButtonMedium: {
      borderColor: Colors.warning.main,
      backgroundColor: 'rgba(255, 145, 0, 0.1)',
    },
    confidenceButtonHigh: {
      borderColor: Colors.success.main,
      backgroundColor: 'rgba(0, 230, 118, 0.1)',
    },
    confidenceButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: themedColors.text.secondary,
    },
    confidenceButtonTextSelected: {
      color: themedColors.text.primary,
      fontWeight: 'bold',
    },
    questionImageContainer: {
      marginTop: 16,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: themedColors.background.subtle,
    },
    questionImage: {
      width: '100%',
      height: 200,
      resizeMode: 'contain',
    },
    structuredContainer: {
      marginBottom: 20,
    },
    structuredHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    structuredTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.subjects.combinedScience,
    },
    structuredMarks: {
      fontSize: 14,
      fontWeight: '600',
      color: themedColors.text.secondary,
      backgroundColor: themedColors.background.subtle,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    structuredPartCard: {
      marginBottom: 12,
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
      borderWidth: 1,
      borderLeftWidth: 4,
      borderLeftColor: Colors.subjects.science,
    },
    structuredPartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    structuredPartLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.subjects.combinedScience,
    },
    structuredPartMarks: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.primary.main,
      backgroundColor: Colors.primary.light + '30',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    structuredPartQuestion: {
      fontSize: 15,
      color: themedColors.text.primary,
      lineHeight: 22,
      marginBottom: 12,
    },
    structuredInputRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    structuredInputFlex: {
      flex: 1,
    },
    structuredPartInput: {
      backgroundColor: themedColors.background.subtle,
      borderRadius: 8,
      padding: 12,
      fontSize: 15,
      color: themedColors.text.primary,
      borderWidth: 1,
      borderColor: themedColors.border.light,
      minHeight: 60,
      maxHeight: 80,
      textAlignVertical: 'top',
    },
    structuredPartAnswerDisplay: {
      backgroundColor: themedColors.background.subtle,
      borderRadius: 8,
      padding: 12,
    },
    structuredPartAnswerLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: themedColors.text.secondary,
      marginBottom: 4,
    },
    structuredPartAnswerText: {
      fontSize: 14,
      color: themedColors.text.primary,
      lineHeight: 20,
    },
    structuredModelAnswer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: themedColors.border.light,
    },
    structuredModelLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.success.main,
      marginBottom: 4,
    },
    structuredModelText: {
      fontSize: 14,
      color: Colors.success.dark,
      lineHeight: 20,
      fontStyle: 'italic',
    },
  }), [themedColors]);

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      {/* AI Loading Progress Overlay */}
      <LoadingProgress
        visible={generatingQuestion}
        message="Generating your next question..."
        estimatedTime={8}
      />

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={themedColors.background.default}
      />
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
                <Text style={styles.title}>{isReviewMode ? 'Daily Review' : 'Quiz Question'}</Text>
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
                <MathText style={styles.questionTextContainer} fontSize={16}>{question.question_text}</MathText>

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

              {/* Structured Question Parts - for Paper 2 style questions */}
              {question.question_type === 'structured' && question.structured_question && (
                <View style={styles.structuredContainer}>
                  <View style={styles.structuredHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {Icons.clipboard(24, Colors.subjects.combinedScience)}
                      <Text style={styles.structuredTitle}>Structured Question</Text>
                    </View>
                    <Text style={styles.structuredMarks}>
                      Total: {question.structured_question.total_marks} marks
                    </Text>
                  </View>

                  {question.structured_question.parts.map((part, index) => (
                    <Card key={index} variant="elevated" style={styles.structuredPartCard}>
                      <View style={styles.structuredPartHeader}>
                        <Text style={styles.structuredPartLabel}>{part.label}</Text>
                        <Text style={styles.structuredPartMarks}>[{part.marks}]</Text>
                      </View>
                      <Text style={styles.structuredPartQuestion}>{part.question}</Text>

                      {!result ? (
                        <View style={styles.structuredInputRow}>
                          <TextInput
                            style={[styles.structuredPartInput, styles.structuredInputFlex]}
                            value={structuredAnswers[part.label] || ''}
                            onChangeText={(text) => {
                              // Limit structured answers to short responses (1-2 sentences max, 200 chars)
                              const maxLength = 200;
                              const trimmed = text.length > maxLength ? text.substring(0, maxLength) : text;
                              setStructuredAnswers(prev => ({
                                ...prev,
                                [part.label]: trimmed
                              }));
                            }}
                            placeholder={`Brief answer for ${part.label} (1-2 sentences)...`}
                            placeholderTextColor={Colors.text.secondary}
                            multiline
                            numberOfLines={2}
                            maxLength={200}
                            textAlignVertical="top"
                          />
                          {supportsVoiceToText && (
                            <VoiceMathInput
                              mode="general"
                              onTranscription={(text) => {
                                // For structured, keep answers short - replace rather than append
                                setStructuredAnswers(prev => ({
                                  ...prev,
                                  [part.label]: text.substring(0, 200) // Limit to 200 chars
                                }));
                              }}
                              disabled={!!result}
                            />
                          )}
                        </View>
                      ) : (
                        <View style={styles.structuredPartAnswerDisplay}>
                          <Text style={styles.structuredPartAnswerLabel}>Your Answer:</Text>
                          <Text style={styles.structuredPartAnswerText}>
                            {structuredAnswers[part.label] || '(No answer provided)'}
                          </Text>
                          {part.model_answer && (
                            <View style={styles.structuredModelAnswer}>
                              <Text style={styles.structuredModelLabel}>âœ“ Model Answer:</Text>
                              <Text style={styles.structuredModelText}>{part.model_answer}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </Card>
                  ))}
                </View>
              )}

              {/* Essay Question Input - for A-Level Biology essays */}
              {question.question_type === 'essay' && question.allows_text_input && !result && (
                <View style={styles.answerInputContainer}>
                  <View style={styles.essayHeader}>
                    <Text style={styles.essayTitle}>ðŸ“ Essay Answer</Text>
                    {question.essay_data && (
                      <View style={styles.essayMeta}>
                        <Text style={styles.essayMarks}>{question.essay_data.total_marks} marks</Text>
                        <Text style={styles.essayTime}>{question.essay_data.time_allocation}</Text>
                      </View>
                    )}
                  </View>
                  {question.essay_data?.command_word && (
                    <Text style={styles.essayCommandWord}>
                      Command: {question.essay_data.command_word}
                    </Text>
                  )}
                  <View style={styles.answerInputRow}>
                    <TextInput
                      style={[styles.essayInput, styles.answerInputFlex]}
                      value={textAnswer}
                      onChangeText={setTextAnswer}
                      placeholder="Write your essay answer here... You can type or use voice input."
                      placeholderTextColor={Colors.text.secondary}
                      multiline
                      numberOfLines={12}
                      textAlignVertical="top"
                      editable={!result}
                    />
                    {/* Voice input for essay */}
                    {supportsVoiceToText && (
                      <VoiceMathInput
                        mode="general"
                        onTranscription={(text) => {
                          // Append to existing answer with proper spacing
                          setTextAnswer(prev => prev ? `${prev}\n\n${text}` : text);
                        }}
                        disabled={!!result}
                      />
                    )}
                  </View>
                  {question.essay_data?.must_include_terms && question.essay_data.must_include_terms.length > 0 && (
                    <View style={styles.essayKeyTerms}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        {Icons.key(16, themedColors.text.primary)}
                        <Text style={[styles.essayKeyTermsLabel, { marginBottom: 0 }]}>Key Terms to Include:</Text>
                      </View>
                      <Text style={styles.essayKeyTermsList}>
                        {question.essay_data.must_include_terms.join(', ')}
                      </Text>
                    </View>
                  )}
                  {supportsVoiceToText && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      {Icons.microphone(14, themedColors.text.secondary)}
                      <Text style={[styles.voiceHintText, { marginTop: 0 }]}>
                        Tip: Tap mic to dictate your essay. Speak naturally and pause between paragraphs.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Text Input - for math and short answer questions (not structured, not essay) */}
              {question.allows_text_input && question.question_type !== 'structured' && question.question_type !== 'essay' && !result && (
                <View style={styles.answerInputContainer}>
                  <Text style={styles.answerInputLabel}>
                    {supportsVoiceToText ? 'Your Answer (type or speak, scan optional):' : 'Your Answer (type or scan):'}
                  </Text>
                  <View style={styles.answerInputRow}>
                    <TextInput
                      style={[styles.answerInput, styles.answerInputFlex]}
                      value={textAnswer}
                      onChangeText={setTextAnswer}
                      placeholder="Enter your answer here..."
                      placeholderTextColor={Colors.text.secondary}
                      multiline
                      editable={!result}
                    />
                    {/* Wispr Flow speech-to-text (math-aware for Pure Math) */}
                    {supportsVoiceToText && (
                      <VoiceMathInput
                        mode={voiceInputMode}
                        onTranscription={(text) => {
                          // Append to existing answer or set new
                          setTextAnswer(prev => prev ? `${prev} ${text}` : text);
                        }}
                        disabled={!!result}
                      />
                    )}
                  </View>
                  {supportsVoiceToText && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      {Icons.microphone(14, themedColors.text.secondary)}
                      <Text style={[styles.voiceHintText, { marginTop: 0 }]}>
                        {voiceInputMode === 'math'
                          ? 'Tip: Speak math like "integral from zero to pi" â€” symbols auto-format.'
                          : 'Tip: Tap mic to dictate your answer with Wispr Flow speech-to-text.'}
                      </Text>
                    </View>
                  )}
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {answerImage ? Icons.refresh(20, themedColors.text.primary) : Icons.image(20, themedColors.text.primary)}
                      <Text style={styles.imageUploadButtonText}>
                        {answerImage ? 'Change Image' : 'Upload/Scan Answer Image'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.imageUploadButton, styles.secondaryImageButton]}
                    onPress={handleCameraCapture}
                    disabled={!!result}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {Icons.camera(20, themedColors.text.primary)}
                      <Text style={styles.imageUploadButtonText}>Capture with Camera</Text>
                    </View>
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
                        <Text style={styles.removeImageText}>âœ• Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Hint Button - for math questions */}
              {question.hint && !result && (
                <TouchableOpacity
                  style={styles.hintButton}
                  onPress={() => {
                    setShowHint(!showHint);
                    if (!showHint) setHintsUsed(prev => prev + 1);
                  }}
                >
                  <Text style={styles.hintButtonText}>
                    {showHint ? 'ðŸ’¡ Hide Hint' : 'ðŸ’¡ Show Hint'}
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
                      <Text style={styles.solutionTitle}>ðŸ“¸ Solution Images:</Text>
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
                      <Text style={styles.solutionTitle}>ðŸ“š Detailed Solution:</Text>
                      <MathText>{formatSolutionText(result.solution)}</MathText>
                    </View>
                  )}
                  {result.hint && !result.correct && (
                    <View style={styles.hintContainer}>
                      <Text style={styles.hintTitle}>ðŸ’¡ Additional Hint:</Text>
                      <MathText>{result.hint}</MathText>
                    </View>
                  )}
                  {question.explanation && (
                    <View style={styles.explanationContainer}>
                      <Text style={styles.explanationTitle}>ðŸ“– Teaching Explanation:</Text>
                      <MathText>{question.explanation}</MathText>
                    </View>
                  )}
                </Card>
              )}

              {/* Confidence Selection (SRS) */}
              {!result && (
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>How confident are you?</Text>
                  <View style={styles.confidenceButtons}>
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.confidenceButton,
                          selectedConfidence === level && styles.confidenceButtonSelected,
                          selectedConfidence === level && level === 'low' && styles.confidenceButtonLow,
                          selectedConfidence === level && level === 'medium' && styles.confidenceButtonMedium,
                          selectedConfidence === level && level === 'high' && styles.confidenceButtonHigh,
                        ]}
                        onPress={() => setSelectedConfidence(level)}
                      >
                        <Text style={[
                          styles.confidenceButtonText,
                          selectedConfidence === level && styles.confidenceButtonTextSelected
                        ]}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
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

      {/* Loading Progress Overlay */}
      <LoadingProgress
        visible={generatingQuestion}
        message={isExamMode ? 'Loading exam question...' : 'Generating your question...'}
        estimatedTime={12}
      />
    </View>
  );
};

export default QuizScreen;
