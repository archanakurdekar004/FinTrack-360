import React from 'react';
import TransactionCard from './TransactionCard';
import { Receipt } from 'lucide-react';

export const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center space-y-3 border border-slate-800">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Receipt className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">No Transactions Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No financial transactions match your filter criteria or search query. Click &quot;Add Transaction&quot; to record a new entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <TransactionCard key={tx._id} transaction={tx} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TransactionList;
