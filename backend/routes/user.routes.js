import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../utils/validation.js';
import { userSchema, userUpdateSchema } from '../utils/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUserById);
router.post('/', authorize('admin'), validate(userSchema), createUser);
router.put('/:id', authorize('admin'), validate(userUpdateSchema), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
