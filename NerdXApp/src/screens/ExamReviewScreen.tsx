// Exam Review Screen - Detailed question-by-question review after exam completion
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { examApi, ExamReview, ReviewQuestion } from '../services/api/examApi';
import MathRenderer from '../components/MathRenderer';
import { shouldRenderMathText, toMathLatex } from '../utils/mathText';
import { formatQuestionParts } from '../utils/formatQuestionText';

const ExamReviewScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const { sessionId } = route.params as { sessionId: string };

    const [review, setReview] = useState<ExamReview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadReview();
    }, [sessionId]);

    const loadReview = async () => {
        try {
            setLoading(true);
            const data = await examApi.getExamReview(sessionId);
            setReview(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load review');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToResults = () => {
        navigation.goBack();
    };

    const handleBackToHome = () => {
        navigation.navigate('Dashboard');
    };

    // Render question card
    const renderQuestionCard = (item: ReviewQuestion) => {
        const isCorrect = item.is_correct;
        const question = item.question;
        const renderContent = (content: string, textStyle: any, fontSize = 15) => {
            if (shouldRenderMathText(content)) {
                return (
                    <MathRenderer
                        content={toMathLatex(content, true)}
                        fontSize={fontSize}
                        style={textStyle}
                    />
                );
            }
            return <Text style={textStyle}>{content}</Text>;
        };

        return (
            <Card
                key={item.question_number}
                variant="elevated"
                style={[
                    styles.questionCard,
                    {
                        backgroundColor: themedColors.background.paper,
                        borderLeftWidth: 4,
                        borderLeftColor: isCorrect ? themedColors.success.main : themedColors.error.main,
                    }
                ]}
            >
                {/* Question Header */}
                <View style={styles.questionHeader}>
                    <View style={styles.questionNumberContainer}>
                        <Text style={[styles.questionNumber, { color: themedColors.text.primary }]}>
                            Q{item.question_number}
                        </Text>
                        {item.was_flagged && (
                            <Ionicons name="flag" size={14} color="#FFD700" style={{ marginLeft: 6 }} />
                        )}
                    </View>
                    <View style={[
                        styles.resultBadge,
                        { backgroundColor: isCorrect ? themedColors.success.main : themedColors.error.main }
                    ]}>
                        <Ionicons
                            name={isCorrect ? "checkmark" : "close"}
                            size={14}
                            color="#FFF"
                        />
                        <Text style={styles.resultBadgeText}>
                            {item.marks_awarded}/{item.marks_total}
                        </Text>
                    </View>
                </View>

                {/* Topic */}
                {question.topic && (
                    <Text style={[styles.topicText, { color: themedColors.text.disabled }]}>
                        {question.topic}
                    </Text>
                )}

                {/* Question Stem */}
                {renderContent(formatQuestionParts(question.stem), [styles.questionStem, { color: themedColors.text.primary }], 16)}

                {/* Options for MCQ */}
                {question.question_type === 'MCQ' && question.options && (
                    <View style={styles.optionsContainer}>
                        {question.options.map((option) => {
                            const isUserAnswer = item.user_answer === option.label;
                            const isCorrectOption = question.correct_option === option.label;

                            let optionStyle = styles.optionDefault;
                            let optionBg = themedColors.background.default;

                            if (isCorrectOption) {
                                optionBg = isDarkMode ? 'rgba(76, 175, 80, 0.2)' : '#E8F5E9';
                            } else if (isUserAnswer && !isCorrect) {
                                optionBg = isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFEBEE';
                            }

                            return (
                                <View
                                    key={option.label}
                                    style={[styles.optionRow, { backgroundColor: optionBg }]}
                                >
                                    <View style={[
                                        styles.optionLabel,
                                        {
                                            backgroundColor: isCorrectOption
                                                ? themedColors.success.main
                                                : (isUserAnswer && !isCorrect)
                                                    ? themedColors.error.main
                                                    : themedColors.border.main
                                        }
                                    ]}>
                                        <Text style={[
                                            styles.optionLabelText,
                                            { color: (isCorrectOption || isUserAnswer) ? '#FFF' : themedColors.text.primary }
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </View>
                                    {renderContent(option.text, [styles.optionText, { color: themedColors.text.primary }], 15)}
                                    {isCorrectOption && (
                                        <Ionicons name="checkmark-circle" size={20} color={themedColors.success.main} />
                                    )}
                                    {isUserAnswer && !isCorrectOption && (
                                        <Ionicons name="close-circle" size={20} color={themedColors.error.main} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Structured Answer */}
                {question.question_type === 'STRUCTURED' && (
                    <View style={styles.structuredReview}>
                        <Text style={[styles.answerLabel, { color: themedColors.text.secondary }]}>
                            Your Answer:
                        </Text>
                        <Text style={[styles.userAnswer, { color: themedColors.text.primary }]}>
                            {item.user_answer || '(No answer provided)'}
                        </Text>
                    </View>
                )}

                {/* Explanation */}
                {item.explanation && (
                    <View style={[styles.explanationContainer, { backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.1)' : '#E3F2FD' }]}>
                        <Ionicons name="bulb-outline" size={18} color={themedColors.primary.main} />
                        {renderContent(item.explanation, [styles.explanationText, { color: themedColors.text.primary }], 14)}
                    </View>
                )}

                {/* Time Spent */}
                <View style={styles.timeSpentContainer}>
                    <Ionicons name="time-outline" size={14} color={themedColors.text.disabled} />
                    <Text style={[styles.timeSpentText, { color: themedColors.text.disabled }]}>
                        {item.time_spent}s
                    </Text>
                </View>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themedColors.background.default }]}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <ActivityIndicator size="large" color={themedColors.primary.main} />
                <Text style={[styles.loadingText, { color: themedColors.text.primary }]}>
                    Loading review...
                </Text>
            </View>
        );
    }

    if (error || !review) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: themedColors.background.default }]}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <Ionicons name="alert-circle" size={48} color={themedColors.error.main} />
                <Text style={[styles.errorText, { color: themedColors.text.primary }]}>
                    {error || 'Failed to load review'}
                </Text>
                <Button title="Go Back" variant="outline" onPress={handleBackToResults} />
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
                <Text style={styles.headerTitle}>Detailed Review</Text>
                <Text style={styles.headerSubtitle}>
                    {review.questions.filter(q => q.is_correct).length} / {review.questions.length} correct
                </Text>
            </LinearGradient>

            {/* Question List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {review.summary_message && (
                    <Card variant="elevated" style={[styles.summaryCard, { backgroundColor: themedColors.background.paper }]}>
                        <Text style={[styles.summaryText, { color: themedColors.text.primary }]}>
                            {review.summary_message}
                        </Text>
                    </Card>
                )}

                {review.questions.map(renderQuestionCard)}

                {/* Bottom Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Back to Results"
                        variant="outline"
                        fullWidth
                        onPress={handleBackToResults}
                        icon="arrow-back"
                        iconPosition="left"
                    />
                    <Button
                        title="Back to Home"
                        variant="primary"
                        fullWidth
                        onPress={handleBackToHome}
                        icon="home"
                        iconPosition="left"
                    />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: 20,
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
    content: {
        flex: 1,
        padding: 16,
    },
    summaryCard: {
        marginBottom: 16,
    },
    summaryText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
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
    questionNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    resultBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
    },
    topicText: {
        fontSize: 12,
        marginBottom: 8,
    },
    questionStem: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 12,
    },
    optionsContainer: {
        gap: 8,
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        gap: 10,
    },
    optionDefault: {},
    optionLabel: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabelText: {
        fontSize: 14,
        fontWeight: '600',
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    structuredReview: {
        marginBottom: 12,
    },
    answerLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    userAnswer: {
        fontSize: 14,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    explanationContainer: {
        flexDirection: 'row',
        gap: 10,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    explanationText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
    },
    timeSpentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeSpentText: {
        fontSize: 12,
    },
    buttonContainer: {
        gap: 12,
        marginTop: 8,
    },
});

export default ExamReviewScreen;
