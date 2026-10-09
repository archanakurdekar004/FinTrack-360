import React from 'react';
import BudgetCard from './BudgetCard';

export const BudgetList = ({ budgets, onEdit, onDelete }) => {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-white font-medium mb-2">No budgets found</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          You haven't set up any budgets for this month. Create a budget to track your spending limits.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget._id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BudgetList;
