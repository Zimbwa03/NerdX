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
    isLocked?: boolean;
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
    isLocked = false,
    onPress,
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const subjectColors = SUBJECT_COLORS[simulation.subject] ?? SUBJECT_COLORS.mathematics;
    const difficultyColor = DIFFICULTY_COLORS[simulation.difficulty];

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: themedColors.background.paper }, isLocked && styles.cardLocked]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isLocked}
        >
            <LinearGradient
                colors={subjectColors.gradient}
                style={[styles.iconContainer, isLocked && styles.iconContainerLocked]}
            >
                <Ionicons
                    name={getIconName(simulation.icon)}
                    size={32}
                    color={isLocked ? "rgba(255,255,255,0.5)" : "#FFFFFF"}
                />
                {isCompleted && !isLocked && (
                    <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    </View>
                )}
                {isLocked && (
                    <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={20} color="#FFF" />
                    </View>
                )}
            </LinearGradient>

            <Text
                style={[styles.title, { color: isLocked ? themedColors.text.secondary : themedColors.text.primary }]}
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
                    <Ionicons name="star" size={14} color={isLocked ? "#999" : "#FFD700"} />
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

            {/* Lock Overlay */}
            {isLocked && (
                <View style={styles.lockOverlay}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
                        style={styles.lockOverlayGradient}
                    >
                        <View style={[styles.lockIconOverlay, { backgroundColor: subjectColors.primary }]}>
                            <Ionicons name="lock-closed" size={32} color="#FFF" />
                        </View>
                        <Text style={styles.lockOverlayText}>Premium</Text>
                        <Text style={styles.lockOverlaySubtext}>Purchase credits to unlock</Text>
                    </LinearGradient>
                </View>
            )}
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
        position: 'relative',
    },
    cardLocked: {
        opacity: 0.7,
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
    iconContainerLocked: {
        opacity: 0.6,
    },
    completedBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    lockBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 10,
        padding: 4,
    },
    lockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 16,
        overflow: 'hidden',
        zIndex: 10,
    },
    lockOverlayGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    lockIconOverlay: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    lockOverlayText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 4,
        textAlign: 'center',
    },
    lockOverlaySubtext: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 2,
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
