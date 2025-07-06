import { TransactionService } from '../database/services/TransactionService';
import { MigrationService } from '../database/services/MigrationService';
import { Transaction } from '../database/models/Transaction';

// Legacy interface for compatibility
export interface LegacyTransaction {
  id: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
  date: string;
  timestamp: number;
}

export interface AppData {
  balance: number;
  transactions: LegacyTransaction[];
}

export class Store {
  // Initialize store and run migration if needed
  static async initialize(): Promise<void> {
    try {
      await MigrationService.migrateData();
    } catch (error) {
      console.error('Error during store initialization:', error);
    }
  }

  // Convert WatermelonDB Transaction to legacy format for UI compatibility
  private static convertToLegacyFormat(
    transaction: Transaction,
  ): LegacyTransaction {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      reason: transaction.reason,
      date: transaction.dateString,
      timestamp: transaction.timestamp,
    };
  }

  // Load all data (balance and transactions)
  static async loadData(): Promise<AppData> {
    try {
      const [balance, transactions] = await Promise.all([
        TransactionService.getCurrentBalance(),
        TransactionService.getAllTransactions(),
      ]);

      const legacyTransactions = transactions.map(this.convertToLegacyFormat);

      return {
        balance,
        transactions: legacyTransactions,
      };
    } catch (error) {
      console.error('Error loading data:', error);
      return { balance: 0, transactions: [] };
    }
  }

  // Add cash in transaction
  static async addCashIn(
    currentBalance: number,
    currentTransactions: LegacyTransaction[],
    amount: number,
    reason: string,
  ): Promise<AppData> {
    try {
      await TransactionService.addTransaction('cash_in', amount, reason);
      return await this.loadData();
    } catch (error) {
      console.error('Error adding cash in:', error);
      throw error;
    }
  }

  // Add cash out transaction
  static async addCashOut(
    currentBalance: number,
    currentTransactions: LegacyTransaction[],
    amount: number,
    reason: string,
  ): Promise<AppData> {
    try {
      const balance = await TransactionService.getCurrentBalance();

      if (balance < amount) {
        throw new Error('Insufficient balance');
      }

      await TransactionService.addTransaction('cash_out', amount, reason);
      return await this.loadData();
    } catch (error) {
      console.error('Error adding cash out:', error);
      throw error;
    }
  }

  // Delete transaction
  static async deleteTransaction(
    currentBalance: number,
    currentTransactions: LegacyTransaction[],
    transactionToDelete: LegacyTransaction,
  ): Promise<AppData> {
    try {
      // Find the WatermelonDB transaction by ID
      const allTransactions = await TransactionService.getAllTransactions();
      const transaction = allTransactions.find(
        t => t.id === transactionToDelete.id,
      );

      if (transaction) {
        await TransactionService.deleteTransaction(transaction);
      }

      return await this.loadData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Get last transaction amounts for statistics
  static async getLastTransactionAmounts(
    transactions: LegacyTransaction[],
  ): Promise<{
    lastCashIn: number;
    lastCashOut: number;
  }> {
    try {
      return await TransactionService.getLastTransactionAmounts();
    } catch (error) {
      console.error('Error getting last transaction amounts:', error);
      return { lastCashIn: 0, lastCashOut: 0 };
    }
  }

  // Clear all data (for reset functionality)
  static async clearAllData(): Promise<void> {
    try {
      await TransactionService.clearAllTransactions();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

export default Store;
