
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { LogIn, UserPlus, KeyRound, Mail } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage({ type: 'error', text: 'সিস্টেম কনফিগারেশন ত্রুটি। এডমিনের সাথে যোগাযোগ করুন।' });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'রেজিস্ট্রেশন সফল! আপনার ইমেইল ভেরিফাই করুন।' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message === 'Invalid login credentials' ? 'ভুল ইমেইল বা পাসওয়ার্ড!' : error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!supabase) return;
    if (!email) {
      setMessage({ type: 'error', text: 'দয়া করে ইমেইল দিন।' });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMessage({ type: 'error', text: error.message });
    else setMessage({ type: 'success', text: 'পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে।' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">হিসাব চাই</h1>
          <p className="text-gray-500 mt-2">{isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পুরো নাম</label>
              <div className="relative">
                <LogIn className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-400"
                  placeholder="আপনার নাম"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল অ্যাড্রেস</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-400"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'অপেক্ষা করুন...' : (isLogin ? 'লগইন করুন' : 'রেজিস্টার করুন')}
          </button>
        </form>

        <div className="mt-6 space-y-4 text-center">
          {isLogin && (
            <button onClick={handleForgotPassword} className="text-sm text-emerald-600 hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          )}
          <p className="text-gray-500 text-sm">
            {isLogin ? 'অ্যাকাউন্ট নেই?' : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'} 
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-emerald-600 font-bold hover:underline">
              {isLogin ? 'রেজিস্টার করুন' : 'লগইন করুন'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
