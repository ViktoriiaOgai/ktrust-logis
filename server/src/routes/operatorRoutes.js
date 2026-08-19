import express from 'express';
import { operatorController } from '../controllers/index.js';

const router = express.Router();

// Get active operator contact info (public route)
router.get('/active', operatorController.getActiveOperator);

export default router;
