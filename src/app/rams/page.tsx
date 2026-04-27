import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Public /rams URL — used as the marketing landing target from the home page
 * tool grid. For now we don't have a separate marketing page so:
 *  - logged-in user → straight to the working tool at /tools/rams
 *  - logged-out user → /signup so they can convert
 *
 * When a real marketing landing for RAMs ships, this file gets replaced with
 * the page itself (no redirect logic).
 */
export default async function RamsLandingRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  redirect(user ? "/tools/rams" : "/signup");
}
