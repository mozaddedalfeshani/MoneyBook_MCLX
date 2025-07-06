import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionService } from '../database/services/TransactionService';
import { AccountService } from '../database/services/AccountService';
import { Account } from '../database/models/Account';
import { useTheme } from '../contexts';

// Typography styles
const Typography = {
  fontSize: {
    tiny: 10,
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    xxxl: 36,
  },
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Spacing styles
const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  borderRadius: {
    small: 8,
    medium: 10,
    large: 12,
    xl: 15,
    xxl: 20,
  },
};

interface TransactionWithAccount {
  id: string;
  accountId: string;
  accountName: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
  dateString: string;
  timestamp: number;
}

type FilterType = 'all' | 'credit' | 'debit';

export default function HistoryScreen({ navigation }: any) {
  const { colors, currentTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [allTransactions, setAllTransactions] = useState<
    TransactionWithAccount[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionWithAccount[]
  >([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Statistics
  const [filteredCredit, setFilteredCredit] = useState<number>(0);
  const [filteredDebit, setFilteredDebit] = useState<number>(0);

  // Theme-compatible gradient colors
  const gradientColors =
    currentTheme === 'light'
      ? ['#f0faff', '#e6f7ff', '#f8fbff']
      : ['#2a2a2a', '#252525', '#1f1f1f'];

  const getShadows = (colors: any) => ({
    card: {
      shadowColor: colors.shadowPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    fab: {
      shadowColor: colors.shadowSecondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  });

  const shadows = getShadows(colors);

  const calculateFilteredTotals = (
    transactionList: TransactionWithAccount[],
  ) => {
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

  const applyFilters = useCallback(
    (
      typeFilter: FilterType,
      accountFilter: string,
      transactionList: TransactionWithAccount[],
    ) => {
      let filtered = transactionList;

      // Filter by transaction type
      if (typeFilter === 'credit') {
        filtered = filtered.filter(t => t.type === 'cash_in');
      } else if (typeFilter === 'debit') {
        filtered = filtered.filter(t => t.type === 'cash_out');
      }

      // Filter by account
      if (accountFilter !== 'all') {
        filtered = filtered.filter(t => t.accountId === accountFilter);
      }

      setFilteredTransactions(filtered);
      calculateFilteredTotals(filtered);
    },
    [],
  );

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [transactions, accountsList] = await Promise.all([
        TransactionService.getAllTransactions(),
        AccountService.getAllAccounts(),
      ]);

      // Create a map of account IDs to names for quick lookup
      const accountMap = accountsList.reduce((map, account) => {
        map[account.id] = account.name;
        return map;
      }, {} as Record<string, string>);

      // Add account names to transactions
      const transactionsWithAccounts: TransactionWithAccount[] =
        transactions.map(transaction => ({
          id: transaction.id,
          accountId: transaction.accountId,
          accountName: accountMap[transaction.accountId] || 'Unknown Account',
          type: transaction.type,
          amount: transaction.amount,
          reason: transaction.reason,
          dateString: transaction.dateString,
          timestamp: transaction.timestamp,
        }));

      setAllTransactions(transactionsWithAccounts);
      setAccounts(accountsList);
      applyFilters(currentFilter, selectedAccount, transactionsWithAccounts);
    } catch (error) {
      console.error('Error loading history data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilter, selectedAccount, applyFilters]);

  const handleFilterChange = (
    typeFilter: FilterType,
    accountFilter: string,
  ) => {
    setCurrentFilter(typeFilter);
    setSelectedAccount(accountFilter);
    applyFilters(typeFilter, accountFilter, allTransactions);
    setFilterModalVisible(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  useEffect(() => {
    loadData();
    navigation.setOptions({
      title: 'Transaction History',
    });
  }, [navigation, loadData]);

  const renderTransaction = ({ item }: { item: TransactionWithAccount }) => (
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
          <Text style={styles.accountName}>{item.accountName}</Text>
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
            {(item.amount || 0).toFixed(2)} Tk
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Transactions</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Transaction Type</Text>
            <View style={styles.filterOptions}>
              {[
                { key: 'all', label: 'All Types', icon: 'list' },
                { key: 'credit', label: 'Credit Only', icon: 'plus' },
                { key: 'debit', label: 'Debit Only', icon: 'minus' },
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterOption,
                    currentFilter === option.key && styles.activeFilterOption,
                  ]}
                  onPress={() => setCurrentFilter(option.key as FilterType)}
                >
                  <FontAwesome5
                    name={option.icon}
                    size={16}
                    color={
                      currentFilter === option.key
                        ? colors.textLight
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.filterOptionText,
                      currentFilter === option.key &&
                        styles.activeFilterOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Account</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedAccount === 'all' && styles.activeFilterOption,
                ]}
                onPress={() => setSelectedAccount('all')}
              >
                <FontAwesome5
                  name="globe"
                  size={16}
                  color={
                    selectedAccount === 'all'
                      ? colors.textLight
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedAccount === 'all' && styles.activeFilterOptionText,
                  ]}
                >
                  All Accounts
                </Text>
              </TouchableOpacity>

              {accounts.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.filterOption,
                    selectedAccount === account.id && styles.activeFilterOption,
                  ]}
                  onPress={() => setSelectedAccount(account.id)}
                >
                  <FontAwesome5
                    name="wallet"
                    size={16}
                    color={
                      selectedAccount === account.id
                        ? colors.textLight
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedAccount === account.id &&
                        styles.activeFilterOptionText,
                    ]}
                  >
                    {account.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleFilterChange(currentFilter, selectedAccount)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="history" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyStateText}>No transactions found</Text>
      <Text style={styles.emptyStateSubtext}>
        {currentFilter !== 'all' || selectedAccount !== 'all'
          ? 'Try adjusting your filters'
          : 'Add your first transaction to get started'}
      </Text>
    </View>
  );

  const getFilterSummary = () => {
    const parts = [];

    if (currentFilter !== 'all') {
      parts.push(
        currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1),
      );
    }

    if (selectedAccount !== 'all') {
      const accountName = accounts.find(
        acc => acc.id === selectedAccount,
      )?.name;
      if (accountName) {
        parts.push(accountName);
      }
    }

    return parts.length > 0 ? parts.join(' • ') : 'All Transactions';
  };

  const styles = StyleSheet.create({
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    // Summary Card
    summaryCard: {
      margin: Spacing.lg,
      marginBottom: Spacing.md,
      borderRadius: Spacing.borderRadius.xxl,
      overflow: 'hidden',
      position: 'relative',
      ...shadows.card,
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
      position: 'relative',
      zIndex: 1,
    },
    summaryTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textLight,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    filterSummaryText: {
      fontSize: Typography.fontSize.medium,
      color: colors.overlayLight,
      textAlign: 'center',
      marginBottom: Spacing.xl,
      fontStyle: 'italic',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textLight,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: Typography.fontSize.small,
      color: colors.overlayLight,
      textAlign: 'center',
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.overlayLight,
      marginHorizontal: Spacing.lg,
    },
    // Transaction List
    transactionsList: {
      flex: 1,
      marginTop: Spacing.lg,
    },
    transactionsHeader: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      marginBottom: Spacing.md,
    },
    transactionsTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
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
    accountName: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.primary,
      marginBottom: 2,
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
    },
    // Floating Action Button
    fab: {
      position: 'absolute',
      bottom: insets.bottom + 90, // Safe area bottom + tab bar height
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.fab,
    },
    fabIcon: {
      color: colors.textLight,
    },
    // Empty State
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
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.xl,
      textAlign: 'center',
    },
    filterSection: {
      marginBottom: Spacing.xl,
    },
    filterSectionTitle: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
    },
    filterOptions: {
      gap: Spacing.sm,
    },
    filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: Spacing.borderRadius.medium,
      backgroundColor: colors.veryLightGray,
      gap: Spacing.sm,
    },
    activeFilterOption: {
      backgroundColor: colors.primary,
    },
    filterOptionText: {
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
    },
    activeFilterOptionText: {
      color: colors.textLight,
      fontWeight: Typography.fontWeight.semibold,
    },
    modalButtons: {
      gap: Spacing.md,
    },
    applyButton: {
      backgroundColor: colors.primary,
      paddingVertical: Spacing.lg,
      borderRadius: Spacing.borderRadius.medium,
      alignItems: 'center',
    },
    applyButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
    },
    cancelButton: {
      backgroundColor: colors.gray,
      paddingVertical: Spacing.md,
      borderRadius: Spacing.borderRadius.medium,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
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
          <Text style={styles.loadingText}>Loading transaction history...</Text>
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
      <View style={styles.container}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.gradientOverlay} />
          <View style={styles.cardContentContainer}>
            <Text style={styles.summaryTitle}>Transaction Summary</Text>
            <Text style={styles.filterSummaryText}>{getFilterSummary()}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {filteredCredit.toFixed(2)} Tk
                </Text>
                <Text style={styles.statLabel}>Total Credit</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {filteredDebit.toFixed(2)} Tk
                </Text>
                <Text style={styles.statLabel}>Total Debit</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {filteredTransactions.length}
                </Text>
                <Text style={styles.statLabel}>Transactions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction List */}
        <View style={styles.transactionsList}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>
              All Transactions ({filteredTransactions.length})
            </Text>
          </View>

          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 80, // Safe area bottom + tab bar space
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="filter" size={24} style={styles.fabIcon} />
        </TouchableOpacity>

        {/* Filter Modal */}
        {renderFilterModal()}
      </View>
    </LinearGradient>
  );
}
