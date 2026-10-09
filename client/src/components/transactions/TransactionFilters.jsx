import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export const TransactionFilters = ({
  filters,
  categories = [],
  onFilterChange,
  onClearFilters,
}) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="glass-panel rounded-xl p-4 space-y-4 border border-slate-800">
      {/* Top Row: Type Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 w-full md:w-auto">
          {[
            { id: '', label: 'All' },
            { id: 'expense', label: 'Expenses' },
            { id: 'income', label: 'Income' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleChange('type', tab.id)}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                (filters.type || '') === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search description or notes..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Bottom Row: Category, Payment Method, Date Range & Clear */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Payment Method</label>
          <select
            value={filters.paymentMethod || ''}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="debit_card">Debit Card</option>
            <option value="credit_card">Credit Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="net_banking">Net Banking</option>
            <option value="wallet">Wallet</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">From Date</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* End Date & Clear */}
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">To Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            title="Clear All Filters"
            className="shrink-0 h-[34px] px-2.5 border border-slate-800 hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
