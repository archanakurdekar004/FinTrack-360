import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

export const MonthlyTrendsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card title="Monthly Cash Flow" action={<BarChart3 className="w-5 h-5 text-blue-400" />}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-slate-400">No trend data available.</p>
        </div>
      </Card>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    name: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' })
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl min-w-[150px]">
          <p className="text-xs font-semibold text-slate-300 mb-2">{label} {payload[0].payload.year}</p>
          {payload.map(p => (
            <div key={p.dataKey} className="flex justify-between items-center text-xs mb-1">
              <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
              <span className="font-bold text-white ml-3">{formatCurrency(p.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Monthly Cash Flow Trends" action={<BarChart3 className="w-5 h-5 text-blue-400" />}>
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} 
              iconType="circle"
            />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlyTrendsChart;
