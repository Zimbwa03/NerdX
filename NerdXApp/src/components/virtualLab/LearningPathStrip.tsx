import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../theme/useThemedStyles';

export interface LearningStep {
    id: string;
    title: string;
    description?: string;
}

interface LearningPathStripProps {
    title: string;
    subtitle?: string;
    steps: LearningStep[];
    completedSteps: string[];
    onToggleStep: (stepId: string) => void;
    accentColor?: string;
}

const LearningPathStrip: React.FC<LearningPathStripProps> = ({
    title,
    subtitle,
    steps,
    completedSteps,
    onToggleStep,
    accentColor,
}) => {
    const colors = useThemedColors();
    const completedSet = React.useMemo(() => new Set(completedSteps), [completedSteps]);
    const progress = steps.length === 0 ? 0 : completedSteps.length / steps.length;
    const progressLabel = `${completedSteps.length}/${steps.length} steps`;
    const highlight = accentColor ?? colors.primary.main;

    return (
        <View style={[styles.container, { backgroundColor: colors.background.paper, borderColor: colors.border.light }]}>
            <View style={styles.headerRow}>
                <View style={styles.headerText}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
                    {subtitle ? (
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
                    ) : null}
                </View>
                <View style={[styles.progressBadge, { borderColor: highlight }]}>
                    <Text style={[styles.progressText, { color: highlight }]}>{progressLabel}</Text>
                </View>
            </View>

            <View style={[styles.progressTrack, { backgroundColor: colors.background.subtle }]}>
                <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: highlight }]} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepsRow}>
                {steps.map((step) => {
                    const isDone = completedSet.has(step.id);
                    return (
                        <TouchableOpacity
                            key={step.id}
                            style={[
                                styles.stepChip,
                                { borderColor: colors.border.light },
                                isDone && { backgroundColor: highlight + '1A', borderColor: highlight },
                            ]}
                            onPress={() => onToggleStep(step.id)}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                                size={16}
                                color={isDone ? highlight : colors.text.secondary}
                            />
                            <View style={styles.stepText}>
                                <Text style={[styles.stepTitle, { color: colors.text.primary }]} numberOfLines={1}>
                                    {step.title}
                                </Text>
                                {step.description ? (
                                    <Text style={[styles.stepSubtitle, { color: colors.text.secondary }]} numberOfLines={2}>
                                        {step.description}
                                    </Text>
                                ) : null}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        gap: 10,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    progressBadge: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
    progressText: {
        fontSize: 11,
        fontWeight: '700',
    },
    progressTrack: {
        height: 6,
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
    },
    stepsRow: {
        gap: 10,
        paddingVertical: 4,
    },
    stepChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        minWidth: 180,
        gap: 8,
    },
    stepText: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    stepSubtitle: {
        fontSize: 11,
        marginTop: 2,
        lineHeight: 14,
    },
});

export default LearningPathStrip;
