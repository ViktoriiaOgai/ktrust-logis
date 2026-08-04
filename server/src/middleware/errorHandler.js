export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  const error = {
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || null,
  };

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      ...error,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      ...error,
      message: 'Token expired',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(error);
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    return res.status(409).json({
      ...error,
      message: 'Duplicate entry',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      ...error,
      message: 'Foreign key constraint violation',
    });
  }

  // Default 500
  res.status(err.statusCode || 500).json(error);
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
