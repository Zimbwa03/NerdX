import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    Text,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    useAnimatedReaction,
    cancelAnimation
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* 
  ZoomableImageModal
  ------------------
  A high-performance modal for viewing images with Pinch-to-Zoom and Pan gestures.
  Uses react-native-reanimated and gesture-handler for 60fps animations.
*/

interface ZoomableImageModalProps {
    visible: boolean;
    imageUrl: string | null;
    onClose: () => void;
    onRequestClose?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ZoomableImageModal: React.FC<ZoomableImageModalProps> = ({
    visible,
    imageUrl,
    onClose,
    onRequestClose
}) => {
    const insets = useSafeAreaInsets();

    // Animation Values
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    // Reset animations when modal opens/closes
    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 300 });
            scale.value = 1;
            savedScale.value = 1;
            translateX.value = 0;
            translateY.value = 0;
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
        } else {
            opacity.value = 0;
        }
    }, [visible]);

    const handleClose = () => {
        opacity.value = withTiming(0, { duration: 200 }, (finished) => {
            if (finished) {
                runOnJS(onClose)();
            }
        });
    };

    // --- Gestures ---

    // Pinch Gesture
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                // Reset if zoomed out too much
                scale.value = withSpring(1);
                savedScale.value = 1;
            } else if (scale.value > 5) {
                // Cap max zoom
                scale.value = withSpring(5);
                savedScale.value = 5;
            } else {
                savedScale.value = scale.value;
            }
        });

    // Pan Gesture
    const panGesture = Gesture.Pan()
        .averageTouches(true) // Smoother panning with multiple fingers
        .onUpdate((e) => {
            if (scale.value > 1) {
                translateX.value = savedTranslateX.value + e.translationX;
                translateY.value = savedTranslateY.value + e.translationY;
            }
        })
        .onEnd(() => {
            if (scale.value > 1) {
                // Calculate boundaries to prevent panning image off-screen
                const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
                const maxTranslateY = (SCREEN_HEIGHT * (scale.value - 1)) / 2;

                if (translateX.value > maxTranslateX) {
                    translateX.value = withSpring(maxTranslateX);
                    savedTranslateX.value = maxTranslateX;
                } else if (translateX.value < -maxTranslateX) {
                    translateX.value = withSpring(-maxTranslateX);
                    savedTranslateX.value = -maxTranslateX;
                } else {
                    savedTranslateX.value = translateX.value;
                }

                // Similar for Y, but maybe more loose or strict depending on aspect ratio
                // For simplicity, we just save it unless it's strictly bounded logic needed
                savedTranslateY.value = translateY.value;
            }
        });

    // Double Tap to Zoom/Reset
    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
            } else {
                scale.value = withSpring(2.5);
                savedScale.value = 2.5;
            }
        });

    const composedGestures = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

    // Animated Styles
    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ]
    }));

    const animatedBackdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    if (!visible || !imageUrl) return null;

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onRequestClose || handleClose}
            animationType="none" // We handle animation manually
            statusBarTranslucent
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.View style={[styles.container, animatedBackdropStyle]}>
                    <BlurView
                        intensity={90}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={[styles.header, { top: insets.top + 10 }]}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <Ionicons name="close" size={28} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <GestureDetector gesture={composedGestures}>
                        <Animated.View style={styles.imageContainer}>
                            <Animated.Image
                                source={{ uri: imageUrl }}
                                style={[styles.image, animatedImageStyle]}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </GestureDetector>

                    <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
                        <Text style={styles.footerText}>Double tap to zoom • Pinch to scale</Text>
                    </View>
                </Animated.View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    header: {
        position: 'absolute',
        right: 20,
        zIndex: 100,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        zIndex: 100,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    footerText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
    }
});

export default ZoomableImageModal;
