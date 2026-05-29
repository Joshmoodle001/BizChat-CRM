"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { validateBusinessSettings } from "@/lib/validation/business-settings";
import { updateBusinessSettings } from "@/lib/settings/queries";

export async function updateBusinessSettingsAction(formData: FormData) {
  const result = await getCurrentProfile();
  if (!result || result.profile.role !== "business_owner") {
    throw new Error("Unauthorised");
  }

  const input = {
    name: (formData.get("name") as string) || "",
    industry: (formData.get("industry") as string) || "",
    phone: (formData.get("phone") as string) || "",
    email: (formData.get("email") as string) || "",
    address: (formData.get("address") as string) || "",
    timezone: (formData.get("timezone") as string) || "Africa/Johannesburg",
    currency: (formData.get("currency") as string) || "ZAR",
    logo_url: (formData.get("logo_url") as string) || "",
  };

  const validation = validateBusinessSettings(input);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  try {
    await updateBusinessSettings(
      input as unknown as Record<string, unknown>,
      result.profile.business_id,
      result.profile.id,
    );
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: "Business settings updated successfully." };
  } catch {
    return { error: "Failed to update business settings. Please try again." };
  }
}
