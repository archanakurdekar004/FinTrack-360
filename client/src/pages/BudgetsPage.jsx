import React, { useState, useEffect, useCallback } from 'react';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import BudgetList from '../components/budgets/BudgetList';
import BudgetForm from '../components/budgets/BudgetForm';
import DeleteBudgetModal from '../components/budgets/DeleteBudgetModal';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { formatCurrency } from '../utils/formatters';
import { Target, TrendingDown, Wallet, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export const BudgetsPage = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingBudget, setDeletingBudget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await budgetService.getBudgets(month, year);
      setBudgets(response?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res?.data || []);
      } catch (err) {
        // console.error
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

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

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget._id, formData);
        triggerSuccess('Budget updated successfully.');
      } else {
        await budgetService.createBudget(formData);
        triggerSuccess('Budget created successfully.');
      }
      setIsFormOpen(false);
      fetchBudgets();
    } catch (err) {
      setError(err.message || 'Failed to save budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBudget) return;
    setIsDeleting(true);
    setError('');
    try {
      await budgetService.deleteBudget(deletingBudget._id);
      triggerSuccess('Budget deleted successfully.');
      setDeletingBudget(null);
      fetchBudgets();
    } catch (err) {
      setError(err.message || 'Failed to delete budget');
      setDeletingBudget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Budgets & Limits</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Set and monitor spending limits for your expense categories
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
          
          <Button variant="primary" size="md" onClick={() => { setEditingBudget(null); setIsFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Summary Totals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover title="Total Budgeted" action={<Target className="w-5 h-5 text-indigo-400" />}>
          <div className="text-2xl font-bold text-indigo-400 tracking-tight">
            {formatCurrency(totalBudgeted)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total limits set for this month</p>
        </Card>

        <Card hover title="Total Spent" action={<TrendingDown className="w-5 h-5 text-rose-400" />}>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            {formatCurrency(totalSpent)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total spending across budgeted categories</p>
        </Card>

        <Card hover title="Overall Remaining" action={<Wallet className="w-5 h-5 text-teal-400" />}>
          <div
            className={`text-2xl font-bold tracking-tight ${
              totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalRemaining < 0 ? '-' : ''}{formatCurrency(Math.abs(totalRemaining))}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Overall budget balance</p>
        </Card>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading & List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel h-40 rounded-xl p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-slate-800 rounded w-full"></div>
                <div className="h-2 bg-slate-800 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BudgetList
          budgets={budgets}
          onEdit={(b) => { setEditingBudget(b); setIsFormOpen(true); }}
          onDelete={(b) => setDeletingBudget(b)}
        />
      )}

      {/* Modals */}
      {isFormOpen && (
        <BudgetForm
          initialData={editingBudget}
          categories={categories}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      {deletingBudget && (
        <DeleteBudgetModal
          budget={deletingBudget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingBudget(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default BudgetsPage;
