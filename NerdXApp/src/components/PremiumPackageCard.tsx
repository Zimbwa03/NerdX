// PremiumPackageCard Component - Enhanced credit package cards
// Features: Best Value badges, savings calculator, shimmer effects

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditPackage } from '../services/api/creditsApi';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

const { width } = Dimensions.get('window');

interface PremiumPackageCardProps {
    package: CreditPackage;
    onPress: () => void;
    isPopular?: boolean;
    isBestValue?: boolean;
    index?: number;
}

const PremiumPackageCard: React.FC<PremiumPackageCardProps> = ({
    package: pkg,
    onPress,
    isPopular = false,
    isBestValue = false,
    index = 0,
}) => {
    const themedColors = useThemedColors();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const entranceAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    // Entrance animation
    useEffect(() => {
        Animated.spring(entranceAnim, {
            toValue: 1,
            delay: index * 100,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();

        // Shimmer animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [index]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
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

    // Calculate value per credit
    const valuePerCredit = (pkg.price / pkg.credits).toFixed(3);
    const savings = pkg.credits > 100 ? Math.floor((pkg.credits / 100) * 10) : 0;

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: entranceAnim,
                    transform: [
                        { scale: scaleAnim },
                        {
                            translateY: entranceAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.card,
                    { backgroundColor: themedColors.background.paper },
                    isBestValue && styles.bestValueCard,
                ]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {/* Best Value Banner */}
                {isBestValue && (
                    <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.bestValueBanner}
                    >
                        <Text style={styles.bestValueText}>🏆 BEST VALUE</Text>
                    </LinearGradient>
                )}

                {/* Popular Badge */}
                {isPopular && !isBestValue && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>⭐ Popular</Text>
                    </View>
                )}

                {/* Shimmer effect */}
                <Animated.View
                    style={[
                        styles.shimmer,
                        {
                            transform: [{ translateX: shimmerTranslate }],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shimmerGradient}
                    />
                </Animated.View>

                {/* Card Content */}
                <View style={styles.content}>
                    {/* Package Name */}
                    <Text style={[styles.packageName, { color: themedColors.text.primary }]}>
                        {pkg.name}
                    </Text>

                    {/* Credits Display */}
                    <View style={styles.creditsContainer}>
                        <Text style={styles.creditsAmount}>{pkg.credits}</Text>
                        <Text style={[styles.creditsLabel, { color: themedColors.text.secondary }]}>
                            Credits
                        </Text>
                    </View>

                    {/* Price */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.currency}>$</Text>
                        <Text style={styles.price}>{pkg.price}</Text>
                        <Text style={[styles.priceLabel, { color: themedColors.text.secondary }]}>
                            USD
                        </Text>
                    </View>

                    {/* Value Per Credit */}
                    <View style={[styles.valueContainer, { backgroundColor: Colors.info.main + '10' }]}>
                        <Text style={[styles.valueText, { color: Colors.info.main }]}>
                            ${valuePerCredit} per credit
                        </Text>
                    </View>

                    {/* Savings Badge */}
                    {savings > 0 && (
                        <View style={[styles.savingsBadge, { backgroundColor: Colors.success.main + '15' }]}>
                            <Text style={[styles.savingsText, { color: Colors.success.main }]}>
                                💰 Save {savings}%
                            </Text>
                        </View>
                    )}

                    {/* Description */}
                    <Text style={[styles.description, { color: themedColors.text.secondary }]}>
                        {pkg.description}
                    </Text>

                    {/* Purchase Button */}
                    <LinearGradient
                        colors={
                            isBestValue
                                ? ['#FFD700', '#FFA500']
                                : [Colors.primary.main, Colors.primary.dark]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.purchaseButton}
                    >
                        <Text style={styles.purchaseButtonText}>
                            {isBestValue ? '✨ Get Best Value' : '🛒 Purchase Now'}
                        </Text>
                    </LinearGradient>
                </View>

                {/* Glow Border */}
                {isBestValue && (
                    <View style={styles.glowBorder} />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border.light,
        position: 'relative',
    },
    bestValueCard: {
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    bestValueBanner: {
        paddingVertical: 8,
        alignItems: 'center',
    },
    bestValueText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 1,
    },
    popularBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: Colors.secondary.main + '20',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    popularText: {
        color: Colors.secondary.main,
        fontSize: 11,
        fontWeight: '600',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    shimmerGradient: {
        width: width * 2,
        height: '100%',
    },
    content: {
        padding: 20,
        zIndex: 2,
    },
    packageName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    creditsContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    creditsAmount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.primary.main,
        marginRight: 8,
    },
    creditsLabel: {
        fontSize: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    currency: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.success.main,
        marginRight: 4,
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.success.main,
        marginRight: 6,
    },
    priceLabel: {
        fontSize: 14,
    },
    valueContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 8,
    },
    valueText: {
        fontSize: 13,
        fontWeight: '600',
    },
    savingsBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    savingsText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    purchaseButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    purchaseButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    glowBorder: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#FFD700',
        opacity: 0.5,
        zIndex: -1,
    },
});

export default PremiumPackageCard;
