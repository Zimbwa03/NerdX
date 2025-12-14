/**
 * NerdXLiveButton.tsx
 * A floating action button for real-time voice AI tutoring.
 * Uses Gemini Multimodal Live API via WebSocket for voice-to-voice interaction.
 * 
 * SIMPLIFIED VERSION: No animations, just basic functionality.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const BUTTON_SIZE = 60;

// WebSocket server URL - Render production deployment
// Using Render URL for both dev and production since voice agent is hosted there
const WS_URL = 'wss://nerdx-voice.onrender.com/ws/nerdx-live';

// Connection states for tap-to-talk mode
// idle -> connecting -> ready -> recording -> processing -> ready
type ConnectionState = 'idle' | 'connecting' | 'ready' | 'recording' | 'processing' | 'error';

interface NerdXLiveButtonProps {
    serverUrl?: string;
    onSessionStart?: () => void;
    onSessionEnd?: () => void;
}

export const NerdXLiveButton: React.FC<NerdXLiveButtonProps> = ({
    serverUrl = WS_URL,
    onSessionStart,
    onSessionEnd,
}) => {
    // State
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');

    // Refs
    const wsRef = useRef<WebSocket | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);

    // Audio playback queue
    const playNextAudio = useCallback(async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) {
            return;
        }

        isPlayingRef.current = true;
        const audioData = audioQueueRef.current.shift();

        if (!audioData) {
            isPlayingRef.current = false;
            return;
        }

        try {
            // Backend now sends WAV audio (converted from PCM)
            const audioUri = `data:audio/wav;base64,${audioData}`;

            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true }
            );
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    isPlayingRef.current = false;
                    playNextAudio();
                }
            });
        } catch (error) {
            console.error('Error playing audio:', error);
            isPlayingRef.current = false;
            playNextAudio();
        }
    }, []);

    // Start recording (called when user taps to speak)
    const startRecording = useCallback(async () => {
        try {
            // Clean up any existing recording first
            if (recordingRef.current) {
                try {
                    await recordingRef.current.stopAndUnloadAsync();
                } catch (e) {
                    // Ignore cleanup errors
                }
                recordingRef.current = null;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

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
            console.log('🎙️ Recording started - tap again to send');
        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Microphone Error', 'Could not access microphone. Please try again.');
        }
    }, []);

    // Stop recording and send audio (called when user taps again)
    const stopRecordingAndSend = useCallback(async () => {
        if (!recordingRef.current) return;

        try {
            const uri = recordingRef.current.getURI();

            // Stop recording
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (e: any) {
                if (!e?.message?.includes('already been unloaded')) {
                    console.warn('Stop recording warning:', e);
                }
            }
            recordingRef.current = null;

            console.log('🎤 Recording stopped:', uri);
            setConnectionState('processing');

            // Send audio to server
            if (uri && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                try {
                    const response = await fetch(uri);
                    const blob = await response.blob();

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result as string;
                        const base64 = base64data.split(',')[1] || base64data;

                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                            console.log('📤 Sending audio to AI, size:', base64.length);
                            wsRef.current.send(JSON.stringify({
                                type: 'audio',
                                data: base64,
                            }));
                        }
                    };
                    reader.onerror = () => {
                        console.error('Error reading audio file');
                        setConnectionState('ready');
                    };
                    reader.readAsDataURL(blob);
                } catch (fetchError) {
                    console.error('Error sending audio:', fetchError);
                    setConnectionState('ready');
                }
            } else {
                setConnectionState('ready');
            }
        } catch (error) {
            console.error('Error in stop recording:', error);
            setConnectionState('ready');
        }
    }, []);

    // Stop recording without sending (for cleanup)
    const stopRecording = useCallback(async () => {
        if (recordingRef.current) {
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (error: any) {
                if (!error?.message?.includes('already been unloaded')) {
                    console.warn('Recording cleanup:', error);
                }
            }
            recordingRef.current = null;
        }
    }, []);

    // End session
    const endSession = useCallback(async () => {
        await stopRecording();

        if (soundRef.current) {
            try {
                await soundRef.current.unloadAsync();
            } catch (e) { }
            soundRef.current = null;
        }

        audioQueueRef.current = [];
        isPlayingRef.current = false;

        if (wsRef.current) {
            try {
                wsRef.current.send(JSON.stringify({ type: 'end' }));
                wsRef.current.close();
            } catch (e) { }
            wsRef.current = null;
        }

        setConnectionState('idle');
        onSessionEnd?.();
    }, [onSessionEnd, stopRecording]);

    // WebSocket message handler
    const handleWebSocketMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'ready':
                    console.log('🎧 NerdX Live ready:', data.message);
                    setConnectionState('ready');
                    console.log('💡 Tap the button to start speaking');
                    break;

                case 'audio':
                    if (data.data) {
                        console.log('🔊 Received AI audio response');
                        audioQueueRef.current.push(data.data);
                        playNextAudio();
                    }
                    break;

                case 'turnComplete':
                    console.log('✅ AI turn complete - tap to speak again');
                    setConnectionState('ready');
                    break;

                case 'interrupted':
                    console.log('🎤 Barge-in detected');
                    audioQueueRef.current = [];
                    break;

                case 'error':
                    console.error('❌ Server error:', data.message);
                    Alert.alert('Connection Error', data.message);
                    endSession();
                    break;
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }, [playNextAudio, endSession]);

    // Connect to server
    const connect = useCallback(async () => {
        if (connectionState !== 'idle') return;

        setConnectionState('connecting');

        try {
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Microphone permission is needed for voice chat.');
                setConnectionState('idle');
                return;
            }

            const ws = new WebSocket(serverUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('🔗 WebSocket connected');
            };

            ws.onmessage = handleWebSocketMessage;

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionState('error');
                Alert.alert('Connection Error', 'Could not connect to NerdX Live server.');
                endSession();
            };

            ws.onclose = () => {
                console.log('📴 WebSocket closed');
                if (connectionState !== 'idle') {
                    endSession();
                }
            };

            onSessionStart?.();
        } catch (error) {
            console.error('Connection error:', error);
            setConnectionState('error');
        }
    }, [connectionState, serverUrl, handleWebSocketMessage, endSession, onSessionStart]);

    // Handle button press - tap-to-talk flow
    const handlePress = useCallback(() => {
        switch (connectionState) {
            case 'idle':
                connect();
                break;
            case 'ready':
                // Start recording when ready
                startRecording();
                break;
            case 'recording':
                // Stop and send when recording
                stopRecordingAndSend();
                break;
            case 'processing':
                // Do nothing while processing - wait for AI
                console.log('⏳ Waiting for AI response...');
                break;
            case 'connecting':
            case 'error':
                // Cancel/reset
                endSession();
                break;
        }
    }, [connectionState, connect, startRecording, stopRecordingAndSend, endSession]);

    // Get button icon based on state
    const getIcon = () => {
        switch (connectionState) {
            case 'connecting':
            case 'processing':
                return <Ionicons name="sync" size={28} color="#fff" />;
            case 'ready':
                return <Ionicons name="mic-outline" size={28} color="#fff" />;
            case 'recording':
                return <Ionicons name="stop" size={28} color="#fff" />;
            case 'error':
                return <Ionicons name="alert-circle" size={28} color="#fff" />;
            default:
                return <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />;
        }
    };

    // Get button color based on state
    const getButtonColor = () => {
        switch (connectionState) {
            case 'connecting':
            case 'processing':
                return '#FF9800'; // Orange - waiting
            case 'ready':
                return '#4CAF50'; // Green - ready to record
            case 'recording':
                return '#F44336'; // Red - recording
            case 'error':
                return '#9E9E9E'; // Grey - error
            default:
                return '#6C63FF'; // Purple - idle
        }
    };

    // Get status label
    const getStatusLabel = () => {
        switch (connectionState) {
            case 'connecting':
                return 'Connecting...';
            case 'ready':
                return 'Tap to speak';
            case 'recording':
                return 'Recording... tap to send';
            case 'processing':
                return 'AI thinking...';
            case 'error':
                return 'Error';
            default:
                return '';
        }
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            <TouchableOpacity
                style={[styles.button, { backgroundColor: getButtonColor() }]}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                {getIcon()}
            </TouchableOpacity>

            {/* Status label */}
            {connectionState !== 'idle' && (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>
                        {getStatusLabel()}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        zIndex: 1000,
        elevation: 1000,
        alignItems: 'center',
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    labelContainer: {
        marginTop: 4,
        alignItems: 'center',
    },
    labelText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default NerdXLiveButton;
