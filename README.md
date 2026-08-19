# KTrust Logistics CRM System

A comprehensive logistics management system built with React, Node.js, Express, and PostgreSQL. This system provides full-featured parcel order management, customer management, user administration, and real-time dashboard analytics.

## 🚀 Features

### Core Functionality
- **User Management**: Role-based access control (Admin, Operator, Courier)
- **Customer Management**: Full CRUD operations for customer records
- **Order Management**: Complete parcel order lifecycle management
- **Status Tracking**: Advanced status system with history tracking
- **Dashboard**: Real-time analytics and statistics
- **Authentication**: JWT-based secure authentication

### Advanced Features
- **Role-Based Access Control (RBAC)**: Granular permissions for different user roles
- **Status Lifecycle Management**: Controlled status transitions with validation
- **Pagination & Filtering**: Efficient data handling with search, sort, and filter capabilities
- **Real-time Updates**: Loading states and empty states for better UX
- **Responsive Design**: Mobile-first approach for accessibility

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **CSS**: Custom styling with responsive design
- **Vite**: Fast build tool

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **express-validator**: Input validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ktrust-logis
```

### 2. Install Dependencies

#### Frontend
```bash
cd src
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database
```sql
CREATE DATABASE ktrust_logis;
```

#### Run Migrations
```bash
cd server
npm run migrate
```

#### Seed Database (Optional)
```bash
npm run seed
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ktrust_logis
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

### 5. Start the Application

#### Start Backend Server
```bash
cd server
npm run dev
```

The backend will run on `http://localhost:3000`

#### Start Frontend Server
```bash
cd src
npm run dev
```

The frontend will run on `http://localhost:5173`

## 👥 User Roles

### Admin
- Full access to all features
- User management (create, edit, deactivate, delete)
- Customer management (full CRUD)
- Order management (full CRUD including deletion)
- Access to dashboard
- Can cancel orders from any status
- Full status transition control

### Operator
- Customer management (full CRUD)
- Order management (create, edit, assign courier)
- Status updates: Registered → In Transit → Delayed
- Access to dashboard
- Cannot manage users
- Cannot delete orders
- Cannot change final statuses

### Courier
- View assigned orders only
- Status updates: Out for Delivery → Delivered / Delivery Failed
- Cannot manage users or customers
- Cannot create or edit orders
- Cannot cancel orders

## 📊 Status Lifecycle

### Valid Transitions
- Draft → Registered
- Registered → In Warehouse
- In Warehouse → In Transit
- In Transit → Arrived at Destination
- Arrived at Destination → Out for Delivery
- Out for Delivery → Delivered / Delivery Failed
- Delivery Failed → Out for Delivery / Returned
- In Transit ↔ Delayed
- Registered / In Warehouse → Cancelled (Admin only)
- Any non-final status → Cancelled (Admin only)

### Final Statuses
- Delivered
- Returned
- Cancelled

### Exception Statuses (Require Comment)
- Delayed
- Delivery Failed
- Returned
- Cancelled

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get paginated user list
- `PATCH /api/users/:id/role` - Change user role
- `PATCH /api/users/:id/deactivate` - Deactivate user

### Customers (Admin, Operator)
- `GET /api/customers` - Get paginated customer list
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders (Admin, Operator, Courier)
- `GET /api/orders` - Get paginated order list
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/tracking/:trackingNumber` - Track order (public)
- `POST /api/orders` - Create order (Admin, Operator)
- `PUT /api/orders/:id` - Update order (Admin, Operator)
- `DELETE /api/orders/:id` - Delete order (Admin)
- `PATCH /api/orders/:id/assign-courier` - Assign courier (Admin, Operator)

### Status (Admin, Operator, Courier)
- `PATCH /api/status/orders/:id/status` - Update order status
- `GET /api/status/orders/:id/history` - Get status history
- `GET /api/status/transitions` - Get allowed transitions

### Dashboard (Admin, Operator)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/trends` - Get order trends
- `GET /api/dashboard/top-couriers` - Get top couriers

## 📁 Project Structure

```
ktrust-logis/
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/        # Database and app configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Authentication and authorization
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities and helpers
│   ├── .env.example       # Environment variables template
│   └── package.json
├── src/                   # Frontend application
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── layouts/      # Layout components
│   │   └── ui/           # UI components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── auth/         # Auth pages
│   │   ├── client/       # Client pages
│   │   └── error/        # Error pages
│   ├── router/           # Route configuration
│   ├── services/         # API service layer
│   └── styles/           # Global styles
├── TESTING_CHECKLIST.md   # Comprehensive testing guide
└── README.md             # This file
```

## 🧪 Testing

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for a comprehensive testing guide covering:
- Authentication tests
- Role access tests
- CRUD operations
- Validation tests
- Status lifecycle tests
- Edge cases
- And more...

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with express-validator
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure password requirements (min 8 characters)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet devices
- Mobile devices

## 🐛 Error Handling

- Field-level validation in forms
- Toast notifications for API errors
- Access denied page for forbidden routes
- 404 page for non-existent routes
- Loading states for async operations
- Empty states for no data scenarios

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Run database migrations
3. Build and start the server
4. Configure reverse proxy (nginx/Apache)

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure routing for SPA (history mode)

## 📝 Development Notes

### Code Style
- TypeScript for type safety
- Consistent naming conventions
- Component-based architecture
- Separation of concerns (services, controllers, routes)

### Best Practices
- Error handling at all levels
- Input validation on both frontend and backend
- Secure authentication and authorization
- Efficient database queries with pagination
- Responsive design for accessibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly using the testing checklist
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2026-08-12
