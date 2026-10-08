import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Category must belong to a valid user'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    type: {
      type: String,
      required: [true, 'Category type is required'],
      enum: {
        values: ['expense', 'income', 'both'],
        message: 'Type must be expense, income, or both',
      },
    },
    icon: {
      type: String,
      default: '📦',
      trim: true,
    },
    color: {
      type: String,
      default: '#10b981',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index: Enforce unique category names per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Secondary Index for efficient filtering by user, type, and active status
categorySchema.index({ userId: 1, type: 1, isActive: 1 });

export const Category = mongoose.model('Category', categorySchema);
export default Category;
