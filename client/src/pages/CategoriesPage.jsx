import React, { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Plus, Tags, Search, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters state
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'expense' | 'income'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await categoryService.getCategories();
      setCategories(response?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Flash temporary success message
  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formData);
        triggerSuccess(`Category "${formData.name}" updated successfully.`);
      } else {
        await categoryService.createCategory(formData);
        triggerSuccess(`Category "${formData.name}" created successfully.`);
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (category) => {
    setError('');
    try {
      const updatedStatus = !category.isActive;
      await categoryService.updateCategory(category._id, { isActive: updatedStatus });
      triggerSuccess(
        `Category "${category.name}" ${updatedStatus ? 'reactivated' : 'deactivated'}.`
      );
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to update category status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    setError('');
    try {
      await categoryService.deleteCategory(deletingCategory._id);
      triggerSuccess(`Category "${deletingCategory.name}" deleted successfully.`);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      setDeletingCategory(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter((c) => {
    const matchesTab =
      activeTab === 'all' || c.type === activeTab || c.type === 'both';
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && c.isActive) ||
      (statusFilter === 'inactive' && !c.isActive);
    const matchesSearch =
      !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Tags className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Category Manager</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize and classify your income & expense streams for transactions and budgets
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-xl border border-slate-800">
        {/* Type Tabs */}
        <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 w-full md:w-auto">
          {['all', 'expense', 'income'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-panel h-28 rounded-xl p-4 animate-pulse space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CategoryList
          categories={filteredCategories}
          activeTab={activeTab}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
          onDelete={(cat) => setDeletingCategory(cat)}
        />
      )}

      {/* Category Form Modal */}
      {isFormOpen && (
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <Card className="max-w-md w-full p-6 space-y-4 border-slate-800">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Category</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete category &quot;
              <span className="font-semibold text-white">{deletingCategory.name}</span>&quot;?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setDeletingCategory(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDeleteConfirm}
                isLoading={isDeleting}
              >
                Delete Category
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
