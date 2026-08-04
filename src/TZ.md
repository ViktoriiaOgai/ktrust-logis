
Technical Assignment
Domain: CRM
Product / Service: Logistics (cargo)
Project: CRM for tracking parcels and orders
Completed Course: React/Fullstack
Resolved Stack: React + Node.js + Express + PostgreSQL
Frontend: React
Backend: Node.js + Express
Database: PostgreSQL
Additional Features: Dashboard, Advanced statuses
Requested By: ogay.viktory@gmail.com
Created At: 2026-06-10 23:16

# Technical Assignment

## 1. Project Overview

Build a full-stack CRM web application for a logistics company that tracks cargo parcels and customer orders. The system should help company staff register new parcels, manage customers, update delivery statuses, and quickly find order information. Managers should be able to monitor operational performance through a dashboard and manage users or important records.

The main users are logistics operators, managers/admins, and optionally couriers or delivery staff. Operators work with customers, create parcel orders, and update operational data. Admins manage users, view all records, and control critical changes. The main value of the application is centralized parcel tracking, transparent order history, and faster daily logistics operations.

The project must be realistic for a junior to middle full-stack developer portfolio. It should demonstrate React frontend skills, Node.js + Express backend development, PostgreSQL database design, authentication, role-based access control, CRUD operations, filtering, pagination, and dashboard analytics.

Technology stack:
- Frontend: React
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT-based authentication
- API documentation: Swagger/OpenAPI or clear API route documentation

## 2. User Roles

Admin:
- Can view, create, update, and delete all customers, parcels, and orders.
- Can manage users and assign roles.
- Can access the dashboard.
- Can change any parcel/order status, including cancellation and delivery confirmation.
- Can view all system data.

Operator:
- Can create and update customers, orders, and parcels.
- Can view customers and parcel/order lists.
- Can update operational statuses such as “Registered”, “In Warehouse”, “In Transit”, and “Delayed”.
- Cannot delete users.
- Cannot manage roles.
- Cannot permanently delete important records unless explicitly allowed.

Courier:
- Can view assigned parcels or orders.
- Can update delivery-related statuses such as “Out for Delivery”, “Delivered”, or “Delivery Failed”.
- Cannot create users, delete records, or edit customer billing information.
- Cannot access admin user management.

Minimum required roles are Admin and Operator. Courier is recommended if the student wants a more realistic logistics workflow.

## 3. Core User Stories

- As a visitor, I want to register an account, so that I can access the CRM after approval or role assignment.
- As a user, I want to log in and log out securely, so that my work data is protected.
- As an admin, I want to manage user accounts and roles, so that employees have correct access permissions.
- As an operator, I want to create a customer profile, so that I can attach parcel orders to the correct client.
- As an operator, I want to create a parcel order, so that the company can track cargo from sender to receiver.
- As an operator, I want to update parcel details, so that incorrect information can be fixed.
- As an operator, I want to search parcels by tracking number, customer name, or destination, so that I can quickly find records.
- As a courier, I want to see assigned parcels, so that I know what needs to be delivered.
- As a courier, I want to update the delivery status, so that the office knows the current parcel state.
- As an admin, I want to view a dashboard with order statistics, so that I can understand daily logistics performance.
- As an admin or operator, I want to filter parcels by status and date, so that I can manage current workload.
- As an admin, I want to view the full status history of a parcel, so that I can investigate delivery issues.
- As a user, I want clear validation messages, so that I understand what must be corrected in forms.

## 4. Functional Requirements

Authentication and authorization:
- Users must be able to register, log in, and log out.
- Passwords must be hashed using bcrypt or a similar secure hashing library.
- The backend must use JWT-based authentication.
- Protected API endpoints must require a valid JWT token.
- Role-based access control must be implemented on both backend and frontend.
- Unauthorized users must not be able to access protected pages or endpoints.

Main business entity management:
- Main entities: customers, parcel orders, parcels/shipments, users, status history.
- Operators and admins can create customers and parcel orders.
- Each order should include sender, receiver, parcel details, price, origin, destination, and status.
- Each parcel/order should have a unique tracking number.
- Admins can delete or archive records.
- Operators can update records but should not delete critical records by default.
- Couriers can only view and update parcels assigned to them.

