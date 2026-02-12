
import React, { useMemo } from 'react';
import { Transaction, UserProfile } from '../types';
import { formatCurrency } from '../utils/helpers';
import { Users, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

// Fix: Added profiles to interface to resolve App.tsx line 109 error
interface AdminDashboardProps {
  transactions: Transaction[];
  profiles: UserProfile[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ transactions, profiles }) => {
  // Fix: Use profiles prop directly instead of Supabase call (which is now null)
  const totalUsers = profiles.length;

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, transCount: transactions.length };
  }, [transactions]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">এডমিন ড্যাশবোর্ড</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mr-4"><Users className="w-8 h-8"/></div>
          <div>
            <p className="text-gray-500 text-sm">মোট ইউজার</p>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mr-4"><CreditCard className="w-8 h-8"/></div>
          <div>
            <p className="text-gray-500 text-sm">মোট লেনদেন</p>
            <p className="text-2xl font-bold">{stats.transCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mr-4"><TrendingUp className="w-8 h-8"/></div>
          <div>
            <p className="text-gray-500 text-sm">মোট আয় (সকল)</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.income)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl mr-4"><TrendingDown className="w-8 h-8"/></div>
          <div>
            <p className="text-gray-500 text-sm">মোট ব্যয় (সকল)</p>
            <p className="text-2xl font-bold text-rose-600">{formatCurrency(stats.expense)}</p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-600 p-8 rounded-3xl text-white">
        <h3 className="text-xl font-bold mb-2">সিস্টেম স্ট্যাটাস</h3>
        <p className="opacity-90">বর্তমানে অ্যাপ্লিকেশনটি স্থিতিশীল অবস্থায় আছে। সকল ইউজারের ডাটা এবং লেনদেন এখান থেকে মনিটর করা সম্ভব।</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
