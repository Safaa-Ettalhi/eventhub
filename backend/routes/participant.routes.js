import express from 'express';
import {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
} from '../controllers/participant.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../utils/validation.js';
import { participantSchema, participantUpdateSchema } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('admin', 'staff'), validate(participantSchema), createParticipant);
router.get('/', authorize('admin', 'staff'), getParticipants);
router.get('/:id', authorize('admin', 'staff'), getParticipantById);
router.put('/:id', authorize('admin', 'staff'), validate(participantUpdateSchema), updateParticipant);

export default router;
