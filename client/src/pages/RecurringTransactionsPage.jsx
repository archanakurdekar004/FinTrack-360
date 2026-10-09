import React, { useState, useEffect, useCallback } from 'react';
import recurringTransactionService from '../services/recurringTransactionService';
import categoryService from '../services/categoryService';
import RecurringTransactionList from '../components/recurring/RecurringTransactionList';
import RecurringTransactionForm from '../components/recurring/RecurringTransactionForm';
import DeleteRecurringTransactionModal from '../components/recurring/DeleteRecurringTransactionModal';
import { Button } from '../components/common/Button';
import { CalendarClock, Plus, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export const RecurringTransactionsPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processResult, setProcessResult] = useState(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await recurringTransactionService.getSchedules();
      setSchedules(response?.data?.schedules || []);
    } catch (err) {
      setError(err.message || 'Failed to load recurring transactions.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSchedules();
  }, [fetchCategories, fetchSchedules]);

  // Handlers
  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsFormOpen(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteOpen(true);
  };

  const handlePause = async (schedule) => {
    try {
      await recurringTransactionService.pauseSchedule(schedule._id);
      await fetchSchedules();
    } catch (err) {
      setError(err.message || 'Failed to pause schedule');
    }
  };

  const handleResume = async (schedule) => {
    try {
      await recurringTransactionService.resumeSchedule(schedule._id);
      await fetchSchedules();
    } catch (err) {
      setError(err.message || 'Failed to resume schedule');
    }
  };

  const handleProcessDue = async () => {
    setIsProcessing(true);
    setProcessResult(null);
    setError(null);
    try {
      const res = await recurringTransactionService.processDue();
      const { processedCount, skippedCount, schedulesProcessed } = res.data;
      setProcessResult(`Processed ${schedulesProcessed} schedules. Generated ${processedCount} transactions. Skipped ${skippedCount} duplicates.`);
      await fetchSchedules();
    } catch (err) {
      setError(err.message || 'Failed to process due schedules.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessResult(null), 8000);
    }
  };

  // Submit Handlers
  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedSchedule) {
        await recurringTransactionService.updateSchedule(selectedSchedule._id, data);
      } else {
        await recurringTransactionService.createSchedule(data);
      }
      await fetchSchedules();
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteConfirm = async (id) => {
    setIsSubmitting(true);
    try {
      await recurringTransactionService.deleteSchedule(id);
      await fetchSchedules();
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const activeSchedules = schedules.filter(s => s.status === 'active').length;
  const pausedSchedules = schedules.filter(s => s.status === 'paused').length;
  const completedSchedules = schedules.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CalendarClock className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Recurring Transactions</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage scheduled income and expenses</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button onClick={handleProcessDue} variant="outline" isLoading={isProcessing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} /> Process Due
          </Button>
          <Button onClick={handleAddSchedule} variant="primary">
            <Plus className="w-4 h-4 mr-2" /> New Schedule
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-1 hover:text-white">
            <Plus className="w-4 h-4 rotate-45" />
          </button>
        </div>
      )}

      {processResult && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{processResult}</span>
        </div>
      )}

      {!loading && !error && schedules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1">Active</p>
            <h3 className="text-2xl font-bold text-emerald-400">{activeSchedules}</h3>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1">Paused</p>
            <h3 className="text-2xl font-bold text-amber-400">{pausedSchedules}</h3>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1">Completed</p>
            <h3 className="text-2xl font-bold text-slate-400">{completedSchedules}</h3>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 glass-panel rounded-xl"></div>
          ))}
        </div>
      ) : (
        <RecurringTransactionList 
          schedules={schedules} 
          onAddSchedule={handleAddSchedule} 
          onEdit={handleEditSchedule} 
          onDelete={handleDeleteClick} 
          onPause={handlePause}
          onResume={handleResume}
        />
      )}

      {isFormOpen && (
        <RecurringTransactionForm 
          initialData={selectedSchedule} 
          categories={categories}
          onSubmit={onFormSubmit} 
          onClose={() => setIsFormOpen(false)} 
          isLoading={isSubmitting} 
        />
      )}

      {isDeleteOpen && selectedSchedule && (
        <DeleteRecurringTransactionModal 
          schedule={selectedSchedule} 
          onConfirm={onDeleteConfirm} 
          onClose={() => setIsDeleteOpen(false)} 
          isLoading={isSubmitting} 
        />
      )}
    </div>
  );
};

export default RecurringTransactionsPage;
