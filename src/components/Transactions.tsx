import React, { useState } from 'react';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (description: string, amount: number, type: 'income' | 'expense') => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export function Transactions({ transactions, onAddTransaction, onDeleteTransaction }: TransactionsProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await onAddTransaction(description, Number(amount), type);
      setDescription('');
      setAmount('');
      setType('income');
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
        <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Add Transaction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
          <div className="transition-all duration-200">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
              required
            />
          </div>
          <div className="transition-all duration-200">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 p-2 rounded-lg transition-all duration-200 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 p-2 rounded-lg transition-all duration-200 ${
                type === 'expense'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              Expense
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-emerald-600 text-white p-2 rounded-lg transition-all duration-200 ${
              isSubmitting 
                ? 'opacity-75 cursor-not-allowed'
                : 'hover:bg-emerald-700 hover:shadow-lg'
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">Recent Transactions</h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8 animate-fade-in">
              <p className="text-lg">No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started!</p>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100 animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div>
                  <p className="font-medium text-emerald-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                  </span>
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}