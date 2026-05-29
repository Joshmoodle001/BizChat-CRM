"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { redirectByRole } from "@/lib/auth/redirect-by-role";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { error: "Invalid login credentials." };
  }

  if (!data.user) {
    return { error: "Login failed. Please try again." };
  }

  // Fetch profile to check status and determine redirect
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", data.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error:
        "Your account exists but no BizChat CRM profile is linked. Contact support or finish setup.",
    };
  }

  if (profile.status !== "active") {
    await supabase.auth.signOut();
    return { error: "Your account is not active." };
  }

  if (profile.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("status")
      .eq("id", profile.business_id)
      .single();

    if (business?.status === "suspended") {
      await supabase.auth.signOut();
      return { error: "This business account is suspended." };
    }
  }

  redirectByRole(profile.role);
}
