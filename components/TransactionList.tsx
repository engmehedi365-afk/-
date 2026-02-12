
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { formatCurrency, getBengaliDate } from '../utils/helpers';
import { Search, Filter, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      
      let matchesTime = true;
      const tDate = new Date(t.date);
      const now = new Date();
      
      if (timeRange === 'today') {
        matchesTime = t.date === now.toISOString().split('T')[0];
      } else if (timeRange === 'week') {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        matchesTime = tDate >= lastWeek;
      } else if (timeRange === 'month') {
        matchesTime = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesType && matchesTime;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, timeRange]);

  const getCategoryLabel = (t: Transaction) => {
    const list = t.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return list.find(c => c.value === t.category)?.label || t.category;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">হিসাব তালিকা</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="খুঁজুন (নোট বা ক্যাটাগরি)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="flex-1 min-w-[120px] px-3 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">সব ধরন</option>
            <option value="income">আয়</option>
            <option value="expense">ব্যয়</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="flex-1 min-w-[120px] px-3 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">সব সময়</option>
            <option value="today">আজ</option>
            <option value="week">এই সপ্তাহ</option>
            <option value="month">এই মাস</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-shadow flex items-center justify-between group overflow-hidden" 
                 style={{ borderLeftColor: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{getCategoryLabel(t)}</h4>
                  <p className="text-xs text-gray-400">{getBengaliDate(t.date)}</p>
                  {t.note && <p className="text-sm text-gray-500 mt-1 line-clamp-1 italic">{t.note}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                
                <div className="flex gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(t)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('আপনি কি এই হিসাবটি মুছে ফেলতে চান?')) onDelete(t.id);
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">কোন হিসাব পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
