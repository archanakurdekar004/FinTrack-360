import React from 'react';
import { Card } from '../common/Card';
import { Edit2, Trash2, Power, Shield } from 'lucide-react';

export const CategoryCard = ({ category, onEdit, onToggleActive, onDelete }) => {
  const { _id, name, type, icon, color, isDefault, isActive } = category;

  const typeStyles = {
    expense: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    income: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    both: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  };

  return (
    <Card hover className="relative overflow-hidden group border-slate-800/80">
      {/* Top Bar Indicator Color */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color || '#10b981' }}
      ></div>

      <div className="flex items-start justify-between space-x-3 pt-1">
        {/* Category Icon & Details */}
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-slate-700/60 shadow-inner"
            style={{ backgroundColor: `${color}15` || 'rgba(16, 185, 129, 0.1)' }}
          >
            {icon || '📦'}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-slate-100 text-sm tracking-tight">{name}</h4>
              {isDefault && (
                <span
                  title="System Default Category"
                  className="text-slate-500 hover:text-slate-400"
                >
                  <Shield className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-1">
              {/* Type Badge */}
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                  typeStyles[type] || typeStyles.expense
                }`}
              >
                {type}
              </span>

              {/* Status Badge */}
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  isActive
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Edit */}
          <button
            onClick={() => onEdit(category)}
            title="Edit Category"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Toggle Active / Deactivate */}
          <button
            onClick={() => onToggleActive(category)}
            title={isActive ? 'Deactivate Category' : 'Reactivate Category'}
            className={`p-1.5 rounded-md transition-colors ${
              isActive
                ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-950/30'
                : 'text-amber-400 hover:text-emerald-400 hover:bg-emerald-950/30'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(category)}
            title="Delete Category"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
