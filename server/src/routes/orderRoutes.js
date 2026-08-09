import express from 'express';
import { orderController } from '../controllers/index.js';
import { authenticate, authorize } from '../middleware/index.js';
import { paginationValidator, orderValidator, idValidator, orderFiltersValidator, assignCourierValidator } from '../utils/index.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Get all orders with pagination, search, and filters
// Admin and Operator can see all orders, Courier can only see assigned orders
router.get('/', authenticate, paginationValidator, orderFiltersValidator, validate, orderController.getAllOrders);

// Get order by tracking number (public - for customer tracking)
// Must come before /:id to avoid conflicts
router.get('/tracking/:trackingNumber', orderController.getOrderByTrackingNumber);

// Get order by ID
router.get('/:id', authenticate, idValidator, validate, orderController.getOrderById);

// Create new order (Admin, Operator only)
router.post('/', authenticate, authorize('Admin', 'Operator'), orderValidator, validate, orderController.createOrder);

// Update order (Admin, Operator only)
router.put('/:id', authenticate, authorize('Admin', 'Operator'), idValidator, orderValidator, validate, orderController.updateOrder);

// Delete order (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), idValidator, validate, orderController.deleteOrder);

// Assign courier to order (Admin, Operator only)
router.patch('/:id/assign-courier', authenticate, authorize('Admin', 'Operator'), assignCourierValidator, validate, orderController.assignCourier);

export default router;
