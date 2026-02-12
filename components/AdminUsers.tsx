
import React, { useState } from 'react';
import { User, Trash2, ShieldCheck, Mail, Calendar, UserPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { getBengaliDate, generateId } from '../utils/helpers';
import { UserProfile } from '../types';

interface AdminUsersProps {
  profiles: UserProfile[];
  onUpdate: (profiles: UserProfile[]) => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ profiles, onUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'super_admin'>('user');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (profiles.find(p => p.email === newEmail.trim())) {
      setMessage({ type: 'error', text: 'এই ইমেইলটি ইতিমধ্যে ব্যবহার করা হয়েছে।' });
      return;
    }

    const newUser: UserProfile = {
      id: generateId(),
      name: newName.trim(),
      email: newEmail.trim(),
      password: newPassword.trim(),
      role: newRole,
      created_at: new Date().toISOString()
    };

    onUpdate([...profiles, newUser]);
    setMessage({ type: 'success', text: 'নতুন ইউজার সফলভাবে যুক্ত করা হয়েছে!' });
    
    setNewName(''); setNewEmail(''); setNewPassword(''); setNewRole('user');
    setTimeout(() => { setShowAddModal(false); setMessage(null); }, 1500);
  };

  const handleDelete = (id: string, role: string) => {
    if (role === 'super_admin') {
       alert('সুপার এডমিন অ্যাকাউন্ট ডিলিট করা সম্ভব নয়।');
       return;
    }
    if (confirm('আপনি কি নিশ্চিত? ইউজারের সকল তথ্য মুছে যাবে।')) {
      onUpdate(profiles.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">ইউজার ম্যানেজমেন্ট</h2>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
          <UserPlus className="w-4 h-4" /> নতুন ইউজার যোগ করুন
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full">
            {u.role === 'super_admin' && (
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] px-4 py-1.5 rounded-bl-2xl font-black tracking-widest">ADMIN</div>
            )}
            <div className="flex items-center mb-5">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mr-4 overflow-hidden border-2 border-emerald-50 shadow-sm">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-gray-800 truncate text-lg">{u.name}</h4>
                <p className="text-[10px] text-gray-300 font-black tracking-widest uppercase">ID: {u.id.slice(0,8)}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6 flex-1">
              <div className="flex items-center text-gray-700 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
                <Mail className="w-4 h-4 mr-3 text-emerald-500" />
                <span className="truncate font-bold text-xs">{u.email}</span>
              </div>
              <div className="flex items-center px-2">
                <ShieldCheck className="w-4 h-4 mr-3 text-gray-300"/> 
                <span className={`ml-2 text-xs font-black ${u.role === 'super_admin' ? 'text-emerald-600' : 'text-blue-500'}`}>
                  {u.role === 'super_admin' ? 'সুপার এডমিন' : 'সাধারণ ইউজার'}
                </span>
              </div>
              <div className="flex items-center px-2">
                <Calendar className="w-4 h-4 mr-3 text-gray-300"/> 
                <span className="ml-2 text-xs font-bold text-gray-500">{getBengaliDate(u.created_at || '')}</span>
              </div>
            </div>

            <button 
              onClick={() => handleDelete(u.id, u.role)}
              disabled={u.role === 'super_admin'}
              className="w-full flex items-center justify-center py-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-20 font-black text-[11px] uppercase tracking-wider"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" /> ইউজার ডিলিট করুন
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[440px] rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-black text-gray-800 text-center mb-6">নতুন ইউজার যোগ করুন</h3>

            {message && (
              <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <p className="text-xs font-bold">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-6 py-3 rounded-full border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm" placeholder="নাম" />
              <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-6 py-3 rounded-full border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm" placeholder="ইমেইল" />
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-6 py-3 rounded-full border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm" placeholder="পাসওয়ার্ড" />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="w-full px-6 py-3 rounded-full border border-gray-100 bg-gray-50/50 focus:bg-white outline-none font-bold text-sm">
                <option value="user">সাধারণ ইউজার</option>
                <option value="super_admin">সুপার এডমিন</option>
              </select>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-full font-black text-sm uppercase tracking-widest mt-4">তৈরি করুন</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
