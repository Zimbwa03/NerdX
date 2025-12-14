// Subject Mastery Card Component
// Displays subject progress with animated progress bars and skill counts

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

export interface SubjectMasteryData {
    subject: string;
    displayName: string;
    icon: string;
    mastery: number; // 0-100
    skillsCount: number;
    masteredSkills: number;
    color: string;
    gradientColors: [string, string];
}

interface SubjectMasteryCardProps {
    data: SubjectMasteryData;
    onPress?: () => void;
    compact?: boolean;
}

export const SubjectMasteryCard: React.FC<SubjectMasteryCardProps> = ({
    data,
    onPress,
    compact = false,
}) => {
    const themedColors = useThemedColors();
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: data.mastery,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [data.mastery]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const getMasteryLabel = (mastery: number): string => {
        if (mastery >= 80) return 'Mastered';
        if (mastery >= 60) return 'Proficient';
        if (mastery >= 40) return 'Learning';
        if (mastery >= 20) return 'Beginner';
        return 'New';
    };

    const getMasteryEmoji = (mastery: number): string => {
        if (mastery >= 80) return '🌟';
        if (mastery >= 60) return '💪';
        if (mastery >= 40) return '📈';
        if (mastery >= 20) return '🎯';
        return '🌱';
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    if (compact) {
        return (
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <Animated.View
                    style={[
                        styles.compactCard,
                        {
                            backgroundColor: themedColors.background.paper,
                            transform: [{ scale: scaleAnim }],
                        }
                    ]}
                >
                    <LinearGradient
                        colors={data.gradientColors}
                        style={styles.compactIconContainer}
                    >
                        <Text style={styles.compactIcon}>{data.icon}</Text>
                    </LinearGradient>

                    <View style={styles.compactContent}>
                        <Text style={[styles.compactName, { color: themedColors.text.primary }]}>
                            {data.displayName}
                        </Text>
                        <View style={[styles.compactProgressBg, { backgroundColor: themedColors.background.subtle }]}>
                            <Animated.View
                                style={[
                                    styles.compactProgressFill,
                                    {
                                        width: progressWidth,
                                        backgroundColor: data.color,
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    <Text style={[styles.compactPercentage, { color: data.color }]}>
                        {data.mastery}%
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
        >
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor: themedColors.background.paper,
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
            >
                {/* Header with Icon */}
                <LinearGradient
                    colors={data.gradientColors}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.icon}>{data.icon}</Text>
                    <View style={styles.masteryBadge}>
                        <Text style={styles.masteryEmoji}>{getMasteryEmoji(data.mastery)}</Text>
                        <Text style={styles.masteryLabel}>{getMasteryLabel(data.mastery)}</Text>
                    </View>
                </LinearGradient>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={[styles.subjectName, { color: themedColors.text.primary }]}>
                        {data.displayName}
                    </Text>

                    {/* Progress Bar */}
                    <View style={styles.progressSection}>
                        <View style={[styles.progressBarBg, { backgroundColor: themedColors.background.subtle }]}>
                            <Animated.View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: progressWidth,
                                        backgroundColor: data.color,
                                    }
                                ]}
                            />
                        </View>
                        <Text style={[styles.percentageText, { color: data.color }]}>
                            {data.mastery}%
                        </Text>
                    </View>

                    {/* Skills Count */}
                    <View style={styles.skillsRow}>
                        <View style={[styles.skillPill, { backgroundColor: data.color + '20' }]}>
                            <Text style={[styles.skillPillText, { color: data.color }]}>
                                ✓ {data.masteredSkills} mastered
                            </Text>
                        </View>
                        <Text style={[styles.totalSkills, { color: themedColors.text.secondary }]}>
                            {data.skillsCount} skills
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

// Subject Mastery Grid for displaying all subjects
interface SubjectMasteryGridProps {
    subjects: SubjectMasteryData[];
    onSubjectPress?: (subject: string) => void;
}

export const SubjectMasteryGrid: React.FC<SubjectMasteryGridProps> = ({
    subjects,
    onSubjectPress,
}) => {
    const themedColors = useThemedColors();

    return (
        <View style={[styles.gridContainer, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.gridTitle, { color: themedColors.text.primary }]}>
                📚 Subject Mastery
            </Text>

            <View style={styles.grid}>
                {subjects.map((subject) => (
                    <View key={subject.subject} style={styles.gridItem}>
                        <SubjectMasteryCard
                            data={subject}
                            onPress={() => onSubjectPress?.(subject.subject)}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

// Default subject data helper
export const getDefaultSubjectData = (): SubjectMasteryData[] => [
    {
        subject: 'mathematics',
        displayName: 'Mathematics',
        icon: '📐',
        mastery: 0,
        skillsCount: 0,
        masteredSkills: 0,
        color: Colors.subjects.mathematics,
        gradientColors: ['#2979FF', '#1565C0'],
    },
    {
        subject: 'science',
        displayName: 'Science',
        icon: '🔬',
        mastery: 0,
        skillsCount: 0,
        masteredSkills: 0,
        color: Colors.subjects.science,
        gradientColors: ['#00E676', '#00B248'],
    },
    {
        subject: 'english',
        displayName: 'English',
        icon: '📖',
        mastery: 0,
        skillsCount: 0,
        masteredSkills: 0,
        color: Colors.subjects.english,
        gradientColors: ['#FF9100', '#EF6C00'],
    },
];

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    icon: {
        fontSize: 36,
    },
    masteryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    masteryEmoji: {
        fontSize: 14,
        marginRight: 4,
    },
    masteryLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    subjectName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    progressSection: {
        marginBottom: 12,
    },
    progressBarBg: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    percentageText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    skillsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skillPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    skillPillText: {
        fontSize: 12,
        fontWeight: '600',
    },
    totalSkills: {
        fontSize: 13,
    },
    // Compact styles
    compactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    compactIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compactIcon: {
        fontSize: 22,
    },
    compactContent: {
        flex: 1,
        marginLeft: 12,
    },
    compactName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
    },
    compactProgressBg: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    compactProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    compactPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    // Grid styles
    gridContainer: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 12,
        shadowColor: Colors.primary.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    gridTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    grid: {
        gap: 12,
    },
    gridItem: {
        // Each item takes full width for mobile
    },
});

export default SubjectMasteryCard;
