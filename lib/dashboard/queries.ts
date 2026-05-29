import { createClient } from "@/lib/supabase/server";
import type { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(businessId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    { count: totalCustomers },
    { count: activeCustomers },
    { count: totalServices },
    { count: activeServices },
    { count: staffMembers },
    { count: bookingsToday },
    { count: unpaidInvoices },
    { count: pendingReminders },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }).eq("business_id", businessId),
    supabase.from("customers").select("*", { count: "exact", head: true }).eq("business_id", businessId).eq("status", "active"),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("business_id", businessId),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("business_id", businessId).eq("status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("business_id", businessId).eq("role", "staff"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("business_id", businessId).eq("booking_date", new Date().toISOString().split("T")[0]),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("business_id", businessId).in("payment_status", ["unpaid", "overdue"]),
    supabase.from("reminders").select("*", { count: "exact", head: true }).eq("business_id", businessId).eq("status", "pending"),
  ]);

  return {
    totalCustomers: totalCustomers ?? 0,
    activeCustomers: activeCustomers ?? 0,
    totalServices: totalServices ?? 0,
    activeServices: activeServices ?? 0,
    staffMembers: staffMembers ?? 0,
    bookingsToday: bookingsToday ?? 0,
    unpaidInvoices: unpaidInvoices ?? 0,
    pendingReminders: pendingReminders ?? 0,
  };
}

export async function getRecentCustomers(businessId: string, limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentServices(businessId: string, limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
