
export type TransactionType = 'income' | 'expense';
export type UserRole = 'user' | 'super_admin';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string;
  created_at?: string;
  profiles?: { full_name: string }; // For admin view joins
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  created_at?: string;
}

export type View = 'dashboard' | 'income' | 'expense' | 'list' | 'reports' | 'settings' | 'admin_dashboard' | 'admin_users' | 'admin_transactions';

export interface Category {
  label: string;
  value: string;
  color: string;
}
