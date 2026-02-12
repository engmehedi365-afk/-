
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { User, Trash2, ShieldCheck, Mail, Calendar, KeyRound } from 'lucide-react';
import { getBengaliDate } from '../utils/helpers';

interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  updated_at: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, role: string) => {
    if (role === 'super_admin') {
       alert('সুপার এডমিন অ্যাকাউন্ট ডিলিট করা সম্ভব নয়।');
       return;
    }
    if (confirm('আপনি কি নিশ্চিত যে এই ইউজারকে ডিলিট করতে চান? তার সকল তথ্য মুছে যাবে।')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        alert('ত্রুটি: ' + error.message);
      }
    }
  };

  const handleResetPassword = async (email?: string) => {
    if (!email) {
      alert('এই ইউজারের ইমেইল পাওয়া যায়নি।');
      return;
    }
    if (confirm(`আপনি কি এই ইউজারের ইমেইলে (${email}) পাসওয়ার্ড রিসেট লিংক পাঠাতে চান?`)) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (!error) alert('পাসওয়ার্ড রিসেট লিংক সফলভাবে পাঠানো হয়েছে।');
      else alert('ত্রুটি: ' + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-emerald-600 font-bold">ইউজার তালিকা লোড হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ইউজার ম্যানেজমেন্ট</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col h-full">
            {u.role === 'super_admin' && (
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold">
                SUPER ADMIN
              </div>
            )}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-gray-800 truncate">{u.full_name || 'নামহীন ইউজার'}</h4>
                <p className="text-xs text-gray-400 truncate">ID: {u.id.slice(0,8)}...</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6 flex-1">
              <div className="flex items-center text-emerald-600 font-medium">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{u.email || 'ইমেইল পাওয়া যায়নি'}</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-gray-400"/> 
                রোল: {u.role === 'super_admin' ? 'সুপার এডমিন' : 'সাধারণ ইউজার'}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400"/> 
                জয়েনিং: {getBengaliDate(u.updated_at)}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <button 
                onClick={() => handleResetPassword(u.email)}
                className="w-full flex items-center justify-center py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-medium text-sm"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                পাসওয়ার্ড রিসেট পাঠান
              </button>
              <button 
                onClick={() => handleDelete(u.id, u.role)}
                disabled={u.role === 'super_admin'}
                className="w-full flex items-center justify-center py-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                ইউজার ডিলিট করুন
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
