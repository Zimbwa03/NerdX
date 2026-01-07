/**
 * NerdXLiveToggle.tsx
 * Swipeable toggle button that switches between Audio-only and Video+Audio modes.
 * 
 * Swipe LEFT  → Audio mode (voice-to-voice tutoring)
 * Swipe RIGHT → Video mode (camera + voice tutoring - tutor sees what you write)
 */

import React, { useState, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    PanResponder,
    Dimensions,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_SIZE = 64;
const TOGGLE_WIDTH = 140;
const SWIPE_THRESHOLD = 30;

type Mode = 'idle' | 'audio' | 'video';

interface NerdXLiveToggleProps {
    onAudioMode?: () => void;
    onVideoMode?: () => void;
}

export const NerdXLiveToggle: React.FC<NerdXLiveToggleProps> = ({
    onAudioMode,
    onVideoMode,
}) => {
    const navigation = useNavigation<any>();
    const [mode, setMode] = useState<Mode>('idle');
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Animation values
    const expandAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    
    // Pulse animation for idle state
    React.useEffect(() => {
        if (mode === 'idle' && !isExpanded) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [mode, isExpanded, pulseAnim]);

    // Expand/collapse animation
    const toggleExpand = useCallback(() => {
        if (isExpanded) {
            // Collapse
            Animated.spring(expandAnim, {
                toValue: 0,
                useNativeDriver: false,
                friction: 8,
            }).start(() => setIsExpanded(false));
        } else {
            // Expand
            setIsExpanded(true);
            Animated.spring(expandAnim, {
                toValue: 1,
                useNativeDriver: false,
                friction: 8,
            }).start();
        }
    }, [isExpanded, expandAnim]);

    // Pan responder for swipe gesture
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => isExpanded,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return isExpanded && Math.abs(gestureState.dx) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (isExpanded) {
                    // Clamp the slide value
                    const clampedDx = Math.max(-TOGGLE_WIDTH / 3, Math.min(TOGGLE_WIDTH / 3, gestureState.dx));
                    slideAnim.setValue(clampedDx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > SWIPE_THRESHOLD) {
                    // Swiped RIGHT → Video mode
                    selectVideoMode();
                } else if (gestureState.dx < -SWIPE_THRESHOLD) {
                    // Swiped LEFT → Audio mode
                    selectAudioMode();
                } else {
                    // Return to center
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: false,
                        friction: 8,
                    }).start();
                }
            },
        })
    ).current;

    const selectAudioMode = useCallback(() => {
        setMode('audio');
        Animated.spring(slideAnim, {
            toValue: -TOGGLE_WIDTH / 3,
            useNativeDriver: false,
            friction: 8,
        }).start();
        
        // Navigate to NerdX Live Audio
        setTimeout(() => {
            setIsExpanded(false);
            expandAnim.setValue(0);
            slideAnim.setValue(0);
            setMode('idle');
            onAudioMode?.();
            // Navigate to existing audio mode screen or trigger audio session
            try {
                navigation?.navigate('NerdXLiveAudio');
            } catch (e) {
                console.error('Navigation error:', e);
            }
        }, 300);
    }, [slideAnim, expandAnim, onAudioMode, navigation]);

    const selectVideoMode = useCallback(() => {
        setMode('video');
        Animated.spring(slideAnim, {
            toValue: TOGGLE_WIDTH / 3,
            useNativeDriver: false,
            friction: 8,
        }).start();
        
        // Navigate to NerdX Live Video
        setTimeout(() => {
            setIsExpanded(false);
            expandAnim.setValue(0);
            slideAnim.setValue(0);
            setMode('idle');
            onVideoMode?.();
            try {
                navigation?.navigate('NerdXLiveVideo');
            } catch (e) {
                console.error('Navigation error:', e);
            }
        }, 300);
    }, [slideAnim, expandAnim, onVideoMode, navigation]);

    // Interpolations
    const containerWidth = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [BUTTON_SIZE, TOGGLE_WIDTH],
    });

    const containerBorderRadius = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [BUTTON_SIZE / 2, 32],
    });

    const iconOpacity = expandAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    const toggleOpacity = expandAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    return (
        <View style={styles.wrapper} pointerEvents="box-none">
            <Animated.View
                style={[
                    styles.container,
                    {
                        width: containerWidth,
                        borderRadius: containerBorderRadius,
                        transform: isExpanded ? [] : [{ scale: pulseAnim }],
                    },
                ]}
                {...(isExpanded ? panResponder.panHandlers : {})}
            >
                {/* Collapsed state - Main button */}
                <Animated.View style={[styles.mainButton, { opacity: iconOpacity }]}>
                    <TouchableOpacity
                        onPress={toggleExpand}
                        style={styles.touchArea}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="sparkles" size={28} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Expanded state - Toggle options */}
                <Animated.View style={[styles.toggleContainer, { opacity: toggleOpacity }]}>
                    {/* Audio option (left) */}
                    <TouchableOpacity
                        style={[styles.option, styles.audioOption]}
                        onPress={selectAudioMode}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name="mic" 
                            size={24} 
                            color={mode === 'audio' ? '#4CAF50' : '#fff'} 
                        />
                        <Text style={[
                            styles.optionText,
                            mode === 'audio' && styles.activeOptionText
                        ]}>
                            Audio
                        </Text>
                    </TouchableOpacity>

                    {/* Slider indicator */}
                    <Animated.View 
                        style={[
                            styles.slider,
                            {
                                transform: [{ translateX: slideAnim }],
                            }
                        ]}
                    >
                        <View style={styles.sliderDot} />
                    </Animated.View>

                    {/* Video option (right) */}
                    <TouchableOpacity
                        style={[styles.option, styles.videoOption]}
                        onPress={selectVideoMode}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name="videocam" 
                            size={24} 
                            color={mode === 'video' ? '#FF5722' : '#fff'} 
                        />
                        <Text style={[
                            styles.optionText,
                            mode === 'video' && styles.activeOptionText
                        ]}>
                            Video
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            {/* Helper text when expanded */}
            {isExpanded && (
                <View style={styles.helperContainer}>
                    <Text style={styles.helperText}>
                        ← Swipe to select mode →
                    </Text>
                </View>
            )}

            {/* Close button when expanded */}
            {isExpanded && (
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={toggleExpand}
                >
                    <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        zIndex: 9999,
        elevation: 9999,
        alignItems: 'flex-end',
    },
    container: {
        height: BUTTON_SIZE,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 15,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#fff',
    },
    mainButton: {
        position: 'absolute',
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchArea: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 12,
    },
    option: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    audioOption: {
        // Left side
    },
    videoOption: {
        // Right side
    },
    optionText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    activeOptionText: {
        fontWeight: '700',
    },
    slider: {
        position: 'absolute',
        left: '50%',
        marginLeft: -6,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    helperContainer: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
    },
    helperText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '500',
    },
    closeButton: {
        position: 'absolute',
        top: -30,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
});

export default NerdXLiveToggle;

