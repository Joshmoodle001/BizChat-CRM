export type UserRole = "super_admin" | "business_owner" | "staff";

export type BusinessStatus = "active" | "suspended" | "trial";

export interface Profile {
  id: string;
  auth_user_id: string;
  business_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  industry: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  timezone: string;
  currency: string;
  subscription_plan: string;
  subscription_status: string;
  status: BusinessStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  source: string | null;
  tags: string[];
  communication_opt_in: boolean;
  do_not_contact: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";

export type InvoiceStatus = "draft" | "sent" | "cancelled";
export type PaymentStatus = "unpaid" | "partially_paid" | "paid" | "overdue";

export type ReminderType =
  | "booking_follow_up"
  | "payment_follow_up"
  | "quote_follow_up"
  | "customer_reactivation"
  | "custom";
