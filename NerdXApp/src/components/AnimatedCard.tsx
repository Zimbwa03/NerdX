// AnimatedCard Component - Premium animated feature cards
// With neon glow, scale effects, and entrance animations

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Image,
    ImageSourcePropType,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface AnimatedCardProps {
    title: string;
    subtitle: string;
    imageSource?: ImageSourcePropType;
    iconName?: string;
    iconLibrary?: 'ionicons' | 'material' | 'materialCommunity' | 'fontAwesome5';
    iconColor?: string;
    onPress: () => void;
    glowColor?: string;
    fullWidth?: boolean;
    index?: number; // For staggered entrance
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
    title,
    subtitle,
    imageSource,
    iconName,
    iconLibrary = 'ionicons',
    iconColor = '#FFFFFF',
    onPress,
    glowColor = Colors.primary.main,
    fullWidth = false,
    index = 0,
}) => {
    // Render icon component based on library
    const renderIcon = () => {
        if (!iconName) return null;
        
        const iconProps = {
            name: iconName as any,
            size: 64,
            color: iconColor,
        };

        switch (iconLibrary) {
            case 'material':
                return <MaterialIcons {...iconProps} />;
            case 'materialCommunity':
                return <MaterialCommunityIcons {...iconProps} />;
            case 'fontAwesome5':
                return <FontAwesome5 {...iconProps} />;
            default:
                return <Ionicons {...iconProps} />;
        }
    };
    // Animation values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const entranceAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    // Entrance animation with stagger
    useEffect(() => {
        const delay = index * 100;

        Animated.sequence([
            Animated.delay(delay),
            Animated.spring(entranceAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Start glow pulse
        const glowLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        );
        glowLoop.start();

        return () => glowLoop.stop();
    }, [index]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const entranceTransform = {
        opacity: entranceAnim,
        transform: [
            {
                translateY: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                }),
            },
            { scale: scaleAnim },
        ],
    };

    const glowShadow = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 20],
    });

    const CARD_WIDTH = fullWidth ? width - 48 : (width - 48) / 2;
    const CARD_HEIGHT = fullWidth ? 140 : CARD_WIDTH * 1.2;

    return (
        <Animated.View
            style={[
                styles.cardWrapper,
                entranceTransform,
                {
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                },
            ]}
        >
            {/* Neon glow effect */}
            <Animated.View
                style={[
                    styles.glowLayer,
                    {
                        shadowColor: glowColor,
                        shadowRadius: glowShadow,
                        backgroundColor: glowColor + '10',
                    },
                ]}
            />

            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={[
                    styles.card,
                    fullWidth && styles.fullWidthCard,
                ]}
            >
                {/* Card image or icon */}
                <View style={styles.imageContainer}>
                    {imageSource ? (
                        <>
                            <Image
                                source={imageSource}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            {/* Gradient overlay */}
                            <LinearGradient
                                colors={['transparent', 'rgba(10, 14, 33, 0.95)']}
                                style={styles.imageGradient}
                            />
                        </>
                    ) : iconName ? (
                        <LinearGradient
                            colors={[glowColor + '40', glowColor + '20', 'rgba(10, 14, 33, 0.95)']}
                            style={styles.iconContainer}
                        >
                            <View style={styles.iconWrapper}>
                                {renderIcon()}
                            </View>
                        </LinearGradient>
                    ) : null}

                    {/* Shimmer effect overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.shimmerOverlay}
                    />
                </View>

                {/* Card content */}
                <View style={[styles.cardContent, fullWidth && styles.fullWidthContent]}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={2}>{subtitle}</Text>
                </View>

                {/* Neon border glow */}
                <View style={[styles.borderGlow, { borderColor: glowColor + '40' }]} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        marginBottom: 20,
        position: 'relative',
    },
    glowLayer: {
        position: 'absolute',
        top: 4,
        left: 4,
        right: 4,
        bottom: 4,
        borderRadius: 24,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        elevation: 8,
    },
    card: {
        flex: 1,
        backgroundColor: Colors.background.paper,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    fullWidthCard: {
        flexDirection: 'row',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    iconContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 32,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%',
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3,
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    fullWidthContent: {
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    borderGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        borderWidth: 2,
    },
});

export default AnimatedCard;
