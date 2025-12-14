// Streak Calendar Component
// Visual 30-day calendar showing learning streak with fire animations

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

interface StreakCalendarProps {
    streakHistory: boolean[]; // Last 30 days, index 0 = oldest
    currentStreak: number;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
    streakHistory,
    currentStreak,
}) => {
    const themedColors = useThemedColors();
    const fireScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fire pulse animation for current streak
        if (currentStreak > 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fireScale, {
                        toValue: 1.2,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(fireScale, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [currentStreak]);

    // Get the last 28 days for a clean 4-week display
    const displayDays = streakHistory.slice(-28);

    // Pad to 28 if needed
    while (displayDays.length < 28) {
        displayDays.unshift(false);
    }

    // Get current date and calculate dates for display
    const today = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Split into weeks (4 rows of 7)
    const weeks: boolean[][] = [];
    for (let i = 0; i < 4; i++) {
        weeks.push(displayDays.slice(i * 7, (i + 1) * 7));
    }

    const getStreakMessage = () => {
        if (currentStreak === 0) return "Start your streak today! 💪";
        if (currentStreak < 3) return "Great start! Keep it up! 🌟";
        if (currentStreak < 7) return "You're on fire! 🔥";
        if (currentStreak < 14) return "Amazing dedication! 💫";
        if (currentStreak < 30) return "Unstoppable! 🚀";
        return "Legendary streak! 👑";
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.paper }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: themedColors.text.primary }]}>
                        📅 Learning Streak
                    </Text>
                    <Text style={[styles.subtitle, { color: themedColors.text.secondary }]}>
                        {monthNames[today.getMonth()]} {today.getFullYear()}
                    </Text>
                </View>

                {/* Streak Badge */}
                <View style={styles.streakBadgeContainer}>
                    <LinearGradient
                        colors={currentStreak > 0 ? ['#FF9800', '#F57C00'] : [themedColors.background.subtle, themedColors.background.subtle]}
                        style={styles.streakBadge}
                    >
                        <Animated.Text
                            style={[
                                styles.fireEmoji,
                                { transform: [{ scale: fireScale }] }
                            ]}
                        >
                            {currentStreak > 0 ? '🔥' : '❄️'}
                        </Animated.Text>
                        <Text style={styles.streakNumber}>{currentStreak}</Text>
                        <Text style={styles.streakDaysLabel}>days</Text>
                    </LinearGradient>
                </View>
            </View>

            {/* Day Headers */}
            <View style={styles.dayHeaderRow}>
                {dayNames.map((day, index) => (
                    <View key={index} style={styles.dayHeaderCell}>
                        <Text style={[styles.dayHeaderText, { color: themedColors.text.secondary }]}>
                            {day}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.weekRow}>
                        {week.map((isActive, dayIndex) => {
                            const isToday = weekIndex === 3 && dayIndex === 6; // Last day
                            const isRecent = weekIndex === 3 && dayIndex >= 4; // Last 3 days

                            return (
                                <View
                                    key={dayIndex}
                                    style={[
                                        styles.dayCell,
                                        isActive && styles.activeDayCell,
                                        isToday && styles.todayCell,
                                        isActive && { backgroundColor: Colors.warning.main + '20' },
                                    ]}
                                >
                                    {isActive ? (
                                        <Text style={styles.activeDayEmoji}>
                                            {isRecent ? '🔥' : '✓'}
                                        </Text>
                                    ) : (
                                        <View style={[styles.inactiveDay, { backgroundColor: themedColors.background.subtle }]} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>

            {/* Motivational Message */}
            <View style={[styles.messageContainer, { backgroundColor: themedColors.background.subtle }]}>
                <Text style={[styles.messageText, { color: themedColors.text.primary }]}>
                    {getStreakMessage()}
                </Text>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <Text style={styles.legendEmoji}>🔥</Text>
                    <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Active</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendInactive, { backgroundColor: themedColors.background.subtle }]} />
                    <Text style={[styles.legendText, { color: themedColors.text.secondary }]}>Missed</Text>
                </View>
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
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    streakBadgeContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    streakBadge: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        minWidth: 70,
    },
    fireEmoji: {
        fontSize: 24,
    },
    streakNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 2,
    },
    streakDaysLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    dayHeaderRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayHeaderCell: {
        flex: 1,
        alignItems: 'center',
    },
    dayHeaderText: {
        fontSize: 12,
        fontWeight: '600',
    },
    calendarGrid: {
        gap: 6,
    },
    weekRow: {
        flexDirection: 'row',
        gap: 6,
    },
    dayCell: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDayCell: {
        borderWidth: 1,
        borderColor: Colors.warning.main,
    },
    todayCell: {
        borderWidth: 2,
        borderColor: Colors.primary.main,
    },
    activeDayEmoji: {
        fontSize: 16,
    },
    inactiveDay: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    messageContainer: {
        marginTop: 16,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    messageText: {
        fontSize: 14,
        fontWeight: '600',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        gap: 24,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendEmoji: {
        fontSize: 14,
    },
    legendInactive: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    legendText: {
        fontSize: 12,
    },
});

export default StreakCalendar;
