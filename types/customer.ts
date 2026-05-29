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

export interface CustomerFormInput {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  source: string;
  tags: string;
  notes: string;
  communication_opt_in: boolean;
  do_not_contact: boolean;
  status: string;
}

export interface CustomerSearchParams {
  search?: string;
  status?: string;
  do_not_contact?: string;
}
