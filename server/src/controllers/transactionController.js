import TransactionService from '../services/transactionService.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Create a new transaction
 * @route   POST /api/v1/transactions
 * @access  Private (JWT)
 */
export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await TransactionService.createTransaction(req.user.userId, req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, transaction, 'Transaction created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated and filtered transactions for authenticated user
 * @route   GET /api/v1/transactions
 * @access  Private (JWT)
 */
export const getTransactions = async (req, res, next) => {
  try {
    const result = await TransactionService.getTransactions(req.user.userId, req.query);

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Transactions retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single transaction by ID
 * @route   GET /api/v1/transactions/:id
 * @access  Private (JWT)
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await TransactionService.getTransactionById(
      req.user.userId,
      req.params.id
    );

    return res
      .status(200)
      .json(new ApiResponse(200, transaction, 'Transaction retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing transaction
 * @route   PUT /api/v1/transactions/:id
 * @access  Private (JWT)
 */
export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await TransactionService.updateTransaction(
      req.user.userId,
      req.params.id,
      req.body
    );

    return res
      .status(200)
      .json(new ApiResponse(200, transaction, 'Transaction updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/v1/transactions/:id
 * @access  Private (JWT)
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const result = await TransactionService.deleteTransaction(req.user.userId, req.params.id);

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Transaction deleted successfully'));
  } catch (error) {
    next(error);
  }
};
