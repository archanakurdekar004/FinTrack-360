import ApiError from '../utils/ApiError.js';

/**
 * 404 Route Not Found Middleware.
 */
export const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Resource not found - ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized Global Error Handler Middleware.
 * Catches all operational and unhandled errors, preventing app crashes
 * and ensuring standard error payload format.
 */
export const errorHandler = (err, req, res, _next) => {
  let error = err;

  // Handle Mongoose CastError (Invalid ID format)
  if (err.name === 'CastError') {
    const message = `Invalid format for field: ${err.path}`;
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `${field} already exists. Please use another value.`;
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    error = ApiError.badRequest('Validation failed', errors);
  }

  // Handle JWT Verification Errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authentication token has expired');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const errors = error.errors || [];

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
