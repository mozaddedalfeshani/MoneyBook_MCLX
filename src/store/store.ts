import { TransactionService } from '../database/services/TransactionService';
import { AccountService } from '../database/services/AccountService';
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
  private static defaultAccountId: string | null = null;

  // Initialize store and run migration if needed
  static async initialize(): Promise<void> {
    try {
      await MigrationService.migrateData();
      // Cache the default account ID for legacy compatibility
      this.defaultAccountId = await this.getDefaultAccountId();
    } catch (error) {
      console.error('Error during store initialization:', error);
    }
  }

  // Get the default account ID (creates one if none exists)
  private static async getDefaultAccountId(): Promise<string> {
    if (this.defaultAccountId) {
      return this.defaultAccountId;
    }

    try {
      // Get existing accounts
      const accounts = await AccountService.getAllAccounts();

      if (accounts.length > 0) {
        this.defaultAccountId = accounts[0].id;
        return this.defaultAccountId;
      }

      // No accounts exist, create a default one
      const defaultAccount = await AccountService.createAccount('Main Account');
      this.defaultAccountId = defaultAccount.id;
      return this.defaultAccountId;
    } catch (error) {
      console.error('Error getting default account:', error);
      throw error;
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

  // Load all data (balance and transactions) for the default account (legacy compatibility)
  static async loadData(): Promise<AppData> {
    try {
      const accountId = await this.getDefaultAccountId();
      const [balance, transactions] = await Promise.all([
        TransactionService.getAccountBalance(accountId),
        TransactionService.getAccountTransactions(accountId),
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

  // Add cash in transaction to default account (legacy compatibility)
  static async addCashIn(
    currentBalance: number,
    currentTransactions: LegacyTransaction[],
    amount: number,
    reason: string,
  ): Promise<AppData> {
    try {
      const accountId = await this.getDefaultAccountId();
      await TransactionService.addTransaction(
        accountId,
        'cash_in',
        amount,
        reason,
      );
      return await this.loadData();
    } catch (error) {
      console.error('Error adding cash in:', error);
      throw error;
    }
  }

  // Add cash out transaction to default account (legacy compatibility)
  static async addCashOut(
    currentBalance: number,
    currentTransactions: LegacyTransaction[],
    amount: number,
    reason: string,
  ): Promise<AppData> {
    try {
      const accountId = await this.getDefaultAccountId();
      const balance = await TransactionService.getAccountBalance(accountId);

      if (balance < amount) {
        throw new Error('Insufficient balance');
      }

      await TransactionService.addTransaction(
        accountId,
        'cash_out',
        amount,
        reason,
      );
      return await this.loadData();
    } catch (error) {
      console.error('Error adding cash out:', error);
      throw error;
    }
  }

  // Delete transaction from default account (legacy compatibility)
  static async deleteTransaction(
    currentBalance: number,
    currentTransactions: LegacyTransaction[],
    transactionToDelete: LegacyTransaction,
  ): Promise<AppData> {
    try {
      // Find the WatermelonDB transaction by ID
      const transaction = await TransactionService.getTransactionById(
        transactionToDelete.id,
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

  // Get last transaction amounts for statistics from default account (legacy compatibility)
  static async getLastTransactionAmounts(
    transactions: LegacyTransaction[],
  ): Promise<{
    lastCashIn: number;
    lastCashOut: number;
  }> {
    try {
      const accountId = await this.getDefaultAccountId();
      return await TransactionService.getAccountLastTransactionAmounts(
        accountId,
      );
    } catch (error) {
      console.error('Error getting last transaction amounts:', error);
      return { lastCashIn: 0, lastCashOut: 0 };
    }
  }

  // Clear all data for default account (legacy compatibility)
  static async clearAllData(): Promise<void> {
    try {
      const accountId = await this.getDefaultAccountId();
      await TransactionService.clearAccountTransactions(accountId);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Get global balance and statistics across all accounts
  static async getGlobalStats(): Promise<{
    globalBalance: number;
    totalAccounts: number;
    globalTransactionCount: number;
    globalCashIn: number;
    globalCashOut: number;
  }> {
    try {
      // Get data step by step for better debugging
      const allTransactions = await TransactionService.getAllTransactions();
      const accounts = await AccountService.getAllAccounts();
      const globalBalance = await TransactionService.getCurrentBalance();

      const globalCashIn = allTransactions
        .filter(t => t.type === 'cash_in')
        .reduce((sum, t) => sum + t.amount, 0);

      const globalCashOut = allTransactions
        .filter(t => t.type === 'cash_out')
        .reduce((sum, t) => sum + t.amount, 0);

      // Use manual calculation if service returns 0 but we have transactions
      const finalBalance =
        globalBalance !== 0 ? globalBalance : globalCashIn - globalCashOut;

      return {
        globalBalance: finalBalance,
        totalAccounts: accounts.length,
        globalTransactionCount: allTransactions.length,
        globalCashIn,
        globalCashOut,
      };
    } catch (error) {
      console.error('Error getting global stats:', error);
      return {
        globalBalance: 0,
        totalAccounts: 0,
        globalTransactionCount: 0,
        globalCashIn: 0,
        globalCashOut: 0,
      };
    }
  }

  // NEW METHODS FOR ACCOUNT-BASED SYSTEM

  // Get all accounts with statistics
  static async getAllAccountsWithStats() {
    try {
      return await AccountService.getAllAccountsWithStats();
    } catch (error) {
      console.error('Error getting accounts with stats:', error);
      throw error;
    }
  }

  // Create a new account
  static async createAccount(name: string) {
    try {
      return await AccountService.createAccount(name);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  // Update account name
  static async updateAccount(accountId: string, newName: string) {
    try {
      const account = await AccountService.getAccountById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }
      return await AccountService.updateAccount(account, newName);
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  // Delete account and all its transactions
  static async deleteAccount(accountId: string) {
    try {
      const account = await AccountService.getAccountById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }
      await AccountService.deleteAccount(account);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Get account data
  static async getAccountData(accountId: string): Promise<{
    balance: number;
    transactions: Transaction[];
    lastTransactionAmounts: {
      lastCashIn: number;
      lastCashOut: number;
    };
  }> {
    try {
      const [balance, transactions, lastTransactionAmounts] = await Promise.all(
        [
          TransactionService.getAccountBalance(accountId),
          TransactionService.getAccountTransactions(accountId),
          TransactionService.getAccountLastTransactionAmounts(accountId),
        ],
      );

      return {
        balance,
        transactions,
        lastTransactionAmounts,
      };
    } catch (error) {
      console.error('Error getting account data:', error);
      throw error;
    }
  }

  // Add transaction to specific account
  static async addAccountTransaction(
    accountId: string,
    type: 'cash_in' | 'cash_out',
    amount: number,
    reason: string,
  ) {
    try {
      return await TransactionService.addTransaction(
        accountId,
        type,
        amount,
        reason,
      );
    } catch (error) {
      console.error('Error adding account transaction:', error);
      throw error;
    }
  }

  // Update transaction
  static async updateTransaction(
    transactionId: string,
    type: 'cash_in' | 'cash_out',
    amount: number,
    reason: string,
  ) {
    try {
      const transaction = await TransactionService.getTransactionById(
        transactionId,
      );
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return await TransactionService.updateTransaction(
        transaction,
        type,
        amount,
        reason,
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  // Delete specific transaction
  static async deleteAccountTransaction(transactionId: string) {
    try {
      const transaction = await TransactionService.getTransactionById(
        transactionId,
      );
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      await TransactionService.deleteTransaction(transaction);
    } catch (error) {
      console.error('Error deleting account transaction:', error);
      throw error;
    }
  }
}

export default Store;
