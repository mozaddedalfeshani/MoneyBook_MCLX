import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionService } from './TransactionService';

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
  private static readonly MIGRATION_COMPLETED_KEY = 'watermelon_migration_completed';

  // Check if migration has already been completed
  static async isMigrationCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(this.MIGRATION_COMPLETED_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  }

  // Mark migration as completed
  static async markMigrationCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.MIGRATION_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error marking migration as completed:', error);
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

  // Migrate data from AsyncStorage to WatermelonDB
  static async migrateData(): Promise<void> {
    try {
      // Check if migration is already completed
      if (await this.isMigrationCompleted()) {
        console.log('Migration already completed, skipping...');
        return;
      }

      console.log('Starting data migration from AsyncStorage to WatermelonDB...');

      // Load legacy data
      const legacyData = await this.loadLegacyData();
      
      if (!legacyData || !legacyData.transactions || legacyData.transactions.length === 0) {
        console.log('No legacy data found to migrate');
        await this.markMigrationCompleted();
        return;
      }

      console.log(`Found ${legacyData.transactions.length} transactions to migrate`);

      // Migrate each transaction
      for (const legacyTransaction of legacyData.transactions) {
        await TransactionService.addTransaction(
          legacyTransaction.type,
          legacyTransaction.amount,
          legacyTransaction.reason
        );
      }

      // Mark migration as completed
      await this.markMigrationCompleted();

      // Optionally, clear the legacy data (uncomment if you want to remove old data)
      // await AsyncStorage.removeItem(this.LEGACY_STORAGE_KEY);

      console.log('Data migration completed successfully!');
    } catch (error) {
      console.error('Error during data migration:', error);
      throw new Error('Failed to migrate data from AsyncStorage to WatermelonDB');
    }
  }

  // Force re-migration (useful for development/testing)
  static async forceMigration(): Promise<void> {
    try {
      // Clear migration flag
      await AsyncStorage.removeItem(this.MIGRATION_COMPLETED_KEY);
      
      // Clear existing WatermelonDB data
      await TransactionService.clearAllTransactions();
      
      // Run migration again
      await this.migrateData();
    } catch (error) {
      console.error('Error during force migration:', error);
      throw error;
    }
  }
} 