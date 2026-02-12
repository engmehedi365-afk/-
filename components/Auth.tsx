
import React, { useState } from 'react';
import { LogIn, KeyRound, Mail, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const LOGO_SRC = "655e3d84-7ff2-45e5-aa74-04db97534e01.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate network delay
    setTimeout(() => {
      const savedProfiles = localStorage.getItem('hc_profiles');
      const profiles: UserProfile[] = savedProfiles ? JSON.parse(savedProfiles) : [];
      
      const user = profiles.find(p => p.email === email.trim() && p.password === password.trim());

      if (user) {
        onLogin(user);
      } else {
        setError('ইমেইল অথবা পাসওয়ার্ডটি সঠিক নয়।');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <div className="max-w-[440px] w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] px-10 pb-12 pt-10 border border-gray-50 flex flex-col items-center relative overflow-hidden transition-all">
        
        <div className="flex flex-col items-center mb-10 w-full text-center">
          <div className="h-16 flex items-center justify-center mb-2">
            <img src={LOGO_SRC} alt="লোগো" className="h-full w-auto object-contain opacity-90" />
          </div>
          <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">হিসাব চাই</h1>
          <p className="text-[#94a3b8] font-bold text-sm mt-1.5">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        {error && (
          <div className="w-full p-4 rounded-3xl mb-6 flex items-center gap-3 border bg-rose-50 text-rose-700 border-rose-100/50 animate-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">ইমেইল অ্যাড্রেস</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-7 py-4 rounded-full border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder-gray-300 font-bold text-gray-700 shadow-sm"
              placeholder="admin@mail.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-7 py-4 rounded-full border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder-gray-300 font-bold text-gray-700 shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white py-4.5 rounded-full font-black text-lg hover:bg-[#059669] transition-all duration-300 flex items-center justify-center disabled:opacity-70 active:scale-[0.98] shadow-lg shadow-emerald-100/50 mt-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
