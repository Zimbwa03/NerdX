// Account Screen - Central Hub for all account features
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ImageBackground,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import Colors from '../theme/colors';
import FloatingParticles from '../components/FloatingParticles';
import { accountApi, AIInsights } from '../services/api/accountApi';
import { creditsApi } from '../services/api/creditsApi';

interface MenuItemProps {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    color?: string;
    badge?: string | number;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, subtitle, onPress, color, badge }) => {
    const themedColors = useThemedColors();

    return (
        <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIconContainer, { backgroundColor: (color || Colors.primary.main) + '20' }]}>
                <Text style={styles.menuIcon}>{icon}</Text>
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: themedColors.text.primary }]}>{title}</Text>
                <Text style={[styles.menuSubtitle, { color: themedColors.text.secondary }]}>{subtitle}</Text>
            </View>
            {badge !== undefined && (
                <View style={[styles.badge, { backgroundColor: Colors.primary.main }]}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            )}
            <Text style={[styles.menuArrow, { color: themedColors.text.secondary }]}>›</Text>
        </TouchableOpacity>
    );
};

const AccountScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const themedColors = useThemedColors();
    const [refreshing, setRefreshing] = useState(false);
    const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
    const [credits, setCredits] = useState<number>(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [insightsData, balance] = await Promise.all([
                accountApi.getAIInsights(),
                creditsApi.getBalance()
            ]);
            if (insightsData) setAIInsights(insightsData);
            if (balance) setCredits(balance);
        } catch (error) {
            console.error('Failed to load account data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navigateToProfile = () => navigation.navigate('Profile' as never);
    const navigateToCredits = () => navigation.navigate('Credits' as never);
    const navigateToReferralHub = () => navigation.navigate('ReferralHub' as never);
    const navigateToBillingHistory = () => navigation.navigate('BillingHistory' as never);
    const navigateToSecurityCenter = () => navigation.navigate('SecurityCenter' as never);
    const navigateToLearningPreferences = () => navigation.navigate('LearningPreferences' as never);
    const navigateToAIInsights = () => navigation.navigate('AIInsights' as never);
    const navigateToProgress = () => navigation.navigate('Progress' as never);
    const navigateToOfflineSettings = () => navigation.navigate('OfflineSettings' as never);

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <ImageBackground
                source={require('../../assets/images/default_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <FloatingParticles count={12} />
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary.main]} />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Account</Text>
                        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Profile Card */}
                    <TouchableOpacity style={styles.profileCard} onPress={navigateToProfile} activeOpacity={0.9}>
                        <LinearGradient
                            colors={['rgba(124, 77, 255, 0.2)', 'rgba(63, 29, 203, 0.2)']}
                            style={styles.profileGradient}
                        >
                            <LinearGradient
                                colors={[Colors.primary.main, Colors.primary.dark]}
                                style={styles.avatar}
                            >
                                <Text style={styles.avatarText}>
                                    {(user?.name || 'U')[0].toUpperCase()}
                                </Text>
                            </LinearGradient>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>
                                    {user?.name} {user?.surname}
                                </Text>
                                <View style={styles.nerdxIdBadge}>
                                    <Text style={styles.nerdxIdText}>ID: {user?.nerdx_id}</Text>
                                </View>
                            </View>
                            <Text style={styles.profileArrow}>›</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Credits Card */}
                    <TouchableOpacity style={styles.creditsCard} onPress={navigateToCredits} activeOpacity={0.9}>
                        <LinearGradient
                            colors={['rgba(16, 185, 129, 0.25)', 'rgba(5, 150, 105, 0.25)']}
                            style={styles.creditsGradient}
                        >
                            <View>
                                <Text style={styles.creditsLabel}>💎 Credits Balance</Text>
                                <Text style={styles.creditsValue}>{user?.credits || credits}</Text>
                            </View>
                            <View style={styles.topUpButton}>
                                <Text style={styles.topUpText}>Top Up →</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* AI Insights Summary Card */}
                    {aiInsights && (
                        <TouchableOpacity style={styles.insightsCard} onPress={navigateToAIInsights} activeOpacity={0.9}>
                            <LinearGradient
                                colors={['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.2)']}
                                style={styles.insightsGradient}
                            >
                                <View style={styles.insightsHeader}>
                                    <Text style={styles.insightsIcon}>🧠</Text>
                                    <Text style={styles.insightsTitle}>AI Learning Insights</Text>
                                </View>
                                <View style={styles.healthScoreContainer}>
                                    <View style={styles.healthScore}>
                                        <Text style={styles.healthScoreValue}>{aiInsights.health_score}</Text>
                                        <Text style={styles.healthScoreLabel}>Health Score</Text>
                                    </View>
                                    <View style={styles.insightsStats}>
                                        <Text style={styles.insightsStat}>✅ {aiInsights.mastered_count} Mastered</Text>
                                        <Text style={styles.insightsStat}>📚 {aiInsights.learning_count} Learning</Text>
                                        <Text style={styles.insightsStat}>⚠️ {aiInsights.struggling_count} Need Work</Text>
                                    </View>
                                </View>
                                <Text style={styles.viewInsightsText}>View Full Insights →</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    {/* Menu Sections */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Learning</Text>
                        <MenuItem
                            icon="📊"
                            title="My Progress"
                            subtitle="View your learning statistics"
                            onPress={navigateToProgress}
                            color="#8B5CF6"
                        />
                        <MenuItem
                            icon="🎯"
                            title="Learning Preferences"
                            subtitle="Goals, subjects, and study settings"
                            onPress={navigateToLearningPreferences}
                            color="#10B981"
                        />
                        <MenuItem
                            icon="📴"
                            title="Offline AI Settings"
                            subtitle="Manage offline learning mode"
                            onPress={navigateToOfflineSettings}
                            color="#6366F1"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Credits & Referrals</Text>
                        <MenuItem
                            icon="👥"
                            title="Referral Hub"
                            subtitle="Invite friends, earn credits"
                            onPress={navigateToReferralHub}
                            color="#F59E0B"
                        />
                        <MenuItem
                            icon="🧾"
                            title="Billing History"
                            subtitle="Payments, invoices, and transactions"
                            onPress={navigateToBillingHistory}
                            color="#3B82F6"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Security & Account</Text>
                        <MenuItem
                            icon="🔐"
                            title="Security Center"
                            subtitle="Password, sessions, and login history"
                            onPress={navigateToSecurityCenter}
                            color="#EF4444"
                        />
                        <MenuItem
                            icon="👤"
                            title="Edit Profile"
                            subtitle="Personal information"
                            onPress={navigateToProfile}
                            color="#8B5CF6"
                        />
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                        <Text style={styles.logoutIcon}>🚪</Text>
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>NerdX v1.0.0</Text>
                        <Text style={styles.footerSubtext}>Made with ❤️ for ZIMSEC students</Text>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    backIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    themeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeIcon: {
        fontSize: 20,
    },
    profileCard: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    profileGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 14,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    nerdxIdBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    nerdxIdText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'monospace',
    },
    profileArrow: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    creditsCard: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    creditsGradient: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    creditsLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    creditsValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    topUpButton: {
        backgroundColor: Colors.success.main,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    topUpText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    insightsCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    insightsGradient: {
        padding: 16,
    },
    insightsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    insightsIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    insightsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    healthScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    healthScore: {
        alignItems: 'center',
        marginRight: 20,
    },
    healthScoreValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    healthScoreLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    insightsStats: {
        flex: 1,
    },
    insightsStat: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    viewInsightsText: {
        fontSize: 14,
        color: Colors.primary.light,
        fontWeight: '600',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 22,
    },
    menuContent: {
        flex: 1,
        marginLeft: 14,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
    },
    menuArrow: {
        fontSize: 24,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginRight: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        paddingVertical: 14,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    logoutIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    footerSubtext: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.3)',
        marginTop: 4,
    },
});

export default AccountScreen;
