import { Q } from '@nozbe/watermelondb';
import { database } from '../index';
import { Transaction, TransactionType } from '../models/Transaction';

export class TransactionService {
  static transactionsCollection = database.get<Transaction>('transactions');

  // Get all transactions ordered by timestamp (newest first)
  static async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsCollection
      .query(Q.sortBy('timestamp', Q.desc))
      .fetch();
  }

  // Get current balance by calculating sum of all transactions
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

  // Add a new transaction
  static async addTransaction(
    type: TransactionType,
    amount: number,
    reason: string,
  ): Promise<Transaction> {
    const now = new Date();
    const dateString = now.toLocaleString();
    const timestamp = now.getTime();

    return await database.write(async () => {
      return await this.transactionsCollection.create(transaction => {
        transaction.type = type;
        transaction.amount = amount;
        transaction.reason = reason;
        transaction.dateString = dateString;
        transaction.timestamp = timestamp;
      });
    });
  }

  // Delete a transaction
  static async deleteTransaction(transaction: Transaction): Promise<void> {
    await database.write(async () => {
      await transaction.destroyPermanently();
    });
  }

  // Get last cash in and cash out amounts for stats
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

  // Clear all transactions (for reset functionality)
  static async clearAllTransactions(): Promise<void> {
    const allTransactions = await this.getAllTransactions();

    await database.write(async () => {
      await Promise.all(
        allTransactions.map(transaction => transaction.destroyPermanently()),
      );
    });
  }
}
