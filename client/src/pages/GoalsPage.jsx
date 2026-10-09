import React, { useState, useEffect, useCallback } from 'react';
import goalService from '../services/goalService';
import GoalList from '../components/goals/GoalList';
import GoalForm from '../components/goals/GoalForm';
import GoalContributionForm from '../components/goals/GoalContributionForm';
import DeleteGoalModal from '../components/goals/DeleteGoalModal';
import { Button } from '../components/common/Button';
import { Target, Plus, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await goalService.getGoals();
      setGoals(response?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load savings goals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Handlers
  const handleAddGoal = () => {
    setSelectedGoal(null);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setIsFormOpen(true);
  };

  const handleContribute = (goal) => {
    setSelectedGoal(goal);
    setIsContributeOpen(true);
  };

  const handleDeleteClick = (goal) => {
    setSelectedGoal(goal);
    setIsDeleteOpen(true);
  };

  // Submit Handlers
  const onGoalSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedGoal) {
        await goalService.updateGoal(selectedGoal._id, data);
      } else {
        await goalService.createGoal(data);
      }
      await fetchGoals();
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      // In a real app, toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const onContributeSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await goalService.contribute(selectedGoal._id, data.amount);
      await fetchGoals();
      setIsContributeOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteConfirm = async (goalId) => {
    setIsSubmitting(true);
    try {
      await goalService.deleteGoal(goalId);
      await fetchGoals();
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Savings Goals</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Track and manage your financial milestones</p>
        </div>

        <Button onClick={handleAddGoal} variant="primary">
          <Plus className="w-4 h-4 mr-2" /> New Goal
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchGoals} className="ml-auto underline text-xs hover:text-rose-300">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1">Active Goals</p>
            <h3 className="text-2xl font-bold text-white">{activeGoals}</h3>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1">Total Target</p>
            <h3 className="text-2xl font-bold text-white">{formatCurrency(totalTarget)}</h3>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1">Total Saved</p>
            <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(totalSaved)}</h3>
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
        <GoalList 
          goals={goals} 
          onAddGoal={handleAddGoal} 
          onEdit={handleEditGoal} 
          onDelete={handleDeleteClick} 
          onContribute={handleContribute} 
        />
      )}

      {isFormOpen && (
        <GoalForm 
          initialData={selectedGoal} 
          onSubmit={onGoalSubmit} 
          onClose={() => setIsFormOpen(false)} 
          isLoading={isSubmitting} 
        />
      )}

      {isContributeOpen && selectedGoal && (
        <GoalContributionForm 
          goal={selectedGoal} 
          onSubmit={onContributeSubmit} 
          onClose={() => setIsContributeOpen(false)} 
          isLoading={isSubmitting} 
        />
      )}

      {isDeleteOpen && selectedGoal && (
        <DeleteGoalModal 
          goal={selectedGoal} 
          onConfirm={onDeleteConfirm} 
          onClose={() => setIsDeleteOpen(false)} 
          isLoading={isSubmitting} 
        />
      )}
    </div>
  );
};

export default GoalsPage;
