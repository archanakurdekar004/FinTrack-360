import mongoose from 'mongoose';

const recurringTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be strictly positive'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'debit_card', 'credit_card', 'upi', 'bank_transfer', 'net_banking', 'wallet', 'other'],
      default: 'bank_transfer',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active',
      index: true,
    },
    lastGeneratedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

recurringTransactionSchema.index({ userId: 1, status: 1, nextDueDate: 1 });

export const RecurringTransaction = mongoose.model('RecurringTransaction', recurringTransactionSchema);
export default RecurringTransaction;
