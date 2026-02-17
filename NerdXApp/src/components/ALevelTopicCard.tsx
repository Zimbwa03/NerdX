// Premium A Level Topic Card Component
// Modern glass-morphism design with professional polish
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface TopicCardProps {
    title: string;
    description: string;
    icon: string;
    iconFamily?: 'ionicons' | 'material';
    primaryColor: string;
    secondaryColor?: string;
    badges?: Array<{
        text: string;
        color: string;
        icon?: string;
    }>;
    objectives?: number;
    onPress: () => void;
    index?: number;
    isDarkMode?: boolean;
}

export const ALevelTopicCard: React.FC<TopicCardProps> = ({
    title,
    description,
    icon,
    iconFamily = 'material',
    primaryColor,
    secondaryColor,
    badges = [],
    objectives,
    onPress,
    index = 0,
    isDarkMode = false,
}) => {
    const gradientSecondary = secondaryColor || adjustColorBrightness(primaryColor, 20);
    
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={[
                styles.cardContainer,
                {
                    backgroundColor: isDarkMode ? 'rgba(30, 32, 48, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                }
            ]}
        >
            {/* Accent gradient border on left */}
            <LinearGradient
                colors={[primaryColor, gradientSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.accentBorder}
            />
            
            <View style={styles.cardContent}>
                {/* Icon Container with gradient background */}
                <View style={styles.iconWrapper}>
                    <LinearGradient
                        colors={[`${primaryColor}25`, `${primaryColor}10`]}
                        style={styles.iconGradient}
                    >
                        <View style={[styles.iconInner, { borderColor: `${primaryColor}30` }]}>
                            {iconFamily === 'ionicons' ? (
                                <Ionicons name={icon as any} size={26} color={primaryColor} />
                            ) : (
                                <MaterialCommunityIcons name={icon as any} size={26} color={primaryColor} />
                            )}
                        </View>
                    </LinearGradient>
                </View>

                {/* Content */}
                <View style={styles.textContent}>
                    <Text 
                        style={[
                            styles.title, 
                            { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        maxFontSizeMultiplier={1.15}
                    >
                        {title}
                    </Text>
                    <Text 
                        style={[
                            styles.description,
                            { color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(26,26,46,0.6)' }
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        maxFontSizeMultiplier={1.15}
                    >
                        {description}
                    </Text>

                    {/* Badges Row */}
                    <View style={styles.badgesRow}>
                        {badges.map((badge, idx) => (
                            <View 
                                key={idx} 
                                style={[
                                    styles.badge, 
                                    { backgroundColor: `${badge.color}15` }
                                ]}
                            >
                                {badge.icon && (
                                    <MaterialCommunityIcons 
                                        name={badge.icon as any} 
                                        size={12} 
                                        color={badge.color} 
                                        style={styles.badgeIcon}
                                    />
                                )}
                                <Text
                                    style={[styles.badgeText, { color: badge.color }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {badge.text}
                                </Text>
                            </View>
                        ))}
                        {objectives && (
                            <View 
                                style={[
                                    styles.badge, 
                                    { backgroundColor: `${primaryColor}12` }
                                ]}
                            >
                                <MaterialCommunityIcons 
                                    name="target" 
                                    size={12} 
                                    color={primaryColor} 
                                    style={styles.badgeIcon}
                                />
                                <Text
                                    style={[styles.badgeText, { color: primaryColor }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {objectives} objectives
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Arrow */}
                <View style={[styles.arrowContainer, { backgroundColor: `${primaryColor}12` }]}>
                    <Ionicons name="chevron-forward" size={20} color={primaryColor} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Feature Card for Notes, AI Tutor, Virtual Labs, etc.
interface FeatureCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconBgColor: string;
    onPress: () => void;
    isDarkMode?: boolean;
}

export const ALevelFeatureCard: React.FC<FeatureCardProps> = ({
    title,
    subtitle,
    icon,
    iconBgColor,
    onPress,
    isDarkMode = false,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={[
                styles.featureCardContainer,
                {
                    backgroundColor: isDarkMode ? 'rgba(30, 32, 48, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                }
            ]}
        >
            <View style={[styles.featureIconWrapper, { backgroundColor: iconBgColor }]}>
                {icon}
            </View>
            <View style={styles.featureTextContent}>
                <Text style={[
                    styles.featureTitle,
                    { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }
                ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    maxFontSizeMultiplier={1.15}
                >
                    {title}
                </Text>
                <Text style={[
                    styles.featureSubtitle,
                    { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(26,26,46,0.55)' }
                ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    maxFontSizeMultiplier={1.15}
                >
                    {subtitle}
                </Text>
            </View>
            <Ionicons 
                name="chevron-forward" 
                size={22} 
                color={isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'} 
            />
        </TouchableOpacity>
    );
};

// Premium Exam Start Card
interface ExamCardProps {
    title: string;
    subtitle: string;
    gradientColors: [string, string];
    icon: React.ReactNode;
    onPress: () => void;
}

export const ALevelExamCard: React.FC<ExamCardProps> = ({
    title,
    subtitle,
    gradientColors,
    icon,
    onPress,
}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.examCardGradient}
            >
                {/* Decorative circles */}
                <View style={[styles.decorativeCircle, styles.circle1]} />
                <View style={[styles.decorativeCircle, styles.circle2]} />
                
                <View style={styles.examCardContent}>
                    <View style={styles.examIconWrapper}>
                        {icon}
                    </View>
                    <View style={styles.examTextContent}>
                        <Text style={styles.examTitle} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
                        <Text style={styles.examSubtitle} numberOfLines={2} ellipsizeMode="tail">{subtitle}</Text>
                    </View>
                    <View style={styles.examArrow}>
                        <Ionicons name="play" size={24} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

// Info Card at bottom
interface InfoCardProps {
    title: string;
    content: string;
    gradientColors: [string, string];
    iconColor: string;
    isDarkMode?: boolean;
}

export const ALevelInfoCard: React.FC<InfoCardProps> = ({
    title,
    content,
    gradientColors,
    iconColor,
    isDarkMode = false,
}) => {
    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.infoCardGradient,
                { borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }
            ]}
        >
            <View style={[styles.infoIconWrapper, { backgroundColor: `${iconColor}20` }]}>
                <MaterialCommunityIcons name="information-outline" size={22} color={iconColor} />
            </View>
            <View style={styles.infoTextContent}>
                <Text style={[
                    styles.infoTitle,
                    { color: isDarkMode ? '#FFFFFF' : '#1A1A2E' }
                ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    maxFontSizeMultiplier={1.15}
                >
                    {title}
                </Text>
                <Text style={[
                    styles.infoText,
                    { color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(26,26,46,0.6)' }
                ]}
                    numberOfLines={4}
                    ellipsizeMode="tail"
                    maxFontSizeMultiplier={1.15}
                >
                    {content}
                </Text>
            </View>
        </LinearGradient>
    );
};

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

const styles = StyleSheet.create({
    // Topic Card Styles
    cardContainer: {
        marginBottom: 14,
        borderRadius: 18,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    accentBorder: {
        width: 4,
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingLeft: 14,
        gap: 14,
        minWidth: 0,
    },
    iconWrapper: {
        width: 54,
        height: 54,
    },
    iconGradient: {
        width: 54,
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconInner: {
        width: 46,
        height: 46,
        borderRadius: 13,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    textContent: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.2,
        marginBottom: 4,
        flexShrink: 1,
    },
    description: {
        fontSize: 12.5,
        lineHeight: 17,
        marginBottom: 10,
        flexShrink: 1,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeIcon: {
        marginRight: 4,
    },
    badgeText: {
        fontSize: 10.5,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    arrowContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },

    // Feature Card Styles
    featureCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
        gap: 14,
    },
    featureIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureTextContent: {
        flex: 1,
        minWidth: 0,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
        marginBottom: 3,
        flexShrink: 1,
    },
    featureSubtitle: {
        fontSize: 13,
        lineHeight: 18,
        flexShrink: 1,
    },

    // Exam Card Styles
    examCardGradient: {
        borderRadius: 20,
        padding: 20,
        marginTop: 8,
        marginBottom: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeCircle: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    circle1: {
        width: 120,
        height: 120,
        top: -40,
        right: -20,
    },
    circle2: {
        width: 80,
        height: 80,
        bottom: -20,
        left: 40,
    },
    examCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        minWidth: 0,
    },
    examIconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    examTextContent: {
        flex: 1,
        minWidth: 0,
    },
    examTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
        marginBottom: 4,
        flexShrink: 1,
    },
    examSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 18,
        flexShrink: 1,
    },
    examArrow: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },

    // Info Card Styles
    infoCardGradient: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'flex-start',
        gap: 14,
        borderWidth: 1,
    },
    infoIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoTextContent: {
        flex: 1,
        minWidth: 0,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
        marginBottom: 4,
        flexShrink: 1,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
        flexShrink: 1,
    },
});

export default ALevelTopicCard;

