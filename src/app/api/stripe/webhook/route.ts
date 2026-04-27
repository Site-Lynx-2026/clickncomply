import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe events and updates the local subscriptions row.
 * Signature is verified using STRIPE_WEBHOOK_SECRET.
 *
 * For local testing run:
 *   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
 * That command outputs the whsec_... value — paste into .env.local.
 *
 * Events handled:
 *   - checkout.session.completed       — initial subscription creation
 *   - customer.subscription.created
 *   - customer.subscription.updated
 *   - customer.subscription.deleted    — cancellation
 *   - invoice.payment_failed           — flips status to past_due
 *
 * For events we don't recognise, we 200 OK to stop Stripe retrying.
 */

export const runtime = "nodejs";

type SubscriptionStatus =
  Database["public"]["Tables"]["subscriptions"]["Row"]["status"];

// Stripe → our local enum
const STATUS_MAP: Record<string, SubscriptionStatus> = {
  trialing: "trialing",
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "unpaid",
  incomplete: "incomplete",
  incomplete_expired: "incomplete_expired",
  paused: "paused",
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret || webhookSecret.startsWith("whsec_PENDING")) {
    return NextResponse.json(
      { error: "Webhook signing secret not configured" },
      { status: 503 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(admin, session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(admin, sub);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(admin, invoice);
        break;
      }

      default:
        // Acknowledge unknown events so Stripe doesn't retry
        break;
    }
  } catch (err) {
    console.error("Webhook handler error", event.type, err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// --- Handlers ----------------------------------------------------------

async function handleCheckoutCompleted(
  admin: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session
) {
  const orgId =
    session.metadata?.organisation_id || session.client_reference_id;
  if (!orgId) {
    console.warn("checkout.session.completed missing org id", session.id);
    return;
  }

  // Stripe gives us subscription as id when checkout is mode=subscription
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  if (!subscriptionId || !customerId) {
    console.warn("checkout.session.completed missing sub/customer", session.id);
    return;
  }

  // Pull the full subscription so we can write all relevant fields
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const item = sub.items.data[0];

  const update: Database["public"]["Tables"]["subscriptions"]["Update"] = {
    tier: "pro",
    status: STATUS_MAP[sub.status] ?? "active",
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: item?.price?.id ?? null,
    // Stripe SDK 22+ moved current_period_* to subscription items
    current_period_start: toIso(item?.current_period_start),
    current_period_end: toIso(item?.current_period_end),
    trial_ends_at: toIso(sub.trial_end),
    cancel_at_period_end: sub.cancel_at_period_end,
    cancelled_at: toIso(sub.canceled_at),
  };

  await admin
    .from("subscriptions")
    .update(update)
    .eq("organisation_id", orgId);
}

async function handleSubscriptionChange(
  admin: ReturnType<typeof createAdminClient>,
  sub: Stripe.Subscription
) {
  const orgId = sub.metadata?.organisation_id;
  if (!orgId) {
    // Fall back to customer-id lookup if metadata missing
    const customerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const { data } = await admin
      .from("subscriptions")
      .select("organisation_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (!data) {
      console.warn("subscription change with no resolvable org", sub.id);
      return;
    }
    await applySubscriptionUpdate(admin, sub, data.organisation_id);
    return;
  }
  await applySubscriptionUpdate(admin, sub, orgId);
}

async function applySubscriptionUpdate(
  admin: ReturnType<typeof createAdminClient>,
  sub: Stripe.Subscription,
  orgId: string
) {
  const item = sub.items.data[0];
  const update: Database["public"]["Tables"]["subscriptions"]["Update"] = {
    tier: sub.status === "canceled" ? "free" : "pro",
    status: STATUS_MAP[sub.status] ?? "active",
    stripe_subscription_id: sub.id,
    stripe_price_id: item?.price?.id ?? null,
    // Stripe SDK 22+ moved current_period_* to subscription items
    current_period_start: toIso(item?.current_period_start),
    current_period_end: toIso(item?.current_period_end),
    trial_ends_at: toIso(sub.trial_end),
    cancel_at_period_end: sub.cancel_at_period_end,
    cancelled_at: toIso(sub.canceled_at),
  };

  await admin
    .from("subscriptions")
    .update(update)
    .eq("organisation_id", orgId);
}

async function handlePaymentFailed(
  admin: ReturnType<typeof createAdminClient>,
  invoice: Stripe.Invoice
) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  await admin
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("stripe_customer_id", customerId);
}

function toIso(epochSec: number | null | undefined): string | null {
  if (!epochSec) return null;
  return new Date(epochSec * 1000).toISOString();
}
