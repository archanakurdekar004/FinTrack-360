import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DeleteTransactionModal = ({ transaction, onConfirm, onCancel, isLoading }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <Card className="max-w-md w-full p-6 space-y-4 border-slate-800">
        <div className="flex items-center space-x-3 text-rose-400">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Transaction</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Are you sure you want to delete this transaction for{' '}
          <span className="font-semibold text-white">
            {transaction.description || transaction.categoryId?.name || 'Transaction'} ({formatCurrency(transaction.amount)})
          </span>
          ?
        </p>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button variant="ghost" size="md" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} isLoading={isLoading}>
            Delete Transaction
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeleteTransactionModal;
