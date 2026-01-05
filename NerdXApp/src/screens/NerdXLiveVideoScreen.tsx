/**
 * NerdXLiveVideoScreen.tsx
 * Real-time video + audio tutoring with Gemini Live API.
 * 
 * Features:
 * - Camera captures what student is writing/showing
 * - AI tutor can SEE and HEAR the student in real-time
 * - Perfect for homework help, math problems, diagrams
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
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// WebSocket server URL
const WS_URL = 'wss://nerdx-voice.onrender.com/ws/nerdx-live-video';

// Frame capture settings
const FRAME_INTERVAL_MS = 500; // Capture frame every 500ms (2 FPS for efficiency)
const FRAME_QUALITY = 0.5; // JPEG quality (0.1 - 1.0)
const FRAME_WIDTH = 640; // Resize frame width

// Jitter buffer settings
const MIN_BUFFER_CHUNKS = 2;
const PLAYBACK_CHECK_INTERVAL = 50;

type ConnectionState = 'idle' | 'connecting' | 'ready' | 'active' | 'error';

const NerdXLiveVideoScreen: React.FC = () => {
    const navigation = useNavigation();
    
    // State
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isFrontCamera, setIsFrontCamera] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Tap to start');
    
    // Refs
    const cameraRef = useRef<CameraView>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);
    const hasStartedPlaybackRef = useRef(false);
    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Request permissions on mount
    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: audioStatus } = await Audio.requestPermissionsAsync();
            setHasPermission(cameraStatus === 'granted' && audioStatus === 'granted');
        })();
        
        return () => {
            endSession();
        };
    }, []);

    // Configure audio for playback
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

    // ===== AUDIO PLAYBACK WITH JITTER BUFFER =====
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

            // Ensure playback mode
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
            console.error('Audio playback error:', error);
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

    // ===== VIDEO FRAME CAPTURE =====
    const captureAndSendFrame = useCallback(async () => {
        if (!cameraRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        try {
            // Capture photo as base64
            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: FRAME_QUALITY,
                skipProcessing: true,
            });

            if (photo?.base64 && wsRef.current?.readyState === WebSocket.OPEN) {
                // Send video frame to server
                wsRef.current.send(JSON.stringify({
                    type: 'video',
                    data: photo.base64,
                    mimeType: 'image/jpeg',
                }));
                console.log('📹 Frame sent');
            }
        } catch (error) {
            // Silently handle frame capture errors (camera might be busy)
            console.debug('Frame capture skipped');
        }
    }, []);

    const startFrameCapture = useCallback(() => {
        if (frameIntervalRef.current) return;
        
        frameIntervalRef.current = setInterval(() => {
            captureAndSendFrame();
        }, FRAME_INTERVAL_MS);
        
        console.log('📹 Frame capture started');
    }, [captureAndSendFrame]);

    const stopFrameCapture = useCallback(() => {
        if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
        }
        console.log('📹 Frame capture stopped');
    }, []);

    // ===== AUDIO RECORDING =====
    const startAudioRecording = useCallback(async () => {
        try {
            if (recordingRef.current) {
                try {
                    await recordingRef.current.stopAndUnloadAsync();
                } catch (e) {}
                recordingRef.current = null;
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
            setIsRecording(true);
            console.log('🎙️ Audio recording started');
        } catch (error) {
            console.error('Recording error:', error);
        }
    }, [configureAudioMode]);

    const stopAndSendAudio = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            const uri = recordingRef.current.getURI();
            
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (e: any) {
                if (!e?.message?.includes('already been unloaded')) {
                    console.warn('Stop recording warning:', e);
                }
            }
            recordingRef.current = null;
            setIsRecording(false);

            if (uri && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
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
                        console.log('🎤 Audio sent');
                    }
                };
                reader.readAsDataURL(blob);
            }
        } catch (error) {
            console.error('Stop recording error:', error);
        }
    }, []);

    // ===== WEBSOCKET HANDLING =====
    const handleWebSocketMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'ready':
                    console.log('🎧 NerdX Live Video ready');
                    setConnectionState('ready');
                    setStatusMessage('Ready! Show me what you\'re working on');
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
                    console.log('✅ AI turn complete');
                    hasStartedPlaybackRef.current = false;
                    setStatusMessage('Your turn - tap to speak');
                    break;

                case 'interrupted':
                    audioQueueRef.current = [];
                    hasStartedPlaybackRef.current = false;
                    if (soundRef.current) {
                        soundRef.current.stopAsync().catch(() => {});
                    }
                    break;

                case 'error':
                    console.error('❌ Server error:', data.message);
                    Alert.alert('Connection Error', data.message);
                    endSession();
                    break;
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    }, [playNextAudio, startPlaybackMonitor, configureAudioMode]);

    // ===== SESSION MANAGEMENT =====
    const startSession = useCallback(async () => {
        if (connectionState !== 'idle') return;

        setConnectionState('connecting');
        setStatusMessage('Connecting to NerdX...');

        try {
            // Reset state
            audioQueueRef.current = [];
            isPlayingRef.current = false;
            hasStartedPlaybackRef.current = false;

            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('🔗 WebSocket connected');
                setStatusMessage('Connected! Starting video...');
                // Start frame capture
                startFrameCapture();
            };

            ws.onmessage = handleWebSocketMessage;

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionState('error');
                setStatusMessage('Connection failed');
                Alert.alert('Connection Error', 'Could not connect to NerdX Live.');
            };

            ws.onclose = () => {
                console.log('📴 WebSocket closed');
                if (connectionState !== 'idle') {
                    endSession();
                }
            };

            setConnectionState('active');
        } catch (error) {
            console.error('Session start error:', error);
            setConnectionState('error');
            setStatusMessage('Failed to start');
        }
    }, [connectionState, handleWebSocketMessage, startFrameCapture]);

    const endSession = useCallback(async () => {
        stopFrameCapture();
        stopPlaybackMonitor();

        if (recordingRef.current) {
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (e) {}
            recordingRef.current = null;
        }
        setIsRecording(false);

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
        setStatusMessage('Tap to start');
    }, [stopFrameCapture, stopPlaybackMonitor]);

    // ===== UI HANDLERS =====
    const handleMicPress = useCallback(async () => {
        if (connectionState === 'idle') {
            startSession();
            return;
        }

        if (connectionState !== 'ready' && connectionState !== 'active') {
            return;
        }

        if (isRecording) {
            // Stop recording and send
            await stopAndSendAudio();
            setStatusMessage('AI is thinking...');
        } else {
            // Start recording
            await startAudioRecording();
            setStatusMessage('Recording... tap to send');
        }
    }, [connectionState, isRecording, startSession, startAudioRecording, stopAndSendAudio]);

    const toggleCamera = useCallback(() => {
        setIsFrontCamera((prev) => !prev);
    }, []);

    // ===== PERMISSION HANDLING =====
    if (hasPermission === null) {
        return (
            <View style={styles.centered}>
                <Text style={styles.permissionText}>Requesting permissions...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.centered}>
                <Ionicons name="camera-outline" size={64} color="#666" />
                <Text style={styles.permissionText}>Camera & microphone access required</Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.permissionButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Camera View */}
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={isFrontCamera ? 'front' : 'back'}
            >
                {/* Gradient overlay at top */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                    style={styles.topGradient}
                />

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
                    
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>NerdX Live</Text>
                        <View style={[
                            styles.statusDot,
                            connectionState === 'active' || connectionState === 'ready' 
                                ? styles.statusDotActive 
                                : styles.statusDotInactive
                        ]} />
                    </View>

                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={toggleCamera}
                    >
                        <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Instructions overlay */}
                <View style={styles.instructionsContainer}>
                    <View style={styles.instructionBox}>
                        <Ionicons name="eye-outline" size={20} color="#fff" />
                        <Text style={styles.instructionText}>
                            Point camera at your work
                        </Text>
                    </View>
                </View>

                {/* Gradient overlay at bottom */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.bottomGradient}
                />

                {/* Bottom controls */}
                <View style={styles.bottomControls}>
                    {/* Status message */}
                    <Text style={styles.statusMessage}>{statusMessage}</Text>

                    {/* Control buttons */}
                    <View style={styles.controlsRow}>
                        {/* End call button */}
                        <TouchableOpacity
                            style={styles.endButton}
                            onPress={() => {
                                endSession();
                                navigation.goBack();
                            }}
                        >
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>

                        {/* Main mic button */}
                        <TouchableOpacity
                            style={[
                                styles.micButton,
                                isRecording && styles.micButtonRecording,
                                connectionState === 'connecting' && styles.micButtonConnecting,
                            ]}
                            onPress={handleMicPress}
                            activeOpacity={0.8}
                        >
                            {connectionState === 'connecting' ? (
                                <Ionicons name="sync" size={32} color="#fff" />
                            ) : isRecording ? (
                                <Ionicons name="stop" size={32} color="#fff" />
                            ) : connectionState === 'idle' ? (
                                <Ionicons name="play" size={32} color="#fff" />
                            ) : (
                                <Ionicons name="mic" size={32} color="#fff" />
                            )}
                        </TouchableOpacity>

                        {/* Placeholder for symmetry */}
                        <View style={styles.placeholderButton} />
                    </View>

                    {/* Hint text */}
                    <Text style={styles.hintText}>
                        {connectionState === 'idle' 
                            ? 'Tap to start video tutoring'
                            : isRecording 
                                ? 'Tap to send your question'
                                : 'Tap mic to ask a question'}
                    </Text>
                </View>
            </CameraView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 20,
    },
    permissionText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    permissionButton: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#6C63FF',
        borderRadius: 24,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    camera: {
        flex: 1,
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
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
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    statusDotActive: {
        backgroundColor: '#4CAF50',
    },
    statusDotInactive: {
        backgroundColor: '#666',
    },
    flipButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionsContainer: {
        position: 'absolute',
        top: '30%',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    instructionText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 8,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    statusMessage: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    endButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30,
    },
    micButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    micButtonRecording: {
        backgroundColor: '#F44336',
    },
    micButtonConnecting: {
        backgroundColor: '#FF9800',
    },
    placeholderButton: {
        width: 56,
        height: 56,
        marginLeft: 30,
    },
    hintText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 16,
        textAlign: 'center',
    },
});

export default NerdXLiveVideoScreen;

