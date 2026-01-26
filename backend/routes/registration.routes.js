import express from 'express';
import {
  createRegistration,
  getRegistrations,
  updateRegistrationStatus,
} from '../controllers/registration.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../utils/validation.js';
import { registrationSchema, registrationStatusSchema } from '../utils/validation.js';

const router = express.Router();


router.use(authenticate);

router.post('/', authorize('admin', 'staff'), validate(registrationSchema), createRegistration);
router.get('/', authorize('admin', 'staff'), getRegistrations);
router.patch('/:id/status', authorize('admin', 'staff'), validate(registrationStatusSchema), updateRegistrationStatus);

export default router;
