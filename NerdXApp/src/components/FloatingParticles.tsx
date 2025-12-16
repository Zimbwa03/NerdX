// FloatingParticles Component - Ambient animated background
// Creates a magical atmosphere with floating orbs and stars

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useThemedColors } from '../theme/useThemedStyles';

const { width, height } = Dimensions.get('window');

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    animX: Animated.Value;
    animY: Animated.Value;
    animOpacity: Animated.Value;
}

interface FloatingParticlesProps {
    count?: number;
    color?: string;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
    count = 15,
    color,
}) => {
    const themedColors = useThemedColors();
    const particleColor = color || themedColors.primary.main;

    const particles = useRef<Particle[]>(
        Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * width,
            y: Math.random() * height * 0.5,
            size: Math.random() * 6 + 2,
            opacity: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 20000 + 15000,
            animX: new Animated.Value(0),
            animY: new Animated.Value(0),
            animOpacity: new Animated.Value(Math.random()),
        }))
    ).current;

    useEffect(() => {
        particles.forEach((particle) => {
            // Floating X animation
            const animateX = () => {
                Animated.sequence([
                    Animated.timing(particle.animX, {
                        toValue: Math.random() * 60 - 30,
                        duration: particle.speed,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.animX, {
                        toValue: Math.random() * 60 - 30,
                        duration: particle.speed,
                        useNativeDriver: true,
                    }),
                ]).start(animateX);
            };

            // Floating Y animation
            const animateY = () => {
                Animated.sequence([
                    Animated.timing(particle.animY, {
                        toValue: Math.random() * 40 - 20,
                        duration: particle.speed * 0.8,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.animY, {
                        toValue: Math.random() * 40 - 20,
                        duration: particle.speed * 0.8,
                        useNativeDriver: true,
                    }),
                ]).start(animateY);
            };

            // Opacity pulse
            const animateOpacity = () => {
                Animated.sequence([
                    Animated.timing(particle.animOpacity, {
                        toValue: particle.opacity + 0.3,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.animOpacity, {
                        toValue: particle.opacity,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ]).start(animateOpacity);
            };

            animateX();
            animateY();
            animateOpacity();
        });
    }, []);

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((particle) => (
                <Animated.View
                    key={particle.id}
                    style={[
                        styles.particle,
                        {
                            left: particle.x,
                            top: particle.y,
                            width: particle.size,
                            height: particle.size,
                            borderRadius: particle.size / 2,
                            backgroundColor: particleColor,
                            opacity: particle.animOpacity,
                            transform: [
                                { translateX: particle.animX },
                                { translateY: particle.animY },
                            ],
                            shadowColor: particleColor,
                            shadowOpacity: 0.8,
                            shadowRadius: particle.size,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
    },
    particle: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 0 },
    },
});

export default FloatingParticles;
