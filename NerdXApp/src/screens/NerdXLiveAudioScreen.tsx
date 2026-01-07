/**
 * NerdXLiveAudioScreen.tsx
 * Full-screen audio-only tutoring interface.
 * Uses the existing NerdXLiveButton logic in a dedicated screen.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    StatusBar,
    Animated,
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const WS_URL = 'wss://nerdx-voice.onrender.com/ws/nerdx-live';

// TURN-BASED AUDIO BUFFERING SYSTEM
// Audio chunks are buffered until turnComplete, then played sequentially
const MAX_BUFFER_SIZE = 50; // Maximum audio chunks to buffer per turn
const PLAYBACK_TIMEOUT_MS = 10000; // Max time to wait for turnComplete after last chunk

// Voice Activity Detection (VAD) - DISABLED for tap-to-speak mode
// User manually controls when to send by tapping
const MAX_RECORDING_DURATION_MS = 60000; // Maximum recording duration (60s - safety limit)

type ConnectionState = 'idle' | 'connecting' | 'ready' | 'recording' | 'processing' | 'error';

interface AudioTurn {
    chunks: string[];
    timestamp: number;
    isComplete: boolean;
}

const NerdXLiveAudioScreen: React.FC = () => {
    const navigation = useNavigation();

    // State
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');

    // Refs
    const wsRef = useRef<WebSocket | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);

    // NEW: Turn-based audio buffering system
    const currentAudioTurnRef = useRef<AudioTurn | null>(null);
    const isPlayingRef = useRef(false);
    const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Recording refs (VAD disabled for tap-to-speak)
    const recordingStartTimeRef = useRef<number>(0);
    
    // Animation
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    // Pulse animation
    useEffect(() => {
        if (connectionState === 'recording') {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [connectionState, pulseAnim]);

    // Wave animation for processing
    useEffect(() => {
        if (connectionState === 'processing' || isPlayingRef.current) {
            const wave = Animated.loop(
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            );
            wave.start();
            return () => wave.stop();
        }
    }, [connectionState, waveAnim]);

    // Refs to avoid circular dependency issues
    const endSessionRef = useRef<() => Promise<void>>();
    const stopRecordingAndSendRef = useRef<() => Promise<void>>();

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

    // NEW: Audio Buffer Manager - Buffers chunks until turnComplete
    const bufferAudioChunk = useCallback((audioData: string) => {
        if (!currentAudioTurnRef.current) {
            // Start new audio turn
            currentAudioTurnRef.current = {
                chunks: [],
                timestamp: Date.now(),
                isComplete: false
            };
            console.log('🎵 Started new audio turn buffering');
        }

        // Add chunk to current turn
        currentAudioTurnRef.current.chunks.push(audioData);

        // Safety check: prevent buffer overflow
        if (currentAudioTurnRef.current.chunks.length > MAX_BUFFER_SIZE) {
            console.warn('⚠️ Audio buffer overflow - truncating turn');
            currentAudioTurnRef.current.chunks = currentAudioTurnRef.current.chunks.slice(-MAX_BUFFER_SIZE);
        }

        console.log(`📦 Buffered audio chunk ${currentAudioTurnRef.current.chunks.length}/${MAX_BUFFER_SIZE}`);
    }, []);

    // NEW: Play Complete Audio Turn - Sequential chunk playback
    const playCompleteAudioTurn = useCallback(async (audioTurn: AudioTurn) => {
        if (isPlayingRef.current || audioTurn.chunks.length === 0) {
            console.log('⏸️ Skipping playback - already playing or no chunks');
            return;
        }

        isPlayingRef.current = true;
        console.log(`🔊 Playing complete audio turn: ${audioTurn.chunks.length} chunks sequentially`);
        console.log(`📐 First chunk size: ${audioTurn.chunks[0]?.length || 0} chars`);

        await configureAudioMode(false);

        // Play each chunk sequentially (each chunk is a complete WAV file)
        for (let i = 0; i < audioTurn.chunks.length; i++) {
            if (!isPlayingRef.current) {
                console.log('⏹️ Playback interrupted');
                break;
            }

            const chunk = audioTurn.chunks[i];
            const audioUri = `data:audio/wav;base64,${chunk}`;

            try {
                if (soundRef.current) {
                    try {
                        await soundRef.current.unloadAsync();
                    } catch (e) {}
                }

                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: true, volume: 1.0 }
                );
                soundRef.current = sound;

                // Wait for this chunk to finish - with proper error handling
                await new Promise<void>((resolve) => {
                    let resolved = false;
                    
                    // Safety timeout per chunk (30s max)
                    const timeout = setTimeout(() => {
                        if (!resolved) {
                            console.warn(`⏰ Chunk ${i + 1} timeout - moving to next`);
                            resolved = true;
                            resolve();
                        }
                    }, 30000);
                    
                    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                        if (resolved) return;
                        
                        // Check for errors (status.isLoaded=false with error property)
                        if (!status.isLoaded && 'error' in status) {
                            console.error(`❌ Chunk ${i + 1} load error`);
                            clearTimeout(timeout);
                            resolved = true;
                            resolve();
                        } else if (status.isLoaded && status.didJustFinish) {
                            console.log(`✅ Chunk ${i + 1}/${audioTurn.chunks.length} finished`);
                            clearTimeout(timeout);
                            resolved = true;
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error(`❌ Error playing chunk ${i + 1}:`, error);
                // Continue to next chunk on error
            }
        }

        console.log('✅ Complete audio turn playback finished');
        isPlayingRef.current = false;
        setConnectionState('ready');
    }, [configureAudioMode]);

    // NEW: Complete Current Audio Turn (called when turnComplete received)
    const completeAudioTurn = useCallback(async () => {
        if (!currentAudioTurnRef.current || currentAudioTurnRef.current.isComplete) {
            console.log('⏸️ No active audio turn to complete');
            return;
        }

        // Clear any pending timeout
        if (playbackTimeoutRef.current) {
            clearTimeout(playbackTimeoutRef.current);
            playbackTimeoutRef.current = null;
        }

        currentAudioTurnRef.current.isComplete = true;
        const completedTurn = currentAudioTurnRef.current;

        console.log(`✅ Completing audio turn: ${completedTurn.chunks.length} chunks`);

        // Play the complete turn
        await playCompleteAudioTurn(completedTurn);

        // Reset for next turn
        currentAudioTurnRef.current = null;
    }, [playCompleteAudioTurn]);

    // NEW: Handle Playback Timeout (safety fallback)
    const startPlaybackTimeout = useCallback(() => {
        if (playbackTimeoutRef.current) {
            clearTimeout(playbackTimeoutRef.current);
        }

        playbackTimeoutRef.current = setTimeout(async () => {
            console.warn('⏰ Playback timeout - forcing completion of current turn');
            if (currentAudioTurnRef.current && !currentAudioTurnRef.current.isComplete) {
                await completeAudioTurn();
            }
        }, PLAYBACK_TIMEOUT_MS);
    }, [completeAudioTurn]);


    // Recording - tap to start
    const startRecording = useCallback(async () => {
        // Don't start if already recording or if WebSocket is not connected
        if (recordingRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.log('⏸️ Skipping recording start - already recording or not connected');
            return;
        }

        try {
            // Stop playback on barge-in (user interrupts AI)
            if (soundRef.current) {
                try {
                    await soundRef.current.stopAsync();
                } catch (e) {}
            }

            // NEW: Clear current audio turn buffer
            currentAudioTurnRef.current = null;

            // Clear any pending timeout
            if (playbackTimeoutRef.current) {
                clearTimeout(playbackTimeoutRef.current);
                playbackTimeoutRef.current = null;
            }

            await configureAudioMode(true);

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
            
            // Start safety check for maximum duration
            recordingStartTimeRef.current = Date.now();
            setTimeout(() => {
                if (recordingRef.current) {
                    console.log('⏱️ Maximum recording duration reached - auto-stopping');
                    stopRecordingAndSendRef.current?.();
                }
            }, MAX_RECORDING_DURATION_MS);
            
            console.log('🎙️ Recording started - tap again to send');
        } catch (error) {
            console.error('Recording error:', error);
            Alert.alert('Microphone Error', 'Could not access microphone.');
            setConnectionState('ready');
        }
    }, [configureAudioMode]);

    const stopRecordingAndSend = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            const uri = recordingRef.current.getURI();
            
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (e: any) {
                if (!e?.message?.includes('already been unloaded')) {
                    console.warn('Stop warning:', e);
                }
            }
            recordingRef.current = null;
            setConnectionState('processing');

            if (uri && wsRef.current?.readyState === WebSocket.OPEN) {
                const response = await fetch(uri);
                const blob = await response.blob();
                
                console.log(`📤 Preparing to send audio: ${blob.size} bytes`);
                
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    const base64 = base64data.split(',')[1] || base64data;

                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        console.log(`📤 Sending audio to AI (${base64.length} chars base64)`);
                        wsRef.current.send(JSON.stringify({
                            type: 'audio',
                            data: base64,
                        }));
                        console.log('✅ Audio sent, waiting for AI response...');

                        // Timeout fallback - if no response in 20 seconds, return to ready
                        setTimeout(() => {
                            setConnectionState((current) => {
                                if (current === 'processing') {
                                    console.log('⏰ No response from AI - returning to ready state');
                                    return 'ready';
                                }
                                return current;
                            });
                        }, 20000);
                    } else {
                        console.error('❌ WebSocket not open when trying to send audio');
                        setConnectionState('ready');
                    }
                };
                reader.onerror = (error) => {
                    console.error('❌ Error reading audio file:', error);
                    setConnectionState('ready');
                };
                reader.readAsDataURL(blob);
            } else {
                console.error('❌ No audio URI or WebSocket not open');
                setConnectionState('ready');
            }
        } catch (error) {
            console.error('Stop recording error:', error);
            setConnectionState('ready');
        }
    }, []);

    // Update ref for circular dependency resolution
    stopRecordingAndSendRef.current = stopRecordingAndSend;

    // UPDATED: WebSocket Handler - Turn-Based Audio Buffering
    const handleWebSocketMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'ready':
                    setConnectionState('ready');
                    configureAudioMode(false);
                    // Don't auto-start - wait for user to tap
                    break;

                case 'audio':
                    if (data.data) {
                        console.log('📥 Received AI audio chunk - buffering for turn completion');

                        // NEW: Buffer audio chunk instead of playing immediately
                        bufferAudioChunk(data.data);
                        startPlaybackTimeout(); // Safety timeout

                        // Update state to show AI is responding
                        // Don't change state if we're recording (barge-in scenario)
                        if (connectionState !== 'recording') {
                            setConnectionState('processing');
                        }
                    }
                    break;

                case 'turnComplete':
                    console.log('✅ AI turn complete received!');
                    console.log(`📊 Buffered chunks: ${currentAudioTurnRef.current?.chunks?.length || 0}`);

                    // NEW: Complete the audio turn and play all buffered chunks
                    completeAudioTurn();

                    // Don't auto-start - wait for user to tap
                    break;

                case 'interrupted':
                    // User interrupted AI (barge-in) - clear buffered audio
                    console.log('🎤 User interrupted AI - clearing audio buffer');

                    // NEW: Clear current audio turn buffer
                    currentAudioTurnRef.current = null;

                    // Clear any pending timeout
                    if (playbackTimeoutRef.current) {
                        clearTimeout(playbackTimeoutRef.current);
                        playbackTimeoutRef.current = null;
                    }

                    // Stop any current playback
                    if (soundRef.current) {
                        soundRef.current.stopAsync().catch(() => {});
                    }

                    isPlayingRef.current = false;

                    // Recording should already be active from when user started speaking
                    // If not, start it
                    if (!recordingRef.current) {
                        setTimeout(() => {
                            startRecording();
                        }, 100);
                    }
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

    const connect = useCallback(async () => {
        if (connectionState !== 'idle') return;

        setConnectionState('connecting');

        try {
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Microphone access needed.');
                setConnectionState('idle');
                return;
            }

            // NEW: Initialize audio turn buffer
            currentAudioTurnRef.current = null;
            isPlayingRef.current = false;

            // Clear any pending timeout
            if (playbackTimeoutRef.current) {
                clearTimeout(playbackTimeoutRef.current);
                playbackTimeoutRef.current = null;
            }

            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('🔗 Connected - starting conversational flow');
            };
            ws.onmessage = (event: any) => {
                // Log all incoming messages for debugging
                try {
                    const data = JSON.parse(event.data);
                    console.log('📥 Received WebSocket message:', data.type, Object.keys(data));
                } catch (e) {
                    console.log('📥 Received WebSocket message (non-JSON):', event.data?.substring(0, 100));
                }
                handleWebSocketMessage(event);
            };
            ws.onerror = (error: any) => {
                console.error('❌ WebSocket error:', error);
                setConnectionState('error');
                Alert.alert('Connection Error', 'Could not connect.');
            };
            ws.onclose = (event: any) => {
                console.log('🔌 WebSocket closed:', event.code, event.reason);
                if (connectionState !== 'idle') endSession();
            };
        } catch (error) {
            setConnectionState('error');
        }
    }, [connectionState, handleWebSocketMessage]);

    const endSession = useCallback(async () => {
        // NEW: Clear audio turn buffer and timeouts
        currentAudioTurnRef.current = null;

        if (playbackTimeoutRef.current) {
            clearTimeout(playbackTimeoutRef.current);
            playbackTimeoutRef.current = null;
        }

        if (recordingRef.current) {
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (e) {}
            recordingRef.current = null;
        }

        if (soundRef.current) {
            try {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            } catch (e) {}
            soundRef.current = null;
        }

        isPlayingRef.current = false;

        if (wsRef.current) {
            try {
                wsRef.current.send(JSON.stringify({ type: 'end' }));
                wsRef.current.close();
            } catch (e) {}
            wsRef.current = null;
        }

        setConnectionState('idle');
    }, []);

    // Update ref for cleanup effect
    endSessionRef.current = endSession;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            endSessionRef.current?.();
        };
    }, []);

    const handlePress = useCallback(() => {
        switch (connectionState) {
            case 'idle':
                connect();
                break;
            case 'ready':
                // Tap to start recording
                startRecording();
                break;
            case 'recording':
                // Tap to stop recording and send
                stopRecordingAndSend();
                break;
            case 'processing':
                // Tap to cancel and return to ready
                setConnectionState('ready');
                break;
            case 'error':
                // Tap to retry connection
                connect();
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
            case 'recording': return 'Listening... tap to send';
            case 'processing': return 'NerdX is thinking...';
            case 'error': return 'Error - tap to retry';
            default: return 'Tap to start';
        }
    };

    const getButtonColor = () => {
        switch (connectionState) {
            case 'connecting':
            case 'processing': return '#FF9800';
            case 'ready': return '#4CAF50';
            case 'recording': return '#F44336';
            case 'error': return '#9E9E9E';
            default: return '#6C63FF';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            endSession();
                            navigation.goBack();
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <Text style={styles.title}>NerdX Live</Text>
                    
                    <View style={styles.placeholder} />
                </View>

                {/* Main content */}
                <View style={styles.content}>
                    {/* Wave visualization */}
                    <View style={styles.waveContainer}>
                        {[...Array(5)].map((_, i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.waveLine,
                                    {
                                        height: 40 + Math.sin(i) * 20,
                                        opacity: connectionState === 'processing' || isPlayingRef.current ? 0.8 : 0.3,
                                        transform: [{
                                            scaleY: waveAnim.interpolate({
                                                inputRange: [0, 0.5, 1],
                                                outputRange: [1, 1.5 + i * 0.2, 1],
                                            })
                                        }]
                                    }
                                ]}
                            />
                        ))}
                    </View>

                    {/* Status text */}
                    <Text style={styles.statusText}>{getStatusText()}</Text>

                    {/* Main button */}
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <TouchableOpacity
                            style={[styles.mainButton, { backgroundColor: getButtonColor() }]}
                            onPress={handlePress}
                            activeOpacity={0.8}
                        >
                            {connectionState === 'connecting' || connectionState === 'processing' ? (
                                <Ionicons name="sync" size={48} color="#fff" />
                            ) : connectionState === 'recording' ? (
                                <Ionicons name="mic" size={48} color="#fff" />
                            ) : connectionState === 'ready' ? (
                                <Ionicons name="mic-outline" size={48} color="#fff" />
                            ) : (
                                <Ionicons name="chatbubble-ellipses" size={48} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Hint */}
                    <Text style={styles.hintText}>
                        {connectionState === 'idle' 
                            ? 'Tap to start your conversation'
                            : connectionState === 'ready'
                                ? 'Tap the button to ask a question'
                                : connectionState === 'recording'
                                    ? 'Speak clearly, then tap again to send'
                                    : connectionState === 'processing'
                                        ? 'NerdX is thinking and will respond shortly...'
                                        : 'Wait for NerdX to respond...'}
                    </Text>
                </View>

                {/* End button */}
                {connectionState !== 'idle' && (
                    <TouchableOpacity
                        style={styles.endButton}
                        onPress={() => {
                            endSession();
                            navigation.goBack();
                        }}
                    >
                        <Ionicons name="close-circle" size={24} color="#F44336" />
                        <Text style={styles.endButtonText}>End Session</Text>
                    </TouchableOpacity>
                )}
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    placeholder: {
        width: 44,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    waveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        marginBottom: 40,
    },
    waveLine: {
        width: 4,
        backgroundColor: '#6C63FF',
        borderRadius: 2,
        marginHorizontal: 6,
    },
    statusText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 40,
        textAlign: 'center',
    },
    mainButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
    },
    hintText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 40,
        lineHeight: 20,
    },
    manualSendHint: {
        color: 'rgba(108, 99, 255, 0.8)',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 12,
        fontStyle: 'italic',
    },
    endButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginBottom: 20,
    },
    endButtonText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default NerdXLiveAudioScreen;
