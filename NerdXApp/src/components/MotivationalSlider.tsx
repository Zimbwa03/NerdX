// MotivationalSlider Component - Auto-rotating motivational quotes
// Stunning animated carousel with glassmorphism and gradient effects

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Quote, getRandomQuote, MOTIVATIONAL_QUOTES } from '../data/MotivationalQuotes';
import { useThemedColors } from '../theme/useThemedStyles';

const { width } = Dimensions.get('window');

interface MotivationalSliderProps {
    intervalMs?: number;
    showCategory?: boolean;
    showAuthor?: boolean;
}

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
    academic: ['#667eea', '#764ba2'],
    science: ['#11998e', '#38ef7d'],
    math: ['#4facfe', '#00f2fe'],
    growth: ['#fa709a', '#fee140'],
    perseverance: ['#a18cd1', '#fbc2eb'],
    fun: ['#ff9a9e', '#fecfef'],
};

const MotivationalSlider: React.FC<MotivationalSliderProps> = ({
    intervalMs = 3000,
    showCategory = true,
    showAuthor = true,
}) => {
    const themedColors = useThemedColors();
    const [currentQuote, setCurrentQuote] = useState<Quote>(getRandomQuote());
    const [nextQuote, setNextQuote] = useState<Quote>(getRandomQuote());

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    // Glow pulse animation
    useEffect(() => {
        const glowLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        );
        glowLoop.start();
        return () => glowLoop.stop();
    }, []);

    // Quote rotation
    const rotateQuote = useCallback(() => {
        // Prepare next quote
        let newQuote = getRandomQuote();
        while (newQuote.id === currentQuote.id) {
            newQuote = getRandomQuote();
        }
        setNextQuote(newQuote);

        // Animate out current quote
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -30,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setCurrentQuote(newQuote);
            slideAnim.setValue(30);

            // Animate in new quote
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, [currentQuote.id, fadeAnim, slideAnim, scaleAnim]);

    useEffect(() => {
        const interval = setInterval(rotateQuote, intervalMs);
        return () => clearInterval(interval);
    }, [intervalMs, rotateQuote]);

    const gradientColors = CATEGORY_GRADIENTS[currentQuote.category] || CATEGORY_GRADIENTS.academic;

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.6],
    });

    return (
        <View style={styles.container}>
            {/* Glow effect behind */}
            <Animated.View style={[styles.glowEffect, { opacity: glowOpacity }]}>
                <LinearGradient
                    colors={[gradientColors[0] + '60', gradientColors[1] + '60']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.glowGradient}
                />
            </Animated.View>

            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
            >
                {/* Glassmorphism overlay */}
                <View style={styles.glassOverlay}>
                    {/* Sparkle decorations */}
                    <View style={styles.sparkleContainer}>
                        <Text style={styles.sparkle}>✨</Text>
                        <Text style={[styles.sparkle, styles.sparkleRight]}>💫</Text>
                    </View>

                    {/* Quote content */}
                    <Animated.View
                        style={[
                            styles.quoteContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim },
                                ],
                            },
                        ]}
                    >
                        {showCategory && (
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryEmoji}>{currentQuote.emoji}</Text>
                                <Text style={styles.categoryText}>
                                    {currentQuote.category.charAt(0).toUpperCase() + currentQuote.category.slice(1)}
                                </Text>
                            </View>
                        )}

                        <Text style={styles.quoteText}>"{currentQuote.text}"</Text>

                        {showAuthor && currentQuote.author && (
                            <Text style={styles.authorText}>— {currentQuote.author}</Text>
                        )}
                    </Animated.View>

                    {/* Progress dots */}
                    <View style={styles.dotsContainer}>
                        {[0, 1, 2].map((dot) => (
                            <View
                                key={dot}
                                style={[
                                    styles.dot,
                                    dot === 1 && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
        marginBottom: 24,
        position: 'relative',
    },
    glowEffect: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        bottom: -10,
        borderRadius: 28,
        zIndex: -1,
    },
    glowGradient: {
        flex: 1,
        borderRadius: 28,
    },
    gradientContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
    },
    glassOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 20,
        minHeight: 160,
    },
    sparkleContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sparkle: {
        fontSize: 20,
        opacity: 0.8,
    },
    sparkleRight: {
        fontSize: 18,
    },
    quoteContainer: {
        alignItems: 'center',
        paddingTop: 24,
        paddingHorizontal: 8,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    categoryEmoji: {
        fontSize: 14,
        marginRight: 6,
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    quoteText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    authorText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 12,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    activeDot: {
        width: 20,
        backgroundColor: '#FFFFFF',
    },
});

export default MotivationalSlider;
