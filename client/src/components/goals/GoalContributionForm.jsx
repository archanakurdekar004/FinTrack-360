import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { X, DollarSign, ArrowUpCircle } from 'lucide-react';

const contributeSchema = z.object({
  amount: z.coerce.number().refine((val) => val !== 0, { message: 'Amount cannot be zero' }),
});

export const GoalContributionForm = ({ goal, onSubmit, onClose, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contributeSchema),
    defaultValues: { amount: '' },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-800 relative space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ArrowUpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Contribute</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-sm text-slate-300 mb-1">To <strong>{goal.name}</strong></p>
          <p className="text-xs text-slate-500 mb-4">Use negative amount to withdraw.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.amount ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                }`}
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-400">{errors.amount.message}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalContributionForm;
