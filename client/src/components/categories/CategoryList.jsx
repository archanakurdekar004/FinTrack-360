import React from 'react';
import CategoryCard from './CategoryCard';
import { Layers } from 'lucide-react';

export const CategoryList = ({ categories, onEdit, onToggleActive, onDelete, activeTab }) => {
  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');
  const incomeCategories = categories.filter((c) => c.type === 'income' || c.type === 'both');

  if (!categories || categories.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">No Categories Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No categories match your filter criteria. Click &quot;Add Category&quot; to create a custom category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Expense Section */}
      {(activeTab === 'all' || activeTab === 'expense') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Expense Categories ({expenseCategories.length})
            </h3>
          </div>

          {expenseCategories.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
              No expense categories available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenseCategories.map((cat) => (
                <CategoryCard
                  key={cat._id}
                  category={cat}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Income Section */}
      {(activeTab === 'all' || activeTab === 'income') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Income Categories ({incomeCategories.length})
            </h3>
          </div>

          {incomeCategories.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
              No income categories available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomeCategories.map((cat) => (
                <CategoryCard
                  key={cat._id}
                  category={cat}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
