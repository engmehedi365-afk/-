
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../supabase';
import { User, LogOut, KeyRound, ShieldCheck } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  onResetData: () => void;
  onBackup: () => void;
  onRestore: (data: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile, onLogout }) => {
  const [name, setName] = useState(profile.name);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    if (!supabase) return;
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });
    
    if (!error) {
      // Fix: Argument of type '{ name: string; }' is not assignable to parameter of type 'UserProfile'.
      // Spreading the current profile ensures 'id' and 'role' are present in the object passed to onUpdateProfile.
      onUpdateProfile({ ...profile, name });
      alert('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (!error) alert('পাসওয়ার্ড পরিবর্তনের লিংক ইমেইলে পাঠানো হয়েছে।');
    else alert(error.message);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">সেটিংস</h2>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-6 text-emerald-600">
          <User className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-bold">প্রোফাইল সেটিংস</h3>
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? 'আপডেট হচ্ছে...' : 'সেভ করুন'}
          </button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-6 text-blue-600">
          <ShieldCheck className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-bold">নিরাপত্তা</h3>
        </div>
        <button
          onClick={handleChangePassword}
          className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all"
        >
          <KeyRound className="w-5 h-5" />
          পাসওয়ার্ড পরিবর্তন করুন
        </button>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4 text-rose-600">
          <LogOut className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-bold">অ্যাকাউন্ট</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">আপনি আপনার অ্যাকাউন্ট থেকে লগআউট করতে পারেন।</p>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          লগআউট করুন
        </button>
      </section>
    </div>
  );
};

export default Settings;
