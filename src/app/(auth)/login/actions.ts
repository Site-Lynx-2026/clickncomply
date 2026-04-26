"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/login?error=Please%20enter%20a%20valid%20email%20address");
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    // Don't leak whether the email exists — generic friendly message.
    if (error.message.toLowerCase().includes("not found")) {
      redirect(
        "/login?error=No%20account%20found%20for%20that%20email%20%E2%80%94%20try%20signing%20up"
      );
    }
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}
