"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { validateCustomer } from "@/lib/validation/customer";
import {
  createCustomer,
  updateCustomer,
  deactivateCustomer,
} from "@/lib/customers/queries";

async function requireOwner() {
  const result = await getCurrentProfile();
  if (!result || result.profile.role !== "business_owner") {
    throw new Error("Unauthorised");
  }
  return result;
}

export async function createCustomerAction(formData: FormData) {
  const result = await requireOwner();

  const input = {
    full_name: (formData.get("full_name") as string) || "",
    phone: (formData.get("phone") as string) || "",
    email: (formData.get("email") as string) || "",
    address: (formData.get("address") as string) || "",
    source: (formData.get("source") as string) || "",
    tags: (formData.get("tags") as string) || "",
    notes: (formData.get("notes") as string) || "",
    communication_opt_in: formData.get("communication_opt_in") === "true",
    do_not_contact: formData.get("do_not_contact") === "true",
    status: (formData.get("status") as string) || "active",
  };

  const validation = validateCustomer(input);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  try {
    const data = await createCustomer(
      input as unknown as Record<string, unknown>,
      result.profile.business_id,
      result.profile.id,
    );
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard");
    redirect(`/dashboard/customers/${data.id}`);
  } catch {
    return { error: "Failed to create customer. Please try again." };
  }
}

export async function updateCustomerAction(id: string, formData: FormData) {
  const result = await requireOwner();

  const input = {
    full_name: (formData.get("full_name") as string) || "",
    phone: (formData.get("phone") as string) || "",
    email: (formData.get("email") as string) || "",
    address: (formData.get("address") as string) || "",
    source: (formData.get("source") as string) || "",
    tags: (formData.get("tags") as string) || "",
    notes: (formData.get("notes") as string) || "",
    communication_opt_in: formData.get("communication_opt_in") === "true",
    do_not_contact: formData.get("do_not_contact") === "true",
    status: (formData.get("status") as string) || "active",
  };

  const validation = validateCustomer(input);
  if (!validation.valid) {
    return { errors: validation.errors };
  }

  try {
    await updateCustomer(
      id,
      input as unknown as Record<string, unknown>,
      result.profile.business_id,
      result.profile.id,
    );
    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${id}`);
    revalidatePath("/dashboard");
    redirect(`/dashboard/customers/${id}`);
  } catch {
    return { error: "Failed to update customer. Please try again." };
  }
}

export async function deactivateCustomerAction(id: string) {
  const result = await requireOwner();

  try {
    await deactivateCustomer(id, result.profile.business_id, result.profile.id);
    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${id}`);
    revalidatePath("/dashboard");
  } catch {
    throw new Error("Failed to deactivate customer.");
  }
}
