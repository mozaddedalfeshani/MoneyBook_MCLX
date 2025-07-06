import { Model } from '@nozbe/watermelondb';
import { field, date, children } from '@nozbe/watermelondb/decorators';
import { Transaction } from './Transaction';

export class Account extends Model {
  static table = 'accounts';
  static associations = {
    transactions: { type: 'has_many', foreignKey: 'account_id' },
  } as const;

  @field('name') name!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children('transactions') transactions!: Transaction[];
}
