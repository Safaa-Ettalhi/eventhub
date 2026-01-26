import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'staff'), getDashboardStats);

export default router;
