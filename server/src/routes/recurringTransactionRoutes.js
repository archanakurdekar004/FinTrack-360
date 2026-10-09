import express from 'express';
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  pauseSchedule,
  resumeSchedule,
  processDue
} from '../controllers/recurringTransactionController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createRecurringTransactionSchema, updateRecurringTransactionSchema } from '../validators/recurringTransactionSchemas.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/process-due', processDue);

router.route('/')
  .post(validate(createRecurringTransactionSchema), createSchedule)
  .get(getSchedules);

router.route('/:id')
  .get(getScheduleById)
  .put(validate(updateRecurringTransactionSchema), updateSchedule)
  .delete(deleteSchedule);

router.post('/:id/pause', pauseSchedule);
router.post('/:id/resume', resumeSchedule);

export default router;
