"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";

export async function completeOnboarding(formData: FormData) {
  const result = await getCurrentProfile();
  if (!result) redirect("/login");

  const supabase = await createClient();

  const businessName = formData.get("business_name") as string;
  const industry = formData.get("industry") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;

  if (!businessName) {
    return { error: "Business name is required." };
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      name: businessName,
      industry: industry || result.business?.industry,
      phone: phone || result.business?.phone,
      email: email || result.business?.email,
      address: address || null,
    })
    .eq("id", result.profile.business_id);

  if (error) {
    return { error: "Failed to update business details." };
  }

  // Audit log
  await supabase.from("audit_logs").insert({
    business_id: result.profile.business_id,
    actor_profile_id: result.profile.id,
    action: "onboarding_completed",
    entity_type: "business",
    entity_id: result.profile.business_id,
  });

  redirect("/dashboard");
}
