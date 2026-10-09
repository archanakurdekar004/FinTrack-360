import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { X, Receipt, Calendar, DollarSign, CreditCard } from 'lucide-react';

const transactionSchema = z.object({
  type: z.enum(['expense', 'income'], { required_error: 'Type is required' }),
  categoryId: z.string().min(1, 'Category selection is required'),
  amount: z
    .coerce
    .number({ invalid_type_error: 'Amount must be a number' })
    .gt(0, 'Amount must be a positive number greater than 0'),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  paymentMethod: z.enum([
    'cash',
    'debit_card',
    'credit_card',
    'upi',
    'bank_transfer',
    'net_banking',
    'wallet',
    'other',
  ]),
  description: z.string().trim().max(250, 'Description cannot exceed 250 characters').optional(),
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const TransactionForm = ({ initialData, categories = [], onSubmit, onClose, isLoading }) => {
  const isEditing = Boolean(initialData?._id);

  // Today's YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      categoryId: '',
      amount: '',
      date: todayStr,
      paymentMethod: 'cash',
      description: '',
      notes: '',
    },
  });

  const selectedType = watch('type');
  const selectedCategory = watch('categoryId');

  // Filter compatible active categories based on chosen transaction type
  const compatibleCategories = categories.filter(
    (c) => c.isActive && (c.type === selectedType || c.type === 'both')
  );

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.date
        ? new Date(initialData.date).toISOString().split('T')[0]
        : todayStr;

      reset({
        type: initialData.type || 'expense',
        categoryId: initialData.categoryId?._id || initialData.categoryId || '',
        amount: initialData.amount || '',
        date: formattedDate,
        paymentMethod: initialData.paymentMethod || 'cash',
        description: initialData.description || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, reset, todayStr]);

  // Auto-select first compatible category if current selection is incompatible
  useEffect(() => {
    if (compatibleCategories.length > 0) {
      const isStillValid = compatibleCategories.some((c) => c._id === selectedCategory);
      if (!isStillValid) {
        setValue('categoryId', compatibleCategories[0]._id);
      }
    } else {
      setValue('categoryId', '');
    }
  }, [selectedType, compatibleCategories, selectedCategory, setValue]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-800 relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Transaction' : 'Record Transaction'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Transaction Type Radio Tabs */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center justify-center py-2 px-3 rounded-lg border text-xs font-semibold uppercase cursor-pointer transition-colors ${
                  selectedType === 'expense'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  value="expense"
                  {...register('type')}
                  className="sr-only"
                />
                Expense (-)
              </label>

              <label
                className={`flex items-center justify-center py-2 px-3 rounded-lg border text-xs font-semibold uppercase cursor-pointer transition-colors ${
                  selectedType === 'income'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  value="income"
                  {...register('type')}
                  className="sr-only"
                />
                Income (+)
              </label>
            </div>
            {errors.type && <p className="text-xs text-rose-400">{errors.type.message}</p>}
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount */}
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
                  {...register('amount')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.amount
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-400">{errors.amount.message}</p>}
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Transaction Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  {...register('date')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                    errors.date
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.date && <p className="text-xs text-rose-400">{errors.date.message}</p>}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Category ({selectedType} compatible)
            </label>
            <select
              {...register('categoryId')}
              className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                errors.categoryId
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
              }`}
            >
              {compatibleCategories.length === 0 ? (
                <option value="">No compatible active categories available</option>
              ) : (
                compatibleCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.icon} {c.name}
                  </option>
                ))
              )}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-rose-400">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Payment Method & Description Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Payment Method */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Payment Method</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <CreditCard className="w-4 h-4" />
                </div>
                <select
                  {...register('paymentMethod')}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                >
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
              {errors.paymentMethod && (
                <p className="text-xs text-rose-400">{errors.paymentMethod.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Description</label>
              <input
                type="text"
                placeholder="e.g. Weekly Groceries"
                {...register('description')}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-rose-500/80 focus:ring-rose-500/40'
                    : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-400">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Notes <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Additional memo or invoice reference"
              {...register('notes')}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-emerald-500/60 focus:ring-emerald-500/20"
            />
            {errors.notes && <p className="text-xs text-rose-400">{errors.notes.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Record Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
