import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { Target, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BudgetPerformanceList = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card title="Budget Performance" action={<Target className="w-5 h-5 text-indigo-400" />}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm text-slate-300 font-medium mb-1">No active budgets</p>
          <p className="text-xs text-slate-500 mb-4 max-w-[200px]">
            Set monthly limits for your categories to track performance.
          </p>
          <Link to="/budgets" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Manage Budgets &rarr;
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Budget Performance" action={<Target className="w-5 h-5 text-indigo-400" />} className="h-full">
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {data.map((budget) => {
          let statusColor = 'text-emerald-400';
          let bgColor = 'bg-emerald-400';
          
          if (budget.status === 'exceeded') {
            statusColor = 'text-rose-400';
            bgColor = 'bg-rose-400';
          } else if (budget.status === 'warning') {
            statusColor = 'text-amber-400';
            bgColor = 'bg-amber-400';
          }

          const progressPercent = Math.min(budget.usagePercentage, 100);

          return (
            <div key={budget.categoryId} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: `${budget.color}20`, color: budget.color }}
                  >
                    {budget.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{budget.name}</h4>
                    <p className={`text-[10px] uppercase font-bold tracking-wider ${statusColor}`}>
                      {budget.status.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(budget.spentAmount)}</p>
                  <p className="text-[10px] text-slate-400">of {formatCurrency(budget.budgetAmount)}</p>
                </div>
              </div>
              
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${bgColor}`} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BudgetPerformanceList;
