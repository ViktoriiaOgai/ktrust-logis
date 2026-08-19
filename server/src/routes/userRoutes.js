import express from 'express';
import { userController } from '../controllers/index.js';
import { authenticate, authorize } from '../middleware/index.js';
import { paginationValidator, updateRoleValidator, idValidator, userFiltersValidator, registerValidator } from '../utils/index.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All user routes require authentication and Admin role
router.use(authenticate, authorize('Admin'));

// Create new user (Admin only)
router.post('/', registerValidator, validate, userController.createUser);

// Get all users with pagination, search, and filters
router.get('/', paginationValidator, userFiltersValidator, validate, userController.getAllUsers);

// Get user by ID
router.get('/:id', idValidator, validate, userController.getUserById);

// Update user role
router.patch('/:id/role', updateRoleValidator, validate, userController.updateUserRole);

// Update user phone
router.patch('/:id/phone', idValidator, validate, userController.updateUserPhone);

// Deactivate user
router.patch('/:id/deactivate', idValidator, validate, userController.deactivateUser);

// Activate user
router.patch('/:id/activate', idValidator, validate, userController.activateUser);

export default router;
