// Simulation Header Component
// Common header for all simulation screens

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LearningObjective, SUBJECT_COLORS, Subject } from '../../data/virtualLab';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';

interface SimulationHeaderProps {
    title: string;
    subject: Subject;
    learningObjectives: LearningObjective[];
    onBack: () => void;
    onHelp?: () => void;
    xpReward: number;
}

export const SimulationHeader: React.FC<SimulationHeaderProps> = ({
    title,
    subject,
    learningObjectives,
    onBack,
    onHelp,
    xpReward,
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const [showObjectives, setShowObjectives] = useState(false);
    const subjectColors = SUBJECT_COLORS[subject];

    return (
        <>
            <LinearGradient
                colors={subjectColors.gradient}
                style={styles.header}
            >
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <View style={styles.subjectBadge}>
                            <Text style={styles.subjectText}>
                                {subject.charAt(0).toUpperCase() + subject.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.rightButtons}>
                        <TouchableOpacity
                            onPress={() => setShowObjectives(true)}
                            style={styles.iconButton}
                        >
                            <Ionicons name="bulb-outline" size={22} color="#FFF" />
                        </TouchableOpacity>
                        {onHelp && (
                            <TouchableOpacity onPress={onHelp} style={styles.iconButton}>
                                <Ionicons name="help-circle-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.xpBadge}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.xpText}>{xpReward} XP</Text>
                </View>
            </LinearGradient>

            {/* Learning Objectives Modal */}
            <Modal
                visible={showObjectives}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowObjectives(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: themedColors.background.paper }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: themedColors.text.primary }]}>
                                🎯 Learning Objectives
                            </Text>
                            <TouchableOpacity onPress={() => setShowObjectives(false)}>
                                <Ionicons name="close" size={24} color={themedColors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.objectivesList}>
                            {learningObjectives.map((objective, index) => (
                                <View key={objective.id} style={styles.objectiveItem}>
                                    <View style={[styles.objectiveNumber, { backgroundColor: subjectColors.primary }]}>
                                        <Text style={styles.objectiveNumberText}>{index + 1}</Text>
                                    </View>
                                    <Text style={[styles.objectiveText, { color: themedColors.text.primary }]}>
                                        {objective.text}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.closeModalButton, { backgroundColor: subjectColors.primary }]}
                            onPress={() => setShowObjectives(false)}
                        >
                            <Text style={styles.closeModalButtonText}>Got it!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    titleContainer: {
        flex: 1,
        marginLeft: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subjectBadge: {
        backgroundColor: '#FFFFFF20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    subjectText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    rightButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#00000020',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 12,
        marginLeft: 8,
        gap: 4,
    },
    xpText: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '70%',
        borderRadius: 24,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    objectivesList: {
        marginBottom: 20,
    },
    objectiveItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    objectiveNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    objectiveNumberText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    objectiveText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    closeModalButton: {
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SimulationHeader;
