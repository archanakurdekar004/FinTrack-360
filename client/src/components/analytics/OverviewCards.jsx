import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet, PiggyBank, Target } from 'lucide-react';

export const OverviewCards = ({ data }) => {
  if (!data) return null;

  const { currentMonth, previousMonth, changes } = data;

  const renderChange = (percentChange, invertColors = false) => {
    const isPositive = percentChange > 0;
    const isNegative = percentChange < 0;
    const isZero = percentChange === 0;

    let colorClass = 'text-slate-400';
    let Icon = null;

    if (isPositive) {
      colorClass = invertColors ? 'text-rose-400' : 'text-emerald-400';
      Icon = ArrowUpRight;
    } else if (isNegative) {
      colorClass = invertColors ? 'text-emerald-400' : 'text-rose-400';
      Icon = ArrowDownRight;
    }

    return (
      <div className={`flex items-center space-x-1 text-[11px] font-medium ${colorClass}`}>
        {Icon && <Icon className="w-3 h-3" />}
        <span>
          {isZero ? 'No change' : `${Math.abs(percentChange).toFixed(1)}%`}
          {!isZero && <span className="text-slate-500 ml-1">vs last month</span>}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card hover>
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Total Income</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(currentMonth.income)}
            </h3>
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        {renderChange(changes.income)}
      </Card>

      <Card hover>
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(currentMonth.expenses)}
            </h3>
          </div>
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        {renderChange(changes.expenses, true)}
      </Card>

      <Card hover>
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Net Cash Flow</p>
            <h3 className={`text-2xl font-bold tracking-tight ${currentMonth.netCashFlow >= 0 ? 'text-white' : 'text-rose-400'}`}>
              {currentMonth.netCashFlow < 0 ? '-' : ''}{formatCurrency(Math.abs(currentMonth.netCashFlow))}
            </h3>
          </div>
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        {renderChange(changes.netCashFlow)}
      </Card>

      <Card hover>
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Savings Rate</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {currentMonth.savingsRate.toFixed(1)}%
            </h3>
          </div>
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Target: &gt; 20%
        </div>
      </Card>
    </div>
  );
};

export default OverviewCards;
