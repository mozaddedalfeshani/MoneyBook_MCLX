import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Store, { LegacyTransaction, AppData } from '../store/store';
import { useTheme } from '../contexts';
import { Typography } from '../styles/theme/typography';
import { Spacing } from '../styles/theme/spacing';
import { getShadows } from '../styles/theme/shadows';
import HomeCard from '../components/cards/HomeCard';

export default function HomeScreen() {
  const { colors } = useTheme();
  const shadows = getShadows(colors);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<LegacyTransaction[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic styles based on current theme
  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flexGrow: 1,
      paddingTop: Spacing.xl,
      paddingBottom: 40,
    },
    managementBox: {
      backgroundColor: colors.secondaryLight,
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      borderRadius: Spacing.borderRadius.xl,
      padding: Spacing.xl,
      ...shadows.medium,
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
    // Modal styles
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

  // Load data from store
  const loadData = async () => {
    try {
      setIsLoading(true);
      // Initialize store and run migration if needed
      await Store.initialize();
      const data: AppData = await Store.loadData();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load transaction data');
    } finally {
      setIsLoading(false);
    }
  };

  // Update local state with new data
  const updateLocalState = (newData: AppData) => {
    setBalance(newData.balance);
    setTransactions(newData.transactions);
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
      const newData = await Store.addCashIn(
        balance,
        transactions,
        cashInAmount,
        reason,
      );
      updateLocalState(newData);
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Cash In successful! New balance: ${newData.balance.toFixed(
          2,
        )} Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in cash in:', error);
      Alert.alert('Error', 'Failed to add cash in transaction');
    }
  };

  const handleCashOut = async () => {
    try {
      const cashOutAmount = parseFloat(amount);
      const newData = await Store.addCashOut(
        balance,
        transactions,
        cashOutAmount,
        reason,
      );
      updateLocalState(newData);
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Cash Out successful! New balance: ${newData.balance.toFixed(
          2,
        )} Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in cash out:', error);
      if (error instanceof Error && error.message === 'Insufficient balance') {
        Alert.alert(
          'Insufficient Balance',
          "You don't have enough money for this transaction",
        );
      } else {
        Alert.alert('Error', 'Failed to add cash out transaction');
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setReason('');
  };

  // Get last transaction amounts for HomeCard
  const [lastTransactionAmounts, setLastTransactionAmounts] = useState({
    lastCashIn: 0,
    lastCashOut: 0,
  });

  useEffect(() => {
    const getLastAmounts = async () => {
      try {
        const amounts = await Store.getLastTransactionAmounts(transactions);
        setLastTransactionAmounts(amounts);
      } catch (error) {
        console.error('Error getting last transaction amounts:', error);
      }
    };

    if (transactions.length > 0) {
      getLastAmounts();
    }
  }, [transactions]);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when navigating back from History screen
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <HomeCard
        balance={balance}
        isLoading={isLoading}
        lastCashIn={lastTransactionAmounts.lastCashIn}
        lastCashOut={lastTransactionAmounts.lastCashOut}
      />

      {/* Money Management Box */}
      <View style={styles.managementBox}>
        <Text style={styles.boxTitle}>Manage Your Money</Text>

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

      {/* Modal for Cash In/Out Selection */}
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

            {/* Reason Input Field */}
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
    </ScrollView>
  );
}
