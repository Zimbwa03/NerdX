/**
 * AIThinkingOverlay - Real-time AI thinking visualization for math questions
 * Shows animated thinking stages while DeepSeek Reasoner generates questions
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface AIThinkingOverlayProps {
    visible: boolean;
    thinkingContent: string;
    currentStage: number;
    totalStages: number;
}

const THINKING_STAGES = [
    { emoji: '🧠', text: 'Analyzing topic...', color: '#8B5CF6' },
    { emoji: '📐', text: 'Setting up problem...', color: '#3B82F6' },
    { emoji: '✨', text: 'Crafting solution steps...', color: '#10B981' },
    { emoji: '🔢', text: 'Calculating values...', color: '#F59E0B' },
    { emoji: '✅', text: 'Finalizing question...', color: '#22C55E' },
];

export const AIThinkingOverlay: React.FC<AIThinkingOverlayProps> = ({
    visible,
    thinkingContent,
    currentStage,
    totalStages,
}) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Rotate animation
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [visible]);

    useEffect(() => {
        // Animate progress bar
        Animated.timing(progressAnim, {
            toValue: currentStage / totalStages,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [currentStage, totalStages]);

    if (!visible) return null;

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const stage = THINKING_STAGES[Math.min(currentStage - 1, THINKING_STAGES.length - 1)] || THINKING_STAGES[0];

    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                <LinearGradient
                    colors={['rgba(26, 26, 46, 0.95)', 'rgba(13, 27, 42, 0.98)']}
                    style={styles.gradientBg}
                >
                    {/* Brain icon with pulse */}
                    <Animated.View
                        style={[
                            styles.brainContainer,
                            {
                                transform: [{ scale: pulseAnim }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={[stage.color, `${stage.color}80`]}
                            style={styles.brainGradient}
                        >
                            <Text style={styles.brainEmoji}>{stage.emoji}</Text>
                        </LinearGradient>
                    </Animated.View>

                    {/* Rotating ring */}
                    <Animated.View
                        style={[
                            styles.rotatingRing,
                            { transform: [{ rotate: spin }] },
                        ]}
                    >
                        <View style={styles.ringDot} />
                    </Animated.View>

                    {/* Title */}
                    <Text style={styles.title}>AI is Thinking</Text>

                    {/* Current thinking content */}
                    <View style={styles.thinkingBox}>
                        <Text style={styles.thinkingEmoji}>{stage.emoji}</Text>
                        <Text style={styles.thinkingText}>
                            {thinkingContent || stage.text}
                        </Text>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        backgroundColor: stage.color,
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        }),
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            Step {currentStage} of {totalStages}
                        </Text>
                    </View>

                    {/* Stage indicators */}
                    <View style={styles.stagesContainer}>
                        {THINKING_STAGES.slice(0, totalStages).map((s, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.stageIndicator,
                                    index + 1 <= currentStage && styles.stageActive,
                                    { backgroundColor: index + 1 <= currentStage ? s.color : '#374151' },
                                ]}
                            >
                                <Text style={styles.stageIndicatorEmoji}>
                                    {index + 1 <= currentStage ? '✓' : (index + 1)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Tip */}
                    <Text style={styles.tipText}>
                        🎯 DeepSeek Reasoner is crafting a quality question with detailed solutions
                    </Text>
                </LinearGradient>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    brainContainer: {
        marginBottom: 24,
    },
    brainGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brainEmoji: {
        fontSize: 48,
    },
    rotatingRing: {
        position: 'absolute',
        top: '25%',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderTopColor: '#8B5CF6',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: -5,
    },
    ringDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8B5CF6',
        marginTop: -4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    thinkingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    thinkingEmoji: {
        fontSize: 24,
        marginRight: 12,
    },
    thinkingText: {
        fontSize: 18,
        color: '#E5E7EB',
        fontWeight: '500',
    },
    progressContainer: {
        width: width - 80,
        marginBottom: 24,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    stagesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
    },
    stageIndicator: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stageActive: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
    },
    stageIndicatorEmoji: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    tipText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: width - 60,
    },
});

export default AIThinkingOverlay;
