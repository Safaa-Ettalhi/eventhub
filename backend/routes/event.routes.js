import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  updateEventStatus,
} from '../controllers/event.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../utils/validation.js';
import { eventSchema, eventUpdateSchema, eventStatusSchema } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('admin', 'staff'), validate(eventSchema), createEvent);

router.get('/', getEvents);
router.get('/:id', getEventById);

router.put('/:id', authorize('admin', 'staff'), validate(eventUpdateSchema), updateEvent);
router.patch('/:id/status', authorize('admin', 'staff'), validate(eventStatusSchema), updateEventStatus);

export default router;
