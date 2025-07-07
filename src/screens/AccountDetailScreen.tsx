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
  Dimensions,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { TransactionService } from '../database/services/TransactionService';
import { Transaction } from '../database/models/Transaction';
import { useTheme } from '../contexts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive utilities
const responsive = {
  // Width-based scaling
  wp: (percentage: number) => (SCREEN_WIDTH * percentage) / 100,
  // Height-based scaling
  hp: (percentage: number) => (SCREEN_HEIGHT * percentage) / 100,
  // Font scaling based on width
  fontSize: (size: number) => (SCREEN_WIDTH / 375) * size, // 375 is iPhone X width
  // Spacing scaling
  spacing: (size: number) => (SCREEN_WIDTH / 375) * size,
};

// iOS Typography System with responsive sizing
const Typography = {
  // iOS Font Sizes (following iOS Human Interface Guidelines)
  fontSize: {
    // iOS naming
    caption2: responsive.fontSize(11), // Caption 2
    caption1: responsive.fontSize(12), // Caption 1
    footnote: responsive.fontSize(13), // Footnote
    subheadline: responsive.fontSize(15), // Subheadline
    callout: responsive.fontSize(16), // Callout
    body: responsive.fontSize(17), // Body
    headline: responsive.fontSize(17), // Headline
    title3: responsive.fontSize(20), // Title 3
    title2: responsive.fontSize(22), // Title 2
    title1: responsive.fontSize(28), // Title 1
    largeTitle: responsive.fontSize(34), // Large Title

    // Backward compatibility
    tiny: responsive.fontSize(11), // Maps to caption2
    small: responsive.fontSize(13), // Maps to footnote
    regular: responsive.fontSize(17), // Maps to body
    medium: responsive.fontSize(16), // Maps to callout
    large: responsive.fontSize(20), // Maps to title3
    xl: responsive.fontSize(22), // Maps to title2
    xxl: responsive.fontSize(28), // Maps to title1
    xxxl: responsive.fontSize(34), // Maps to largeTitle
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

// iOS Spacing System (8pt grid) with responsive sizing
const Spacing = {
  // Base spacing unit (iOS uses 8pt grid)
  base: responsive.spacing(8),

  // iOS spacing values
  xs: responsive.spacing(4), // 0.5x
  sm: responsive.spacing(8), // 1x
  md: responsive.spacing(16), // 2x
  lg: responsive.spacing(24), // 3x
  xl: responsive.spacing(32), // 4x
  xxl: responsive.spacing(40), // 5x
  xxxl: responsive.spacing(48), // 6x

  // iOS spacing
  margin: {
    xs: responsive.spacing(4),
    sm: responsive.spacing(8),
    md: responsive.spacing(16),
    lg: responsive.spacing(24),
    xl: responsive.spacing(32),
    xxl: responsive.spacing(40),
    xxxl: responsive.spacing(48),
  },

  padding: {
    xs: responsive.spacing(4),
    sm: responsive.spacing(8),
    md: responsive.spacing(16),
    lg: responsive.spacing(24),
    xl: responsive.spacing(32),
    xxl: responsive.spacing(40),
    xxxl: responsive.spacing(48),
  },

  // iOS Border radius (more rounded)
  borderRadius: {
    small: responsive.spacing(8),
    medium: responsive.spacing(12),
    large: responsive.spacing(16),
    xl: responsive.spacing(20),
    xxl: responsive.spacing(24),
    xxxl: responsive.spacing(28),
  },

  // iOS Heights
  height: {
    input: responsive.spacing(44), // iOS standard touch target
    button: responsive.spacing(44), // iOS standard touch target
    card: responsive.hp(25), // 25% of screen height
    icon: responsive.spacing(44), // iOS standard touch target
  },

  // iOS Widths
  width: {
    divider: 0.5, // iOS standard divider
    border: 1,
  },

  // iOS Gaps
  gap: {
    small: responsive.spacing(8),
    medium: responsive.spacing(16),
    large: responsive.spacing(24),
    xl: responsive.spacing(32),
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

  // Date picker states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [useCustomDate, setUseCustomDate] = useState<boolean>(false);
  const [editSelectedDate, setEditSelectedDate] = useState<Date>(new Date());
  const [editShowDatePicker, setEditShowDatePicker] = useState<boolean>(false);
  const [editUseCustomDate, setEditUseCustomDate] = useState<boolean>(false);

  // Theme-compatible gradient colors
  const gradientColors =
    balance < 0
      ? currentTheme === 'light'
        ? ['#ffe6e6', '#ffcccc', '#ffb3b3'] // Light red gradient for negative balance
        : ['#4a1a1a', '#3d1515', '#301010'] // Dark red gradient for negative balance
      : currentTheme === 'light'
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

  const applyFilter = useCallback(
    (filter: FilterType, transactionList: Transaction[]) => {
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
    },
    [],
  );

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
  }, [accountId, currentFilter, applyFilter]);

  const handleUpdatePress = () => {
    if (!amount || parseFloat(amount) === 0) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount (positive or negative)',
      );
      return;
    }
    setModalVisible(true);
  };

  const handleCredit = async () => {
    try {
      const creditAmount = parseFloat(amount);
      const transactionDate = useCustomDate ? selectedDate : new Date();

      await TransactionService.addTransaction(
        accountId,
        'cash_in',
        creditAmount,
        reason,
        transactionDate,
      );
      await loadAccountData();
      setModalVisible(false);
      setAmount('');
      setReason('');
      setUseCustomDate(false);
      setSelectedDate(new Date());

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
      let debitAmount = parseFloat(amount);

      // If amount is negative, make it positive for debit calculation
      if (debitAmount < 0) {
        debitAmount = Math.abs(debitAmount);
      }

      // Show warning if going negative instead of blocking
      if (balance < debitAmount) {
        Alert.alert(
          'Negative Balance Warning',
          `This transaction will put your account in negative balance. Your new balance will be ${(
            balance - debitAmount
          ).toFixed(2)} Tk. Do you want to proceed?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Proceed',
              style: 'destructive',
              onPress: async () => {
                const transactionDate = useCustomDate
                  ? selectedDate
                  : new Date();
                await TransactionService.addTransaction(
                  accountId,
                  'cash_out',
                  debitAmount,
                  reason,
                  transactionDate,
                );
                await loadAccountData();
                setModalVisible(false);
                setAmount('');
                setReason('');
                setUseCustomDate(false);
                setSelectedDate(new Date());

                const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
                Alert.alert(
                  'Success',
                  `Debit successful! New balance: ${
                    balance - debitAmount
                  } Tk${reasonText}`,
                );
              },
            },
          ],
        );
        return;
      }

      const transactionDate = useCustomDate ? selectedDate : new Date();
      await TransactionService.addTransaction(
        accountId,
        'cash_out',
        debitAmount,
        reason,
        transactionDate,
      );
      await loadAccountData();
      setModalVisible(false);
      setAmount('');
      setReason('');
      setUseCustomDate(false);
      setSelectedDate(new Date());

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
    setEditSelectedDate(new Date(transaction.timestamp));
    setEditUseCustomDate(false);
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
      const transactionDate = editUseCustomDate ? editSelectedDate : undefined;

      await TransactionService.updateTransaction(
        editingTransaction,
        newType,
        newAmount,
        reason,
        transactionDate,
      );

      await loadAccountData();
      setEditModalVisible(false);
      setEditingTransaction(null);
      setAmount('');
      setReason('');
      setEditUseCustomDate(false);
      setEditSelectedDate(new Date());

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
    setUseCustomDate(false);
    setSelectedDate(new Date());
    setShowDatePicker(false);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingTransaction(null);
    setReason('');
    setAmount('');
    setEditUseCustomDate(false);
    setEditSelectedDate(new Date());
    setEditShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
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

  // Get modal title and default buttons based on amount and filter
  const getModalConfig = () => {
    const amountValue = parseFloat(amount);

    // If amount is negative, auto-detect as debit
    if (amountValue < 0) {
      return {
        title: 'Negative Amount (Debit)',
        showCredit: false,
        showDebit: true,
        autoDetected: true,
      };
    }

    // If amount is positive, check filter
    switch (currentFilter) {
      case 'credit':
        return {
          title: 'Add Credit Transaction',
          showCredit: true,
          showDebit: false,
          autoDetected: false,
        };
      case 'debit':
        return {
          title: 'Add Debit Transaction',
          showCredit: false,
          showDebit: true,
          autoDetected: false,
        };
      default:
        return {
          title: 'Choose Transaction Type',
          showCredit: true,
          showDebit: true,
          autoDetected: false,
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
    // Account Summary Card - Compact & Charming Design
    accountCard: {
      marginHorizontal: Spacing.lg,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: Spacing.borderRadius.xl,
      overflow: 'hidden',
      height: responsive.hp(30), // Increased height to 24% of screen
      ...shadows.medium,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
    backgroundImageStyle: {
      borderRadius: Spacing.borderRadius.xl,
      opacity: 0.6, // Increased opacity to make background more visible
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor:
        balance < 0
          ? 'rgba(220, 20, 60, 0.65)' // Reduced opacity for negative balance
          : 'rgba(25, 118, 210, 0.60)', // Reduced opacity for positive balance
      borderRadius: Spacing.borderRadius.xl,
    },
    cardContent: {
      flex: 1,
      padding: Spacing.lg,
      justifyContent: 'space-between',
      zIndex: 1,
    },
    // Header section
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accountName: {
      fontSize: Typography.fontSize.title3,
      fontWeight: Typography.fontWeight.semibold,
      color: '#ffffff',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    warningBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: Spacing.borderRadius.medium,
      gap: Spacing.xs,
    },
    warningText: {
      fontSize: Typography.fontSize.caption1,
      color: '#ffffff',
      fontWeight: Typography.fontWeight.medium,
    },
    // Balance display
    balanceDisplay: {
      alignItems: 'center',
      marginVertical: Spacing.sm,
    },
    balanceLabel: {
      fontSize: Typography.fontSize.footnote,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: Spacing.xs,
      textAlign: 'center',
    },
    balanceAmount: {
      fontSize: responsive.fontSize(32),
      fontWeight: Typography.fontWeight.bold,
      color: '#ffffff',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      textAlign: 'center',
    },
    negativeBalance: {
      color: '#ff6b6b', // Brighter red for negative balance
      textShadowColor: 'rgba(139, 0, 0, 0.5)', // Dark red shadow
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    currency: {
      fontSize: responsive.fontSize(20),
      fontWeight: Typography.fontWeight.medium,
    },
    // Stats section
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: Spacing.borderRadius.medium,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    statAmount: {
      fontSize: Typography.fontSize.callout,
      fontWeight: Typography.fontWeight.semibold,
      color: '#ffffff',
    },
    statLabel: {
      fontSize: Typography.fontSize.caption2,
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
    },
    statDivider: {
      width: 1,
      height: responsive.hp(4),
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      marginHorizontal: Spacing.md,
    },
    // Floating decorative elements
    floatingDot1: {
      position: 'absolute',
      width: responsive.wp(8),
      height: responsive.wp(8),
      borderRadius: responsive.wp(4),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      top: Spacing.lg,
      right: Spacing.lg,
      zIndex: 0,
    },
    floatingDot2: {
      position: 'absolute',
      width: responsive.wp(5),
      height: responsive.wp(5),
      borderRadius: responsive.wp(2.5),
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      bottom: Spacing.xl,
      left: Spacing.xl,
      zIndex: 0,
    },
    floatingDot3: {
      position: 'absolute',
      width: responsive.wp(6),
      height: responsive.wp(6),
      borderRadius: responsive.wp(3),
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      top: Spacing.xl,
      left: '30%',
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
    negativeWarning: {
      fontSize: Typography.fontSize.footnote,
      color: colors.error,
      textAlign: 'center',
      marginBottom: Spacing.md,
      fontStyle: 'italic',
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
      width: responsive.wp(11),
      height: responsive.wp(11),
      borderRadius: responsive.wp(5.5),
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
      backgroundColor:
        Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.5)' : colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
      paddingBottom: Platform.OS === 'ios' ? responsive.hp(10) : Spacing.xl,
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.xxl,
      padding: Spacing.xxl,
      width: responsive.wp(90),
      maxWidth: responsive.wp(95),
      alignItems: 'center',
      ...shadows.large,
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
    autoDetectedText: {
      fontSize: Typography.fontSize.footnote,
      color: colors.warning,
      textAlign: 'center',
      marginBottom: Spacing.md,
      fontStyle: 'italic',
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
    modalKeyboardAvoid: {
      width: '100%',
      alignItems: 'center',
    },
    // Date picker styles
    datePickerContainer: {
      width: '100%',
      marginBottom: Spacing.xl,
    },
    datePickerLabel: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
    },
    dateToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    dateToggleText: {
      fontSize: Typography.fontSize.medium,
      color: colors.textPrimary,
      marginRight: Spacing.sm,
    },
    dateDisplayContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: Spacing.width.border,
      borderColor: colors.border,
      borderRadius: Spacing.borderRadius.medium,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: colors.veryLightGray,
    },
    dateDisplayText: {
      flex: 1,
      fontSize: Typography.fontSize.medium,
      color: colors.textPrimary,
      paddingVertical: Spacing.sm,
    },
    datePickerButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Spacing.borderRadius.small,
      marginLeft: Spacing.sm,
    },
    datePickerButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.small,
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
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Account Summary Card */}
            <View style={styles.accountCard}>
              <ImageBackground
                source={
                  balance < 0
                    ? require('../../assets/images/loan.png')
                    : require('../../assets/images/naturalflower.jpg')
                }
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}
              >
                <View style={styles.imageOverlay} />
                <View style={styles.cardContent}>
                  {/* Header with account name and balance status */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.accountName}>{accountName}</Text>
                    {balance < 0 && (
                      <View style={styles.warningBadge}>
                        <FontAwesome5
                          name="exclamation-triangle"
                          size={12}
                          color="#fff"
                        />
                        <Text style={styles.warningText}>Deficit</Text>
                      </View>
                    )}
                  </View>

                  {/* Main balance display */}
                  <View style={styles.balanceDisplay}>
                    <Text style={styles.balanceLabel}>
                      {balance < 0 ? 'Negative Balance' : 'Available Balance'}
                    </Text>
                    <Text
                      style={[
                        styles.balanceAmount,
                        balance < 0 && styles.negativeBalance,
                      ]}
                    >
                      {balance.toFixed(2)}{' '}
                      <Text style={styles.currency}>Tk</Text>
                    </Text>
                  </View>

                  {/* Quick stats in a compact layout */}
                  <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                      <FontAwesome5 name="arrow-up" size={14} color="#4CAF50" />
                      <Text style={styles.statAmount}>
                        {currentFilter === 'all'
                          ? totalCredit.toFixed(0)
                          : filteredCredit.toFixed(0)}
                      </Text>
                      <Text style={styles.statLabel}>Credit</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statBox}>
                      <FontAwesome5
                        name="arrow-down"
                        size={14}
                        color="#f44336"
                      />
                      <Text style={styles.statAmount}>
                        {currentFilter === 'all'
                          ? totalDebit.toFixed(0)
                          : filteredDebit.toFixed(0)}
                      </Text>
                      <Text style={styles.statLabel}>Debit</Text>
                    </View>
                  </View>
                </View>

                {/* Floating decorative elements */}
                <View style={styles.floatingDot1} />
                <View style={styles.floatingDot2} />
                <View style={styles.floatingDot3} />
              </ImageBackground>
            </View>

            {/* Transaction Management Box */}
            <View
              style={[
                styles.managementBox,
                balance < 0 && {
                  borderColor:
                    currentTheme === 'light'
                      ? 'rgba(255, 0, 0, 0.3)'
                      : 'rgba(255, 100, 100, 0.3)',
                },
              ]}
            >
              <Text style={styles.boxTitle}>Add Transaction</Text>

              {balance < 0 && (
                <Text style={styles.negativeWarning}>
                  ⚠️ Account is running negative
                </Text>
              )}

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
              presentationStyle="pageSheet"
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalKeyboardAvoid}
                  >
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>{modalConfig.title}</Text>
                      <Text style={styles.modalAmount}>
                        Amount: {Math.abs(parseFloat(amount) || 0).toFixed(2)}{' '}
                        Tk
                      </Text>
                      {modalConfig.autoDetected && (
                        <Text style={styles.autoDetectedText}>
                          ⚡ Auto-detected as debit transaction
                        </Text>
                      )}

                      <View style={styles.reasonContainer}>
                        <Text style={styles.reasonLabel}>
                          Reason (Optional)
                        </Text>
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

                      {/* Date Picker Section */}
                      <View style={styles.datePickerContainer}>
                        <Text style={styles.datePickerLabel}>
                          Transaction Date
                        </Text>

                        <View style={styles.dateToggleContainer}>
                          <Text style={styles.dateToggleText}>
                            Use custom date:
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.datePickerButton,
                              !useCustomDate && {
                                backgroundColor: colors.gray,
                              },
                            ]}
                            onPress={() => setUseCustomDate(!useCustomDate)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.datePickerButtonText}>
                              {useCustomDate ? 'ON' : 'OFF'}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {useCustomDate && (
                          <View style={styles.dateDisplayContainer}>
                            <Text style={styles.dateDisplayText}>
                              {formatDate(selectedDate)}
                            </Text>
                            <TouchableOpacity
                              style={styles.datePickerButton}
                              onPress={() => setShowDatePicker(true)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.datePickerButtonText}>
                                <FontAwesome5
                                  name="calendar-alt"
                                  size={12}
                                  color={colors.textLight}
                                />
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.modalButtons,
                          (!modalConfig.showCredit ||
                            !modalConfig.showDebit) && {
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
                            <Text style={styles.modalButtonText}>
                              💰 Credit
                            </Text>
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
                  </KeyboardAvoidingView>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {/* Date Picker Modal for Add Transaction */}
            <DatePicker
              modal
              open={showDatePicker}
              date={selectedDate}
              mode="date"
              maximumDate={new Date()}
              onConfirm={date => {
                setShowDatePicker(false);
                setSelectedDate(date);
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
            />

            {/* Edit Transaction Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={editModalVisible}
              onRequestClose={closeEditModal}
              presentationStyle="pageSheet"
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalKeyboardAvoid}
                  >
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Edit Transaction</Text>
                      <Text style={styles.modalAmount}>
                        Type:{' '}
                        {editingTransaction?.type === 'cash_in'
                          ? 'Credit'
                          : 'Debit'}
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

                      {/* Edit Date Picker Section */}
                      <View style={styles.datePickerContainer}>
                        <Text style={styles.datePickerLabel}>
                          Transaction Date
                        </Text>

                        <View style={styles.dateToggleContainer}>
                          <Text style={styles.dateToggleText}>
                            Update date:
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.datePickerButton,
                              !editUseCustomDate && {
                                backgroundColor: colors.gray,
                              },
                            ]}
                            onPress={() =>
                              setEditUseCustomDate(!editUseCustomDate)
                            }
                            activeOpacity={0.7}
                          >
                            <Text style={styles.datePickerButtonText}>
                              {editUseCustomDate ? 'ON' : 'OFF'}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.dateDisplayContainer}>
                          <Text style={styles.dateDisplayText}>
                            Current: {formatDate(editSelectedDate)}
                          </Text>
                        </View>

                        {editUseCustomDate && (
                          <View style={styles.dateDisplayContainer}>
                            <Text style={styles.dateDisplayText}>
                              New: {formatDate(editSelectedDate)}
                            </Text>
                            <TouchableOpacity
                              style={styles.datePickerButton}
                              onPress={() => setEditShowDatePicker(true)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.datePickerButtonText}>
                                <FontAwesome5
                                  name="calendar-alt"
                                  size={12}
                                  color={colors.textLight}
                                />
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      <View style={styles.modalButtons}>
                        <TouchableOpacity
                          style={[
                            styles.modalButton,
                            styles.updateTransactionButton,
                          ]}
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
                  </KeyboardAvoidingView>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {/* Date Picker Modal for Edit Transaction */}
            <DatePicker
              modal
              open={editShowDatePicker}
              date={editSelectedDate}
              mode="date"
              maximumDate={new Date()}
              onConfirm={date => {
                setEditShowDatePicker(false);
                setEditSelectedDate(date);
              }}
              onCancel={() => {
                setEditShowDatePicker(false);
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
