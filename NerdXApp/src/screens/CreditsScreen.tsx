// Credits Screen Component
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { creditsApi, CreditPackage, PaymentStatus } from '../services/api/creditsApi';
import { useAuth } from '../context/AuthContext';

const CreditsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading packages...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buy Credits</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance:</Text>
          <Text style={styles.balanceAmount}>{user?.credits || 0} Credits</Text>
        </View>
      </View>

      <View style={styles.packagesContainer}>
        {packages.map((packageItem) => (
          <TouchableOpacity
            key={packageItem.id}
            style={styles.packageCard}
            onPress={() => handlePurchase(packageItem)}
            disabled={purchasing === packageItem.id}
          >
            <View style={styles.packageHeader}>
              <Text style={styles.packageName}>{packageItem.name}</Text>
              <Text style={styles.packagePrice}>${packageItem.price}</Text>
            </View>
            <Text style={styles.packageCredits}>{packageItem.credits} Credits</Text>
            <Text style={styles.packageDescription}>{packageItem.description}</Text>
            {purchasing === packageItem.id ? (
              <ActivityIndicator size="small" color="#1976D2" style={styles.purchasingIndicator} />
            ) : (
              <View style={styles.purchaseButton}>
                <Text style={styles.purchaseButtonText}>Purchase</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={refreshCredits}>
        <Text style={styles.refreshButtonText}>🔄 Refresh Balance</Text>
      </TouchableOpacity>

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
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#757575',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  packagesContainer: {
    padding: 20,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  packageCredits: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 5,
  },
  packageDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
  },
  purchaseButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  purchasingIndicator: {
    marginTop: 10,
  },
  refreshButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  packageInfo: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  packageInfoText: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  checkingText: {
    fontSize: 16,
    color: '#212121',
    marginTop: 15,
    textAlign: 'center',
  },
  referenceText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 10,
    fontFamily: 'monospace',
  },
  instructionText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreditsScreen;
