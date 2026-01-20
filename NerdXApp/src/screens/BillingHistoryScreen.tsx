// Billing History Screen - View payments and credit transactions
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
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import Colors from '../theme/colors';
import FloatingParticles from '../components/FloatingParticles';
import { accountApi, BillingHistory, PaymentRecord, CreditTransaction } from '../services/api/accountApi';

const BillingHistoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const themedColors = useThemedColors();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [billing, setBilling] = useState<BillingHistory | null>(null);
    const [activeTab, setActiveTab] = useState<'payments' | 'usage'>('payments');

    const loadData = useCallback(async () => {
        try {
            const data = await accountApi.getBillingHistory(50);
            if (data) setBilling(data);
        } catch (error) {
            console.error('Failed to load billing data:', error);
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

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'approved':
            case 'paid':
                return Colors.success.main;
            case 'pending':
                return Colors.warning.main;
            case 'failed':
            case 'rejected':
                return Colors.error.main;
            default:
                return Colors.text.secondary;
        }
    };

    const renderPaymentItem = (payment: PaymentRecord) => (
        <View key={payment.id} style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={styles.transactionEmoji}>💳</Text>
            </View>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Credit Purchase</Text>
                <Text style={styles.transactionSubtitle}>{payment.credits} credits</Text>
                <Text style={styles.transactionDate}>{formatDate(payment.date)}</Text>
            </View>
            <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>${payment.amount.toFixed(2)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                        {payment.status}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderCreditTransaction = (tx: CreditTransaction) => {
        const isPositive = tx.credits_change > 0;
        return (
            <View key={tx.id} style={styles.transactionItem}>
                <View style={[
                    styles.transactionIcon,
                    { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }
                ]}>
                    <Text style={styles.transactionEmoji}>{isPositive ? '➕' : '➖'}</Text>
                </View>
                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{tx.action || tx.type}</Text>
                    <Text style={styles.transactionSubtitle} numberOfLines={1}>
                        {tx.description}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(tx.date)}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[
                        styles.creditChange,
                        { color: isPositive ? Colors.success.main : Colors.error.main }
                    ]}>
                        {isPositive ? '+' : ''}{tx.credits_change}
                    </Text>
                    <Text style={styles.creditLabel}>credits</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themedColors.background.default }]}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
                    Loading billing history...
                </Text>
            </View>
        );
    }

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
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Billing History</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Balance Card */}
                    <View style={styles.balanceCard}>
                        <LinearGradient
                            colors={['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.2)']}
                            style={styles.balanceGradient}
                        >
                            <View style={styles.balanceMain}>
                                <Text style={styles.balanceLabel}>💎 Current Balance</Text>
                                <Text style={styles.balanceValue}>{billing?.credit_balance?.total || 0}</Text>
                                <Text style={styles.balanceUnit}>credits</Text>
                            </View>
                            <View style={styles.balanceBreakdown}>
                                <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownValue}>{billing?.credit_balance?.purchased || 0}</Text>
                                    <Text style={styles.breakdownLabel}>Purchased</Text>
                                </View>
                                <View style={styles.breakdownDivider} />
                                <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownValue}>{billing?.credit_balance?.free || 0}</Text>
                                    <Text style={styles.breakdownLabel}>Free/Bonus</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Subscription Status */}
                    {billing?.subscription && (
                        <View style={styles.subscriptionCard}>
                            <View style={styles.subscriptionHeader}>
                                <Text style={styles.subscriptionIcon}>📅</Text>
                                <Text style={styles.subscriptionTitle}>Subscription Status</Text>
                            </View>
                            <View style={styles.subscriptionInfo}>
                                <View style={[
                                    styles.subscriptionBadge,
                                    { backgroundColor: billing.subscription.is_active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }
                                ]}>
                                    <Text style={[
                                        styles.subscriptionStatus,
                                        { color: billing.subscription.is_active ? Colors.success.main : Colors.error.main }
                                    ]}>
                                        {billing.subscription.is_active ? 'Active' : 'Inactive'}
                                    </Text>
                                </View>
                                {billing.subscription.subscription_expires_at && (
                                    <Text style={styles.subscriptionExpiry}>
                                        {billing.subscription.is_active ? 'Expires' : 'Expired'}: {formatDate(billing.subscription.subscription_expires_at)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'payments' && styles.tabActive]}
                            onPress={() => setActiveTab('payments')}
                        >
                            <Text style={[styles.tabText, activeTab === 'payments' && styles.tabTextActive]}>
                                Payments
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'usage' && styles.tabActive]}
                            onPress={() => setActiveTab('usage')}
                        >
                            <Text style={[styles.tabText, activeTab === 'usage' && styles.tabTextActive]}>
                                Credit Usage
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Transactions List */}
                    <View style={styles.transactionsSection}>
                        {activeTab === 'payments' ? (
                            billing?.payments && billing.payments.length > 0 ? (
                                billing.payments.map(renderPaymentItem)
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyEmoji}>🧾</Text>
                                    <Text style={styles.emptyText}>No payment history yet</Text>
                                    <Text style={styles.emptySubtext}>Your purchases will appear here</Text>
                                </View>
                            )
                        ) : (
                            billing?.credit_transactions && billing.credit_transactions.length > 0 ? (
                                billing.credit_transactions.map(renderCreditTransaction)
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyEmoji}>📊</Text>
                                    <Text style={styles.emptyText}>No credit transactions yet</Text>
                                    <Text style={styles.emptySubtext}>Your credit usage will appear here</Text>
                                </View>
                            )
                        )}
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16 },
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
    balanceCard: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    balanceGradient: { padding: 20 },
    balanceMain: { alignItems: 'center', marginBottom: 20 },
    balanceLabel: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8 },
    balanceValue: { fontSize: 48, fontWeight: 'bold', color: '#FFFFFF' },
    balanceUnit: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' },
    balanceBreakdown: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    breakdownItem: { alignItems: 'center', paddingHorizontal: 20 },
    breakdownValue: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
    breakdownLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 },
    breakdownDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    subscriptionCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    subscriptionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    subscriptionIcon: { fontSize: 20, marginRight: 8 },
    subscriptionTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    subscriptionInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    subscriptionBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    subscriptionStatus: { fontSize: 14, fontWeight: '600' },
    subscriptionExpiry: { fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive: { backgroundColor: Colors.primary.main },
    tabText: { fontSize: 15, fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)' },
    tabTextActive: { color: '#FFFFFF' },
    transactionsSection: { marginHorizontal: 20 },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    transactionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionEmoji: { fontSize: 20 },
    transactionInfo: { flex: 1, marginLeft: 12 },
    transactionTitle: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    transactionSubtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', marginTop: 2 },
    transactionDate: { fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', marginTop: 4 },
    transactionRight: { alignItems: 'flex-end' },
    transactionAmount: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
    statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
    creditChange: { fontSize: 18, fontWeight: 'bold' },
    creditLabel: { fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' },
    emptyState: { alignItems: 'center', paddingVertical: 40 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    emptySubtext: { fontSize: 14, color: 'rgba(255, 255, 255, 0.5)', marginTop: 4 },
});

export default BillingHistoryScreen;
