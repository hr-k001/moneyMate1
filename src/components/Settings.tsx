import React, { useState } from 'react';
import { Mail, Save, CheckCircle } from 'lucide-react';

interface SettingsProps {
  onSendReport: (email: string) => void;
}

export function Settings({ onSendReport }: SettingsProps) {
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendReport(email);
    setEmail('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
        <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Reports
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 animate-slide-in">
              <CheckCircle className="w-5 h-5" />
              Report sent successfully!
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Send Report
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
        <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <Save className="w-5 h-5" />
          Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Default Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full p-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <h3 className="text-sm font-medium text-emerald-800 mb-2">Coming Soon</h3>
            <ul className="text-sm text-emerald-600 space-y-2">
              <li>• Dark mode support</li>
              <li>• Export data to CSV</li>
              <li>• Budget planning tools</li>
              <li>• Recurring transactions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}