import ApiError from '../utils/ApiError.js';

/**
 * Higher-order middleware function to validate request body, params, or query against a Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 * @param {'body' | 'params' | 'query'} [source='body'] - Request object property to validate
 */
export const validate = (schema, source = 'body') => {
  return async (req, _res, next) => {
    try {
      const validatedData = await schema.parseAsync(req[source]);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const formattedErrors = error.errors.map(
          (err) => `${err.path.join('.') || source}: ${err.message}`
        );
        return next(ApiError.badRequest('Validation Error', formattedErrors));
      }
      return next(ApiError.badRequest(error.message || 'Invalid request payload'));
    }
  };
};

export default validate;
