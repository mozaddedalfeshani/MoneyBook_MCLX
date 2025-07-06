import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionService } from './TransactionService';
import { AccountService } from './AccountService';

interface LegacyTransaction {
  id: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
  date: string;
  timestamp: number;
}

interface LegacyAppData {
  balance: number;
  transactions: LegacyTransaction[];
}

export class MigrationService {
  private static readonly LEGACY_STORAGE_KEY = 'appData';
  private static readonly MIGRATION_COMPLETED_KEY =
    'watermelon_migration_completed';
  private static readonly ACCOUNT_MIGRATION_KEY = 'account_migration_completed';
  private static readonly DEFAULT_ACCOUNT_NAME = 'Main Account';

  // Check if legacy migration has been completed
  static async isLegacyMigrationCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(
        this.MIGRATION_COMPLETED_KEY,
      );
      return completed === 'true';
    } catch (error) {
      console.error('Error checking legacy migration status:', error);
      return false;
    }
  }

  // Check if account migration has been completed
  static async isAccountMigrationCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(this.ACCOUNT_MIGRATION_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking account migration status:', error);
      return false;
    }
  }

  // Mark legacy migration as completed
  static async markLegacyMigrationCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.MIGRATION_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error marking legacy migration as completed:', error);
    }
  }

  // Mark account migration as completed
  static async markAccountMigrationCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.ACCOUNT_MIGRATION_KEY, 'true');
    } catch (error) {
      console.error('Error marking account migration as completed:', error);
    }
  }

  // Load legacy data from AsyncStorage
  static async loadLegacyData(): Promise<LegacyAppData | null> {
    try {
      const savedData = await AsyncStorage.getItem(this.LEGACY_STORAGE_KEY);
      if (savedData !== null) {
        return JSON.parse(savedData) as LegacyAppData;
      }
      return null;
    } catch (error) {
      console.error('Error loading legacy data:', error);
      return null;
    }
  }

  // Get or create default account
  static async getOrCreateDefaultAccount(): Promise<string> {
    try {
      // First, check if any accounts exist
      const existingAccounts = await AccountService.getAllAccounts();

      if (existingAccounts.length > 0) {
        // Return the first account ID
        return existingAccounts[0].id;
      }

      // No accounts exist, create the default account
      const defaultAccount = await AccountService.createAccount(
        this.DEFAULT_ACCOUNT_NAME,
      );
      return defaultAccount.id;
    } catch (error) {
      console.error('Error getting or creating default account:', error);
      throw error;
    }
  }

  // Migrate legacy transactions to account-based system
  static async migrateToAccountSystem(): Promise<void> {
    try {
      // Check if account migration is already completed
      if (await this.isAccountMigrationCompleted()) {
        console.log('Account migration already completed, skipping...');
        return;
      }

      console.log('Starting migration to account-based system...');

      // Get all existing transactions (these would be from legacy migration)
      const existingTransactions =
        await TransactionService.getAllTransactions();

      if (existingTransactions.length === 0) {
        console.log('No existing transactions to migrate to account system');
        await this.markAccountMigrationCompleted();
        return;
      }

      // Check if transactions already have account_id (shouldn't happen, but safety check)
      const transactionsWithoutAccount = existingTransactions.filter(
        t => !t.accountId,
      );

      if (transactionsWithoutAccount.length === 0) {
        console.log('All transactions already have account IDs');
        await this.markAccountMigrationCompleted();
        return;
      }

      // Get or create default account
      const defaultAccountId = await this.getOrCreateDefaultAccount();

      console.log(
        `Migrating ${transactionsWithoutAccount.length} transactions to default account...`,
      );

      // Update all transactions to belong to the default account
      // Note: This is a conceptual update - in practice, we'd need to recreate transactions
      // with account_id since WatermelonDB doesn't allow updating the schema easily

      // For now, we'll clear existing transactions and recreate them with account_id
      await TransactionService.clearAllTransactions();

      // Recreate transactions with account_id
      for (const transaction of transactionsWithoutAccount) {
        await TransactionService.addTransaction(
          defaultAccountId,
          transaction.type,
          transaction.amount,
          transaction.reason,
        );
      }

      // Mark migration as completed
      await this.markAccountMigrationCompleted();

      console.log('Account migration completed successfully!');
    } catch (error) {
      console.error('Error during account migration:', error);
      throw new Error('Failed to migrate to account-based system');
    }
  }

  // Migrate data from AsyncStorage to WatermelonDB (legacy migration)
  static async migrateLegacyData(): Promise<void> {
    try {
      // Check if legacy migration is already completed
      if (await this.isLegacyMigrationCompleted()) {
        console.log('Legacy migration already completed, skipping...');
        return;
      }

      console.log(
        'Starting legacy data migration from AsyncStorage to WatermelonDB...',
      );

      // Load legacy data
      const legacyData = await this.loadLegacyData();

      if (
        !legacyData ||
        !legacyData.transactions ||
        legacyData.transactions.length === 0
      ) {
        console.log('No legacy data found to migrate');
        await this.markLegacyMigrationCompleted();
        return;
      }

      console.log(
        `Found ${legacyData.transactions.length} legacy transactions to migrate`,
      );

      // Get or create default account for legacy transactions
      const defaultAccountId = await this.getOrCreateDefaultAccount();

      // Migrate each transaction to the default account
      for (const legacyTransaction of legacyData.transactions) {
        await TransactionService.addTransaction(
          defaultAccountId,
          legacyTransaction.type,
          legacyTransaction.amount,
          legacyTransaction.reason,
        );
      }

      // Mark legacy migration as completed
      await this.markLegacyMigrationCompleted();

      console.log('Legacy data migration completed successfully!');
    } catch (error) {
      console.error('Error during legacy data migration:', error);
      throw new Error(
        'Failed to migrate legacy data from AsyncStorage to WatermelonDB',
      );
    }
  }

  // Main migration function that handles all migration types
  static async migrateData(): Promise<void> {
    try {
      // First, migrate legacy data from AsyncStorage (if needed)
      await this.migrateLegacyData();

      // Then, migrate to account-based system (if needed)
      await this.migrateToAccountSystem();

      console.log('All migrations completed successfully!');
    } catch (error) {
      console.error('Error during data migration:', error);
      throw error;
    }
  }

  // Force re-migration (useful for development/testing)
  static async forceMigration(): Promise<void> {
    try {
      // Clear migration flags
      await AsyncStorage.removeItem(this.MIGRATION_COMPLETED_KEY);
      await AsyncStorage.removeItem(this.ACCOUNT_MIGRATION_KEY);

      // Clear existing data
      await TransactionService.clearAllTransactions();

      // Clear accounts
      const accounts = await AccountService.getAllAccounts();
      for (const account of accounts) {
        await AccountService.deleteAccount(account);
      }

      // Run migration again
      await this.migrateData();
    } catch (error) {
      console.error('Error during force migration:', error);
      throw error;
    }
  }
}
