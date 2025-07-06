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
import Store, { LegacyTransaction, AppData } from '../store/store';
import { useTheme } from '../contexts';
import { Typography } from '../styles/theme/typography';
import { Spacing } from '../styles/theme/spacing';
import { getShadows } from '../styles/theme/shadows';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const shadows = getShadows(colors);
  const [transactions, setTransactions] = useState<LegacyTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Dynamic styles based on current theme
  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: Spacing.lg,
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
    },
    header: {
      backgroundColor: colors.white,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xl,
      borderBottomWidth: Spacing.width.border,
      borderBottomColor: colors.borderLight,
      ...shadows.header,
    },
    headerTitle: {
      fontSize: Typography.fontSize.xxl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.gap.medium,
    },
    balanceContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    balanceLabel: {
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
    },
    balanceAmount: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.primary,
    },
    listContainer: {
      padding: Spacing.lg,
      paddingBottom: 100,
    },
    transactionCard: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.large,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      ...shadows.card,
    },
    transactionHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: Spacing.md,
    },
    transactionIcon: {
      width: Spacing.height.icon,
      height: Spacing.height.icon,
      borderRadius: Spacing.xl,
      backgroundColor: colors.veryLightGray,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: Spacing.md,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionType: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    transactionDate: {
      fontSize: Typography.fontSize.small,
      color: colors.textSecondary,
    },
    transactionAmount: {
      alignItems: 'flex-end' as const,
    },
    amountText: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.bold,
    },
    transactionBody: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    reasonText: {
      flex: 1,
      fontSize: Typography.fontSize.regular,
      color: colors.textSecondary,
      marginRight: Spacing.md,
    },
    deleteButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.dangerBackground,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Spacing.borderRadius.medium,
      gap: Spacing.gap.small,
    },
    deleteButtonText: {
      fontSize: Typography.fontSize.small,
      color: colors.dangerText,
      fontWeight: Typography.fontWeight.semibold,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: Spacing.xxl,
    },
    emptyStateText: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textSecondary,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
    },
    emptyStateSubtext: {
      fontSize: Typography.fontSize.medium,
      color: colors.textTertiary,
      textAlign: 'center' as const,
    },
  };

  const loadData = async () => {
    try {
      // Initialize store and run migration if needed
      await Store.initialize();
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

  const handleDeleteTransaction = (transaction: LegacyTransaction) => {
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

  const deleteTransaction = async (transactionToDelete: LegacyTransaction) => {
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

  const renderTransaction = ({ item }: { item: LegacyTransaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionIcon}>
          <FontAwesome5
            name={item.type === 'cash_in' ? 'arrow-down' : 'arrow-up'}
            size={20}
            color={item.type === 'cash_in' ? colors.success : colors.error}
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
              {
                color: item.type === 'cash_in' ? colors.success : colors.error,
              },
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
          <FontAwesome5 name="trash" size={16} color={colors.dangerText} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="history" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyStateText}>No transactions yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Your transaction history will appear here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
