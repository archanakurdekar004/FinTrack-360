import express from 'express';
import {
  getOverview,
  getMonthlyTrends,
  getCategoryBreakdown,
  getBudgetPerformance,
} from '../controllers/analyticsController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { monthYearQuerySchema, monthlyQuerySchema } from '../validators/analyticsSchemas.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/overview', validate(monthYearQuerySchema, 'query'), getOverview);
router.get('/monthly', validate(monthlyQuerySchema, 'query'), getMonthlyTrends);
router.get('/categories', validate(monthYearQuerySchema, 'query'), getCategoryBreakdown);
router.get('/budget-performance', validate(monthYearQuerySchema, 'query'), getBudgetPerformance);

export default router;
