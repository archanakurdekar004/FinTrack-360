import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

export const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { category, amount, spentAmount, remainingAmount, usagePercentage, isExceeded } = budget;

  let statusClass = 'text-emerald-400 bg-emerald-400/20';
  let progressClass = 'bg-emerald-400';
  let statusText = 'On Track';

  if (isExceeded) {
    statusClass = 'text-rose-400 bg-rose-400/20';
    progressClass = 'bg-rose-400';
    statusText = 'Exceeded';
  } else if (usagePercentage >= 80) {
    statusClass = 'text-amber-400 bg-amber-400/20';
    progressClass = 'bg-amber-400';
    statusText = 'Warning';
  }

  const cappedPercentage = Math.min(usagePercentage, 100);

  return (
    <Card hover className="relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold">{category.name}</h3>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusClass}`}>
              {statusText}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(budget)} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(budget)} className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-500">Spent</p>
            <p className="text-lg font-bold text-white">{formatCurrency(spentAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Budgeted</p>
            <p className="text-sm font-medium text-slate-300">{formatCurrency(amount)}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">{usagePercentage.toFixed(1)}% Used</span>
            <span className={isExceeded ? 'text-rose-400 font-medium' : 'text-slate-400'}>
              {isExceeded ? `${formatCurrency(Math.abs(remainingAmount))} Over` : `${formatCurrency(remainingAmount)} Left`}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${progressClass}`}
              style={{ width: `${cappedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetCard;
