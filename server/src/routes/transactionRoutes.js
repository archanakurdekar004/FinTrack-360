import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from '../validators/transactionSchemas.js';

const router = Router();

// Protect all transaction routes with JWT authentication middleware
router.use(authenticateUser);

// GET /api/v1/transactions
router.get('/', validate(transactionQuerySchema, 'query'), getTransactions);

// GET /api/v1/transactions/:id
router.get('/:id', getTransactionById);

// POST /api/v1/transactions
router.post('/', validate(createTransactionSchema, 'body'), createTransaction);

// PUT /api/v1/transactions/:id
router.put('/:id', validate(updateTransactionSchema, 'body'), updateTransaction);

// DELETE /api/v1/transactions/:id
router.delete('/:id', deleteTransaction);

export default router;
