
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { UserPlus, KeyRound, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Using the specific logo filename provided by the user
  const LOGO_SRC = "655e3d84-7ff2-45e5-aa74-04db97534e01.png";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password: cleanPassword 
        });
        if (error) throw error;
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: { data: { full_name: name.trim() } }
        });
        if (signUpError) throw signUpError;
        if (signUpData.user) {
          await supabase.from('profiles').upsert({ 
            id: signUpData.user.id,
            full_name: name.trim(), 
            email: cleanEmail,
            role: cleanEmail === 'engmehedi365@gmail.com' ? 'super_admin' : 'user',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
        }
        setMessage({ type: 'success', text: 'অ্যাকাউন্ট তৈরি সফল! এখন লগইন করুন।' });
        setIsLogin(true);
      }
    } catch (error: any) {
      let errorText = error.message;
      if (error.message.toLowerCase().includes('rate limit')) {
        errorText = 'অনেকবার চেষ্টা করা হয়েছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
      } else if (error.message.toLowerCase().includes('invalid login')) {
        errorText = 'ইমেইল অথবা পাসওয়ার্ডটি সঠিক নয়।';
      }
      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'দয়া করে ইমেইলটি লিখুন।' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setMessage({ type: 'success', text: 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="max-w-[480px] w-full bg-white rounded-[4.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] p-12 border border-gray-50 flex flex-col items-center">
        
        {/* Logo Section - Top arrow fix */}
        <div className="flex flex-col items-center mb-12">
          <img 
            src={LOGO_SRC} 
            alt="হিসাব চাই" 
            className="h-36 w-auto object-contain transition-all duration-700 hover:scale-110 drop-shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://wxzneqlupfrczpyvhogm.supabase.co/storage/v1/object/public/assets/logo.png';
            }}
          />
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mt-4">হিসাব চাই</h1>
          <div className="h-1.5 w-12 bg-emerald-500 rounded-full mt-3 mb-2"></div>
          <p className="text-[#94a3b8] font-semibold text-base">
            {isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'সহজে নতুন অ্যাকাউন্ট তৈরি করুন'}
          </p>
        </div>

        {message && (
          <div className={`w-full p-5 rounded-[2rem] mb-8 text-sm flex items-start gap-4 border animate-in fade-in slide-in-from-top-6 duration-500 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="font-bold leading-relaxed">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">আপনার নাম</label>
              <div className="relative group">
                <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 rounded-[2rem] border border-gray-100 bg-gray-50/40 focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder-gray-200 font-bold text-gray-700 shadow-sm"
                  placeholder="পুরো নাম লিখুন"
                />
              </div>
            </div>
          )}

          {/* Input Fields - Middle arrows fix */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">ইমেইল অ্যাড্রেস</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-16 pr-8 py-5 rounded-[2rem] border border-gray-100 bg-gray-50/40 focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder-gray-200 font-bold text-gray-700 shadow-sm"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">পাসওয়ার্ড</label>
              {isLogin && (
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-tighter"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              )}
            </div>
            <div className="relative group">
              <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-16 pr-8 py-5 rounded-[2rem] border border-gray-100 bg-gray-50/40 focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all placeholder-gray-200 font-bold text-gray-700 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white py-5.5 rounded-[2rem] font-black text-xl hover:bg-[#059669] transition-all duration-300 flex items-center justify-center disabled:opacity-70 active:scale-[0.97] shadow-xl shadow-emerald-100 mt-4 tracking-tight"
          >
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন')}
          </button>
        </form>

        <div className="mt-14 text-center">
          <p className="text-[#94a3b8] font-bold">
            {isLogin ? 'অ্যাকাউন্ট নেই?' : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'} 
            <button 
              onClick={() => { setIsLogin(!isLogin); setMessage(null); }} 
              className="ml-2 text-emerald-600 font-black hover:underline underline-offset-[12px] decoration-4 transition-all"
            >
              {isLogin ? 'রেজিস্টার করুন' : 'লগইন করুন'}
            </button>
          </p>
        </div>
      </div>
      
      {/* Footer - Bottom arrow fix */}
      <div className="mt-12 text-center">
        <p className="text-[#cbd5e1] text-[10px] font-black tracking-[0.3em] uppercase opacity-70">
          © {new Date().getFullYear()} হিসাব চাই • পার্সোনাল ফিন্যান্স ম্যানেজমেন্ট
        </p>
      </div>
    </div>
  );
};

export default Auth;
