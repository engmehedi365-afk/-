
import React from 'react';
import { View, UserProfile } from '../types';
import { LayoutDashboard, PlusCircle, MinusCircle, List, BarChart3, Settings, LogOut, Users, ShieldAlert, ShoppingBag } from 'lucide-react';
import { supabase } from '../supabase';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  profile: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, profile }) => {
  const isAdmin = profile.role === 'super_admin';
  const LOGO_SRC = "655e3d84-7ff2-45e5-aa74-04db97534e01.png";

  const userItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'checkout', label: 'অর্ডার করুন', icon: ShoppingBag },
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 no-print shadow-[1px_0_15px_rgba(0,0,0,0.01)]">
        <div className="p-8 border-b border-gray-50 flex flex-col items-center">
          <img 
            src={LOGO_SRC} 
            alt="হিসাব চাই" 
            className="h-24 w-auto object-contain mb-3"
            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
          />
          <h2 className="text-2xl font-black text-gray-800 tracking-tighter">হিসাব চাই</h2>
          <span className="text-[9px] text-gray-300 font-black uppercase tracking-[0.3em] mt-1">পার্সোনাল ফিন্যান্স</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.5rem] text-sm font-bold transition-all ${
                activeView === item.id
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm scale-[1.02]'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-[1.5rem] mb-4 border border-gray-100/50 shadow-inner">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black shadow-sm shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{profile.name}</p>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{profile.role === 'super_admin' ? 'এডমিন' : 'ইউজার'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            লগআউট
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-50 p-4 flex justify-between items-center sticky top-0 z-20 no-print shadow-sm">
        <div className="flex items-center gap-3">
          <img src={LOGO_SRC} alt="হিসাব চাই" className="h-10 w-auto object-contain" />
          <h2 className="font-black text-lg text-gray-800 tracking-tight">হিসাব চাই</h2>
        </div>
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-black shadow-sm border-2 border-white">
          {profile.name.charAt(0)}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-2.5 z-20 no-print shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        {userItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
              activeView === item.id ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-300'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] mt-1.5 font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
