import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { TransactionService } from '../database/services/TransactionService';
import { AccountService } from '../database/services/AccountService';
import { Transaction, TransactionType } from '../database/models/Transaction';
import { useTheme } from '../contexts';
import { Typography } from '../styles/theme/typography';
import { Spacing } from '../styles/theme/spacing';
import { getShadows } from '../styles/theme/shadows';

interface RouteParams {
  accountId: string;
  accountName: string;
}

export default function AccountDetailScreen({ route, navigation }: any) {
  const { accountId, accountName }: RouteParams = route.params;
  const { colors, currentTheme } = useTheme();
  const shadows = getShadows(colors);

  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastTransactionAmounts, setLastTransactionAmounts] = useState({
    lastCashIn: 0,
    lastCashOut: 0,
  });

  // Theme-compatible gradient colors
  const gradientColors =
    currentTheme === 'light'
      ? ['#f0faff', '#e6f7ff', '#f8fbff'] // Very light blue gradient
      : ['#2a2a2a', '#252525', '#1f1f1f']; // Subtle dark gradient

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      const [accountBalance, accountTransactions, lastAmounts] =
        await Promise.all([
          TransactionService.getAccountBalance(accountId),
          TransactionService.getAccountTransactions(accountId),
          TransactionService.getAccountLastTransactionAmounts(accountId),
        ]);

      setBalance(accountBalance);
      setTransactions(accountTransactions);
      setLastTransactionAmounts(lastAmounts);
    } catch (error) {
      console.error('Error loading account data:', error);
      Alert.alert('Error', 'Failed to load account data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePress = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount greater than 0',
      );
      return;
    }
    setModalVisible(true);
  };

  const handleCashIn = async () => {
    try {
      const cashInAmount = parseFloat(amount);
      await TransactionService.addTransaction(
        accountId,
        'cash_in',
        cashInAmount,
        reason,
      );
      await loadAccountData();
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Cash In successful! New balance: ${
          balance + cashInAmount
        } Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in cash in:', error);
      Alert.alert('Error', 'Failed to add cash in transaction');
    }
  };

  const handleCashOut = async () => {
    try {
      const cashOutAmount = parseFloat(amount);

      if (balance < cashOutAmount) {
        Alert.alert(
          'Insufficient Balance',
          "You don't have enough money for this transaction",
        );
        return;
      }

      await TransactionService.addTransaction(
        accountId,
        'cash_out',
        cashOutAmount,
        reason,
      );
      await loadAccountData();
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Cash Out successful! New balance: ${
          balance - cashOutAmount
        } Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in cash out:', error);
      Alert.alert('Error', 'Failed to add cash out transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setAmount(transaction.amount.toString());
    setReason(transaction.reason);
    setEditModalVisible(true);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction || !amount || parseFloat(amount) <= 0) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount greater than 0',
      );
      return;
    }

    try {
      const newAmount = parseFloat(amount);
      const newType = editingTransaction.type; // Keep same type for simplicity

      await TransactionService.updateTransaction(
        editingTransaction,
        newType,
        newAmount,
        reason,
      );

      await loadAccountData();
      setEditModalVisible(false);
      setEditingTransaction(null);
      setAmount('');
      setReason('');

      Alert.alert('Success', 'Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Error', 'Failed to update transaction');
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

  const deleteTransaction = async (transaction: Transaction) => {
    try {
      await TransactionService.deleteTransaction(transaction);
      await loadAccountData();
      Alert.alert('Success', 'Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setReason('');
    setAmount('');
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingTransaction(null);
    setReason('');
    setAmount('');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccountData().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccountData();
    }, []),
  );

  useEffect(() => {
    loadAccountData();
    navigation.setOptions({
      title: accountName,
    });
  }, [accountId, accountName, navigation]);

  const renderTransaction = ({ item }: { item: Transaction }) => (
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
          <Text style={styles.transactionDate}>{item.dateString}</Text>
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
        <View style={styles.transactionActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditTransaction(item)}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="edit" size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

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
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="history" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyStateText}>No transactions yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Add your first transaction to get started
      </Text>
    </View>
  );

  // Dynamic styles
  const styles = {
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      paddingTop: Spacing.xl,
      paddingBottom: 40,
    },
    // Account Card (similar to HomeCard)
    accountCard: {
      margin: Spacing.lg,
      marginBottom: Spacing.md,
      borderRadius: Spacing.borderRadius.xxl,
      overflow: 'hidden' as const,
      position: 'relative' as const,
      ...shadows.large,
    },
    gradientOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.secondary,
      opacity: 0.9,
    },
    cardContentContainer: {
      padding: Spacing.xxl,
      paddingBottom: Spacing.xl,
      position: 'relative' as const,
      zIndex: 1,
    },
    balanceSection: {
      alignItems: 'center' as const,
      marginBottom: Spacing.xxl,
    },
    accountNameLabel: {
      fontSize: Typography.fontSize.medium,
      color: colors.textLight,
      marginBottom: Spacing.md,
      fontWeight: Typography.fontWeight.medium,
    },
    balanceLabel: {
      fontSize: Typography.fontSize.medium,
      color: colors.textLight,
      marginBottom: Spacing.md,
      fontWeight: Typography.fontWeight.medium,
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textLight,
      marginBottom: Spacing.sm,
    },
    lastUpdated: {
      fontSize: Typography.fontSize.small,
      color: colors.overlayLight,
      fontStyle: 'italic' as const,
    },
    bottomSection: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.overlayLight,
    },
    statItem: {
      flex: 1,
      alignItems: 'center' as const,
    },
    statValue: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textLight,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: Typography.fontSize.small,
      color: colors.overlayLight,
      textAlign: 'center' as const,
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.overlayLight,
      marginHorizontal: Spacing.lg,
    },
    decorativeCircle1: {
      position: 'absolute' as const,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.whiteTransparent,
      top: -75,
      right: -75,
      zIndex: 0,
    },
    decorativeCircle2: {
      position: 'absolute' as const,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.whiteOpaque,
      bottom: -50,
      left: -50,
      zIndex: 0,
    },
    // Management Box
    managementBox: {
      backgroundColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(45, 45, 45, 0.9)',
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      borderRadius: Spacing.borderRadius.xl,
      padding: Spacing.xl,
      ...shadows.medium,
      borderWidth: 1,
      borderColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.1)',
    },
    boxTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
      textAlign: 'center' as const,
    },
    inputContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: Spacing.gap.medium,
    },
    input: {
      flex: 1,
      height: Spacing.height.input,
      borderWidth: Spacing.width.border,
      borderColor: colors.border,
      borderRadius: Spacing.borderRadius.medium,
      paddingHorizontal: Spacing.lg,
      fontSize: Typography.fontSize.medium,
      backgroundColor: colors.veryLightGray,
      color: colors.textPrimary,
    },
    updateButton: {
      backgroundColor: colors.secondary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderRadius: Spacing.borderRadius.medium,
      minWidth: 80,
    },
    updateButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      textAlign: 'center' as const,
    },
    // Transaction List
    transactionsList: {
      marginTop: Spacing.xl,
    },
    transactionsHeader: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    transactionsTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
    },
    transactionCard: {
      backgroundColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(45, 45, 45, 0.9)',
      borderRadius: Spacing.borderRadius.large,
      padding: Spacing.lg,
      marginHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
      ...shadows.card,
      borderWidth: 1,
      borderColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.1)',
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
    transactionActions: {
      flexDirection: 'row' as const,
      gap: Spacing.sm,
    },
    editButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.veryLightGray,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Spacing.borderRadius.medium,
      gap: Spacing.xs,
    },
    editButtonText: {
      fontSize: Typography.fontSize.small,
      color: colors.primary,
      fontWeight: Typography.fontWeight.medium,
    },
    deleteButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.dangerBackground,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Spacing.borderRadius.medium,
      gap: Spacing.xs,
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
      marginHorizontal: Spacing.lg,
    },
    emptyStateText: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textSecondary,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
      textAlign: 'center' as const,
    },
    emptyStateSubtext: {
      fontSize: Typography.fontSize.medium,
      color: colors.textTertiary,
      textAlign: 'center' as const,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      marginTop: Spacing.lg,
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
    },
    // Modal styles (same as HomeScreen)
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: Spacing.xl,
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.xxl,
      padding: Spacing.xxl,
      width: '100%' as const,
      maxWidth: 350,
      alignItems: 'center' as const,
    },
    modalTitle: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
      textAlign: 'center' as const,
    },
    modalAmount: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.primary,
      marginBottom: Spacing.xl,
    },
    reasonContainer: {
      width: '100%' as const,
      marginBottom: Spacing.xl,
    },
    reasonLabel: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
    },
    reasonInput: {
      borderWidth: Spacing.width.border,
      borderColor: colors.border,
      borderRadius: Spacing.borderRadius.medium,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: Typography.fontSize.medium,
      backgroundColor: colors.veryLightGray,
      color: colors.textPrimary,
      minHeight: 60,
      textAlignVertical: 'top' as const,
    },
    modalButtons: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      width: '100%' as const,
      gap: Spacing.gap.medium,
      marginBottom: Spacing.xl,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderRadius: Spacing.borderRadius.large,
      alignItems: 'center' as const,
    },
    cashInButton: {
      backgroundColor: colors.success,
    },
    cashOutButton: {
      backgroundColor: colors.error,
    },
    updateTransactionButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.bold,
      marginBottom: 4,
    },
    modalButtonSubtext: {
      color: colors.textLight,
      fontSize: Typography.fontSize.small,
      textAlign: 'center' as const,
    },
    cancelButton: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: Spacing.borderRadius.medium,
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
    },
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading account data...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Account Balance Card */}
        <View style={styles.accountCard}>
          <View style={styles.gradientOverlay} />
          <View style={styles.cardContentContainer}>
            <View style={styles.balanceSection}>
              <Text style={styles.accountNameLabel}>{accountName}</Text>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>{balance.toFixed(2)} Tk</Text>
              <Text style={styles.lastUpdated}>Last updated just now</Text>
            </View>

            <View style={styles.bottomSection}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {lastTransactionAmounts.lastCashIn > 0
                    ? `${lastTransactionAmounts.lastCashIn.toFixed(2)} Tk`
                    : 'No cash in'}
                </Text>
                <Text style={styles.statLabel}>Last Cash In</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {lastTransactionAmounts.lastCashOut > 0
                    ? `${lastTransactionAmounts.lastCashOut.toFixed(2)} Tk`
                    : 'No cash out'}
                </Text>
                <Text style={styles.statLabel}>Last Cash Out</Text>
              </View>
            </View>
          </View>

          {/* Decorative elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        {/* Money Management Box */}
        <View style={styles.managementBox}>
          <Text style={styles.boxTitle}>Manage Money</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount (Tk)"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdatePress}
              activeOpacity={0.7}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>
              Recent Transactions ({transactions.length})
            </Text>
          </View>

          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            ListEmptyComponent={renderEmptyState}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Add Transaction Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Transaction Type</Text>
              <Text style={styles.modalAmount}>Amount: {amount} Tk</Text>

              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason (Optional)</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="e.g., Groceries, Salary, Gift..."
                  placeholderTextColor={colors.textSecondary}
                  value={reason}
                  onChangeText={setReason}
                  multiline={true}
                  maxLength={100}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cashInButton]}
                  onPress={handleCashIn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>💰 Cash In</Text>
                  <Text style={styles.modalButtonSubtext}>
                    Add money to balance
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.cashOutButton]}
                  onPress={handleCashOut}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>💸 Cash Out</Text>
                  <Text style={styles.modalButtonSubtext}>
                    Use money from balance
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Edit Transaction Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Transaction</Text>
              <Text style={styles.modalAmount}>
                Type:{' '}
                {editingTransaction?.type === 'cash_in'
                  ? 'Cash In'
                  : 'Cash Out'}
              </Text>

              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Amount (Tk)</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Enter amount"
                  placeholderTextColor={colors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason</Text>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="e.g., Groceries, Salary, Gift..."
                  placeholderTextColor={colors.textSecondary}
                  value={reason}
                  onChangeText={setReason}
                  multiline={true}
                  maxLength={100}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateTransactionButton]}
                  onPress={handleUpdateTransaction}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>Update</Text>
                  <Text style={styles.modalButtonSubtext}>Save changes</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeEditModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}
