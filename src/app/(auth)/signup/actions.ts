"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const fullName = String(formData.get("full_name") || "").trim();

  if (!email || !email.includes("@")) {
    redirect("/signup?error=Please%20enter%20a%20valid%20email%20address");
  }
  if (!fullName) {
    redirect("/signup?error=Please%20enter%20your%20name");
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}
