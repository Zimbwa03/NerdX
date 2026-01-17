// Exam Results Screen - Display final exam results with grade and breakdown
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ExamResults, GRADE_BOUNDARIES } from '../services/api/examApi';

const { width } = Dimensions.get('window');

const ExamResultsScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();

    const { sessionId, results } = route.params as {
        sessionId: string;
        results: ExamResults;
    };

    const { score, time, topic_breakdown, weak_areas, encouragement, revision_suggestions, xp_earned } = results;

    // Get grade color
    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return '#4CAF50';
            case 'B': return '#8BC34A';
            case 'C': return '#CDDC39';
            case 'D': return '#FFC107';
            case 'E': return '#FF9800';
            case 'U': return '#F44336';
            default: return themedColors.text.primary;
        }
    };

    // Get grade background
    const getGradeGradient = (grade: string): [string, string] => {
        switch (grade) {
            case 'A': return ['#4CAF50', '#2E7D32'];
            case 'B': return ['#8BC34A', '#558B2F'];
            case 'C': return ['#CDDC39', '#9E9D24'];
            case 'D': return ['#FFC107', '#F57C00'];
            case 'E': return ['#FF9800', '#E65100'];
            case 'U': return ['#F44336', '#C62828'];
            default: return themedColors.gradients.primary as [string, string];
        }
    };

    // Calculate progress ring
    const progressRingSize = 180;
    const strokeWidth = 15;
    const radius = (progressRingSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressOffset = circumference - (score.percentage / 100) * circumference;

    const handleViewReview = () => {
        navigation.navigate('ExamReview', { sessionId });
    };

    const handleBackToHome = () => {
        navigation.navigate('Dashboard');
    };

    const handleTryAgain = () => {
        navigation.goBack();
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: themedColors.background.default }]}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle="light-content" />

            {/* Header with Grade */}
            <LinearGradient
                colors={getGradeGradient(score.grade)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Exam Complete!</Text>

                {/* Score Circle */}
                <View style={styles.scoreCircleContainer}>
                    <View style={[styles.scoreCircle, { width: progressRingSize, height: progressRingSize }]}>
                        <Text style={styles.gradeText}>{score.grade}</Text>
                        <Text style={styles.percentageText}>{Math.round(score.percentage)}%</Text>
                    </View>
                </View>

                <Text style={styles.scoreText}>
                    {score.correct_count} / {score.total_questions} correct
                </Text>

                {xp_earned && xp_earned > 0 && (
                    <View style={styles.xpBadge}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.xpText}>+{xp_earned} XP earned!</Text>
                    </View>
                )}
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
                {/* Encouragement Message */}
                <Card variant="elevated" style={[styles.encouragementCard, { backgroundColor: themedColors.background.paper }]}>
                    <Ionicons
                        name={score.percentage >= 50 ? "happy-outline" : "sad-outline"}
                        size={32}
                        color={themedColors.primary.main}
                    />
                    <Text style={[styles.encouragementText, { color: themedColors.text.primary }]}>
                        {encouragement}
                    </Text>
                </Card>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <Card variant="elevated" style={[styles.statCard, { backgroundColor: themedColors.background.paper }]}>
                        <Ionicons name="time-outline" size={24} color={themedColors.primary.main} />
                        <Text style={[styles.statValue, { color: themedColors.text.primary }]}>{time.used_formatted}</Text>
                        <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Time Used</Text>
                    </Card>

                    <Card variant="elevated" style={[styles.statCard, { backgroundColor: themedColors.background.paper }]}>
                        <Ionicons name="checkmark-circle-outline" size={24} color={themedColors.success.main} />
                        <Text style={[styles.statValue, { color: themedColors.text.primary }]}>{score.answered_count}</Text>
                        <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Answered</Text>
                    </Card>

                    <Card variant="elevated" style={[styles.statCard, { backgroundColor: themedColors.background.paper }]}>
                        <Ionicons name="help-circle-outline" size={24} color={themedColors.text.disabled} />
                        <Text style={[styles.statValue, { color: themedColors.text.primary }]}>{score.unanswered_count}</Text>
                        <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>Skipped</Text>
                    </Card>
                </View>

                {/* Topic Breakdown */}
                <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                    Topic Breakdown
                </Text>
                <Card variant="elevated" style={[styles.breakdownCard, { backgroundColor: themedColors.background.paper }]}>
                    {Object.entries(topic_breakdown).map(([topic, stats]) => {
                        const percentage = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
                        const isWeak = weak_areas.includes(topic);

                        return (
                            <View key={topic} style={styles.topicRow}>
                                <View style={styles.topicInfo}>
                                    <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                                        {topic}
                                    </Text>
                                    <Text style={[styles.topicScore, { color: themedColors.text.secondary }]}>
                                        {stats.correct}/{stats.total}
                                    </Text>
                                </View>
                                <View style={styles.topicBarContainer}>
                                    <View style={[styles.topicBarBg, { backgroundColor: themedColors.border.medium }]} />
                                    <View
                                        style={[
                                            styles.topicBar,
                                            {
                                                width: `${percentage}%`,
                                                backgroundColor: isWeak ? themedColors.error.main : themedColors.success.main,
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[
                                    styles.topicPercentage,
                                    { color: isWeak ? themedColors.error.main : themedColors.success.main }
                                ]}>
                                    {Math.round(percentage)}%
                                </Text>
                            </View>
                        );
                    })}
                </Card>

                {/* Weak Areas / Revision Suggestions */}
                {weak_areas.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
                            Focus Areas
                        </Text>
                        <Card
                            variant="elevated"
                            style={[
                                styles.weakAreasCard,
                                {
                                    backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
                                    borderColor: themedColors.error.main,
                                }
                            ]}
                        >
                            <Ionicons name="alert-circle" size={24} color={themedColors.error.main} />
                            <View style={styles.weakAreasList}>
                                {revision_suggestions.map((suggestion, index) => (
                                    <Text key={index} style={[styles.weakAreaItem, { color: themedColors.text.primary }]}>
                                        • {suggestion}
                                    </Text>
                                ))}
                            </View>
                        </Card>
                    </>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="View Detailed Review"
                        variant="primary"
                        size="large"
                        fullWidth
                        onPress={handleViewReview}
                        icon="document-text"
                        iconPosition="left"
                    />

                    <View style={styles.secondaryButtons}>
                        <Button
                            title="Try Again"
                            variant="outline"
                            size="medium"
                            onPress={handleTryAgain}
                            icon="refresh"
                            iconPosition="left"
                            style={{ flex: 1 }}
                        />
                        <Button
                            title="Home"
                            variant="outline"
                            size="medium"
                            onPress={handleBackToHome}
                            icon="home"
                            iconPosition="left"
                            style={{ flex: 1 }}
                        />
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 24,
    },
    scoreCircleContainer: {
        marginBottom: 16,
    },
    scoreCircle: {
        borderRadius: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradeText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFF',
    },
    percentageText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: -8,
    },
    scoreText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 16,
    },
    xpText: {
        color: '#FFD700',
        fontWeight: '600',
        fontSize: 14,
    },
    content: {
        padding: 20,
        marginTop: -20,
    },
    encouragementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    encouragementText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    breakdownCard: {
        marginBottom: 24,
    },
    topicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    topicInfo: {
        width: 100,
    },
    topicName: {
        fontSize: 13,
        fontWeight: '500',
    },
    topicScore: {
        fontSize: 11,
        marginTop: 2,
    },
    topicBarContainer: {
        flex: 1,
        height: 8,
        marginHorizontal: 12,
        position: 'relative',
    },
    topicBarBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 4,
    },
    topicBar: {
        height: '100%',
        borderRadius: 4,
    },
    topicPercentage: {
        width: 45,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '600',
    },
    weakAreasCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        borderWidth: 1,
        marginBottom: 24,
    },
    weakAreasList: {
        flex: 1,
    },
    weakAreaItem: {
        fontSize: 14,
        lineHeight: 24,
    },
    buttonContainer: {
        gap: 12,
    },
    secondaryButtons: {
        flexDirection: 'row',
        gap: 12,
    },
});

export default ExamResultsScreen;
