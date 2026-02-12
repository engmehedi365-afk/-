
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { ShoppingBag, User, Mail, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';

const CheckoutForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    street_address: '',
    city: '',
    zip_code: '',
    product_name: '',
    total_amount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          ...formData,
          total_amount: parseFloat(formData.total_amount)
        }]);

      if (error) throw error;
      setSuccess(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        street_address: '',
        city: '',
        zip_code: '',
        product_name: '',
        total_amount: ''
      });
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg mx-auto border border-emerald-100">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">অর্ডার সফল হয়েছে!</h2>
        <p className="text-gray-500 mb-8">আপনার অর্ডারটি আমাদের ডাটাবেজে সংরক্ষিত হয়েছে। খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।</p>
        <button 
          onClick={() => setSuccess(false)}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
        >
          নতুন অর্ডার করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">অর্ডার ফর্ম (চেকআউট)</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ফার্স্ট নাম</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="জন"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.first_name}
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">লাস্ট নাম</label>
              <input
                required
                type="text"
                placeholder="ডো"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল অ্যাড্রেস</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                required
                type="email"
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> ঠিকানা
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">রাস্তা ও বাসা নম্বর</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.street_address}
                onChange={e => setFormData({...formData, street_address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">শহর</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">জিপ কোড</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.zip_code}
                  onChange={e => setFormData({...formData, zip_code: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> পেমেন্ট ডিটেইলস
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">প্রোডাক্টের নাম</label>
              <input
                required
                type="text"
                placeholder="প্রোডাক্টের নাম লিখুন"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.product_name}
                onChange={e => setFormData({...formData, product_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">মোট পরিমাণ (৳)</label>
              <input
                required
                type="number"
                placeholder="০.০০"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.total_amount}
                onChange={e => setFormData({...formData, total_amount: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'অর্ডার পাঠানো হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
