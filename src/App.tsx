import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Receipt, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import { Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Settings } from './components/Settings';

type Section = 'dashboard' | 'transactions' | 'settings';

interface AuthFormData {
  email: string;
  password: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authData, setAuthData] = useState<AuthFormData>({
    email: '',
    password: '',
  });

  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    setTransactions(data || []);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setAuthError((error as Error).message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setTransactions([]);
  };

  const addTransaction = async (description: string, amount: number, type: 'income' | 'expense') => {
    if (!user) return;

    const newTransaction = {
      user_id: user.id,
      description,
      amount,
      type,
      date: new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    setTransactions([data, ...transactions]);
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }

    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleSendReport = (email: string) => {
    // TODO: Implement email report functionality
    console.log('Sending report to:', email);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <p className="text-emerald-800 text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-emerald-800 mb-6 text-center">MoneyMate</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            {authError && (
              <p className="text-red-600 text-sm">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="text-emerald-600 hover:text-emerald-700"
            >
              {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">MoneyMate</h1>
            <p className="text-emerald-600">Your Personal Finance Tracker</p>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'dashboard'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveSection('transactions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'transactions'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Transactions
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'settings'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </button>
            </nav>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {activeSection === 'dashboard' && (
          <Dashboard transactions={transactions} />
        )}

        {activeSection === 'transactions' && (
          <Transactions
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )}

        {activeSection === 'settings' && (
          <Settings onSendReport={handleSendReport} />
        )}
      </div>
    </div>
  );
}

export default App;