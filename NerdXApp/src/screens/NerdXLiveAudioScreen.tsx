/**
 * NerdXLiveAudioScreen.tsx
 * Premium "Out of the World" voice tutoring interface
 * 
 * Design: Dark minimal gradient, aurora glow, Audio Aura animation,
 * glass morphism controls, captions overlay
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withRepeat,
    withSequence,
    Easing,
    FadeIn,
    SlideInDown,
} from 'react-native-reanimated';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import AudioAura, { AuraState } from '../components/AudioAura';

// Try to import haptics (graceful fallback if not installed)
let Haptics: any = null;
try {
    Haptics = require('expo-haptics');
} catch (e) {
    console.log('expo-haptics not available, haptic feedback disabled');
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const WS_URL = 'wss://nerdx-voice.onrender.com/ws/nerdx-live';

// Color tokens (from design spec)
const COLORS = {
    bg0: '#050608',
    bg1: '#0B0E14',
    glowBlue: '#3B82F6',
    glowCyan: '#06B6D4',
    iceWhite: '#DCEBFF',
    accentOrange: '#FF9F1C',
    dangerRed: '#FF3B30',
    glass: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    userChip: 'rgba(255, 255, 255, 0.15)',
    nerdxChip: 'rgba(59, 130, 246, 0.3)',
};

// Audio settings
const MAX_BUFFER_SIZE = 50;
const MAX_RECORDING_DURATION_MS = 60000;

type ConnectionState = 'idle' | 'connecting' | 'ready' | 'recording' | 'processing' | 'error';

interface AudioTurn {
    chunks: string[];
    timestamp: number;
    isComplete: boolean;
}

interface CaptionLine {
    id: string;
    speaker: 'user' | 'nerdx';
    text: string;
    isPartial: boolean;
}

const NerdXLiveAudioScreen: React.FC = () => {
    const navigation = useNavigation();

    // State
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [captionsEnabled, setCaptionsEnabled] = useState(false);
    const [captions, setCaptions] = useState<CaptionLine[]>([]);
    const [amplitude, setAmplitude] = useState(0);

    // Refs
    const wsRef = useRef<WebSocket | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const currentAudioTurnRef = useRef<AudioTurn | null>(null);
    const isPlayingRef = useRef(false);
    const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const recordingStartTimeRef = useRef<number>(0);
    const endSessionRef = useRef<() => Promise<void>>();
    const stopRecordingAndSendRef = useRef<() => Promise<void>>();

    // Animations
    const controlsScale = useSharedValue(1);
    const captionsTranslateY = useSharedValue(SCREEN_HEIGHT);

    // Get aura state from connection state
    const getAuraState = (): AuraState => {
        switch (connectionState) {
            case 'recording':
                return 'listening';
            case 'processing':
                return 'thinking';
            case 'ready':
                return isPlayingRef.current ? 'speaking' : 'idle';
            default:
                return 'idle';
        }
    };

    // Haptic feedback (graceful fallback)
    const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
        if (Platform.OS === 'web' || !Haptics) return;

        try {
            switch (type) {
                case 'light':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    break;
                case 'medium':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case 'heavy':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    break;
            }
        } catch (e) {
            // Haptics not available
        }
    };

    // Button press animation
    const handleButtonPressIn = () => {
        controlsScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        triggerHaptic('light');
    };

    const handleButtonPressOut = () => {
        controlsScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    // Captions toggle animation
    useEffect(() => {
        captionsTranslateY.value = withSpring(
            captionsEnabled ? 0 : SCREEN_HEIGHT * 0.4,
            { damping: 20, stiffness: 150 }
        );
    }, [captionsEnabled]);

    // Configure audio
    const configureAudioMode = useCallback(async (forRecording: boolean) => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: forRecording,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch (error) {
            console.error('Audio mode error:', error);
        }
    }, []);

    // Audio buffer management
    const bufferAudioChunk = useCallback((audioData: string) => {
        if (!currentAudioTurnRef.current) {
            currentAudioTurnRef.current = {
                chunks: [],
                timestamp: Date.now(),
                isComplete: false
            };
        }
        currentAudioTurnRef.current.chunks.push(audioData);
        if (currentAudioTurnRef.current.chunks.length > MAX_BUFFER_SIZE) {
            currentAudioTurnRef.current.chunks = currentAudioTurnRef.current.chunks.slice(-MAX_BUFFER_SIZE);
        }
    }, []);

    // Play complete audio turn
    const playCompleteAudioTurn = useCallback(async (audioTurn: AudioTurn) => {
        if (isPlayingRef.current || audioTurn.chunks.length === 0) return;

        isPlayingRef.current = true;
        setAmplitude(0.6); // Simulate speaking amplitude
        await configureAudioMode(false);

        for (let i = 0; i < audioTurn.chunks.length; i++) {
            if (!isPlayingRef.current) break;

            const chunk = audioTurn.chunks[i];
            const audioUri = `data:audio/wav;base64,${chunk}`;

            try {
                if (soundRef.current) {
                    try { await soundRef.current.unloadAsync(); } catch (e) { }
                }

                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: true, volume: 1.0 }
                );
                soundRef.current = sound;

                await new Promise<void>((resolve) => {
                    let resolved = false;
                    const timeout = setTimeout(() => {
                        if (!resolved) { resolved = true; resolve(); }
                    }, 30000);

                    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                        if (resolved) return;
                        if (!status.isLoaded && 'error' in status) {
                            clearTimeout(timeout);
                            resolved = true;
                            resolve();
                        } else if (status.isLoaded && status.didJustFinish) {
                            clearTimeout(timeout);
                            resolved = true;
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error(`Error playing chunk ${i + 1}:`, error);
            }
        }

        isPlayingRef.current = false;
        setAmplitude(0);
        setConnectionState('ready');
    }, [configureAudioMode]);

    // Complete audio turn
    const completeAudioTurn = useCallback(async () => {
        if (!currentAudioTurnRef.current || currentAudioTurnRef.current.isComplete) return;

        if (playbackTimeoutRef.current) {
            clearTimeout(playbackTimeoutRef.current);
            playbackTimeoutRef.current = null;
        }

        currentAudioTurnRef.current.isComplete = true;
        const completedTurn = currentAudioTurnRef.current;
        await playCompleteAudioTurn(completedTurn);
        currentAudioTurnRef.current = null;
    }, [playCompleteAudioTurn]);

    // Playback timeout
    const startPlaybackTimeout = useCallback(() => {
        if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = setTimeout(async () => {
            if (currentAudioTurnRef.current && !currentAudioTurnRef.current.isComplete) {
                await completeAudioTurn();
            }
        }, 10000);
    }, [completeAudioTurn]);

    // Recording functions
    const startRecording = useCallback(async () => {
        if (recordingRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        try {
            if (soundRef.current) {
                try { await soundRef.current.stopAsync(); } catch (e) { }
            }
            currentAudioTurnRef.current = null;
            if (playbackTimeoutRef.current) {
                clearTimeout(playbackTimeoutRef.current);
                playbackTimeoutRef.current = null;
            }

            await configureAudioMode(true);
            triggerHaptic('medium');

            const { recording } = await Audio.Recording.createAsync({
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.m4a',
                    audioQuality: Audio.IOSAudioQuality.MEDIUM,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
                },
                web: {
                    mimeType: 'audio/webm',
                    bitsPerSecond: 128000,
                },
            });

            recordingRef.current = recording;
            setConnectionState('recording');
            setAmplitude(0.4); // Simulate listening amplitude

            recordingStartTimeRef.current = Date.now();
            setTimeout(() => {
                if (recordingRef.current) {
                    stopRecordingAndSendRef.current?.();
                }
            }, MAX_RECORDING_DURATION_MS);
        } catch (error) {
            console.error('Recording error:', error);
            Alert.alert('Microphone Error', 'Could not access microphone.');
            setConnectionState('ready');
        }
    }, [configureAudioMode, triggerHaptic]);

    const stopRecordingAndSend = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            const uri = recordingRef.current.getURI();
            triggerHaptic('light');

            try { await recordingRef.current.stopAndUnloadAsync(); } catch (e: any) {
                if (!e?.message?.includes('already been unloaded')) console.warn('Stop warning:', e);
            }
            recordingRef.current = null;
            setConnectionState('processing');
            setAmplitude(0.2);

            if (uri && wsRef.current?.readyState === WebSocket.OPEN) {
                const response = await fetch(uri);
                const blob = await response.blob();

                // Add to captions
                if (captionsEnabled) {
                    setCaptions(prev => [...prev, {
                        id: Date.now().toString(),
                        speaker: 'user',
                        text: '(Speaking...)',
                        isPartial: true
                    }]);
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    const base64 = base64data.split(',')[1] || base64data;

                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({ type: 'audio', data: base64 }));

                        setTimeout(() => {
                            setConnectionState((current) => {
                                if (current === 'processing') return 'ready';
                                return current;
                            });
                        }, 20000);
                    } else {
                        setConnectionState('ready');
                    }
                };
                reader.onerror = () => setConnectionState('ready');
                reader.readAsDataURL(blob);
            } else {
                setConnectionState('ready');
            }
        } catch (error) {
            console.error('Stop recording error:', error);
            setConnectionState('ready');
        }
    }, [captionsEnabled, triggerHaptic]);

    stopRecordingAndSendRef.current = stopRecordingAndSend;

    // WebSocket message handler
    const handleWebSocketMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'ready':
                    setConnectionState('ready');
                    configureAudioMode(false);
                    break;

                case 'audio':
                    if (data.data) {
                        bufferAudioChunk(data.data);
                        startPlaybackTimeout();
                        if (connectionState !== 'recording') {
                            setConnectionState('processing');
                        }
                    }
                    break;

                case 'turnComplete':
                    completeAudioTurn();
                    break;

                case 'interrupted':
                    currentAudioTurnRef.current = null;
                    if (playbackTimeoutRef.current) {
                        clearTimeout(playbackTimeoutRef.current);
                        playbackTimeoutRef.current = null;
                    }
                    if (soundRef.current) {
                        soundRef.current.stopAsync().catch(() => { });
                    }
                    isPlayingRef.current = false;
                    setAmplitude(0);
                    if (!recordingRef.current) {
                        setTimeout(() => startRecording(), 100);
                    }
                    break;

                case 'goAway':
                    Alert.alert('Session Ending', data.message || 'Please reconnect soon.');
                    break;

                case 'error':
                    Alert.alert('Error', data.message);
                    endSession();
                    break;
            }
        } catch (error) {
            console.error('Message error:', error);
        }
    }, [bufferAudioChunk, startPlaybackTimeout, completeAudioTurn, configureAudioMode, startRecording, connectionState]);

    // Connect
    const connect = useCallback(async () => {
        if (connectionState !== 'idle') return;

        setConnectionState('connecting');
        triggerHaptic('medium');

        try {
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Microphone access needed.');
                setConnectionState('idle');
                return;
            }

            currentAudioTurnRef.current = null;
            isPlayingRef.current = false;
            if (playbackTimeoutRef.current) {
                clearTimeout(playbackTimeoutRef.current);
                playbackTimeoutRef.current = null;
            }

            let wsUrl = WS_URL;
            try {
                const userData = await AsyncStorage.getItem('@user_data');
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user?.id) wsUrl = `${WS_URL}?user_id=${user.id}`;
                }
            } catch (error) { }

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => console.log('🔗 Connected');
            ws.onmessage = handleWebSocketMessage;
            ws.onerror = () => {
                setConnectionState('error');
                Alert.alert('Connection Error', 'Could not connect.');
            };
            ws.onclose = () => {
                if (connectionState !== 'idle') endSession();
            };
        } catch (error) {
            setConnectionState('error');
        }
    }, [connectionState, handleWebSocketMessage, triggerHaptic]);

    // End session
    const endSession = useCallback(async () => {
        currentAudioTurnRef.current = null;
        if (playbackTimeoutRef.current) {
            clearTimeout(playbackTimeoutRef.current);
            playbackTimeoutRef.current = null;
        }

        if (recordingRef.current) {
            try { await recordingRef.current.stopAndUnloadAsync(); } catch (e) { }
            recordingRef.current = null;
        }

        if (soundRef.current) {
            try {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            } catch (e) { }
            soundRef.current = null;
        }

        isPlayingRef.current = false;
        setAmplitude(0);

        if (wsRef.current) {
            try {
                wsRef.current.send(JSON.stringify({ type: 'end' }));
                wsRef.current.close();
            } catch (e) { }
            wsRef.current = null;
        }

        setConnectionState('idle');
        setCaptions([]);
    }, []);

    endSessionRef.current = endSession;

    useEffect(() => {
        return () => { endSessionRef.current?.(); };
    }, []);

    // Handle main button press
    const handlePress = useCallback(() => {
        switch (connectionState) {
            case 'idle':
            case 'error':
                connect();
                break;
            case 'ready':
                startRecording();
                break;
            case 'recording':
                stopRecordingAndSend();
                break;
            case 'processing':
                setConnectionState('ready');
                break;
            default:
                endSession();
        }
    }, [connectionState, connect, startRecording, stopRecordingAndSend, endSession]);

    // UI helpers
    const getStatusText = () => {
        switch (connectionState) {
            case 'connecting': return 'Connecting...';
            case 'ready': return 'Tap to speak';
            case 'recording': return 'Listening...';
            case 'processing': return 'NerdX is thinking...';
            case 'error': return 'Tap to retry';
            default: return 'Tap to start';
        }
    };

    // Animated styles
    const controlsAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: controlsScale.value }],
    }));

    const captionsAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: captionsTranslateY.value }],
    }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg0} />

            {/* Background with aurora glow */}
            <View style={styles.background}>
                {/* Aurora glow at bottom */}
                <View style={styles.auroraContainer}>
                    <View style={[styles.auroraGlow, { backgroundColor: COLORS.glowBlue }]} />
                    <View style={[styles.auroraGlowSecondary, { backgroundColor: COLORS.glowCyan }]} />
                </View>

                {/* Subtle vignette */}
                <View style={styles.vignette} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Animated.View
                    entering={FadeIn.duration(600).delay(200)}
                    style={styles.header}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            endSession();
                            navigation.goBack();
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    {/* Center: Live indicator */}
                    <View style={styles.liveIndicator}>
                        <Ionicons name="radio-outline" size={16} color={COLORS.textPrimary} />
                        <Text style={styles.liveText}>Live</Text>
                        {connectionState !== 'idle' && (
                            <View style={styles.liveDot} />
                        )}
                    </View>

                    {/* Captions toggle */}
                    <TouchableOpacity
                        style={[
                            styles.captionsButton,
                            captionsEnabled && styles.captionsButtonActive
                        ]}
                        onPress={() => {
                            triggerHaptic('light');
                            setCaptionsEnabled(!captionsEnabled);
                        }}
                    >
                        <Ionicons
                            name="text"
                            size={18}
                            color={captionsEnabled ? COLORS.glowBlue : COLORS.textSecondary}
                        />
                    </TouchableOpacity>
                </Animated.View>

                {/* Audio Aura */}
                <View style={styles.auraContainer}>
                    <AudioAura
                        state={getAuraState()}
                        amplitude={amplitude}
                    />
                </View>

                {/* Status text */}
                <Animated.Text
                    entering={FadeIn.duration(400).delay(400)}
                    style={styles.statusText}
                >
                    {getStatusText()}
                </Animated.Text>

                {/* Captions overlay */}
                {captionsEnabled && (
                    <Animated.View style={[styles.captionsOverlay, captionsAnimatedStyle]}>
                        <BlurView intensity={40} tint="dark" style={styles.captionsBlur}>
                            <View style={styles.captionsContent}>
                                {captions.length === 0 ? (
                                    <Text style={styles.captionsPlaceholder}>
                                        Captions will appear here...
                                    </Text>
                                ) : (
                                    captions.slice(-6).map((line) => (
                                        <View key={line.id} style={styles.captionLine}>
                                            <View style={[
                                                styles.speakerChip,
                                                line.speaker === 'nerdx' ? styles.nerdxChip : styles.userChip
                                            ]}>
                                                <Text style={styles.speakerText}>
                                                    {line.speaker === 'nerdx' ? 'NerdX' : 'You'}
                                                </Text>
                                            </View>
                                            <Text style={styles.captionText}>
                                                {line.text}
                                                {line.isPartial && <Text style={styles.cursor}>▍</Text>}
                                            </Text>
                                        </View>
                                    ))
                                )}
                            </View>
                        </BlurView>
                    </Animated.View>
                )}

                {/* Bottom controls */}
                <Animated.View
                    entering={SlideInDown.duration(500).delay(300)}
                    style={styles.controlsContainer}
                >
                    <Animated.View style={[styles.controlsPill, controlsAnimatedStyle]}>
                        <BlurView intensity={30} tint="dark" style={styles.controlsBlur}>
                            {/* Video button (placeholder) */}
                            <TouchableOpacity
                                style={styles.controlButton}
                                onPressIn={handleButtonPressIn}
                                onPressOut={handleButtonPressOut}
                                disabled={true}
                            >
                                <Ionicons name="videocam-outline" size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            {/* Hold/Pause button (placeholder) */}
                            <TouchableOpacity
                                style={styles.controlButton}
                                onPressIn={handleButtonPressIn}
                                onPressOut={handleButtonPressOut}
                                disabled={true}
                            >
                                <Ionicons name="pause-outline" size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            {/* Main Mic button */}
                            <TouchableOpacity
                                style={[
                                    styles.micButton,
                                    connectionState === 'recording' && styles.micButtonActive,
                                ]}
                                onPressIn={handleButtonPressIn}
                                onPressOut={handleButtonPressOut}
                                onPress={handlePress}
                                activeOpacity={0.9}
                            >
                                {connectionState === 'connecting' || connectionState === 'processing' ? (
                                    <Ionicons name="sync" size={28} color={COLORS.textPrimary} />
                                ) : connectionState === 'recording' ? (
                                    <View style={styles.stopIcon} />
                                ) : connectionState === 'idle' ? (
                                    <Ionicons name="play" size={28} color={COLORS.textPrimary} />
                                ) : (
                                    <Ionicons name="mic" size={28} color={COLORS.textPrimary} />
                                )}
                            </TouchableOpacity>

                            {/* End button */}
                            <TouchableOpacity
                                style={[styles.controlButton, styles.endButton]}
                                onPressIn={handleButtonPressIn}
                                onPressOut={handleButtonPressOut}
                                onPress={() => {
                                    triggerHaptic('heavy');
                                    endSession();
                                    navigation.goBack();
                                }}
                            >
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </BlurView>
                    </Animated.View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg0,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    auroraContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SCREEN_HEIGHT * 0.4,
        alignItems: 'center',
    },
    auroraGlow: {
        position: 'absolute',
        bottom: -100,
        width: SCREEN_WIDTH * 1.5,
        height: SCREEN_WIDTH * 0.8,
        borderRadius: SCREEN_WIDTH,
        opacity: 0.15,
    },
    auroraGlowSecondary: {
        position: 'absolute',
        bottom: -50,
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.5,
        borderRadius: SCREEN_WIDTH,
        opacity: 0.1,
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        borderWidth: 80,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 0,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.glass,
        alignItems: 'center',
        justifyContent: 'center',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    liveText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.accentOrange,
        marginLeft: 4,
    },
    captionsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captionsButtonActive: {
        borderColor: COLORS.glowBlue,
    },
    auraContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -SCREEN_HEIGHT * 0.05,
    },
    statusText: {
        color: COLORS.textSecondary,
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 20,
    },
    captionsOverlay: {
        position: 'absolute',
        bottom: 120,
        left: 16,
        right: 16,
        maxHeight: SCREEN_HEIGHT * 0.25,
        borderRadius: 20,
        overflow: 'hidden',
    },
    captionsBlur: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    captionsContent: {
        padding: 16,
    },
    captionsPlaceholder: {
        color: COLORS.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
    captionLine: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 8,
    },
    speakerChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    userChip: {
        backgroundColor: COLORS.userChip,
    },
    nerdxChip: {
        backgroundColor: COLORS.nerdxChip,
    },
    speakerText: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
    captionText: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 14,
        lineHeight: 20,
    },
    cursor: {
        color: COLORS.glowBlue,
    },
    controlsContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    controlsPill: {
        borderRadius: 36,
        overflow: 'hidden',
    },
    controlsBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        height: 72,
        paddingHorizontal: 20,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.glass,
        alignItems: 'center',
        justifyContent: 'center',
    },
    micButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.glowBlue,
        alignItems: 'center',
        justifyContent: 'center',
        // Glow effect
        shadowColor: COLORS.glowBlue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 8,
    },
    micButtonActive: {
        backgroundColor: COLORS.dangerRed,
        shadowColor: COLORS.dangerRed,
    },
    stopIcon: {
        width: 18,
        height: 18,
        borderRadius: 4,
        backgroundColor: COLORS.textPrimary,
    },
    endButton: {
        backgroundColor: COLORS.dangerRed,
    },
});

export default NerdXLiveAudioScreen;
