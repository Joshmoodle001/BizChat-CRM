"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { validateService } from "@/lib/validation/service";
import {
  createService,
  updateService,
  deactivateService,
} from "@/lib/services/queries";

async function requireOwner() {
  const result = await getCurrentProfile();
  if (!result || result.profile.role !== "business_owner") {
    throw new Error("Unauthorised");
  }
  return result;
}

export async function createServiceAction(formData: FormData) {
  const result = await requireOwner();

  const input = {
    name: (formData.get("name") as string) || "",
    description: (formData.get("description") as string) || "",
    category: (formData.get("category") as string) || "",
    duration_minutes: parseInt(formData.get("duration_minutes") as string) || 60,
    price: parseFloat(formData.get("price") as string) || 0,
    status: (formData.get("status") as string) || "active",
  };

  const validation = validateService(input);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  try {
    const data = await createService(
      input as unknown as Record<string, unknown>,
      result.profile.business_id,
      result.profile.id,
    );
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    redirect(`/dashboard/services/${data.id}`);
  } catch {
    return { error: "Failed to create service. Please try again." };
  }
}

export async function updateServiceAction(id: string, formData: FormData) {
  const result = await requireOwner();

  const input = {
    name: (formData.get("name") as string) || "",
    description: (formData.get("description") as string) || "",
    category: (formData.get("category") as string) || "",
    duration_minutes: parseInt(formData.get("duration_minutes") as string) || 60,
    price: parseFloat(formData.get("price") as string) || 0,
    status: (formData.get("status") as string) || "active",
  };

  const validation = validateService(input);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  try {
    await updateService(
      id,
      input as unknown as Record<string, unknown>,
      result.profile.business_id,
      result.profile.id,
    );
    revalidatePath("/dashboard/services");
    revalidatePath(`/dashboard/services/${id}`);
    revalidatePath("/dashboard");
    redirect(`/dashboard/services/${id}`);
  } catch {
    return { error: "Failed to update service. Please try again." };
  }
}

export async function deactivateServiceAction(id: string) {
  const result = await requireOwner();

  try {
    await deactivateService(id, result.profile.business_id, result.profile.id);
    revalidatePath("/dashboard/services");
    revalidatePath(`/dashboard/services/${id}`);
    revalidatePath("/dashboard");
  } catch {
    throw new Error("Failed to deactivate service.");
  }
}
