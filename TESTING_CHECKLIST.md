# Testing Checklist

This document provides a comprehensive checklist for testing the KTrust Logistics CRM System.

## Authentication Tests

### Registration
- [ ] User can register with valid data (fullName, email, password >= 8 chars)
- [ ] User cannot register with duplicate email
- [ ] Registration fails with invalid email format
- [ ] Registration fails with password < 8 characters
- [ ] Registration fails without fullName
- [ ] After successful registration, user is automatically logged in and redirected to dashboard

### Login
- [ ] User can log in with correct credentials
- [ ] User cannot log in with wrong password
- [ ] User cannot log in with non-existent email
- [ ] Login fails with missing email or password
- [ ] After successful login, JWT token is stored in localStorage
- [ ] After successful login, user data is stored in localStorage
- [ ] Protected endpoints reject requests without token

### Logout
- [ ] User can logout successfully
- [ ] After logout, token is removed from localStorage
- [ ] After logout, user data is removed from localStorage
- [ ] After logout, user is redirected to login page
- [ ] After logout, protected routes are inaccessible

## Role Access Tests (RBAC)

### Admin Access
- [ ] Admin can access user management page (/users)
- [ ] Admin can create users
- [ ] Admin can update user roles
- [ ] Admin can deactivate/activate users
- [ ] Admin can delete orders
- [ ] Admin can cancel orders from any status
- [ ] Admin can access dashboard
- [ ] Admin can access all status transitions

### Operator Access
- [ ] Operator can access customer management page (/customers)
- [ ] Operator can create customers
- [ ] Operator can edit customers
- [ ] Operator can access orders page (/orders)
- [ ] Operator can create orders
- [ ] Operator can edit orders
- [ ] Operator can update statuses from Registered to In Transit
- [ ] Operator can mark orders as Delayed
- [ ] Operator can access dashboard
- [ ] Operator CANNOT access user management page (/users)
- [ ] Operator CANNOT delete orders
- [ ] Operator CANNOT change final statuses (Delivered, Returned, Cancelled)

### Courier Access
- [ ] Courier can access orders page (/orders)
- [ ] Courier can only see orders assigned to them
- [ ] Courier can update status to "Out for Delivery"
- [ ] Courier can update status to "Delivered"
- [ ] Courier can update status to "Delivery Failed"
- [ ] Courier CANNOT cancel orders
- [ ] Courier CANNOT access user management page (/users)
- [ ] Courier CANNOT access customer management page (/customers)
- [ ] Courier CANNOT access dashboard
- [ ] Courier CANNOT edit unassigned orders

### Backend RBAC Enforcement
- [ ] Backend blocks forbidden API requests even if frontend route is bypassed
- [ ] Non-admin users cannot access /api/users endpoints
- [ ] Non-admin/non-operator users cannot POST/PUT/DELETE /api/customers
- [ ] Courier cannot POST/PUT /api/orders
- [ ] Non-admin users cannot DELETE /api/orders

## CRUD Tests

### User Management
- [ ] Admin can view all users with pagination
- [ ] Admin can search users by name or email
- [ ] Admin can filter users by role
- [ ] Admin can filter users by active/inactive status
- [ ] Admin can change user role
- [ ] Admin can deactivate user account
- [ ] Admin can activate user account
- [ ] Deactivated user cannot log in
- [ ] User data displays correctly

### Customer Management
- [ ] Admin and Operator can view all customers with pagination
- [ ] Admin and Operator can search customers by name, phone, email
- [ ] Admin and Operator can filter customers by city
- [ ] Admin and Operator can create customer with valid data
- [ ] Admin and Operator can edit customer
- [ ] Admin and Operator can delete customer
- [ ] Customer creation fails without required fields (name, phone)
- [ ] Customer creation validates email format if provided

### Order Management
- [ ] Admin and Operator can view all orders with pagination
- [ ] Courier can only view assigned orders
- [ ] Users can search orders by tracking number
- [ ] Users can filter orders by status
- [ ] Users can filter orders by origin/destination city
- [ ] Users can filter orders by date range
- [ ] Admin and Operator can create order with valid data
- [ ] Admin and Operator can edit order
- [ ] Admin can delete order
- [ ] Order creation fails without required fields
- [ ] Order creation generates unique tracking number
- [ ] Order details display correct customer information
- [ ] Order details display correct status
- [ ] Admin and Operator can assign courier to order
- [ ] Updating order changes updatedAt timestamp

