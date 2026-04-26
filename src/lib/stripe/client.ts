import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

export const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  PRO_ANNUAL: process.env.STRIPE_PRICE_PRO_ANNUAL!,
} as const;
