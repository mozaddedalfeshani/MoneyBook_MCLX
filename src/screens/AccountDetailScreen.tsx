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
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { TransactionService } from '../database/services/TransactionService';
import { Transaction } from '../database/models/Transaction';
import { useTheme } from '../contexts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// iOS Typography System
const Typography = {
  // iOS Font Sizes (following iOS Human Interface Guidelines)
  fontSize: {
    // iOS naming
    caption2: 11, // Caption 2
    caption1: 12, // Caption 1
    footnote: 13, // Footnote
    subheadline: 15, // Subheadline
    callout: 16, // Callout
    body: 17, // Body
    headline: 17, // Headline
    title3: 20, // Title 3
    title2: 22, // Title 2
    title1: 28, // Title 1
    largeTitle: 34, // Large Title

    // Backward compatibility
    tiny: 11, // Maps to caption2
    small: 13, // Maps to footnote
    regular: 17, // Maps to body
    medium: 16, // Maps to callout
    large: 20, // Maps to title3
    xl: 22, // Maps to title2
    xxl: 28, // Maps to title1
    xxxl: 34, // Maps to largeTitle
  },

  // iOS Font Weights
  fontWeight: {
    ultraLight: '100' as const,
    thin: '200' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },

  // iOS Line Heights
  lineHeight: {
    tight: 1.15,
    normal: 1.25,
    relaxed: 1.4,
  },

  // iOS Letter Spacing
  letterSpacing: {
    tight: -0.41,
    normal: 0,
    wide: 0.38,
  },

  // iOS Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

// iOS Spacing System (8pt grid)
const Spacing = {
  // Base spacing unit (iOS uses 8pt grid)
  base: 8,

  // iOS spacing values
  xs: 4, // 0.5x
  sm: 8, // 1x
  md: 16, // 2x
  lg: 24, // 3x
  xl: 32, // 4x
  xxl: 40, // 5x
  xxxl: 48, // 6x

  // iOS spacing
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },

  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },

  // iOS Border radius (more rounded)
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },

  // iOS Heights
  height: {
    input: 44, // iOS standard touch target
    button: 44, // iOS standard touch target
    card: 200,
    icon: 44, // iOS standard touch target
  },

  // iOS Widths
  width: {
    divider: 0.5, // iOS standard divider
    border: 1,
  },

  // iOS Gaps
  gap: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
};