Search, filtering, sorting and pagination:
- All main list pages must support pagination.
- API list responses must include page, limit, total count, and items.
- Users must be able to search by tracking number, customer name, phone, email, city, or order reference.
- Filtering should include status, assigned courier, date range, origin city, destination city, and customer.
- Sorting should include newest first, oldest first, status, delivery date, and price ascending/descending.

Status management:
- Parcel/order status must follow a controlled lifecycle.
- The system must prevent invalid status transitions.
- Every status change must be saved in a status history table.
- Status history should include old status, new status, changed by user, timestamp, and optional comment.
- Advanced statuses must support logistics-specific exceptions such as delayed, returned, delivery failed, and cancelled.

Admin or management panel:
- Admins must have a management section for users.
- Admins can view all users, change role, deactivate user, and reset basic profile information.
- Admins can view all orders and customers.
- Admins can access the dashboard and operational statistics.
- Admins can delete or archive orders if needed.

Additional selected features:
- Dashboard
- Advanced statuses

These features are described in detail in section 10.

## 5. Frontend Requirements

Frontend stack: React.

Main pages:
- Login page
- Registration page
- Dashboard page
- Parcel/order list page
- Parcel/order details page
- Create/edit parcel order page
- Customer list page
- Customer details page
- Create/edit customer page
- User management page for Admin
- Profile/account page
- 404 and access denied pages

Components:
- Navigation/sidebar with role-based menu items
- Protected route component
- Role-based route wrapper
- Data table with pagination, sorting, and filters
- Search input with debounce
- Status badge component
- Status update modal
- Customer form
- Parcel/order form
- User role management form
- Dashboard statistic cards and charts
- Toast or alert component for success/error messages
- Loading spinner or skeleton state

Forms:
- Login form
- Registration form
- Customer create/edit form
- Parcel/order create/edit form
- Status update form with comment
- User role update form
- Filter form for list pages

Validation:
- Use React form validation with clear messages.
- Required fields must be validated before submission.
- Email, phone number, price, weight, and dates must have appropriate validation.
- Frontend validation must improve user experience but backend validation remains mandatory.

State management expectations:
- Use React state, Context API, or a lightweight state solution.
- Store authenticated user data and token securely enough for a student project.
- Keep filters, pagination, and sorting in component state or URL query parameters.
- Avoid overcomplicated state architecture.

API integration:
- Use fetch or Axios for API requests.
- Add an API client wrapper that attaches JWT token to protected requests.
- Handle 401 responses by logging the user out or redirecting to login.
- Display user-friendly error messages from backend responses.

Responsive behavior:
- The application must work on desktop and mobile.
- Tables should become horizontally scrollable or convert to card layout on small screens.
- Forms should be usable on mobile screens.
- Sidebar/navigation should collapse or become a mobile menu.

## 6. Backend Requirements

Backend stack: Node.js + Express.

Main controllers/routes:
- Auth routes: registration, login, logout/profile.
- User routes: list users, update role, deactivate user.
- Customer routes: CRUD customers.
- Parcel/order routes: CRUD parcel orders.
- Status routes: update status, get status history.
- Dashboard routes: get statistics and summary data.

Services:
- Auth service for registration, login, password hashing, token generation.
- User service for role management.
- Customer service for customer CRUD and ownership checks if needed.
- Order/parcel service for business logic.
- Status service for validating status transitions and writing history.
- Dashboard service for aggregated statistics.

DTOs/request models:
- Register request
- Login request
- Create/update customer request
- Create/update parcel order request
- Update status request
- Update user role request
- List query request with page, limit, search, filters, sorting

Validation:
- Use a validation library such as express-validator, Zod, or Joi.
- Validate request body, route params, and query params.
- Return consistent validation errors.

Authentication and authorization:
- JWT middleware must verify tokens.
- Role middleware must restrict endpoints by role.
- The backend must not rely only on frontend permissions.
- Passwords must never be returned in API responses.

Error handling:
- Implement global Express error middleware.
- Use consistent error responses:
  - success: false
  - message
  - errors if applicable
- Return suitable HTTP status codes: 400, 401, 403, 404, 409, 500.

