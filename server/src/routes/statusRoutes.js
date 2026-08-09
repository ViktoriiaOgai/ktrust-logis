import express from 'express';
import { statusController } from '../controllers/index.js';
import { authenticate, authorize } from '../middleware/index.js';
import { statusUpdateValidator, idValidator } from '../utils/index.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Update order status with role-based permissions
// Each role can only update to specific statuses (validated in controller)
router.patch(
  '/orders/:id/status',
  authenticate,
  authorize('Admin', 'Operator', 'Courier'),
  idValidator,
  statusUpdateValidator,
  validate,
  statusController.updateOrderStatus
);

// Get order status history (Admin, Operator can see all; Courier can see for assigned orders)
router.get(
  '/orders/:id/history',
  authenticate,
  authorize('Admin', 'Operator', 'Courier'),
  idValidator,
  validate,
  statusController.getOrderStatusHistory
);

// Get allowed transitions for a current status (authenticated users)
router.get(
  '/transitions',
  authenticate,
  statusController.getAllowedTransitions
);

export default router;
