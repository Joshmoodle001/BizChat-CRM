export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormInput {
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  price: number;
  status: string;
}

export interface ServiceSearchParams {
  search?: string;
  status?: string;
  category?: string;
}
