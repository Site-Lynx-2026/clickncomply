"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();

  if (!email || !email.includes("@")) {
    redirect("/signup?error=Please%20enter%20a%20valid%20email%20address");
  }
  if (!fullName) {
    redirect("/signup?error=Please%20enter%20your%20name");
  }
  if (password.length < 8) {
    redirect("/signup?error=Password%20must%20be%20at%20least%208%20characters");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmation is OFF (recommended for fast iteration),
  // session is set immediately and we go straight to onboarding.
  // If email confirmation is ON, data.session will be null — we'd
  // want to show a "check your email" state.
  if (data.session) {
    redirect("/onboarding");
  }

  // Email confirmation enabled but no SMTP yet — show check-email page.
  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}
