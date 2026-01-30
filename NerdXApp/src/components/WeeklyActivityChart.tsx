// Weekly Activity Chart Component
// Simple bar chart showing activity over the past 7 days

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

interface DayActivity {
    day: string; // 'Mon', 'Tue', etc.
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
}

interface WeeklyActivityChartProps {
    data: DayActivity[];
    title?: string;
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
    data,
    title = "📈 This Week's Activity",
}) => {
    const themedColors = useThemedColors();
    // useMemo so animated values array length stays in sync when data loads (e.g. [] -> 7 items)
    const animatedValues = useMemo(
        () => data.map(() => new Animated.Value(0)),
        [data.length]
    );

    // Find max value for scaling
    const maxQuestions = Math.max(...data.map(d => d.questionsAnswered), 10);

    useEffect(() => {
        // Animate bars sequentially
        const animations = animatedValues.map((anim, index) => {
            return Animated.timing(anim, {
                toValue: data[index].questionsAnswered,
                duration: 800,
                delay: index * 100,
                easing: Easing.out(Easing.back(1.2)),
                useNativeDriver: false,
            });
        });

        Animated.parallel(animations).start();
    }, [data]);

    const totalQuestions = data.reduce((sum, d) => sum + d.questionsAnswered, 0);
    const totalCorrect = data.reduce((sum, d) => sum + d.correctAnswers, 0);
    const weeklyAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Calculate change from previous week (mock for now)
    const previousWeekTotal = Math.floor(totalQuestions * (0.8 + Math.random() * 0.4));
    const change = totalQuestions - previousWeekTotal;
    const changePercent = previousWeekTotal > 0 ? Math.round((change / previousWeekTotal) * 100) : 0;

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: themedColors.text.primary }]}>
                    {title}
                </Text>
                <View style={[
                    styles.changeBadge,
                    { backgroundColor: change >= 0 ? Colors.success.main + '20' : Colors.error.main + '20' }
                ]}>
                    <Text style={[
                        styles.changeText,
                        { color: change >= 0 ? Colors.success.main : Colors.error.main }
                    ]}>
                        {change >= 0 ? '↑' : '↓'} {Math.abs(changePercent)}%
                    </Text>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
                {data.map((day, index) => {
                    const barHeight = animatedValues[index].interpolate({
                        inputRange: [0, maxQuestions],
                        outputRange: [4, 120],
                    });

                    const isToday = index === data.length - 1;
                    const hasActivity = day.questionsAnswered > 0;

                    return (
                        <View key={day.day} style={styles.barColumn}>
                            <View style={styles.barContainer}>
                                <Animated.View style={[
                                    styles.bar,
                                    { height: barHeight }
                                ]}>
                                    <LinearGradient
                                        colors={isToday
                                            ? [Colors.primary.light, Colors.primary.main]
                                            : hasActivity
                                                ? [Colors.secondary.light, Colors.secondary.main]
                                                : [themedColors.background.subtle, themedColors.background.subtle]
                                        }
                                        style={styles.barGradient}
                                    />
                                </Animated.View>

                                {/* Value Label */}
                                {hasActivity && (
                                    <Animated.Text
                                        style={[
                                            styles.valueLabel,
                                            {
                                                color: themedColors.text.secondary,
                                                opacity: animatedValues[index].interpolate({
                                                    inputRange: [0, day.questionsAnswered],
                                                    outputRange: [0, 1],
                                                })
                                            }
                                        ]}
                                    >
                                        {day.questionsAnswered}
                                    </Animated.Text>
                                )}
                            </View>

                            <Text style={[
                                styles.dayLabel,
                                {
                                    color: isToday ? Colors.primary.main : themedColors.text.secondary,
                                    fontWeight: isToday ? 'bold' : 'normal',
                                }
                            ]}>
                                {day.day}
                            </Text>

                            {isToday && (
                                <View style={[styles.todayDot, { backgroundColor: Colors.primary.main }]} />
                            )}
                        </View>
                    );
                })}
            </View>

            {/* Summary Stats */}
            <View style={[styles.summaryContainer, { borderTopColor: themedColors.border.light }]}>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: themedColors.text.primary }]}>
                        {totalQuestions}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: themedColors.text.secondary }]}>
                        Questions
                    </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: themedColors.border.light }]} />

                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: Colors.success.main }]}>
                        {weeklyAccuracy}%
                    </Text>
                    <Text style={[styles.summaryLabel, { color: themedColors.text.secondary }]}>
                        Accuracy
                    </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: themedColors.border.light }]} />

                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: themedColors.text.primary }]}>
                        {data.filter(d => d.questionsAnswered > 0).length}/7
                    </Text>
                    <Text style={[styles.summaryLabel, { color: themedColors.text.secondary }]}>
                        Days Active
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Daily Goals Widget
interface DailyGoal {
    id: string;
    title: string;
    icon: string;
    current: number;
    target: number;
    unit: string;
}

