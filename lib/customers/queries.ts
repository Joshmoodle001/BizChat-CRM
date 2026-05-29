import { createClient } from "@/lib/supabase/server";
import type { CustomerSearchParams } from "@/types/customer";

export async function getCustomers(businessId: string, params: CustomerSearchParams) {
  const supabase = await createClient();
  let query = supabase.from("customers").select("*").eq("business_id", businessId);

  if (params.search) {
    const term = `%${params.search}%`;
    query = query.or(`full_name.ilike.${term},phone.ilike.${term},email.ilike.${term}`);
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.do_not_contact === "true") {
    query = query.eq("do_not_contact", true);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCustomerById(id: string, businessId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("business_id", businessId)
    .single();
  if (error) return null;
  return data;
}

export async function createCustomer(
  input: Record<string, unknown>,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const tags = typeof input.tags === "string" && input.tags.trim()
    ? (input.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const record = {
    business_id: businessId,
    full_name: input.full_name,
    phone: input.phone,
    email: (input.email as string)?.trim() || null,
    address: (input.address as string)?.trim() || null,
    source: (input.source as string) || null,
    tags,
    notes: (input.notes as string) || null,
    communication_opt_in: input.communication_opt_in ?? true,
    do_not_contact: input.do_not_contact ?? false,
    status: input.status ?? "active",
  };

  const { data, error } = await supabase.from("customers").insert(record).select("id").single();
  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "customer_created",
    entity_type: "customer",
    entity_id: data.id,
  });

  return data;
}

export async function updateCustomer(
  id: string,
  input: Record<string, unknown>,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const tags = typeof input.tags === "string" && input.tags.trim()
    ? (input.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const record = {
    full_name: input.full_name,
    phone: input.phone,
    email: (input.email as string)?.trim() || null,
    address: (input.address as string)?.trim() || null,
    source: (input.source as string) || null,
    tags,
    notes: (input.notes as string) || null,
    communication_opt_in: input.communication_opt_in ?? true,
    do_not_contact: input.do_not_contact ?? false,
    status: input.status ?? "active",
  };

  const { error } = await supabase
    .from("customers")
    .update(record)
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "customer_updated",
    entity_type: "customer",
    entity_id: id,
  });
}

export async function deactivateCustomer(
  id: string,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("customers")
    .update({ status: "inactive" })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "customer_deactivated",
    entity_type: "customer",
    entity_id: id,
  });
}
