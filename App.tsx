
import React, { useState, useEffect } from 'react';
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
import { Transaction, UserProfile, View } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Initial Data Setup from LocalStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('hc_transactions');
    const savedProfiles = localStorage.getItem('hc_profiles');
    const savedSession = localStorage.getItem('hc_session');

    // Default admin if no profiles exist
    const initialProfiles: UserProfile[] = savedProfiles ? JSON.parse(savedProfiles) : [
      { id: 'admin-001', name: 'এডমিন', role: 'super_admin', email: 'admin@mail.com', password: 'admin123', created_at: new Date().toISOString() }
    ];

    if (!savedProfiles) {
      localStorage.setItem('hc_profiles', JSON.stringify(initialProfiles));
    }

    setProfiles(initialProfiles);
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    if (savedSession) {
      const sessionUser = JSON.parse(savedSession);
      // Ensure session is synced with profiles (in case of updates)
      const currentProfile = initialProfiles.find(p => p.id === sessionUser.id);
      if (currentProfile) {
        setCurrentUser(currentProfile);
        if (currentProfile.role === 'super_admin' && activeView === 'dashboard') {
          setActiveView('admin_dashboard');
        }
      } else {
        localStorage.removeItem('hc_session');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('hc_session', JSON.stringify(user));
    if (user.role === 'super_admin') {
      setActiveView('admin_dashboard');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hc_session');
    setActiveView('dashboard');
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    let updated;
    if (editingTransaction) {
      updated = transactions.map(t => t.id === transaction.id ? transaction : t);
    } else {
      updated = [transaction, ...transactions];
    }
    setTransactions(updated);
    localStorage.setItem('hc_transactions', JSON.stringify(updated));
    setEditingTransaction(null);
    setActiveView('list');
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('hc_transactions', JSON.stringify(updated));
  };

  const handleUpdateProfiles = (newProfiles: UserProfile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('hc_profiles', JSON.stringify(newProfiles));
    if (currentUser) {
      const updatedMe = newProfiles.find(p => p.id === currentUser.id);
      if (updatedMe) {
        setCurrentUser(updatedMe);
        localStorage.setItem('hc_session', JSON.stringify(updatedMe));
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-600 font-bold">লোড হচ্ছে...</div>;
  if (!currentUser) return <Auth onLogin={handleLogin} />;

  const userTransactions = currentUser.role === 'super_admin' 
    ? transactions 
    : transactions.filter(t => t.user_id === currentUser.id);

  const renderView = () => {
    switch (activeView) {
      case 'admin_dashboard': 
        return <AdminDashboard transactions={transactions} profiles={profiles} />;
      case 'admin_users': 
        return <AdminUsers profiles={profiles} onUpdate={handleUpdateProfiles} />;
      case 'admin_transactions': 
        return <AdminTransactions transactions={transactions} onDelete={handleDeleteTransaction} profiles={profiles} />;
      case 'dashboard': 
        return <Dashboard transactions={userTransactions} />;
      case 'income':
        return (
          <TransactionForm 
            type="income" 
            onSave={handleSaveTransaction} 
            initialData={editingTransaction}
            onCancel={() => { setEditingTransaction(null); setActiveView('list'); }}
            userId={currentUser.id}
          />
        );
      case 'expense':
        return (
          <TransactionForm 
            type="expense" 
            onSave={handleSaveTransaction} 
            initialData={editingTransaction}
            onCancel={() => { setEditingTransaction(null); setActiveView('list'); }}
            userId={currentUser.id}
          />
        );
      case 'list': 
        return (
          <TransactionList 
            transactions={userTransactions} 
            onDelete={handleDeleteTransaction} 
            onEdit={(t) => { setEditingTransaction(t); setActiveView(t.type === 'income' ? 'income' : 'expense'); }} 
          />
        );
      case 'reports': 
        return <Reports transactions={userTransactions} />;
      case 'settings': 
        return (
          <Settings 
            profile={currentUser} 
            profiles={profiles}
            onUpdateProfile={handleUpdateProfiles} 
            onLogout={handleLogout} 
          />
        );
      default: return <Dashboard transactions={userTransactions} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView} profile={currentUser} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );
};

export default App;
