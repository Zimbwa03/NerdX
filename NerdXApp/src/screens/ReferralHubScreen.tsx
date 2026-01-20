// Referral Hub Screen - Share referral code and view stats
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ImageBackground,
    RefreshControl,
    Share,
    Alert,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import Colors from '../theme/colors';
import FloatingParticles from '../components/FloatingParticles';
import { accountApi, ReferralStats, ReferralShareLink } from '../services/api/accountApi';

const ReferralHubScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [shareInfo, setShareInfo] = useState<ReferralShareLink | null>(null);
    const [copied, setCopied] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [statsData, shareData] = await Promise.all([
                accountApi.getReferralStats(),
                accountApi.getReferralShareLink()
            ]);
            if (statsData) setStats(statsData);
            if (shareData) setShareInfo(shareData);
        } catch (error) {
            console.error('Failed to load referral data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const copyToClipboard = async () => {
        if (stats?.referral_code) {
            await Clipboard.setStringAsync(stats.referral_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareViaWhatsApp = () => {
        if (shareInfo?.whatsapp_link) {
            Linking.openURL(shareInfo.whatsapp_link);
        }
    };

    const shareGeneral = async () => {
        if (shareInfo?.share_message) {
            try {
                await Share.share({
                    message: shareInfo.share_message,
                });
            } catch (error) {
                console.error('Share error:', error);
            }
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <ImageBackground
                source={require('../../assets/images/default_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <FloatingParticles count={10} />
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
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Referral Hub</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Hero Card */}
                    <View style={styles.heroCard}>
                        <LinearGradient
                            colors={[Colors.premium.gold, Colors.premium.goldDark || '#FFA500']}
                            style={styles.heroGradient}
                        >
                            <Text style={styles.heroEmoji}>🎁</Text>
                            <Text style={styles.heroTitle}>Invite Friends, Earn Credits!</Text>
                            <Text style={styles.heroSubtitle}>
                                Get {shareInfo?.bonus_per_referral || 5} credits for every friend who joins using your code
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Referral Code Card */}
                    <View style={styles.codeCard}>
                        <Text style={styles.codeLabel}>Your Referral Code</Text>
                        <View style={styles.codeContainer}>
                            <Text style={styles.codeText}>{stats?.referral_code || '------'}</Text>
                            <TouchableOpacity
                                style={[styles.copyButton, copied && styles.copyButtonSuccess]}
                                onPress={copyToClipboard}
                            >
                                <Text style={styles.copyButtonText}>{copied ? '✓ Copied!' : '📋 Copy'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Share Buttons */}
                    <View style={styles.shareSection}>
                        <Text style={styles.shareSectionTitle}>Share via</Text>
                        <View style={styles.shareButtons}>
                            <TouchableOpacity style={styles.whatsappButton} onPress={shareViaWhatsApp}>
                                <Text style={styles.shareButtonEmoji}>💬</Text>
                                <Text style={styles.shareButtonText}>WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.generalShareButton} onPress={shareGeneral}>
                                <Text style={styles.shareButtonEmoji}>📤</Text>
                                <Text style={styles.shareButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Card */}
                    <View style={styles.statsCard}>
                        <Text style={styles.statsTitle}>📊 Your Referral Stats</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats?.total_referrals || 0}</Text>
                                <Text style={styles.statLabel}>Total Referrals</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats?.successful_referrals || 0}</Text>
                                <Text style={styles.statLabel}>Successful</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: Colors.success.main }]}>
                                    +{stats?.total_bonus_earned || 0}
                                </Text>
                                <Text style={styles.statLabel}>Credits Earned</Text>
                            </View>
                        </View>
                        {stats?.last_referral_date && (
                            <Text style={styles.lastReferral}>
                                Last referral: {formatDate(stats.last_referral_date)}
                            </Text>
                        )}
                    </View>

                    {/* Referred Users List */}
                    {stats?.referred_users && stats.referred_users.length > 0 && (
                        <View style={styles.referredSection}>
                            <Text style={styles.referredTitle}>👥 People You Referred</Text>
                            {stats.referred_users.map((user, index) => (
                                <View key={index} style={styles.referredItem}>
                                    <View style={styles.referredAvatar}>
                                        <Text style={styles.referredAvatarText}>
                                            {(user.name || 'U')[0].toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={styles.referredInfo}>
                                        <Text style={styles.referredName}>
                                            {user.name} {user.surname}
                                        </Text>
                                        <Text style={styles.referredDate}>
                                            Joined {formatDate(user.joined_date)}
                                        </Text>
                                    </View>
                                    <View style={styles.referredBadge}>
                                        <Text style={styles.referredBadgeText}>+5 💎</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Milestones */}
                    <View style={styles.milestonesSection}>
                        <Text style={styles.milestonesTitle}>🏆 Referral Milestones</Text>
                        <View style={styles.milestoneItem}>
                            <Text style={styles.milestoneEmoji}>
                                {(stats?.successful_referrals || 0) >= 5 ? '✅' : '🔒'}
                            </Text>
                            <View style={styles.milestoneInfo}>
                                <Text style={styles.milestoneName}>Super Sharer</Text>
                                <Text style={styles.milestoneDesc}>Refer 5 friends</Text>
                            </View>
                            <Text style={styles.milestoneReward}>+10 💎</Text>
                        </View>
                        <View style={styles.milestoneItem}>
                            <Text style={styles.milestoneEmoji}>
                                {(stats?.successful_referrals || 0) >= 10 ? '✅' : '🔒'}
                            </Text>
                            <View style={styles.milestoneInfo}>
                                <Text style={styles.milestoneName}>Ambassador</Text>
                                <Text style={styles.milestoneDesc}>Refer 10 friends</Text>
                            </View>
                            <Text style={styles.milestoneReward}>+25 💎</Text>
                        </View>
                        <View style={styles.milestoneItem}>
                            <Text style={styles.milestoneEmoji}>
                                {(stats?.successful_referrals || 0) >= 25 ? '✅' : '🔒'}
                            </Text>
                            <View style={styles.milestoneInfo}>
                                <Text style={styles.milestoneName}>Legend</Text>
                                <Text style={styles.milestoneDesc}>Refer 25 friends</Text>
                            </View>
                            <Text style={styles.milestoneReward}>+50 💎</Text>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, width: '100%', height: '100%' },
    scrollView: { flex: 1 },
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
    },
    backIcon: { fontSize: 24, color: '#FFFFFF' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
    heroCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    heroGradient: {
        padding: 24,
        alignItems: 'center',
    },
    heroEmoji: { fontSize: 48, marginBottom: 12 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D2006', marginBottom: 8, textAlign: 'center' },
    heroSubtitle: { fontSize: 14, color: '#5D4A1F', textAlign: 'center' },
    codeCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    codeLabel: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 12, textAlign: 'center' },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    codeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 4,
        fontFamily: 'monospace',
    },
    copyButton: {
        backgroundColor: Colors.primary.main,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    copyButtonSuccess: { backgroundColor: Colors.success.main },
    copyButtonText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
    shareSection: { marginHorizontal: 20, marginBottom: 20 },
    shareSectionTitle: { fontSize: 16, fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', marginBottom: 12 },
    shareButtons: { flexDirection: 'row', gap: 12 },
    whatsappButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    generalShareButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary.main,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    shareButtonEmoji: { fontSize: 20 },
    shareButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    statsCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statsTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
    statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 },
    lastReferral: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginTop: 16, textAlign: 'center' },
    referredSection: { marginHorizontal: 20, marginBottom: 20 },
    referredTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
    referredItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    referredAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    referredAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    referredInfo: { flex: 1, marginLeft: 12 },
    referredName: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    referredDate: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' },
    referredBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    referredBadgeText: { fontSize: 12, fontWeight: 'bold', color: Colors.success.main },
    milestonesSection: { marginHorizontal: 20 },
    milestonesTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
    milestoneItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    milestoneEmoji: { fontSize: 24, marginRight: 12 },
    milestoneInfo: { flex: 1 },
    milestoneName: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    milestoneDesc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' },
    milestoneReward: { fontSize: 14, fontWeight: 'bold', color: Colors.warning.main },
});

export default ReferralHubScreen;
