import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

export const CategoryBreakdownChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card title="Expenses by Category" action={<PieChartIcon className="w-5 h-5 text-emerald-400" />}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-slate-400">No expenses recorded for this month.</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-xs font-semibold text-white flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: data.color }}></span>
            {data.name}
          </p>
          <p className="text-sm font-bold text-slate-200 mt-1">
            {formatCurrency(data.totalSpent)}
          </p>
          <p className="text-[10px] text-slate-400">
            {data.percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Expenses by Category" action={<PieChartIcon className="w-5 h-5 text-emerald-400" />} className="h-full">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="totalSpent"
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.categoryId}`} fill={entry.color || '#3b82f6'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
        {data.map((item) => (
          <div key={item.categoryId} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                {item.icon}
              </div>
              <span className="text-xs font-medium text-slate-300">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white block">{formatCurrency(item.totalSpent)}</span>
              <span className="text-[10px] text-slate-500 block">{item.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CategoryBreakdownChart;
