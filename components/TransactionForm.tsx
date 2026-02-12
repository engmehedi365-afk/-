
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { generateId } from '../utils/helpers';
import { Save, X } from 'lucide-react';

interface TransactionFormProps {
  type: TransactionType;
  onSave: (transaction: Transaction) => void;
  initialData?: Transaction | null;
  onCancel?: () => void;
  userId: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSave, initialData, onCancel, userId }) => {
  const [amount, setAmount] = useState<string>(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<string>(initialData?.category || '');
  const [date, setDate] = useState<string>(initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>(initialData?.note || '');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNote(initialData.note);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      alert('দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।');
      return;
    }

    // Fixed: Added user_id to satisfy Transaction interface (Line 39 error fix)
    const transaction: Transaction = {
      id: initialData?.id || generateId(),
      user_id: initialData?.user_id || userId,
      type,
      amount: parseFloat(amount),
      category,
      date,
      note,
    };

    onSave(transaction);
    
    if (!initialData) {
      setAmount('');
      setCategory('');
      setNote('');
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 border-t-4 ${type === 'income' ? 'border-emerald-500' : 'border-rose-500'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'হিসাব আপডেট করুন' : (type === 'income' ? 'নতুন আয় যুক্ত করুন' : 'নতুন ব্যয় যুক্ত করুন')}
        </h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">টাকার পরিমাণ *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
            placeholder="৳০০.০০"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
            required
          >
            <option value="" className="text-gray-400">নির্বাচন করুন</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value} className="text-gray-900">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">তারিখ *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">নোট (ঐচ্ছিক)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all h-24 resize-none placeholder-gray-400"
            placeholder="অতিরিক্ত তথ্য..."
          />
        </div>

        <button
          type="submit"
          className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center transition-all transform active:scale-95 ${
            type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          <Save className="w-5 h-5 mr-2" />
          সংরক্ষণ করুন
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
