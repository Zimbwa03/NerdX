/**
 * NerdXLiveVideoScreen.tsx
 * Premium "Out of the World" video + audio tutoring interface
 * 
 * Design: Camera feed with mini aura overlay, glass captions lower-third,
 * floating controls, network toast, smooth transitions
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
    Image,
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
    FadeOut,
    SlideInDown,
    SlideInUp,
    interpolate,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraView } from 'expo-camera';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Try to import haptics (graceful fallback)
let Haptics: any = null;
try {
    Haptics = require('expo-haptics');
} catch (e) {
    console.log('expo-haptics not available');
}

// WebSocket server URL
const WS_URL = 'wss://nerdx-voice.onrender.com/ws/nerdx-live-video';

// Video streaming settings (per Vertex AI Live API documentation)
const FRAME_INTERVAL_MS = 1000; // 1 FPS
const FRAME_QUALITY = 0.8;
const MAX_FRAME_SIZE = 768;

// Jitter buffer settings
const MIN_BUFFER_CHUNKS = 2;

// Color tokens
const COLORS = {
    bg0: '#050608',
    bg1: '#0B0E14',
    glowBlue: '#3B82F6',
    glowCyan: '#06B6D4',
    iceWhite: '#DCEBFF',
    accentOrange: '#FF9F1C',
    accentGreen: '#10B981',
    dangerRed: '#FF3B30',
    glass: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    glassDark: 'rgba(0, 0, 0, 0.6)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    userChip: 'rgba(255, 255, 255, 0.15)',
    nerdxChip: 'rgba(59, 130, 246, 0.3)',
};

type ConnectionState = 'idle' | 'connecting' | 'ready' | 'active' | 'error';

interface CaptionLine {
    id: string;
    speaker: 'user' | 'nerdx';
    text: string;
    isPartial: boolean;
}

const NerdXLiveVideoScreen: React.FC = () => {
    const navigation = useNavigation();

    // State
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [captionsEnabled, setCaptionsEnabled] = useState(false);
    const [captions, setCaptions] = useState<CaptionLine[]>([]);
    const [networkWarning, setNetworkWarning] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Refs
    const cameraRef = useRef<CameraView>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const frameCaptureInProgressRef = useRef(false);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);
    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Animations
    const controlsScale = useSharedValue(1);
    const auraScale = useSharedValue(1);
    const auraOpacity = useSharedValue(0.5);
    const captionsTranslateY = useSharedValue(100);

    // Request permissions
    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: audioStatus } = await Audio.requestPermissionsAsync();
            setHasPermission(cameraStatus === 'granted' && audioStatus === 'granted');
        })();
        return () => { endSession(); };
    }, []);

    // Aura breathing animation
    useEffect(() => {
        auraScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    // Speaking state animation
    useEffect(() => {
        if (isSpeaking) {
            auraOpacity.value = withTiming(0.8, { duration: 200 });
            auraScale.value = withRepeat(
                withSequence(
                    withTiming(1.15, { duration: 300 }),
                    withTiming(1.05, { duration: 300 })
                ),
                -1,
                true
            );
        } else {
            auraOpacity.value = withTiming(0.5, { duration: 300 });
        }
    }, [isSpeaking]);

    // Captions animation
    useEffect(() => {
        captionsTranslateY.value = withSpring(
            captionsEnabled ? 0 : 100,
            { damping: 20, stiffness: 150 }
        );
    }, [captionsEnabled]);

    // Haptic feedback
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
        } catch (e) { }
    };

    // Button animations
    const handleButtonPressIn = () => {
        controlsScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        triggerHaptic('light');
    };

    const handleButtonPressOut = () => {
        controlsScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

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

    // Audio playback with jitter buffer
    const playNextAudio = useCallback(async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) return;

        isPlayingRef.current = true;
        setIsSpeaking(true);
        const audioData = audioQueueRef.current.shift();

        if (!audioData) {
            isPlayingRef.current = false;
            setIsSpeaking(false);
            return;
        }

        try {
            await configureAudioMode(false);
            if (soundRef.current) {
                try { await soundRef.current.unloadAsync(); } catch (e) { }
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: `data:audio/wav;base64,${audioData}` },
                { shouldPlay: true, volume: 1.0 }
            );
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                if (status.isLoaded && status.didJustFinish) {
                    isPlayingRef.current = false;
                    if (audioQueueRef.current.length === 0) {
                        setIsSpeaking(false);
                    }
                    playNextAudio();
                }
            });
        } catch (error) {
            console.error('Playback error:', error);
            isPlayingRef.current = false;
            setIsSpeaking(false);
            playNextAudio();
        }
    }, [configureAudioMode]);

    // Start playback checker
    const startPlaybackChecker = useCallback(() => {
        if (playbackIntervalRef.current) return;
        playbackIntervalRef.current = setInterval(() => {
            if (!isPlayingRef.current && audioQueueRef.current.length >= MIN_BUFFER_CHUNKS) {
                playNextAudio();
            }
        }, 50);
    }, [playNextAudio]);

    // Capture and send video frame
    const captureAndSendFrame = useCallback(async () => {
        if (!cameraRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        if (frameCaptureInProgressRef.current) return;

        frameCaptureInProgressRef.current = true;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: FRAME_QUALITY,
                base64: true,
                skipProcessing: true,
            });

            if (photo?.base64 && wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'video_frame',
                    data: photo.base64,
                    timestamp: Date.now(),
                }));
            }
        } catch (error) {
            console.error('Frame capture error:', error);
        } finally {
            frameCaptureInProgressRef.current = false;
        }
    }, []);

    // Start video streaming
    const startVideoStreaming = useCallback(() => {
        if (frameIntervalRef.current) return;
        console.log(`🎥 Starting video stream at 1 FPS`);
        captureAndSendFrame();
        frameIntervalRef.current = setInterval(captureAndSendFrame, FRAME_INTERVAL_MS);
    }, [captureAndSendFrame]);

    // Stop video streaming
    const stopVideoStreaming = useCallback(() => {
        if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
        }
    }, []);

    // Start audio recording
    const startAudioRecording = useCallback(async () => {
        if (recordingRef.current) return;

        try {
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
                web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
            });

            recordingRef.current = recording;
            setIsRecording(true);
        } catch (error) {
            console.error('Recording error:', error);
        }
    }, [configureAudioMode, triggerHaptic]);

    // Stop and send audio
    const stopAndSendAudio = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            triggerHaptic('light');
            const uri = recordingRef.current.getURI();
            await recordingRef.current.stopAndUnloadAsync();
            recordingRef.current = null;
            setIsRecording(false);

            if (uri && wsRef.current?.readyState === WebSocket.OPEN) {
                const response = await fetch(uri);
                const blob = await response.blob();

                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    const base64 = base64data.split(',')[1] || base64data;
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({ type: 'audio', data: base64 }));
                    }
                };
                reader.readAsDataURL(blob);
            }
        } catch (error) {
            console.error('Stop audio error:', error);
            setIsRecording(false);
        }
    }, [triggerHaptic]);

    // WebSocket message handler
    const handleWebSocketMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'ready':
                    setConnectionState('ready');
                    setTimeout(() => {
                        setConnectionState('active');
                        startVideoStreaming();
                        startPlaybackChecker();
                    }, 500);
                    break;

                case 'audio':
                    if (data.data) {
                        audioQueueRef.current.push(data.data);
                        if (!isPlayingRef.current && audioQueueRef.current.length >= MIN_BUFFER_CHUNKS) {
                            playNextAudio();
                        }
                    }
                    break;

                case 'turnComplete':
                    console.log('✅ AI turn complete');
                    break;

                case 'interrupted':
                    audioQueueRef.current = [];
                    if (soundRef.current) {
                        soundRef.current.stopAsync().catch(() => { });
                    }
                    isPlayingRef.current = false;
                    setIsSpeaking(false);
                    break;

                case 'goAway':
                    setNetworkWarning('Session ending soon. Please reconnect.');
                    setTimeout(() => setNetworkWarning(null), 5000);
                    break;

                case 'error':
                    setNetworkWarning(data.message || 'Connection error');
                    setTimeout(() => setNetworkWarning(null), 5000);
                    break;
            }
        } catch (error) {
            console.error('Message error:', error);
        }
    }, [startVideoStreaming, startPlaybackChecker, playNextAudio]);

    // Connect to server
    const connect = useCallback(async () => {
        if (connectionState !== 'idle') return;

        setConnectionState('connecting');
        triggerHaptic('medium');

        try {
            let wsUrl = WS_URL;
            const userData = await AsyncStorage.getItem('@user_data');
            if (userData) {
                const user = JSON.parse(userData);
                if (user?.id) wsUrl = `${WS_URL}?user_id=${user.id}`;
            }

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => console.log('🔗 Video session connected');
            ws.onmessage = handleWebSocketMessage;
            ws.onerror = () => {
                setConnectionState('error');
                setNetworkWarning('Connection failed. Please try again.');
                setTimeout(() => setNetworkWarning(null), 5000);
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
        stopVideoStreaming();

        if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
            playbackIntervalRef.current = null;
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

        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setIsSpeaking(false);

        if (wsRef.current) {
            try {
                wsRef.current.send(JSON.stringify({ type: 'end' }));
                wsRef.current.close();
            } catch (e) { }
            wsRef.current = null;
        }

        setConnectionState('idle');
        setIsRecording(false);
        setCaptions([]);
    }, [stopVideoStreaming]);

    // Main action handler
    const handleMainAction = useCallback(() => {
        switch (connectionState) {
            case 'idle':
            case 'error':
                connect();
                break;
            case 'active':
                if (isRecording) {
                    stopAndSendAudio();
                } else {
                    startAudioRecording();
                }
                break;
        }
    }, [connectionState, isRecording, connect, startAudioRecording, stopAndSendAudio]);

    // Flip camera
    const flipCamera = useCallback(() => {
        triggerHaptic('light');
        setIsFrontCamera(prev => !prev);
    }, [triggerHaptic]);

    // Animated styles
    const controlsAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: controlsScale.value }],
    }));

    const auraAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: auraScale.value }],
        opacity: auraOpacity.value,
    }));

    const captionsAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: captionsTranslateY.value }],
    }));

    // Permission check
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>Requesting permissions...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>Camera and microphone access required</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.retryText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Camera Feed */}
            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={isFrontCamera ? 'front' : 'back'}
                />

                {/* Film grain overlay */}
                <View style={styles.grainOverlay} />

                {/* NerdX watermark */}
                <View style={styles.watermark}>
                    <Text style={styles.watermarkText}>NerdX Live</Text>
                </View>

                {/* Mini Audio Aura (bottom center of video) */}
                <Animated.View style={[styles.miniAura, auraAnimatedStyle]}>
                    <View style={[styles.auraGlow, { backgroundColor: COLORS.glowBlue }]} />
                    <View style={[styles.auraCore, { backgroundColor: COLORS.iceWhite }]} />
                </Animated.View>

                {/* Flip camera button */}
                <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
                    <Ionicons name="camera-reverse-outline" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => { endSession(); navigation.goBack(); }}
                    >
                        <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    {/* Live indicator */}
                    <View style={styles.liveIndicator}>
                        <Ionicons name="radio-outline" size={16} color={COLORS.textPrimary} />
                        <Text style={styles.liveText}>Live</Text>
                        {connectionState === 'active' && (
                            <View style={[styles.liveDot, { backgroundColor: COLORS.accentGreen }]} />
                        )}
                    </View>

                    {/* Captions toggle */}
                    <TouchableOpacity
                        style={[styles.captionsButton, captionsEnabled && styles.captionsButtonActive]}
                        onPress={() => { triggerHaptic('light'); setCaptionsEnabled(!captionsEnabled); }}
                    >
                        <Ionicons name="text" size={18} color={captionsEnabled ? COLORS.glowBlue : COLORS.textSecondary} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Network warning toast */}
                {networkWarning && (
                    <Animated.View entering={SlideInUp.duration(300)} exiting={FadeOut.duration(200)} style={styles.networkToast}>
                        <BlurView intensity={40} tint="dark" style={styles.toastBlur}>
                            <Ionicons name="warning-outline" size={16} color={COLORS.accentOrange} />
                            <Text style={styles.toastText}>{networkWarning}</Text>
                            <TouchableOpacity onPress={() => setNetworkWarning(null)}>
                                <Text style={styles.toastDismiss}>OK</Text>
                            </TouchableOpacity>
                        </BlurView>
                    </Animated.View>
                )}

                {/* Captions overlay (lower-third) */}
                {captionsEnabled && (
                    <Animated.View style={[styles.captionsOverlay, captionsAnimatedStyle]}>
                        <BlurView intensity={40} tint="dark" style={styles.captionsBlur}>
                            <View style={styles.captionsContent}>
                                {captions.length === 0 ? (
                                    <Text style={styles.captionsPlaceholder}>Captions will appear here...</Text>
                                ) : (
                                    captions.slice(-4).map((line) => (
                                        <View key={line.id} style={styles.captionLine}>
                                            <View style={[styles.speakerChip, line.speaker === 'nerdx' ? styles.nerdxChip : styles.userChip]}>
                                                <Text style={styles.speakerText}>{line.speaker === 'nerdx' ? 'NerdX' : 'You'}</Text>
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

                {/* Status indicator */}
                {connectionState !== 'active' && (
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>
                            {connectionState === 'connecting' ? 'Connecting...' :
                                connectionState === 'ready' ? 'Starting video...' :
                                    connectionState === 'error' ? 'Tap to retry' : 'Tap to start'}
                        </Text>
                    </View>
                )}

                {/* Bottom controls */}
                <Animated.View entering={SlideInDown.duration(400).delay(200)} style={styles.controlsContainer}>
                    <Animated.View style={[styles.controlsPill, controlsAnimatedStyle]}>
                        <BlurView intensity={30} tint="dark" style={styles.controlsBlur}>
                            {/* Video indicator (active) */}
                            <View style={[styles.controlButton, styles.activeButton]}>
                                <Ionicons name="videocam" size={22} color={COLORS.textPrimary} />
                            </View>

                            {/* Hold button */}
                            <TouchableOpacity
                                style={styles.controlButton}
                                onPressIn={handleButtonPressIn}
                                onPressOut={handleButtonPressOut}
                            >
                                <Ionicons name="pause-outline" size={22} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            {/* Mic button */}
                            <TouchableOpacity
                                style={[styles.micButton, isRecording && styles.micButtonActive]}
                                onPressIn={handleButtonPressIn}
                                onPressOut={handleButtonPressOut}
                                onPress={handleMainAction}
                            >
                                {connectionState === 'connecting' ? (
                                    <Ionicons name="sync" size={26} color={COLORS.textPrimary} />
                                ) : connectionState === 'idle' ? (
                                    <Ionicons name="play" size={26} color={COLORS.textPrimary} />
                                ) : isRecording ? (
                                    <View style={styles.stopIcon} />
                                ) : (
                                    <Ionicons name="mic" size={26} color={COLORS.textPrimary} />
                                )}
                            </TouchableOpacity>

                            {/* End button */}
                            <TouchableOpacity
                                style={[styles.controlButton, styles.endButton]}
                                onPressIn={handleButtonPressIn}
                                onPressOut={handleButtonPressOut}
                                onPress={() => { triggerHaptic('heavy'); endSession(); navigation.goBack(); }}
                            >
                                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
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
    cameraContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
    grainOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    watermark: {
        position: 'absolute',
        bottom: 140,
        right: 16,
        opacity: 0.3,
    },
    watermarkText: {
        color: COLORS.textPrimary,
        fontSize: 10,
        fontWeight: '500',
    },
    miniAura: {
        position: 'absolute',
        bottom: 130,
        alignSelf: 'center',
        width: 80,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    auraGlow: {
        position: 'absolute',
        width: 80,
        height: 40,
        borderRadius: 20,
        opacity: 0.6,
    },
    auraCore: {
        width: 40,
        height: 20,
        borderRadius: 10,
        opacity: 0.4,
    },
    flipButton: {
        position: 'absolute',
        top: 100,
        right: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.glass,
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 40 : 8,
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
        backgroundColor: COLORS.glassDark,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    liveText: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
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
    networkToast: {
        position: 'absolute',
        top: 100,
        left: 24,
        right: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    toastBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
        borderRadius: 16,
    },
    toastText: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    toastDismiss: {
        color: COLORS.glowBlue,
        fontSize: 13,
        fontWeight: '600',
    },
    captionsOverlay: {
        position: 'absolute',
        bottom: 110,
        left: 16,
        right: 16,
        maxHeight: SCREEN_HEIGHT * 0.2,
        borderRadius: 16,
        overflow: 'hidden',
    },
    captionsBlur: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    captionsContent: {
        padding: 14,
    },
    captionsPlaceholder: {
        color: COLORS.textSecondary,
        fontSize: 13,
        textAlign: 'center',
    },
    captionLine: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        gap: 8,
    },
    speakerChip: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    userChip: {
        backgroundColor: COLORS.userChip,
    },
    nerdxChip: {
        backgroundColor: COLORS.nerdxChip,
    },
    speakerText: {
        color: COLORS.textPrimary,
        fontSize: 11,
        fontWeight: '600',
    },
    captionText: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 13,
        lineHeight: 18,
    },
    cursor: {
        color: COLORS.glowBlue,
    },
    statusContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        color: COLORS.textSecondary,
        fontSize: 18,
        fontWeight: '500',
        backgroundColor: COLORS.glassDark,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
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
        gap: 16,
        height: 72,
        paddingHorizontal: 18,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    controlButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: COLORS.glass,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeButton: {
        backgroundColor: COLORS.glowBlue,
        shadowColor: COLORS.glowBlue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    micButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.glowBlue,
        alignItems: 'center',
        justifyContent: 'center',
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
        width: 16,
        height: 16,
        borderRadius: 3,
        backgroundColor: COLORS.textPrimary,
    },
    endButton: {
        backgroundColor: COLORS.dangerRed,
    },
    permissionText: {
        color: COLORS.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.glowBlue,
        borderRadius: 12,
        alignSelf: 'center',
    },
    retryText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NerdXLiveVideoScreen;
