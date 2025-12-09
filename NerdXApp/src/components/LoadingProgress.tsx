// Loading Progress Component - Shows animated progress for AI generation
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

interface LoadingProgressProps {
    visible: boolean;
    message?: string;
    estimatedTime?: number; // in seconds
    stage?: string;
    onComplete?: () => void;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
    visible,
    message = 'Generating question...',
    estimatedTime = 10,
    stage = 'Connecting to AI',
    onComplete,
}) => {
    const [progress, setProgress] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Progress stages
    const stages = [
        { threshold: 10, text: '🔗 Connecting to AI...' },
        { threshold: 25, text: '🧠 AI is thinking...' },
        { threshold: 50, text: '📝 Generating question...' },
        { threshold: 75, text: '✨ Formatting response...' },
        { threshold: 90, text: '🔍 Validating question...' },
        { threshold: 100, text: '✅ Almost ready!' },
    ];

    const getCurrentStage = (progress: number) => {
        for (const stage of stages) {
            if (progress < stage.threshold) {
                return stage.text;
            }
        }
        return stages[stages.length - 1].text;
    };

    useEffect(() => {
        if (visible) {
            setProgress(0);
            progressAnim.setValue(0);

            // Simulate progress with natural curve (fast start, slow middle, fast end)
            const intervalTime = (estimatedTime * 1000) / 100;
            let currentProgress = 0;

            const progressInterval = setInterval(() => {
                // Non-linear progress curve
                let increment = 1;
                if (currentProgress < 20) {
                    increment = 2.5; // Fast start
                } else if (currentProgress < 60) {
                    increment = 0.8; // Slow middle
                } else if (currentProgress < 85) {
                    increment = 0.5; // Very slow near end
                } else if (currentProgress < 95) {
                    increment = 0.3; // Almost stuck
                } else {
                    increment = 0.1; // Wait for completion
                }

                currentProgress = Math.min(95, currentProgress + increment);
                setProgress(Math.round(currentProgress));

                Animated.timing(progressAnim, {
                    toValue: currentProgress / 100,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
            }, intervalTime);

            // Pulse animation for the percentage
            const pulseLoop = Animated.loop(
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
            );
            pulseLoop.start();

            return () => {
                clearInterval(progressInterval);
                pulseLoop.stop();
            };
        } else if (progress > 0 && progress < 100) {
            // Complete the progress when loading finishes
            setProgress(100);
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                onComplete?.();
            });
        }
    }, [visible]);

    if (!visible && progress === 0) {
        return null;
    }

    const progressBarWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                {/* Animated Brain/AI Icon */}
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🤖</Text>
                    <Animated.View
                        style={[
                            styles.iconGlow,
                            { transform: [{ scale: pulseAnim }] }
                        ]}
                    />
                </View>

                {/* Percentage Display */}
                <Animated.Text
                    style={[
                        styles.percentage,
                        { transform: [{ scale: pulseAnim }] }
                    ]}
                >
                    {progress}%
                </Animated.Text>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <Animated.View style={[styles.progressBarFill, { width: progressBarWidth }]}>
                            <LinearGradient
                                colors={['#7C4DFF', '#00E5FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.progressGradient}
                            />
                        </Animated.View>
                    </View>
                </View>

                {/* Status Text */}
                <Text style={styles.stageText}>{getCurrentStage(progress)}</Text>
                <Text style={styles.messageText}>{message}</Text>

                {/* Tip */}
                <Text style={styles.tipText}>
                    💡 Tip: AI generates unique questions for better learning!
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 14, 33, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        width: width * 0.85,
        backgroundColor: '#1D1E33',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(124, 77, 255, 0.3)',
        shadowColor: '#7C4DFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        fontSize: 48,
        zIndex: 1,
    },
    iconGlow: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(124, 77, 255, 0.2)',
    },
    percentage: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
        textShadowColor: '#7C4DFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    progressBarContainer: {
        width: '100%',
        marginBottom: 20,
    },
    progressBarBackground: {
        width: '100%',
        height: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressGradient: {
        flex: 1,
    },
    stageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#B47CFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    messageText: {
        fontSize: 14,
        color: '#B0BEC5',
        textAlign: 'center',
        marginBottom: 20,
    },
    tipText: {
        fontSize: 12,
        color: '#78909C',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default LoadingProgress;
