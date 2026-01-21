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
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import AudioAura, { AuraState } from '../components/AudioAura';
import { WS_URL as APP_WS_BASE_URL } from '../config';

// Try to import haptics (graceful fallback if not installed)
let Haptics: any = null;
try {
    Haptics = require('expo-haptics');
} catch (e) {
    console.log('expo-haptics not available, haptic feedback disabled');
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Use the same backend host as the rest of the app (Render hybrid server).
// `APP_WS_BASE_URL` should be like: wss://nerdx.onrender.com
const WS_URL = `${APP_WS_BASE_URL}/ws/nerdx-live`;
const CONNECT_BEEP_WAV_BASE64 =
    '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';

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
// With server-side audio buffering, we receive ONE complete audio per turn
// The buffer is still useful for edge cases but typically receives 1 chunk now
const MAX_BUFFER_SIZE = 10; // Reduced from 50 - server sends complete audio
const MAX_RECORDING_DURATION_MS = 60000;
// Adjusted VAD thresholds for better sensitivity:
// - Higher threshold = less sensitive (won't trigger on background noise)
// - Longer silence timeout = allows natural speech pauses
const VAD_SPEECH_THRESHOLD_DB = -40; // Increased from -45 (less sensitive)
// Barge-in detection is more strict to avoid false triggers from speaker bleed.
const BARGE_IN_SPEECH_THRESHOLD_DB = -30;
const BARGE_IN_MIN_HOLD_MS = 350;
const BARGE_IN_COOLDOWN_MS = 600;
const VAD_SILENCE_TIMEOUT_MS = 1500; // Increased from 900ms (allow longer pauses)
const VAD_MIN_RECORDING_MS = 500; // Reduced from 700ms (faster response)

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
    const [isPlaying, setIsPlaying] = useState(false);
    const [listeningEnabled, setListeningEnabled] = useState(false);

    // Refs
    const wsRef = useRef<WebSocket | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const connectedSoundRef = useRef<Audio.Sound | null>(null);
    const currentAudioTurnRef = useRef<AudioTurn | null>(null);
    const isPlayingRef = useRef(false);
    const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const recordingStartTimeRef = useRef<number>(0);
    const bargeInMonitorRef = useRef<Audio.Recording | null>(null);
    const startBargeInMonitorRef = useRef<(() => Promise<void>) | null>(null);
    const stopBargeInMonitorRef = useRef<(() => Promise<void>) | null>(null);
    const startRecordingRef = useRef<(() => Promise<void>) | null>(null);
    const endSessionRef = useRef<(() => Promise<void>) | null>(null);
    const stopRecordingAndSendRef = useRef<(() => Promise<void>) | null>(null);
    const autoStartedListeningRef = useRef(false);
    const bargeInRequestedRef = useRef(false);
    const vadStateRef = useRef<{ lastVoiceAt: number; speechStarted: boolean }>({
        lastVoiceAt: 0,
        speechStarted: false,
    });
    const bargeVadRef = useRef<{
        lastVoiceAt: number;
        speechStartAt: number;
        playbackStartedAt: number;
    }>({ lastVoiceAt: 0, speechStartAt: 0, playbackStartedAt: 0 });
    const sessionHandleRef = useRef<string | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const resumeRequestedRef = useRef(false);

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
                return isPlaying ? 'speaking' : 'idle';
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

    const playConnectedSound = useCallback(async () => {
        try {
            await configureAudioMode(false);
            if (connectedSoundRef.current) {
                try { await connectedSoundRef.current.unloadAsync(); } catch (e) { }
                connectedSoundRef.current = null;
            }
            const uri = `data:audio/wav;base64,${CONNECT_BEEP_WAV_BASE64}`;
            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true, volume: 0.9 }
            );
            connectedSoundRef.current = sound;
        } catch (error) {
            console.error('Connected sound error:', error);
        }
    }, [configureAudioMode]);

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
        if (isPlayingRef.current) {
            console.log('⚠️ Already playing audio - ignoring duplicate play request');
            return;
        }
        
        if (audioTurn.chunks.length === 0) {
            console.log('⚠️ No audio chunks to play');
            return;
        }

        console.log(`🔊 Starting audio playback: ${audioTurn.chunks.length} chunk(s)`);
        isPlayingRef.current = true;
        setIsPlaying(true);
        setAmplitude(0.6); // Simulate speaking amplitude
        await configureAudioMode(false);
        await startBargeInMonitorRef.current?.();

        for (let i = 0; i < audioTurn.chunks.length; i++) {
            if (!isPlayingRef.current) {
                console.log(`⏹️ Playback stopped at chunk ${i + 1}`);
                break;
            }

            const chunk = audioTurn.chunks[i];
            const audioUri = `data:audio/wav;base64,${chunk}`;

            try {
                if (soundRef.current) {
                    try { 
                        await soundRef.current.stopAsync();
                        await soundRef.current.unloadAsync(); 
                    } catch (e) { }
                }

                console.log(`▶️ Playing chunk ${i + 1}/${audioTurn.chunks.length}`);
                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { 
                        shouldPlay: true, 
                        volume: 1.0,
                        progressUpdateIntervalMillis: 100
                    }
                );
                soundRef.current = sound;

                // Wait for playback to complete with proper status tracking
                await new Promise<void>((resolve) => {
                    let resolved = false;
                    let playbackFinished = false;
                    
                    // Calculate estimated duration (WAV file size / sample rate / channels / bit depth)
                    // Rough estimate: base64 size * 3/4 / 48000 / 2 / 2 = seconds
                    const estimatedDuration = Math.max(30000, (chunk.length * 3 / 4 / 48000 / 2 / 2) * 1000);
                    const timeout = setTimeout(() => {
                        if (!resolved) {
                            console.log(`⏱️ Chunk ${i + 1} playback timeout after ${estimatedDuration}ms`);
                            resolved = true;
                            playbackFinished = true;
                            resolve();
                        }
                    }, estimatedDuration + 5000); // Add 5s buffer

                    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                        if (resolved) return;
                        
                        if (!status.isLoaded) {
                            if ('error' in status) {
                                console.error(`❌ Chunk ${i + 1} playback error:`, status.error);
                                clearTimeout(timeout);
                                resolved = true;
                                playbackFinished = true;
                                resolve();
                            }
                            return;
                        }
                        
                        // Check if playback finished
                        if (status.didJustFinish || (status.positionMillis > 0 && status.durationMillis > 0 && status.positionMillis >= status.durationMillis - 100)) {
                            if (!playbackFinished) {
                                console.log(`✅ Chunk ${i + 1} finished playing (position: ${status.positionMillis}ms, duration: ${status.durationMillis}ms)`);
                                clearTimeout(timeout);
                                resolved = true;
                                playbackFinished = true;
                                resolve();
                            }
                        }
                    });
                });
                
                // Small delay between chunks to ensure smooth transition
                if (i < audioTurn.chunks.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            } catch (error) {
                console.error(`❌ Error playing chunk ${i + 1}/${audioTurn.chunks.length}:`, error);
            }
        }

        // Ensure sound is fully stopped and cleaned up
        if (soundRef.current) {
            try {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            } catch (e) {
                console.warn('Cleanup warning:', e);
            }
            soundRef.current = null;
        }

        console.log('🔇 Audio playback complete');
        isPlayingRef.current = false;
        setIsPlaying(false);
        setAmplitude(0);
        await stopBargeInMonitorRef.current?.();
        setConnectionState('ready');
    }, [configureAudioMode]);

    const resetVadState = useCallback(() => {
        vadStateRef.current = { lastVoiceAt: 0, speechStarted: false };
    }, []);

    const stopBargeInMonitor = useCallback(async () => {
        if (!bargeInMonitorRef.current) return;
        const rec = bargeInMonitorRef.current;
        bargeInMonitorRef.current = null;
        try {
            const uri = rec.getURI();
            try { await rec.stopAndUnloadAsync(); } catch (e) { }
            if (uri) {
                try { await FileSystem.deleteAsync(uri, { idempotent: true }); } catch (e) { }
            }
        } catch (e) { }
    }, []);

    const startBargeInMonitor = useCallback(async () => {
        if (!listeningEnabled) return;
        if (Platform.OS === 'web') return;
        if (bargeInMonitorRef.current) return;
        // Only monitor while AI is speaking and socket is open
        if (!isPlayingRef.current) return;
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        try {
            // Allow simultaneous playback + mic monitoring
            await configureAudioMode(true);
            bargeVadRef.current.lastVoiceAt = 0;
            bargeVadRef.current.speechStartAt = 0;
            bargeVadRef.current.playbackStartedAt = Date.now();

            const options: any = {
                isMeteringEnabled: true,
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 64000,
                },
                ios: {
                    extension: '.m4a',
                    audioQuality: Audio.IOSAudioQuality.LOW,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 64000,
                    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
                },
            };

            const { recording } = await Audio.Recording.createAsync(options);
            bargeInMonitorRef.current = recording;
            recording.setProgressUpdateInterval(200);
            recording.setOnRecordingStatusUpdate((status) => {
                if (!status.isRecording) return;
                const metering = typeof status.metering === 'number' ? status.metering : -160;
                const now = Date.now();
                if (metering > BARGE_IN_SPEECH_THRESHOLD_DB) {
                    bargeVadRef.current.lastVoiceAt = now;
                    if (!bargeVadRef.current.speechStartAt) {
                        bargeVadRef.current.speechStartAt = now;
                    }
                    const heldFor = now - bargeVadRef.current.speechStartAt;
                    const playbackFor = now - bargeVadRef.current.playbackStartedAt;

                    // Require sustained speech and a brief cooldown after playback starts
                    if (heldFor >= BARGE_IN_MIN_HOLD_MS && playbackFor >= BARGE_IN_COOLDOWN_MS) {
                        // Barge-in: stop AI playback and switch to user recording
                        (async () => {
                            try {
                                if (soundRef.current) {
                                    await soundRef.current.stopAsync();
                                }
                            } catch (e) { }
                            isPlayingRef.current = false;
                            setIsPlaying(false);
                            setAmplitude(0);
                        })();
                        try {
                            if (wsRef.current?.readyState === WebSocket.OPEN) {
                                bargeInRequestedRef.current = true;
                                wsRef.current.send(JSON.stringify({ type: 'interrupt' }));
                            }
                        } catch (e) { }
                        // Stop monitor + begin real recording ASAP
                        stopBargeInMonitor().finally(() => {
                            setTimeout(() => startRecordingRef.current?.(), 50);
                        });
                    }
                } else {
                    bargeVadRef.current.speechStartAt = 0;
                }
            });
        } catch (e) {
            // If monitoring fails, continue without barge-in
            try { await stopBargeInMonitor(); } catch (err) { }
        }
    }, [configureAudioMode, listeningEnabled, stopBargeInMonitor]);

    stopBargeInMonitorRef.current = stopBargeInMonitor;
    startBargeInMonitorRef.current = startBargeInMonitor;

    const interruptPlayback = useCallback(async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.stopAsync();
            }
        } catch (e) { }
        isPlayingRef.current = false;
        setIsPlaying(false);
        setAmplitude(0);
    }, []);

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

    // Playback timeout (fallback in case turnComplete is missed)
    // With server-side buffering, server sends complete audio with turnComplete signal.
    // Increased timeout to allow longer AI responses (30+ seconds).
    const startPlaybackTimeout = useCallback(() => {
        if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = setTimeout(async () => {
            if (currentAudioTurnRef.current && !currentAudioTurnRef.current.isComplete) {
                console.log('⚠️ Playback timeout triggered - completing audio turn');
                await completeAudioTurn();
            }
        }, 35000); // Increased to 35s to allow long responses (server buffers complete audio)
    }, [completeAudioTurn]);

    // Recording functions
    const startRecording = useCallback(async () => {
        if (recordingRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        try {
            bargeInRequestedRef.current = false;
            await stopBargeInMonitorRef.current?.();
            await interruptPlayback();
            currentAudioTurnRef.current = null;
            if (playbackTimeoutRef.current) {
                clearTimeout(playbackTimeoutRef.current);
                playbackTimeoutRef.current = null;
            }

            await configureAudioMode(true);
            triggerHaptic('medium');

            const recordingOptions: any = {
                isMeteringEnabled: true,
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
            };
            const { recording } = await Audio.Recording.createAsync(recordingOptions);

            recordingRef.current = recording;
            setConnectionState('recording');
            setAmplitude(0.4); // Simulate listening amplitude
            resetVadState();
            recording.setProgressUpdateInterval(200);
            recording.setOnRecordingStatusUpdate((status) => {
                if (!status.isRecording) return;
                const metering = typeof status.metering === 'number' ? status.metering : -160;
                const now = Date.now();
                if (metering > VAD_SPEECH_THRESHOLD_DB) {
                    vadStateRef.current.speechStarted = true;
                    vadStateRef.current.lastVoiceAt = now;
                    if (isPlayingRef.current) {
                        interruptPlayback();
                        // Tell server to stop/flush any pending AI audio (best-effort)
                        try {
                            if (wsRef.current?.readyState === WebSocket.OPEN) {
                                bargeInRequestedRef.current = true;
                                wsRef.current.send(JSON.stringify({ type: 'interrupt' }));
                            }
                        } catch (e) { }
                    }
                }

                if (vadStateRef.current.speechStarted) {
                    const silentFor = now - vadStateRef.current.lastVoiceAt;
                    if (silentFor >= VAD_SILENCE_TIMEOUT_MS && status.durationMillis >= VAD_MIN_RECORDING_MS) {
                        stopRecordingAndSendRef.current?.();
                    }
                }
            });

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
    }, [configureAudioMode, triggerHaptic, interruptPlayback, resetVadState]);

    startRecordingRef.current = startRecording;

    const stopRecordingAndSend = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            const uri = recordingRef.current.getURI();
            triggerHaptic('light');

            try { await recordingRef.current.stopAndUnloadAsync(); } catch (e: any) {
                if (!e?.message?.includes('already been unloaded')) console.warn('Stop warning:', e);
            }
            recordingRef.current = null;
            resetVadState();
            setConnectionState('processing');
            setAmplitude(0.2);

            if (uri && wsRef.current?.readyState === WebSocket.OPEN) {
                const response = await fetch(uri);
                const blob = await response.blob();

                // Add to captions (will be updated when transcription is received)
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
    }, [captionsEnabled, triggerHaptic, resetVadState]);

    stopRecordingAndSendRef.current = stopRecordingAndSend;

    // WebSocket message handler
    const handleWebSocketMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'ready':
                    setConnectionState('ready');
                    configureAudioMode(false);
                    if (data.playSound === 'connected') {
                        playConnectedSound();
                        triggerHaptic('medium');
                    }
                    // Auto-enable listening on first successful connect
                    if (!autoStartedListeningRef.current) {
                        autoStartedListeningRef.current = true;
                        setListeningEnabled(true);
                    }
                    break;

                case 'audio':
                    // If user is currently speaking, ignore AI audio (barge-in)
                    if (recordingRef.current) {
                        console.log('🔇 Ignoring AI audio - user is speaking');
                        return;
                    }
                    if (data.data) {
                        console.log('📥 Received AI audio chunk, buffering...');
                        bufferAudioChunk(data.data);
                        startPlaybackTimeout();
                        if (connectionState !== 'recording') {
                            setConnectionState('processing');
                        }
                    }
                    break;

                case 'text':
                    // Handle transcription text from server
                    if (captionsEnabled && data.text && data.speaker) {
                        const speaker = data.speaker === 'nerdx' ? 'nerdx' : 'user';
                        setCaptions(prev => {
                            // Update last partial caption or add new one
                            const lastCaption = prev[prev.length - 1];
                            if (lastCaption && lastCaption.isPartial && lastCaption.speaker === speaker) {
                                return [...prev.slice(0, -1), {
                                    ...lastCaption,
                                    text: data.text,
                                    isPartial: false
                                }];
                            } else {
                                return [...prev, {
                                    id: Date.now().toString(),
                                    speaker: speaker,
                                    text: data.text,
                                    isPartial: false
                                }];
                            }
                        });
                    }
                    break;

                case 'turnComplete':
                    if (recordingRef.current) {
                        console.log('🔇 Ignoring turnComplete - user is speaking');
                        return;
                    }
                    console.log('✅ Turn complete received - playing buffered audio');
                    completeAudioTurn();
                    break;

                case 'interrupted':
                    currentAudioTurnRef.current = null;
                    if (playbackTimeoutRef.current) {
                        clearTimeout(playbackTimeoutRef.current);
                        playbackTimeoutRef.current = null;
                    }
                    interruptPlayback();
                    if (!bargeInRequestedRef.current && !recordingRef.current && listeningEnabled) {
                        setTimeout(() => startRecording(), 100);
                    }
                    break;

                case 'goAway':
                    if (data.handle) sessionHandleRef.current = data.handle;
                    if (data.sessionId) sessionIdRef.current = data.sessionId;
                    resumeRequestedRef.current = true;
                    Alert.alert('Session Ending', data.message || 'Reconnecting to keep your session alive...');
                    try {
                        if (wsRef.current?.readyState === WebSocket.OPEN) {
                            wsRef.current.close();
                        }
                    } catch (e) { }
                    break;

                case 'sessionUpdate':
                    if (data.handle) sessionHandleRef.current = data.handle;
                    if (data.sessionId) sessionIdRef.current = data.sessionId;
                    break;

                case 'error':
                    Alert.alert('Error', data.message);
                    endSession();
                    break;
            }
        } catch (error) {
            console.error('Message error:', error);
        }
    }, [bufferAudioChunk, startPlaybackTimeout, completeAudioTurn, configureAudioMode, playConnectedSound, startRecording, connectionState, interruptPlayback, listeningEnabled, triggerHaptic]);

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

            if (sessionHandleRef.current) {
                const joiner = wsUrl.includes('?') ? '&' : '?';
                wsUrl = `${wsUrl}${joiner}session_handle=${encodeURIComponent(sessionHandleRef.current)}`;
            }

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => console.log('🔗 Connected');
            ws.onmessage = handleWebSocketMessage;
            ws.onerror = () => {
                setConnectionState('error');
                Alert.alert('Connection Error', 'Could not connect.');
            };
            ws.onclose = () => {
                if (resumeRequestedRef.current) {
                    resumeRequestedRef.current = false;
                    connect();
                    return;
                }
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
        await stopBargeInMonitor();

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
        if (connectedSoundRef.current) {
            try {
                await connectedSoundRef.current.stopAsync();
                await connectedSoundRef.current.unloadAsync();
            } catch (e) { }
            connectedSoundRef.current = null;
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

        setListeningEnabled(false);
        setConnectionState('idle');
        setCaptions([]);
    }, [stopBargeInMonitor]);

    endSessionRef.current = endSession;

    useEffect(() => {
        return () => { endSessionRef.current?.(); };
    }, []);

    useEffect(() => {
        if (connectionState === 'idle') {
            connect();
        }
    }, [connectionState, connect]);

    useEffect(() => {
        if (connectionState === 'ready' && listeningEnabled && !isPlaying && !recordingRef.current) {
            const timer = setTimeout(() => {
                if (wsRef.current?.readyState === WebSocket.OPEN && !recordingRef.current) {
                    startRecording();
                }
            }, 250);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [connectionState, listeningEnabled, isPlaying, startRecording]);

    // Handle main button press
    const handlePress = useCallback(() => {
        if (connectionState === 'idle' || connectionState === 'error') {
            connect();
            return;
        }

        if (!listeningEnabled) {
            setListeningEnabled(true);
            if (connectionState === 'ready' && !recordingRef.current && !isPlaying) {
                startRecording();
            }
            return;
        }

        setListeningEnabled(false);
        stopBargeInMonitor();
        if (recordingRef.current) {
            stopRecordingAndSend();
        } else if (connectionState === 'recording') {
            stopRecordingAndSend();
        }
    }, [connectionState, connect, listeningEnabled, startRecording, stopRecordingAndSend, isPlaying, stopBargeInMonitor]);

    // UI helpers
    const getStatusText = () => {
        switch (connectionState) {
            case 'connecting': return 'Connecting...';
            case 'ready': return listeningEnabled ? 'Listening (auto)' : 'Ready';
            case 'recording': return 'Listening...';
            case 'processing': return 'NerdX is thinking...';
            case 'error': return 'Reconnecting...';
            default: return 'Starting...';
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
                                ) : listeningEnabled ? (
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
        bottom: 200, // Positioned below the record button circle
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
