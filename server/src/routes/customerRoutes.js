import express from 'express';
import { customerController } from '../controllers/index.js';
import { authenticate, authorize } from '../middleware/index.js';
import { paginationValidator, customerValidator, idValidator, customerFiltersValidator } from '../utils/index.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All customer routes require authentication
router.use(authenticate);

// Get all customers with pagination, search, and filters (Admin, Operator)
router.get('/', authorize('Admin', 'Operator'), paginationValidator, customerFiltersValidator, validate, customerController.getAllCustomers);

// Get customer by ID (Admin, Operator)
router.get('/:id', authorize('Admin', 'Operator'), idValidator, validate, customerController.getCustomerById);

// Create new customer (Admin, Operator)
router.post('/', authorize('Admin', 'Operator'), customerValidator, validate, customerController.createCustomer);

// Update customer (Admin, Operator)
router.put('/:id', authorize('Admin', 'Operator'), idValidator, customerValidator, validate, customerController.updateCustomer);

// Delete customer (Admin only)
router.delete('/:id', authorize('Admin'), idValidator, validate, customerController.deleteCustomer);

export default router;
