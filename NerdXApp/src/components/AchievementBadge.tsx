// Achievement Badge Component
// Display badges with locked/unlocked states, progress indicators, and glow effects

import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

export interface BadgeData {
    id: string;
    name: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedDate?: string;
    progress?: number; // 0-100, for locked badges
    category: 'milestone' | 'streak' | 'mastery' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgeProps {
    badge: BadgeData;
    size?: 'small' | 'medium' | 'large';
    showProgress?: boolean;
    onPress?: () => void;
}

const RARITY_COLORS = {
    common: { gradient: ['#78909C', '#546E7A'], glow: '#78909C' },
    rare: { gradient: ['#42A5F5', '#1E88E5'], glow: '#42A5F5' },
    epic: { gradient: ['#AB47BC', '#7B1FA2'], glow: '#AB47BC' },
    legendary: { gradient: ['#FFD700', '#FFA000'], glow: '#FFD700' },
};

const SIZE_CONFIGS = {
    small: { size: 60, iconSize: 24, fontSize: 10 },
    medium: { size: 80, iconSize: 32, fontSize: 12 },
    large: { size: 100, iconSize: 40, fontSize: 14 },
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
    badge,
    size = 'medium',
    showProgress = true,
    onPress,
}) => {
    const themedColors = useThemedColors();
    const { isDarkMode } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const glowAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shineAnim = useRef(new Animated.Value(0)).current;

    const config = SIZE_CONFIGS[size];
    const rarityColors = RARITY_COLORS[badge.rarity];

    useEffect(() => {
        if (badge.isUnlocked) {
            // Glow animation for unlocked badges
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 2000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: false,
                    }),
                ])
            ).start();

            // Shine effect for legendary badges
            if (badge.rarity === 'legendary') {
                Animated.loop(
                    Animated.timing(shineAnim, {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ).start();
            }
        }
    }, [badge.isUnlocked, badge.rarity]);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        setShowModal(true);
        onPress?.();
    };

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    style={[styles.container, { width: config.size }]}
                    onPress={handlePress}
                    activeOpacity={0.8}
                >
                    {/* Glow Effect */}
                    {badge.isUnlocked && (
                        <Animated.View
                            style={[
                                styles.glowEffect,
                                {
                                    width: config.size + 16,
                                    height: config.size + 16,
                                    backgroundColor: rarityColors.glow,
                                    opacity: glowOpacity,
                                },
                            ]}
                        />
                    )}

                    {/* Badge Circle */}
                    <View style={[
                        styles.badgeCircle,
                        {
                            width: config.size,
                            height: config.size,
                            borderRadius: config.size / 2,
                        }
                    ]}>
                        {badge.isUnlocked ? (
                            <LinearGradient
                                colors={rarityColors.gradient as [string, string]}
                                style={[styles.badgeGradient, { borderRadius: config.size / 2 }]}
                            >
                                <Text style={[styles.badgeIcon, { fontSize: config.iconSize }]}>
                                    {badge.icon}
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View style={[
                                styles.lockedBadge,
                                {
                                    borderRadius: config.size / 2,
                                    backgroundColor: themedColors.background.subtle,
                                }
                            ]}>
                                <Text style={[styles.lockedIcon, { fontSize: config.iconSize - 8 }]}>
                                    🔒
                                </Text>
                                {showProgress && badge.progress !== undefined && badge.progress > 0 && (
                                    <View style={styles.progressContainer}>
                                        <View style={[
                                            styles.progressBar,
                                            { backgroundColor: themedColors.background.paper }
                                        ]}>
                                            <View
                                                style={[
                                                    styles.progressFill,
                                                    {
                                                        width: `${badge.progress}%`,
                                                        backgroundColor: Colors.primary.main,
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.progressText, { color: themedColors.text.secondary }]}>
                                            {badge.progress}%
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Badge Name */}
                    <Text
                        style={[
                            styles.badgeName,
                            {
                                fontSize: config.fontSize,
                                color: badge.isUnlocked ? themedColors.text.primary : themedColors.text.secondary,
                            }
                        ]}
                        numberOfLines={2}
                    >
                        {badge.name}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Badge Detail Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowModal(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: themedColors.background.paper }]}>
                        {/* Large Badge Icon */}
                        <View style={styles.modalBadgeContainer}>
                            {badge.isUnlocked ? (
                                <LinearGradient
                                    colors={rarityColors.gradient as [string, string]}
                                    style={styles.modalBadge}
                                >
                                    <Text style={styles.modalBadgeIcon}>{badge.icon}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={[styles.modalBadge, { backgroundColor: themedColors.background.subtle }]}>
                                    <Text style={styles.modalBadgeIcon}>🔒</Text>
                                </View>
                            )}
                        </View>

                        {/* Badge Info */}
                        <Text style={[styles.modalBadgeName, { color: themedColors.text.primary }]}>
                            {badge.name}
                        </Text>

                        <View style={[styles.rarityBadge, { backgroundColor: rarityColors.gradient[0] + '30' }]}>
                            <Text style={[styles.rarityText, { color: rarityColors.gradient[0] }]}>
                                {badge.rarity.toUpperCase()}
                            </Text>
                        </View>

                        <Text style={[styles.modalDescription, { color: themedColors.text.secondary }]}>
                            {badge.description}
                        </Text>

                        {badge.isUnlocked ? (
                            <View style={styles.unlockedInfo}>
                                <Text style={[styles.unlockedText, { color: Colors.success.main }]}>
                                    ✓ Unlocked
                                </Text>
                                {badge.unlockedDate && (
                                    <Text style={[styles.dateText, { color: themedColors.text.secondary }]}>
                                        {new Date(badge.unlockedDate).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <View style={styles.lockedInfo}>
                                {badge.progress !== undefined && (
                                    <>
                                        <View style={[styles.modalProgressBar, { backgroundColor: themedColors.background.subtle }]}>
                                            <View
                                                style={[
                                                    styles.modalProgressFill,
                                                    {
                                                        width: `${badge.progress}%`,
                                                        backgroundColor: Colors.primary.main,
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.progressLabel, { color: themedColors.text.secondary }]}>
                                            {badge.progress}% Complete
                                        </Text>
                                    </>
                                )}
                            </View>
                        )}

                        {/* Close Button */}
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: themedColors.background.subtle }]}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={[styles.closeButtonText, { color: themedColors.text.primary }]}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

// Achievement Gallery component to display multiple badges
interface AchievementGalleryProps {
    badges: BadgeData[];
    title?: string;
}

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({
    badges,
    title = "🏆 Achievements",
}) => {
    const themedColors = useThemedColors();
    const unlockedCount = badges.filter(b => b.isUnlocked).length;

    return (
        <View style={[styles.galleryContainer, { backgroundColor: themedColors.background.paper }]}>
            <View style={styles.galleryHeader}>
                <Text style={[styles.galleryTitle, { color: themedColors.text.primary }]}>
                    {title}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: Colors.primary.main + '20' }]}>
                    <Text style={[styles.countText, { color: Colors.primary.main }]}>
                        {unlockedCount}/{badges.length}
                    </Text>
                </View>
            </View>

            <View style={styles.badgeGrid}>
                {badges.map((badge) => (
                    <AchievementBadge
                        key={badge.id}
                        badge={badge}
                        size="small"
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 8,
    },
    glowEffect: {
        position: 'absolute',
        borderRadius: 100,
        top: -8,
        left: -8,
    },
    badgeCircle: {
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    badgeGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeIcon: {
        textAlign: 'center',
    },
    lockedBadge: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockedIcon: {
        opacity: 0.6,
    },
    progressContainer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 8,
        textAlign: 'center',
        marginTop: 2,
    },
    badgeName: {
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '600',
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    modalContent: {
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
    },
    modalBadgeContainer: {
        marginBottom: 16,
    },
    modalBadge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBadgeIcon: {
        fontSize: 48,
    },
    modalBadgeName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    rarityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 16,
    },
    rarityText: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    modalDescription: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
    },
    unlockedInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    unlockedText: {
        fontSize: 16,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 13,
        marginTop: 4,
    },
    lockedInfo: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalProgressBar: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    modalProgressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabel: {
        marginTop: 8,
        fontSize: 14,
    },
    closeButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    galleryContainer: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 12,
        shadowColor: Colors.primary.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    galleryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    countText: {
        fontSize: 13,
        fontWeight: '600',
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
});

export default AchievementBadge;
