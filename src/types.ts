export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  created_at: string;
}