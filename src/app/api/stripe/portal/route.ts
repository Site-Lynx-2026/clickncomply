import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";

/**
 * POST /api/stripe/portal
 *
 * Creates a Stripe Billing Portal session for the current customer
 * and returns the URL. Used by "Manage subscription" / "Cancel" buttons.
 *
 * The portal handles cancellation, payment method update, invoices,
 * receipts, and plan changes — all flows are required for ARL/DMCC
 * one-click cancel compliance.
 */

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
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
    .select("stripe_customer_id")
    .eq("organisation_id", membership.organisation_id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No paid subscription. Upgrade first." },
      { status: 400 }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${siteUrl}/account/billing`,
  });

  return NextResponse.json({ url: session.url });
}
