"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
function isRedirectError(e: unknown): boolean {
  return (
    e instanceof Error &&
    "digest" in e &&
    typeof (e as { digest: string }).digest === "string" &&
    (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { validateStaff } from "@/lib/validation/staff";
import {
  createStaffPlaceholder,
  deactivateStaff,
} from "@/lib/staff/queries";

async function requireOwner() {
  const result = await getCurrentProfile();
  if (!result || result.profile.role !== "business_owner") {
    throw new Error("Unauthorised");
  }
  return result;
}

export async function createStaffAction(formData: FormData) {
  const result = await requireOwner();

  const input = {
    full_name: (formData.get("full_name") as string) || "",
    email: (formData.get("email") as string) || "",
    phone: (formData.get("phone") as string) || "",
    status: (formData.get("status") as string) || "active",
  };

  const validation = validateStaff(input);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  try {
    const data = await createStaffPlaceholder(
      input as unknown as Record<string, unknown>,
      result.profile.business_id,
      result.profile.id,
    );
    revalidatePath("/dashboard/staff");
    revalidatePath("/dashboard");
    redirect(`/dashboard/staff/${data.id}`);
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return { error: "Failed to add staff member. The email may already be in use." };
  }
}

export async function deactivateStaffAction(id: string) {
  const result = await requireOwner();

  try {
    await deactivateStaff(id, result.profile.business_id, result.profile.id);
    revalidatePath("/dashboard/staff");
    revalidatePath(`/dashboard/staff/${id}`);
    revalidatePath("/dashboard");
  } catch (e) {
    if (isRedirectError(e)) throw e;
    throw new Error("Failed to deactivate staff member.");
  }
}
