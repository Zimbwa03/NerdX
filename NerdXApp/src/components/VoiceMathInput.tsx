/**
 * VoiceMathInput Component
 * Records voice and converts spoken math to formatted text
 * Example: "2x squared plus 3" → "2x² + 3"
 */

import React, { useState, useRef } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import api from '../services/api/config';

type VoiceInputMode = 'math' | 'general';

interface VoiceMathInputProps {
    /**
     * Called with the transcribed text (already formatted for math when mode==="math")
     */
    onTranscription: (text: string) => void;
    /**
     * When true, disables tap/recording
     */
    disabled?: boolean;
    /**
     * Selects the backend pipeline.
     * math   -> /api/mobile/math/voice-to-text (Whisper + math formatting)
     * general-> /api/mobile/voice/transcribe (generic Wispr Flow STT)
     */
    mode?: VoiceInputMode;
}

const VoiceMathInput: React.FC<VoiceMathInputProps> = ({
    onTranscription,
    disabled = false,
    mode = 'math',
}) => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseAnimRef = useRef<Animated.CompositeAnimation | null>(null);

    // Start pulse animation when recording
    const startPulseAnimation = () => {
        pulseAnimRef.current = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.3,
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
        pulseAnimRef.current.start();
    };

    const stopPulseAnimation = () => {
        if (pulseAnimRef.current) {
            pulseAnimRef.current.stop();
        }
        pulseAnim.setValue(1);
    };

    const startRecording = async () => {
        try {
            // Request permissions
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Please grant microphone permission to use voice input.');
                return;
            }

            // Set audio mode for recording
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Start recording
            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
            setIsRecording(true);
            startPulseAnimation();

        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            stopPulseAnimation();
            setIsRecording(false);
            setIsProcessing(true);

            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            if (uri) {
                await processAudio(uri);
            }

        } catch (error) {
            console.error('Failed to stop recording:', error);
            Alert.alert('Error', 'Failed to process recording. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const processAudio = async (uri: string) => {
        try {
            // Create FormData with audio file
            const formData = new FormData();
            formData.append('audio', {
                uri: uri,
                type: 'audio/wav',
                name: 'voice_input.wav',
            } as any);

            // Send to backend for processing.
            // - math mode: specialized math formatter (Whisper + math conversions)
            // - general mode: lightweight Wispr Flow speech-to-text pipeline
            const endpoint = mode === 'math'
                ? '/api/mobile/math/voice-to-text'
                : '/api/mobile/voice/transcribe';

            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 second timeout for processing
            });

            if (mode === 'math') {
                if (response.data.success && response.data.data?.text) {
                    onTranscription(response.data.data.text);
                    return;
                }
                Alert.alert('Error', response.data.message || 'Failed to transcribe audio');
                return;
            }

            // General/Wispr flow response shape { status: 'success', text: '...' }
            const generalText = response.data.text || response.data.data?.text;
            const isOk = response.data.status === 'success' || response.data.success;
            if (isOk && generalText) {
                onTranscription(generalText);
                return;
            }

            Alert.alert('Error', response.data.message || 'Failed to transcribe audio');

        } catch (error: any) {
            console.error('Voice processing error:', error);
            Alert.alert(
                'Processing Failed',
                'Could not convert your voice to text. Please try again or type manually.'
            );
        }
    };

    const handlePress = async () => {
        if (disabled || isProcessing) return;

        if (isRecording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: isRecording
                            ? Colors.error.main
                            : isDarkMode
                                ? themedColors.primary.main
                                : Colors.primary.main,
                    },
                    disabled && styles.buttonDisabled,
                ]}
                onPress={handlePress}
                disabled={disabled || isProcessing}
                activeOpacity={0.7}
            >
                {isProcessing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Ionicons
                        name={isRecording ? 'stop' : 'mic'}
                        size={24}
                        color="#FFFFFF"
                    />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});

export default VoiceMathInput;