## Pagination, Filtering, and Sorting Tests

### General
- [ ] List endpoints return page, limit, total, and items
- [ ] Page parameter must be >= 1
- [ ] Limit parameter maximum is enforced (<= 100)
- [ ] Search by tracking number works correctly
- [ ] Search by customer name works correctly
- [ ] Filter by status works correctly
- [ ] Filter by city works correctly
- [ ] Filter by date range works correctly
- [ ] Sort by newest first works (created_at DESC)
- [ ] Sort by oldest first works (created_at ASC)
- [ ] Sorting fields are validated against allowed list

### Users Page
- [ ] Pagination works correctly
- [ ] Search filters work correctly
- [ ] Role filter works correctly
- [ ] Active/Inactive filter works correctly
- [ ] Empty state displays when no users found

### Customers Page
- [ ] Pagination works correctly
- [ ] Search filters work correctly
- [ ] City filter works correctly
- [ ] Country filter works correctly
- [ ] Empty state displays when no customers found

### Orders Page
- [ ] Pagination works correctly
- [ ] Search filters work correctly
- [ ] Status filter works correctly
- [ ] Origin city filter works correctly
- [ ] Destination city filter works correctly
- [ ] Date range filter works correctly
- [ ] Empty state displays when no orders found

## Validation Tests

### Authentication
- [ ] Required fields show frontend errors
- [ ] Backend rejects invalid email format
- [ ] Backend rejects password < 8 characters
- [ ] Login returns clear message for invalid credentials

### Customer
- [ ] Name field shows error when empty
- [ ] Phone field shows error when empty
- [ ] Email field shows error when invalid
- [ ] Backend validates email format if provided
- [ ] Duplicate customer email/phone is handled

### Order
- [ ] Customer selection shows error when empty
- [ ] Sender name shows error when empty
- [ ] Sender phone shows error when empty
- [ ] Receiver name shows error when empty
- [ ] Receiver phone shows error when empty
- [ ] Origin address shows error when empty
- [ ] Destination address shows error when empty
- [ ] Origin city shows error when empty
- [ ] Destination city shows error when empty
- [ ] Weight shows error when <= 0
- [ ] Cargo type shows error when empty
- [ ] Declared value shows error when < 0
- [ ] Delivery price shows error when < 0
- [ ] Backend rejects negative price
- [ ] Backend rejects weight equal to zero
- [ ] Duplicate tracking number is not allowed

### Status
- [ ] New status is required
- [ ] New status must be allowed by current status
- [ ] New status must be allowed by user role
- [ ] Comment is required for Delayed status
- [ ] Comment is required for Delivery Failed status
- [ ] Comment is required for Returned status
- [ ] Comment is required for Cancelled status
- [ ] Backend validates status transitions

## Dashboard Tests

### General
- [ ] Dashboard shows correct total orders
- [ ] Dashboard shows correct total customers
- [ ] Dashboard shows correct total users
- [ ] Dashboard shows correct total revenue
- [ ] Dashboard date filter changes results
- [ ] Dashboard shows correct counts by status
- [ ] Dashboard shows recent orders
- [ ] Dashboard shows order trends
- [ ] Dashboard shows top couriers
- [ ] Dashboard displays loading state
- [ ] Dashboard displays empty state when no data
- [ ] Unauthorized users cannot access dashboard

### Dashboard Components
- [ ] Stat cards display correct numbers
- [ ] Status bars show correct percentages
- [ ] Delivery statistics are accurate
- [ ] Success rate calculation is correct
- [ ] Trend chart displays data correctly
- [ ] Top couriers list is accurate
- [ ] Recent orders are clickable and navigate to details

## Status Lifecycle Tests

