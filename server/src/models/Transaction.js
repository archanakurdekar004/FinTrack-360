import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to a user'],
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Transaction must be assigned to a category'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['expense', 'income'],
        message: 'Type must be expense or income',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: [
          'cash',
          'debit_card',
          'credit_card',
          'upi',
          'bank_transfer',
          'net_banking',
          'wallet',
          'other',
        ],
        message: 'Invalid payment method',
      },
      default: 'cash',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    recurringTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecurringTransaction',
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

// Strategic Composite Indexes for performance optimization
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ recurringTransactionId: 1, date: 1 }, { unique: true, sparse: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