File upload:
- File upload is optional and only relevant for cargo documents.
- If implemented, allow attaching a delivery proof image or invoice document to a parcel.
- Keep it simple: local storage for development or a basic upload folder.
- Store file metadata in PostgreSQL.
- Validate file size and type.

## 7. Database Design

Entity: users
- Fields: id, fullName, email, passwordHash, role, isActive, createdAt, updatedAt
- Relationships: one user can create many orders; one courier can be assigned many orders; one user can create many status history records
- Constraints: unique email, role must be one of allowed roles, passwordHash required

Entity: customers
- Fields: id, name, email, phone, companyName, address, city, country, notes, createdAt, updatedAt
- Relationships: one customer can have many parcel orders
- Constraints: email format if provided, phone required, name required

Entity: parcel_orders
- Fields: id, trackingNumber, customerId, senderName, senderPhone, receiverName, receiverPhone, originAddress, destinationAddress, originCity, destinationCity, weightKg, cargoType, declaredValue, deliveryPrice, currentStatus, assignedCourierId, estimatedDeliveryDate, createdByUserId, createdAt, updatedAt
- Relationships: belongs to customer; created by user; optionally assigned to courier; has many status history records
- Constraints: unique trackingNumber, currentStatus required, weightKg greater than 0, deliveryPrice not negative

Entity: status_history
- Fields: id, parcelOrderId, oldStatus, newStatus, comment, changedByUserId, createdAt
- Relationships: belongs to parcel order; belongs to user who changed status
- Constraints: parcelOrderId required, newStatus required, changedByUserId required

Entity: attachments optional
- Fields: id, parcelOrderId, fileName, fileUrl, fileType, uploadedByUserId, createdAt
- Relationships: belongs to parcel order; uploaded by user
- Constraints: file type and size must be validated

## 8. API Endpoints

Method: POST
URL: /api/auth/register
Role access: Public
Description: Register a new user
Request body: fullName, email, password
Response body: user without password, message

Method: POST
URL: /api/auth/login
Role access: Public
Description: Log in and receive JWT token
Request body: email, password
Response body: token, user

Method: GET
URL: /api/auth/me
Role access: Authenticated
Description: Get current user profile
Request body: none
Response body: user

Method: GET
URL: /api/users
Role access: Admin
Description: Get paginated user list
Request body: query page, limit, search, role
Response body: items, page, limit, total

Method: PATCH
URL: /api/users/:id/role
Role access: Admin
Description: Change user role
Request body: role
Response body: updated user

Method: PATCH
URL: /api/users/:id/deactivate
Role access: Admin
Description: Deactivate user account
Request body: none or isActive
Response body: updated user

Method: GET
URL: /api/customers
Role access: Admin, Operator
Description: Get paginated customer list
Request body: query page, limit, search, sort
Response body: items, page, limit, total

Method: POST
URL: /api/customers
Role access: Admin, Operator
Description: Create customer
Request body: name, phone, email, address, city, companyName
Response body: created customer

Method: GET
URL: /api/orders
Role access: Admin, Operator, Courier
Description: Get paginated parcel order list
Request body: query page, limit, search, status, dateFrom, dateTo, sort
Response body: items, page, limit, total

Method: POST
URL: /api/orders
Role access: Admin, Operator
Description: Create parcel order
Request body: customerId, sender/receiver data, addresses, weight, cargoType, price
Response body: created order

Method: GET
URL: /api/orders/:id
Role access: Admin, Operator, assigned Courier
Description: Get parcel order details
Request body: none
Response body: order with customer and status history

Method: PUT
URL: /api/orders/:id
Role access: Admin, Operator
Description: Update parcel order details
Request body: editable order fields
Response body: updated order

Method: DELETE
URL: /api/orders/:id
Role access: Admin
Description: Delete or archive parcel order
Request body: none
Response body: success message

Method: PATCH
URL: /api/orders/:id/status
Role access: Admin, Operator, assigned Courier
Description: Change parcel status
Request body: newStatus, comment
Response body: updated order and status history record

Method: GET
URL: /api/dashboard/summary
Role access: Admin, Operator
Description: Get dashboard statistics
Request body: query date range optional
Response body: totals, status counts, recent orders, delayed count

