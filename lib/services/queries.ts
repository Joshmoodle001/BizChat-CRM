import { createClient } from "@/lib/supabase/server";
import type { ServiceSearchParams } from "@/types/service";

export async function getServices(businessId: string, params: ServiceSearchParams) {
  const supabase = await createClient();
  let query = supabase.from("services").select("*").eq("business_id", businessId);

  if (params.search) {
    const term = `%${params.search}%`;
    query = query.or(`name.ilike.${term},description.ilike.${term},category.ilike.${term}`);
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getServiceById(id: string, businessId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .eq("business_id", businessId)
    .single();
  if (error) return null;
  return data;
}

export async function createService(
  input: Record<string, unknown>,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const record = {
    business_id: businessId,
    name: input.name,
    description: (input.description as string)?.trim() || null,
    category: (input.category as string) || null,
    duration_minutes: Number(input.duration_minutes) || 60,
    price: Number(input.price) ?? 0,
    status: input.status ?? "active",
  };

  const { data, error } = await supabase.from("services").insert(record).select("id").single();
  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "service_created",
    entity_type: "service",
    entity_id: data.id,
  });

  return data;
}

export async function updateService(
  id: string,
  input: Record<string, unknown>,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const record = {
    name: input.name,
    description: (input.description as string)?.trim() || null,
    category: (input.category as string) || null,
    duration_minutes: Number(input.duration_minutes) || 60,
    price: Number(input.price) ?? 0,
    status: input.status ?? "active",
  };

  const { error } = await supabase
    .from("services")
    .update(record)
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "service_updated",
    entity_type: "service",
    entity_id: id,
  });
}

export async function deactivateService(
  id: string,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({ status: "inactive" })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "service_deactivated",
    entity_type: "service",
    entity_id: id,
  });
}
