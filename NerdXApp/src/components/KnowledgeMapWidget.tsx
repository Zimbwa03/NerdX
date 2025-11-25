// Knowledge Map Widget Component for Dashboard
// Displays student's mastery across all skills with visual progress bars

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icons } from './Icons';
import { Colors } from '../theme/colors';
import type { KnowledgeMap } from '../services/api/dktApi';

interface KnowledgeMapWidgetProps {
    knowledgeMap: KnowledgeMap | null;
    loading?: boolean;
    onSkillPress?: (skillId: string) => void;
}

export const KnowledgeMapWidget: React.FC<KnowledgeMapWidgetProps> = ({
    knowledgeMap,
    loading,
    onSkillPress,
}) => {
    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>📊 Your Knowledge Map</Text>
                <Text style={styles.loadingText}>Loading your progress...</Text>
            </View>
        );
    }

    if (!knowledgeMap || knowledgeMap.total_skills === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>📊 Your Knowledge Map</Text>
                <Text style={styles.emptyText}>
                    Start practicing to see your progress! 🎯
                </Text>
            </View>
        );
    }

    const getMasteryColor = (mastery: number): string => {
        if (mastery >= 0.8) return Colors.success.main; // Green - Mastered
        if (mastery >= 0.6) return Colors.primary.main; // Blue - Proficient
        if (mastery >= 0.4) return Colors.warning.main; // Orange - Learning
        return Colors.error.main; // Red - Struggling
    };

    const getMasteryLabel = (mastery: number): string => {
        if (mastery >= 0.8) return 'Mastered';
        if (mastery >= 0.6) return 'Proficient';
        if (mastery >= 0.4) return 'Learning';
        return 'Needs Practice';
    };

    const getMasteryIcon = (mastery: number): string => {
        if (mastery >= 0.8) return '🌟';
        if (mastery >= 0.6) return '💪';
        if (mastery >= 0.4) return '📈';
        return '🎯';
    };

    // Sort skills by mastery (lowest first - needs most attention)
    const sortedSkills = [...(knowledgeMap.skills || [])].sort(
        (a, b) => a.mastery - b.mastery
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>📊 Your Knowledge Map</Text>
                <Text style={styles.subtitle}>
                    Tracking {knowledgeMap.total_skills} skills across all subjects
                </Text>
            </View>

            {/* Summary Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <LinearGradient
                        colors={[Colors.success.light, Colors.success.main]}
                        style={styles.statGradient}
                    >
                        <Text style={styles.statNumber}>{knowledgeMap.mastered_skills}</Text>
                        <Text style={styles.statLabel}>Mastered</Text>
                        <Text style={styles.statEmoji}>🌟</Text>
                    </LinearGradient>
                </View>

                <View style={styles.statCard}>
                    <LinearGradient
                        colors={[Colors.primary.light, Colors.primary.main]}
                        style={styles.statGradient}
                    >
                        <Text style={styles.statNumber}>{knowledgeMap.learning_skills}</Text>
                        <Text style={styles.statLabel}>Learning</Text>
                        <Text style={styles.statEmoji}>📈</Text>
                    </LinearGradient>
                </View>

                <View style={styles.statCard}>
                    <LinearGradient
                        colors={[Colors.warning.light, Colors.warning.main]}
                        style={styles.statGradient}
                    >
                        <Text style={styles.statNumber}>{knowledgeMap.struggling_skills}</Text>
                        <Text style={styles.statLabel}>Practice</Text>
                        <Text style={styles.statEmoji}>🎯</Text>
                    </LinearGradient>
                </View>
            </View>

            {/* Skills List - Show top 5 that need attention */}
            <View style={styles.skillsHeader}>
                <Text style={styles.skillsTitle}>Skills to Focus On</Text>
                <Text style={styles.skillsSubtitle}>Top 5 priorities</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.skillsScroll}
                contentContainerStyle={styles.skillsContent}
            >
                {sortedSkills.slice(0, 5).map((skill) => (
                    <TouchableOpacity
                        key={skill.skill_id}
                        style={styles.skillCard}
                        onPress={() => onSkillPress?.(skill.skill_id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.skillIconContainer}>
                            <Text style={styles.skillIcon}>{getMasteryIcon(skill.mastery)}</Text>
                        </View>

                        <Text style={styles.skillName} numberOfLines={2}>
                            {skill.skill_name}
                        </Text>

                        <Text style={styles.skillSubject}>{skill.subject}</Text>

                        {/* Progress Bar */}
                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarBackground}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${skill.mastery * 100}%`,
                                            backgroundColor: getMasteryColor(skill.mastery),
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>{Math.round(skill.mastery * 100)}%</Text>
                        </View>

                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getMasteryColor(skill.mastery) + '20' },
                            ]}
                        >
                            <Text
                                style={[styles.statusText, { color: getMasteryColor(skill.mastery) }]}
                            >
                                {getMasteryLabel(skill.mastery)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* View All Button */}
            {knowledgeMap.total_skills > 5 && (
                <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>
                        View All {knowledgeMap.total_skills} Skills →
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background.paper,
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
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    loadingText: {
        fontSize: 15,
        color: Colors.text.secondary,
        textAlign: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 15,
        color: Colors.text.secondary,
        textAlign: 'center',
        paddingVertical: 30,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    statGradient: {
        padding: 16,
        alignItems: 'center',
        minHeight: 100,
        justifyContent: 'center',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text.white,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.text.white,
        opacity: 0.9,
        fontWeight: '600',
    },
    statEmoji: {
        fontSize: 24,
        marginTop: 4,
    },
    skillsHeader: {
        marginBottom: 12,
    },
    skillsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    skillsSubtitle: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
    skillsScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    skillsContent: {
        gap: 12,
        paddingHorizontal: 20,
    },
    skillCard: {
        width: 160,
        backgroundColor: Colors.background.subtle,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    skillIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background.paper,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    skillIcon: {
        fontSize: 24,
    },
    skillName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
        minHeight: 36,
    },
    skillSubject: {
        fontSize: 11,
        color: Colors.text.secondary,
        marginBottom: 12,
        textTransform: 'capitalize',
    },
    progressBarContainer: {
        marginBottom: 12,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: Colors.background.paper,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.secondary,
        textAlign: 'right',
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    viewAllButton: {
        marginTop: 16,
        padding: 14,
        backgroundColor: Colors.primary.main,
        borderRadius: 12,
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.white,
    },
});
