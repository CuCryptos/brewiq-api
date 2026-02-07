import Stripe from 'stripe';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';
import type { MembershipTier } from '@prisma/client';

const stripe = config.STRIPE_SECRET_KEY
  ? new Stripe(config.STRIPE_SECRET_KEY)
  : null;

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tier: 'FREE' as const,
    features: [
      '10 scans per month',
      'Save up to 50 beers',
      'Basic beer information',
      'Community reviews',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    priceId: config.STRIPE_PRICE_PRO_MONTHLY,
    tier: 'PRO' as const,
    features: [
      'Unlimited scans',
      'Unlimited saved beers',
      'Clone recipes',
      'AI recommendations',
      'Priority notifications',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 9.99,
    priceId: config.STRIPE_PRICE_UNLIMITED_MONTHLY,
    tier: 'UNLIMITED' as const,
    features: [
      'Everything in Pro',
      'API access',
      'Priority support',
      'Early access to features',
      'Custom lists',
    ],
  },
];

export function getPlans() {
  return SUBSCRIPTION_PLANS;
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl?: string,
  cancelUrl?: string,
): Promise<string> {
  if (!stripe) {
    throw ApiError.internal('Stripe not configured');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Get or create Stripe customer
  let customerId = user.subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    // Create subscription record
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId: customerId,
        tier: 'FREE',
        status: 'ACTIVE',
      },
      update: {
        stripeCustomerId: customerId,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${config.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${config.FRONTEND_URL}/subscription/cancel`,
    metadata: { userId },
  });

  return session.url!;
}

export async function createPortalSession(userId: string): Promise<string> {
  if (!stripe) {
    throw ApiError.internal('Stripe not configured');
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription?.stripeCustomerId) {
    throw ApiError.badRequest('No subscription found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${config.FRONTEND_URL}/settings/subscription`,
  });

  return session.url;
}

export async function handleWebhook(
  payload: Buffer,
  signature: string,
): Promise<void> {
  if (!stripe || !config.STRIPE_WEBHOOK_SECRET) {
    throw ApiError.internal('Stripe not configured');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    throw ApiError.badRequest('Invalid webhook signature');
  }

  logger.info(`Stripe webhook received: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(subscription);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }

    default:
      logger.debug(`Unhandled event type: ${event.type}`);
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscriptionId = session.subscription as string;

  // Get subscription details
  const stripeSubscription = await stripe!.subscriptions.retrieve(subscriptionId);
  const priceId = stripeSubscription.items.data[0]?.price.id;

  // Determine tier
  const tier = getTierFromPriceId(priceId);

  // Update subscription and user
  await prisma.$transaction([
    prisma.subscription.update({
      where: { userId },
      data: {
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        tier,
        status: 'ACTIVE',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { membershipTier: tier },
    }),
  ]);

  logger.info(`Subscription activated for user ${userId}: ${tier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) return;

  await prisma.$transaction([
    prisma.subscription.update({
      where: { stripeCustomerId: customerId },
      data: {
        stripePriceId: priceId,
        tier,
        status: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    }),
    prisma.user.update({
      where: { id: dbSubscription.userId },
      data: { membershipTier: tier },
    }),
  ]);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) return;

  await prisma.$transaction([
    prisma.subscription.update({
      where: { stripeCustomerId: customerId },
      data: {
        status: 'CANCELED',
        tier: 'FREE',
        stripeSubscriptionId: null,
        stripePriceId: null,
      },
    }),
    prisma.user.update({
      where: { id: dbSubscription.userId },
      data: { membershipTier: 'FREE' },
    }),
  ]);

  logger.info(`Subscription canceled for user ${dbSubscription.userId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;

  await prisma.subscription.updateMany({
    where: { stripeCustomerId: customerId },
    data: { status: 'PAST_DUE' },
  });
}

function getTierFromPriceId(priceId: string): MembershipTier {
  if (priceId === config.STRIPE_PRICE_UNLIMITED_MONTHLY) {
    return 'UNLIMITED';
  }
  if (priceId === config.STRIPE_PRICE_PRO_MONTHLY) {
    return 'PRO';
  }
  return 'FREE';
}

export async function getCurrentSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const plan = SUBSCRIPTION_PLANS.find(p => p.tier === (subscription?.tier || 'FREE'));

  return {
    subscription,
    plan,
  };
}
