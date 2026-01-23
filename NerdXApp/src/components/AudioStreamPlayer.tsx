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
import { checkUrlAccessible, ensureFreshMediaUrl, refreshMediaUrl } from '../services/mediaUrlService';

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
            
            // Log status changes for debugging
            if (status.isPlaying && !isPlaying) {
                console.log('🎵 Audio: Started playing');
            }

            // Handle playback finished
            if (status.didJustFinish) {
                console.log('🎵 Audio: Playback finished');
                setIsPlaying(false);
                setPosition(0);
            }
            
            // Handle errors during playback
            if (status.error) {
                console.error('🎵 Audio playback error in status:', status.error);
                setError('Audio playback error. Please try again.');
                setIsLoading(false);
                setIsPlaying(false);
            }
        } else if (status.error) {
            console.error('🎵 Audio load error:', status.error);
            setError('Unable to stream audio. Please check your internet connection.');
            setIsLoading(false);
        } else {
            // Still loading
            console.log('🎵 Audio: Still loading...', status);
        }
    };

    const resolveAudioUrl = async (): Promise<string | null> => {
        const initialUrl = await ensureFreshMediaUrl(audioUrl);
        const initialOk = await checkUrlAccessible(initialUrl);
        if (initialOk) return initialUrl;

        const refreshedUrl = await refreshMediaUrl(audioUrl);
        const refreshedOk = await checkUrlAccessible(refreshedUrl);
        if (refreshedOk) return refreshedUrl;

        return null;
    };

    const loadAndPlayAudio = async () => {
        try {
            setError(null);
            setIsLoading(true);
            console.log('🎵 Audio: Starting to load audio...');
            const playableUrl = await resolveAudioUrl();
            if (!playableUrl) {
                setError('Audio is unavailable right now. Please try again later.');
                setIsLoading(false);
                return;
            }
            console.log('🎵 Audio URL:', playableUrl.substring(0, 100) + '...');

            // Configure audio mode for streaming
            console.log('🎵 Audio: Setting audio mode...');
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
                console.log('🎵 Audio: Audio mode set successfully');
            } catch (audioModeError) {
                console.warn('🎵 Audio: Audio mode setting failed (non-critical):', audioModeError);
                // Continue anyway - audio might still work
            }

            // Create and load the sound (streaming, not downloading)
            console.log('🎵 Audio: Creating sound object with URL:', playableUrl.substring(0, 100) + '...');
            
            // Clean up any existing sound first
            if (sound) {
                try {
                    await sound.unloadAsync();
                } catch (e) {
                    console.warn('🎵 Audio: Error unloading previous sound:', e);
                }
            }
            
            let newSound: Audio.Sound;
            try {
                // Create sound without shouldPlay first to ensure it loads
                const soundResult = await Audio.Sound.createAsync(
                    { uri: playableUrl },
                    {
                        shouldPlay: false, // Don't auto-play, we'll start it manually
                        progressUpdateIntervalMillis: 500,
                        volume: 1.0,
                        isMuted: false,
                        rate: 1.0,
                    },
                    onPlaybackStatusUpdate
                );
                newSound = soundResult.sound;
                console.log('🎵 Audio: Sound created successfully!');
            } catch (createError: any) {
                console.error('🎵 Audio: Failed to create sound:', createError);
                throw new Error(`Failed to load audio: ${createError?.message || 'Unknown error'}`);
            }
            
            // Wait a bit for the sound to initialize
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Check status and start playing
            try {
                const status = await newSound.getStatusAsync();
                console.log('🎵 Audio: Initial status:', {
                    isLoaded: status.isLoaded,
                    error: status.error,
                    durationMillis: status.isLoaded ? status.durationMillis : null,
                });
                
                if (status.isLoaded) {
                    // Sound is ready, start playing
                    console.log('🎵 Audio: Starting playback...');
                    await newSound.playAsync();
                    
                    // Verify it started playing
                    const playStatus = await newSound.getStatusAsync();
                    if (playStatus.isLoaded && playStatus.isPlaying) {
                        console.log('🎵 Audio: Playback started successfully!');
                    } else {
                        console.warn('🎵 Audio: Playback may not have started, status:', playStatus);
                    }
                } else if (status.error) {
                    throw new Error(`Audio load error: ${status.error}`);
                } else {
                    // Wait a bit more and try again
                    console.log('🎵 Audio: Sound not loaded yet, waiting...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const retryStatus = await newSound.getStatusAsync();
                    if (retryStatus.isLoaded) {
                        await newSound.playAsync();
                        console.log('🎵 Audio: Playback started after retry!');
                    } else {
                        throw new Error('Audio failed to load after waiting');
                    }
                }
            } catch (playError: any) {
                console.error('🎵 Audio: Error starting playback:', playError);
                try {
                    await newSound.unloadAsync();
                } catch (e) {
                    // Ignore unload errors
                }
                throw playError;
            }

            setSound(newSound);
            setIsLoading(false);
        } catch (err: any) {
            console.error('🎵 Audio playback error:', err);
            console.error('🎵 Error name:', err?.name);
            console.error('🎵 Error message:', err?.message);
            console.error('🎵 Error stack:', err?.stack);
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
