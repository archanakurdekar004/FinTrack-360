import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AlertCircle } from 'lucide-react';

export const DeleteBudgetModal = ({ budget, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-sm overflow-hidden p-6 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Delete Budget?</h2>
          <p className="text-sm text-slate-400 mb-6">
            Are you sure you want to delete the <span className="text-slate-200 font-medium">{budget?.category?.name}</span> budget limit?
            Your transaction history will remain intact.
          </p>
        </div>

        <div className="flex space-x-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeleteBudgetModal;
