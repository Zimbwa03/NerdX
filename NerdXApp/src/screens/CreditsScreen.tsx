// Credits Screen Component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { creditsApi, CreditPackage } from '../services/api/creditsApi';
import { useAuth } from '../context/AuthContext';

const CreditsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

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

  const handlePurchase = async (packageItem: CreditPackage) => {
    Alert.alert(
      'Purchase Credits',
      `Purchase ${packageItem.credits} credits for $${packageItem.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: async () => {
            try {
              setPurchasing(packageItem.id);
              const result = await creditsApi.purchaseCredits(packageItem.id);
              if (result) {
                Alert.alert(
                  'Payment Initiated',
                  `Payment reference: ${result.reference}\nAmount: $${result.amount}`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Refresh credits
                        refreshCredits();
                      },
                    },
                  ]
                );
              }
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to initiate purchase');
            } finally {
              setPurchasing(null);
            }
          },
        },
      ]
    );
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
});

export default CreditsScreen;
