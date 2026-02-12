
import React from 'react';
import { View, UserProfile } from '../types';
import { LayoutDashboard, PlusCircle, MinusCircle, List, BarChart3, Settings, LogOut, Users, ShieldAlert } from 'lucide-react';
import { supabase } from '../supabase';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  profile: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, profile }) => {
  const isAdmin = profile.role === 'super_admin';

  const userItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'income', label: 'আয় যুক্ত করুন', icon: PlusCircle },
    { id: 'expense', label: 'ব্যয় যুক্ত করুন', icon: MinusCircle },
    { id: 'list', label: 'হিসাব তালিকা', icon: List },
    { id: 'reports', label: 'রিপোর্ট', icon: BarChart3 },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  const adminItems = [
    { id: 'admin_dashboard', label: 'এডমিন ড্যাশবোর্ড', icon: ShieldAlert },
    { id: 'admin_users', label: 'ইউজার লিস্ট', icon: Users },
    { id: 'admin_transactions', label: 'সকল লেনদেন', icon: List },
  ];

  const navItems = isAdmin ? [...adminItems, ...userItems] : userItems;

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-64">
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center no-print">
        <h1 className="text-xl font-bold tracking-wide">হিসাব চাই {isAdmin && <span className="text-xs bg-white text-emerald-600 px-2 py-0.5 rounded-full ml-2">ADMIN</span>}</h1>
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm font-medium">{profile.name}</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
            <span className="text-sm font-bold">{profile.name.charAt(0)}</span>
          </div>
        </div>
      </header>

      <aside className="hidden md:flex flex-col w-64 bg-white border-r h-full fixed left-0 top-0 z-20 no-print">
        <div className="p-6 border-b bg-emerald-600">
          <h1 className="text-2xl font-bold text-white leading-tight">হিসাব চাই<br/><span className="text-sm opacity-80 font-normal">ম্যানেজমেন্ট অ্যাপ</span></h1>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                activeView === item.id
                  ? 'text-emerald-600 bg-emerald-50 border-r-4 border-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            লগআউট
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-30 no-print shadow-lg">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeView === item.id ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
