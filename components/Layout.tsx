
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 no-print">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-emerald-600 tracking-tight">হিসাব চাই</h1>
          <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">পার্সোনাল ফিন্যান্স</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
              {profile.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{profile.name}</p>
              <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            লগআউট
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20 no-print">
        <h1 className="text-xl font-bold text-emerald-600">হিসাব চাই</h1>
        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
          {profile.name.charAt(0)}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-20 no-print">
        {userItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              activeView === item.id ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] mt-1">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
