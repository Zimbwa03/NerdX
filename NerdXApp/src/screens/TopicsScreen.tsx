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
  Switch,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { quizApi, Topic, Subject, Question } from '../services/api/quizApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Colors, getColors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import LoadingProgress from '../components/LoadingProgress';
import ExamSetupModal from '../components/ExamSetupModal';
import { ExamConfig, TimeInfo } from '../services/api/examApi';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateQuizCreditCost, formatCreditCost, getMinimumCreditsForQuiz } from '../utils/creditCalculator';
import { getSubjectDisplayName, getSubjectLoadingSteps } from '../utils/loadingProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { accountingTopics as accountingTopicsList } from '../data/accounting';
import { businessEnterpriseSkillsTopics as besTopicsList } from '../data/businessEnterpriseSkills';
import { commerceTopics as commerceTopicsList } from '../data/commerce';
import {
  historyFormLevels,
  getHistoryTopicsForQuizByForm,
  type HistoryFormLevel,
} from '../data/history';
import {
  mathFormLevels,
  getMathTopicsForQuizByForm,
  type MathFormLevel,
} from '../data/mathematics';

const CS_BOARD_STORAGE_KEY = '@nerdx_cs_board';
const A_LEVEL_CS_BOARD_STORAGE_KEY = '@nerdx_alevel_cs_board';

const TopicsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isCompactScreen = screenWidth <= 360;
  const isNarrowScreen = screenWidth <= 390;
  const { subject, parentSubject, historyForm, mathForm } = route.params as {
    subject: Subject;
    parentSubject?: string;
    historyForm?: HistoryFormLevel;
    mathForm?: MathFormLevel;
  };
  const subjectDisplayName = getSubjectDisplayName(subject.id, subject.name);
  const subjectSteps = getSubjectLoadingSteps(subject.id);
  const overlayMessage = streamingStatus ?? `Preparing your ${subjectDisplayName} question...`;
  const overlayStage = streamingStage ?? 'Preparing';

  // State for Combined Science Tabs
  const [activeTab, setActiveTab] = useState<string>(parentSubject || (subject.id === 'combined_science' ? 'Biology' : ''));
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentParentSubject, setCurrentParentSubject] = useState<string | undefined>(parentSubject);
  const [selectedHistoryForm, setSelectedHistoryForm] = useState<HistoryFormLevel>(historyForm || 'Form 1');
  const [selectedMathForm, setSelectedMathForm] = useState<MathFormLevel>(mathForm || 'Form 1');
  const [isMathNotesExpanded, setIsMathNotesExpanded] = useState(false);
  const [pharmaModalVisible, setPharmaModalVisible] = useState(false);
  const [selectedPharmaTopic, setSelectedPharmaTopic] = useState<Topic | null>(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null);
  const [streamingStage, setStreamingStage] = useState<string | null>(null);
  const [selectedPharmaQuestionType, setSelectedPharmaQuestionType] = useState<'MCQ' | 'True/False'>('MCQ');

  // Combined Science Question Type Modal (MCQ vs Structured)
  const [scienceQuestionTypeModalVisible, setScienceQuestionTypeModalVisible] = useState(false);
  const [selectedScienceTopic, setSelectedScienceTopic] = useState<Topic | null>(null);
  const [selectedScienceQuestionFormat, setSelectedScienceQuestionFormat] = useState<'mcq' | 'structured'>('mcq');

  // Computer Science Question Type Modal (MCQ, Structured, Essay)
  const [csQuestionTypeModalVisible, setCsQuestionTypeModalVisible] = useState(false);
  const [selectedCsTopic, setSelectedCsTopic] = useState<Topic | null>(null);
  const [selectedCsQuestionType, setSelectedCsQuestionType] = useState<'mcq' | 'structured' | 'essay'>('mcq');

  // A-Level Geography Question Type Modal (MCQ, Structured, Essay)
  const [geoQuestionTypeModalVisible, setGeoQuestionTypeModalVisible] = useState(false);
  const [selectedGeoTopic, setSelectedGeoTopic] = useState<Topic | null>(null);
  const [selectedGeoQuestionType, setSelectedGeoQuestionType] = useState<'mcq' | 'structured' | 'essay'>('mcq');

  // Principles of Accounting Question Type Modal (Paper 1 MCQ only â€“ modal kept for future Paper 2)
  const [accountingQuestionTypeModalVisible, setAccountingQuestionTypeModalVisible] = useState(false);
  const [selectedAccountingTopic, setSelectedAccountingTopic] = useState<Topic | null>(null);
  const [selectedAccountingQuestionFormat, setSelectedAccountingQuestionFormat] = useState<'mcq' | 'essay'>('mcq');

  // Business Enterprise and Skills Question Type Modal (Paper 1 MCQ, Paper 2 Essay)
  const [besQuestionTypeModalVisible, setBESQuestionTypeModalVisible] = useState(false);
  const [selectedBESTopic, setSelectedBESTopic] = useState<Topic | null>(null);
  const [selectedBESQuestionFormat, setSelectedBESQuestionFormat] = useState<'mcq' | 'essay'>('mcq');

  // Commerce Question Type Modal (Paper 1 MCQ, Paper 2 Essay)
  const [commerceQuestionTypeModalVisible, setCommerceQuestionTypeModalVisible] = useState(false);
  const [selectedCommerceTopic, setSelectedCommerceTopic] = useState<Topic | null>(null);
  const [selectedCommerceQuestionFormat, setSelectedCommerceQuestionFormat] = useState<'mcq' | 'essay'>('mcq');

  // Computer Science board (ZimSec vs Cambridge) â€” O-Level
  const [csBoard, setCsBoard] = useState<'zimsec' | 'cambridge'>('zimsec');
  // A-Level Computer Science board (ZIMSEC vs Cambridge 9618)
  const [aLevelCsBoard, setALevelCsBoard] = useState<'zimsec' | 'cambridge'>('zimsec');

  // Start Quiz Modal (single popup with Visual Learning toggle)
  const [startQuizModalVisible, setStartQuizModalVisible] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
  const [pendingQuestionType, setPendingQuestionType] = useState<string | undefined>(undefined);
  const [pendingQuestionFormat, setPendingQuestionFormat] = useState<'mcq' | 'structured' | 'essay' | undefined>(undefined);
  const [mixImagesEnabled, setMixImagesEnabled] = useState(false);

  // Exam Setup Modal state
  const [examSetupModalVisible, setExamSetupModalVisible] = useState(false);

  // Load persisted CS board when entering Computer Science (O-Level or A-Level)
  useEffect(() => {
    if (subject.id === 'computer_science') {
      AsyncStorage.getItem(CS_BOARD_STORAGE_KEY).then((v) => {
        if (v === 'cambridge' || v === 'zimsec') setCsBoard(v);
      });
    }
    if (subject.id === 'a_level_computer_science') {
      AsyncStorage.getItem(A_LEVEL_CS_BOARD_STORAGE_KEY).then((v) => {
        if (v === 'cambridge' || v === 'zimsec') setALevelCsBoard(v);
      });
    }
  }, [subject.id]);

  useEffect(() => {
    if (subject.id === 'combined_science') {
      loadTopics(activeTab);
    } else {
      loadTopics(currentParentSubject);
    }
  }, [currentParentSubject, activeTab, subject.id, csBoard, aLevelCsBoard, selectedHistoryForm, selectedMathForm]);

  const loadTopics = async (parent?: string) => {
    try {
      setLoading(true);
      if (subject.id === 'history') {
        setTopics(getHistoryTopicsForQuizByForm(selectedHistoryForm));
        setLoading(false);
        return;
      }
      if (subject.id === 'mathematics') {
        setTopics(getMathTopicsForQuizByForm(selectedMathForm));
        setLoading(false);
        return;
      }
      // If it's Combined Science, we always want to fetch topics for the specific sub-subject (Biology/Chemistry/Physics)
      const targetParent = subject.id === 'combined_science' ? parent : currentParentSubject;

      const data = await quizApi.getTopics(
        subject.id,
        targetParent,
        subject.id === 'computer_science' ? csBoard : subject.id === 'a_level_computer_science' ? aLevelCsBoard : undefined
      );

      // Fallback for Principles of Accounting if API returns empty
      if (subject.id === 'accounting' && (!data || data.length === 0)) {
        const accountingTopicList: Topic[] = accountingTopicsList.map((t) => ({
          id: t.id,
          name: t.name,
          subject: 'accounting',
        }));
        setTopics(accountingTopicList);
      } else if (subject.id === 'business_enterprise_skills' && (!data || data.length === 0)) {
        setTopics(besTopicsList);
      } else if (subject.id === 'commerce' && (!data || data.length === 0)) {
        const commerceTopicList: Topic[] = commerceTopicsList.map((t) => ({
          id: t.id,
          name: t.name,
          subject: 'commerce',
        }));
        setTopics(commerceTopicList);
      } else {
        setTopics(data);
      }
    } catch (error) {
      // Fallback for Principles of Accounting on error
      if (subject.id === 'accounting') {
        const accountingTopicList: Topic[] = accountingTopicsList.map((t) => ({
          id: t.id,
          name: t.name,
          subject: 'accounting',
        }));
        setTopics(accountingTopicList);
      } else if (subject.id === 'business_enterprise_skills') {
        setTopics(besTopicsList);
      } else if (subject.id === 'commerce') {
        const commerceTopicList: Topic[] = commerceTopicsList.map((t) => ({
          id: t.id,
          name: t.name,
          subject: 'commerce',
        }));
        setTopics(commerceTopicList);
      } else if (subject.id === 'mathematics') {
        setTopics(getMathTopicsForQuizByForm(selectedMathForm));
      } else if (subject.id === 'history') {
        setTopics(getHistoryTopicsForQuizByForm(selectedHistoryForm));
      } else {
        Alert.alert('Error', 'Failed to load topics. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTopicPress = async (topic: Topic) => {
    // Special case: "Signs" topic in OLEVEL goes directly to practice mode
    // (Teacher mode is now in the dashboard, so we skip the modal)
    if (topic.name.toLowerCase() === 'signs') {
      handleStartQuiz(topic);
      return;
    }

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
      setSelectedPharmaQuestionType('MCQ');
      setMixImagesEnabled(false);
      setPharmaModalVisible(true);
    } else if (subject.id === 'combined_science') {
      // Show Combined Science Question Type Modal (MCQ vs Structured - Paper 1 vs Paper 2)
      setSelectedScienceTopic(topic);
      setSelectedScienceQuestionFormat('mcq');
      setMixImagesEnabled(false);
      setScienceQuestionTypeModalVisible(true);
    } else if (subject.id === 'computer_science' || subject.id === 'a_level_computer_science') {
      // Show Computer Science Question Type Modal (O-Level or A-Level: MCQ, Structured, Essay)
      setSelectedCsTopic(topic);
      setSelectedCsQuestionType('mcq');
      setMixImagesEnabled(false);
      setCsQuestionTypeModalVisible(true);
    } else if (subject.id === 'a_level_geography') {
      // A-Level Geography: show MCQ / Structured / Essay choice (same as other A-Level subjects)
      setSelectedGeoTopic(topic);
      setSelectedGeoQuestionType('mcq');
      setMixImagesEnabled(false);
      setGeoQuestionTypeModalVisible(true);
    } else if (subject.id === 'accounting') {
      // Principles of Accounting: Paper 1 MCQs only â€“ no format modal
      openStartQuizModal(topic, undefined, 'mcq');
    } else if (subject.id === 'business_enterprise_skills') {
      // BES: Paper 1 (MCQ) or Paper 2 (Essay) â€“ show format modal
      setSelectedBESTopic(topic);
      setSelectedBESQuestionFormat('mcq');
      setBESQuestionTypeModalVisible(true);
    } else if (subject.id === 'commerce') {
      // Commerce: Paper 1 (MCQ) or Paper 2 (Essay) â€“ show format modal
      setSelectedCommerceTopic(topic);
      setSelectedCommerceQuestionFormat('mcq');
      setCommerceQuestionTypeModalVisible(true);
    } else if (subject.id === 'history') {
      // History: Paper 1 Essays only (3-part ZIMSEC format) â€“ go to History Essay screen
      navigation.navigate('HistoryEssay' as never, { topic, subject, formLevel: selectedHistoryForm } as never);
    } else {
      // Start quiz modal with visual learning toggle
      openStartQuizModal(topic);
    }
  };

  const openStartQuizModal = (topic?: Topic, questionType?: string, questionFormat?: 'mcq' | 'structured' | 'essay') => {
    setPendingTopic(topic || null);
    setPendingQuestionType(questionType);
    setPendingQuestionFormat(questionFormat);
    setMixImagesEnabled(false);
    setStartQuizModalVisible(true);
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

  const handleScienceNotes = () => {
    navigation.navigate('ScienceNotes' as never);
  };

  const handleTeacherMode = () => {
    const teacherModeParams: {
      preselectedSubject: string;
      preselectedForm?: HistoryFormLevel | MathFormLevel;
    } = {
      preselectedSubject: subject.id === 'combined_science' ? activeTab : subjectDisplayName,
    };

    if (subject.id === 'history') {
      teacherModeParams.preselectedForm = selectedHistoryForm;
    }
    if (subject.id === 'mathematics') {
      teacherModeParams.preselectedForm = selectedMathForm;
    }

    navigation.navigate('TeacherModeSetup' as never, teacherModeParams as never);
  };

  // Computer Science handlers
  const handleCsNotes = () => {
    navigation.navigate('ComputerScienceNotes' as never);
  };

  const handleCsVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const handleCsTeacherMode = () => {
    navigation.navigate('TeacherModeSetup' as never, {
      preselectedSubject: 'Computer Science',
    } as never);
  };

  // A-Level Computer Science handlers
  const handleALevelCsNotes = () => {
    navigation.navigate('ComputerScienceNotes' as never, {
      level: 'A-Level',
    } as never);
  };

  const handleALevelCsVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const handleALevelCsTeacherMode = () => {
    navigation.navigate('TeacherModeSetup' as never, {
      preselectedSubject: 'A-Level Computer Science',
    } as never);
  };

  const handleGeographyNotes = () => {
    navigation.navigate('GeographyNotes' as never, { subjectId: subject.id } as never);
  };

  const handleGeographyVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const handleGeographyTeacherMode = () => {
    // Pass 'A-Level Geography' for A-Level subject, 'Geography' for O-Level
    const geoSubject = subject.id === 'a_level_geography' ? 'A-Level Geography' : 'Geography';
    navigation.navigate('TeacherModeSetup' as never, {
      preselectedSubject: geoSubject,
    } as never);
  };

  const handleAccountingNotes = () => {
    navigation.navigate('AccountingNotes' as never);
  };

  const handleAccountingVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const handleAccountingTeacherMode = () => {
    navigation.navigate('TeacherModeSetup' as never, {
      preselectedSubject: 'Principles of Accounting',
    } as never);
  };

  const handleBESNotes = () => {
    navigation.navigate('BESNotes' as never);
  };

  const handleCommerceNotes = () => {
    navigation.navigate('CommerceNotes' as never);
  };

  const handleCommerceVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const handleCommerceTeacherMode = () => {
    navigation.navigate('TeacherModeSetup' as never, {
      preselectedSubject: 'Commerce',
    } as never);
  };

  const handleBESVirtualLab = () => {
    navigation.navigate('VirtualLab' as never);
  };

  const handleBESTeacherMode = () => {
    navigation.navigate('TeacherModeSetup' as never, {
      preselectedSubject: 'Business Enterprise and Skills',
    } as never);
  };

  const handleMathNotes = (topicName: string) => {
    navigation.navigate('MathNotesDetail' as never, { topic: topicName, formLevel: selectedMathForm } as never);
  };

  const handleMathTutor = (topicName: string) => {
    navigation.navigate('TeacherModeSetup' as never, {
      preselectedSubject: 'O Level Mathematics',
      preselectedTopic: topicName,
      preselectedForm: selectedMathForm,
    } as never);
  };

  const getEstimatedCost = (topic?: Topic | null, questionType?: string, questionFormat?: 'mcq' | 'structured', mixImages?: boolean) =>
    calculateQuizCreditCost({
      subject: subject.id,
      questionType: topic ? 'topical' : 'exam',
      questionFormat: questionFormat,
      bioQuestionType: questionType as 'mcq' | 'structured' | 'essay' | undefined,
      isImageQuestion: !!mixImages,
    });

  // Handle exam modal start
  const handleExamStart = async (config: ExamConfig, timeInfo: TimeInfo) => {
    setExamSetupModalVisible(false);
    // IMPORTANT: `ExamSessionScreen` creates the session. We only pass the config + time info.
    navigation.navigate('ExamSession' as never, {
      examConfig: config,
      timeInfo,
    } as never);
  };

  const handleStartQuiz = async (
    topic?: Topic,
    questionType?: string,
    questionFormat?: 'mcq' | 'structured',
    mixImages?: boolean
  ) => {
    try {
      const currentCredits = user?.credits || 0;

      // Calculate required credit cost based on subject/question type
      const creditCost = calculateQuizCreditCost({
        subject: subject.id,
        questionType: topic ? 'topical' : 'exam',
        questionFormat: questionFormat,
        bioQuestionType: questionType as 'mcq' | 'structured' | 'essay' | undefined,
        isImageQuestion: !!mixImages,
      });
      const minRequired = getMinimumCreditsForQuiz({
        subject: subject.id,
        questionType: topic ? 'topical' : 'exam',
        questionFormat: questionFormat,
        bioQuestionType: questionType as 'mcq' | 'structured' | 'essay' | undefined,
        isImageQuestion: !!mixImages,
      });

      // Check for low credits warning
      if (currentCredits <= 5 && currentCredits > 0) {
        showWarning(`âš ï¸ Low credits! You have ${currentCredits} credits remaining. Consider topping up soon.`, 5000);
      }

      if (currentCredits < minRequired) {
        const requiredText = formatCreditCost(minRequired);
        showError(`âŒ Insufficient credits! You need at least ${requiredText} to start a quiz. Please top up your credits.`, 6000);
        Alert.alert(
          'Insufficient Credits',
          `You need at least ${requiredText} to start a quiz. Please buy credits first.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Show AI loading progress
      setIsGeneratingQuestion(true);

      let question: Question | null = null;

      const canStreamMath = subject.id === 'mathematics' && !!topic?.id;
      if (canStreamMath) {
        try {
          question = await quizApi.generateQuestionStream(
            subject.id,
            topic?.id || 'Algebra',
            'medium',
            {
              onThinking: (update) => {
                if (update.content) {
                  setStreamingStatus(update.content);
                }
                if (update.stage && update.total_stages) {
                  setStreamingStage(`Thinking ${update.stage}/${update.total_stages}`);
                } else {
                  setStreamingStage('Thinking');
                }
              },
            },
            subject.id === 'mathematics' ? selectedMathForm : undefined
          );
        } catch (streamError) {
          console.warn('Streaming generation failed, falling back to standard generation', streamError);
        }
      }

      if (!question) {
        question = await quizApi.generateQuestion(
          subject.id,
          topic?.id,
          'medium',  // difficulty
          topic ? 'topical' : 'exam',  // type
          topic?.parent_subject || (subject.id === 'combined_science' ? activeTab : currentParentSubject),  // parent_subject for Combined Science
          questionType,  // Pass question type (e.g., for Pharmacology)
          questionFormat,  // Pass question format (mcq or structured for Paper 1/2)
          undefined,
          mixImages,
          undefined,  // questionCount
          subject.id === 'computer_science' ? csBoard : subject.id === 'a_level_computer_science' ? aLevelCsBoard : undefined,  // board for CS (O-Level or A-Level)
          subject.id === 'mathematics' ? selectedMathForm : undefined
        );
      }

      // Hide loading before navigation
      setIsGeneratingQuestion(false);
      setStreamingStatus(null);
      setStreamingStage(null);

      if (question) {
        // Update credits from server response
        const serverCredits = (question as any).credits_remaining;
        if (serverCredits !== undefined) {
          updateUser({ credits: serverCredits });
          // Show success notification with actual remaining credits
          const costText = formatCreditCost(creditCost);
          showSuccess(`âœ… Question generated! (-${costText}) ${serverCredits} credits remaining.`, 3000);

          // Check if credits are getting low after deduction
          if (serverCredits <= 3 && serverCredits > 0) {
            setTimeout(() => {
              showWarning(`âš ï¸ Running low on credits! Only ${serverCredits} credits left. Top up now to continue learning.`, 5000);
            }, 3500);
          }
        }

        navigation.navigate('Quiz' as never, {
          question,
          subject,
          topic,
          mixImagesEnabled: !!mixImages,
          ...(subject.id === 'mathematics' ? { mathForm: selectedMathForm } : {}),
          ...(questionType ? { questionType } : {}),
          ...(questionFormat ? { questionFormat } : {}),
          ...(subject.id === 'computer_science' ? { board: csBoard } : subject.id === 'a_level_computer_science' ? { board: aLevelCsBoard } : {}),
        } as never);
      } else {
        showError('âŒ Failed to generate question. Please try again.', 4000);
      }
    } catch (error: any) {
      setIsGeneratingQuestion(false);
      setStreamingStatus(null);
      setStreamingStage(null);
      const errorMessage = error.response?.data?.message || 'Failed to start quiz';
      showError(`âŒ ${errorMessage}`, 5000);
      Alert.alert('Error', errorMessage);
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
    if (subject.id === 'english') return [Colors.subjects.english, Colors.warning.dark];
    if (subject.id === 'computer_science') return [Colors.subjects.combinedScience, Colors.info.dark];
    if (subject.id === 'geography' || subject.id === 'a_level_geography') return ['#2E7D32', Colors.secondary.dark];
    if (subject.id === 'accounting') return ['#B8860B', Colors.secondary.dark];
    if (subject.id === 'business_enterprise_skills') return ['#2E7D32', Colors.secondary.dark];
    if (subject.id === 'commerce') return ['#B8860B', Colors.secondary.dark];
    if (subject.id === 'history') return ['#5D4037', Colors.secondary.dark];
    const gradient = Colors.gradients?.primary;
    return (Array.isArray(gradient) && gradient.length >= 2 && gradient.every(Boolean))
      ? gradient as [string, string]
      : ['#7C4DFF', '#3F1DCB'];
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
    centerContainer: {
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      color: themedColors.text.secondary,
      fontSize: 16,
    },
    header: {
      paddingTop: 50,
      paddingBottom: 30,
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
      alignItems: 'flex-start',
      gap: 12,
    },
    headerTextContainer: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontSize: isCompactScreen ? 24 : 28,
      fontWeight: 'bold',
      color: Colors.text.white,
      marginBottom: 8,
      flexShrink: 1,
    },
    subtitle: {
      fontSize: isCompactScreen ? 14 : 16,
      color: Colors.text.white,
      opacity: 0.9,
      flexShrink: 1,
      lineHeight: isCompactScreen ? 19 : 22,
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
      borderColor: themedColors.border.medium,
      backgroundColor: themedColors.background.paper,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: themedColors.text.secondary,
      textAlign: 'center',
      flexShrink: 1,
    },
    activeTabText: {
      color: Colors.text.white,
      fontWeight: 'bold',
    },
    boardSwitchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      gap: 8,
      maxWidth: isCompactScreen ? 170 : 230,
      minWidth: 0,
    },
    featuresContainer: {
      padding: isCompactScreen ? 14 : 20,
      paddingTop: 10,
    },
    featureCard: {
      marginBottom: 12,
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
      borderWidth: 1,
    },
    historyFormSelectorContainer: {
      marginBottom: 12,
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
    },
    historyFormSelectorLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: themedColors.text.secondary,
      marginBottom: 8,
    },
    historyFormChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 18,
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'rgba(93, 64, 55, 0.3)',
      backgroundColor: 'rgba(93, 64, 55, 0.06)',
    },
    historyFormChipActive: {
      borderColor: '#5D4037',
      backgroundColor: '#5D4037',
    },
    historyFormChipText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#5D4037',
    },
    historyFormChipTextActive: {
      color: '#FFFFFF',
    },
    mathFormSelectorContainer: {
      marginBottom: 12,
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
    },
    mathFormSelectorLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: themedColors.text.secondary,
      marginBottom: 8,
    },
    mathFormChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 18,
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'rgba(25, 118, 210, 0.35)',
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
    mathFormChipActive: {
      borderColor: Colors.subjects.mathematics,
      backgroundColor: Colors.subjects.mathematics,
    },
    mathFormChipText: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.subjects.mathematics,
    },
    mathFormChipTextActive: {
      color: '#FFFFFF',
    },
    featureContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      gap: 16,
      minWidth: 0,
    },
    featureInfo: {
      flex: 1,
      minWidth: 0,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: themedColors.text.primary,
      marginBottom: 4,
      flexShrink: 1,
    },
    featureSubtitle: {
      fontSize: 14,
      color: themedColors.text.secondary,
      lineHeight: 20,
      flexShrink: 1,
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
      padding: isCompactScreen ? 14 : 20,
      paddingTop: 10,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: themedColors.text.primary,
      marginBottom: 16,
      marginLeft: 4,
    },
    topicCard: {
      marginBottom: 12,
      backgroundColor: themedColors.background.paper,
      borderColor: themedColors.border.light,
      borderWidth: 1,
    },
    topicContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: isCompactScreen ? 2 : 4,
      gap: isCompactScreen ? 12 : 16,
      minWidth: 0,
    },
    topicInfo: {
      flex: 1,
      minWidth: 0,
    },
    topicName: {
      fontSize: isCompactScreen ? 16 : 18,
      fontWeight: '600',
      color: themedColors.text.primary,
      flexShrink: 1,
    },
    topicSubtitle: {
      fontSize: 12,
      color: themedColors.text.secondary,
      marginTop: 4,
      flexShrink: 1,
    },
    noTopicsText: {
      fontSize: 14,
      color: themedColors.text.secondary,
      textAlign: 'center',
      marginTop: 20,
    },
    mathNotesSection: {
      backgroundColor: themedColors.background.paper,
      borderRadius: 18,
      padding: isCompactScreen ? 12 : 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: themedColors.border.light,
    },
    mathNotesHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    mathNotesHeaderActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    mathNotesHeaderContent: {
      flex: 1,
      marginRight: 12,
    },
    mathNotesBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'rgba(25, 118, 210, 0.28)',
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      gap: 4,
    },
    mathNotesBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.subjects.mathematics,
    },
    mathNotesChevron: {
      marginLeft: 8,
    },
    mathNotesSectionTitle: {
      fontSize: isCompactScreen ? 16 : 18,
      fontWeight: 'bold',
      color: themedColors.text.primary,
      marginBottom: 2,
    },
    mathNotesSectionSubtitle: {
      fontSize: 13,
      color: themedColors.text.secondary,
    },
    mathTopicsWrap: {
      marginTop: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    mathTopicChip: {
      width: isNarrowScreen ? '100%' : '48.5%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 14,
      marginBottom: 10,
      borderWidth: 1,
    },
    mathTopicIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
    },
    mathTopicChipText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: themedColors.text.primary,
    },
    backButton: {
      fontSize: 16,
      color: Colors.text.white,
      opacity: 0.9,
      flexShrink: 1,
    },
    modalDescription: {
      fontSize: 16,
      color: themedColors.text.primary,
      marginBottom: 20,
      textAlign: 'center',
    },
    choiceCard: {
      backgroundColor: themedColors.background.paper,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: themedColors.border.light,
    },
    choiceCardSelected: {
      borderColor: Colors.primary.main,
      backgroundColor: Colors.primary.light + '20',
    },
    choiceTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: themedColors.text.primary,
      marginBottom: 4,
    },
    choiceDescription: {
      fontSize: 12,
      color: themedColors.text.secondary,
    },
    visualModeContainer: {
      backgroundColor: themedColors.background.subtle,
      borderRadius: 12,
      padding: 12,
      marginTop: 4,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: themedColors.border.light,
    },
    visualModeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    visualModeTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: themedColors.text.primary,
    },
    visualModeNote: {
      fontSize: 12,
      color: themedColors.text.secondary,
      marginBottom: 4,
    },
    visualModeCost: {
      fontSize: 12,
      color: themedColors.text.primary,
      fontWeight: '600',
    },
    modalButtonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: Colors.primary.main,
    },
    startButton: {
      backgroundColor: Colors.primary.main,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.primary.main,
      textAlign: 'center',
      flexShrink: 1,
    },
    startButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
      flexShrink: 1,
    },
    modalButtonSpacer: {
      width: 12,
    },
  }), [themedColors, isCompactScreen, isNarrowScreen]);

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
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      {/* AI Loading Progress Overlay */}
      <LoadingProgress
        visible={isGeneratingQuestion}
        message={overlayMessage}
        estimatedTime={6}
        stage={overlayStage}
        steps={subjectSteps}
      />

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={themedColors.background.default}
      />

      {/* Professional Header */}
      <LinearGradient
        colors={getHeaderGradient() ?? ['#7C4DFF', '#3F1DCB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
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
              <Text style={styles.backButton}>â† Back</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {subject.id === 'combined_science' ? activeTab : (currentParentSubject || subject.name)}
            </Text>
            <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">
              {subject.id === 'combined_science'
                ? `Master ${activeTab} concepts`
                : (currentParentSubject ? 'Choose a subtopic' : 'Choose a topic or start an exam')}
            </Text>
          </View>
          {(subject.id === 'computer_science' || subject.id === 'a_level_computer_science') ? (
            <View style={styles.boardSwitchContainer}>
              {(() => {
                const isALevel = subject.id === 'a_level_computer_science';
                const board = isALevel ? aLevelCsBoard : csBoard;
                const setBoard = isALevel ? setALevelCsBoard : setCsBoard;
                const storageKey = isALevel ? A_LEVEL_CS_BOARD_STORAGE_KEY : CS_BOARD_STORAGE_KEY;
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setBoard('zimsec');
                        AsyncStorage.setItem(storageKey, 'zimsec');
                      }}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                        backgroundColor: board === 'zimsec' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      <Text
                        style={{ color: board === 'zimsec' ? '#1976d2' : '#fff', fontWeight: '600', fontSize: 13 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        ZIMSEC
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setBoard('cambridge');
                        AsyncStorage.setItem(storageKey, 'cambridge');
                      }}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                        backgroundColor: board === 'cambridge' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      <Text
                        style={{ color: board === 'cambridge' ? '#1976d2' : '#fff', fontWeight: '600', fontSize: 13 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Cambridge
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              })()}
            </View>
          ) : (
            getSubjectIcon(subject.id)
          )}
        </View>
      </LinearGradient>

      {/* Tabs for Combined Science */}
      {renderTabs()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Special Features */}
        <View style={styles.featuresContainer}>
          {subject.id === 'mathematics' && (
            <>
              <View style={styles.mathFormSelectorContainer}>
                <Text style={styles.mathFormSelectorLabel}>Select Mathematics Form</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {mathFormLevels.map((form) => {
                    const isActive = form === selectedMathForm;
                    return (
                      <TouchableOpacity
                        key={form}
                        style={[styles.mathFormChip, isActive && styles.mathFormChipActive]}
                        onPress={() => setSelectedMathForm(form)}
                      >
                        <Text style={[styles.mathFormChipText, isActive && styles.mathFormChipTextActive]}>
                          {form}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Math Notes Section - All Topics */}
              <View style={styles.mathNotesSection}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mathNotesHeaderRow}
                  onPress={() => setIsMathNotesExpanded((prev) => !prev)}
                >
                  <View style={styles.mathNotesHeaderContent}>
                    <Text style={styles.mathNotesSectionTitle}>Mathematics Notes</Text>
                    <Text style={styles.mathNotesSectionSubtitle}>
                      {selectedMathForm} topical notes {isMathNotesExpanded ? '- tap to collapse' : '- tap to expand'}
                    </Text>
                  </View>
                  <View style={styles.mathNotesHeaderActions}>
                    <View style={styles.mathNotesBadge}>
                      <Ionicons name="sparkles-outline" size={14} color={Colors.subjects.mathematics} />
                      <Text style={styles.mathNotesBadgeText}>Pro</Text>
                    </View>
                    <Ionicons
                      name={isMathNotesExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Colors.subjects.mathematics}
                      style={styles.mathNotesChevron}
                    />
                  </View>
                </TouchableOpacity>
                {isMathNotesExpanded && (
                  <View style={styles.mathTopicsWrap}>
                    {(topics && topics.length > 0
                      ? topics.map(t => t.name)
                      : [
                        'Number Theory',
                        'Sets',
                        'Indices & Standard Form',
                        'Algebra',
                        'Inequalities',
                        'Sequences & Series',
                        'Matrices',
                        'Vectors',
                        'Geometry',
                        'Mensuration',
                        'Trigonometry',
                        'Transformation Geometry',
                        'Statistics',
                        'Probability',
                        'Graphs',
                        'Variation',
                        'Loci & Construction',
                      ]
                    ).map((topicName) => {
                      const mathVisual = getMathTopicVisual(topicName);
                      return (
                        <TouchableOpacity
                          key={topicName}
                          style={[
                            styles.mathTopicChip,
                            {
                              borderColor: mathVisual.color,
                              backgroundColor: mathVisual.bg,
                            },
                          ]}
                          onPress={() => handleMathNotes(topicName)}
                        >
                          <View style={styles.mathTopicIconWrap}>
                            <Ionicons name={mathVisual.iconName as any} size={16} color={mathVisual.color} />
                          </View>
                          <Text style={styles.mathTopicChipText}>{topicName}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* AI Math Tutor */}
              <Card
                variant="elevated"
                onPress={() => handleMathTutor('Quadratic Equations')}
                style={[styles.featureCard, { borderLeftColor: Colors.secondary.main, borderLeftWidth: 4 }]}
              >
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="chatbubbles-outline" size={28} color={Colors.secondary.main} />}
                    size={56}
                    backgroundColor="rgba(0, 229, 255, 0.1)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>AI Math Tutor</Text>
                    <Text style={styles.featureSubtitle}>Interactive Socratic tutoring with graphs</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              {/* Graph Practice */}
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

              {/* Scan & Solve - Offline Math Solver */}
              <Card
                variant="elevated"
                onPress={() => navigation.navigate('MathSolver' as never)}
                style={[
                  styles.featureCard,
                  {
                    borderLeftColor: '#4CAF50',
                    borderLeftWidth: 4,
                    borderWidth: 2,
                    borderColor: '#4CAF50',
                  }
                ]}
              >
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="camera" size={28} color="#4CAF50" />}
                    size={56}
                    backgroundColor="rgba(76, 175, 80, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text style={styles.featureTitle}>Scan & Solve</Text>
                      <View style={{
                        backgroundColor: '#4CAF50',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 10,
                      }}>
                        <Text style={{
                          color: '#FFF',
                          fontSize: 10,
                          fontWeight: '700',
                          letterSpacing: 0.5,
                        }}>OFFLINE</Text>
                      </View>
                    </View>
                    <Text style={styles.featureSubtitle}>Snap a photo or type any math problem - works completely offline!</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
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
            <>
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

              <Card variant="elevated" onPress={handleScienceNotes} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={Icons.comprehension(28, Colors.subjects.science)}
                    size={56}
                    backgroundColor={Colors.iconBg.science}
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Science Notes</Text>
                    <Text style={styles.featureSubtitle}>Comprehensive notes for {activeTab}</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleTeacherMode} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={Icons.quiz(28, Colors.subjects.combinedScience)}
                    size={56}
                    backgroundColor={Colors.iconBg.science}
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for {activeTab} topics</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* Geography Features - Notes, Virtual Labs, Teacher Mode */}
          {(subject.id === 'geography' || subject.id === 'a_level_geography') && !currentParentSubject && (
            <>
              <Card variant="elevated" onPress={handleGeographyNotes} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="book-outline" size={28} color="#2E7D32" />}
                    size={56}
                    backgroundColor="rgba(46, 125, 50, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Geography Notes</Text>
                    <Text style={styles.featureSubtitle}>{subject.id === 'a_level_geography' ? 'A-Level ZIMSEC Geography notes' : 'All Level ZIMSEC Geography notes'}</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleGeographyVirtualLab} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="map-outline" size={28} color="#2E7D32" />}
                    size={56}
                    backgroundColor="rgba(46, 125, 50, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Virtual Labs</Text>
                    <Text style={styles.featureSubtitle}>Interactive Geography fieldwork simulations</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleGeographyTeacherMode} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="school-outline" size={28} color="#2E7D32" />}
                    size={56}
                    backgroundColor="rgba(46, 125, 50, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for {subject.id === 'a_level_geography' ? 'A-Level' : 'ZIMSEC'} Geography topics</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* Computer Science Features - Notes, Virtual Labs, Teacher Mode */}
          {subject.id === 'computer_science' && !currentParentSubject && (
            <>
              <Card variant="elevated" onPress={handleCsNotes} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="document-text-outline" size={28} color="#0288D1" />}
                    size={56}
                    backgroundColor="rgba(2, 136, 209, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Computer Science Notes</Text>
                    <Text style={styles.featureSubtitle}>Comprehensive notes for all topics</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleCsVirtualLab} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="flask-outline" size={28} color="#0288D1" />}
                    size={56}
                    backgroundColor="rgba(2, 136, 209, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Virtual Labs</Text>
                    <Text style={styles.featureSubtitle}>Interactive computer science experiments</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleCsTeacherMode} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="school-outline" size={28} color="#0288D1" />}
                    size={56}
                    backgroundColor="rgba(2, 136, 209, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for Computer Science topics</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* A-Level Computer Science Features - Notes, Virtual Labs, Teacher Mode */}
          {subject.id === 'a_level_computer_science' && !currentParentSubject && (
            <>
              <Card variant="elevated" onPress={handleALevelCsNotes} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="document-text-outline" size={28} color="#7B1FA2" />}
                    size={56}
                    backgroundColor="rgba(123, 31, 162, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>A-Level CS Notes</Text>
                    <Text style={styles.featureSubtitle}>Comprehensive A-Level Computer Science notes</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleALevelCsVirtualLab} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="code-slash-outline" size={28} color="#7B1FA2" />}
                    size={56}
                    backgroundColor="rgba(123, 31, 162, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Virtual Labs</Text>
                    <Text style={styles.featureSubtitle}>Interactive programming and database labs</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleALevelCsTeacherMode} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="school-outline" size={28} color="#7B1FA2" />}
                    size={56}
                    backgroundColor="rgba(123, 31, 162, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for A-Level Computer Science topics</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* Principles of Accounting Features - Notes, Virtual Labs, Teacher Mode */}
          {subject.id === 'accounting' && !currentParentSubject && (
            <>
              <Card variant="elevated" onPress={handleAccountingNotes} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="document-text-outline" size={28} color="#B8860B" />}
                    size={56}
                    backgroundColor="rgba(184, 134, 11, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Accounting Notes</Text>
                    <Text style={styles.featureSubtitle}>Principles of Accounting (7112) study notes</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleAccountingVirtualLab} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="flask-outline" size={28} color="#B8860B" />}
                    size={56}
                    backgroundColor="rgba(184, 134, 11, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Virtual Labs</Text>
                    <Text style={styles.featureSubtitle}>Interactive accounting simulations</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleAccountingTeacherMode} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="school-outline" size={28} color="#B8860B" />}
                    size={56}
                    backgroundColor="rgba(184, 134, 11, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for Principles of Accounting</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* Commerce Features - Notes, Virtual Labs, Teacher Mode */}
          {subject.id === 'commerce' && !currentParentSubject && (
            <>
              <Card variant="elevated" onPress={handleCommerceNotes} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="document-text-outline" size={28} color="#B8860B" />}
                    size={56}
                    backgroundColor="rgba(184, 134, 11, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Commerce Notes</Text>
                    <Text style={styles.featureSubtitle}>ZIMSEC O-Level Principles of Commerce study notes</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleCommerceVirtualLab} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="flask-outline" size={28} color="#B8860B" />}
                    size={56}
                    backgroundColor="rgba(184, 134, 11, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Virtual Labs</Text>
                    <Text style={styles.featureSubtitle}>Interactive commerce and business simulations</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleCommerceTeacherMode} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="school-outline" size={28} color="#B8860B" />}
                    size={56}
                    backgroundColor="rgba(184, 134, 11, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for Principles of Commerce</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* History Features - Notes, Teacher Mode */}
          {subject.id === 'history' && !currentParentSubject && (
            <>
              <View style={styles.historyFormSelectorContainer}>
                <Text style={styles.historyFormSelectorLabel}>Select History Form</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {historyFormLevels.map((form) => {
                    const isActive = form === selectedHistoryForm;
                    return (
                      <TouchableOpacity
                        key={form}
                        style={[styles.historyFormChip, isActive && styles.historyFormChipActive]}
                        onPress={() => setSelectedHistoryForm(form)}
                      >
                        <Text style={[styles.historyFormChipText, isActive && styles.historyFormChipTextActive]}>
                          {form}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <Card
                variant="elevated"
                onPress={() => navigation.navigate('HistoryNotes' as never, { formLevel: selectedHistoryForm } as never)}
                style={styles.featureCard}
              >
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="book-outline" size={28} color="#5D4037" />}
                    size={56}
                    backgroundColor="rgba(93, 64, 55, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>History Notes</Text>
                    <Text style={styles.featureSubtitle}>{selectedHistoryForm} history notes and summaries</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={() => navigation.navigate('TeacherModeSetup' as never, { preselectedSubject: 'History', preselectedForm: selectedHistoryForm } as never)} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="school-outline" size={28} color="#5D4037" />}
                    size={56}
                    backgroundColor="rgba(93, 64, 55, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>History Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for History topics</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* Business Enterprise and Skills Features - Notes, Virtual Labs, Teacher Mode */}
          {subject.id === 'business_enterprise_skills' && !currentParentSubject && (
            <>
              <Card variant="elevated" onPress={handleBESNotes} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="document-text-outline" size={28} color="#2E7D32" />}
                    size={56}
                    backgroundColor="rgba(46, 125, 50, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Business Enterprise Skills Notes</Text>
                    <Text style={styles.featureSubtitle}>Business Enterprise and Skills (4048) study notes</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleBESVirtualLab} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="flask-outline" size={28} color="#2E7D32" />}
                    size={56}
                    backgroundColor="rgba(46, 125, 50, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Virtual Labs</Text>
                    <Text style={styles.featureSubtitle}>Interactive business enterprise simulations</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>

              <Card variant="elevated" onPress={handleBESTeacherMode} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <IconCircle
                    icon={<Ionicons name="school-outline" size={28} color="#2E7D32" />}
                    size={56}
                    backgroundColor="rgba(46, 125, 50, 0.15)"
                  />
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureTitle}>Teacher Mode</Text>
                    <Text style={styles.featureSubtitle}>AI tutor for Business Enterprise and Skills</Text>
                  </View>
                  {Icons.arrowRight(24, Colors.text.secondary)}
                </View>
              </Card>
            </>
          )}

          {/* Exam Quiz Card - Only show at top level or for Combined Science tabs */}
          {(!currentParentSubject || subject.id === 'combined_science') && (
            <Card
              variant="gradient"
              gradientColors={getHeaderGradient()}
              onPress={() => {
                if (subject.id === 'mathematics') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'combined_science') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'english') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'computer_science') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'a_level_computer_science') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'geography' || subject.id === 'a_level_geography') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'accounting') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'business_enterprise_skills') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'commerce') {
                  setExamSetupModalVisible(true);
                } else if (subject.id === 'history') {
                  setExamSetupModalVisible(true);
                } else {
                  openStartQuizModal();
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
                  <Text style={styles.examTitle}>Start {subject.id === 'combined_science' ? activeTab : subject.id === 'mathematics' ? `${selectedMathForm} Mathematics` : subject.id === 'computer_science' ? 'Computer Science' : subject.id === 'a_level_computer_science' ? 'A-Level Computer Science' : subject.id === 'geography' ? 'Geography' : subject.id === 'a_level_geography' ? 'A-Level Geography' : subject.id === 'accounting' ? 'Principles of Accounting' : subject.id === 'business_enterprise_skills' ? 'Business Enterprise and Skills' : subject.id === 'commerce' ? 'Commerce' : subject.id === 'history' ? `${selectedHistoryForm} History` : ''} Exam</Text>
                  <Text style={styles.examSubtitle}>Mixed questions from all {subject.id === 'combined_science' ? activeTab : subject.id === 'mathematics' ? `${selectedMathForm} Mathematics` : subject.id === 'computer_science' ? 'Computer Science' : subject.id === 'a_level_computer_science' ? 'A-Level Computer Science' : subject.id === 'geography' ? 'Geography' : subject.id === 'a_level_geography' ? 'A-Level Geography' : subject.id === 'accounting' ? 'Principles of Accounting' : subject.id === 'business_enterprise_skills' ? 'Business Enterprise and Skills' : subject.id === 'commerce' ? 'Commerce' : subject.id === 'history' ? `${selectedHistoryForm} History` : ''} topics</Text>
                </View>
              </View>
            </Card>
          )}
        </View>

        {/* Topics List */}
        <View style={styles.topicsContainer}>
          <Text style={styles.sectionTitle}>
            {currentParentSubject
              ? 'Subtopics'
              : subject.id === 'history'
                ? `${selectedHistoryForm} Topics`
                : subject.id === 'mathematics'
                  ? `${selectedMathForm} Topics`
                : 'Topics'}
          </Text>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary.main} />
            </View>
          ) : (
            <>
              {topics.length === 0 && (
                <Text style={styles.noTopicsText}>
                  {subject.id === 'history'
                    ? `No topics available for ${selectedHistoryForm} yet.`
                    : subject.id === 'mathematics'
                      ? `No topics available for ${selectedMathForm} yet.`
                    : `No topics available for ${activeTab}`}
                </Text>
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
                        <Text style={styles.topicName} numberOfLines={2} ellipsizeMode="tail">{topic.name}</Text>
                        {topic.is_parent && subject.id !== 'combined_science' && (
                          <Text style={styles.topicSubtitle} numberOfLines={1} ellipsizeMode="tail">Tap to view subtopics</Text>
                        )}
                      </View>
                      {Icons.arrowRight(24, Colors.text.secondary)}
                    </View>
                  </Card>
                ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Pharma Modal */}
      <Modal
        visible={pharmaModalVisible}
        onClose={() => {
          setPharmaModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title="Pharmacology Practice"
      >
        <Text style={styles.modalDescription}>Choose how you want to practice {selectedPharmaTopic?.name}:</Text>
        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedPharmaQuestionType === 'MCQ' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedPharmaQuestionType('MCQ')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Multiple Choice</Text>
          <Text style={styles.choiceDescription}>Standard 4-option questions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedPharmaQuestionType === 'True/False' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedPharmaQuestionType('True/False')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>True / False</Text>
          <Text style={styles.choiceDescription}>Quick concept verification</Text>
        </TouchableOpacity>
        <View style={styles.visualModeContainer}>
          <View style={styles.visualModeHeader}>
            <Text style={styles.visualModeTitle}>Visual learning mode</Text>
            <Switch
              value={mixImagesEnabled}
              onValueChange={setMixImagesEnabled}
              thumbColor={mixImagesEnabled ? Colors.primary.main : '#ccc'}
              trackColor={{ false: '#ccc', true: Colors.primary.light }}
            />
          </View>
          <Text style={styles.visualModeNote}>
            Mix image-based questions (higher credit cost).
          </Text>
          <Text style={styles.visualModeCost}>
            Estimated cost: {formatCreditCost(getEstimatedCost(selectedPharmaTopic, selectedPharmaQuestionType, undefined, mixImagesEnabled))} per question
          </Text>
        </View>
        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setPharmaModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setPharmaModalVisible(false);
              if (selectedPharmaTopic) {
                handleStartQuiz(selectedPharmaTopic, selectedPharmaQuestionType, undefined, mixImagesEnabled);
              }
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Combined Science Question Type Modal (Paper 1 vs Paper 2) */}
      <Modal
        visible={scienceQuestionTypeModalVisible}
        onClose={() => {
          setScienceQuestionTypeModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title={`${activeTab} - ${selectedScienceTopic?.name || 'Practice'}`}
      >
        <Text style={styles.modalDescription}>Choose your question format:</Text>
        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedScienceQuestionFormat === 'mcq' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedScienceQuestionFormat('mcq')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Multiple Choice (Paper 1)</Text>
          <Text style={styles.choiceDescription}>Quick MCQ questions with 4 options - great for revision</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedScienceQuestionFormat === 'structured' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedScienceQuestionFormat('structured')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Structured (Paper 2)</Text>
          <Text style={styles.choiceDescription}>ZIMSEC-style written questions with multiple parts - deeper understanding</Text>
        </TouchableOpacity>
        <View style={styles.visualModeContainer}>
          <View style={styles.visualModeHeader}>
            <Text style={styles.visualModeTitle}>Visual learning mode</Text>
            <Switch
              value={mixImagesEnabled}
              onValueChange={setMixImagesEnabled}
              thumbColor={mixImagesEnabled ? Colors.subjects.science : '#ccc'}
              trackColor={{ false: '#ccc', true: Colors.subjects.science + '66' }}
            />
          </View>
          <Text style={styles.visualModeNote}>
            Mix image-based questions (higher credit cost).
          </Text>
          <Text style={styles.visualModeCost}>
            Estimated cost: {formatCreditCost(getEstimatedCost(selectedScienceTopic, undefined, selectedScienceQuestionFormat, mixImagesEnabled))} per question
          </Text>
        </View>
        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setScienceQuestionTypeModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setScienceQuestionTypeModalVisible(false);
              if (selectedScienceTopic) {
                handleStartQuiz(selectedScienceTopic, undefined, selectedScienceQuestionFormat, mixImagesEnabled);
              }
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Computer Science Question Type Modal */}
      <Modal
        visible={csQuestionTypeModalVisible}
        onClose={() => {
          setCsQuestionTypeModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title={`${selectedCsTopic?.name || (subject.id === 'a_level_computer_science' ? 'A-Level Computer Science' : 'Computer Science')}`}
      >
        <Text style={styles.modalDescription}>Choose your question format:</Text>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedCsQuestionType === 'mcq' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedCsQuestionType('mcq')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Multiple Choice</Text>
          <Text style={styles.choiceDescription}>Quick revision questions with clear explanations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedCsQuestionType === 'structured' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedCsQuestionType('structured')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Structured Questions</Text>
          <Text style={styles.choiceDescription}>Multi-part written questions for deep understanding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedCsQuestionType === 'essay' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedCsQuestionType('essay')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Essay / Discussion</Text>
          <Text style={styles.choiceDescription}>Extended response questions to practice analysis</Text>
        </TouchableOpacity>

        <Text style={[styles.visualModeCost, { marginTop: 12 }]}>
          Estimated cost: {formatCreditCost(getEstimatedCost(selectedCsTopic, selectedCsQuestionType, undefined, false))} per question
        </Text>

        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setCsQuestionTypeModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setCsQuestionTypeModalVisible(false);
              if (selectedCsTopic) {
                // Pass the selected type as questionType argument
                handleStartQuiz(selectedCsTopic, selectedCsQuestionType, undefined, false);
              }
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Principles of Accounting Question Type Modal (Paper 1 MCQ only; Paper 2 kept for future) */}
      <Modal
        visible={accountingQuestionTypeModalVisible}
        onClose={() => {
          setAccountingQuestionTypeModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title={`Principles of Accounting â€“ ${selectedAccountingTopic?.name || 'Topic'}`}
      >
        <Text style={styles.modalDescription}>Choose Paper 1 (MCQ) or Paper 2 (Essay):</Text>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedAccountingQuestionFormat === 'mcq' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedAccountingQuestionFormat('mcq')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Paper 1 (MCQ)</Text>
          <Text style={styles.choiceDescription}>Multiple choice questions for quick revision</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedAccountingQuestionFormat === 'essay' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedAccountingQuestionFormat('essay')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Paper 2 (Essay)</Text>
          <Text style={styles.choiceDescription}>Extended essay questions with text and image upload</Text>
        </TouchableOpacity>

        <Text style={[styles.visualModeCost, { marginTop: 12 }]}>
          Estimated cost: {formatCreditCost(getEstimatedCost(selectedAccountingTopic, undefined, selectedAccountingQuestionFormat, false))} per question
        </Text>

        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setAccountingQuestionTypeModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setAccountingQuestionTypeModalVisible(false);
              if (selectedAccountingTopic) {
                handleStartQuiz(selectedAccountingTopic, undefined, selectedAccountingQuestionFormat, false);
              }
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Commerce Question Type Modal (Paper 1 MCQ, Paper 2 Essay) */}
      <Modal
        visible={commerceQuestionTypeModalVisible}
        onClose={() => {
          setCommerceQuestionTypeModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title={`Commerce â€“ ${selectedCommerceTopic?.name || 'Topic'}`}
      >
        <Text style={styles.modalDescription}>Choose Paper 1 (MCQ) or Paper 2 (Essay):</Text>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedCommerceQuestionFormat === 'mcq' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedCommerceQuestionFormat('mcq')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Paper 1 (MCQ)</Text>
          <Text style={styles.choiceDescription}>Multiple choice questions for quick revision</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedCommerceQuestionFormat === 'essay' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedCommerceQuestionFormat('essay')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Paper 2 (Essay)</Text>
          <Text style={styles.choiceDescription}>Extended essay questions with text and image upload</Text>
        </TouchableOpacity>

        <Text style={[styles.visualModeCost, { marginTop: 12 }]}>
          Estimated cost: {formatCreditCost(getEstimatedCost(selectedCommerceTopic, undefined, selectedCommerceQuestionFormat, false))} per question
        </Text>

        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setCommerceQuestionTypeModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setCommerceQuestionTypeModalVisible(false);
              if (selectedCommerceTopic) {
                handleStartQuiz(selectedCommerceTopic, undefined, selectedCommerceQuestionFormat, false);
              }
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Business Enterprise and Skills Question Type Modal (Paper 1 MCQ, Paper 2 Essay) */}
      <Modal
        visible={besQuestionTypeModalVisible}
        onClose={() => {
          setBESQuestionTypeModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title={`Business Enterprise and Skills â€“ ${selectedBESTopic?.name || 'Topic'}`}
      >
        <Text style={styles.modalDescription}>Choose Paper 1 (MCQ) or Paper 2 (Essay):</Text>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedBESQuestionFormat === 'mcq' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedBESQuestionFormat('mcq')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Paper 1 (MCQ)</Text>
          <Text style={styles.choiceDescription}>Multiple choice questions for quick revision</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedBESQuestionFormat === 'essay' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedBESQuestionFormat('essay')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Paper 2 (Essay)</Text>
          <Text style={styles.choiceDescription}>Extended essay questions with text and image upload</Text>
        </TouchableOpacity>

        <Text style={[styles.visualModeCost, { marginTop: 12 }]}>
          Estimated cost: {formatCreditCost(getEstimatedCost(selectedBESTopic, undefined, selectedBESQuestionFormat, false))} per question
        </Text>

        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setBESQuestionTypeModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setBESQuestionTypeModalVisible(false);
              if (selectedBESTopic) {
                handleStartQuiz(selectedBESTopic, undefined, selectedBESQuestionFormat, false);
              }
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* A-Level Geography Question Type Modal */}
      <Modal
        visible={geoQuestionTypeModalVisible}
        onClose={() => {
          setGeoQuestionTypeModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title={`A-Level Geography â€“ ${selectedGeoTopic?.name || 'Topic'}`}
      >
        <Text style={styles.modalDescription}>Choose your question format:</Text>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedGeoQuestionType === 'mcq' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedGeoQuestionType('mcq')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Multiple Choice</Text>
          <Text style={styles.choiceDescription}>Quick revision questions with clear explanations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedGeoQuestionType === 'structured' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedGeoQuestionType('structured')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Structured Questions</Text>
          <Text style={styles.choiceDescription}>Multi-part written questions for deep understanding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            selectedGeoQuestionType === 'essay' && styles.choiceCardSelected,
          ]}
          onPress={() => setSelectedGeoQuestionType('essay')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceTitle}>Essay / Discussion</Text>
          <Text style={styles.choiceDescription}>Extended response questions to practice analysis</Text>
        </TouchableOpacity>

        <Text style={[styles.visualModeCost, { marginTop: 12 }]}>
          Estimated cost: {formatCreditCost(getEstimatedCost(selectedGeoTopic, selectedGeoQuestionType, undefined, false))} per question
        </Text>

        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setGeoQuestionTypeModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setGeoQuestionTypeModalVisible(false);
              if (selectedGeoTopic) {
                handleStartQuiz(selectedGeoTopic, selectedGeoQuestionType, undefined, false);
              }
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Start Quiz Modal */}
      <Modal
        visible={startQuizModalVisible}
        onClose={() => {
          setStartQuizModalVisible(false);
          setMixImagesEnabled(false);
        }}
        title="Start Quiz"
      >
        <Text style={styles.modalDescription}>
          Start {pendingTopic ? pendingTopic.name : 'Exam'} quiz for {subjectDisplayName}?
        </Text>
        <View style={styles.visualModeContainer}>
          <View style={styles.visualModeHeader}>
            <Text style={styles.visualModeTitle}>Visual learning mode</Text>
            <Switch
              value={mixImagesEnabled}
              onValueChange={setMixImagesEnabled}
              thumbColor={mixImagesEnabled ? Colors.primary.main : '#ccc'}
              trackColor={{ false: '#ccc', true: Colors.primary.light }}
            />
          </View>
          <Text style={styles.visualModeNote}>
            Mix image-based questions (higher credit cost).
          </Text>
          <Text style={styles.visualModeCost}>
            Estimated cost: {formatCreditCost(getEstimatedCost(pendingTopic, pendingQuestionType, pendingQuestionFormat, mixImagesEnabled))} per question
          </Text>
        </View>
        <View style={[styles.modalButtonRow, { marginBottom: Math.max(insets.bottom, 8), paddingBottom: Math.max(insets.bottom, 0) }]}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setStartQuizModalVisible(false)}
          >
            <Text style={styles.cancelButtonText} numberOfLines={1} ellipsizeMode="tail">Cancel</Text>
          </TouchableOpacity>
          <View style={styles.modalButtonSpacer} />
          <TouchableOpacity
            style={[styles.modalButton, styles.startButton]}
            onPress={() => {
              setStartQuizModalVisible(false);
              handleStartQuiz(pendingTopic || undefined, pendingQuestionType, pendingQuestionFormat, mixImagesEnabled);
            }}
          >
            <Text style={styles.startButtonText} numberOfLines={1} ellipsizeMode="tail">Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Exam Setup Modal for Mathematics and Combined Science */}
      <ExamSetupModal
        visible={examSetupModalVisible}
        onClose={() => setExamSetupModalVisible(false)}
        onStartExam={handleExamStart}
        initialSubject={subject.id === 'combined_science' ? activeTab.toLowerCase() : subject.id}
        userCredits={user?.credits || 0}
        availableTopics={topics.map(t => t.name)}
        csBoard={subject.id === 'computer_science' ? csBoard : subject.id === 'a_level_computer_science' ? aLevelCsBoard : undefined}
      />

    </View>
  );
};

const getSubjectIcon = (subjectId: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    mathematics: Icons.mathematics(32, '#FFFFFF'),
    combined_science: Icons.science(32, '#FFFFFF'),
    english: Icons.english(32, '#FFFFFF'),
    computer_science: <Ionicons name="hardware-chip-outline" size={32} color="#FFFFFF" />,
  };
  return iconMap[subjectId] || Icons.quiz(32, '#FFFFFF');
};

const getMathTopicVisual = (topicName: string): { iconName: string; color: string; bg: string } => {
  const topic = topicName.toLowerCase();

  if (
    topic.includes('number') ||
    topic.includes('approximation') ||
    topic.includes('ratio') ||
    topic.includes('standard form') ||
    topic.includes('indices') ||
    topic.includes('limit')
  ) {
    return { iconName: 'calculator-outline', color: '#1565C0', bg: 'rgba(21, 101, 192, 0.12)' };
  }

  if (topic.includes('set') || topic.includes('venn')) {
    return { iconName: 'layers-outline', color: '#00897B', bg: 'rgba(0, 137, 123, 0.12)' };
  }

  if (
    topic.includes('bill') ||
    topic.includes('consumer') ||
    topic.includes('arithmetic') ||
    topic.includes('tax') ||
    topic.includes('vat') ||
    topic.includes('exchange') ||
    topic.includes('duty')
  ) {
    return { iconName: 'wallet-outline', color: '#2E7D32', bg: 'rgba(46, 125, 50, 0.12)' };
  }

  if (
    topic.includes('measure') ||
    topic.includes('mensuration') ||
    topic.includes('scale')
  ) {
    return { iconName: 'cube-outline', color: '#EF6C00', bg: 'rgba(239, 108, 0, 0.12)' };
  }

  if (
    topic.includes('graph') ||
    topic.includes('data') ||
    topic.includes('statistics') ||
    topic.includes('central tendency') ||
    topic.includes('dispersion') ||
    topic.includes('cumulative') ||
    topic.includes('ogive') ||
    topic.includes('quartile') ||
    topic.includes('variation')
  ) {
    return { iconName: 'stats-chart-outline', color: '#0277BD', bg: 'rgba(2, 119, 189, 0.12)' };
  }

  if (
    topic.includes('algebra') ||
    topic.includes('equation') ||
    topic.includes('inequalit') ||
    topic.includes('symbolic') ||
    topic.includes('linear programming')
  ) {
    return { iconName: 'code-slash-outline', color: '#3949AB', bg: 'rgba(57, 73, 171, 0.12)' };
  }

  if (
    topic.includes('line') ||
    topic.includes('angle') ||
    topic.includes('circle') ||
    topic.includes('polygon') ||
    topic.includes('bearing') ||
    topic.includes('geometry') ||
    topic.includes('similarity') ||
    topic.includes('congruency') ||
    topic.includes('construction') ||
    topic.includes('symmetry') ||
    topic.includes('locus')
  ) {
    return { iconName: 'compass-outline', color: '#D84315', bg: 'rgba(216, 67, 21, 0.12)' };
  }

  if (topic.includes('matrix')) {
    return { iconName: 'grid-outline', color: '#283593', bg: 'rgba(40, 53, 147, 0.12)' };
  }

  if (topic.includes('trigonometry') || topic.includes('trigonometrical')) {
    return { iconName: 'triangle-outline', color: '#6A1B9A', bg: 'rgba(106, 27, 154, 0.12)' };
  }

  if (
    topic.includes('vector') ||
    topic.includes('translation') ||
    topic.includes('reflection') ||
    topic.includes('rotation') ||
    topic.includes('enlargement') ||
    topic.includes('stretch') ||
    topic.includes('shear')
  ) {
    return { iconName: 'move-outline', color: '#C62828', bg: 'rgba(198, 40, 40, 0.12)' };
  }

  if (topic.includes('probability')) {
    return { iconName: 'shuffle-outline', color: '#00695C', bg: 'rgba(0, 105, 92, 0.12)' };
  }

  return { iconName: 'school-outline', color: Colors.subjects.mathematics, bg: Colors.iconBg.mathematics };
};

const getTopicIcon = (topic: Topic, subjectId: string): React.ReactNode => {
  if (subjectId === 'combined_science') {
    // We can use generic science icon or specific if available
    return Icons.science(24, Colors.subjects.science);
  }
  if (subjectId === 'mathematics') {
    const visual = getMathTopicVisual(topic.name);
    return <Ionicons name={visual.iconName as any} size={24} color={visual.color} />;
  }
  if (subjectId === 'english') {
    if (topic.name.toLowerCase().includes('grammar')) {
      return Icons.grammar(24, Colors.subjects.english);
    } else if (topic.name.toLowerCase().includes('vocabulary')) {
      return Icons.vocabulary(24, Colors.subjects.english);
    }
  }
  if (subjectId === 'computer_science') {
    return <Ionicons name="desktop-outline" size={24} color={Colors.info.main} />;
  }
  if (subjectId === 'commerce') {
    return <Ionicons name="receipt-outline" size={24} color="#B8860B" />;
  }
  return Icons.quiz(24, Colors.primary.main);
};

const getTopicIconBg = (topic: Topic, subjectId: string): string => {
  if (subjectId === 'combined_science') {
    return Colors.iconBg.science;
  }
  if (subjectId === 'mathematics') {
    return getMathTopicVisual(topic.name).bg;
  }
  if (subjectId === 'computer_science') {
    return Colors.iconBg.info;
  }
  if (subjectId === 'commerce') {
    return 'rgba(184, 134, 11, 0.2)';
  }
  return Colors.iconBg.default;
};

export default TopicsScreen;



