// Loading Progress Component - Real-time thinking UI for AI generation
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LoadingProgressStep {
    label: string;
    emoji?: string;
}

interface LoadingProgressProps {
    visible: boolean;
    message?: string;
    estimatedTime?: number; // in seconds
    stage?: string;
    steps?: LoadingProgressStep[];
    onComplete?: () => void;
}

const DEFAULT_STEPS: LoadingProgressStep[] = [
    { emoji: '📥', label: 'Loading topic context' },
    { emoji: '🧠', label: 'Generating question' },
    { emoji: '📝', label: 'Building marking points' },
    { emoji: '🔎', label: 'Checking accuracy' },
    { emoji: '✅', label: 'Complete' },
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
    visible,
    message = 'Generating question...',
    estimatedTime = 10,
    stage = 'Thinking',
    steps = DEFAULT_STEPS,
    onComplete,
}) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [ellipsis, setEllipsis] = useState('');
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const dotIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

    const finalStepIndex = Math.max(steps.length - 1, 0);
    const runningMaxIndex = Math.max(finalStepIndex - 1, 0);

    useEffect(() => {
        if (visible) {
            setShowOverlay(true);
            setActiveStepIndex(0);
            setEllipsis('');

            const totalSteps = Math.max(runningMaxIndex + 1, 1);
            const stepIntervalMs = Math.max(900, Math.floor((estimatedTime * 1000) / totalSteps));

            stepIntervalRef.current = setInterval(() => {
                setActiveStepIndex((prev) => Math.min(prev + 1, runningMaxIndex));
            }, stepIntervalMs);

            dotIntervalRef.current = setInterval(() => {
                setEllipsis((prev) => (prev.length >= 3 ? '' : `${prev}.`));
            }, 450);

            pulseLoopRef.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.06,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulseLoopRef.current.start();
        } else if (!visible && showOverlay) {
            if (stepIntervalRef.current) {
                clearInterval(stepIntervalRef.current);
                stepIntervalRef.current = null;
            }
            if (dotIntervalRef.current) {
                clearInterval(dotIntervalRef.current);
                dotIntervalRef.current = null;
            }

            setActiveStepIndex(finalStepIndex);
            setEllipsis('');

            setTimeout(() => {
                if (pulseLoopRef.current) {
                    pulseLoopRef.current.stop();
                    pulseLoopRef.current = null;
                }
                setShowOverlay(false);
                setActiveStepIndex(0);
                onComplete?.();
            }, 500);
        }

        return () => {
            if (stepIntervalRef.current) {
                clearInterval(stepIntervalRef.current);
            }
            if (dotIntervalRef.current) {
                clearInterval(dotIntervalRef.current);
            }
            if (pulseLoopRef.current) {
                pulseLoopRef.current.stop();
            }
        };
    }, [visible, estimatedTime, runningMaxIndex, finalStepIndex, showOverlay]);

    if (!showOverlay) {
        return null;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
                    <LinearGradient
                        colors={['#7C4DFF', '#00E5FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.iconGradient}
                    >
                        <Text style={styles.icon}>🤖</Text>
                    </LinearGradient>
                </Animated.View>

                <Text style={styles.titleText}>{stage} in real time</Text>
                <Text style={styles.messageText}>
                    {message}
                    {ellipsis}
                </Text>

                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => {
                        const isActive = index === activeStepIndex;
                        const isComplete = index < activeStepIndex || (index === finalStepIndex && !visible);
                        const isFinal = index === finalStepIndex;
                        const stepLabel = isFinal ? step.label : `Step ${index + 1}: ${step.label}`;
                        return (
                            <View key={`${step.label}-${index}`} style={styles.stepRow}>
                                <View
                                    style={[
                                        styles.stepIndicator,
                                        isActive && styles.stepIndicatorActive,
                                        isComplete && styles.stepIndicatorComplete,
                                    ]}
                                >
                                    <Text style={styles.stepIndicatorText}>
                                        {isComplete || isFinal ? '✓' : index + 1}
                                    </Text>
                                </View>
                                <View style={[styles.stepTextWrapper, isActive && styles.stepTextWrapperActive]}>
                                    <Text style={[styles.stepText, isActive && styles.stepTextActive]}>
                                        {step.emoji ? `${step.emoji} ` : ''}
                                        {stepLabel}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.tipText}>
                    🎯 DeepSeek is reasoning through the next question for you
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 14, 33, 0.96)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        width: width * 0.88,
        backgroundColor: '#101425',
        borderRadius: 28,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(124, 77, 255, 0.35)',
        shadowColor: '#7C4DFF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 10,
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 42,
    },
    titleText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
        textAlign: 'center',
    },
    messageText: {
        fontSize: 14,
        color: '#C7D2FE',
        textAlign: 'center',
        marginBottom: 18,
    },
    stepsContainer: {
        width: '100%',
        marginBottom: 18,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepIndicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepIndicatorActive: {
        backgroundColor: '#7C4DFF',
        borderColor: '#BFA5FF',
    },
    stepIndicatorComplete: {
        backgroundColor: '#22C55E',
        borderColor: '#86EFAC',
    },
    stepIndicatorText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    stepTextWrapper: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    stepTextWrapperActive: {
        backgroundColor: 'rgba(124, 77, 255, 0.2)',
        borderColor: 'rgba(124, 77, 255, 0.45)',
    },
    stepText: {
        fontSize: 14,
        color: '#E2E8F0',
        fontWeight: '500',
    },
    stepTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    tipText: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default LoadingProgress;
