import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsePieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { IndianRupee, ArrowUpCircle, ArrowDownCircle, PieChart, TrendingUp } from 'lucide-react';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#10B981', '#EF4444'];

export function Dashboard({ transactions }: DashboardProps) {
  const balance = transactions.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = transactions.reduce((acc: any[], curr) => {
    const date = curr.date;
    const existingDay = acc.find(d => d.date === date);
    
    if (existingDay) {
      if (curr.type === 'income') {
        existingDay.income += curr.amount;
      } else {
        existingDay.expense += curr.amount;
      }
      existingDay.balance = existingDay.income - existingDay.expense;
    } else {
      acc.push({
        date,
        income: curr.type === 'income' ? curr.amount : 0,
        expense: curr.type === 'expense' ? curr.amount : 0,
        balance: curr.type === 'income' ? curr.amount : -curr.amount,
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pieData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ];

  const savingsPercentage = income > 0 ? ((income - expenses) / income) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover animate-slide-in" style={{ animationDelay: '0s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-800">Balance</h2>
            <IndianRupee className="text-emerald-600 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">₹{balance.toFixed(2)}</p>
          <div className="mt-2 text-sm text-emerald-600">
            {balance >= 0 ? 'You\'re in good standing!' : 'Time to save more'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-hover animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-800">Income</h2>
            <ArrowUpCircle className="text-emerald-600 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">₹{income.toFixed(2)}</p>
          <div className="mt-2 text-sm text-emerald-600">
            Total earnings this period
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-hover animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-800">Expenses</h2>
            <ArrowDownCircle className="text-emerald-600 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">₹{expenses.toFixed(2)}</p>
          <div className="mt-2 text-sm text-emerald-600">
            Total spending this period
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 card-hover animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-emerald-800">Savings Overview</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
            />
          </div>
          <span className="text-emerald-800 font-semibold">
            {savingsPercentage.toFixed(1)}% saved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 card-hover animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Income vs Expenses
          </h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 card-hover animate-slide-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Financial Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#059669" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} dot={{ strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}