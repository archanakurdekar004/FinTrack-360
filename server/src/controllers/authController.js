import AuthService from '../services/authService.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { user, token } = await AuthService.registerUser(req.body);

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: user.toJSON(),
          token,
        },
        'User account registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user login & return JWT
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { user, token } = await AuthService.loginUser(req.body);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: user.toJSON(),
          token,
        },
        'Logged in successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/v1/auth/me
 * @access  Private (JWT Protected)
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await AuthService.getMe(req.user.userId);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: user.toJSON(),
        },
        'Authenticated user profile retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await AuthService.updateProfile(req.user.userId, req.body);
    return res.status(200).json(
      new ApiResponse(200, { user: user.toJSON() }, 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    await AuthService.updatePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
    return res.status(200).json(
      new ApiResponse(200, null, 'Password updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

