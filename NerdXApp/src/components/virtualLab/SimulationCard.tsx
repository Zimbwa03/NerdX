// Simulation Card Component
// Displays a simulation in the selection grid

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SimulationMetadata, SUBJECT_COLORS, DIFFICULTY_COLORS } from '../../data/virtualLab';
import { useTheme } from '../../context/ThemeContext';
import { useThemedColors } from '../../theme/useThemedStyles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface SimulationCardProps {
    simulation: SimulationMetadata;
    isCompleted?: boolean;
    xpEarned?: number;
    onPress: () => void;
}

const getIconName = (iconKey: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
        'microscope': 'eye-outline',
        'water': 'water-outline',
        'atom': 'planet-outline',
        'scale': 'scale-outline',
        'flash': 'flash-outline',
        'rocket': 'rocket-outline',
        'beaker': 'flask-outline',
        'leaf': 'leaf-outline',
        'flask': 'flask-outline',
    };
    return iconMap[iconKey] || 'help-circle-outline';
};

export const SimulationCard: React.FC<SimulationCardProps> = ({
    simulation,
    isCompleted = false,
    xpEarned = 0,
    onPress,
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const subjectColors = SUBJECT_COLORS[simulation.subject];
    const difficultyColor = DIFFICULTY_COLORS[simulation.difficulty];

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: themedColors.background.paper }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={subjectColors.gradient}
                style={styles.iconContainer}
            >
                <Ionicons
                    name={getIconName(simulation.icon)}
                    size={32}
                    color="#FFFFFF"
                />
                {isCompleted && (
                    <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    </View>
                )}
            </LinearGradient>

            <Text
                style={[styles.title, { color: themedColors.text.primary }]}
                numberOfLines={2}
            >
                {simulation.title}
            </Text>

            <View style={styles.metaRow}>
                <View style={[styles.subjectBadge, { backgroundColor: subjectColors.primary + '20' }]}>
                    <Text style={[styles.subjectText, { color: subjectColors.primary }]}>
                        {simulation.subject.charAt(0).toUpperCase() + simulation.subject.slice(1)}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomRow}>
                <View style={[styles.difficultyDot, { backgroundColor: difficultyColor }]} />
                <Text style={[styles.difficultyText, { color: themedColors.text.secondary }]}>
                    {simulation.difficulty.charAt(0).toUpperCase() + simulation.difficulty.slice(1)}
                </Text>

                <View style={styles.xpContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={[styles.xpText, { color: themedColors.text.secondary }]}>
                        {isCompleted ? xpEarned : simulation.xpReward} XP
                    </Text>
                </View>
            </View>

            <Text
                style={[styles.timeText, { color: themedColors.text.secondary }]}
                numberOfLines={1}
            >
                ⏱️ {simulation.estimatedTime}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    completedBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        height: 36,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    subjectBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    subjectText: {
        fontSize: 10,
        fontWeight: '600',
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    difficultyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    difficultyText: {
        fontSize: 11,
        flex: 1,
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    xpText: {
        fontSize: 11,
        fontWeight: '500',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
    },
});

export default SimulationCard;
