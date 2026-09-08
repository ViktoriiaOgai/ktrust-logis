import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import { authRoutes, userRoutes, customerRoutes, orderRoutes, statusRoutes, dashboardRoutes, operatorRoutes, contentRoutes } from './routes/index.js';
import initRoutes from './routes/initRoutes.js';
import debugRoutes from './routes/debugRoutes.js';

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Запросы без Origin (например, серверные запросы)
    if (!origin) {
      callback(null, true);
      return;
    }

    // В development разрешаем все origin
    if (config.nodeEnv === 'development') {
      callback(null, true);
      return;
    }

    // Получаем список разрешённых origin из ENV
    const allowedOrigins =
      process.env.ALLOWED_ORIGINS
        ?.split(',')
        .map((item) => item.trim())
        .filter(Boolean) || [];

    // Если список не задан — временно разрешаем все
    if (allowedOrigins.length === 0) {
      callback(null, true);
      return;
    }

    // Проверяем текущий origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked origin: ${origin}`);
      console.error(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },

  credentials: true,
};

app.use(cors(corsOptions));
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
app.use('/api/content', contentRoutes);
app.use('/api/init', initRoutes);
app.use('/api/debug', debugRoutes);

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
