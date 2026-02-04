import { Router, raw } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as subscriptionService from './subscriptions.service.js';
import { createCheckoutSchema, CreateCheckoutInput } from './subscriptions.schema.js';

const router = Router();

// Get available plans
router.get('/plans', asyncHandler(async (req, res) => {
  const plans = subscriptionService.getPlans();

  res.json({
    success: true,
    data: plans,
  });
}));

// Get current subscription
router.get('/current', authenticate, asyncHandler(async (req, res) => {
  const result = await subscriptionService.getCurrentSubscription(req.user!.id);

  res.json({
    success: true,
    data: result,
  });
}));

// Create checkout session
router.post('/checkout', authenticate, validate(createCheckoutSchema), asyncHandler(async (req, res) => {
  const input: CreateCheckoutInput = req.body;
  const url = await subscriptionService.createCheckoutSession(
    req.user!.id,
    input.priceId,
    input.successUrl,
    input.cancelUrl,
  );

  res.json({
    success: true,
    data: { url },
  });
}));

// Create customer portal session
router.post('/portal', authenticate, asyncHandler(async (req, res) => {
  const url = await subscriptionService.createPortalSession(req.user!.id);

  res.json({
    success: true,
    data: { url },
  });
}));

// Stripe webhook
router.post('/webhook', raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  await subscriptionService.handleWebhook(req.body, signature);

  res.json({ received: true });
}));

export default router;
