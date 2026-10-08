import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

/**
 * Authentication Middleware.
 * Verifies JWT token from Authorization header (Bearer <token>).
 * Attaches decoded user payload (userId, email) to req.user.
 */
export const authenticateUser = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access denied. No authentication token provided.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('Access denied. Token missing.');
    }

    const jwtSecret = process.env.JWT_SECRET || 'fintrack360_super_secret_jwt_key_dev_mode';

    const decoded = jwt.verify(token, jwtSecret);

    // Attach user payload to request
    req.user = {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role || 'user',
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Invalid or expired authentication token.'));
    }
  }
};

export default authenticateUser;
