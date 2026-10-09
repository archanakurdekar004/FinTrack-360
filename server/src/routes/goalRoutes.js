import express from 'express';
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  contributeGoal,
} from '../controllers/goalController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createGoalSchema, updateGoalSchema, contributeGoalSchema } from '../validators/goalSchemas.js';

const router = express.Router();

router.use(authenticateUser);

router.route('/')
  .post(validate(createGoalSchema), createGoal)
  .get(getGoals);

router.route('/:id')
  .get(getGoalById)
  .put(validate(updateGoalSchema), updateGoal)
  .delete(deleteGoal);

router.post('/:id/contributions', validate(contributeGoalSchema), contributeGoal);

export default router;
