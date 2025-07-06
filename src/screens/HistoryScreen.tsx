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
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionService } from '../database/services/TransactionService';
import { AccountService } from '../database/services/AccountService';
import { Account } from '../database/models/Account';
import { useTheme } from '../contexts';

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
    <View
      style={[
        styles.transactionCard,
        {
          backgroundColor:
            currentTheme === 'light'
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(45, 45, 45, 0.9)',
        },
      ]}
    >
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
          <Text style={[styles.accountName, { color: colors.primary }]}>
            {item.accountName}
          </Text>
          <Text style={[styles.transactionType, { color: colors.textPrimary }]}>
            {item.type === 'cash_in' ? '💰 Credit' : '💸 Debit'}
          </Text>
          <Text
            style={[styles.transactionDate, { color: colors.textSecondary }]}
          >
            {item.dateString}
          </Text>
          <Text style={[styles.reasonText, { color: colors.textSecondary }]}>
            {item.reason}
          </Text>
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
      <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            Filter Transactions
          </Text>

          <View style={styles.filterSection}>
            <Text
              style={[styles.filterSectionTitle, { color: colors.textPrimary }]}
            >
              Transaction Type
            </Text>
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
                    { backgroundColor: colors.veryLightGray },
                    currentFilter === option.key && {
                      backgroundColor: colors.primary,
                    },
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
                      { color: colors.textSecondary },
                      currentFilter === option.key && {
                        color: colors.textLight,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text
              style={[styles.filterSectionTitle, { color: colors.textPrimary }]}
            >
              Account
            </Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  { backgroundColor: colors.veryLightGray },
                  selectedAccount === 'all' && {
                    backgroundColor: colors.primary,
                  },
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
                    { color: colors.textSecondary },
                    selectedAccount === 'all' && {
                      color: colors.textLight,
                      fontWeight: '600',
                    },
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
                    { backgroundColor: colors.veryLightGray },
                    selectedAccount === account.id && {
                      backgroundColor: colors.primary,
                    },
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
                      { color: colors.textSecondary },
                      selectedAccount === account.id && {
                        color: colors.textLight,
                        fontWeight: '600',
                      },
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
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => handleFilterChange(currentFilter, selectedAccount)}
            >
              <Text
                style={[styles.applyButtonText, { color: colors.textLight }]}
              >
                Apply Filters
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.gray }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text
                style={[styles.cancelButtonText, { color: colors.textLight }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="history" size={64} color={colors.textTertiary} />
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        No transactions found
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>
        {currentFilter !== 'all' || selectedAccount !== 'all'
          ? 'Try adjusting your filters'
          : 'Add your first transaction to get started'}
      </Text>
    </View>
  );

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
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading transaction history...
          </Text>
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
          <ImageBackground
            source={require('../../assets/images/naturalflower.jpg')}
            style={styles.imageBackground}
            imageStyle={{ borderRadius: 20 }}
            blurRadius={8}
          >
            <View style={styles.overlay} />
            <View style={styles.cardContentContainer}>
              <Text style={[styles.summaryTitle, { color: colors.textLight }]}>
                Transaction Summary
              </Text>

              {/* Grid Stats Layout */}
              <View style={styles.statsGridRow}>
                <View style={styles.statGridItem}>
                  <FontAwesome5
                    name="arrow-up"
                    size={22}
                    color={colors.success}
                    style={{ marginBottom: 2 }}
                  />
                  <Text
                    style={[styles.statValueGrid, { color: colors.textLight }]}
                  >
                    {filteredCredit.toFixed(2)} Tk
                  </Text>
                  <Text
                    style={[
                      styles.statLabelGrid,
                      { color: colors.overlayLight },
                    ]}
                  >
                    Credit
                  </Text>
                </View>
                <View style={styles.statGridItem}>
                  <FontAwesome5
                    name="arrow-down"
                    size={22}
                    color={colors.error}
                    style={{ marginBottom: 2 }}
                  />
                  <Text
                    style={[styles.statValueGrid, { color: colors.textLight }]}
                  >
                    {filteredDebit.toFixed(2)} Tk
                  </Text>
                  <Text
                    style={[
                      styles.statLabelGrid,
                      { color: colors.overlayLight },
                    ]}
                  >
                    Debit
                  </Text>
                </View>
              </View>
              <View style={styles.transactionsStatRow}>
                <FontAwesome5
                  name="list"
                  size={20}
                  color={colors.textLight}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.transactionsStatValue,
                    { color: colors.textLight },
                  ]}
                >
                  {filteredTransactions.length}
                </Text>
                <Text
                  style={[
                    styles.transactionsStatLabel,
                    { color: colors.overlayLight },
                  ]}
                >
                  Transactions
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Transaction List */}
        <View style={styles.transactionsList}>
          <View style={styles.transactionsHeader}>
            <Text
              style={[styles.transactionsTitle, { color: colors.textPrimary }]}
            >
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
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="filter" size={24} color={colors.textLight} />
        </TouchableOpacity>

        {/* Filter Modal */}
        {renderFilterModal()}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  // Summary Card
  summaryCard: {
    margin: 16,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  imageBackground: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(80, 80, 160, 0.3)', // adjust for your theme
    borderRadius: 20,
  },
  cardContentContainer: {
    padding: 10,
    position: 'relative',
    zIndex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 8,
    gap: 12,
  },
  statGridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  statValueGrid: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabelGrid: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.85,
  },
  transactionsStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 2,
  },
  transactionsStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 4,
  },
  transactionsStatLabel: {
    fontSize: 15,
    opacity: 0.85,
  },
  // Transaction List
  transactionsList: {
    flex: 1,
    marginTop: 16,
  },
  transactionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  transactionCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
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
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
  },
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 120, // Safe area bottom + tab bar height
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  filterOptionText: {
    fontSize: 16,
  },
  modalButtons: {
    gap: 12,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
  },
});
