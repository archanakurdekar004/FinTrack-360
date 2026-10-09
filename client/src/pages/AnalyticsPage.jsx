import React, { useState, useEffect, useCallback } from 'react';
import analyticsService from '../services/analyticsService';
import OverviewCards from '../components/analytics/OverviewCards';
import MonthlyTrendsChart from '../components/analytics/MonthlyTrendsChart';
import CategoryBreakdownChart from '../components/analytics/CategoryBreakdownChart';
import BudgetPerformanceList from '../components/analytics/BudgetPerformanceList';
import { Button } from '../components/common/Button';
import { LineChart, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

export const AnalyticsPage = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [categories, setCategories] = useState(null);
  const [budgets, setBudgets] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallelize independent requests
      const [overviewRes, trendsRes, categoriesRes, budgetsRes] = await Promise.all([
        analyticsService.getOverview(month, year),
        analyticsService.getMonthlyTrends(6),
        analyticsService.getCategoryBreakdown(month, year),
        analyticsService.getBudgetPerformance(month, year)
      ]);

      setOverview(overviewRes.data);
      setTrends(trendsRes.data);
      setCategories(categoriesRes.data);
      setBudgets(budgetsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics data.');
      // Clear data on error to prevent displaying stale/fake values alongside an error
      setOverview(null);
      setTrends(null);
      setCategories(null);
      setBudgets(null);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (month === 1) {
        setMonth(12);
        setYear(y => y - 1);
      } else {
        setMonth(m => m - 1);
      }
    } else {
      if (month === 12) {
        setMonth(1);
        setYear(y => y + 1);
      } else {
        setMonth(m => m + 1);
      }
    }
  };

  const handleRefresh = () => {
    fetchAnalytics();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <LineChart className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Financial Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Insights and trends based on your recorded transactions
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 glass-panel px-1 py-1 rounded-xl">
            <button onClick={() => handleMonthChange('prev')} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-200 min-w-[100px] text-center">
              {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => handleMonthChange('next')} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleRefresh} isLoading={loading}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={handleRefresh} className="ml-auto underline text-xs hover:text-rose-300">
            Retry
          </button>
        </div>
      )}

      {loading && !overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 glass-panel rounded-xl"></div>
          ))}
          <div className="h-80 glass-panel rounded-xl md:col-span-4"></div>
        </div>
      )}

      {!loading && !error && overview && (
        <>
          <OverviewCards data={overview} />
          
          <div className="grid grid-cols-1 gap-6">
            <MonthlyTrendsChart data={trends} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdownChart data={categories} />
            <BudgetPerformanceList data={budgets} />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