// Shadows styles moved from centralized styles
const getShadows = (colors: any) => ({
  // Small shadow
  small: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Medium shadow
  medium: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Large shadow
  large: {
    shadowColor: colors.shadowSecondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },

  // Card shadow
  card: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Header shadow
  header: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Button shadow
  button: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

interface RouteParams {
  accountId: string;
  accountName: string;
}

type FilterType = 'all' | 'credit' | 'debit';

export default function AccountDetailScreen({ route, navigation }: any) {
  const { accountId, accountName }: RouteParams = route.params;
  const { colors, currentTheme } = useTheme();
  const shadows = getShadows(colors);

  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [totalCredit, setTotalCredit] = useState<number>(0);
  const [totalDebit, setTotalDebit] = useState<number>(0);
  const [filteredCredit, setFilteredCredit] = useState<number>(0);
  const [filteredDebit, setFilteredDebit] = useState<number>(0);

  // Theme-compatible gradient colors
  const gradientColors =
    currentTheme === 'light'
      ? ['#f0faff', '#e6f7ff', '#f8fbff'] // Very light blue gradient
      : ['#2a2a2a', '#252525', '#1f1f1f']; // Subtle dark gradient

  const calculateTotals = (transactionList: Transaction[]) => {
    let credit = 0;
    let debit = 0;

    transactionList.forEach(transaction => {
      if (transaction.type === 'cash_in') {
        credit += transaction.amount;
      } else {
        debit += transaction.amount;
      }
    });

    setTotalCredit(credit);
    setTotalDebit(debit);
  };

  const calculateFilteredTotals = (transactionList: Transaction[]) => {
    let credit = 0;
    let debit = 0;

    transactionList.forEach(transaction => {
      if (transaction.type === 'cash_in') {
        credit += transaction.amount;
      } else {
        debit += transaction.amount;
      }
    });

    setFilteredCredit(credit);
    setFilteredDebit(debit);
  };

  const applyFilter = (filter: FilterType, transactionList: Transaction[]) => {
    let filtered: Transaction[] = [];

    switch (filter) {
      case 'credit':
        filtered = transactionList.filter(t => t.type === 'cash_in');
        break;
      case 'debit':
        filtered = transactionList.filter(t => t.type === 'cash_out');
        break;
      default:
        filtered = transactionList;
        break;
    }

    setFilteredTransactions(filtered);
    calculateFilteredTotals(filtered);
  };

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    applyFilter(filter, transactions);
  };

  const loadAccountData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [accountBalance, accountTransactions] = await Promise.all([
        TransactionService.getAccountBalance(accountId),
        TransactionService.getAccountTransactions(accountId),
      ]);

      setBalance(accountBalance);
      setTransactions(accountTransactions);
      calculateTotals(accountTransactions);
      applyFilter(currentFilter, accountTransactions);
    } catch (error) {
      console.error('Error loading account data:', error);
      Alert.alert('Error', 'Failed to load account data');
    } finally {
      setIsLoading(false);
    }
  }, [accountId, currentFilter]);

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

  const handleCredit = async () => {
    try {
      const creditAmount = parseFloat(amount);
      await TransactionService.addTransaction(
        accountId,
        'cash_in',
        creditAmount,
        reason,
      );
      await loadAccountData();
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Credit successful! New balance: ${
          balance + creditAmount
        } Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in credit:', error);
      Alert.alert('Error', 'Failed to add credit transaction');
    }
  };

  const handleDebit = async () => {
    try {
      const debitAmount = parseFloat(amount);

      if (balance < debitAmount) {
        Alert.alert(
          'Insufficient Balance',
          "You don't have enough money for this transaction",
        );
        return;
      }

      await TransactionService.addTransaction(
        accountId,
        'cash_out',
        debitAmount,
        reason,
      );
      await loadAccountData();
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Debit successful! New balance: ${
          balance - debitAmount
        } Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in debit:', error);
      Alert.alert('Error', 'Failed to add debit transaction');
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
    const transactionType = transaction.type === 'cash_in' ? 'Credit' : 'Debit';
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete this ${transactionType} transaction?\n\nAmount: ${transaction.amount.toFixed(
        2,
      )} Tk\nReason: ${
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
  }, [loadAccountData]);

  useFocusEffect(
    useCallback(() => {
      loadAccountData();
    }, [loadAccountData]),
  );

  useEffect(() => {
    loadAccountData();
    navigation.setOptions({
      title: accountName,
    });
  }, [accountId, accountName, navigation, loadAccountData]);

  const renderFilterButton = (
    filter: FilterType,
    label: string,
    icon: string,
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        currentFilter === filter && styles.activeFilterButton,
      ]}
      onPress={() => handleFilterChange(filter)}
      activeOpacity={0.7}
    >
      <FontAwesome5
        name={icon}
        size={16}
        color={
          currentFilter === filter ? colors.textLight : colors.textSecondary
        }
      />
      <Text
        style={[
          styles.filterButtonText,
          currentFilter === filter && styles.activeFilterButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View
          style={[
            styles.transactionIcon,
            {
              backgroundColor:
                item.type === 'cash_in'
                  ? colors.successBackground
                  : colors.dangerBackground,
            },
          ]}
        >
          <FontAwesome5
            name={item.type === 'cash_in' ? 'plus' : 'minus'}
            size={18}
            color={item.type === 'cash_in' ? colors.success : colors.error}
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>
            {item.type === 'cash_in' ? '💰 Credit' : '💸 Debit'}
          </Text>
          <Text style={styles.transactionDate}>{item.dateString}</Text>
          <Text style={styles.reasonText}>{item.reason}</Text>
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
          <View style={styles.transactionActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditTransaction(item)}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="edit" size={14} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTransaction(item)}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="trash" size={14} color={colors.dangerText} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="history" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyStateText}>
        {currentFilter === 'all'
          ? 'No transactions yet'
          : currentFilter === 'credit'
          ? 'No credit transactions'
          : 'No debit transactions'}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {currentFilter === 'all'
          ? 'Add your first transaction to get started'
          : `No ${currentFilter} transactions found`}
      </Text>
    </View>
  );

  // Get modal title and default buttons based on current filter
  const getModalConfig = () => {
    switch (currentFilter) {
      case 'credit':
        return {
          title: 'Add Credit Transaction',
          showCredit: true,
          showDebit: false,
        };
      case 'debit':
        return {
          title: 'Add Debit Transaction',
          showCredit: false,
          showDebit: true,
        };
      default:
        return {
          title: 'Choose Transaction Type',
          showCredit: true,
          showDebit: true,
        };
    }
  };

  const modalConfig = getModalConfig();

  // Dynamic styles
  const styles = StyleSheet.create({
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
    // Account Summary Card
    accountCard: {
      margin: Spacing.lg,
      marginBottom: Spacing.md,
      borderRadius: Spacing.borderRadius.xxl,
      overflow: 'hidden',
      position: 'relative',
      ...shadows.large,
    },
    gradientOverlay: {
      position: 'absolute',
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
      position: 'relative',
      zIndex: 1,
    },
    balanceSection: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    accountNameLabel: {
      fontSize: Typography.fontSize.callout,
      color: colors.textLight,
      marginBottom: Spacing.md,
      fontWeight: Typography.fontWeight.medium,
    },
    balanceLabel: {
      fontSize: Typography.fontSize.callout,
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
      fontSize: Typography.fontSize.footnote,
      color: colors.overlayLight,
      fontStyle: 'italic',
    },
    bottomSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.overlayLight,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: Typography.fontSize.title3,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textLight,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: Typography.fontSize.footnote,
      color: colors.overlayLight,
      textAlign: 'center',
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.overlayLight,
      marginHorizontal: Spacing.lg,
    },
    decorativeCircle1: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.whiteTransparent,
      top: -75,
      right: -75,
      zIndex: 0,
    },
    decorativeCircle2: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.whiteOpaque,
      bottom: -50,
      left: -50,
      zIndex: 0,
    },
    // Transaction Management Box
    managementBox: {
      backgroundColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(45, 45, 45, 0.9)',
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      borderRadius: 10,
      paddingLeft: Spacing.sm,
      paddingRight: Spacing.sm,
      paddingVertical: Spacing.md,
      ...shadows.medium,
      borderWidth: 1,
      borderColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.1)',
    },
    boxTitle: {
      fontSize: Typography.fontSize.title3,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.gap.medium,
    },
    input: {
      flex: 1,
      height: Spacing.height.input,
      borderWidth: Spacing.width.border,
      borderColor: colors.border,
      borderRadius: Spacing.borderRadius.medium,
      paddingHorizontal: Spacing.sm,
      fontSize: Typography.fontSize.body,
      backgroundColor: colors.veryLightGray,
      color: colors.textPrimary,
    },
    updateButton: {
      backgroundColor: colors.secondary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.sm,
      borderRadius: Spacing.borderRadius.medium,
      minWidth: 80,
    },
    updateButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.body,
      fontWeight: Typography.fontWeight.semibold,
      textAlign: 'center',
    },
    // Filter Buttons
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      gap: Spacing.sm,
    },
    filterButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.sm,
      borderRadius: Spacing.borderRadius.medium,
      backgroundColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(45, 45, 45, 0.7)',
      borderWidth: 1,
      borderColor: colors.border,
      gap: Spacing.xs,
    },
    activeFilterButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterButtonText: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textSecondary,
    },
    activeFilterButtonText: {
      color: colors.textLight,
    },
    // Transaction History
    transactionsList: {
      marginBottom: Spacing.xxxl,
      marginTop: Spacing.sm,
    },
    transactionsHeader: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      marginBottom: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transactionsTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
    },
    filterSummary: {
      fontSize: Typography.fontSize.small,
      color: colors.textSecondary,
      fontStyle: 'italic',
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
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionType: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    transactionDate: {
      fontSize: Typography.fontSize.small,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    reasonText: {
      fontSize: Typography.fontSize.regular,
      color: colors.textSecondary,
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.bold,
      marginBottom: Spacing.sm,
    },
    transactionActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    editButton: {
      backgroundColor: colors.veryLightGray,
      padding: Spacing.sm,
      borderRadius: Spacing.borderRadius.small,
    },
    deleteButton: {
      backgroundColor: colors.dangerBackground,
      padding: Spacing.sm,
      borderRadius: Spacing.borderRadius.small,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.xxl,
      marginHorizontal: Spacing.lg,
    },
    emptyStateText: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textSecondary,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
      textAlign: 'center',
    },
    emptyStateSubtext: {
      fontSize: Typography.fontSize.medium,
      color: colors.textTertiary,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: Spacing.lg,
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.xxl,
      padding: Spacing.xxl,
      width: '100%',
      maxWidth: 350,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
      textAlign: 'center',
    },
    modalAmount: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.primary,
      marginBottom: Spacing.xl,
    },
    reasonContainer: {
      width: '100%',
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
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: Spacing.gap.medium,
      marginBottom: Spacing.xl,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderRadius: Spacing.borderRadius.large,
      alignItems: 'center',
    },
    creditButton: {
      backgroundColor: colors.success,
    },
    debitButton: {
      backgroundColor: colors.error,
    },
    updateTransactionButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: Spacing.gap.medium,
    },
    actionButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: Spacing.borderRadius.medium,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.gray,
    },
    cancelButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.medium,
    },
  });

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
        {/* Account Summary Card */}
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
                  {currentFilter === 'all'
                    ? totalCredit.toFixed(2)
                    : filteredCredit.toFixed(2)}{' '}
                  Tk
                </Text>
                <Text style={styles.statLabel}>
                  {currentFilter === 'all' ? 'Total Credit' : 'Filtered Credit'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {currentFilter === 'all'
                    ? totalDebit.toFixed(2)
                    : filteredDebit.toFixed(2)}{' '}
                  Tk
                </Text>
                <Text style={styles.statLabel}>
                  {currentFilter === 'all' ? 'Total Debit' : 'Filtered Debit'}
                </Text>
              </View>
            </View>
          </View>

          {/* Decorative elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        {/* Transaction Management Box */}
        <View style={styles.managementBox}>
          <Text style={styles.boxTitle}>Add Transaction</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Amount (Tk)"
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
              <Text style={styles.updateButtonText}>
                <MaterialIcons
                  name="history-edu"
                  size={25}
                  color={colors.textLight}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {renderFilterButton('all', 'All', 'list')}
          {renderFilterButton('credit', 'Credit', 'plus')}
          {renderFilterButton('debit', 'Debit', 'minus')}
        </View>

        {/* Transaction History */}
        <View style={styles.transactionsList}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>
              Transaction History ({filteredTransactions.length})
            </Text>
            {currentFilter !== 'all' && (
              <Text style={styles.filterSummary}>
                Showing {currentFilter} only
              </Text>
            )}
          </View>

          <FlatList
            data={filteredTransactions}
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
              <Text style={styles.modalTitle}>{modalConfig.title}</Text>
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

              <View
                style={[
                  styles.modalButtons,
                  (!modalConfig.showCredit || !modalConfig.showDebit) && {
                    justifyContent: 'center',
                  },
                ]}
              >
                {modalConfig.showCredit && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.creditButton]}
                    onPress={handleCredit}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalButtonText}>💰 Credit</Text>
                  </TouchableOpacity>
                )}

                {modalConfig.showDebit && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.debitButton]}
                    onPress={handleDebit}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalButtonText}>💸 Debit</Text>
                  </TouchableOpacity>
                )}
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
                {editingTransaction?.type === 'cash_in' ? 'Credit' : 'Debit'}
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
