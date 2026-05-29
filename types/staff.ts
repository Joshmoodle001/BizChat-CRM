export interface StaffProfile {
  id: string;
  auth_user_id: string | null;
  business_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StaffFormInput {
  full_name: string;
  email: string;
  phone: string;
  status: string;
}

export interface StaffSearchParams {
  search?: string;
  status?: string;
}
