import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import { Transaction, TransactionType } from '../models/Transaction';

export class TransactionService {
  static transactionsCollection = database.get<Transaction>('transactions');

  // Get all transactions for a specific account ordered by timestamp (newest first)
  static async getAccountTransactions(
    accountId: string,
  ): Promise<Transaction[]> {
    return await this.transactionsCollection
      .query(Q.where('account_id', accountId), Q.sortBy('timestamp', Q.desc))
      .fetch();
  }

  // Get all transactions (global) ordered by timestamp (newest first)
  static async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsCollection
      .query(Q.sortBy('timestamp', Q.desc))
      .fetch();
  }

  // Get current balance for a specific account
  static async getAccountBalance(accountId: string): Promise<number> {
    const transactions = await this.getAccountTransactions(accountId);

    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'cash_in') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  }

  // Get current balance across all accounts (global balance)
  static async getCurrentBalance(): Promise<number> {
    const transactions = await this.getAllTransactions();

    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'cash_in') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  }

  // Add a new transaction to a specific account
  static async addTransaction(
    accountId: string,
    type: TransactionType,
    amount: number,
    reason: string,
  ): Promise<Transaction> {
    const now = new Date();
    const dateString = now.toLocaleString();
    const timestamp = now.getTime();

    return await database.write(async () => {
      return await this.transactionsCollection.create(transaction => {
        transaction.accountId = accountId;
        transaction.type = type;
        transaction.amount = amount;
        transaction.reason = reason;
        transaction.dateString = dateString;
        transaction.timestamp = timestamp;
      });
    });
  }

  // Update a transaction
  static async updateTransaction(
    transaction: Transaction,
    type: TransactionType,
    amount: number,
    reason: string,
  ): Promise<Transaction> {
    return await database.write(async () => {
      return await transaction.update(record => {
        record.type = type;
        record.amount = amount;
        record.reason = reason;
      });
    });
  }

  // Delete a transaction
  static async deleteTransaction(transaction: Transaction): Promise<void> {
    await database.write(async () => {
      await transaction.destroyPermanently();
    });
  }

  // Get last cash in and cash out amounts for stats (account-specific)
  static async getAccountLastTransactionAmounts(accountId: string): Promise<{
    lastCashIn: number;
    lastCashOut: number;
  }> {
    const [lastCashIn, lastCashOut] = await Promise.all([
      this.transactionsCollection
        .query(
          Q.where('account_id', accountId),
          Q.where('type', 'cash_in'),
          Q.sortBy('timestamp', Q.desc),
          Q.take(1),
        )
        .fetch(),
      this.transactionsCollection
        .query(
          Q.where('account_id', accountId),
          Q.where('type', 'cash_out'),
          Q.sortBy('timestamp', Q.desc),
          Q.take(1),
        )
        .fetch(),
    ]);

    return {
      lastCashIn: lastCashIn.length > 0 ? lastCashIn[0].amount : 0,
      lastCashOut: lastCashOut.length > 0 ? lastCashOut[0].amount : 0,
    };
  }

  // Get last transaction amounts for stats (global)
  static async getLastTransactionAmounts(): Promise<{
    lastCashIn: number;
    lastCashOut: number;
  }> {
    const [lastCashIn, lastCashOut] = await Promise.all([
      this.transactionsCollection
        .query(
          Q.where('type', 'cash_in'),
          Q.sortBy('timestamp', Q.desc),
          Q.take(1),
        )
        .fetch(),
      this.transactionsCollection
        .query(
          Q.where('type', 'cash_out'),
          Q.sortBy('timestamp', Q.desc),
          Q.take(1),
        )
        .fetch(),
    ]);

    return {
      lastCashIn: lastCashIn.length > 0 ? lastCashIn[0].amount : 0,
      lastCashOut: lastCashOut.length > 0 ? lastCashOut[0].amount : 0,
    };
  }

  // Clear all transactions for a specific account
  static async clearAccountTransactions(accountId: string): Promise<void> {
    const accountTransactions = await this.getAccountTransactions(accountId);

    await database.write(async () => {
      await Promise.all(
        accountTransactions.map(transaction =>
          transaction.destroyPermanently(),
        ),
      );
    });
  }

  // Clear all transactions (global)
  static async clearAllTransactions(): Promise<void> {
    const allTransactions = await this.getAllTransactions();

    await database.write(async () => {
      await Promise.all(
        allTransactions.map(transaction => transaction.destroyPermanently()),
      );
    });
  }

  // Get transaction by ID
  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      return await this.transactionsCollection.find(id);
    } catch (error) {
      return null;
    }
  }
}
