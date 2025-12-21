// Project Progress Bar Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProjectProgressBarProps {
    currentStage: string;
    compact?: boolean;
}

const PROJECT_STAGES = [
    { key: 'Selection', label: 'Selection', order: 1 },
    { key: 'Investigation', label: 'Investigation', order: 2 },
    { key: 'Design', label: 'Design', order: 3 },
    { key: 'Implementation', label: 'Implementation', order: 4 },
    { key: 'Testing', label: 'Testing', order: 5 },
    { key: 'Documentation', label: 'Documentation', order: 6 },
    { key: 'Evaluation', label: 'Evaluation', order: 7 },
];

const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({ currentStage, compact = false }) => {
    const currentStageIndex = PROJECT_STAGES.findIndex(s => s.key === currentStage);
    const progress = currentStageIndex >= 0 ? ((currentStageIndex + 1) / PROJECT_STAGES.length) * 100 : 0;

    if (compact) {
        return (
            <View style={styles.compactContainer}>
                <View style={styles.compactProgressBar}>
                    <View style={[styles.compactProgressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.compactText}>
                    {currentStage} • {Math.round(progress)}% Complete
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Project Progress</Text>

            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <Text style={styles.percentage}>{Math.round(progress)}% Complete</Text>

            <View style={styles.stagesContainer}>
                {PROJECT_STAGES.map((stage, index) => {
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = stage.key === currentStage;

                    return (
                        <View key={stage.key} style={styles.stageItem}>
                            <View
                                style={[
                                    styles.stageDot,
                                    isCompleted && styles.stageDotCompleted,
                                    isCurrent && styles.stageDotCurrent,
                                ]}
                            >
                                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                                {isCurrent && <Text style={styles.currentNumber}>{index + 1}</Text>}
                                {!isCompleted && !isCurrent && (
                                    <Text style={styles.stageNumber}>{index + 1}</Text>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.stageLabel,
                                    isCurrent && styles.stageLabelCurrent,
                                    isCompleted && styles.stageLabelCompleted,
                                ]}
                                numberOfLines={1}
                            >
                                {stage.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#9C27B0',
        borderRadius: 4,
    },
    percentage: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'right',
        marginBottom: 16,
    },
    stagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    stageItem: {
        alignItems: 'center',
        width: '14%',
        marginBottom: 8,
    },
    stageDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    stageDotCompleted: {
        backgroundColor: '#4CAF50',
    },
    stageDotCurrent: {
        backgroundColor: '#9C27B0',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    currentNumber: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    stageNumber: {
        color: '#757575',
        fontSize: 12,
    },
    stageLabel: {
        fontSize: 10,
        color: '#757575',
        textAlign: 'center',
    },
    stageLabelCurrent: {
        color: '#9C27B0',
        fontWeight: 'bold',
    },
    stageLabelCompleted: {
        color: '#4CAF50',
    },
    compactContainer: {
        marginBottom: 12,
    },
    compactProgressBar: {
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    compactProgressFill: {
        height: '100%',
        backgroundColor: '#9C27B0',
        borderRadius: 3,
    },
    compactText: {
        fontSize: 12,
        color: '#757575',
    },
});

export default ProjectProgressBar;
