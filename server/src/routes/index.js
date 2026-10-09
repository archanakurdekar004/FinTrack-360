import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import budgetRoutes from './budgetRoutes.js';

const router = Router();

// Mount API v1 route modules
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);




// Placeholders for upcoming module routers (to be implemented in subsequent tasks):
// router.use('/auth', authRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/budgets', budgetRoutes);
// router.use('/analytics', analyticsRoutes);
// router.use('/recurring-transactions', recurringRoutes);
// router.use('/savings-goals', savingsRoutes);
// router.use('/profile', profileRoutes);

export default router;
