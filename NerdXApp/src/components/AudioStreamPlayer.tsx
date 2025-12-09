// Audio Stream Player Component - Streaming-only audio player for topic podcasts
// Uses expo-av for audio playback without download capability
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

interface AudioStreamPlayerProps {
    audioUrl: string;
    topicTitle: string;
    accentColor?: string;
}

const AudioStreamPlayer: React.FC<AudioStreamPlayerProps> = ({
    audioUrl,
    topicTitle,
    accentColor = '#4CAF50',
}) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // Pulse animation for playing state
    useEffect(() => {
        if (isPlaying) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isPlaying]);

    const formatTime = (millis: number): string => {
        if (!millis || isNaN(millis)) return '0:00';
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying);
            setIsBuffering(status.isBuffering);

            // Handle playback finished
            if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
            }
        } else if (status.error) {
            setError('Unable to stream audio. Please check your internet connection.');
            setIsLoading(false);
        }
    };

    const loadAndPlayAudio = async () => {
        try {
            setError(null);
            setIsLoading(true);

            // Configure audio mode for streaming
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            // Create and load the sound (streaming, not downloading)
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                {
                    shouldPlay: true,
                    progressUpdateIntervalMillis: 500,
                    // Prevent caching/downloading - stream only
                    androidImplementation: 'MediaPlayer',
                },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setIsLoading(false);
        } catch (err) {
            console.error('Audio playback error:', err);
            setError('Unable to stream audio. Please check your internet connection.');
            setIsLoading(false);
        }
    };

    const togglePlayPause = async () => {
        if (!sound) {
            // First time playing - load and play
            await loadAndPlayAudio();
        } else if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
    };

    const handleSeek = async (value: number) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    const handleRewind = async () => {
        if (sound) {
            const newPosition = Math.max(0, position - 10000);
            await sound.setPositionAsync(newPosition);
        }
    };

    const handleForward = async () => {
        if (sound && duration > 0) {
            const newPosition = Math.min(duration, position + 10000);
            await sound.setPositionAsync(newPosition);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[`${accentColor}20`, `${accentColor}05`]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: accentColor, transform: [{ scale: pulseAnim }] }
                            ]}
                        >
                            <Ionicons name="headset" size={20} color="#FFF" />
                        </Animated.View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.label}>Audio Notes</Text>
                            <Text style={styles.title} numberOfLines={1}>
                                {topicTitle} Podcast
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.streamBadge, { backgroundColor: `${accentColor}30` }]}>
                        <View style={[styles.liveDot, { backgroundColor: accentColor }]} />
                        <Text style={[styles.streamText, { color: accentColor }]}>STREAM</Text>
                    </View>
                </View>

                {/* Error State */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="cloud-offline-outline" size={24} color="#EF5350" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: accentColor }]}
                            onPress={loadAndPlayAudio}
                        >
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Player Controls */}
                {!error && (
                    <View style={styles.playerContainer}>
                        {/* Control Buttons */}
                        <View style={styles.controls}>
                            <TouchableOpacity
                                onPress={handleRewind}
                                style={styles.secondaryButton}
                                disabled={!sound}
                            >
                                <Ionicons
                                    name="play-back"
                                    size={24}
                                    color={sound ? '#666' : '#CCC'}
                                />
                                <Text style={[styles.skipText, { color: sound ? '#666' : '#CCC' }]}>10</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={togglePlayPause}
                                style={[styles.playButton, { backgroundColor: accentColor }]}
                                disabled={isLoading}
                            >
                                {isLoading || isBuffering ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Ionicons
                                        name={isPlaying ? 'pause' : 'play'}
                                        size={28}
                                        color="#FFF"
                                        style={isPlaying ? {} : { marginLeft: 3 }}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleForward}
                                style={styles.secondaryButton}
                                disabled={!sound}
                            >
                                <Ionicons
                                    name="play-forward"
                                    size={24}
                                    color={sound ? '#666' : '#CCC'}
                                />
                                <Text style={[styles.skipText, { color: sound ? '#666' : '#CCC' }]}>10</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <Text style={styles.timeText}>{formatTime(position)}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={duration || 1}
                                value={position}
                                onSlidingComplete={handleSeek}
                                minimumTrackTintColor={accentColor}
                                maximumTrackTintColor="#E0E0E0"
                                thumbTintColor={accentColor}
                                disabled={!sound}
                            />
                            <Text style={styles.timeText}>{formatTime(duration)}</Text>
                        </View>

                        {/* Info Text */}
                        <Text style={styles.infoText}>
                            <Ionicons name="wifi" size={12} color="#999" /> Requires internet connection
                        </Text>
                    </View>
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    gradient: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginLeft: 12,
        flex: 1,
    },
    label: {
        fontSize: 11,
        color: '#888',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    streamBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
    streamText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    errorText: {
        color: '#666',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    retryText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 13,
    },
    playerContainer: {
        alignItems: 'center',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    secondaryButton: {
        alignItems: 'center',
        padding: 8,
        marginHorizontal: 12,
    },
    skipText: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    playButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    slider: {
        flex: 1,
        height: 40,
        marginHorizontal: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
        minWidth: 40,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 11,
        color: '#999',
        marginTop: 8,
    },
});

export default AudioStreamPlayer;
