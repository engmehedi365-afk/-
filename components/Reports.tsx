
import React, { useMemo, useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, getBengaliDate } from '../utils/helpers';
import { EXPENSE_CATEGORIES, BENGALI_MONTHS } from '../constants';
import { Download, TrendingUp, TrendingDown, PieChart, Calendar as CalendarIcon, Filter, RotateCcw } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  // Default to current month range
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const today = now.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);

  const reportData = useMemo(() => {
    const filteredTransactions = transactions.filter(t => {
      return t.date >= startDate && t.date <= endDate;
    });

    const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const expenseByCategory: Record<string, number> = {};
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      savings: income - expense,
      count: filteredTransactions.length,
      categoryWise: Object.entries(expenseByCategory).map(([cat, amount]) => ({
        category: cat,
        label: EXPENSE_CATEGORIES.find(c => c.value === cat)?.label || 'অন্যান্য',
        amount,
        percentage: expense > 0 ? (amount / expense) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)
    };
  }, [transactions, startDate, endDate]);

  const handleExport = () => {
    window.print();
  };

  const handleReset = () => {
    setStartDate(firstDayOfMonth);
    setEndDate(today);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <h2 className="text-2xl font-bold text-gray-800">রিপোর্ট ও বিশ্লেষণ</h2>
        <button 
          onClick={handleExport}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-sm font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          PDF/প্রিন্ট করুন
        </button>
      </div>

      {/* Date Range Filter Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 no-print">
        <div className="flex flex-col lg:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" /> শুরুর তারিখ
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium text-gray-800"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" /> শেষ তারিখ
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium text-gray-800"
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <button 
              onClick={handleReset}
              className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2.5 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-sm"
              title="রিসেট করুন"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              রিসেট
            </button>
          </div>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100" id="report-content">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-emerald-600">হিসাব চাই</h1>
          <div className="flex flex-col items-center mt-2 text-gray-500">
            <p className="text-sm font-medium">লেনদেনের সংক্ষিপ্ত রিপোর্ট</p>
            <p className="text-xs mt-1 bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 border border-emerald-100">
              {getBengaliDate(startDate)} থেকে {getBengaliDate(endDate)} পর্যন্ত
            </p>
          </div>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-5 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 group hover:scale-[1.02] transition-transform">
            <div className="flex items-center text-blue-600 mb-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-bold text-sm">মোট আয়</span>
            </div>
            <p className="text-2xl font-black text-blue-700">{formatCurrency(reportData.totalIncome)}</p>
          </div>

          <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 group hover:scale-[1.02] transition-transform">
            <div className="flex items-center text-rose-600 mb-2">
              <TrendingDown className="w-5 h-5 mr-2" />
              <span className="font-bold text-sm">মোট ব্যয়</span>
            </div>
            <p className="text-2xl font-black text-rose-700">{formatCurrency(reportData.totalExpense)}</p>
          </div>

          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:scale-[1.02] transition-transform">
            <div className="flex items-center text-emerald-600 mb-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-bold text-sm">নিট সঞ্চয়</span>
            </div>
            <p className="text-2xl font-black text-emerald-700">{formatCurrency(reportData.savings)}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-emerald-500" />
            ব্যয়ের খাতওয়ারী বিশ্লেষণ
          </h3>
          <div className="space-y-5">
            {reportData.categoryWise.length > 0 ? (
              reportData.categoryWise.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700">{item.label}</span>
                    <span className="font-medium text-gray-500">
                      {formatCurrency(item.amount)} 
                      <span className="ml-2 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-md">
                        {Math.round(item.percentage)}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic text-sm">এই সময়ের মধ্যে কোন ব্যয়ের রেকর্ড পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-12 flex justify-between items-center text-[10px] text-gray-400 italic">
          <p>তৈরির তারিখ: {new Date().toLocaleString('bn-BD')}</p>
          <p>হিসাব চাই অ্যাপ দ্বারা প্রস্তুতকৃত</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
