import express from 'express';
import { dashboardController } from '../controllers/index.js';
import { authenticate, authorize } from '../middleware/index.js';
import { dashboardStatsValidator, trendsValidator, topCouriersValidator } from '../utils/index.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All dashboard routes require authentication and Admin role
router.use(authenticate, authorize('Admin'));

// Get dashboard statistics with optional date range filtering
router.get('/stats', dashboardStatsValidator, validate, dashboardController.getDashboardStats);

// Get order trends for charts
router.get('/trends', trendsValidator, validate, dashboardController.getOrderTrends);

// Get top performing couriers
router.get('/top-couriers', topCouriersValidator, validate, dashboardController.getTopCouriers);

export default router;
