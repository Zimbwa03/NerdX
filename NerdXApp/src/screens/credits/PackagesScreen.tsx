import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Text, Card, ActivityIndicator, Button} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {creditApi} from '../../services/api';
import {CreditPackage} from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PackagesScreen = ({navigation}: any) => {
  const {theme} = useTheme();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await creditApi.getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Failed to load packages:', error);
      // Fallback packages
      setPackages([
        {id: '1', name: 'Pocket', credits: 50, price: 1.0, currency: 'USD'},
        {id: '2', name: 'Mini', credits: 120, price: 2.0, currency: 'USD'},
        {id: '3', name: 'Quick', credits: 350, price: 5.0, currency: 'USD'},
        {id: '4', name: 'Boost', credits: 750, price: 10.0, currency: 'USD'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (pkg: CreditPackage) => {
    navigation.navigate('Payment', {package_id: pkg.id});
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Credit Packages
      </Text>

      {packages.map(pkg => (
        <Card key={pkg.id} style={styles.packageCard}>
          <Card.Content>
            <View style={styles.packageHeader}>
              <Text variant="headlineSmall" style={styles.packageName}>
                {pkg.name}
              </Text>
              <Text variant="titleLarge" style={styles.packagePrice}>
                ${pkg.price.toFixed(2)}
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.packageCredits}>
              {pkg.credits} Credits
            </Text>
            {pkg.description && (
              <Text variant="bodyMedium" style={styles.packageDesc}>
                {pkg.description}
              </Text>
            )}
            <Button
              mode="contained"
              onPress={() => handlePurchase(pkg)}
              style={styles.buyButton}
              icon="shopping-cart">
              Buy Now
            </Button>
          </Card.Content>
        </Card>
      ))}
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
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  packageCard: {
    marginBottom: 16,
    elevation: 4,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontWeight: 'bold',
  },
  packagePrice: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packageCredits: {
    marginBottom: 8,
    fontWeight: '600',
  },
  packageDesc: {
    marginBottom: 16,
    opacity: 0.7,
  },
  buyButton: {
    marginTop: 8,
  },
});

export default PackagesScreen;

