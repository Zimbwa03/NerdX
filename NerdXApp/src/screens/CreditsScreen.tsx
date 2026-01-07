// Credits Screen Component - Advanced UI ✨
// Features: Transaction history, Analytics, Premium packages
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { creditsApi, CreditPackage, PaymentStatus, CreditTransaction } from '../services/api/creditsApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

// ✨ New advanced components
import TransactionHistoryCard from '../components/TransactionHistoryCard';
import SpendingChart from '../components/SpendingChart';
import PremiumPackageCard from '../components/PremiumPackageCard';

const CreditsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { showSuccess, showError, showInfo } = useNotification();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const paymentCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // ✨ New state for advanced features
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'purchase' | 'usage'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [packagesData, transactionsData] = await Promise.all([
        creditsApi.getPackages(),
        creditsApi.getTransactions(20),
      ]);
      setPackages(packagesData);
      setTransactions(transactionsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await refreshCredits();
    setRefreshing(false);
  };

  useEffect(() => {
    // Pre-fill email from user data
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.phone_number) {
      setPhoneNumber(user.phone_number);
    }
  }, [user]);

  useEffect(() => {
    // Cleanup payment polling on unmount
    return () => {
      if (paymentCheckInterval.current) {
        clearInterval(paymentCheckInterval.current);
      }
    };
  }, []);

  const startPaymentPolling = (reference: string) => {
    // Poll payment status every 3 seconds
    paymentCheckInterval.current = setInterval(async () => {
      try {
        const status = await creditsApi.checkPaymentStatus(reference);
        if (status) {
          if (status.paid || status.status === 'completed' || status.status === 'approved') {
            // Payment completed!
            if (paymentCheckInterval.current) {
              clearInterval(paymentCheckInterval.current);
              paymentCheckInterval.current = null;
            }
            setCheckingPayment(false);
            setShowPaymentModal(false);
            setPaymentReference(null);
            showSuccess(`🎉 Payment successful! ${status.credits} credits added to your account!`, 5000);
            Alert.alert(
              'Payment Successful!',
              `Your payment has been confirmed. ${status.credits} credits have been added to your account.`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    refreshCredits();
                  },
                },
              ]
            );
          } else if (status.status === 'failed' || status.status === 'cancelled') {
            // Payment failed
            if (paymentCheckInterval.current) {
              clearInterval(paymentCheckInterval.current);
              paymentCheckInterval.current = null;
            }
            setCheckingPayment(false);
            showError('❌ Payment failed. Please try again.', 5000);
            Alert.alert('Payment Failed', 'Your payment was not successful. Please try again.');
          }
        }
      } catch (error) {
        console.error('Payment status check error:', error);
      }
    }, 3000);
  };

  const handlePurchase = (packageItem: CreditPackage) => {
    setSelectedPackage(packageItem);
    setShowPaymentModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    if (!phoneNumber.trim() || !email.trim()) {
      Alert.alert('Error', 'Please enter both phone number and email');
      return;
    }

    try {
      setPurchasing(selectedPackage.id);
      const result = await creditsApi.purchaseCredits(
        selectedPackage.id,
        phoneNumber.trim(),
        email.trim()
      );

      if (result) {
        setPaymentReference(result.reference);
        setCheckingPayment(true);
        Alert.alert(
          'Payment Initiated',
          `${result.instructions}\n\nPayment Reference: ${result.reference}\n\nPlease check your phone for the USSD prompt and enter your EcoCash PIN.`,
          [{ text: 'OK' }]
        );
        // Start polling for payment status
        startPaymentPolling(result.reference);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to initiate purchase');
      setShowPaymentModal(false);
    } finally {
      setPurchasing(null);
    }
  };

  const refreshCredits = async () => {
    try {
      const balance = await creditsApi.getBalance();
      if (user) {
        updateUser({ credits: balance });
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: themedColors.background.default }]}>
        <ActivityIndicator size="large" color={themedColors.primary.main} />
        <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Loading packages...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themedColors.background.default }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary.main]} />
      }
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={themedColors.background.default} />
      {/* Professional Header */}
      <LinearGradient
        colors={[Colors.success.main, Colors.success.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Buy Credits</Text>
            <Text style={styles.subtitle}>Top up your account</Text>
          </View>
          {Icons.credits(32, '#FFFFFF')}
        </View>
      </LinearGradient>

      {/* Current Balance Card */}
      <View style={styles.balanceContainer}>
        <Card variant="gradient" gradientColors={[Colors.primary.main, Colors.primary.dark]}>
          <View style={styles.balanceContent}>
            <IconCircle
              icon={Icons.wallet(28, '#FFFFFF')}
              size={56}
              backgroundColor="rgba(255, 255, 255, 0.2)"
            />
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>{user?.credits || 0} Credits</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* ✨ Analytics Dashboard */}
      <View style={styles.analyticsContainer}>
        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
          📊 Spending Overview
        </Text>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.statValue, { color: Colors.success.main }]}>
              ${transactions.filter(t => t.transaction_type === 'purchase').reduce((sum, t) => sum + Math.abs(t.credits_change) * 0.1, 0).toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>
              Total Spent
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.statValue, { color: Colors.info.main }]}>
              {transactions.filter(t => t.transaction_type === 'usage').reduce((sum, t) => sum + Math.abs(t.credits_change), 0)}
            </Text>
            <Text style={[styles.statLabel, { color: themedColors.text.secondary }]}>
              Credits Used
            </Text>
          </View>
        </View>

        {/* Spending Chart */}
        <SpendingChart
          data={[
            { month: 'Jul', amount: 10 },
            { month: 'Aug', amount: 15 },
            { month: 'Sep', amount: 8 },
            { month: 'Oct', amount: 20 },
            { month: 'Nov', amount: 12 },
            { month: 'Dec', amount: 18 },
          ]}
        />
      </View>

      {/* ✨ Premium Credit Packages */}
      <View style={styles.packagesContainer}>
        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
          💎 Credit Packages
        </Text>

        {packages.map((packageItem, index) => {
          const isBestValue = packageItem.credits >= 500;
          const isPopular = packageItem.credits >= 200 && packageItem.credits < 500;

          return (
            <PremiumPackageCard
              key={packageItem.id}
              package={packageItem}
              onPress={() => handlePurchase(packageItem)}
              isBestValue={isBestValue}
              isPopular={isPopular}
              index={index}
            />
          );
        })}
      </View>

      {/* ✨ Transaction History */}
      <View style={styles.transactionsContainer}>
        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
          📜 Transaction History
        </Text>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {(['all', 'purchase', 'usage'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: Colors.primary.main },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? '#FFFFFF' : themedColors.text.secondary },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction List */}
        {transactions
          .filter(t => {
            if (activeTab === 'all') return true;
            return t.transaction_type.toLowerCase() === activeTab;
          })
          .slice(0, 10)
          .map((transaction) => (
            <TransactionHistoryCard
              key={transaction.id}
              transaction={transaction}
            />
          ))}

        {transactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={[styles.emptyText, { color: themedColors.text.secondary }]}>
              No transactions yet
            </Text>
          </View>
        )}
      </View>

      {/* Refresh Button */}
      <View style={styles.refreshContainer}>
        <Button
          title="Refresh Balance"
          variant="outline"
          icon="refresh"
          iconPosition="left"
          onPress={refreshCredits}
          fullWidth
        />
      </View>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          if (!checkingPayment) {
            setShowPaymentModal(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Paynow USD EcoCash Payment</Text>
            {selectedPackage && (
              <View style={styles.packageInfo}>
                <Text style={styles.packageInfoText}>
                  Package: {selectedPackage.name}
                </Text>
                <Text style={styles.packageInfoText}>
                  Credits: {selectedPackage.credits}
                </Text>
                <Text style={styles.packageInfoText}>
                  Amount: ${selectedPackage.price} USD
                </Text>
              </View>
            )}

            {checkingPayment ? (
              <View style={styles.checkingContainer}>
                <ActivityIndicator size="large" color="#1976D2" />
                <Text style={styles.checkingText}>
                  Waiting for payment confirmation...
                </Text>
                {paymentReference && (
                  <Text style={styles.referenceText}>
                    Reference: {paymentReference}
                  </Text>
                )}
                <Text style={styles.instructionText}>
                  Please check your phone and enter your EcoCash PIN when prompted.
                </Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    if (paymentCheckInterval.current) {
                      clearInterval(paymentCheckInterval.current);
                      paymentCheckInterval.current = null;
                    }
                    setCheckingPayment(false);
                    setShowPaymentModal(false);
                    setPaymentReference(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.inputLabel}>EcoCash Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="0771234567"
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelModalButton}
                    onPress={() => setShowPaymentModal(false)}
                  >
                    <Text style={styles.cancelModalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      (!phoneNumber.trim() || !email.trim() || purchasing) &&
                      styles.confirmButtonDisabled,
                    ]}
                    onPress={handleConfirmPurchase}
                    disabled={!phoneNumber.trim() || !email.trim() || !!purchasing}
                  >
                    {purchasing ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.paper,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text.secondary,
    fontSize: 16,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.white,
    opacity: 0.9,
  },
  balanceContainer: {
    padding: 20,
    paddingTop: 0,
    marginTop: -30,
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  balanceInfo: {
    marginLeft: 20,
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.text.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  packagesContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
    marginLeft: 4,
  },
  packageCard: {
    marginBottom: 16,
  },
  packageContent: {
    padding: 4,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  packagePriceContainer: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary.main,
  },
  packageCurrency: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  packageCreditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.iconBg.default,
    borderRadius: 12,
  },
  packageCredits: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.success.main,
    marginLeft: 12,
  },
  purchaseButton: {
    marginTop: 8,
  },
  purchasingIndicator: {
    marginTop: 16,
  },
  refreshContainer: {
    padding: 20,
    paddingTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background.default,
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  packageInfo: {
    backgroundColor: Colors.iconBg.default,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  packageInfoText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: Colors.background.default,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: Colors.iconBg.default,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.border.medium,
  },
  confirmButtonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  checkingText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  referenceText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 12,
    fontFamily: 'monospace',
    backgroundColor: Colors.iconBg.default,
    padding: 8,
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: Colors.iconBg.default,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  // ✨ New advanced UI styles
  analyticsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  transactionsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.iconBg.default,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default CreditsScreen;
