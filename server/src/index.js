import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import { authRoutes, userRoutes, customerRoutes, orderRoutes, statusRoutes, dashboardRoutes, operatorRoutes } from './routes/index.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/operators', operatorRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`CORS origin: ${config.corsOrigin}`);
});

export default app;
