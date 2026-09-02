import express from 'express';
import { contentController } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

// Public routes
router.get('/services', contentController.getAllServices);
router.get('/services/:slug', contentController.getServiceBySlug);
router.get('/services/:slug/tariffs', contentController.getTariffs);
router.get('/countries', contentController.getAllCountries);
router.get('/services/:slug/comparison', contentController.getServiceComparison);
router.get('/company/:section', contentController.getCompanyInfo);

// Admin only routes
router.post('/services', authenticate, contentController.createService);
router.put('/services/:id', authenticate, contentController.updateService);
router.post('/tariffs', authenticate, contentController.createTariff);
router.post('/tariff-rows', authenticate, contentController.createTariffRow);
router.put('/company/:section', authenticate, contentController.updateCompanyInfo);

export default router;