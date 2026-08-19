import { body, param, query } from 'express-validator';

// Auth validators
export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .trim()
    .isIn(['Admin', 'Operator', 'Courier', 'User'])
    .withMessage('Invalid role'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone must be between 10 and 20 characters'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Customer validators
export const customerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone must be between 10 and 20 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must not exceed 100 characters'),
];

export const customerFiltersValidator = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  query('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  query('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['created_at', 'updated_at', 'name', 'email', 'phone'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .trim()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
];

// Order validators
export const orderValidator = [
  body('customerId')
    .notEmpty()
    .withMessage('Customer is required')
    .isInt()
    .withMessage('Customer ID must be an integer'),
  body('senderName')
    .trim()
    .notEmpty()
    .withMessage('Sender name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Sender name must be between 2 and 100 characters'),
  body('senderPhone')
    .trim()
    .notEmpty()
    .withMessage('Sender phone is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Sender phone must be between 10 and 20 characters'),
  body('receiverName')
    .trim()
    .notEmpty()
    .withMessage('Receiver name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Receiver name must be between 2 and 100 characters'),
  body('receiverPhone')
    .trim()
    .notEmpty()
    .withMessage('Receiver phone is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Receiver phone must be between 10 and 20 characters'),
  body('originAddress')
    .trim()
    .notEmpty()
    .withMessage('Origin address is required')
    .isLength({ max: 255 })
    .withMessage('Origin address must not exceed 255 characters'),
  body('destinationAddress')
    .trim()
    .notEmpty()
    .withMessage('Destination address is required')
    .isLength({ max: 255 })
    .withMessage('Destination address must not exceed 255 characters'),
  body('originCity')
    .trim()
    .notEmpty()
    .withMessage('Origin city is required')
    .isLength({ max: 100 })
    .withMessage('Origin city must not exceed 100 characters'),
  body('destinationCity')
    .trim()
    .notEmpty()
    .withMessage('Destination city is required')
    .isLength({ max: 100 })
    .withMessage('Destination city must not exceed 100 characters'),
  body('weightKg')
    .notEmpty()
    .withMessage('Weight is required')
    .isFloat({ min: 0.01 })
    .withMessage('Weight must be greater than 0'),
  body('cargoType')
    .trim()
    .notEmpty()
    .withMessage('Cargo type is required')
    .isLength({ max: 50 })
    .withMessage('Cargo type must not exceed 50 characters'),
  body('deliveryPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Delivery price cannot be negative'),
  body('declaredValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Declared value cannot be negative'),
  body('estimatedDeliveryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
];

export const statusValidator = [
  param('id')
    .isInt()
    .withMessage('Order ID must be an integer'),
  body('newStatus')
    .trim()
    .notEmpty()
    .withMessage('New status is required')
    .isIn([
      'Draft',
      'Registered',
      'In Warehouse',
      'In Transit',
      'Arrived at Destination',
      'Out for Delivery',
      'Delivered',
      'Delivery Failed',
      'Delayed',
      'Returned',
      'Cancelled',
    ])
    .withMessage('Invalid status'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters'),
];

// User validators
export const updateRoleValidator = [
  param('id')
    .isInt()
    .withMessage('User ID must be an integer'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['Admin', 'Operator', 'Courier'])
    .withMessage('Invalid role'),
];

export const userFiltersValidator = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  query('role')
    .optional()
    .trim()
    .isIn(['Admin', 'Operator', 'Courier'])
    .withMessage('Invalid role'),
  query('isActive')
    .optional()
    .trim()
    .isIn(['true', 'false'])
    .withMessage('isActive must be true or false'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['created_at', 'updated_at', 'full_name', 'email', 'role'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .trim()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
];

export const orderFiltersValidator = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  query('status')
    .optional()
    .trim()
    .isIn([
      'Draft',
      'Registered',
      'In Warehouse',
      'In Transit',
      'Arrived at Destination',
      'Out for Delivery',
      'Delivered',
      'Delivery Failed',
      'Delayed',
      'Returned',
      'Cancelled',
    ])
    .withMessage('Invalid status'),
  query('customerId')
    .optional()
    .isInt()
    .withMessage('Customer ID must be an integer'),
  query('courierId')
    .optional()
    .isInt()
    .withMessage('Courier ID must be an integer'),
  query('originCity')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Origin city must not exceed 100 characters'),
  query('destinationCity')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Destination city must not exceed 100 characters'),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['created_at', 'updated_at', 'tracking_number', 'current_status', 'origin_city', 'destination_city'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .trim()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
];

export const assignCourierValidator = [
  param('id')
    .isInt()
    .withMessage('Order ID must be an integer'),
  body('courierId')
    .notEmpty()
    .withMessage('Courier ID is required')
    .isInt()
    .withMessage('Courier ID must be an integer'),
];

export const statusUpdateValidator = [
  param('id')
    .isInt()
    .withMessage('Order ID must be an integer'),
  body('newStatus')
    .trim()
    .notEmpty()
    .withMessage('New status is required')
    .isIn([
      'Draft',
      'Registered',
      'In Warehouse',
      'In Transit',
      'Arrived at Destination',
      'Out for Delivery',
      'Delivered',
      'Delivery Failed',
      'Delayed',
      'Returned',
      'Cancelled',
    ])
    .withMessage('Invalid status'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters'),
];

// Dashboard validators
export const dashboardStatsValidator = [
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateFrom'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateTo'),
];

export const trendsValidator = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),
];

export const topCouriersValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
];

// Pagination validators
export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const idValidator = [
  param('id')
    .isInt()
    .withMessage('ID must be an integer'),
];
