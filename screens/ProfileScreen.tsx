import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';

interface Transaction {
  id: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
  date: string;
  timestamp: number;
}

interface AppData {
  balance: number;
  transactions: Transaction[];
}

export default function ProfileScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('appData');
      if (savedData !== null) {
        const data: AppData = JSON.parse(savedData);
        setBalance(data.balance || 0);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (
    newBalance: number,
    newTransactions: Transaction[],
  ) => {
    try {
      const appData: AppData = {
        balance: newBalance,
        transactions: newTransactions,
      };
      await AsyncStorage.setItem('appData', JSON.stringify(appData));
      setBalance(newBalance);
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete this ${
        transaction.type === 'cash_in' ? 'Cash In' : 'Cash Out'
      } transaction?\n\nAmount: ${transaction.amount.toFixed(2)} Tk\nReason: ${
        transaction.reason
      }\n\nThis will adjust your balance accordingly.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction),
        },
      ],
    );
  };

  const deleteTransaction = async (transactionToDelete: Transaction) => {
    try {
      // Calculate new balance
      let newBalance = balance;
      if (transactionToDelete.type === 'cash_in') {
        // If deleting cash in, subtract from balance
        newBalance = balance - transactionToDelete.amount;
      } else {
        // If deleting cash out, add back to balance
        newBalance = balance + transactionToDelete.amount;
      }

      // Remove transaction from list
      const newTransactions = transactions.filter(
        t => t.id !== transactionToDelete.id,
      );

      await saveData(newBalance, newTransactions);

      Alert.alert(
        'Transaction Deleted',
        `Transaction deleted successfully!\nNew balance: ${newBalance.toFixed(
          2,
        )} Tk`,
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  useEffect(() => {
    loadData();
  }, []);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionIcon}>
          <FontAwesome5
            name={item.type === 'cash_in' ? 'arrow-down' : 'arrow-up'}
            size={20}
            color={item.type === 'cash_in' ? '#4CAF50' : '#FF6B6B'}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>
            {item.type === 'cash_in' ? '💰 Cash In' : '💸 Cash Out'}
          </Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.amountText,
              { color: item.type === 'cash_in' ? '#4CAF50' : '#FF6B6B' },
            ]}
          >
            {item.type === 'cash_in' ? '+' : '-'}
            {item.amount.toFixed(2)} Tk
          </Text>
        </View>
      </View>

      <View style={styles.transactionBody}>
        <Text style={styles.reasonText}>{item.reason}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTransaction(item)}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="trash" size={16} color="#FF6B6B" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="history" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>No transactions yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Your transaction history will appear here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading transaction history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with balance info */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>{balance.toFixed(2)} Tk</Text>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
            tintColor="#007bff"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
