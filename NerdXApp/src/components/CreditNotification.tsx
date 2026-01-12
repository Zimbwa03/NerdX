import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export const CreditNotification = () => {
    const { creditNotification, clearCreditNotification } = useAuth();
    const [visible, setVisible] = useState(false);
    const [scaleValue] = useState(new Animated.Value(0));

    useEffect(() => {
        if (creditNotification) {
            setVisible(true);
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }).start();
        } else {
            setVisible(false);
            scaleValue.setValue(0);
        }
    }, [creditNotification]);

    const handleClose = () => {
        Animated.timing(scaleValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            clearCreditNotification();
        });
    };

    if (!visible || !creditNotification) return null;

    const { title, message, credits, type } = creditNotification;

    // Determine styles/icon based on type
    const isWelcome = type === 'welcome_bonus';
    const icon = isWelcome ? 'gift-outline' : 'calendar-check-outline';
    const gradientColors = isWelcome
        ? ['#FFD700', '#FFA500'] as const
        : ['#4ADE80', '#22C55E'] as const;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
                    <LinearGradient
                        colors={['#1a1a2e', '#16213e']}
                        style={styles.content}
                    >
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={gradientColors}
                                style={styles.iconCircle}
                            >
                                <MaterialCommunityIcons name={icon} size={40} color="#FFF" />
                            </LinearGradient>
                        </View>

                        <Text style={styles.title}>{title}</Text>

                        <View style={styles.creditBadge}>
                            <Text style={styles.creditAmount}>+{credits}</Text>
                            <Text style={styles.creditLabel}>CREDITS</Text>
                        </View>

                        <Text style={styles.message}>{message}</Text>

                        <TouchableOpacity style={styles.button} onPress={handleClose}>
                            <LinearGradient
                                colors={['#4c669f', '#3b5998', '#192f6a']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Awesome!</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    content: {
        padding: 30,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    creditBadge: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    creditAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4ADE80',
        marginRight: 8,
    },
    creditLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    message: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    button: {
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
