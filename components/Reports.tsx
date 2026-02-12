
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { formatCurrency, getBengaliDate } from '../utils/helpers';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, BENGALI_MONTHS } from '../constants';
import { Download, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const reportData = useMemo(() => {
    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const expenseByCategory: Record<string, number> = {};
    monthTransactions.filter(t => t.type === 'expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      savings: income - expense,
      count: monthTransactions.length,
      categoryWise: Object.entries(expenseByCategory).map(([cat, amount]) => ({
        category: cat,
        label: EXPENSE_CATEGORIES.find(c => c.value === cat)?.label || 'অন্যান্য',
        amount,
        percentage: expense > 0 ? (amount / expense) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)
    };
  }, [transactions, currentMonth, currentYear]);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-2xl font-bold text-gray-800">মাসিক রিপোর্ট</h2>
        <button 
          onClick={handleExport}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          PDF/প্রিন্ট
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100" id="report-content">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-emerald-600">হিসাব চাই</h1>
          <p className="text-gray-500 mt-1">{BENGALI_MONTHS[currentMonth]}, {currentYear}</p>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-center text-blue-600 mb-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-medium">মোট আয়</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(reportData.totalIncome)}</p>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="flex items-center text-rose-600 mb-2">
              <TrendingDown className="w-5 h-5 mr-2" />
              <span className="font-medium">মোট ব্যয়</span>
            </div>
            <p className="text-2xl font-bold text-rose-700">{formatCurrency(reportData.totalExpense)}</p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center text-emerald-600 mb-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-medium">নিট সঞ্চয়</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(reportData.savings)}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-emerald-500" />
            ব্যয়ের খাতওয়ারী বিশ্লেষণ
          </h3>
          <div className="space-y-4">
            {reportData.categoryWise.length > 0 ? (
              reportData.categoryWise.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-gray-500">{formatCurrency(item.amount)} ({Math.round(item.percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4 italic">কোন ব্যয়ের রেকর্ড নেই</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-xs text-center text-gray-400 italic">রিপোর্টটি স্বয়ংক্রিয়ভাবে হিসাব চাই অ্যাপ থেকে তৈরি করা হয়েছে।</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
