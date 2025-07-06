import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import type { Account } from './Account';

export type TransactionType = 'cash_in' | 'cash_out';

export class Transaction extends Model {
  static table = 'transactions';
  static associations = {
    account: { type: 'belongs_to', key: 'account_id' },
  } as const;

  @field('account_id') accountId!: string;
  @field('type') type!: TransactionType;
  @field('amount') amount!: number;
  @field('reason') reason!: string;
  @field('date') dateString!: string;
  @field('timestamp') timestamp!: number;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @relation('accounts', 'account_id') account!: Account;
}
