import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.errors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    error.statusCode = 400;
    throw error;
  }

  next();
};
