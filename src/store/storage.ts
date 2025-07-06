import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Transaction } from './types/types';

const STORAGE_KEY = 'appData';

export const StorageService = {
  // Load all app data from storage
  async loadAppData(): Promise<AppData> {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData !== null) {
        const data: AppData = JSON.parse(savedData);
        return {
          balance: data.balance || 0,
          transactions: data.transactions || [],
        };
      }
      return { balance: 0, transactions: [] };
    } catch (error) {
      console.error('Error loading app data:', error);
      throw new Error('Failed to load app data');
    }
  },

  // Save all app data to storage
  async saveAppData(appData: AppData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
      console.error('Error saving app data:', error);
      throw new Error('Failed to save app data');
    }
  },

  // Clear all app data (useful for reset functionality)
  async clearAppData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing app data:', error);
      throw new Error('Failed to clear app data');
    }
  },

  // Get current balance only
  async getBalance(): Promise<number> {
    try {
      const data = await this.loadAppData();
      return data.balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  },

  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await this.loadAppData();
      return data.transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },
};
