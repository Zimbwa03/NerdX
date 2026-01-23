// Credits Screen Component - Advanced UI ✨
// Features: Transaction history, Analytics, Premium packages, Multi-payment methods
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
  ImageBackground,
  Linking,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { creditsApi, CreditPackage, PaymentStatus, CreditTransaction, PaymentMethod } from '../services/api/creditsApi';
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
import { formatCreditBalance } from '../utils/creditCalculator';

const CreditsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { showSuccess, showError, showInfo } = useNotification();
  const insets = useSafeAreaInsets();
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

  // 💳 Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ecocash');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successCredits, setSuccessCredits] = useState(0);
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
    // Clear any existing interval
    if (paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current);
    }

    let attempts = 0;
    const maxAttempts = 40; // Poll for about 2 minutes (40 * 3s)

    // Poll payment status every 3 seconds
    paymentCheckInterval.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        if (paymentCheckInterval.current) {
          clearInterval(paymentCheckInterval.current);
          paymentCheckInterval.current = null;
        }
        setCheckingPayment(false);
        Alert.alert(
          'Payment Status',
          'We haven\'t received a confirmation yet. If you completed the payment, your credits will be added automatically once confirmed.',
          [{ text: 'OK' }]
        );
        return;
      }

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

            // Show celebration modal!
            setSuccessCredits(status.credits);
            setShowSuccessModal(true);
            showSuccess(`Warm welcome! You have purchased ${status.credits} credits.`, 5000);

            // Refresh data to show new balance and transaction
            await loadData();
            await refreshCredits();
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
        // Continue polling even on error, might be temporary network blip
      }
    }, 3000);
  };

  const handlePurchase = (packageItem: CreditPackage) => {
    setSelectedPackage(packageItem);
    setShowPaymentModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    // Validate based on payment method
    if (paymentMethod === 'ecocash') {
      if (!phoneNumber.trim() || !email.trim()) {
        Alert.alert('Error', 'Please enter both phone number and email for EcoCash payment');
        return;
      }
    } else {
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email address for card payment');
        return;
      }
    }

    try {
      setPurchasing(selectedPackage.id);

      try {
        const result = await creditsApi.purchaseCredits(
          selectedPackage.id,
          paymentMethod,
          paymentMethod === 'ecocash' ? phoneNumber.trim() : undefined,
          email.trim()
        );

        if (result) {
          handlePaymentInitiated(result);
        }
      } catch (apiError: any) {
        // Check if payment was actually successful despite the error
        // This handles cases where database save fails but payment prompt was sent
        const latestPayment = await creditsApi.getLatestPayment();
        if (latestPayment && latestPayment.reference) {
          // Payment was actually successful - don't show error to user
          console.log('✅ Payment prompt sent successfully (verified via latest payment check)');
          handlePaymentInitiated(latestPayment);
          return;
        }

        // Only show error if we confirmed payment was NOT sent
        const errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to initiate purchase';
        
        // Don't log as error if it's a timeout - might have actually sent
        if (errorMessage.toLowerCase().includes('timeout') || !apiError.response) {
          console.warn('⚠️ Payment initiation timeout - payment may have been sent');
          Alert.alert(
            'Connection Issue',
            'We could not confirm that the payment prompt was sent. Please check your phone for the payment prompt, or try again.',
            [{ text: 'OK' }]
          );
        } else {
          // Only log actual errors (not database save failures when payment was sent)
          if (!errorMessage.toLowerCase().includes('save') && !errorMessage.toLowerCase().includes('transaction')) {
            console.error('Payment initiation error:', apiError);
          }
          Alert.alert('Error', errorMessage);
        }
        // Don't close modal on error so user can try again easily
      }
    } finally {
      setPurchasing(null);
    }
  };

  const handlePaymentInitiated = (result: any) => {
    setPaymentReference(result.reference);
    setCheckingPayment(true);

    // Handle based on payment method
    if (result.payment_method === 'visa_mastercard' && result.redirect_url) {
      // Open Paynow payment page in browser for card payment
      Alert.alert(
        'Complete Card Payment',
        `You will be redirected to Paynow's secure payment page to enter your card details.\n\nPayment Reference: ${result.reference}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Payment Page',
            onPress: () => {
              Linking.openURL(result.redirect_url);
            }
          }
        ]
      );
    } else {
      // EcoCash USSD prompt
      Alert.alert(
        'Payment Initiated',
        `${result.instructions}\n\nPayment Reference: ${result.reference}\n\nPlease check your phone for the USSD prompt and enter your EcoCash PIN.`,
        [{ text: 'I understand' }]
      );
    }

    // Start polling for payment status
    startPaymentPolling(result.reference);
  };

  const refreshCredits = async () => {
    try {
      const info = await creditsApi.getCreditInfo();
      if (user && info) {
        // Update user context with full breakdown
        updateUser({
          credits: info.total,
          credit_breakdown: info
        });
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

  // Calculate monthly spending from transactions
  const getMonthlySpending = () => {
    // ... (keep existing implementation)
    const last6Months = new Array(6).fill(0).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        date: d,
        monthYear: `${d.getMonth()}-${d.getFullYear()}`,
        label: d.toLocaleString('default', { month: 'short' }),
        amount: 0
      };
    });

    transactions.forEach(t => {
      if (t.transaction_type === 'purchase' && t.transaction_date) {
        const tDate = new Date(t.transaction_date);
        const tMonthYear = `${tDate.getMonth()}-${tDate.getFullYear()}`;

        const monthData = last6Months.find(m => m.monthYear === tMonthYear);
        if (monthData) {
          monthData.amount += t.amount || 0;
        }
      }
    });

    return last6Months.map(m => ({
      month: m.label,
      amount: parseFloat(m.amount.toFixed(2))
    }));
  };

  const getBreakdownText = () => {
    const breakdown = user?.credit_breakdown;
    if (!breakdown) return null;

    return (
      <View style={styles.breakdownContainer}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Purchased:</Text>
          <Text style={styles.breakdownValue}>{breakdown.purchased_credits}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Free/Bonus:</Text>
          <Text style={styles.breakdownValue}>{breakdown.free_credits}</Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/default_background.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        style={[styles.container, { backgroundColor: 'transparent' }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary.main]} />
        }
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
                <Text style={styles.balanceAmount}>{formatCreditBalance(user?.credits)} Credits</Text>
                {getBreakdownText()}
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
                ${transactions.filter(t => t.transaction_type === 'purchase').reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)}
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
            data={getMonthlySpending()}
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
          <View style={[styles.modalOverlay, { paddingBottom: insets.bottom }]}>
            <View style={[styles.modalContent, { maxHeight: Dimensions.get('window').height * 0.85 }]}>
              {/* ✨ Gold Ticket Header */}
              <LinearGradient
                colors={Colors.premium.goldDark ? [Colors.premium.gold, Colors.premium.goldDark] : ['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalHeader}
              >
                <Text style={styles.ticketTitle}>🎫 GOLD TICKET</Text>
                <Text style={styles.ticketSubtitle}>PREMIUM ACCESS</Text>
              </LinearGradient>

              <View style={[styles.ticketBody, { maxHeight: Dimensions.get('window').height * 0.5 }]}>
                <ScrollView 
                  style={styles.ticketBodyScroll}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styles.ticketBodyContent}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.modalTitle}>Confirm Purchase</Text>
                  {selectedPackage && (
                    <View style={styles.ticketPackageInfo}>
                      <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>PACKAGE</Text>
                        <Text style={styles.ticketValue}>{selectedPackage.name}</Text>
                      </View>
                      <View style={styles.ticketDivider} />
                      <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>CREDITS</Text>
                        <Text style={styles.ticketValueLarge}>{selectedPackage.credits}</Text>
                      </View>
                      <View style={styles.ticketDivider} />
                      <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>PRICE</Text>
                        <Text style={styles.ticketPrice}>${selectedPackage.price.toFixed(2)}/month</Text>
                      </View>
                      <View style={styles.ticketDivider} />
                      <View style={styles.ticketRow}>
                        <Text style={styles.ticketLabel}>VALIDITY</Text>
                        <Text style={[styles.ticketValue, { color: Colors.warning.main }]}>1 Month</Text>
                      </View>
                      <View style={styles.monthlyWarning}>
                        <Text style={styles.monthlyWarningText}>
                          ⚠️ Credits expire after 1 month from purchase. Use them or they'll be lost!
                        </Text>
                      </View>
                    </View>
                  )}

                  {checkingPayment ? (
                    <View style={styles.checkingContainer}>
                      <ActivityIndicator size="large" color={Colors.premium.gold} />
                      <Text style={styles.checkingText}>
                        Waiting for payment confirmation...
                      </Text>
                      {paymentReference && (
                        <Text style={styles.referenceText}>
                          Ref: {paymentReference}
                        </Text>
                      )}
                      <Text style={styles.instructionText}>
                        {paymentMethod === 'ecocash'
                          ? 'Please check your phone and enter your EcoCash PIN.'
                          : 'Complete your payment on the Paynow payment page.'}
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
                      {/* 💳 Payment Method Selector */}
                      <Text style={styles.inputLabel}>PAYMENT METHOD</Text>
                      <View style={styles.paymentMethodSelector}>
                        <TouchableOpacity
                          style={[
                            styles.paymentMethodOption,
                            paymentMethod === 'ecocash' && styles.paymentMethodSelected,
                          ]}
                          onPress={() => setPaymentMethod('ecocash')}
                        >
                          <Text style={styles.paymentMethodIcon}>📱</Text>
                          <Text style={[
                            styles.paymentMethodText,
                            paymentMethod === 'ecocash' && styles.paymentMethodTextSelected,
                          ]}>EcoCash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.paymentMethodOption,
                            paymentMethod === 'visa_mastercard' && styles.paymentMethodSelected,
                          ]}
                          onPress={() => setPaymentMethod('visa_mastercard')}
                        >
                          <Text style={styles.paymentMethodIcon}>💳</Text>
                          <Text style={[
                            styles.paymentMethodText,
                            paymentMethod === 'visa_mastercard' && styles.paymentMethodTextSelected,
                          ]}>Visa/Mastercard</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Show phone number field only for EcoCash */}
                      {paymentMethod === 'ecocash' && (
                        <>
                          <Text style={styles.inputLabel}>ECOCASH NUMBER</Text>
                          <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="077..."
                            placeholderTextColor={Colors.text.disabled}
                            keyboardType="phone-pad"
                            maxLength={10}
                          />
                        </>
                      )}

                      <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                      <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email@example.com"
                        placeholderTextColor={Colors.text.disabled}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </>
                  )}
                </ScrollView>
                
                {!checkingPayment && (
                  <View style={[
                    styles.modalButtons, 
                    { 
                      paddingBottom: Math.max(insets.bottom, 16),
                      paddingTop: 16,
                      paddingHorizontal: 24,
                      backgroundColor: Colors.background.paper,
                      borderTopWidth: 1,
                      borderTopColor: Colors.border.light,
                    }
                  ]}>
                    <TouchableOpacity
                      style={styles.cancelModalButton}
                      onPress={() => setShowPaymentModal(false)}
                    >
                      <Text style={styles.cancelModalButtonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        ((paymentMethod === 'ecocash' && !phoneNumber.trim()) || !email.trim() || purchasing) &&
                        styles.confirmButtonDisabled,
                      ]}
                      onPress={handleConfirmPurchase}
                      disabled={(paymentMethod === 'ecocash' && !phoneNumber.trim()) || !email.trim() || !!purchasing}
                    >
                      <LinearGradient
                        colors={paymentMethod === 'visa_mastercard'
                          ? ['#1A237E', '#3949AB']
                          : (Colors.premium.goldDark ? [Colors.premium.gold, Colors.premium.goldDark] : ['#FFD700', '#FFA500'])}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.confirmGradient}
                      >
                        {purchasing ? (
                          <ActivityIndicator color={paymentMethod === 'visa_mastercard' ? '#FFFFFF' : Colors.premium.text} />
                        ) : (
                          <Text style={[
                            styles.confirmButtonText,
                            paymentMethod === 'visa_mastercard' && { color: '#FFFFFF' }
                          ]}>
                            {paymentMethod === 'ecocash' ? 'PAY VIA ECOCASH' : 'PAY WITH CARD'}
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* 🎉 Celebration Success Modal */}
        <Modal
          visible={showSuccessModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={[styles.modalOverlay, { paddingBottom: insets.bottom }]}>
            <View style={[styles.modalContent, styles.successModalContent]}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.successHeader}
              >
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.successTitle}>CONGRATULATIONS!</Text>
                <Text style={styles.successSubtitle}>Payment Successful</Text>
              </LinearGradient>

              <View style={styles.successBody}>
                <Text style={styles.successMessage}>
                  You're amazing! Your credits have been added to your account.
                </Text>
                <View style={styles.successCreditsBox}>
                  <Text style={styles.successCreditsLabel}>CREDITS ADDED</Text>
                  <Text style={styles.successCreditsValue}>+{successCredits}</Text>
                </View>
                <Text style={styles.successMotivation}>
                  🚀 Keep learning, keep growing! Your dedication to education is inspiring.
                  Let's achieve greatness together!
                </Text>

                <TouchableOpacity
                  style={[styles.successButton, { marginBottom: Math.max(insets.bottom, 0) }]}
                  onPress={() => setShowSuccessModal(false)}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.successButtonGradient}
                  >
                    <Text style={styles.successButtonText}>📚 START LEARNING</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
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
    backgroundColor: Colors.background.paper,
    borderRadius: 24,
    padding: 0, // Remove padding to let header flush
    width: '90%',
    maxWidth: 380,
    // maxHeight set inline to avoid StyleSheet.create() issues with dynamic values
    shadowColor: Colors.premium?.gold || '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.premium?.gold || '#FFD700',
    flexDirection: 'column', // Ensure proper layout
    // Ensure modal doesn't exceed screen bounds
    alignSelf: 'center',
  },
  modalHeader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.premium?.text || '#000',
  },
  ticketTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.premium?.text || '#2D2006',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  ticketSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.premium?.text || '#2D2006',
    opacity: 0.7,
    letterSpacing: 4,
    marginTop: 4,
  },
  ticketBody: {
    flexShrink: 1, // Allow shrinking instead of flex: 1
    padding: 0,
    minHeight: 0, // Important for ScrollView to work properly
    // maxHeight set inline to avoid StyleSheet.create() issues with dynamic values
  },
  ticketBodyScroll: {
    flexGrow: 0, // Don't grow, let content determine size
    flexShrink: 1, // Allow shrinking
  },
  ticketBodyContent: {
    padding: 24,
    paddingBottom: 16, // Reduce bottom padding since buttons have their own padding
    flexGrow: 0, // Don't force content to fill space
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ticketPackageInfo: {
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  ticketLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  ticketValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  ticketValueLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.premium?.gold || '#FFD700',
  },
  monthlyWarning: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.warning.main + '15',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.warning.main + '40',
  },
  monthlyWarningText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.warning.main,
    textAlign: 'center',
    fontWeight: '500',
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success.main,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 12,
    borderStyle: 'dashed',
    borderWidth: 0.5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text.secondary,
    marginBottom: 8,
    marginTop: 0,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: Colors.background.default,
    color: Colors.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    // marginTop and paddingBottom removed - handled inline with safe area insets
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: Colors.background.subtle,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelModalButtonText: {
    color: Colors.text.secondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  confirmButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: Colors.premium?.text || '#2D2006',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    backgroundColor: Colors.background.subtle,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.text.secondary,
    fontWeight: 'bold',
    fontSize: 14,
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
  breakdownContainer: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  breakdownValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noteText: {
    color: '#FCA5A5',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  resetText: {
    color: '#4ADE80',
    fontSize: 12,
    marginTop: 4,
  },
  // 💳 Payment Method Selector Styles
  paymentMethodSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  paymentMethodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.iconBg.default,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main + '20',
  },
  paymentMethodIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  paymentMethodTextSelected: {
    color: Colors.primary.main,
  },
  // 🎉 Success Modal Styles
  successModalContent: {
    maxWidth: 340,
  },
  successHeader: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  successBody: {
    padding: 24,
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  successCreditsBox: {
    backgroundColor: '#10B981' + '20',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  successCreditsLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    letterSpacing: 1,
  },
  successCreditsValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#10B981',
  },
  successMotivation: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  successButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  successButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default CreditsScreen;
