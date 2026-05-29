import { createClient } from "@/lib/supabase/server";
import type { Profile, Business } from "@/types";

export interface CurrentProfileWithBusiness {
  profile: Profile;
  business: Business | null;
}

export async function getCurrentProfile(): Promise<CurrentProfileWithBusiness | null> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!profile) return null;

  let business: Business | null = null;
  if (profile.business_id) {
    const { data: biz } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", profile.business_id)
      .single();
    business = biz ?? null;
  }

  return {
    profile: profile as Profile,
    business,
  };
}
