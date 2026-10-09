import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import analyticsService from '../services/analyticsService';
import transactionService from '../services/transactionService';
import goalService from '../services/goalService';
import recurringTransactionService from '../services/recurringTransactionService';
import { Card } from '../components/common/Card';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, Target, Clock, AlertCircle, ArrowRight, ArrowUpCircle, ArrowDownCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const LandingPage = () => {
  const { backendStatus } = useOutletContext() || {};
  const currentDate = new Date();
  
  const [overview, setOverview] = useState({ totalIncome: 0, totalExpenses: 0, netCashFlow: 0, savingsRate: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetPerformance, setBudgetPerformance] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [upcomingRecurring, setUpcomingRecurring] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const [
        overviewRes,
        transactionsRes,
        budgetRes,
        goalsRes,
        recurringRes
      ] = await Promise.all([
        analyticsService.getOverview(month, year),
        transactionService.getTransactions({ page: 1, limit: 5 }),
        analyticsService.getBudgetPerformance(month, year),
        goalService.getGoals(),
        recurringTransactionService.getSchedules({ status: 'active', limit: 5 })
      ]);
      
      setOverview(overviewRes.data);
      setRecentTransactions(transactionsRes.data.transactions);
      setBudgetPerformance(budgetRes.data);
      setActiveGoals(goalsRes.data.filter(g => g.status === 'active').slice(0, 3));
      
      // Sort upcoming recurring by date ascending
      const schedules = recurringRes.data.schedules || [];
      const sortedSchedules = schedules.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate)).slice(0, 3);
      setUpcomingRecurring(sortedSchedules);
      
    } catch (err) {
      setError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 glass-panel rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 glass-panel rounded-2xl animate-pulse"></div>
          <div className="h-96 glass-panel rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Overview</h1>
          <p className="text-sm text-slate-400">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${backendStatus?.connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
          <span className="text-slate-400">Sync Active</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-emerald-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingUp className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Total Income</p>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{formatCurrency(overview.totalIncome)}</h2>
          </div>
        </Card>
        
        <Card className="border border-rose-500/20 bg-gradient-to-br from-slate-900 to-rose-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingDown className="w-16 h-16 text-rose-400" />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Total Expenses</p>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{formatCurrency(overview.totalExpenses)}</h2>
          </div>
        </Card>
        
        <Card className="border border-indigo-500/20 bg-gradient-to-br from-slate-900 to-indigo-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Wallet className="w-16 h-16 text-indigo-400" />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Net Balance</p>
            <h2 className={`text-3xl font-extrabold tracking-tight ${overview.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(overview.netCashFlow)}
            </h2>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card title="Recent Transactions" action={
          <Link to="/transactions" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        }>
          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No recent transactions found.</div>
          ) : (
            <div className="space-y-3 mt-4">
              {recentTransactions.map(t => (
                <div key={t._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors border border-slate-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800" style={{ color: t.categoryId?.color }}>
                      {t.categoryId?.icon || <span className="text-slate-400">?</span>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{t.categoryId?.name}</p>
                      <p className="text-xs text-slate-500">{formatDate(t.date)} {t.description && `• ${t.description}`}</p>
                    </div>
                  </div>
                  <div className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Budget Performance */}
        <Card title="Budget Progress" action={
          <Link to="/budgets" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
            Manage <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        }>
          {budgetPerformance.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No active budgets for this month.</div>
          ) : (
            <div className="space-y-4 mt-4">
              {budgetPerformance.map(bp => {
                const statusColor = bp.status === 'EXCEEDED' ? 'bg-rose-500' : bp.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div key={bp.budgetId} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-300">{bp.categoryName}</span>
                      <span className="text-slate-400">{formatCurrency(bp.spentAmount)} / {formatCurrency(bp.budgetAmount)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${statusColor} transition-all`} style={{ width: `${Math.min(bp.percentageUsed, 100)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Savings Goals */}
        <Card title="Active Savings Goals" action={
          <Link to="/savings" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        }>
          {activeGoals.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No active savings goals.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {activeGoals.map(goal => (
                <div key={goal._id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-200 text-sm line-clamp-1">{goal.name}</h4>
                    <Target className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-lg font-bold text-white">{formatCurrency(goal.currentAmount)}</span>
                      <span className="text-xs text-slate-500">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${goal.progressPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Recurring */}
        <Card title="Upcoming Recurring" action={
          <Link to="/recurring" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
            Manage <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        }>
          {upcomingRecurring.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No upcoming scheduled transactions.</div>
          ) : (
            <div className="space-y-3 mt-4">
              {upcomingRecurring.map(schedule => (
                <div key={schedule._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{schedule.title}</p>
                      <p className="text-xs text-slate-500">Due: <span className="text-slate-300">{formatDate(schedule.nextDueDate)}</span> • {schedule.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${schedule.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {formatCurrency(schedule.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
