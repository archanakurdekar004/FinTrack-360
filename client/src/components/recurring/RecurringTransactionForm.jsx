import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { X, CalendarClock, PenLine, DollarSign } from 'lucide-react';

const scheduleSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100),
  type: z.enum(['expense', 'income']),
  amount: z.coerce.number().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  paymentMethod: z.enum(['cash', 'debit_card', 'credit_card', 'upi', 'bank_transfer', 'net_banking', 'wallet', 'other']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  }
);

export const RecurringTransactionForm = ({ initialData, categories, onSubmit, onClose, isLoading }) => {
  const isEditing = Boolean(initialData?._id);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'expense',
      amount: initialData?.amount || '',
      categoryId: initialData?.categoryId?._id || initialData?.categoryId || '',
      frequency: initialData?.frequency || 'monthly',
      paymentMethod: initialData?.paymentMethod || 'bank_transfer',
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      notes: initialData?.notes || '',
    },
  });

  const selectedType = watch('type');

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.isActive && (c.type === 'both' || c.type === selectedType));
  }, [categories, selectedType]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-slate-800 relative my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
          <div className="flex items-center space-x-2">
            <CalendarClock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Recurring Schedule' : 'Create Recurring Schedule'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 w-full mb-4">
            <label className={`flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${selectedType === 'expense' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-white'}`}>
              <input type="radio" value="expense" {...register('type')} className="sr-only" />
              Expense
            </label>
            <label className={`flex-1 text-center py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${selectedType === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
              <input type="radio" value="income" {...register('type')} className="sr-only" />
              Income
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-300">Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <PenLine className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Netflix Subscription"
                  {...register('title')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.title ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.amount ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-400">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Category</label>
              <select
                {...register('categoryId')}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                  errors.categoryId ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                }`}
              >
                <option value="">Select Category</option>
                {filteredCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-rose-400">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Frequency</label>
              <select
                {...register('frequency')}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:border-indigo-500/60 focus:ring-indigo-500/20"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Payment Method</label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:border-indigo-500/60 focus:ring-indigo-500/20"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="wallet">Wallet</option>
                <option value="net_banking">Net Banking</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Start Date</label>
              <input
                type="date"
                {...register('startDate')}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                  errors.startDate ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                }`}
              />
              {errors.startDate && <p className="text-xs text-rose-400">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">End Date (Optional)</label>
              <input
                type="date"
                {...register('endDate')}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                  errors.endDate ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                }`}
              />
              {errors.endDate && <p className="text-xs text-rose-400">{errors.endDate.message}</p>}
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-300">Notes (Optional)</label>
              <input
                type="text"
                {...register('notes')}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:border-indigo-500/60 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
            <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringTransactionForm;
