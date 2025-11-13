import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Text, Card, Button, ActivityIndicator, List} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';
import {creditApi} from '../../services/api';
import {CreditTransaction} from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CreditsScreen = ({navigation}: any) => {
  const {theme} = useTheme();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [creditBalance, creditTransactions] = await Promise.all([
        creditApi.getBalance(),
        creditApi.getTransactions(),
      ]);
      setBalance(creditBalance);
      setTransactions(creditTransactions);
    } catch (error) {
      console.error('Failed to load credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.balance}>
            {balance}
          </Text>
          <Text variant="titleMedium" style={styles.balanceLabel}>
            Credits Available
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Packages')}
            style={styles.buyButton}
            icon="add-circle">
            Buy Credits
          </Button>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Recent Transactions
      </Text>

      {transactions.length > 0 ? (
        transactions.map(transaction => (
          <Card key={transaction.id} style={styles.transactionCard}>
            <Card.Content>
              <View style={styles.transactionRow}>
                <View style={styles.transactionInfo}>
                  <Icon
                    name={
                      transaction.type === 'earned'
                        ? 'add-circle'
                        : transaction.type === 'purchased'
                        ? 'shopping-cart'
                        : 'remove-circle'
                    }
                    size={24}
                    color={
                      transaction.type === 'earned' || transaction.type === 'purchased'
                        ? theme.colors.success
                        : theme.colors.error
                    }
                  />
                  <View style={styles.transactionText}>
                    <Text variant="titleMedium">{transaction.description}</Text>
                    <Text variant="bodySmall" style={styles.transactionDate}>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text
                  variant="titleMedium"
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        transaction.type === 'earned' || transaction.type === 'purchased'
                          ? theme.colors.success
                          : theme.colors.error,
                    },
                  ]}>
                  {transaction.type === 'earned' || transaction.type === 'purchased'
                    ? '+'
                    : '-'}
                  {transaction.amount}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.noTransactions}>No transactions yet</Text>
      )}
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
  balanceCard: {
    margin: 16,
    elevation: 4,
  },
  balance: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceLabel: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  buyButton: {
    marginTop: 8,
  },
  sectionTitle: {
    margin: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  transactionCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionText: {
    marginLeft: 12,
    flex: 1,
  },
  transactionDate: {
    opacity: 0.6,
    marginTop: 4,
  },
  transactionAmount: {
    fontWeight: 'bold',
  },
  noTransactions: {
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.6,
  },
});

export default CreditsScreen;

