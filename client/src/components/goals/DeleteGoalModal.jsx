import React from 'react';
import { Button } from '../common/Button';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteGoalModal = ({ goal, onConfirm, onClose, isLoading }) => {
  if (!goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-rose-500/30 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Delete Goal?</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete <strong className="text-slate-200">{goal.name}</strong>? This action cannot be undone and tracking will be lost.
            </p>
          </div>

          <div className="flex w-full space-x-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white" 
              onClick={() => onConfirm(goal._id)} 
              isLoading={isLoading}
            >
              Delete Goal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteGoalModal;
