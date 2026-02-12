
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { User, LogOut, Trash2, Camera, Download, Upload, ShieldCheck, Database } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  profiles: UserProfile[];
  onUpdateProfile: (profiles: UserProfile[]) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, profiles, onUpdateProfile, onLogout }) => {
  const [name, setName] = useState(profile.name);
  const [password, setPassword] = useState(profile.password || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfiles = profiles.map(p => 
      p.id === profile.id ? { ...p, name, password, avatar } : p
    );
    onUpdateProfile(updatedProfiles);
    alert('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('ছবির সাইজ ১ মেগাবাইটের কম হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Export Data as JSON
  const handleExportData = () => {
    const transactions = localStorage.getItem('hc_transactions') || '[]';
    const profilesData = localStorage.getItem('hc_profiles') || '[]';
    
    const backupData = {
      transactions: JSON.parse(transactions),
      profiles: JSON.parse(profilesData),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hisab-chai-backup-${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import Data from JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.transactions && data.profiles) {
          if (confirm('ব্যাকআপ ফাইলটি রিস্টোর করলে বর্তমান সকল ডাটা মুছে যাবে। আপনি কি নিশ্চিত?')) {
            localStorage.setItem('hc_transactions', JSON.stringify(data.transactions));
            localStorage.setItem('hc_profiles', JSON.stringify(data.profiles));
            alert('ডাটা সফলভাবে রিস্টোর হয়েছে! অ্যাপটি রিললোড হবে।');
            window.location.reload();
          }
        } else {
          alert('ভুল ব্যাকআপ ফাইল নির্বাচন করেছেন।');
        }
      } catch (err) {
        alert('ফাইলটি পড়া সম্ভব হচ্ছে না।');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('সতর্কতা: আপনার সকল লেনদেনের তথ্য মুছে যাবে! আপনি কি নিশ্চিত?')) {
      localStorage.removeItem('hc_transactions');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">সেটিংস ও ডাটা ম্যানেজমেন্ট</h2>

      {/* Profile Section */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center mb-8 text-emerald-600">
          <User className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-bold">প্রোফাইল সেটিংস</h3>
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-50 shadow-md bg-gray-50 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-emerald-300">{profile.name.charAt(0)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg hover:bg-emerald-700 transition-all active:scale-90"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <p className="text-[11px] font-bold text-gray-400 mt-4 uppercase tracking-widest">প্রোফাইল ছবি পরিবর্তন করুন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">আপনার নাম</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-emerald-500 outline-none font-bold text-gray-700 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">পাসওয়ার্ড পরিবর্তন</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-emerald-500 outline-none font-bold text-gray-700 transition-all" placeholder="নতুন পাসওয়ার্ড দিন" />
            </div>
          </div>
          
          <button type="submit" className="w-full md:w-auto bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95">
            তথ্য আপডেট করুন
          </button>
        </form>
      </section>

      {/* Backup Section */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center mb-6 text-blue-600">
          <Database className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-bold">ডাটা ব্যাকআপ ও রিস্টোর</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">আপনার সকল হিসাব এবং ইউজার প্রোফাইল নিরাপদ রাখতে ব্যাকআপ ফাইল ডাউনলোড করে রাখুন।</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleExportData}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-blue-100"
          >
            <Download className="w-5 h-5" /> ডাটা ব্যাকআপ নিন
          </button>
          
          <button 
            onClick={() => importInputRef.current?.click()}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-100"
          >
            <Upload className="w-5 h-5" /> ব্যাকআপ রিস্টোর করুন
          </button>
          <input type="file" ref={importInputRef} onChange={handleImportData} accept=".json" className="hidden" />
        </div>
      </section>

      {/* Data Reset Section */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center mb-4 text-rose-600">
          <Trash2 className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-bold">ডাটা মুছে ফেলুন</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">আপনার ডিভাইসে সংরক্ষিত সকল লেনদেনের তথ্য চিরতরে মুছে ফেলতে চাইলে নিচের বাটনটি চাপুন।</p>
        <button onClick={clearAllData} className="px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95">
          লেনদেনের ডাটা মুছুন
        </button>
      </section>

      <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-98">
        <LogOut className="w-5 h-5" /> লগআউট করুন
      </button>
    </div>
  );
};

export default Settings;
