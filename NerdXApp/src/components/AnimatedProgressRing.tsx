// Animated Progress Ring Component
// Circular progress indicator for XP, level progress, and mastery

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

interface AnimatedProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    gradientColors?: [string, string];
    centerContent?: React.ReactNode;
    label?: string;
    showPercentage?: boolean;
    animated?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
    progress,
    size = 120,
    strokeWidth = 12,
    gradientColors = [Colors.primary.main, Colors.primary.dark],
    centerContent,
    label,
    showPercentage = false,
    animated = true,
}) => {
    const themedColors = useThemedColors();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        if (animated) {
            animatedValue.setValue(0);
            Animated.timing(animatedValue, {
                toValue: progress,
                duration: 1500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();

            // Pulse animation when progress is high
            if (progress >= 80) {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseValue, {
                            toValue: 1.05,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseValue, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            }
        } else {
            animatedValue.setValue(progress);
        }
    }, [progress, animated]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
                <Svg width={size} height={size}>
                    <Defs>
                        <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor={gradientColors[0]} />
                            <Stop offset="100%" stopColor={gradientColors[1]} />
                        </SvgGradient>
                    </Defs>

                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={themedColors.background.subtle}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />

                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="url(#progressGradient)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        rotation={-90}
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
            </Animated.View>

            {/* Center Content */}
            <View style={[styles.centerContainer, { width: size - strokeWidth * 2, height: size - strokeWidth * 2 }]}>
                {centerContent ? (
                    centerContent
                ) : showPercentage ? (
                    <View style={styles.percentageContainer}>
                        <Text style={[styles.percentageText, { color: themedColors.text.primary }]}>
                            {Math.round(progress)}%
                        </Text>
                        {label && (
                            <Text style={[styles.labelText, { color: themedColors.text.secondary }]}>
                                {label}
                            </Text>
                        )}
                    </View>
                ) : null}
            </View>
        </View>
    );
};

// Level Progress Ring specific variant
interface LevelProgressRingProps {
    level: number;
    currentXP: number;
    xpForNextLevel: number;
    size?: number;
}

export const LevelProgressRing: React.FC<LevelProgressRingProps> = ({
    level,
    currentXP,
    xpForNextLevel,
    size = 160,
}) => {
    const themedColors = useThemedColors();
    const progress = Math.min((currentXP / xpForNextLevel) * 100, 100);

    return (
        <AnimatedProgressRing
            progress={progress}
            size={size}
            strokeWidth={14}
            gradientColors={[Colors.primary.light, Colors.primary.main]}
            centerContent={
                <View style={styles.levelContent}>
                    <Text style={styles.levelLabel}>LEVEL</Text>
                    <Text style={[styles.levelNumber, { color: themedColors.text.primary }]}>
                        {level}
                    </Text>
                    <View style={styles.xpBadge}>
                        <Text style={styles.xpText}>
                            ⭐ {currentXP.toLocaleString()} XP
                        </Text>
                    </View>
                </View>
            }
        />
    );
};

// Mini Progress Ring for skill mastery
interface MiniProgressRingProps {
    progress: number;
    color: string;
    size?: number;
}

export const MiniProgressRing: React.FC<MiniProgressRingProps> = ({
    progress,
    color,
    size = 48,
}) => {
    return (
        <AnimatedProgressRing
            progress={progress}
            size={size}
            strokeWidth={4}
            gradientColors={[color, color]}
            showPercentage={false}
            centerContent={
                <Text style={[styles.miniPercentage, { color }]}>
                    {Math.round(progress)}%
                </Text>
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageContainer: {
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    labelText: {
        fontSize: 12,
        marginTop: 2,
    },
    levelContent: {
        alignItems: 'center',
    },
    levelLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.secondary,
        letterSpacing: 2,
    },
    levelNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 2,
    },
    xpBadge: {
        backgroundColor: 'rgba(124, 77, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 4,
    },
    xpText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary.main,
    },
    miniPercentage: {
        fontSize: 11,
        fontWeight: 'bold',
    },
});

export default AnimatedProgressRing;
