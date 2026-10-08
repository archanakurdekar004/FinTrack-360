import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/categorySchemas.js';

const router = Router();

// Protect all category routes with JWT authentication middleware
router.use(authenticateUser);

// GET /api/v1/categories
router.get('/', getCategories);

// POST /api/v1/categories
router.post('/', validate(createCategorySchema), createCategory);

// PUT /api/v1/categories/:id
router.put('/:id', validate(updateCategorySchema), updateCategory);

// DELETE /api/v1/categories/:id
router.delete('/:id', deleteCategory);

export default router;
