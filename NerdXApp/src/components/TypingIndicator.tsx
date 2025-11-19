// Typing Indicator Component - Animated typing dots
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const TypingIndicator: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animations = Animated.parallel([
            animateDot(dot1, 0),
            animateDot(dot2, 150),
            animateDot(dot3, 300),
        ]);

        animations.start();

        return () => animations.stop();
    }, []);

    const animatedStyle = (dot: Animated.Value) => ({
        opacity: dot,
        transform: [
            {
                translateY: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                }),
            },
        ],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.dot, animatedStyle(dot1)]} />
            <Animated.View style={[styles.dot, animatedStyle(dot2)]} />
            <Animated.View style={[styles.dot, animatedStyle(dot3)]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1976D2',
        marginHorizontal: 3,
    },
});
