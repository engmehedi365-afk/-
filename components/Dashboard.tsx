
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/helpers';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { EXPENSE_CATEGORIES } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayIncome = transactions
      .filter(t => t.type === 'income' && t.date === todayStr)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const todayExpense = transactions
      .filter(t => t.type === 'expense' && t.date === todayStr)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      todayIncome,
      todayExpense
    };
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals).map(([catValue, total]) => {
      const category = EXPENSE_CATEGORIES.find(c => c.value === catValue);
      return {
        name: category?.label || 'অন্যান্য',
        value: total,
        color: category?.color || '#94a3b8'
      };
    });
  }, [transactions]);

  const barData = useMemo(() => {
    // Last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(date => {
      const dailyIncome = transactions
        .filter(t => t.type === 'income' && t.date === date)
        .reduce((sum, t) => sum + t.amount, 0);
      const dailyExpense = transactions
        .filter(t => t.type === 'expense' && t.date === date)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const dayLabel = new Date(date).toLocaleDateString('bn-BD', { weekday: 'short' });
      return {
        name: dayLabel,
        'আয়': dailyIncome,
        'ব্যয়': dailyExpense
      };
    });
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">সারসংক্ষেপ</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500 flex items-center">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 mr-4">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500">বর্তমান ব্যালেন্স</p>
            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(stats.balance)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500 flex items-center">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600 mr-4">
            <ArrowUpCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500">মোট আয়</p>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.totalIncome)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-rose-500 flex items-center">
          <div className="p-3 bg-rose-50 rounded-full text-rose-600 mr-4">
            <ArrowDownCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500">মোট ব্যয়</p>
            <p className="text-2xl font-bold text-rose-700">{formatCurrency(stats.totalExpense)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600">আজকের আয়</span>
          </div>
          <span className="text-lg font-bold text-blue-600">{formatCurrency(stats.todayIncome)}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600">আজকের ব্যয়</span>
          </div>
          <span className="text-lg font-bold text-rose-600">{formatCurrency(stats.todayExpense)}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-700 border-b pb-2">ব্যয়ের খাতসমূহ</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">কোন তথ্য নেই</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-gray-700 border-b pb-2">সাপ্তাহিক প্রবাহ</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                <Bar dataKey="আয়" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ব্যয়" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
