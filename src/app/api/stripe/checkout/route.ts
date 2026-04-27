import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe, PRICE_IDS } from "@/lib/stripe/client";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for the current org's Pro upgrade.
 * Body: { priceKey: "monthly" | "annual" }
 *
 * Flow:
 *   1. Auth gate (member of an org)
 *   2. Re-use existing stripe_customer_id if subscription has one;
 *      otherwise let Stripe create one tied to user's email
 *   3. Create Checkout Session with the requested price
 *   4. Return { url } so the client can redirect to Stripe-hosted checkout
 *   5. After successful payment, the webhook (/api/stripe/webhook)
 *      updates the subscriptions row
 */

export const runtime = "nodejs";

const Body = z.object({
  priceKey: z.enum(["monthly", "annual"]),
});

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) {
    return NextResponse.json({ error: "No organisation" }, { status: 400 });
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("stripe_customer_id, stripe_subscription_id")
    .eq("organisation_id", membership.organisation_id)
    .maybeSingle();

  // If they're already paid up, send them straight to the portal
  if (subscription?.stripe_subscription_id) {
    return NextResponse.json(
      { error: "Already subscribed — use /api/stripe/portal" },
      { status: 400 }
    );
  }

  const priceId =
    parsed.data.priceKey === "annual"
      ? PRICE_IDS.PRO_ANNUAL
      : PRICE_IDS.PRO_MONTHLY;

  if (!priceId || priceId.startsWith("price_PENDING")) {
    return NextResponse.json(
      { error: "Stripe price IDs not configured. Set STRIPE_PRICE_PRO_MONTHLY/ANNUAL in .env.local." },
      { status: 500 }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: subscription?.stripe_customer_id ?? undefined,
    customer_email: subscription?.stripe_customer_id ? undefined : user.email,
    client_reference_id: membership.organisation_id,
    metadata: {
      organisation_id: membership.organisation_id,
      user_id: user.id,
    },
    subscription_data: {
      metadata: {
        organisation_id: membership.organisation_id,
        user_id: user.id,
      },
    },
    allow_promotion_codes: true,
    success_url: `${siteUrl}/account/billing?upgraded=1`,
    cancel_url: `${siteUrl}/account/billing?cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
