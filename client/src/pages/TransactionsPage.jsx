import React, { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionFilters from '../components/transactions/TransactionFilters';
import DeleteTransactionModal from '../components/transactions/DeleteTransactionModal';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { formatCurrency } from '../utils/formatters';
import { Plus, Receipt, TrendingUp, TrendingDown, Wallet, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    search: '',
    page: 1,
    limit: 20,
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Categories for form & filter dropdowns
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res?.data || []);
      } catch (_err) {
        // Non-critical background category fetch error
      }
    };
    loadCategories();
  }, []);

  // Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await transactionService.getTransactions(filters);
      const data = response?.data || {};
      setTransactions(data.transactions || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
      setSummary(data.summary || { totalIncome: 0, totalExpense: 0, netBalance: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateNew = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction._id, formData);
        triggerSuccess('Transaction updated successfully.');
      } else {
        await transactionService.createTransaction(formData);
        triggerSuccess('Transaction recorded successfully.');
      }
      setIsFormOpen(false);
      fetchTransactions();
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    setError('');
    try {
      await transactionService.deleteTransaction(deletingTransaction._id);
      triggerSuccess('Transaction deleted successfully.');
      setDeletingTransaction(null);
      fetchTransactions();
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      setDeletingTransaction(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      categoryId: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      search: '',
      page: 1,
      limit: 20,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Receipt className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track and manage your financial cash inflows, daily expenses, and payment records
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Totals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover title="Total Income" action={<TrendingUp className="w-5 h-5 text-emerald-400" />}>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            +{formatCurrency(summary.totalIncome)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total cash inflows for filtered period</p>
        </Card>

        <Card hover title="Total Expenses" action={<TrendingDown className="w-5 h-5 text-rose-400" />}>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">
            -{formatCurrency(summary.totalExpense)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total cash outflows for filtered period</p>
        </Card>

        <Card hover title="Net Cash Flow" action={<Wallet className="w-5 h-5 text-teal-400" />}>
          <div
            className={`text-2xl font-bold tracking-tight ${
              summary.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {summary.netBalance >= 0 ? '+' : ''}{formatCurrency(summary.netBalance)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Net financial balance result</p>
        </Card>
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

      {/* Filter Toolbar */}
      <TransactionFilters
        filters={filters}
        categories={categories}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-panel h-20 rounded-xl p-4 animate-pulse flex items-center justify-between">
              <div className="flex items-center space-x-3 w-1/2">
                <div className="w-11 h-11 rounded-xl bg-slate-800 shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-6 bg-slate-800 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={(tx) => setDeletingTransaction(tx)}
        />
      )}

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 glass-panel rounded-xl border border-slate-800 text-xs text-slate-400">
          <div>
            Showing page <span className="font-semibold text-slate-200">{pagination.page}</span> of{' '}
            <span className="font-semibold text-slate-200">{pagination.totalPages}</span> ({pagination.total} total transactions)
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <TransactionForm
          initialData={editingTransaction}
          categories={categories}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <DeleteTransactionModal
          transaction={deletingTransaction}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTransaction(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