## 9. Status Flow

Available statuses:
- Draft
- Registered
- In Warehouse
- In Transit
- Arrived at Destination
- Out for Delivery
- Delivered
- Delivery Failed
- Delayed
- Returned
- Cancelled

Valid transitions:
- Draft → Registered
- Registered → In Warehouse
- In Warehouse → In Transit
- In Transit → Arrived at Destination
- Arrived at Destination → Out for Delivery
- Out for Delivery → Delivered
- Out for Delivery → Delivery Failed
- Delivery Failed → Out for Delivery
- Delivery Failed → Returned
- In Transit → Delayed
- Delayed → In Transit
- Registered → Cancelled
- In Warehouse → Cancelled
- Any non-final status → Cancelled by Admin only

Final statuses:
- Delivered
- Returned
- Cancelled

Who can change statuses:
- Admin: can change all statuses and handle exceptions.
- Operator: can move statuses from Registered to In Transit and mark Delayed.
- Courier: can update only assigned orders to Out for Delivery, Delivered, or Delivery Failed.

Invalid transitions:
- Delivered cannot move back to In Transit.
- Cancelled cannot move to any active status.
- Returned cannot move to Delivered.
- Courier cannot cancel an order.
- Operator cannot change final status without admin permission.

## 10. Additional Features

Feature: Dashboard

Description:
The dashboard gives users a quick overview of logistics activity, workload, and problems. It should help admins and operators understand how many parcels are active, delayed, delivered, or waiting for action.

User value:
- Admins can monitor company performance.
- Operators can identify delayed or pending orders.
- Staff can quickly access recent important records.

Frontend requirements:
- Dashboard page with statistic cards:
  - total orders
  - active orders
  - delivered orders
  - delayed orders
  - cancelled orders
- Show orders by status using a simple chart.
- Show recent orders list.
- Add date range filter: today, this week, this month, custom range.
- Show loading and empty states.

Backend requirements:
- Create dashboard summary endpoint.
- Aggregate data from parcel_orders.
- Support optional date range filtering.
- Return counts grouped by status and recent orders.

Database changes:
- No extra table required.
- Use existing parcel_orders fields: currentStatus, createdAt, updatedAt, estimatedDeliveryDate.

Acceptance criteria:
- Admin and Operator can open the dashboard.
- Dashboard shows correct counts based on database data.
- Date filter updates statistics.
- Recent orders are clickable and open order details.
- Unauthorized users cannot access dashboard data.

Feature: Advanced statuses

Description:
Advanced statuses provide a realistic logistics workflow with exceptions such as delays, delivery failure, returns, and cancellations. Each status change must be recorded.

User value:
- Staff can see accurate parcel progress.
- Managers can audit delivery problems.
- Customers can receive clearer status updates if the system is extended later.

Frontend requirements:
- Display current status as a colored badge.
- Provide a status update modal.
- Show only valid next statuses based on current status and user role.
- Require comment for exception statuses: Delayed, Delivery Failed, Returned, Cancelled.
- Show status history on order details page.

Backend requirements:
- Implement status transition validation in service layer.
- Check user role before allowing status change.
- Save every status change in status_history.
- Return clear error if transition is invalid.

Database changes:
- Add currentStatus field to parcel_orders.
- Add status_history table.
- Optional: add status comment field in history.

Acceptance criteria:
- Invalid transitions are rejected by backend.
- Status history is created after every successful change.
- Frontend does not show unavailable transitions.
- Exception statuses require a comment.
- Final statuses cannot be changed by normal users.

## 11. Validation Rules

Authentication:
- Email is required and must be valid.
- Password is required and should be at least 8 characters.
- Full name is required during registration.
- Login must return a clear message for invalid credentials.

Customer:
- Name is required.
- Phone is required.
- Email must be valid if provided.
- City and address should not exceed reasonable length.
- Duplicate customer email or phone should be handled if uniqueness is implemented.

Parcel/order:
- Customer is required.
- Sender and receiver names are required.
- Sender and receiver phone numbers are required.
- Origin and destination addresses are required.
- Weight must be greater than 0.
- Delivery price cannot be negative.
- Estimated delivery date cannot be in the far past.
- Tracking number must be unique.
- Cargo type is required.

