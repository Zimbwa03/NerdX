// Credits Screen Component - Professional UI/UX Design
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { creditsApi, CreditPackage, PaymentStatus } from '../services/api/creditsApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Colors from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

const CreditsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
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

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await creditsApi.getPackages();
      setPackages(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load credit packages. Please try again.');
    } finally {
      setLoading(false);
    }
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
    <ScrollView style={[styles.container, { backgroundColor: themedColors.background.default }]} showsVerticalScrollIndicator={false}>
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

      {/* Credit Packages */}
      <View style={styles.packagesContainer}>
        <Text style={styles.sectionTitle}>Credit Packages</Text>
        {packages.map((packageItem) => (
          <Card
            key={packageItem.id}
            variant="elevated"
            onPress={() => handlePurchase(packageItem)}
            disabled={purchasing === packageItem.id}
            style={styles.packageCard}
          >
            <View style={styles.packageContent}>
              <View style={styles.packageHeader}>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageName}>{packageItem.name}</Text>
                  <Text style={styles.packageDescription}>{packageItem.description}</Text>
                </View>
                <View style={styles.packagePriceContainer}>
                  <Text style={styles.packagePrice}>${packageItem.price}</Text>
                  <Text style={styles.packageCurrency}>USD</Text>
                </View>
              </View>
              <View style={styles.packageCreditsContainer}>
                <IconCircle
                  icon={Icons.credits(24, Colors.success.main)}
                  size={40}
                  backgroundColor={Colors.iconBg.default}
                />
                <Text style={styles.packageCredits}>{packageItem.credits} Credits</Text>
              </View>
              {purchasing === packageItem.id ? (
                <ActivityIndicator size="small" color={Colors.primary.main} style={styles.purchasingIndicator} />
              ) : (
                <Button
                  title="Purchase"
                  variant="primary"
                  fullWidth
                  icon="card"
                  iconPosition="left"
                  style={styles.purchaseButton}
                />
              )}
            </View>
          </Card>
        ))}
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
});

export default CreditsScreen;
