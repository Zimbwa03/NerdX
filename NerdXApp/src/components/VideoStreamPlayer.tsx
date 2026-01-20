// Video Stream Player Component - Advanced streaming video player for topic video lessons
// Uses expo-video for video playback with fullscreen, minimize, and advanced controls
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Platform,
    Modal,
    StatusBar,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import { checkUrlAccessible, ensureFreshMediaUrl, refreshMediaUrl } from '../services/mediaUrlService';

interface VideoStreamPlayerProps {
    videoUrl: string;
    topicTitle: string;
    accentColor?: string;
}

const VideoStreamPlayer: React.FC<VideoStreamPlayerProps> = ({
    videoUrl,
    topicTitle,
    accentColor = '#2196F3',
}) => {
    const videoViewRef = useRef<any>(null);

    // Create video player using the hook
    const player = useVideoPlayer(videoUrl, (p) => {
        p.loop = false;
        p.muted = false;
    });

    // Subscribe to player events
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    const { status } = useEvent(player, 'statusChange', { status: player.status });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [isMuted, setIsMuted] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [resolvedUrl, setResolvedUrl] = useState(videoUrl);

    const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const resolveVideoUrl = useCallback(async (): Promise<string | null> => {
        const initialUrl = await ensureFreshMediaUrl(videoUrl);
        const initialOk = await checkUrlAccessible(initialUrl);
        if (initialOk) return initialUrl;

        const refreshedUrl = await refreshMediaUrl(videoUrl);
        const refreshedOk = await checkUrlAccessible(refreshedUrl);
        if (refreshedOk) return refreshedUrl;

        return null;
    }, [videoUrl]);

    // Update loading and error states based on player status
    useEffect(() => {
        if (status === 'readyToPlay') {
            setIsLoading(false);
            setError(null);
            setDuration(player.duration * 1000); // Convert to milliseconds
        } else if (status === 'loading') {
            setIsLoading(true);
        } else if (status === 'error') {
            setError('Video could not be loaded. Please check your internet connection and try again.');
            setIsLoading(false);
        }
    }, [status, player.duration]);

    // Resolve and replace URL when input changes
    useEffect(() => {
        let active = true;

        const refreshUrl = async () => {
            setIsLoading(true);
            const playableUrl = await resolveVideoUrl();
            if (!active) return;
            if (!playableUrl) {
                setError('Video could not be loaded. Please check your connection or try again.');
                setIsLoading(false);
                return;
            }
            setResolvedUrl(playableUrl);
            player.replace(playableUrl);
        };

        refreshUrl();
        return () => {
            active = false;
        };
    }, [resolveVideoUrl, player]);

    // Update position periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (player && isPlaying) {
                setPosition(player.currentTime * 1000); // Convert to milliseconds
            }
        }, 500);
        return () => clearInterval(interval);
    }, [player, isPlaying]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
            // Reset orientation to portrait when leaving
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => { });
        };
    }, []);

    // Pulse animation for playing state
    useEffect(() => {
        if (isPlaying && !isMinimized) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isPlaying, isMinimized]);

    // Auto-hide controls after 3 seconds
    const resetControlsTimer = useCallback(() => {
        if (controlsTimeout.current) {
            clearTimeout(controlsTimeout.current);
        }
        setShowControls(true);
        if (isPlaying) {
            controlsTimeout.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    }, [isPlaying]);

    const formatTime = (millis: number): string => {
        if (!millis || isNaN(millis)) return '0:00';
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else {
            // If video finished, replay from start
            if (player.currentTime >= player.duration - 0.1) {
                player.replay();
            } else {
                player.play();
            }
        }
        resetControlsTimer();
    };

    const handleSeek = (value: number) => {
        const seconds = value / 1000;
        player.seekBy(seconds - player.currentTime);
        setPosition(value);
    };

    const handleRewind = () => {
        player.seekBy(-10);
        setPosition(Math.max(0, player.currentTime * 1000 - 10000));
        resetControlsTimer();
    };

    const handleForward = () => {
        player.seekBy(10);
        setPosition(Math.min(duration, player.currentTime * 1000 + 10000));
        resetControlsTimer();
    };

    const handleFullscreen = async () => {
        try {
            if (isFullscreen) {
                // Exit fullscreen - lock to portrait
                if (videoViewRef.current) {
                    videoViewRef.current.exitFullscreen();
                }
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                setIsFullscreen(false);
            } else {
                // Enter fullscreen
                if (videoViewRef.current) {
                    videoViewRef.current.enterFullscreen();
                }
                await ScreenOrientation.unlockAsync();
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                setIsFullscreen(true);
            }
        } catch (err) {
            console.warn('Screen orientation error:', err);
            setIsFullscreen(!isFullscreen);
        }
        resetControlsTimer();
    };

    const handleMinimize = () => {
        if (isFullscreen) {
            handleFullscreen();
        }
        setIsMinimized(!isMinimized);
    };

    const handleMute = () => {
        player.muted = !isMuted;
        setIsMuted(!isMuted);
        resetControlsTimer();
    };

    const handleSpeedChange = () => {
        const speeds = [0.5, 1.0, 1.5, 2.0];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];

        player.playbackRate = newSpeed;
        setPlaybackSpeed(newSpeed);
        resetControlsTimer();
    };

    const handleRetry = async () => {
        setError(null);
        setIsLoading(true);
        const playableUrl = await resolveVideoUrl();
        if (!playableUrl) {
            setError('Video could not be loaded. Please check your connection or try again.');
            setIsLoading(false);
            return;
        }
        setResolvedUrl(playableUrl);
        player.replace(playableUrl);
    };

    const handleVideoPress = () => {
        resetControlsTimer();
    };

    // Minimized floating player (fixed position bottom-right)
    if (isMinimized) {
        return (
            <View
                style={[
                    styles.minimizedContainer,
                    {
                        right: 16,
                        bottom: 100,
                    },
                ]}
            >
                <VideoView
                    ref={videoViewRef}
                    player={player}
                    style={styles.minimizedVideo}
                    contentFit="cover"
                    nativeControls={false}
                />
                <View style={styles.minimizedOverlay}>
                    <TouchableOpacity onPress={handlePlayPause} style={styles.minimizedPlayButton}>
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play'}
                            size={20}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMinimize} style={styles.minimizedCloseButton}>
                        <Ionicons name="expand" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Normal inline player
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
                            <Ionicons name="videocam" size={20} color="#FFF" />
                        </Animated.View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.label}>Video Lesson</Text>
                            <Text style={styles.title} numberOfLines={1}>
                                {topicTitle}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleMinimize} style={styles.headerButton}>
                            <Ionicons name="remove" size={18} color={accentColor} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFullscreen} style={styles.headerButton}>
                            <Ionicons name="expand" size={18} color={accentColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Video Container */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.videoWrapper}
                    onPress={handleVideoPress}
                >
                    <VideoView
                        ref={videoViewRef}
                        player={player}
                        style={styles.video}
                        contentFit="contain"
                        nativeControls={false}
                        allowsFullscreen
                        onFullscreenEnter={() => setIsFullscreen(true)}
                        onFullscreenExit={() => setIsFullscreen(false)}
                    />

                    {/* Loading Overlay */}
                    {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={accentColor} />
                            <Text style={styles.loadingText}>Loading video...</Text>
                        </View>
                    )}

                    {/* Error State */}
                    {error && (
                        <View style={styles.errorOverlay}>
                            <Ionicons name="cloud-offline-outline" size={32} color="#EF5350" />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={[styles.retryButton, { backgroundColor: accentColor }]}
                                onPress={handleRetry}
                            >
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Play/Pause overlay */}
                    {!isLoading && !error && showControls && (
                        <TouchableOpacity
                            style={styles.playOverlay}
                            onPress={handlePlayPause}
                        >
                            <View style={[styles.playButtonLarge, { backgroundColor: `${accentColor}CC` }]}>
                                <Ionicons
                                    name={isPlaying ? 'pause' : 'play'}
                                    size={36}
                                    color="#FFF"
                                    style={isPlaying ? {} : { marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                {/* Controls */}
                {!error && (
                    <View style={styles.controlsContainer}>
                        {/* Control Buttons */}
                        <View style={styles.controls}>
                            <TouchableOpacity onPress={handleMute} style={styles.controlButton}>
                                <Ionicons
                                    name={isMuted ? 'volume-mute' : 'volume-high'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleRewind} style={styles.controlButton}>
                                <Ionicons name="play-back" size={22} color="#666" />
                                <Text style={styles.skipText}>10</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handlePlayPause}
                                style={[styles.playButton, { backgroundColor: accentColor }]}
                            >
                                {status === 'loading' ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Ionicons
                                        name={isPlaying ? 'pause' : 'play'}
                                        size={24}
                                        color="#FFF"
                                        style={isPlaying ? {} : { marginLeft: 2 }}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleForward} style={styles.controlButton}>
                                <Ionicons name="play-forward" size={22} color="#666" />
                                <Text style={styles.skipText}>10</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleSpeedChange} style={styles.speedBadge}>
                                <Text style={[styles.speedBadgeText, { color: accentColor }]}>{playbackSpeed}x</Text>
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
                            />
                            <Text style={styles.timeText}>{formatTime(duration)}</Text>
                        </View>

                        {/* Info Text */}
                        <Text style={styles.infoText}>
                            <Ionicons name="wifi" size={11} color="#999" /> Requires internet connection
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
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
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
        marginBottom: 12,
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
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    headerButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoWrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFF',
        marginTop: 12,
        fontSize: 14,
    },
    errorOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FFF',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 16,
        fontSize: 14,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonLarge: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsContainer: {
        marginTop: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    controlButton: {
        alignItems: 'center',
        padding: 8,
        marginHorizontal: 8,
    },
    skipText: {
        fontSize: 9,
        fontWeight: '600',
        color: '#666',
        marginTop: 1,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    speedBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.8)',
        marginLeft: 8,
    },
    speedBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
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
        textAlign: 'center',
        marginTop: 4,
    },
    // Minimized player styles
    minimizedContainer: {
        position: 'absolute',
        width: 160,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 1000,
    },
    minimizedVideo: {
        width: '100%',
        height: '100%',
    },
    minimizedOverlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    minimizedPlayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    minimizedCloseButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VideoStreamPlayer;
