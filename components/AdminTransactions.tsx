
import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, getBengaliDate } from '../utils/helpers';
import { Trash2, Search, User, Filter } from 'lucide-react';

interface AdminTransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const AdminTransactions: React.FC<AdminTransactionsProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => 
    t.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">সকল লেনদেনের তালিকা</h2>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ইউজার বা নোট দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-bold">তারিখ</th>
                <th className="px-6 py-4 font-bold">ইউজার</th>
                <th className="px-6 py-4 font-bold">ধরন</th>
                <th className="px-6 py-4 font-bold">পরিমাণ</th>
                <th className="px-6 py-4 font-bold">নোট</th>
                <th className="px-6 py-4 font-bold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{getBengaliDate(t.date)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-bold text-gray-800">
                      <User className="w-4 h-4 mr-2 text-emerald-500" />
                      {t.profiles?.full_name || 'অজানা'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === 'income' ? 'আয়' : 'ব্যয়'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(t.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">{t.note}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { if(confirm('ডিলিট করতে চান?')) onDelete(t.id) }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-gray-400">কোন লেনদেন পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
