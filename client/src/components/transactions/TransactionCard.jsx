import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Edit2, Trash2, CreditCard, Banknote, Landmark, Wallet, Smartphone, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const paymentMethodIcons = {
  cash: Banknote,
  debit_card: CreditCard,
  credit_card: CreditCard,
  upi: Smartphone,
  bank_transfer: Landmark,
  net_banking: Landmark,
  wallet: Wallet,
  other: CreditCard,
};

const paymentMethodLabels = {
  cash: 'Cash',
  debit_card: 'Debit Card',
  credit_card: 'Credit Card',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  net_banking: 'Net Banking',
  wallet: 'Wallet',
  other: 'Other',
};

export const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const { _id, type, amount, date, description, paymentMethod, notes, categoryId } = transaction;

  const isIncome = type === 'income';
  const categoryName = categoryId?.name || 'Uncategorized';
  const categoryIcon = categoryId?.icon || '📦';
  const categoryColor = categoryId?.color || '#10b981';

  const PaymentIcon = paymentMethodIcons[paymentMethod] || CreditCard;

  return (
    <Card hover className="relative overflow-hidden group border-slate-800/80">
      <div className="flex items-center justify-between space-x-4">
        {/* Category Icon & Details */}
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border border-slate-700/60 shadow-inner"
            style={{ backgroundColor: `${categoryColor}15` || 'rgba(16, 185, 129, 0.1)' }}
          >
            {categoryIcon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-slate-100 text-sm truncate">{description || categoryName}</h4>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isIncome
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isIncome ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownLeft className="w-3 h-3 mr-0.5" />}
                {type}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span className="text-slate-300 font-medium">{categoryName}</span>
              <span>•</span>
              <span>{formatDate(date)}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <PaymentIcon className="w-3 h-3 text-slate-500" />
                {paymentMethodLabels[paymentMethod] || paymentMethod}
              </span>
            </div>

            {notes && (
              <p className="text-[11px] text-slate-500 truncate mt-1 italic">&quot;{notes}&quot;</p>
            )}
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className={`text-base font-bold tracking-tight ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(amount)}
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(transaction)}
              title="Edit Transaction"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-md transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(transaction)}
              title="Delete Transaction"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;
