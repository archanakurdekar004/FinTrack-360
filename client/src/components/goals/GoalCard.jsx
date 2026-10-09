import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Target, TrendingUp, Calendar, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export const GoalCard = ({ goal, onEdit, onDelete, onContribute }) => {
  const isCompleted = goal.status === 'completed';
  
  return (
    <Card className="flex flex-col h-full border border-slate-800">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>{goal.name}</span>
            {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </h3>
          {goal.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{goal.description}</p>}
        </div>
        <div className="flex space-x-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button onClick={() => onEdit(goal)} className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(goal)} className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Saved</p>
              <p className="text-xl font-bold text-white">{formatCurrency(goal.currentAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Goal</p>
              <p className="text-sm font-medium text-slate-300">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>
          
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${goal.progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-slate-400">{goal.progressPercentage.toFixed(1)}% complete</p>
            {!isCompleted && (
              <p className="text-xs text-slate-400">{formatCurrency(goal.remainingAmount)} to go</p>
            )}
          </div>
        </div>

        {(goal.targetDate || goal.monthlyContributionTarget) && (
          <div className="bg-slate-900 rounded-lg p-3 space-y-2 border border-slate-800/50">
            {goal.targetDate && (
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center text-slate-400"><Calendar className="w-3.5 h-3.5 mr-1" /> Target Date:</span>
                <span className="text-slate-200 font-medium">{formatDate(goal.targetDate)}</span>
              </div>
            )}
            {goal.monthlyContributionTarget !== null && !isCompleted && (
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center text-slate-400"><Target className="w-3.5 h-3.5 mr-1" /> Est. Monthly:</span>
                <span className="text-indigo-400 font-medium">{formatCurrency(goal.monthlyContributionTarget)}/mo</span>
              </div>
            )}
          </div>
        )}

        <Button 
          variant={isCompleted ? 'outline' : 'primary'} 
          className="w-full mt-2" 
          onClick={() => onContribute(goal)}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isCompleted ? 'Add/Withdraw Funds' : 'Add Funds'}
        </Button>
      </div>
    </Card>
  );
};

export default GoalCard;
