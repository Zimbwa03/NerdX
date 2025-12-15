// Video Stream Player Component - Advanced streaming video player for topic video lessons
// Uses expo-av for video playback with fullscreen, minimize, and advanced controls
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
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
// Note: expo-screen-orientation can be added for orientation lock support

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
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [isMuted, setIsMuted] = useState(false);

    const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Derived state from playback status
    const isPlaying = status?.isLoaded ? status.isPlaying : false;
    const isBuffering = status?.isLoaded ? status.isBuffering : false;
    const duration = status?.isLoaded ? (status.durationMillis || 0) : 0;
    const position = status?.isLoaded ? (status.positionMillis || 0) : 0;



    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
            // Unload video to free memory
            if (videoRef.current) {
                videoRef.current.unloadAsync().catch(() => { });
            }
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

    const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
        setStatus(playbackStatus);
        if (playbackStatus.isLoaded) {
            setIsLoading(false);
            setError(null);

            // Handle video finished - allow replay
            if (playbackStatus.didJustFinish) {
                setShowControls(true);
            }
        } else if ('error' in playbackStatus && playbackStatus.error) {
            setError('Video could not be loaded. Please check your internet connection and try again.');
            setIsLoading(false);
        }
    };

    const handlePlayPause = async () => {
        if (!videoRef.current) return;

        try {
            if (isPlaying) {
                await videoRef.current.pauseAsync();
            } else {
                // If video finished, replay from start
                if (status?.isLoaded && status.positionMillis === status.durationMillis) {
                    await videoRef.current.setPositionAsync(0);
                }
                await videoRef.current.playAsync();
            }
        } catch (err) {
            console.warn('Video playback error:', err);
        }
        resetControlsTimer();
    };

    const handleSeek = async (value: number) => {
        if (videoRef.current) {
            await videoRef.current.setPositionAsync(value);
        }
    };

    const handleRewind = async () => {
        if (videoRef.current && status?.isLoaded) {
            const newPosition = Math.max(0, position - 10000);
            await videoRef.current.setPositionAsync(newPosition);
        }
        resetControlsTimer();
    };

    const handleForward = async () => {
        if (videoRef.current && status?.isLoaded && duration > 0) {
            const newPosition = Math.min(duration, position + 10000);
            await videoRef.current.setPositionAsync(newPosition);
        }
        resetControlsTimer();
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        resetControlsTimer();
    };

    const handleMinimize = () => {
        if (isFullscreen) {
            handleFullscreen();
        }
        setIsMinimized(!isMinimized);
    };

    const handleMute = async () => {
        if (videoRef.current) {
            await videoRef.current.setIsMutedAsync(!isMuted);
            setIsMuted(!isMuted);
        }
        resetControlsTimer();
    };

    const handleSpeedChange = async () => {
        const speeds = [0.5, 1.0, 1.5, 2.0];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];

        if (videoRef.current) {
            await videoRef.current.setRateAsync(newSpeed, true);
            setPlaybackSpeed(newSpeed);
        }
        resetControlsTimer();
    };

    const handleRetry = async () => {
        setError(null);
        setIsLoading(true);
        try {
            if (videoRef.current) {
                await videoRef.current.unloadAsync();
                await videoRef.current.loadAsync({ uri: videoUrl }, { shouldPlay: false });
            }
        } catch (err) {
            setError('Failed to reload video. Please try again later.');
            setIsLoading(false);
        }
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
                <Video
                    ref={videoRef}
                    source={{ uri: videoUrl }}
                    style={styles.minimizedVideo}
                    resizeMode={ResizeMode.COVER}
                    onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    shouldPlay={isPlaying}
                    isMuted={isMuted}
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

    // Fullscreen modal
    if (isFullscreen) {
        return (
            <Modal
                visible={isFullscreen}
                animationType="fade"
                supportedOrientations={['landscape']}
                onRequestClose={handleFullscreen}
            >
                <StatusBar hidden />
                <View style={styles.fullscreenContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.fullscreenTouchable}
                        onPress={handleVideoPress}
                    >
                        <Video
                            ref={videoRef}
                            source={{ uri: videoUrl }}
                            style={styles.fullscreenVideo}
                            resizeMode={ResizeMode.CONTAIN}
                            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                            shouldPlay={isPlaying}
                            isMuted={isMuted}
                            rate={playbackSpeed}
                        />

                        {showControls && (
                            <View style={styles.fullscreenControls}>
                                {/* Top bar */}
                                <View style={styles.fullscreenTopBar}>
                                    <TouchableOpacity onPress={handleFullscreen} style={styles.fullscreenBackButton}>
                                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                                    </TouchableOpacity>
                                    <Text style={styles.fullscreenTitle} numberOfLines={1}>{topicTitle}</Text>
                                    <View style={{ width: 40 }} />
                                </View>

                                {/* Center play button */}
                                <View style={styles.fullscreenCenterControls}>
                                    <TouchableOpacity onPress={handleRewind} style={styles.fullscreenSideButton}>
                                        <Ionicons name="play-back" size={32} color="#FFF" />
                                        <Text style={styles.skipLabel}>10</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handlePlayPause}
                                        style={[styles.fullscreenPlayButton, { backgroundColor: accentColor }]}
                                    >
                                        {isBuffering ? (
                                            <ActivityIndicator size="large" color="#FFF" />
                                        ) : (
                                            <Ionicons
                                                name={isPlaying ? 'pause' : 'play'}
                                                size={48}
                                                color="#FFF"
                                                style={isPlaying ? {} : { marginLeft: 5 }}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleForward} style={styles.fullscreenSideButton}>
                                        <Ionicons name="play-forward" size={32} color="#FFF" />
                                        <Text style={styles.skipLabel}>10</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Bottom bar */}
                                <View style={styles.fullscreenBottomBar}>
                                    <Text style={styles.fullscreenTimeText}>{formatTime(position)}</Text>
                                    <Slider
                                        style={styles.fullscreenSlider}
                                        minimumValue={0}
                                        maximumValue={duration || 1}
                                        value={position}
                                        onSlidingComplete={handleSeek}
                                        minimumTrackTintColor={accentColor}
                                        maximumTrackTintColor="rgba(255,255,255,0.3)"
                                        thumbTintColor={accentColor}
                                    />
                                    <Text style={styles.fullscreenTimeText}>{formatTime(duration)}</Text>
                                    <TouchableOpacity onPress={handleSpeedChange} style={styles.speedButton}>
                                        <Text style={styles.speedText}>{playbackSpeed}x</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
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
                    <Video
                        ref={videoRef}
                        source={{ uri: videoUrl }}
                        style={styles.video}
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        onLoad={() => setIsLoading(false)}
                        onError={(e) => setError('Unable to load video. Please check your connection.')}
                        shouldPlay={false}
                        isMuted={isMuted}
                        rate={playbackSpeed}
                    />

                    {/* Loading Overlay */}
                    {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={accentColor} />
                            <Text style={styles.loadingText}>Loading video...</Text>
                        </View>
                    )}

                    {/* Buffering Indicator */}
                    {isBuffering && !isLoading && (
                        <View style={styles.bufferingOverlay}>
                            <ActivityIndicator size="small" color="#FFF" />
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
                                {isBuffering ? (
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
    bufferingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
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
    // Fullscreen styles
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    fullscreenTouchable: {
        flex: 1,
    },
    fullscreenVideo: {
        flex: 1,
    },
    fullscreenControls: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'space-between',
    },
    fullscreenTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 20 : 16,
        paddingBottom: 16,
    },
    fullscreenBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    fullscreenCenterControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenSideButton: {
        alignItems: 'center',
        marginHorizontal: 32,
    },
    skipLabel: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    fullscreenPlayButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenBottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        paddingTop: 16,
    },
    fullscreenSlider: {
        flex: 1,
        height: 40,
        marginHorizontal: 12,
    },
    fullscreenTimeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '500',
        minWidth: 45,
        textAlign: 'center',
    },
    speedButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginLeft: 8,
    },
    speedText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default VideoStreamPlayer;
