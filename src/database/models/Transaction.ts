import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export type TransactionType = 'cash_in' | 'cash_out';

export class Transaction extends Model {
  static table = 'transactions';

  @field('type') type!: TransactionType;
  @field('amount') amount!: number;
  @field('reason') reason!: string;
  @field('date') dateString!: string;
  @field('timestamp') timestamp!: number;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
