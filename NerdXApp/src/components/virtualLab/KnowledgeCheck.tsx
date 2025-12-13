// Knowledge Check Component
// Quiz displayed after completing a simulation

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { QuizQuestion } from '../../data/virtualLab';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';

const { width, height } = Dimensions.get('window');

interface KnowledgeCheckProps {
    visible: boolean;
    questions: QuizQuestion[];
    simulationTitle: string;
    xpReward: number;
    onComplete: (score: number, xpEarned: number) => void;
    onClose: () => void;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
    visible,
    questions,
    simulationTitle,
    xpReward,
    onComplete,
    onClose,
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleSelectAnswer = (index: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        setShowExplanation(true);
        if (index === currentQuestion.correctIndex) {
            setCorrectAnswers(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            // Quiz complete
            setIsComplete(true);
        }
    };

    const handleFinish = () => {
        const score = Math.round((correctAnswers / questions.length) * 100);
        const xpEarned = Math.round((correctAnswers / questions.length) * xpReward);
        onComplete(score, xpEarned);
        // Reset state
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setCorrectAnswers(0);
        setIsComplete(false);
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setCorrectAnswers(0);
        setIsComplete(false);
    };

    if (!visible || !currentQuestion) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
                {/* Header */}
                <LinearGradient
                    colors={['#1976D2', '#1565C0']}
                    style={styles.header}
                >
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Knowledge Check</Text>
                    <Text style={styles.headerSubtitle}>{simulationTitle}</Text>

                    {/* Progress bar */}
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        Question {currentIndex + 1} of {questions.length}
                    </Text>
                </LinearGradient>

                {!isComplete ? (
                    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                        {/* Question */}
                        <Text style={[styles.question, { color: themedColors.text.primary }]}>
                            {currentQuestion.question}
                        </Text>

                        {/* Options */}
                        {currentQuestion.options.map((option, index) => {
                            let optionStyle = styles.option;
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
                                    style={[
                                        styles.option,
                                        { backgroundColor: optionColor, borderColor: borderColor }
                                    ]}
                                    onPress={() => handleSelectAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                >
                                    <View style={[styles.optionIndex, { borderColor: borderColor }]}>
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

                        {/* Explanation */}
                        {showExplanation && (
                            <View style={[styles.explanationBox, {
                                backgroundColor: isCorrect ? '#4CAF5010' : '#FF980010',
                                borderColor: isCorrect ? '#4CAF50' : '#FF9800'
                            }]}>
                                <View style={styles.explanationHeader}>
                                    <Ionicons
                                        name={isCorrect ? "checkmark-circle" : "information-circle"}
                                        size={24}
                                        color={isCorrect ? '#4CAF50' : '#FF9800'}
                                    />
                                    <Text style={[styles.explanationTitle, {
                                        color: isCorrect ? '#4CAF50' : '#FF9800'
                                    }]}>
                                        {isCorrect ? 'Correct!' : 'Explanation'}
                                    </Text>
                                </View>
                                <Text style={[styles.explanationText, { color: themedColors.text.primary }]}>
                                    {currentQuestion.explanation}
                                </Text>
                            </View>
                        )}

                        {/* Next Button */}
                        {selectedAnswer !== null && (
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={handleNext}
                            >
                                <Text style={styles.nextButtonText}>
                                    {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                ) : (
                    // Results screen
                    <View style={styles.resultsContainer}>
                        <View style={[styles.resultsCard, { backgroundColor: themedColors.background.paper }]}>
                            <Ionicons
                                name={correctAnswers === questions.length ? "trophy" : "ribbon"}
                                size={64}
                                color={correctAnswers === questions.length ? "#FFD700" : "#1976D2"}
                            />
                            <Text style={[styles.resultsTitle, { color: themedColors.text.primary }]}>
                                {correctAnswers === questions.length ? 'Perfect Score!' : 'Quiz Complete!'}
                            </Text>
                            <Text style={[styles.scoreText, { color: themedColors.text.secondary }]}>
                                You got {correctAnswers} out of {questions.length} correct
                            </Text>

                            <View style={styles.xpEarned}>
                                <Ionicons name="star" size={28} color="#FFD700" />
                                <Text style={styles.xpEarnedText}>
                                    +{Math.round((correctAnswers / questions.length) * xpReward)} XP
                                </Text>
                            </View>

                            <View style={styles.resultsButtons}>
                                <TouchableOpacity
                                    style={[styles.retryButton, { borderColor: themedColors.primary.main }]}
                                    onPress={resetQuiz}
                                >
                                    <Ionicons name="refresh" size={20} color={themedColors.primary.main} />
                                    <Text style={[styles.retryButtonText, { color: themedColors.primary.main }]}>
                                        Retry Quiz
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.finishButton}
                                    onPress={handleFinish}
                                >
                                    <Text style={styles.finishButtonText}>Finish</Text>
                                    <Ionicons name="checkmark" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
});

export default KnowledgeCheck;
