# KTrust Logis - Backend Server

Backend API for CRM logistics system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database credentials:
- DB_HOST: PostgreSQL host (default: localhost)
- DB_PORT: PostgreSQL port (default: 5432)
- DB_NAME: Database name (default: ktrust_logis)
- DB_USER: PostgreSQL username
- DB_PASSWORD: PostgreSQL password
- JWT_SECRET: Secret key for JWT tokens
- PORT: Server port (default: 3001)

3. Create PostgreSQL database:
```sql
CREATE DATABASE ktrust_logis;
```

4. Run database migrations:
```bash
npm run migrate
```
This will create all tables: users, customers, parcel_orders, status_history, attachments

5. Seed admin user:
```bash
npm run seed:admin
```
Default admin credentials:
- Email: admin@ktrust-logis.com
- Password: admin123

6. Start development server:
```bash
npm run dev
```

Server will be available at http://localhost:3001

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.js        # Entry point
├── .env.example        # Environment variables template
├── package.json        # Dependencies
└── README.md           # This file
```

## API Documentation

Swagger documentation will be available at `/api-docs` after implementation.
