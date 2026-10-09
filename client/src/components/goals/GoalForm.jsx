import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { X, Target, Calendar, DollarSign, PenLine } from 'lucide-react';

const goalSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
  targetAmount: z.coerce.number().positive('Target amount must be positive'),
  targetDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
});

export const GoalForm = ({ initialData, onSubmit, onClose, isLoading }) => {
  const isEditing = Boolean(initialData?._id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      targetAmount: initialData?.targetAmount || '',
      targetDate: initialData?.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : '',
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-800 relative space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Goal' : 'Create New Goal'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">Goal Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <PenLine className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Emergency Fund"
                {...register('name')}
                className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Target Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...register('targetAmount', { valueAsNumber: true })}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.targetAmount ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.targetAmount && <p className="text-xs text-rose-400">{errors.targetAmount.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Target Date (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  {...register('targetDate')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                    errors.targetDate ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.targetDate && <p className="text-xs text-rose-400">{errors.targetDate.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">Description (Optional)</label>
            <input
              type="text"
              placeholder="What is this goal for?"
              {...register('description')}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-indigo-500/60 focus:ring-indigo-500/20"
            />
            {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
