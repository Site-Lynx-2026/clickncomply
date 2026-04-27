/**
 * One-off setup script — creates the Stripe products + prices for
 * ClickNComply Pro (monthly + annual) and prints the price IDs for
 * pasting into .env.local.
 *
 * Idempotent: re-running won't create duplicates. Looks up existing
 * "ClickNComply Pro" product by name and reuses it; same for prices
 * matched on (interval, amount).
 *
 * Run: node --env-file=.env.local scripts/setup-stripe-products.mjs
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});

const PRODUCT_NAME = "ClickNComply Pro";
const PRODUCT_DESCRIPTION =
  "Unlimited PDFs without watermark, projects, clients, send-to-client, save-as-template";

const MONTHLY_AMOUNT = 200; // £2.00
const ANNUAL_AMOUNT = 2000; // £20.00 (~17% off vs monthly)

async function findOrCreateProduct() {
  const list = await stripe.products.list({ limit: 100 });
  const existing = list.data.find((p) => p.name === PRODUCT_NAME && p.active);
  if (existing) {
    console.log(`✓ Product exists: ${existing.id}`);
    return existing;
  }
  const created = await stripe.products.create({
    name: PRODUCT_NAME,
    description: PRODUCT_DESCRIPTION,
    metadata: { tier: "pro" },
  });
  console.log(`✓ Product created: ${created.id}`);
  return created;
}

async function findOrCreatePrice(productId, interval, amount, nickname) {
  const list = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });
  const existing = list.data.find(
    (p) =>
      p.recurring?.interval === interval &&
      p.unit_amount === amount &&
      p.currency === "gbp"
  );
  if (existing) {
    console.log(`✓ Price (${interval}) exists: ${existing.id}`);
    return existing;
  }
  const created = await stripe.prices.create({
    product: productId,
    unit_amount: amount,
    currency: "gbp",
    recurring: { interval },
    nickname,
    metadata: { tier: "pro" },
  });
  console.log(`✓ Price (${interval}) created: ${created.id}`);
  return created;
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY missing — load .env.local first.");
    process.exit(1);
  }

  console.log("Setting up Stripe products...\n");

  const product = await findOrCreateProduct();
  const monthly = await findOrCreatePrice(
    product.id,
    "month",
    MONTHLY_AMOUNT,
    "Pro Monthly"
  );
  const annual = await findOrCreatePrice(
    product.id,
    "year",
    ANNUAL_AMOUNT,
    "Pro Annual"
  );

  console.log("\n=========================================");
  console.log("PASTE THESE INTO .env.local (overwrite the PENDING values):");
  console.log("=========================================\n");
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${monthly.id}`);
  console.log(`STRIPE_PRICE_PRO_ANNUAL=${annual.id}`);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
