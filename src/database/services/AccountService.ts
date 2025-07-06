import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';

export interface AccountWithStats {
  account: Account;
  balance: number;
  transactionCount: number;
  lastTransactionDate?: string;
}

export class AccountService {
  static accountsCollection = database.get<Account>('accounts');
  static transactionsCollection = database.get<Transaction>('transactions');

  // Get all accounts ordered by creation date
  static async getAllAccounts(): Promise<Account[]> {
    return await this.accountsCollection
      .query(Q.sortBy('created_at', Q.desc))
      .fetch();
  }

  // Create a new account
  static async createAccount(name: string): Promise<Account> {
    // Check if account with same name already exists
    const existingAccount = await this.accountsCollection
      .query(Q.where('name', name))
      .fetch();

    if (existingAccount.length > 0) {
      throw new Error('Account with this name already exists');
    }

    return await database.write(async () => {
      return await this.accountsCollection.create(account => {
        account.name = name.trim();
      });
    });
  }

  // Update account name
  static async updateAccount(
    account: Account,
    newName: string,
  ): Promise<Account> {
    // Check if another account with same name already exists
    const existingAccount = await this.accountsCollection
      .query(Q.where('name', newName), Q.where('id', Q.notEq(account.id)))
      .fetch();

    if (existingAccount.length > 0) {
      throw new Error('Account with this name already exists');
    }

    return await database.write(async () => {
      return await account.update(record => {
        record.name = newName.trim();
      });
    });
  }

  // Delete account and all its transactions
  static async deleteAccount(account: Account): Promise<void> {
    await database.write(async () => {
      // First, delete all transactions for this account
      const transactions = await this.transactionsCollection
        .query(Q.where('account_id', account.id))
        .fetch();

      await Promise.all(
        transactions.map(transaction => transaction.destroyPermanently()),
      );

      // Then delete the account
      await account.destroyPermanently();
    });
  }

  // Get account by ID
  static async getAccountById(id: string): Promise<Account | null> {
    try {
      return await this.accountsCollection.find(id);
    } catch (error) {
      return null;
    }
  }

  // Get account with statistics
  static async getAccountWithStats(
    accountId: string,
  ): Promise<AccountWithStats | null> {
    const account = await this.getAccountById(accountId);
    if (!account) return null;

    const transactions = await this.transactionsCollection
      .query(Q.where('account_id', accountId), Q.sortBy('timestamp', Q.desc))
      .fetch();

    const balance = transactions.reduce((total, transaction) => {
      return transaction.type === 'cash_in'
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);

    const lastTransaction = transactions.length > 0 ? transactions[0] : null;

    return {
      account,
      balance,
      transactionCount: transactions.length,
      lastTransactionDate: lastTransaction?.dateString,
    };
  }

  // Get all accounts with their statistics
  static async getAllAccountsWithStats(): Promise<AccountWithStats[]> {
    const accounts = await this.getAllAccounts();

    const accountsWithStats = await Promise.all(
      accounts.map(async account => {
        const stats = await this.getAccountWithStats(account.id);
        return stats!; // We know it exists since we just fetched it
      }),
    );

    return accountsWithStats;
  }

  // Get balance for specific account
  static async getAccountBalance(accountId: string): Promise<number> {
    const transactions = await this.transactionsCollection
      .query(Q.where('account_id', accountId))
      .fetch();

    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'cash_in') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  }
}
