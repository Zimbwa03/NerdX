import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert, Linking} from 'react-native';
import {Text, Card, Button, ActivityIndicator} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {paymentApi, creditApi} from '../../services/api';
import {CreditPackage} from '../../types';

const PaymentScreen = ({route, navigation}: any) => {
  const {theme} = useTheme();
  const packageId = route.params?.package_id;
  const [packageData, setPackageData] = useState<CreditPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  useEffect(() => {
    loadPackage();
  }, []);

  const loadPackage = async () => {
    try {
      const packages = await creditApi.getPackages();
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        setPackageData(pkg);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load package details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!packageData) return;

    setProcessing(true);
    try {
      const result = await paymentApi.initiatePayment({
        package_id: packageId,
        payment_method: 'paynow',
      });

      setPaymentReference(result.reference);

      if (result.payment_url) {
        // Open payment URL in browser
        const canOpen = await Linking.canOpenURL(result.payment_url);
        if (canOpen) {
          await Linking.openURL(result.payment_url);
        }
      }

      // Poll for payment status
      checkPaymentStatus(result.reference);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  const checkPaymentStatus = async (reference: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = setInterval(async () => {
      attempts++;
      try {
        const status = await paymentApi.checkStatus(reference);
        if (status.status === 'completed') {
          clearInterval(poll);
          Alert.alert('Success', 'Payment completed! Credits added to your account.');
          navigation.navigate('Credits');
        } else if (status.status === 'failed') {
          clearInterval(poll);
          Alert.alert('Failed', 'Payment failed. Please try again.');
          setProcessing(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          Alert.alert('Timeout', 'Payment is taking longer than expected. Please check your account.');
          setProcessing(false);
        }
      } catch (error) {
        console.error('Payment status check error:', error);
      }
    }, 5000); // Check every 5 seconds
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!packageData) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.packageCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.packageName}>
            {packageData.name} Package
          </Text>
          <Text variant="titleLarge" style={styles.packageCredits}>
            {packageData.credits} Credits
          </Text>
          <Text variant="headlineMedium" style={styles.packagePrice}>
            ${packageData.price.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.paymentCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.paymentTitle}>
            Payment Method
          </Text>
          <Text variant="bodyLarge" style={styles.paymentMethod}>
            Paynow / EcoCash
          </Text>
          {paymentReference && (
            <Text variant="bodySmall" style={styles.reference}>
              Reference: {paymentReference}
            </Text>
          )}
          <Button
            mode="contained"
            onPress={handlePayment}
            loading={processing}
            disabled={processing}
            style={styles.payButton}
            icon="payment">
            {processing ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageCard: {
    marginBottom: 16,
    elevation: 4,
  },
  packageName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  packageCredits: {
    marginBottom: 8,
  },
  packagePrice: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentCard: {
    elevation: 4,
  },
  paymentTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paymentMethod: {
    marginBottom: 16,
  },
  reference: {
    marginBottom: 16,
    opacity: 0.7,
  },
  payButton: {
    marginTop: 8,
  },
});

export default PaymentScreen;

