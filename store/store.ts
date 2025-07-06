import { TransactionStore } from './transactionStore';
import { StorageService } from './storage';
import { Transaction, AppData, TransactionStats } from './types';

// Main store interface that combines all functionality
const Store = {
  // Transaction operations
  Transaction: TransactionStore,

  // Storage operations
  Storage: StorageService,

  // Convenience methods that combine common operations
  async loadData(): Promise<AppData> {
    return await TransactionStore.loadAppData();
  },

  async addCashIn(
    currentBalance: number,
    currentTransactions: Transaction[],
    amount: number,
    reason: string = '',
  ): Promise<AppData> {
    return await TransactionStore.addCashIn(
      currentBalance,
      currentTransactions,
      amount,
      reason,
    );
  },

  async addCashOut(
    currentBalance: number,
    currentTransactions: Transaction[],
    amount: number,
    reason: string = '',
  ): Promise<AppData> {
    return await TransactionStore.addCashOut(
      currentBalance,
      currentTransactions,
      amount,
      reason,
    );
  },

  async deleteTransaction(
    currentBalance: number,
    currentTransactions: Transaction[],
    transactionToDelete: Transaction,
  ): Promise<AppData> {
    return await TransactionStore.deleteTransaction(
      currentBalance,
      currentTransactions,
      transactionToDelete,
    );
  },

  getLastTransactionAmounts(transactions: Transaction[]): TransactionStats {
    return TransactionStore.getLastTransactionAmounts(transactions);
  },

  getTransactionStats(transactions: Transaction[]) {
    return TransactionStore.getTransactionStats(transactions);
  },

  async resetAllData(): Promise<void> {
    return await TransactionStore.resetAllData();
  },
};

export default Store;
