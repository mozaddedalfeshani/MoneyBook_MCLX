import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import Store from '../store/store';
import { Transaction, AppData } from '../store/types';
import { ProfileScreenStyles } from '../styles/screens/profileScreen';
import { Colors } from '../styles/theme/colors';

export default function ProfileScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data: AppData = await Store.loadData();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocalState = (newData: AppData) => {
    setBalance(newData.balance);
    setTransactions(newData.transactions);
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
      const newData = await Store.deleteTransaction(
        balance,
        transactions,
        transactionToDelete,
      );
      updateLocalState(newData);

      Alert.alert(
        'Transaction Deleted',
        `Transaction deleted successfully!\nNew balance: ${newData.balance.toFixed(
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
    <View style={ProfileScreenStyles.transactionCard}>
      <View style={ProfileScreenStyles.transactionHeader}>
        <View style={ProfileScreenStyles.transactionIcon}>
          <FontAwesome5
            name={item.type === 'cash_in' ? 'arrow-down' : 'arrow-up'}
            size={20}
            color={item.type === 'cash_in' ? Colors.success : Colors.error}
          />
        </View>
        <View style={ProfileScreenStyles.transactionDetails}>
          <Text style={ProfileScreenStyles.transactionType}>
            {item.type === 'cash_in' ? '💰 Cash In' : '💸 Cash Out'}
          </Text>
          <Text style={ProfileScreenStyles.transactionDate}>{item.date}</Text>
        </View>
        <View style={ProfileScreenStyles.transactionAmount}>
          <Text
            style={[
              ProfileScreenStyles.amountText,
              {
                color: item.type === 'cash_in' ? Colors.success : Colors.error,
              },
            ]}
          >
            {item.type === 'cash_in' ? '+' : '-'}
            {item.amount.toFixed(2)} Tk
          </Text>
        </View>
      </View>

      <View style={ProfileScreenStyles.transactionBody}>
        <Text style={ProfileScreenStyles.reasonText}>{item.reason}</Text>
        <TouchableOpacity
          style={ProfileScreenStyles.deleteButton}
          onPress={() => handleDeleteTransaction(item)}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="trash" size={16} color={Colors.dangerText} />
          <Text style={ProfileScreenStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={ProfileScreenStyles.emptyState}>
      <FontAwesome5 name="history" size={64} color="#ccc" />
      <Text style={ProfileScreenStyles.emptyStateText}>
        No transactions yet
      </Text>
      <Text style={ProfileScreenStyles.emptyStateSubtext}>
        Your transaction history will appear here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={ProfileScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={ProfileScreenStyles.loadingText}>
          Loading transaction history...
        </Text>
      </View>
    );
  }

  return (
    <View style={ProfileScreenStyles.container}>
      {/* Header with balance info */}
      <View style={ProfileScreenStyles.header}>
        <Text style={ProfileScreenStyles.headerTitle}>Transaction History</Text>
        <View style={ProfileScreenStyles.balanceContainer}>
          <Text style={ProfileScreenStyles.balanceLabel}>Current Balance</Text>
          <Text style={ProfileScreenStyles.balanceAmount}>
            {balance.toFixed(2)} Tk
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={ProfileScreenStyles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
