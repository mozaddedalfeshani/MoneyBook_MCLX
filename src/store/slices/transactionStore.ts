import { Transaction, AppData, TransactionStats } from '../types/types';
import { StorageService } from '../storage';

export class TransactionStore {
  // Generate unique transaction ID
  private static generateTransactionId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Format date for display
  private static formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Get last transaction amounts for display
  static getLastTransactionAmounts(
    transactions: Transaction[],
  ): TransactionStats {
    const lastCashIn =
      transactions
        .filter(t => t.type === 'cash_in')
        .sort((a, b) => b.timestamp - a.timestamp)[0]?.amount || 0;

    const lastCashOut =
      transactions
        .filter(t => t.type === 'cash_out')
        .sort((a, b) => b.timestamp - a.timestamp)[0]?.amount || 0;

    return { lastCashIn, lastCashOut };
  }

  // Load all app data
  static async loadAppData(): Promise<AppData> {
    try {
      return await StorageService.loadAppData();
    } catch (error) {
      console.error('Error in loadAppData:', error);
      throw error;
    }
  }

  // Add a new cash in transaction
  static async addCashIn(
    currentBalance: number,
    currentTransactions: Transaction[],
    amount: number,
    reason: string,
  ): Promise<AppData> {
    try {
      const newBalance = currentBalance + amount;

      const newTransaction: Transaction = {
        id: this.generateTransactionId(),
        type: 'cash_in',
        amount: amount,
        reason: reason.trim() || 'No reason provided',
        date: this.formatDate(Date.now()),
        timestamp: Date.now(),
      };

      const newTransactions = [newTransaction, ...currentTransactions];
      const newAppData: AppData = {
        balance: newBalance,
        transactions: newTransactions,
      };

      await StorageService.saveAppData(newAppData);
      return newAppData;
    } catch (error) {
      console.error('Error in addCashIn:', error);
      throw error;
    }
  }

  // Add a new cash out transaction
  static async addCashOut(
    currentBalance: number,
    currentTransactions: Transaction[],
    amount: number,
    reason: string,
  ): Promise<AppData> {
    try {
      if (amount > currentBalance) {
        throw new Error('Insufficient balance');
      }

      const newBalance = currentBalance - amount;

      const newTransaction: Transaction = {
        id: this.generateTransactionId(),
        type: 'cash_out',
        amount: amount,
        reason: reason.trim() || 'No reason provided',
        date: this.formatDate(Date.now()),
        timestamp: Date.now(),
      };

      const newTransactions = [newTransaction, ...currentTransactions];
      const newAppData: AppData = {
        balance: newBalance,
        transactions: newTransactions,
      };

      await StorageService.saveAppData(newAppData);
      return newAppData;
    } catch (error) {
      console.error('Error in addCashOut:', error);
      throw error;
    }
  }

  // Delete a transaction and adjust balance
  static async deleteTransaction(
    currentBalance: number,
    currentTransactions: Transaction[],
    transactionToDelete: Transaction,
  ): Promise<AppData> {
    try {
      // Calculate new balance
      let newBalance = currentBalance;
      if (transactionToDelete.type === 'cash_in') {
        // If deleting cash in, subtract from balance
        newBalance = currentBalance - transactionToDelete.amount;
      } else {
        // If deleting cash out, add back to balance
        newBalance = currentBalance + transactionToDelete.amount;
      }

      // Remove transaction from list
      const newTransactions = currentTransactions.filter(
        t => t.id !== transactionToDelete.id,
      );

      const newAppData: AppData = {
        balance: newBalance,
        transactions: newTransactions,
      };

      await StorageService.saveAppData(newAppData);
      return newAppData;
    } catch (error) {
      console.error('Error in deleteTransaction:', error);
      throw error;
    }
  }

  // Get transaction statistics
  static getTransactionStats(transactions: Transaction[]): {
    totalCashIn: number;
    totalCashOut: number;
    transactionCount: number;
    lastTransactionDate: string | null;
  } {
    const totalCashIn = transactions
      .filter(t => t.type === 'cash_in')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCashOut = transactions
      .filter(t => t.type === 'cash_out')
      .reduce((sum, t) => sum + t.amount, 0);

    const transactionCount = transactions.length;

    const lastTransaction =
      transactions.length > 0
        ? transactions.sort((a, b) => b.timestamp - a.timestamp)[0]
        : null;

    return {
      totalCashIn,
      totalCashOut,
      transactionCount,
      lastTransactionDate: lastTransaction ? lastTransaction.date : null,
    };
  }

  // Reset all data (useful for testing or user reset)
  static async resetAllData(): Promise<void> {
    try {
      await StorageService.clearAppData();
    } catch (error) {
      console.error('Error in resetAllData:', error);
      throw error;
    }
  }
}
