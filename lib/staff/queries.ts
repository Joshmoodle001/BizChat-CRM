import { createClient } from "@/lib/supabase/server";
import type { StaffSearchParams } from "@/types/staff";

export async function getStaffProfiles(businessId: string, params: StaffSearchParams) {
  const supabase = await createClient();
  let query = supabase.from("profiles").select("*").eq("business_id", businessId);

  // Include both staff and business_owner for staff listing
  query = query.in("role", ["staff", "business_owner"]);

  if (params.search) {
    const term = `%${params.search}%`;
    query = query.or(`full_name.ilike.${term},email.ilike.${term},phone.ilike.${term}`);
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getStaffProfileById(id: string, businessId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("business_id", businessId)
    .single();
  if (error) return null;
  return data;
}

export async function createStaffPlaceholder(
  input: Record<string, unknown>,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const record = {
    business_id: businessId,
    full_name: input.full_name,
    email: input.email,
    phone: (input.phone as string) || null,
    role: "staff",
    status: input.status ?? "active",
    auth_user_id: null,
  };

  const { data, error } = await supabase.from("profiles").insert(record).select("id").single();
  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "staff_created",
    entity_type: "profile",
    entity_id: data.id,
    metadata: { email: input.email },
  });

  return data;
}

export async function deactivateStaff(
  id: string,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  // Verify target is staff, not business owner
  const profile = await getStaffProfileById(id, businessId);
  if (!profile) throw new Error("Staff member not found.");
  if (profile.role !== "staff") throw new Error("Cannot deactivate a business owner as staff.");
  if (profile.id === actorProfileId) throw new Error("You cannot deactivate your own profile.");

  const { error } = await supabase
    .from("profiles")
    .update({ status: "inactive" })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "staff_deactivated",
    entity_type: "profile",
    entity_id: id,
  });
}
