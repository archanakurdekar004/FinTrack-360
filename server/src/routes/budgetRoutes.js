import express from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createBudgetSchema, updateBudgetSchema, getBudgetsSchema } from '../validators/budgetSchemas.js';

const router = express.Router();

router.use(authenticateUser);

router.route('/')
  .get(validate(getBudgetsSchema, 'query'), getBudgets)
  .post(validate(createBudgetSchema, 'body'), createBudget);

router.route('/:id')
  .get(getBudgetById)
  .put(validate(updateBudgetSchema), updateBudget)
  .delete(deleteBudget);

export default router;
