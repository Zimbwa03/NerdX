/**
 * AudioAura.tsx
 * Premium animated audio visualization component for NerdX Live
 * 
 * Inspired by Gemini Live with a "living tutoring presence" feel.
 * Features: blur blob, inner flow lines, ripple rings, state-based animations
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withSpring,
    withDelay,
    interpolate,
    Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AURA_SIZE = SCREEN_WIDTH * 0.7;

// Color tokens
const COLORS = {
    glowBlue: '#3B82F6',
    glowCyan: '#06B6D4',
    iceWhite: '#DCEBFF',
    warmGreen: '#10B981',
    warmOrange: '#F59E0B',
    thinking: '#8B5CF6',
};

export type AuraState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AudioAuraProps {
    state: AuraState;
    amplitude?: number; // 0-1 for audio reactivity
}

const AudioAura: React.FC<AudioAuraProps> = ({ state, amplitude = 0 }) => {
    // Shared values for animations
    const breatheScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.6);
    const rippleScale = useSharedValue(0);
    const rippleOpacity = useSharedValue(0);
    const innerRotation = useSharedValue(0);
    const beamOpacity = useSharedValue(0);
    const shimmerOpacity = useSharedValue(0);

    // Breathing animation (idle)
    useEffect(() => {
        // Slow breathing for all states
        breatheScale.value = withRepeat(
            withSequence(
                withTiming(1.03, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Inner flow rotation
        innerRotation.value = withRepeat(
            withTiming(360, { duration: 20000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    // State-based animations
    useEffect(() => {
        switch (state) {
            case 'idle':
                pulseOpacity.value = withTiming(0.5, { duration: 500 });
                beamOpacity.value = withTiming(0, { duration: 300 });
                break;

            case 'listening':
                pulseOpacity.value = withTiming(0.65, { duration: 200 });
                beamOpacity.value = withTiming(0, { duration: 300 });
                break;

            case 'thinking':
                pulseOpacity.value = withRepeat(
                    withSequence(
                        withTiming(0.4, { duration: 1000 }),
                        withTiming(0.6, { duration: 1000 })
                    ),
                    -1,
                    true
                );
                // Shimmer effect
                shimmerOpacity.value = withRepeat(
                    withSequence(
                        withDelay(Math.random() * 2000, withTiming(0.3, { duration: 200 })),
                        withTiming(0, { duration: 500 })
                    ),
                    -1,
                    false
                );
                beamOpacity.value = withTiming(0, { duration: 300 });
                break;

            case 'speaking':
                pulseOpacity.value = withTiming(0.8, { duration: 200 });
                beamOpacity.value = withTiming(0.15, { duration: 500 });
                break;
        }
    }, [state]);

    // Amplitude-based ripple (for speaking/listening)
    useEffect(() => {
        if ((state === 'speaking' || state === 'listening') && amplitude > 0.5) {
            rippleScale.value = 0;
            rippleOpacity.value = 0.4;
            rippleScale.value = withTiming(1.5, { duration: 600, easing: Easing.out(Easing.ease) });
            rippleOpacity.value = withTiming(0, { duration: 600 });
        }
    }, [amplitude, state]);

    // Main aura blob style
    const mainAuraStyle = useAnimatedStyle(() => {
        const baseScale = state === 'speaking' ? 1.05 : state === 'listening' ? 1.02 : 1;
        const amplitudeBoost = state === 'speaking' ? amplitude * 0.08 : amplitude * 0.03;

        return {
            transform: [
                { scale: breatheScale.value * (baseScale + amplitudeBoost) },
            ],
            opacity: pulseOpacity.value,
        };
    });

    // Inner flow lines style
    const innerFlowStyle = useAnimatedStyle(() => {
        const flowOpacity = state === 'speaking' ? 0.25 : state === 'thinking' ? 0.15 : 0.08;
        return {
            transform: [{ rotate: `${innerRotation.value}deg` }],
            opacity: flowOpacity,
        };
    });

    // Ripple ring style
    const rippleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: rippleScale.value }],
        opacity: rippleOpacity.value,
    }));

    // Vertical beam style (only when speaking)
    const beamStyle = useAnimatedStyle(() => ({
        opacity: beamOpacity.value,
    }));

    // Shimmer particles style
    const shimmerStyle = useAnimatedStyle(() => ({
        opacity: shimmerOpacity.value,
    }));

    // Get aura color based on state
    const getAuraColors = () => {
        switch (state) {
            case 'listening':
                return [COLORS.warmGreen, COLORS.glowCyan];
            case 'thinking':
                return [COLORS.thinking, COLORS.glowBlue];
            case 'speaking':
                return [COLORS.glowBlue, COLORS.glowCyan];
            default:
                return [COLORS.glowBlue, COLORS.iceWhite];
        }
    };

    const [primaryColor, secondaryColor] = getAuraColors();

    return (
        <View style={styles.container}>
            {/* Vertical Light Beam (speaking only) */}
            <Animated.View style={[styles.lightBeam, beamStyle]}>
                <View style={[styles.beamGradient, { backgroundColor: COLORS.iceWhite }]} />
            </Animated.View>

            {/* Outer Ripple Ring */}
            <Animated.View style={[styles.rippleRing, rippleStyle]}>
                <View style={[styles.rippleBorder, { borderColor: secondaryColor }]} />
            </Animated.View>

            {/* Main Blur Blob */}
            <Animated.View style={[styles.mainAura, mainAuraStyle]}>
                {/* Gradient layers */}
                <View style={[styles.auraLayer, { backgroundColor: primaryColor, opacity: 0.6 }]} />
                <View style={[styles.auraLayerInner, { backgroundColor: secondaryColor, opacity: 0.4 }]} />
                <View style={[styles.auraCore, { backgroundColor: COLORS.iceWhite, opacity: 0.3 }]} />
            </Animated.View>

            {/* Inner Flow Lines */}
            <Animated.View style={[styles.innerFlow, innerFlowStyle]}>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <View
                        key={i}
                        style={[
                            styles.flowLine,
                            {
                                transform: [{ rotate: `${angle}deg` }],
                                backgroundColor: COLORS.iceWhite,
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            {/* Shimmer Particles (thinking state) */}
            <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
                {[0, 1, 2].map((i) => (
                    <View
                        key={i}
                        style={[
                            styles.shimmerParticle,
                            {
                                left: 30 + i * 40,
                                top: 20 + (i % 2) * 30,
                                backgroundColor: COLORS.iceWhite,
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: AURA_SIZE,
        height: AURA_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lightBeam: {
        position: 'absolute',
        width: 60,
        height: AURA_SIZE * 0.4,
        bottom: AURA_SIZE * 0.5,
        alignItems: 'center',
    },
    beamGradient: {
        width: 2,
        height: '100%',
        opacity: 0.3,
        borderRadius: 1,
    },
    rippleRing: {
        position: 'absolute',
        width: AURA_SIZE,
        height: AURA_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rippleBorder: {
        width: '100%',
        height: '100%',
        borderRadius: AURA_SIZE / 2,
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    mainAura: {
        width: AURA_SIZE * 0.7,
        height: AURA_SIZE * 0.7,
        borderRadius: AURA_SIZE * 0.35,
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow for blur effect (iOS)
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 60,
        // Android elevation
        elevation: 20,
    },
    auraLayer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: AURA_SIZE * 0.35,
    },
    auraLayerInner: {
        position: 'absolute',
        width: '70%',
        height: '70%',
        borderRadius: AURA_SIZE * 0.25,
    },
    auraCore: {
        position: 'absolute',
        width: '30%',
        height: '30%',
        borderRadius: AURA_SIZE * 0.1,
    },
    innerFlow: {
        position: 'absolute',
        width: AURA_SIZE * 0.5,
        height: AURA_SIZE * 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flowLine: {
        position: 'absolute',
        width: 1,
        height: AURA_SIZE * 0.2,
        opacity: 0.3,
    },
    shimmerContainer: {
        position: 'absolute',
        width: AURA_SIZE * 0.5,
        height: AURA_SIZE * 0.3,
    },
    shimmerParticle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});

export default AudioAura;
