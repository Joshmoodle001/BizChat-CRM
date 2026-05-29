import { createClient } from "@/lib/supabase/server";

export async function getBusinessSettings(businessId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();
  if (error) return null;
  return data;
}

export async function updateBusinessSettings(
  input: Record<string, unknown>,
  businessId: string,
  actorProfileId: string,
) {
  const supabase = await createClient();

  const record = {
    name: input.name,
    industry: (input.industry as string) || null,
    phone: (input.phone as string) || null,
    email: (input.email as string)?.trim() || null,
    address: (input.address as string) || null,
    timezone: input.timezone ?? "Africa/Johannesburg",
    currency: input.currency ?? "ZAR",
    logo_url: (input.logo_url as string) || null,
  };

  const { error } = await supabase
    .from("businesses")
    .update(record)
    .eq("id", businessId);

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    business_id: businessId,
    actor_profile_id: actorProfileId,
    action: "business_settings_updated",
    entity_type: "business",
    entity_id: businessId,
  });
}
