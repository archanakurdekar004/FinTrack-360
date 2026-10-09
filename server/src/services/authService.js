import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CategoryService from './categoryService.js';
import ApiError from '../utils/ApiError.js';

/**
 * Helper to generate JWT token for an authenticated user.
 */
export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'fintrack360_super_secret_jwt_key_dev_mode';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    secret,
    { expiresIn }
  );
};

export class AuthService {
  /**
   * Registers a new user and seeds initial default categories.
   */
  static async registerUser({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw ApiError.badRequest('An account with this email address already exists.');
    }

    // Create new user (password is hashed automatically by User model pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    try {
      // Seed default expense & income categories for the new user
      await CategoryService.seedDefaultCategories(user._id);
    } catch (catError) {
      // Clean up orphaned user record if category seeding fails
      await User.deleteOne({ _id: user._id });
      throw ApiError.internal(`Registration failed while initializing categories: ${catError.message}`);
    }

    const token = generateToken(user);
    return { user, token };
  }

  /**
   * Authenticates user login credentials.
   */
  static async loginUser({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Find user with password selected explicitly
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Generic error message for security (don't reveal whether email exists)
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    // Check password match
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const token = generateToken(user);
    return { user, token };
  }

  /**
   * Gets current user profile by userId.
   */
  static async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('Authenticated user profile not found.');
    }
    return user;
  }

  /**
   * Updates current user profile.
   */
  static async updateProfile(userId, data) {
    const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
    if (!user) {
      throw ApiError.notFound('Authenticated user profile not found.');
    }
    return user;
  }

  /**
   * Updates user password.
   */
  static async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('Authenticated user profile not found.');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Incorrect current password.');
    }

    user.password = newPassword;
    await user.save();
    
    return true;
  }
}

export default AuthService;