Status:
- New status is required.
- New status must be allowed by current status and user role.
- Comment is required for delayed, failed, returned, and cancelled statuses.

Pagination and filtering:
- Page must be 1 or greater.
- Limit must have a reasonable maximum, for example 100.
- Sorting fields must be from an allowed list.

## 12. Error Handling

Backend behavior:
- Return 400 for validation errors.
- Return 401 for missing or invalid authentication token.
- Return 403 when the user does not have permission.
- Return 404 when a record does not exist.
- Return 409 for conflicts such as duplicate email or tracking number.
- Return 500 only for unexpected server errors.

Frontend behavior:
- Show field-level validation messages in forms.
- Show toast or alert messages for API errors.
- Redirect unauthenticated users to login.
- Show “Access denied” page for forbidden pages.
- Show loading states during requests.
- Show empty state messages for lists without data.

## 13. Testing Checklist

Authentication tests:
- User can register with valid data.
- User cannot register with duplicate email.
- User can log in with correct credentials.
- User cannot log in with wrong password.
- Protected endpoint rejects request without token.

Role access tests:
- Admin can access user management.
- Operator cannot access user management.
- Courier cannot edit unassigned order.
- Backend blocks forbidden API requests even if frontend route is bypassed.

CRUD tests:
- Operator can create customer.
- Operator can create parcel order.
- Order details display correct customer and status.
- Admin can delete or archive order.
- Updating order changes updatedAt.

Pagination/filtering/search tests:
- Order list returns page, limit, total, and items.
- Search by tracking number works.
- Filter by status works.
- Sort by newest first works.
- Limit maximum is enforced.

Validation tests:
- Required fields show frontend errors.
- Backend rejects invalid email.
- Backend rejects negative price.
- Backend rejects weight equal to zero.
- Duplicate tracking number is not allowed.

Additional feature tests:
- Dashboard shows correct total orders.
- Dashboard date filter changes results.
- Invalid status transition is rejected.
- Status history is created after status update.
- Delivered order cannot be changed by Operator.

Edge cases:
- Deleted/deactivated user cannot log in.
- User tries to access a non-existing order.
- Courier tries to update order not assigned to them.
- Empty list pages display friendly empty state.
- Expired or invalid JWT logs user out.

## 14. Definition of Done

The project is complete when:
- React frontend is implemented with all required main pages.
- Node.js + Express backend is implemented with structured routes, controllers, and services.
- PostgreSQL database contains all required tables and relationships.
- Authentication with password hashing and JWT works.
- Role-based access control works on frontend and backend.
- Customers and parcel orders support CRUD operations.
- Lists support pagination, search, filtering, and sorting.
- Parcel/order status flow is implemented with history.
- Admin panel allows user management.
- Dashboard displays real aggregated data.
- Validation exists on frontend and backend.
- Global backend error handling is implemented.
- API documentation is available through Swagger/OpenAPI or clear route documentation.
- Responsive UI works on desktop and mobile.
- Manual testing checklist is completed.
- Project has clear setup instructions in README.

## 15. Suggested Development Plan

Week 1: core backend, database, auth, basic frontend
- Design PostgreSQL schema and create migrations or SQL scripts.
- Set up Express project structure.
- Implement authentication: register, login, JWT middleware.
- Implement role middleware.
- Create users, customers, parcel_orders, and status_history tables.
- Implement customer CRUD endpoints.
- Implement parcel/order CRUD endpoints.
- Add backend validation and global error handler.
- Set up React project.
- Implement login, registration, protected routes, and basic layout.
- Create basic customer and order list pages.
- Connect frontend to backend API.

Week 2: advanced features, admin panel, testing, polish
- Implement status flow and status history.
- Add status update modal and status history UI.
- Implement dashboard backend aggregation endpoint.
- Build dashboard page with statistic cards and simple chart.
- Implement admin user management page.
- Add pagination, filtering, search, and sorting to list pages.
- Improve frontend validation and error display.
- Add responsive layout improvements.
- Write API documentation.
- Complete manual testing checklist.
- Fix bugs, polish UI, and prepare README with setup instructions.
