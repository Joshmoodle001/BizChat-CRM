"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { seedDefaultTemplates } from "@/lib/auth/seed-templates";

interface RegisterFormData {
  businessName: string;
  industry: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export async function registerBusiness(formData: RegisterFormData) {
  const { businessName, industry, fullName, email, phone, password } = formData;

  if (!businessName || !fullName || !email || !password) {
    return { error: "All required fields must be filled." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Use service role client to create user + business + profile atomically
  const serviceClient = await createServiceClient();

  // 1. Create auth user
  const { data: authData, error: authError } =
    await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: "Failed to create account. Please try again." };
  }

  const userId = authData.user.id;

  // 2. Create business
  const { data: business, error: businessError } = await serviceClient
    .from("businesses")
    .insert({
      name: businessName,
      industry: industry || null,
      phone: phone || null,
      email,
      subscription_plan: "trial",
      subscription_status: "active",
      status: "active",
    })
    .select("id")
    .single();

  if (businessError) {
    // Rollback: delete the auth user
    await serviceClient.auth.admin.deleteUser(userId);
    return { error: "Failed to create business. Please try again." };
  }

  // 3. Create profile
  const { error: profileError } = await serviceClient.from("profiles").insert({
    auth_user_id: userId,
    business_id: business.id,
    full_name: fullName,
    email,
    phone: phone || null,
    role: "business_owner",
    status: "active",
  });

  if (profileError) {
    // Rollback: delete auth user and business
    await serviceClient.from("businesses").delete().eq("id", business.id);
    await serviceClient.auth.admin.deleteUser(userId);
    return { error: "Failed to create profile. Please try again." };
  }

  // 4. Audit log
  await serviceClient.from("audit_logs").insert({
    business_id: business.id,
    action: "business_created",
    entity_type: "business",
    entity_id: business.id,
    metadata: { industry, email },
  });

  // 5. Seed default message templates
  await seedDefaultTemplates(business.id);

  // 6. Redirect to onboarding
  redirect("/onboarding");
}