interface DailyGoalsWidgetProps {
    goals: DailyGoal[];
    title?: string;
}

export const DailyGoalsWidget: React.FC<DailyGoalsWidgetProps> = ({
    goals,
    title = "🎯 Today's Goals",
}) => {
    const themedColors = useThemedColors();
    // useMemo so progress anims stay in sync when goals load (e.g. [] -> N goals)
    const progressAnims = useMemo(
        () => goals.map(() => new Animated.Value(0)),
        [goals.length]
    );

    useEffect(() => {
        goals.forEach((goal, index) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            Animated.timing(progressAnims[index], {
                toValue: progress,
                duration: 1000,
                delay: index * 150,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        });
    }, [goals]);

    const completedGoals = goals.filter(g => g.current >= g.target).length;
    const overallProgress = goals.length === 0 ? 0 : Math.round((completedGoals / goals.length) * 100);

    return (
        <View style={[styles.goalsContainer, { backgroundColor: themedColors.background.paper }]}>
            {/* Header */}
            <View style={styles.goalsHeader}>
                <Text style={[styles.title, { color: themedColors.text.primary }]}>
                    {title}
                </Text>
                <View style={[styles.completionBadge, { backgroundColor: Colors.primary.main + '20' }]}>
                    <Text style={[styles.completionText, { color: Colors.primary.main }]}>
                        {completedGoals}/{goals.length} Complete
                    </Text>
                </View>
            </View>

            {/* Goals List */}
            <View style={styles.goalsList}>
                {goals.map((goal, index) => {
                    const isComplete = goal.current >= goal.target;
                    const progressWidth = progressAnims[index].interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                    });

                    return (
                        <View key={goal.id} style={styles.goalItem}>
                            <View style={styles.goalLeft}>
                                <View style={[
                                    styles.goalIcon,
                                    {
                                        backgroundColor: isComplete
                                            ? Colors.success.main + '20'
                                            : themedColors.background.subtle
                                    }
                                ]}>
                                    <Text style={styles.goalEmoji}>
                                        {isComplete ? '✓' : goal.icon}
                                    </Text>
                                </View>
                                <View style={styles.goalContent}>
                                    <Text style={[
                                        styles.goalTitle,
                                        {
                                            color: themedColors.text.primary,
                                            textDecorationLine: isComplete ? 'line-through' : 'none',
                                        }
                                    ]}>
                                        {goal.title}
                                    </Text>
                                    <View style={[styles.goalProgressBg, { backgroundColor: themedColors.background.subtle }]}>
                                        <Animated.View
                                            style={[
                                                styles.goalProgressFill,
                                                {
                                                    width: progressWidth,
                                                    backgroundColor: isComplete ? Colors.success.main : Colors.primary.main,
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                            <Text style={[
                                styles.goalProgress,
                                { color: isComplete ? Colors.success.main : themedColors.text.secondary }
                            ]}>
                                {goal.current}/{goal.target}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Overall Progress */}
            <View style={[styles.overallProgress, { backgroundColor: themedColors.background.subtle }]}>
                <View style={styles.overallProgressContent}>
                    <Text style={[styles.overallLabel, { color: themedColors.text.secondary }]}>
                        Daily Progress
                    </Text>
                    <View style={[styles.overallBar, { backgroundColor: themedColors.background.paper }]}>
                        <View
                            style={[
                                styles.overallFill,
                                {
                                    width: `${overallProgress}%`,
                                    backgroundColor: Colors.primary.main,
                                }
                            ]}
                        />
                    </View>
                </View>
                <Text style={[styles.overallPercent, { color: Colors.primary.main }]}>
                    {overallProgress}%
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 12,
        shadowColor: Colors.primary.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    changeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    changeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 160,
        paddingBottom: 30,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
    },
    barContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: 28,
        borderRadius: 8,
        overflow: 'hidden',
    },
    barGradient: {
        flex: 1,
        borderRadius: 8,
    },
    valueLabel: {
        position: 'absolute',
        top: -20,
        fontSize: 11,
        fontWeight: '600',
    },
    dayLabel: {
        fontSize: 12,
        marginTop: 8,
    },
    todayDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 4,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        marginTop: 16,
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    summaryLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 40,
    },
    // Daily Goals styles
    goalsContainer: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 12,
        shadowColor: Colors.primary.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    goalsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    completionBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    completionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    goalsList: {
        gap: 12,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    goalLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    goalIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalEmoji: {
        fontSize: 16,
    },
    goalContent: {
        flex: 1,
        marginLeft: 12,
    },
    goalTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
    },
    goalProgressBg: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    goalProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    goalProgress: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 12,
    },
    overallProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        padding: 12,
        borderRadius: 12,
    },
    overallProgressContent: {
        flex: 1,
    },
    overallLabel: {
        fontSize: 12,
        marginBottom: 6,
    },
    overallBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    overallFill: {
        height: '100%',
        borderRadius: 4,
    },
    overallPercent: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
});

export default WeeklyActivityChart;
