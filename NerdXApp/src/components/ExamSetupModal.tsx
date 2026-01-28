// Exam Setup Modal - Premium bottom sheet for configuring exam parameters
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';
import { Button } from './Button';
import {
    examApi,
    ExamConfig,
    TimeInfo,
    QuestionMode,
    Level,
    Difficulty,
    QUESTION_COUNTS,
    SUBJECTS,
    QUESTION_MODES,
    DIFFICULTIES,
} from '../services/api/examApi';
import { calculateQuizCreditCost, formatCreditCost } from '../utils/creditCalculator';

const { width, height } = Dimensions.get('window');

interface ExamSetupModalProps {
    visible: boolean;
    onClose: () => void;
    onStartExam: (config: ExamConfig, timeInfo: TimeInfo) => void;
    initialSubject?: string;
    userCredits: number;
    availableTopics?: string[];  // Topics to select from
    csBoard?: 'zimsec' | 'cambridge';  // For Computer Science: exam board
}

const ExamSetupModal: React.FC<ExamSetupModalProps> = ({
    visible,
    onClose,
    onStartExam,
    initialSubject = 'mathematics',
    userCredits,
    availableTopics = [],
    csBoard,
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    // Helper to determine initial level
    const getInitialLevel = (subj: string): Level => {
        if (subj.includes('a_level_') || subj === 'pure_math') {
            return 'A_LEVEL';
        }
        return 'O_LEVEL';
    };

    // Form state
    const [subject, setSubject] = useState(initialSubject);
    const [level, setLevel] = useState<Level>(getInitialLevel(initialSubject));
    const [questionMode, setQuestionMode] = useState<QuestionMode>('MCQ_ONLY');
    const [difficulty, setDifficulty] = useState<Difficulty>('standard');
    const [questionCount, setQuestionCount] = useState(10);
    const [sliderValue, setSliderValue] = useState(1); // Index in QUESTION_COUNTS

    // Topic selection state
    const [allTopics, setAllTopics] = useState(true);  // Select all by default
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    // Time calculation
    const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);
    const [loadingTime, setLoadingTime] = useState(false);

    // Loading state
    const [starting, setStarting] = useState(false);

    // Update subject when prop changes
    useEffect(() => {
        setSubject(initialSubject);
        setLevel(getInitialLevel(initialSubject));
    }, [initialSubject]);

    // Calculate time when parameters change
    const calculateTime = useCallback(async () => {
        setLoadingTime(true);
        try {
            const info = await examApi.calculateTime(
                subject,
                questionCount,
                questionMode,
                difficulty
            );
            setTimeInfo(info);
        } catch (error) {
            console.error('Error calculating time:', error);
        } finally {
            setLoadingTime(false);
        }
    }, [subject, questionCount, questionMode, difficulty]);

    useEffect(() => {
        if (visible) {
            calculateTime();
        }
    }, [visible, calculateTime]);

    // Handle slider change
    const handleSliderChange = (value: number) => {
        const index = Math.round(value);
        setSliderValue(index);
        setQuestionCount(QUESTION_COUNTS[index]);
    };

    // Handle start exam
    const handleStartExam = async () => {
        if (!timeInfo) return;
        if (!allTopics && selectedTopics.length === 0) {
            // Avoid sending an empty topics list (many backends treat this as invalid)
            Alert.alert('Select Topics', 'Please select at least 1 topic, or switch back to "All Topics".');
            return;
        }

        setStarting(true);
        try {
            const config: ExamConfig = {
                subject,
                level,
                question_mode: questionMode,
                difficulty,
                total_questions: questionCount,
                paper_style: ((subject === 'computer_science' || subject === 'a_level_computer_science') && csBoard)
                    ? (csBoard === 'cambridge' ? 'CAMBRIDGE' : 'ZIMSEC')
                    : 'ZIMSEC',
                topics: allTopics ? undefined : selectedTopics,
            };

            onStartExam(config, timeInfo);
        } catch (error) {
            console.error('Error starting exam:', error);
        } finally {
            setStarting(false);
        }
    };

    // Calculate credit cost based on subject/level/mode using the credit calculator
    const calculateCreditCost = (): number => {
        const subjectKey = subject.toLowerCase();
        let costPerQuestion = 0.5; // Default
        
        // For exam mode, calculate cost per question based on subject
        if (subjectKey === 'mathematics' || subjectKey === 'math') {
            costPerQuestion = 0.5; // Math exam: 0.5 credit per question
        } else if (subjectKey === 'combined_science') {
            costPerQuestion = 0.5; // Combined Science exam: 0.5 credit per question
        } else if (subjectKey === 'a_level_biology') {
            // A-Level Biology: MCQ = 0.25, Structured/Essay = 0.5
            if (questionMode === 'MCQ_ONLY') {
                costPerQuestion = 0.25;
            } else if (questionMode === 'MIXED') {
                // Mixed mode: average between MCQ and structured
                const mcqCount = Math.floor(questionCount / 2);
                const structuredCount = questionCount - mcqCount;
                return (mcqCount * 0.25) + (structuredCount * 0.5);
            } else {
                costPerQuestion = 0.5; // Structured/Essay
            }
        } else if (subjectKey.includes('a_level_')) {
            costPerQuestion = 0.5; // Other A-Level subjects: 0.5 credit per question
        } else if (subjectKey === 'english') {
            costPerQuestion = 1; // English: 1 credit per question
        } else if (subjectKey === 'computer_science' || subjectKey === 'a_level_computer_science') {
            // Computer Science (O-Level or A-Level): MCQ = 0.3 credit, Structured = 0.5 credit, Essay = 1 credit
            if (questionMode === 'MCQ_ONLY') {
                costPerQuestion = 0.3; // 0.3 credit per exam MCQ (3 units)
            } else if (questionMode === 'STRUCTURED_ONLY') {
                costPerQuestion = 0.5; // 0.5 credit per exam structured (5 units)
            } else if (questionMode === 'MIXED') {
                // Mixed mode: average between MCQ and structured
                const mcqCount = Math.floor(questionCount / 2);
                const structuredCount = questionCount - mcqCount;
                return (mcqCount * 0.3) + (structuredCount * 0.5);
            } else {
                costPerQuestion = 1; // Essay: 1 credit per question (10 units)
            }
        }
        
        // For MIXED mode (non-Biology, non-Computer Science), calculate weighted average
        if (questionMode === 'MIXED' && subjectKey !== 'a_level_biology' && subjectKey !== 'computer_science' && subjectKey !== 'a_level_computer_science') {
            const mcqCount = Math.floor(questionCount / 2);
            const structuredCount = questionCount - mcqCount;
            // Most subjects: MCQ = same as structured (0.5), so just multiply
            return questionCount * costPerQuestion;
        }
        
        return questionCount * costPerQuestion;
    };

    const creditCost = calculateCreditCost();

    // Check if user has enough credits
    const hasEnoughCredits = userCredits >= creditCost;

    // Toggle topic selection
    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    // Get subject info
    const subjectInfo = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];

    // Format time
    const formatTime = (minutes: number) => {
        if (minutes < 60) {
            return `${Math.round(minutes)} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${hours}h ${mins}min`;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: themedColors.background.default }]}>
                    {/* Header */}
                    <LinearGradient
                        colors={[subjectInfo.color, themedColors.primary.dark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <View style={styles.headerContent}>
                            <View>
                                <Text style={styles.headerTitle}>Exam Setup</Text>
                                <Text style={styles.headerSubtitle}>{subjectInfo.name}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Level Selection */}
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                            Level
                        </Text>
                        <View style={styles.toggleContainer}>
                            {(['O_LEVEL', 'A_LEVEL'] as Level[]).map((lvl) => (
                                <TouchableOpacity
                                    key={lvl}
                                    style={[
                                        styles.toggleButton,
                                        {
                                            backgroundColor: level === lvl
                                                ? themedColors.primary.main
                                                : themedColors.background.paper,
                                            borderColor: themedColors.border.main,
                                        }
                                    ]}
                                    onPress={() => setLevel(lvl)}
                                >
                                    <Text style={[
                                        styles.toggleText,
                                        { color: level === lvl ? '#FFF' : themedColors.text.primary }
                                    ]}>
                                        {lvl.replace('_', ' ')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Question Mode Selection */}
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                            Question Type
                        </Text>
                        <View style={styles.modeContainer}>
                            {QUESTION_MODES.map((mode) => (
                                <TouchableOpacity
                                    key={mode.id}
                                    style={[
                                        styles.modeButton,
                                        {
                                            backgroundColor: questionMode === mode.id
                                                ? themedColors.primary.main
                                                : themedColors.background.paper,
                                            borderColor: themedColors.border.main,
                                        }
                                    ]}
                                    onPress={() => setQuestionMode(mode.id as QuestionMode)}
                                >
                                    <Text style={[
                                        styles.modeText,
                                        { color: questionMode === mode.id ? '#FFF' : themedColors.text.primary }
                                    ]}>
                                        {mode.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Difficulty Selection */}
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                            Difficulty
                        </Text>
                        <View style={styles.toggleContainer}>
                            {DIFFICULTIES.map((diff) => (
                                <TouchableOpacity
                                    key={diff.id}
                                    style={[
                                        styles.toggleButton,
                                        {
                                            backgroundColor: difficulty === diff.id
                                                ? themedColors.primary.main
                                                : themedColors.background.paper,
                                            borderColor: themedColors.border.main,
                                        }
                                    ]}
                                    onPress={() => setDifficulty(diff.id as Difficulty)}
                                >
                                    <Text style={[
                                        styles.toggleText,
                                        { color: difficulty === diff.id ? '#FFF' : themedColors.text.primary }
                                    ]}>
                                        {diff.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Topic Selection (if topics available) */}
                        {availableTopics.length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                                    Topics
                                </Text>
                                <View style={[styles.topicCard, { backgroundColor: themedColors.background.paper }]}>
                                    <TouchableOpacity
                                        style={styles.allTopicsRow}
                                        onPress={() => setAllTopics(!allTopics)}
                                    >
                                        <Text style={[styles.allTopicsText, { color: themedColors.text.primary }]}>
                                            All Topics
                                        </Text>
                                        <View style={[
                                            styles.checkbox,
                                            {
                                                backgroundColor: allTopics ? themedColors.primary.main : 'transparent',
                                                borderColor: themedColors.primary.main,
                                            }
                                        ]}>
                                            {allTopics && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                        </View>
                                    </TouchableOpacity>

                                    {!allTopics && (
                                        <View style={styles.topicsGrid}>
                                            {availableTopics.map((topic) => (
                                                <TouchableOpacity
                                                    key={topic}
                                                    style={[
                                                        styles.topicChip,
                                                        {
                                                            backgroundColor: selectedTopics.includes(topic)
                                                                ? themedColors.primary.main
                                                                : themedColors.background.subtle,
                                                            borderColor: selectedTopics.includes(topic)
                                                                ? themedColors.primary.main
                                                                : themedColors.border.light,
                                                        }
                                                    ]}
                                                    onPress={() => toggleTopic(topic)}
                                                >
                                                    <Text style={[
                                                        styles.topicChipText,
                                                        {
                                                            color: selectedTopics.includes(topic)
                                                                ? '#FFF'
                                                                : themedColors.text.primary
                                                        }
                                                    ]}>
                                                        {topic}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </>
                        )}

                        {/* Question Count Slider */}
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                            Number of Questions
                        </Text>
                        <View style={[styles.sliderCard, { backgroundColor: themedColors.background.paper }]}>
                            <Text style={[styles.questionCount, { color: themedColors.primary.main }]}>
                                {questionCount}
                            </Text>
                            <Text style={[styles.questionLabel, { color: themedColors.text.secondary }]}>
                                questions
                            </Text>

                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={QUESTION_COUNTS.length - 1}
                                step={1}
                                value={sliderValue}
                                onValueChange={handleSliderChange}
                                minimumTrackTintColor={themedColors.primary.main}
                                maximumTrackTintColor={themedColors.border.main}
                                thumbTintColor={themedColors.primary.main}
                            />

                            <View style={styles.sliderLabels}>
                                <Text style={[styles.sliderLabel, { color: themedColors.text.disabled }]}>
                                    {QUESTION_COUNTS[0]}
                                </Text>
                                <Text style={[styles.sliderLabel, { color: themedColors.text.disabled }]}>
                                    {QUESTION_COUNTS[QUESTION_COUNTS.length - 1]}
                                </Text>
                            </View>
                        </View>

                        {/* Time Estimation */}
                        <View style={[styles.timeCard, { backgroundColor: themedColors.background.paper }]}>
                            <View style={styles.timeRow}>
                                <Ionicons name="time-outline" size={24} color={themedColors.primary.main} />
                                <View style={styles.timeInfo}>
                                    <Text style={[styles.timeLabel, { color: themedColors.text.secondary }]}>
                                        Estimated Time
                                    </Text>
                                    {loadingTime ? (
                                        <ActivityIndicator size="small" color={themedColors.primary.main} />
                                    ) : (
                                        <Text style={[styles.timeValue, { color: themedColors.text.primary }]}>
                                            {timeInfo ? formatTime(timeInfo.total_minutes) : '--'}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.timeDetails}>
                                <Text style={[styles.timeDetail, { color: themedColors.text.disabled }]}>
                                    Includes {timeInfo?.buffer_seconds ? `${Math.round(timeInfo.buffer_seconds / 60)} min` : '10%'} review buffer
                                </Text>
                            </View>
                        </View>

                        {/* Credits Info */}
                        <View style={[
                            styles.creditsCard,
                            {
                                backgroundColor: hasEnoughCredits
                                    ? (isDarkMode ? 'rgba(76, 175, 80, 0.1)' : '#E8F5E9')
                                    : (isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE'),
                                borderColor: hasEnoughCredits ? themedColors.success.main : themedColors.error.main,
                            }
                        ]}>
                            <View style={styles.creditsRow}>
                                <Ionicons
                                    name={hasEnoughCredits ? "checkmark-circle" : "alert-circle"}
                                    size={24}
                                    color={hasEnoughCredits ? themedColors.success.main : themedColors.error.main}
                                />
                                <View style={styles.creditsInfo}>
                                    <Text style={[styles.creditsLabel, { color: themedColors.text.secondary }]}>
                                        Credits Required
                                    </Text>
                                    <Text style={[styles.creditsValue, { color: themedColors.text.primary }]}>
                                        {creditCost.toFixed(1)} credits ({questionCount} questions × {formatCreditCost(creditCost / questionCount)} each) / {userCredits} available
                                    </Text>
                                </View>
                            </View>
                            {!hasEnoughCredits && (
                                <Text style={[styles.creditWarning, { color: themedColors.error.main }]}>
                                    ⚠️ Insufficient credits. Please top up to start this exam.
                                </Text>
                            )}
                            {(subject === 'mathematics' || subject === 'combined_science' || subject === 'computer_science' || subject.includes('a_level_')) && (
                                <Text style={[styles.creditDiscount, { color: themedColors.text.secondary }]}>
                                    💎 {formatCreditCost(creditCost / questionCount)} per question
                                    {subject === 'a_level_biology' && questionMode === 'MCQ_ONLY' && ' (MCQ)'}
                                    {subject === 'a_level_biology' && questionMode !== 'MCQ_ONLY' && questionMode !== 'MIXED' && ' (Structured/Essay)'}
                                </Text>
                            )}
                        </View>

                        {/* Start Button */}
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Begin Exam"
                                variant="primary"
                                size="large"
                                fullWidth
                                onPress={handleStartExam}
                                disabled={!hasEnoughCredits || starting || !timeInfo}
                                loading={starting}
                                icon="play-circle"
                                iconPosition="left"
                            />
                        </View>

                        {/* Info Text */}
                        <Text style={[styles.infoText, { color: themedColors.text.disabled }]}>
                            Questions are generated one at a time. Timer starts when exam begins.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: height * 0.85,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
    },
    modeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    modeButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    modeText: {
        fontSize: 13,
        fontWeight: '500',
    },
    sliderCard: {
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    questionCount: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    questionLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: 16,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 4,
    },
    sliderLabel: {
        fontSize: 12,
    },
    timeCard: {
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timeInfo: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 12,
    },
    timeValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 2,
    },
    timeDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    timeDetail: {
        fontSize: 12,
    },
    creditsCard: {
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
    },
    creditsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    creditsInfo: {
        flex: 1,
    },
    creditsLabel: {
        fontSize: 12,
    },
    creditsValue: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 2,
    },
    creditDiscount: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 8,
        textAlign: 'center',
    },
    creditWarning: {
        fontSize: 12,
        marginTop: 8,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 24,
    },
    infoText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 16,
        marginBottom: 20,
    },
    topicCard: {
        borderRadius: 16,
        padding: 16,
    },
    allTopicsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    allTopicsText: {
        fontSize: 16,
        fontWeight: '600',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    topicChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
    },
    topicChipText: {
        fontSize: 13,
        fontWeight: '500',
    },
});

export default ExamSetupModal;
