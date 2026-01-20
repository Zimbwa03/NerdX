// Exam Session Screen - CBT-style exam UI with timer, one-question-at-a-time, flagging, and review
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput,
    BackHandler,
    Vibration,
    Modal,
    FlatList,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import MathRenderer from '../components/MathRenderer';
import { isMathSubjectId, toMathLatex } from '../utils/mathText';
import LoadingProgress from '../components/LoadingProgress';
import { getExamLoadingConfig } from '../utils/loadingProgress';
import {
    examApi,
    ExamSession,
    ExamQuestion,
    QuestionResponse,
    TimeInfo,
    ExamConfig,
} from '../services/api/examApi';

type ExamStep = 'loading' | 'question' | 'submitting';

interface LocalResponse {
    answer: string;
    isFlagged: boolean;
    timeSpent: number;
}

const ExamSessionScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { user, updateUser } = useAuth();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    // Route params with safe defaults
    const params = route.params as {
        examConfig?: ExamConfig;
        // Back-compat: older callers used `config`
        config?: ExamConfig;
        timeInfo?: TimeInfo;
        // Back-compat: some callers may pass a pre-created session id (unused here)
        sessionId?: string;
    } | undefined;

    const examConfig = params?.examConfig ?? params?.config;
    const timeInfo = params?.timeInfo;

    // Guard against missing config - navigate back with error
    useEffect(() => {
        if (!examConfig) {
            console.error('ExamSessionScreen: Missing examConfig');
            Alert.alert('Error', 'Invalid exam configuration. Please try again.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    }, [examConfig, timeInfo]);

    // Session state
    const [session, setSession] = useState<ExamSession | null>(null);
    const [step, setStep] = useState<ExamStep>('loading');
    const [sessionCreating, setSessionCreating] = useState(true);

    // Question state
    const [currentQuestion, setCurrentQuestion] = useState<ExamQuestion | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(examConfig?.total_questions || 0);
    const [loadingQuestion, setLoadingQuestion] = useState(false);

    // Answer state
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [structuredAnswer, setStructuredAnswer] = useState<string>('');
    const [responses, setResponses] = useState<Record<number, LocalResponse>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

    // Timer state
    const [remainingSeconds, setRemainingSeconds] = useState(timeInfo?.total_seconds || 0);
    const [timerPaused, setTimerPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const questionStartTime = useRef<number>(Date.now());

    // Review grid modal
    const [showReviewGrid, setShowReviewGrid] = useState(false);

    // Warning flags
    const [warned10min, setWarned10min] = useState(false);
    const [warned5min, setWarned5min] = useState(false);
    const [warned1min, setWarned1min] = useState(false);

    // Keep totalQuestions in sync if config arrives after mount
    useEffect(() => {
        if (examConfig?.total_questions) {
            setTotalQuestions(examConfig.total_questions);
        }
    }, [examConfig?.total_questions]);

    // Prevent back navigation during exam
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            confirmExit();
            return true;
        });

        return () => {
            backHandler.remove();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Initialize session once config is available
    const hasInitializedRef = useRef(false);
    useEffect(() => {
        if (!examConfig) return;
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;
        createSession();
    }, [examConfig]);

    // Start timer when session is active
    useEffect(() => {
        if (session && !timerPaused) {
            timerRef.current = setInterval(() => {
                setRemainingSeconds(prev => {
                    const newValue = prev - 1;

                    // Timer warnings
                    if (newValue === 600 && !warned10min) {
                        showTimerWarning('10 minutes remaining');
                        setWarned10min(true);
                    } else if (newValue === 300 && !warned5min) {
                        showTimerWarning('5 minutes remaining');
                        setWarned5min(true);
                    } else if (newValue === 60 && !warned1min) {
                        showTimerWarning('1 minute remaining!');
                        setWarned1min(true);
                    } else if (newValue <= 0) {
                        // Auto-submit
                        handleAutoSubmit();
                        return 0;
                    }

                    return newValue;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [session, timerPaused]);

    const showTimerWarning = (message: string) => {
        Vibration.vibrate([0, 200, 100, 200]);
        Alert.alert('⏰ Time Warning', message);
    };

    const createSession = async () => {
        if (!examConfig) {
            console.error('createSession: examConfig is undefined');
            return;
        }
        try {
            setSessionCreating(true);
            const result = await examApi.createSession(examConfig);

            if (result) {
                setSession(result);
                setRemainingSeconds(result.total_time_seconds);
                // Load first question
                await loadNextQuestion(result.session_id, 0);
            } else {
                Alert.alert('Error', 'Failed to create exam session');
                navigation.goBack();
            }
        } catch (error: any) {
            console.error('Create session error:', error);
            const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to create exam session';
            Alert.alert('Error', backendMessage);
            navigation.goBack();
        } finally {
            setSessionCreating(false);
        }
    };

    const loadNextQuestion = async (sessionId: string, index: number) => {
        try {
            setLoadingQuestion(true);
            setStep('loading');
            questionStartTime.current = Date.now();

            const response = await examApi.getNextQuestion(sessionId, index);

            if (response) {
                setCurrentQuestion(response.question);
                setCurrentIndex(response.question_index);
                setTotalQuestions(response.total_questions);
                if (response.credits_remaining !== undefined) {
                    updateUser({ credits: response.credits_remaining });
                }
                if (response.remaining_seconds !== null) {
                    setRemainingSeconds(response.remaining_seconds);
                }

                // Restore previous answer if navigating back
                const prevResponse = responses[response.question_index];
                if (prevResponse) {
                    if (response.question.question_type === 'MCQ') {
                        setSelectedAnswer(prevResponse.answer);
                    } else {
                        setStructuredAnswer(prevResponse.answer);
                    }
                } else {
                    setSelectedAnswer('');
                    setStructuredAnswer('');
                }

                setStep('question');
            }
        } catch (error: any) {
            console.error('Load question error:', error);
            Alert.alert('Error', 'Failed to load question');
        } finally {
            setLoadingQuestion(false);
        }
    };

    const saveCurrentAnswer = () => {
        if (!currentQuestion) return;

        const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);
        const answer = currentQuestion.question_type === 'MCQ' ? selectedAnswer : structuredAnswer;

        setResponses(prev => ({
            ...prev,
            [currentIndex]: {
                answer,
                isFlagged: flaggedQuestions.has(currentIndex),
                timeSpent,
            },
        }));
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleFlagToggle = () => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentIndex)) {
                newSet.delete(currentIndex);
            } else {
                newSet.add(currentIndex);
            }
            return newSet;
        });
    };

    const handleNext = async () => {
        saveCurrentAnswer();

        if (!session) return;

        // Submit current answer to backend
        if (currentQuestion) {
            const answer = currentQuestion.question_type === 'MCQ' ? selectedAnswer : structuredAnswer;
            const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);

            try {
                await examApi.submitAnswer(
                    session.session_id,
                    currentQuestion.id,
                    answer,
                    timeSpent,
                    flaggedQuestions.has(currentIndex)
                );
            } catch (error) {
                console.error('Submit answer error:', error);
            }
        }

        if (currentIndex < totalQuestions - 1) {
            await loadNextQuestion(session.session_id, currentIndex + 1);
        } else {
            // Last question - confirm submit
            confirmSubmit();
        }
    };

    const handlePrevious = async () => {
        saveCurrentAnswer();

        if (!session || currentIndex === 0) return;
        await loadNextQuestion(session.session_id, currentIndex - 1);
    };

    const handleJumpToQuestion = async (index: number) => {
        saveCurrentAnswer();
        setShowReviewGrid(false);

        if (session) {
            await loadNextQuestion(session.session_id, index);
        }
    };

    const confirmSubmit = () => {
        const unansweredCount = totalQuestions - Object.keys(responses).filter(
            key => responses[parseInt(key)]?.answer
        ).length;

        Alert.alert(
            'Submit Exam',
            unansweredCount > 0
                ? `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Submit anyway?`
                : 'Are you sure you want to submit your exam?',
            [
                { text: 'Review', onPress: () => setShowReviewGrid(true) },
                { text: 'Submit', style: 'destructive', onPress: handleSubmitExam },
            ]
        );
    };

    const handleAutoSubmit = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerPaused(true);

        Alert.alert('⏰ Time Up', 'Your exam has been auto-submitted.');
        await handleSubmitExam();
    };

    const handleSubmitExam = async () => {
        if (!session) return;

        setStep('submitting');
        setTimerPaused(true);

        try {
            // Submit final question if not already submitted
            if (currentQuestion) {
                const answer = currentQuestion.question_type === 'MCQ' ? selectedAnswer : structuredAnswer;
                const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);

                await examApi.submitAnswer(
                    session.session_id,
                    currentQuestion.id,
                    answer,
                    timeSpent,
                    flaggedQuestions.has(currentIndex)
                );
            }

            // Complete exam
            const results = await examApi.completeExam(session.session_id);

            if (results) {
                // Update user credits in context
                if (user) {
                    const newCredits = (user.credits || 0) + (results.xp_earned || 0);
                    updateUser({ credits: newCredits });
                }

                // Navigate to results
                navigation.replace('ExamResults', {
                    sessionId: session.session_id,
                    results,
                });
            }
        } catch (error: any) {
            console.error('Submit exam error:', error);
            Alert.alert('Error', 'Failed to submit exam. Please try again.');
            setStep('question');
            setTimerPaused(false);
        }
    };

    const confirmExit = () => {
        Alert.alert(
            'Exit Exam',
            'Are you sure you want to exit? Your progress will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
            ]
        );
    };

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Get timer color based on remaining time
    const getTimerColor = () => {
        if (remainingSeconds <= 60) return themedColors.error.main;
        if (remainingSeconds <= 300) return themedColors.warning?.main || '#FF9800';
        return '#FFFFFF';
    };

    const isMathSubject = isMathSubjectId(examConfig?.subject);

    // Render question based on type
    const renderQuestion = () => {
        if (!currentQuestion) return null;

        if (currentQuestion.question_type === 'MCQ') {
            return (
                <View style={styles.optionsContainer}>
                    {currentQuestion.options?.map((option, index) => {
                        const isSelected = selectedAnswer === option.label;

                        return (
                            <TouchableOpacity
                                key={option.label}
                                style={[
                                    styles.optionCard,
                                    {
                                        backgroundColor: themedColors.background.paper,
                                        borderColor: isSelected ? themedColors.primary.main : themedColors.border.main,
                                        borderWidth: isSelected ? 2 : 1,
                                    }
                                ]}
                                onPress={() => handleAnswerSelect(option.label)}
                            >
                                <View style={[
                                    styles.optionLabel,
                                    { backgroundColor: isSelected ? themedColors.primary.main : themedColors.background.default }
                                ]}>
                                    <Text style={[
                                        styles.optionLabelText,
                                        { color: isSelected ? '#FFF' : themedColors.text.primary }
                                    ]}>
                                        {option.label}
                                    </Text>
                                </View>
                                {isMathSubject ? (
                                    <View style={{ flex: 1, minHeight: 0 }}>
                                        <MathRenderer 
                                            content={toMathLatex(option.text, isMathSubject)} 
                                            fontSize={15}
                                            minHeight={30}
                                            style={{ flex: 1, minHeight: 0 }}
                                        />
                                    </View>
                                ) : (
                                    <Text style={[styles.optionText, { color: themedColors.text.primary }]}>
                                        {option.text}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        } else {
            // Structured question
            return (
                <View style={styles.structuredContainer}>
                    {currentQuestion.parts?.map((part, index) => (
                        <View key={part.part} style={styles.structuredPart}>
                            <View style={styles.partHeader}>
                                <Text style={[styles.partLabel, { color: themedColors.primary.main }]}>
                                    ({part.part})
                                </Text>
                                <Text style={[styles.partMarks, { color: themedColors.text.secondary }]}>
                                    [{part.marks} mark{part.marks > 1 ? 's' : ''}]
                                </Text>
                            </View>
                            <Text style={[styles.partPrompt, { color: themedColors.text.primary }]}>
                                {part.prompt}
                            </Text>
                        </View>
                    ))}
                    <TextInput
                        style={[
                            styles.structuredInput,
                            {
                                backgroundColor: themedColors.background.paper,
                                color: themedColors.text.primary,
                                borderColor: themedColors.border.main,
                            }
                        ]}
                        multiline
                        numberOfLines={8}
                        value={structuredAnswer}
                        onChangeText={setStructuredAnswer}
                        placeholder="Type your answer here..."
                        placeholderTextColor={themedColors.text.disabled}
                        textAlignVertical="top"
                    />
                </View>
            );
        }
    };

    const loadingConfig = getExamLoadingConfig(
        examConfig?.subject,
        sessionCreating ? 'setup' : 'question'
    );

    // Loading state with progress
    if (sessionCreating || step === 'loading') {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themedColors.background.default }]}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <LoadingProgress
                    visible
                    message={loadingConfig.message}
                    estimatedTime={loadingConfig.estimatedTime}
                    stage={loadingConfig.stage}
                    steps={loadingConfig.steps}
                />
            </View>
        );
    }

    // Submitting state
    if (step === 'submitting') {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themedColors.background.default }]}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <ActivityIndicator size="large" color={themedColors.primary.main} />
                <Text style={[styles.loadingText, { color: themedColors.text.primary }]}>
                    Submitting your exam...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={themedColors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    {/* Timer */}
                    <View style={styles.timerContainer}>
                        <Ionicons name="time-outline" size={20} color={getTimerColor()} />
                        <Text style={[styles.timerText, { color: getTimerColor() }]}>
                            {formatTime(remainingSeconds)}
                        </Text>
                    </View>

                    {/* Progress */}
                    <Text style={styles.progressText}>
                        {currentIndex + 1} / {totalQuestions}
                    </Text>

                    {/* Flag Button */}
                    <TouchableOpacity
                        style={[
                            styles.flagButton,
                            flaggedQuestions.has(currentIndex) && styles.flagButtonActive,
                        ]}
                        onPress={handleFlagToggle}
                    >
                        <Ionicons
                            name={flaggedQuestions.has(currentIndex) ? 'flag' : 'flag-outline'}
                            size={20}
                            color={flaggedQuestions.has(currentIndex) ? '#FFD700' : '#FFF'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: `${((currentIndex + 1) / totalQuestions) * 100}%` }
                        ]}
                    />
                </View>
            </LinearGradient>

            {/* Question Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Question Card */}
                <Card variant="elevated" style={[styles.questionCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={styles.questionHeader}>
                        <Text style={[styles.questionNumber, { color: themedColors.primary.main }]}>
                            Question {currentIndex + 1}
                        </Text>
                        {currentQuestion?.topic && (
                            <Text style={[styles.topicTag, { backgroundColor: themedColors.primary.light, color: themedColors.primary.dark }]}>
                                {currentQuestion.topic}
                            </Text>
                        )}
                    </View>

                    {currentQuestion?.prompt_to_student && (
                        <Text style={[styles.promptText, { color: themedColors.text.secondary }]}>
                            {currentQuestion.prompt_to_student}
                        </Text>
                    )}

                    {isMathSubject && currentQuestion?.stem ? (
                        <MathRenderer 
                            content={toMathLatex(currentQuestion.stem, isMathSubject)} 
                            fontSize={16}
                            style={styles.questionStem}
                        />
                    ) : (
                        <Text style={[styles.questionStem, { color: themedColors.text.primary }]}>
                            {currentQuestion?.stem}
                        </Text>
                    )}
                </Card>

                {/* Options / Answer Input */}
                {renderQuestion()}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={[styles.bottomNav, { backgroundColor: themedColors.background.paper }]}>
                <Button
                    title="Previous"
                    variant="outline"
                    onPress={handlePrevious}
                    disabled={currentIndex === 0}
                    icon="arrow-back"
                    iconPosition="left"
                />

                <TouchableOpacity
                    style={[styles.reviewButton, { backgroundColor: themedColors.background.default }]}
                    onPress={() => setShowReviewGrid(true)}
                >
                    <Ionicons name="grid-outline" size={20} color={themedColors.primary.main} />
                    <Text style={[styles.reviewButtonText, { color: themedColors.primary.main }]}>
                        Review
                    </Text>
                </TouchableOpacity>

                <Button
                    title={currentIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
                    variant="primary"
                    onPress={handleNext}
                    icon={currentIndex === totalQuestions - 1 ? 'checkmark-circle' : 'arrow-forward'}
                    iconPosition="right"
                />
            </View>

            {/* Review Grid Modal */}
            <Modal
                visible={showReviewGrid}
                animationType="slide"
                transparent
                onRequestClose={() => setShowReviewGrid(false)}
            >
                <View style={styles.reviewModalOverlay}>
                    <View style={[styles.reviewModalContainer, { backgroundColor: themedColors.background.default }]}>
                        <View style={styles.reviewModalHeader}>
                            <Text style={[styles.reviewModalTitle, { color: themedColors.text.primary }]}>
                                Question Review
                            </Text>
                            <TouchableOpacity onPress={() => setShowReviewGrid(false)}>
                                <Ionicons name="close" size={24} color={themedColors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.reviewLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: themedColors.success.main }]} />
                                <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Answered</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: themedColors.text.disabled }]} />
                                <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Unanswered</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
                                <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Flagged</Text>
                            </View>
                        </View>

                        <FlatList
                            data={Array.from({ length: totalQuestions }, (_, i) => i)}
                            numColumns={5}
                            keyExtractor={(item) => item.toString()}
                            contentContainerStyle={styles.reviewGrid}
                            renderItem={({ item }) => {
                                const isAnswered = responses[item]?.answer;
                                const isFlagged = flaggedQuestions.has(item);
                                const isCurrent = item === currentIndex;

                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.reviewGridItem,
                                            {
                                                backgroundColor: isAnswered
                                                    ? themedColors.success.main
                                                    : themedColors.background.paper,
                                                borderColor: isCurrent
                                                    ? themedColors.primary.main
                                                    : themedColors.border.main,
                                                borderWidth: isCurrent ? 3 : 1,
                                            }
                                        ]}
                                        onPress={() => handleJumpToQuestion(item)}
                                    >
                                        {isFlagged && (
                                            <View style={styles.flagIndicator}>
                                                <Ionicons name="flag" size={10} color="#FFD700" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.reviewGridItemText,
                                            { color: isAnswered ? '#FFF' : themedColors.text.primary }
                                        ]}>
                                            {item + 1}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />

                        <View style={styles.reviewModalFooter}>
                            <Button
                                title="Submit Exam"
                                variant="primary"
                                fullWidth
                                onPress={() => { setShowReviewGrid(false); confirmSubmit(); }}
                                icon="checkmark-circle"
                                iconPosition="left"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
    },
    loadingIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressContainer: {
        width: '70%',
        alignItems: 'center',
        marginTop: 24,
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    loadingHint: {
        marginTop: 16,
        fontSize: 13,
        textAlign: 'center',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    flagButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flagButtonActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        marginTop: 12,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    questionCard: {
        marginBottom: 16,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    questionNumber: {
        fontSize: 14,
        fontWeight: '600',
    },
    topicTag: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    promptText: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    questionStem: {
        fontSize: 16,
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 12,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 12,
        minHeight: 0,
    },
    optionLabel: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabelText: {
        fontSize: 16,
        fontWeight: '600',
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    structuredContainer: {
        gap: 12,
    },
    structuredPart: {
        marginBottom: 8,
    },
    partHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    partLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    partMarks: {
        fontSize: 12,
    },
    partPrompt: {
        fontSize: 15,
        lineHeight: 22,
    },
    structuredInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        minHeight: 200,
        fontSize: 15,
        lineHeight: 22,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 24,
        gap: 12,
    },
    reviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    reviewButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    reviewModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    reviewModalContainer: {
        height: '70%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
    },
    reviewModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    reviewModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    reviewLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 12,
    },
    reviewGrid: {
        paddingHorizontal: 10,
    },
    reviewGridItem: {
        flex: 1,
        aspectRatio: 1,
        maxWidth: '18%',
        margin: '1%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    reviewGridItemText: {
        fontSize: 16,
        fontWeight: '600',
    },
    flagIndicator: {
        position: 'absolute',
        top: 2,
        right: 2,
    },
    reviewModalFooter: {
        marginTop: 20,
    },
});

export default ExamSessionScreen;
