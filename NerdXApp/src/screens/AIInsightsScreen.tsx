// AI Insights Screen - Personalized AI learning feedback
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ImageBackground,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import Colors from '../theme/colors';
import FloatingParticles from '../components/FloatingParticles';
import { accountApi, AIInsights, SkillInsight, StudyPlanItem } from '../services/api/accountApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AIInsightsScreen: React.FC = () => {
    const navigation = useNavigation();
    const themedColors = useThemedColors();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState<AIInsights | null>(null);

    const loadData = useCallback(async () => {
        try {
            const data = await accountApi.getAIInsights();
            if (data) setInsights(data);
        } catch (error) {
            console.error('Failed to load AI insights:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const getHealthScoreColor = (score: number) => {
        if (score >= 80) return Colors.success.main;
        if (score >= 60) return Colors.primary.main;
        if (score >= 40) return Colors.warning.main;
        return Colors.error.main;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'mastered': return '🏆';
            case 'proficient': return '✅';
            case 'learning': return '📚';
            case 'struggling': return '⚠️';
            default: return '📖';
        }
    };

    const renderSkillCard = (skill: SkillInsight, index: number) => (
        <View key={index} style={styles.skillCard}>
            <View style={styles.skillHeader}>
                <Text style={styles.skillIcon}>{getStatusIcon(skill.status)}</Text>
                <View style={styles.skillInfo}>
                    <Text style={styles.skillName}>{skill.skill_name}</Text>
                    <Text style={styles.skillMeta}>{skill.subject} • {skill.topic}</Text>
                </View>
                <View style={styles.masteryBadge}>
                    <Text style={styles.masteryValue}>{skill.mastery}%</Text>
                </View>
            </View>
            {/* Mastery Progress Bar */}
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${skill.mastery}%`,
                            backgroundColor: skill.mastery >= 70 ? Colors.success.main : skill.mastery >= 40 ? Colors.warning.main : Colors.error.main
                        }
                    ]}
                />
            </View>
            {skill.recommendation && (
                <Text style={styles.recommendation}>{skill.recommendation}</Text>
            )}
        </View>
    );

    const renderStudyPlanItem = (item: StudyPlanItem, index: number) => (
        <View key={index} style={styles.studyPlanItem}>
            <View style={[
                styles.priorityIndicator,
                {
                    backgroundColor: item.priority === 'high' ? Colors.error.main :
                        item.priority === 'medium' ? Colors.warning.main : Colors.primary.main
                }
            ]} />
            <View style={styles.studyPlanContent}>
                <Text style={styles.studyPlanAction}>{item.action}</Text>
                <Text style={styles.studyPlanDescription}>{item.description}</Text>
            </View>
            <View style={styles.studyPlanTime}>
                <Text style={styles.studyPlanTimeText}>{item.estimated_time}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themedColors.background.default }]}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
                    Analyzing your learning data...
                </Text>
            </View>
        );
    }

    if (!insights) {
        return (
            <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
                <ImageBackground
                    source={require('../../assets/images/default_background.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>AI Insights</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🧠</Text>
                        <Text style={styles.emptyTitle}>No Insights Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Start answering questions to unlock personalized AI learning insights!
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <ImageBackground
                source={require('../../assets/images/default_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <FloatingParticles count={12} />
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary.main]} />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>AI Insights</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Health Score Card */}
                    <View style={styles.healthScoreCard}>
                        <LinearGradient
                            colors={['rgba(139, 92, 246, 0.25)', 'rgba(124, 58, 237, 0.25)']}
                            style={styles.healthGradient}
                        >
                            <View style={styles.healthScoreCircle}>
                                <Text style={[styles.healthScoreValue, { color: getHealthScoreColor(insights.health_score) }]}>
                                    {insights.health_score}
                                </Text>
                                <Text style={styles.healthScoreLabel}>Learning Health</Text>
                            </View>
                            <View style={styles.healthStats}>
                                <View style={styles.healthStatItem}>
                                    <Text style={styles.healthStatValue}>{insights.total_skills}</Text>
                                    <Text style={styles.healthStatLabel}>Skills</Text>
                                </View>
                                <View style={styles.healthStatDivider} />
                                <View style={styles.healthStatItem}>
                                    <Text style={[styles.healthStatValue, { color: Colors.success.main }]}>
                                        {insights.mastered_count}
                                    </Text>
                                    <Text style={styles.healthStatLabel}>Mastered</Text>
                                </View>
                                <View style={styles.healthStatDivider} />
                                <View style={styles.healthStatItem}>
                                    <Text style={[styles.healthStatValue, { color: Colors.warning.main }]}>
                                        {insights.learning_count}
                                    </Text>
                                    <Text style={styles.healthStatLabel}>Learning</Text>
                                </View>
                                <View style={styles.healthStatDivider} />
                                <View style={styles.healthStatItem}>
                                    <Text style={[styles.healthStatValue, { color: Colors.error.main }]}>
                                        {insights.struggling_count}
                                    </Text>
                                    <Text style={styles.healthStatLabel}>Need Work</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Personalized Message */}
                    <View style={styles.messageCard}>
                        <Text style={styles.messageText}>{insights.personalized_message}</Text>
                    </View>

                    {/* Weekly Trend */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📊 This Week</Text>
                        <View style={styles.weeklyCard}>
                            <View style={styles.weeklyStats}>
                                <View style={styles.weeklyStat}>
                                    <Text style={styles.weeklyStatValue}>{insights.weekly_trend.total_questions}</Text>
                                    <Text style={styles.weeklyStatLabel}>Questions</Text>
                                </View>
                                <View style={styles.weeklyStat}>
                                    <Text style={[styles.weeklyStatValue, { color: Colors.success.main }]}>
                                        {insights.weekly_trend.accuracy}%
                                    </Text>
                                    <Text style={styles.weeklyStatLabel}>Accuracy</Text>
                                </View>
                                <View style={styles.weeklyStat}>
                                    <Text style={styles.weeklyStatValue}>{insights.weekly_trend.active_days}/7</Text>
                                    <Text style={styles.weeklyStatLabel}>Active Days</Text>
                                </View>
                            </View>
                            {/* Daily Activity Mini Chart */}
                            <View style={styles.dailyChart}>
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                    const dayData = insights.weekly_trend.daily_breakdown[i];
                                    const count = dayData?.count || 0;
                                    const maxCount = Math.max(...insights.weekly_trend.daily_breakdown.map(d => d.count), 1);
                                    const height = count > 0 ? Math.max((count / maxCount) * 40, 4) : 4;
                                    return (
                                        <View key={i} style={styles.dailyChartBar}>
                                            <View style={[
                                                styles.dailyChartFill,
                                                { height, backgroundColor: count > 0 ? Colors.primary.main : 'rgba(255,255,255,0.15)' }
                                            ]} />
                                            <Text style={styles.dailyChartLabel}>{day}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    {/* Strengths */}
                    {insights.strengths.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>💪 Your Strengths</Text>
                            <Text style={styles.sectionSubtitle}>Skills you've mastered - keep it up!</Text>
                            {insights.strengths.map(renderSkillCard)}
                        </View>
                    )}

                    {/* Focus Areas */}
                    {insights.focus_areas.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>🎯 Focus Areas</Text>
                            <Text style={styles.sectionSubtitle}>Skills that need more practice</Text>
                            {insights.focus_areas.map(renderSkillCard)}
                        </View>
                    )}

                    {/* AI Study Plan */}
                    {insights.study_plan.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📝 Your AI Study Plan</Text>
                            <Text style={styles.sectionSubtitle}>Personalized recommendations for today</Text>
                            <View style={styles.studyPlanCard}>
                                {insights.study_plan.map(renderStudyPlanItem)}
                            </View>
                        </View>
                    )}

                    {/* Last Updated */}
                    <Text style={styles.lastUpdated}>
                        Last analyzed: {new Date(insights.last_updated).toLocaleString()}
                    </Text>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, width: '100%', height: '100%' },
    scrollView: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: { fontSize: 24, color: '#FFFFFF' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
    healthScoreCard: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    healthGradient: {
        padding: 24,
        alignItems: 'center',
    },
    healthScoreCircle: {
        alignItems: 'center',
        marginBottom: 20,
    },
    healthScoreValue: {
        fontSize: 64,
        fontWeight: 'bold',
    },
    healthScoreLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 4,
    },
    healthStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    healthStatItem: {
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    healthStatValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    healthStatLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
    },
    healthStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    messageCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    messageText: {
        fontSize: 16,
        color: '#FFFFFF',
        lineHeight: 24,
        textAlign: 'center',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 12,
    },
    weeklyCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    weeklyStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    weeklyStat: {
        alignItems: 'center',
    },
    weeklyStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    weeklyStatLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 4,
    },
    dailyChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 60,
        paddingTop: 10,
    },
    dailyChartBar: {
        alignItems: 'center',
        flex: 1,
    },
    dailyChartFill: {
        width: 20,
        borderRadius: 4,
    },
    dailyChartLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 6,
    },
    skillCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    skillIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    skillInfo: {
        flex: 1,
    },
    skillName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    skillMeta: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 2,
    },
    masteryBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    masteryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    recommendation: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 10,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    studyPlanCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    studyPlanItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    priorityIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 12,
    },
    studyPlanContent: {
        flex: 1,
    },
    studyPlanAction: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    studyPlanDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
    },
    studyPlanTime: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    studyPlanTimeText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    lastUpdated: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: 10,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default AIInsightsScreen;
