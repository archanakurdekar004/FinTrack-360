import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { X, Tag, Palette, Smile } from 'lucide-react';

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  type: z.enum(['expense', 'income', 'both'], {
    required_error: 'Type is required',
  }),
  icon: z.string().trim().min(1, 'Icon symbol is required'),
  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color (e.g. #10b981)'),
  isActive: z.boolean().default(true),
});

const PRESET_EMOJIS = ['🍔', '🏠', '⚡', '🚗', '🛍️', '🏥', '🎬', '📚', '✈️', '💼', '💻', '🏢', '📈', '💵', '🎁', '📦'];
const PRESET_COLORS = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#64748b'];

export const CategoryForm = ({ initialData, onSubmit, onClose, isLoading }) => {
  const isEditing = Boolean(initialData?._id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
      icon: '🍔',
      color: '#10b981',
      isActive: true,
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        type: initialData.type || 'expense',
        icon: initialData.icon || '🍔',
        color: initialData.color || '#10b981',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-800 relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Category' : 'Create New Category'}
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
          {/* Category Name */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Groceries or Freelance"
              {...register('name')}
              className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
          </div>

          {/* Category Type */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">Category Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['expense', 'income', 'both'].map((t) => (
                <label
                  key={t}
                  className={`flex items-center justify-center py-2 px-3 rounded-lg border text-xs font-semibold uppercase cursor-pointer transition-colors ${
                    watch('type') === t
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    value={t}
                    {...register('type')}
                    className="sr-only"
                  />
                  {t}
                </label>
              ))}
            </div>
            {errors.type && <p className="text-xs text-rose-400">{errors.type.message}</p>}
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Icon Symbol</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" /> Chosen: {selectedIcon}
              </span>
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              {PRESET_EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setValue('icon', emoji)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-lg transition-transform ${
                    selectedIcon === emoji
                      ? 'bg-emerald-500/30 border border-emerald-500 scale-110'
                      : 'hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input type="text" {...register('icon')} className="sr-only" />
            {errors.icon && <p className="text-xs text-rose-400">{errors.icon.message}</p>}
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Theme Color</span>
              <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                <Palette className="w-3.5 h-3.5" /> {selectedColor}
              </span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex flex-wrap gap-2 p-2 bg-slate-900/60 rounded-lg border border-slate-800 flex-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setValue('color', c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === c ? 'ring-2 ring-emerald-400 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  ></button>
                ))}
              </div>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setValue('color', e.target.value)}
                className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded-lg shrink-0"
              />
            </div>
            {errors.color && <p className="text-xs text-rose-400">{errors.color.message}</p>}
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
            />
            <label htmlFor="isActive" className="text-xs font-medium text-slate-300 cursor-pointer">
              Active Category (Available for transactions)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
