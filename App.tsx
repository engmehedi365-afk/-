
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import AdminTransactions from './components/AdminTransactions';
import CheckoutForm from './components/CheckoutForm';
import { Transaction, UserProfile, View } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setTransactions([]);
        setActiveView('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      const userProfile: UserProfile = {
        id: data.id,
        name: data.full_name || 'ব্যবহারকারী',
        role: data.role as any
      };
      setProfile(userProfile);
      
      // If super_admin, they might want to see admin dashboard first
      if (userProfile.role === 'super_admin' && activeView === 'dashboard') {
        setActiveView('admin_dashboard');
      }
      
      fetchTransactions(userId, userProfile.role);
    }
  };

  const fetchTransactions = async (userId: string, role: string) => {
    if (!supabase) return;
    
    let query = supabase.from('transactions').select('*, profiles(full_name)');
    
    // Non-admins only see their own
    if (role !== 'super_admin') {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    if (data) setTransactions(data);
  };

  const handleSaveTransaction = async (transaction: Transaction) => {
    if (!session || !supabase || !profile) return;
    
    const transData = {
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      note: transaction.note,
      date: transaction.date,
      user_id: session.user.id
    };

    if (editingTransaction) {
      const { error } = await supabase
        .from('transactions')
        .update(transData)
        .eq('id', transaction.id);
      
      if (!error) {
        setTransactions(prev => prev.map(t => t.id === transaction.id ? { ...t, ...transData } : t));
        setEditingTransaction(null);
        setActiveView('list');
      }
    } else {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transData])
        .select();
      
      if (data) {
        setTransactions(prev => [data[0], ...prev]);
        setActiveView('dashboard');
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  if (!loading && !supabase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
           <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
           <h1 className="text-2xl font-bold mb-2">কনফিগারেশন ত্রুটি</h1>
           <p className="text-gray-600">Supabase এর এনভায়রনমেন্ট ভেরিয়েবলগুলো সেট করা নেই।</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-600 font-bold">লোডিং হচ্ছে...</div>;
  if (!session || !profile) return <Auth />;

  const renderView = () => {
    switch (activeView) {
      case 'admin_dashboard': return <AdminDashboard transactions={transactions} />;
      case 'admin_users': return <AdminUsers />;
      case 'admin_transactions': return <AdminTransactions transactions={transactions} onDelete={handleDeleteTransaction} />;
      case 'dashboard': return <Dashboard transactions={transactions.filter(t => t.user_id === session.user.id)} />;
      case 'checkout': return <CheckoutForm />;
      case 'income':
        return (
          <TransactionForm 
            type="income" 
            onSave={handleSaveTransaction} 
            initialData={editingTransaction}
            onCancel={() => { setEditingTransaction(null); setActiveView(profile.role === 'super_admin' ? 'admin_transactions' : 'list'); }}
            userId={session.user.id}
          />
        );
      case 'expense':
        return (
          <TransactionForm 
            type="expense" 
            onSave={handleSaveTransaction} 
            initialData={editingTransaction}
            onCancel={() => { setEditingTransaction(null); setActiveView(profile.role === 'super_admin' ? 'admin_transactions' : 'list'); }}
            userId={session.user.id}
          />
        );
      case 'list': return <TransactionList transactions={transactions.filter(t => t.user_id === session.user.id)} onDelete={handleDeleteTransaction} onEdit={(t) => { setEditingTransaction(t); setActiveView(t.type === 'income' ? 'income' : 'expense'); }} />;
      case 'reports': return <Reports transactions={transactions.filter(t => t.user_id === session.user.id)} />;
      case 'settings': return <Settings profile={profile} onUpdateProfile={(p) => setProfile({...profile, name: p.name})} onLogout={() => supabase.auth.signOut()} onResetData={() => {}} onBackup={() => {}} onRestore={() => {}} />;
      default: return <Dashboard transactions={transactions.filter(t => t.user_id === session.user.id)} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView} profile={profile}>
      {renderView()}
    </Layout>
  );
};

export default App;
