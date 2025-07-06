export interface Transaction {
  id: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
  date: string;
  timestamp: number;
}

export interface AppData {
  balance: number;
  transactions: Transaction[];
}

export interface TransactionStats {
  lastCashIn: number;
  lastCashOut: number;
}
