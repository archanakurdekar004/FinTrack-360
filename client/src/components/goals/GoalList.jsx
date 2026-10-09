import React from 'react';
import GoalCard from './GoalCard';
import { Target } from 'lucide-react';
import { Button } from '../common/Button';

export const GoalList = ({ goals, onEdit, onDelete, onContribute, onAddGoal }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-2xl border border-slate-800">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Savings Goals Yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Set up savings goals for an emergency fund, vacation, or big purchase to track your progress over time.
        </p>
        <Button onClick={onAddGoal} variant="primary">
          Create Your First Goal
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <GoalCard 
          key={goal._id} 
          goal={goal} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onContribute={onContribute} 
        />
      ))}
    </div>
  );
};

export default GoalList;
