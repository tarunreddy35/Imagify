import { createCheckoutSession,handleStripeWebhook } from '../controllers/paymentController.js';
import express from 'express';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-checkout-session',authUser, createCheckoutSession);
router.post('/webhook', handleStripeWebhook);

export default router;