### Valid Transitions
- [ ] Draft → Registered works
- [ ] Registered → In Warehouse works
- [ ] In Warehouse → In Transit works
- [ ] In Transit → Arrived at Destination works
- [ ] Arrived at Destination → Out for Delivery works
- [ ] Out for Delivery → Delivered works
- [ ] Out for Delivery → Delivery Failed works
- [ ] Delivery Failed → Out for Delivery works
- [ ] Delivery Failed → Returned works
- [ ] In Transit → Delayed works
- [ ] Delayed → In Transit works
- [ ] Registered → Cancelled works (Admin only)
- [ ] In Warehouse → Cancelled works (Admin only)
- [ ] Any non-final status → Cancelled works (Admin only)

### Invalid Transitions
- [ ] Delivered cannot move back to In Transit
- [ ] Delivered cannot move to any active status
- [ ] Cancelled cannot move to any active status
- [ ] Returned cannot move to Delivered
- [ ] Courier cannot cancel an order
- [ ] Operator cannot change final status
- [ ] Invalid transition is rejected by backend
- [ ] Invalid transition shows clear error message

### Status History
- [ ] Status history is created after every successful change
- [ ] Status history records old status
- [ ] Status history records new status
- [ ] Status history records user who changed status
- [ ] Status history records timestamp
- [ ] Status history records comment if provided
- [ ] Status history is displayed on order details page
- [ ] Status history is read-only (cannot be modified)

## Frontend UX Tests

### Loading States
- [ ] Loading spinner displays during API requests
- [ ] Loading state displays on all list pages
- [ ] Loading state displays on dashboard
- [ ] Loading state displays on order details
- [ ] Loading state displays during form submission

### Empty States
- [ ] Empty state displays when no users found
- [ ] Empty state displays when no customers found
- [ ] Empty state displays when no orders found
- [ ] Empty state displays action button when appropriate
- [ ] Empty state displays helpful message

### Error Handling
- [ ] Field-level validation messages display in forms
- [ ] Toast messages display for API errors
- [ ] Toast messages display for success actions
- [ ] Unauthenticated users are redirected to login
- [ ] Access denied page displays for forbidden pages
- [ ] 404 page displays for non-existent routes
- [ ] Error messages are clear and actionable

### Responsive Design
- [ ] Tables scroll horizontally on mobile
- [ ] Tables wrap into cards on mobile
- [ ] Navigation works on mobile devices
- [ ] Forms are usable on mobile devices
- [ ] Dashboard is readable on mobile devices

## Edge Cases

### User Management
- [ ] Deleted/deactivated user cannot log in
- [ ] User tries to access non-existent user (404)
- [ ] User tries to update non-existent user (404)
- [ ] User tries to delete non-existent user (404)

### Customer Management
- [ ] User tries to access non-existent customer (404)
- [ ] User tries to update non-existent customer (404)
- [ ] User tries to delete non-existent customer (404)

### Order Management
- [ ] User tries to access non-existent order (404)
- [ ] User tries to update non-existent order (404)
- [ ] User tries to delete non-existent order (404)
- [ ] Courier tries to access unassigned order (403)
- [ ] User tries to assign non-existent courier (404)

### General
- [ ] Network errors are handled gracefully
- [ ] Server errors (500) display user-friendly message
- [ ] Request timeouts are handled
- [ ] Concurrent requests are handled correctly

## Performance Tests

- [ ] Dashboard loads within acceptable time (< 2s)
- [ ] List pages load within acceptable time (< 1s)
- [ ] Search results return within acceptable time (< 500ms)
- [ ] Form submissions complete within acceptable time (< 1s)
- [ ] Pagination is responsive
- [ ] Large datasets don't cause performance issues

## Security Tests

- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are blocked
- [ ] CSRF protection is implemented
- [ ] Sensitive data is not exposed in API responses
- [ ] Password hashes are never returned
- [ ] JWT tokens are validated on each request
- [ ] Rate limiting is implemented (if applicable)
- [ ] File uploads are validated (if applicable)

## Browser Compatibility

- [ ] Application works in Chrome
- [ ] Application works in Firefox
- [ ] Application works in Safari
- [ ] Application works in Edge
- [ ] Application works on mobile browsers

## Regression Tests

After any code changes, verify:
- [ ] Authentication still works
- [ ] Role-based access still works
- [ ] CRUD operations still work
- [ ] Status transitions still work
- [ ] Dashboard still displays correctly
- [ ] No new console errors
- [ ] No new lint errors
