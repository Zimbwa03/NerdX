// Knowledge Check Component
// Quiz displayed after completing a simulation (DeepSeek-generated, with fallback)

import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SimulationMetadata, QuizQuestion } from '../../data/virtualLab';
import { useThemedColors } from '../../theme/useThemedStyles';
import { virtualLabApi } from '../../services/api/virtualLabApi';
import { gamificationService } from '../../services/GamificationService';

const { width } = Dimensions.get('window');

export interface KnowledgeCheckResult {
    correctAnswers: number;
    totalQuestions: number;
    scorePercent: number;
    xpEarned: number;
}

interface KnowledgeCheckProps {
    visible: boolean;
    simulation: SimulationMetadata;
    onComplete?: (result: KnowledgeCheckResult) => void;
    onClose: () => void;
}

type Step = 'setup' | 'loading' | 'quiz';

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
    visible,
    simulation,
    onComplete,
    onClose,
}) => {
    const themedColors = useThemedColors();
    const navigation = useNavigation<any>();

    const [step, setStep] = useState<Step>('setup');
    const [questionCount, setQuestionCount] = useState(5);
    const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
    const [usedFallback, setUsedFallback] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = activeQuestions[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
    const progress = activeQuestions.length > 0 ? ((currentIndex + 1) / activeQuestions.length) * 100 : 0;

    useEffect(() => {
        if (!visible) return;
        // Reset for a fresh attempt each time the modal opens
        setStep('setup');
        setQuestionCount(5);
        setActiveQuestions([]);
        setUsedFallback(false);
        setLoadError(null);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setCorrectAnswers(0);
        setIsComplete(false);
    }, [visible, simulation.id]);

    const fallbackQuestions = useMemo(() => {
        const qs = simulation.quizQuestions || [];
        // Ensure deterministic but varied fallback selection
        return qs.slice(0, Math.max(1, Math.min(qs.length, 10)));
    }, [simulation.quizQuestions]);

    const clampCount = (n: number) => Math.max(3, Math.min(20, n));

    const buildFallback = (count: number): QuizQuestion[] => {
        if (!fallbackQuestions.length) {
            return [
                {
                    id: 'fallback-q1',
                    question: `What is the key idea in "${simulation.topic}"?`,
                    options: ['Definition', 'Example', 'Application', 'All of the above'],
                    correctIndex: 3,
                    explanation: 'Good learning connects definitions, examples, and applications.',
                },
            ];
        }
        const result: QuizQuestion[] = [];
        let i = 0;
        while (result.length < count) {
            result.push({ ...fallbackQuestions[i % fallbackQuestions.length], id: `${fallbackQuestions[i % fallbackQuestions.length].id}-${i}` });
            i++;
        }
        return result.slice(0, count);
    };

    const startQuiz = async () => {
        const count = clampCount(questionCount);
        setStep('loading');
        setLoadError(null);
        setUsedFallback(false);

        try {
            const data = await virtualLabApi.generateKnowledgeCheck({
                simulation_id: simulation.id,
                subject: simulation.subject,
                topic: simulation.topic,
                difficulty: simulation.difficulty,
                count,
            });

            const mapped: QuizQuestion[] = (data || [])
                .filter(q => q && q.question_text && Array.isArray(q.options) && q.options.length >= 2)
                .map(q => ({
                    id: q.id,
                    question: q.question_text,
                    options: q.options,
                    correctIndex: typeof q.correct_index === 'number' ? q.correct_index : 0,
                    explanation: q.explanation || '',
                }));

            let finalQuestions = mapped.slice(0, count);
            if (finalQuestions.length < count) {
                // Top up with fallback to avoid blocking learning if API returns short
                finalQuestions = [...finalQuestions, ...buildFallback(count - finalQuestions.length)];
                setUsedFallback(true);
            }

            setActiveQuestions(finalQuestions);
            setStep('quiz');
        } catch (e: any) {
            setUsedFallback(true);
            setLoadError('Could not load AI questions. Using offline questions instead.');
            setActiveQuestions(buildFallback(count));
            setStep('quiz');
        }
    };

    const handleSelectAnswer = (index: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        setShowExplanation(true);
        if (index === currentQuestion.correctIndex) {
            setCorrectAnswers(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < activeQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setIsComplete(true);
        }
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setCorrectAnswers(0);
        setIsComplete(false);
    };

    const finalize = async (goToProgress?: boolean) => {
        const total = Math.max(1, activeQuestions.length);
        const scorePercent = Math.round((correctAnswers / total) * 100);
        const xpEarned = Math.round((correctAnswers / total) * simulation.xpReward);

        try {
            await gamificationService.logVirtualLabKnowledgeCheck({
                xpEarned,
                totalQuestions: total,
                correctAnswers,
                subjectForMastery: 'science',
                scorePercent,
            });
        } catch {
            // Non-blocking: user can still finish even if storage write fails
        }

        onComplete?.({
            correctAnswers,
            totalQuestions: total,
            scorePercent,
            xpEarned,
        });

        onClose();
        if (goToProgress) {
            navigation.navigate('Progress');
        }
    };

    const handleFinish = () => {
        void finalize(false);
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
                {/* Header */}
                <LinearGradient colors={['#1976D2', '#1565C0']} style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Knowledge Check</Text>
                    <Text style={styles.headerSubtitle}>{simulation.title}</Text>

                    {/* Progress bar (only for quiz step) */}
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${step === 'quiz' ? progress : 0}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        {step === 'quiz' && activeQuestions.length > 0
                            ? `Question ${currentIndex + 1} of ${activeQuestions.length}`
                            : 'Powered by DeepSeek • Choose your question count'}
                    </Text>
                </LinearGradient>

                {step === 'setup' && (
                    <View style={styles.setupContainer}>
                        <View style={[styles.setupCard, { backgroundColor: themedColors.background.paper }]}>
                            <Text style={[styles.setupTitle, { color: themedColors.text.primary }]}>
                                How many questions do you want to attempt?
                            </Text>

                            <View style={styles.countRow}>
                                <TouchableOpacity
                                    style={[styles.countBtn, { backgroundColor: themedColors.background.subtle }]}
                                    onPress={() => setQuestionCount(c => clampCount(c - 1))}
                                >
                                    <Ionicons name="remove" size={20} color={themedColors.text.primary} />
                                </TouchableOpacity>
                                <Text style={[styles.countValue, { color: themedColors.text.primary }]}>{clampCount(questionCount)}</Text>
                                <TouchableOpacity
                                    style={[styles.countBtn, { backgroundColor: themedColors.primary.main }]}
                                    onPress={() => setQuestionCount(c => clampCount(c + 1))}
                                >
                                    <Ionicons name="add" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.quickCounts}>
                                {[3, 5, 10, 15].map(n => (
                                    <TouchableOpacity
                                        key={n}
                                        style={[
                                            styles.quickChip,
                                            { backgroundColor: clampCount(questionCount) === n ? themedColors.primary.main : themedColors.background.subtle }
                                        ]}
                                        onPress={() => setQuestionCount(n)}
                                    >
                                        <Text style={{ color: clampCount(questionCount) === n ? '#FFF' : themedColors.text.primary, fontWeight: '600' }}>
                                            {n}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
                                <Ionicons name="sparkles" size={18} color="#FFF" />
                                <Text style={styles.startButtonText}>Start AI Knowledge Check</Text>
                            </TouchableOpacity>

                            <Text style={[styles.setupHint, { color: themedColors.text.secondary }]}>
                                We’ll generate fresh questions based on the simulation topic.
                            </Text>
                        </View>
                    </View>
                )}

                {step === 'loading' && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={themedColors.primary.main} />
                        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
                            Generating questions…
                        </Text>
                    </View>
                )}

                {step === 'quiz' && currentQuestion && (
                    <>
                        {!isComplete ? (
                            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                                {loadError && (
                                    <View style={[styles.banner, { backgroundColor: '#FF980015', borderColor: '#FF9800' }]}>
                                        <Ionicons name="warning" size={18} color="#FF9800" />
                                        <Text style={[styles.bannerText, { color: themedColors.text.primary }]}>
                                            {loadError}
                                        </Text>
                                    </View>
                                )}
                                {usedFallback && !loadError && (
                                    <View style={[styles.banner, { backgroundColor: '#1976D215', borderColor: '#1976D2' }]}>
                                        <Ionicons name="information-circle" size={18} color="#1976D2" />
                                        <Text style={[styles.bannerText, { color: themedColors.text.primary }]}>
                                            Some questions were filled from offline backups.
                                        </Text>
                                    </View>
                                )}

                                <Text style={[styles.question, { color: themedColors.text.primary }]}>
                                    {currentQuestion.question}
                                </Text>

                                {currentQuestion.options.map((option, index) => {
                                    let optionColor = themedColors.background.paper;
                                    let textColor = themedColors.text.primary;
                                    let borderColor = themedColors.text.secondary + '40';

                                    if (selectedAnswer !== null) {
                                        if (index === currentQuestion.correctIndex) {
                                            optionColor = '#4CAF5020';
                                            borderColor = '#4CAF50';
                                            textColor = '#4CAF50';
                                        } else if (index === selectedAnswer && !isCorrect) {
                                            optionColor = '#F4433620';
                                            borderColor = '#F44336';
                                            textColor = '#F44336';
                                        }
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.option, { backgroundColor: optionColor, borderColor }]}
                                            onPress={() => handleSelectAnswer(index)}
                                            disabled={selectedAnswer !== null}
                                        >
                                            <View style={[styles.optionIndex, { borderColor }]}>
                                                <Text style={[styles.optionIndexText, { color: textColor }]}>
                                                    {String.fromCharCode(65 + index)}
                                                </Text>
                                            </View>
                                            <Text style={[styles.optionText, { color: textColor }]}>
                                                {option}
                                            </Text>
                                            {selectedAnswer !== null && index === currentQuestion.correctIndex && (
                                                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                            )}
                                            {selectedAnswer === index && !isCorrect && (
                                                <Ionicons name="close-circle" size={24} color="#F44336" />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}

                                {showExplanation && (
                                    <View style={[
                                        styles.explanationBox,
                                        {
                                            backgroundColor: isCorrect ? '#4CAF5010' : '#FF980010',
                                            borderColor: isCorrect ? '#4CAF50' : '#FF9800'
                                        }
                                    ]}>
                                        <View style={styles.explanationHeader}>
                                            <Ionicons
                                                name={isCorrect ? "checkmark-circle" : "information-circle"}
                                                size={24}
                                                color={isCorrect ? '#4CAF50' : '#FF9800'}
                                            />
                                            <Text style={[
                                                styles.explanationTitle,
                                                { color: isCorrect ? '#4CAF50' : '#FF9800' }
                                            ]}>
                                                {isCorrect ? 'Correct!' : 'Explanation'}
                                            </Text>
                                        </View>
                                        <Text style={[styles.explanationText, { color: themedColors.text.primary }]}>
                                            {currentQuestion.explanation || 'Review the concept and try again.'}
                                        </Text>
                                    </View>
                                )}

                                {selectedAnswer !== null && (
                                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                                        <Text style={styles.nextButtonText}>
                                            {currentIndex < activeQuestions.length - 1 ? 'Next Question' : 'See Results'}
                                        </Text>
                                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        ) : (
                            <View style={styles.resultsContainer}>
                                <View style={[styles.resultsCard, { backgroundColor: themedColors.background.paper }]}>
                                    <Ionicons
                                        name={correctAnswers === activeQuestions.length ? "trophy" : "ribbon"}
                                        size={64}
                                        color={correctAnswers === activeQuestions.length ? "#FFD700" : "#1976D2"}
                                    />
                                    <Text style={[styles.resultsTitle, { color: themedColors.text.primary }]}>
                                        {correctAnswers === activeQuestions.length ? 'Perfect Score!' : 'Quiz Complete!'}
                                    </Text>
                                    <Text style={[styles.scoreText, { color: themedColors.text.secondary }]}>
                                        You got {correctAnswers} out of {activeQuestions.length} correct
                                    </Text>

                                    <View style={styles.xpEarned}>
                                        <Ionicons name="star" size={28} color="#FFD700" />
                                        <Text style={styles.xpEarnedText}>
                                            +{Math.round((correctAnswers / Math.max(1, activeQuestions.length)) * simulation.xpReward)} XP
                                        </Text>
                                    </View>

                                    <View style={styles.resultsButtons}>
                                        <TouchableOpacity
                                            style={[styles.retryButton, { borderColor: themedColors.primary.main }]}
                                            onPress={resetQuiz}
                                        >
                                            <Ionicons name="refresh" size={20} color={themedColors.primary.main} />
                                            <Text style={[styles.retryButtonText, { color: themedColors.primary.main }]}>
                                                Retry
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.progressButton, { borderColor: themedColors.primary.main }]}
                                            onPress={() => { void finalize(true); }}
                                        >
                                            <Ionicons name="stats-chart" size={20} color={themedColors.primary.main} />
                                            <Text style={[styles.progressButtonText, { color: themedColors.primary.main }]}>
                                                My Progress
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                                            <Text style={styles.finishButtonText}>Finish</Text>
                                            <Ionicons name="checkmark" size={20} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    </>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FFFFFF90',
        marginBottom: 16,
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#FFFFFF30',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#FFFFFF90',
        marginTop: 8,
        textAlign: 'center',
    },
    setupContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    setupCard: {
        padding: 20,
        borderRadius: 16,
    },
    setupTitle: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    countRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 14,
    },
    countBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countValue: {
        fontSize: 28,
        fontWeight: '800',
        minWidth: 50,
        textAlign: 'center',
    },
    quickCounts: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    quickChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        minWidth: 48,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#1976D2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        marginBottom: 10,
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    setupHint: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 24,
        lineHeight: 26,
    },
    banner: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    bannerText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
    },
    optionIndex: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionIndexText: {
        fontSize: 14,
        fontWeight: '600',
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    explanationBox: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 8,
        marginBottom: 20,
    },
    explanationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    explanationTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    explanationText: {
        fontSize: 14,
        lineHeight: 22,
    },
    nextButton: {
        backgroundColor: '#1976D2',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resultsContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    resultsCard: {
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 16,
        marginBottom: 24,
    },
    xpEarned: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD70020',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        marginBottom: 32,
    },
    xpEarnedText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginLeft: 8,
    },
    resultsButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        gap: 8,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    finishButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    progressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        gap: 8,
    },
    progressButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default KnowledgeCheck;
