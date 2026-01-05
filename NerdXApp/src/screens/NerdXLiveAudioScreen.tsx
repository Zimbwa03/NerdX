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

// Jitter buffer settings
const MIN_BUFFER_CHUNKS = 3;
const PLAYBACK_CHECK_INTERVAL = 50;

type ConnectionState = 'idle' | 'connecting' | 'ready' | 'recording' | 'processing' | 'error';

const NerdXLiveAudioScreen: React.FC = () => {
    const navigation = useNavigation();
    
    // State
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    
    // Refs
    const wsRef = useRef<WebSocket | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);
    const hasStartedPlaybackRef = useRef(false);
    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
    
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
        if (connectionState === 'processing' || (audioQueueRef.current.length > 0 && isPlayingRef.current)) {
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            endSession();
        };
    }, []);

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
        if (isPlayingRef.current || audioQueueRef.current.length === 0) {
            return;
        }

        if (!hasStartedPlaybackRef.current && audioQueueRef.current.length < MIN_BUFFER_CHUNKS) {
            return;
        }

        hasStartedPlaybackRef.current = true;
        isPlayingRef.current = true;
        
        const audioData = audioQueueRef.current.shift();
        if (!audioData) {
            isPlayingRef.current = false;
            return;
        }

        try {
            const audioUri = `data:audio/wav;base64,${audioData}`;

            if (soundRef.current) {
                try {
                    await soundRef.current.unloadAsync();
                } catch (e) {}
            }

            await configureAudioMode(false);

            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true, volume: 1.0 }
            );
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                if (status.isLoaded && status.didJustFinish) {
                    isPlayingRef.current = false;
                    playNextAudio();
                }
            });
        } catch (error) {
            console.error('Playback error:', error);
            isPlayingRef.current = false;
            playNextAudio();
        }
    }, [configureAudioMode]);

    const startPlaybackMonitor = useCallback(() => {
        if (playbackIntervalRef.current) return;
        playbackIntervalRef.current = setInterval(() => {
            if (audioQueueRef.current.length > 0 && !isPlayingRef.current) {
                playNextAudio();
            }
        }, PLAYBACK_CHECK_INTERVAL);
    }, [playNextAudio]);

    const stopPlaybackMonitor = useCallback(() => {
        if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
            playbackIntervalRef.current = null;
        }
    }, []);

    // Recording
    const startRecording = useCallback(async () => {
        try {
            if (recordingRef.current) {
                try {
                    await recordingRef.current.stopAndUnloadAsync();
                } catch (e) {}
                recordingRef.current = null;
            }

            // Stop playback on barge-in
            if (soundRef.current) {
                try {
                    await soundRef.current.stopAsync();
                } catch (e) {}
            }
            audioQueueRef.current = [];
            hasStartedPlaybackRef.current = false;

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
        } catch (error) {
            console.error('Recording error:', error);
            Alert.alert('Microphone Error', 'Could not access microphone.');
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
                
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    const base64 = base64data.split(',')[1] || base64data;

                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({
                            type: 'audio',
                            data: base64,
                        }));

                        setTimeout(() => {
                            setConnectionState((current) => {
                                if (current === 'processing') return 'ready';
                                return current;
                            });
                        }, 15000);
                    }
                };
                reader.readAsDataURL(blob);
            } else {
                setConnectionState('ready');
            }
        } catch (error) {
            console.error('Stop recording error:', error);
            setConnectionState('ready');
        }
    }, []);

    // WebSocket
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
                        audioQueueRef.current.push(data.data);
                        startPlaybackMonitor();
                        playNextAudio();
                    }
                    break;

                case 'turnComplete':
                    hasStartedPlaybackRef.current = false;
                    setConnectionState('ready');
                    break;

                case 'interrupted':
                    audioQueueRef.current = [];
                    hasStartedPlaybackRef.current = false;
                    if (soundRef.current) {
                        soundRef.current.stopAsync().catch(() => {});
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
    }, [playNextAudio, startPlaybackMonitor, configureAudioMode]);

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

            audioQueueRef.current = [];
            isPlayingRef.current = false;
            hasStartedPlaybackRef.current = false;

            const ws = new WebSocket(WS_URL);
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
    }, [connectionState, handleWebSocketMessage]);

    const endSession = useCallback(async () => {
        stopPlaybackMonitor();

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

        audioQueueRef.current = [];
        isPlayingRef.current = false;
        hasStartedPlaybackRef.current = false;

        if (wsRef.current) {
            try {
                wsRef.current.send(JSON.stringify({ type: 'end' }));
                wsRef.current.close();
            } catch (e) {}
            wsRef.current = null;
        }

        setConnectionState('idle');
    }, [stopPlaybackMonitor]);

    const handlePress = useCallback(() => {
        switch (connectionState) {
            case 'idle':
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
                                <Ionicons name="stop" size={48} color="#fff" />
                            ) : connectionState === 'ready' ? (
                                <Ionicons name="mic" size={48} color="#fff" />
                            ) : (
                                <Ionicons name="chatbubble-ellipses" size={48} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Hint */}
                    <Text style={styles.hintText}>
                        {connectionState === 'idle' 
                            ? 'Start a voice conversation with your AI tutor'
                            : connectionState === 'ready'
                                ? 'Ask any question about your studies'
                                : connectionState === 'recording'
                                    ? 'Speak clearly, then tap to send'
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

