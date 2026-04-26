"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !email.includes("@")) {
    redirect("/login?error=Please%20enter%20a%20valid%20email%20address");
  }
  if (!password) {
    redirect("/login?error=Please%20enter%20your%20password");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Generic friendly error — don't leak whether the email exists
    if (error.message.toLowerCase().includes("invalid")) {
      redirect("/login?error=Email%20or%20password%20is%20wrong");
    }
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
