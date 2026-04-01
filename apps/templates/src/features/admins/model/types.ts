export interface AdminItem {
  id?: string | number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  phone_code?: string | null;
  phone_country_code?: string | null;
  phone_number?: string | null;
  role?: string;
  access_modules?: string[];
  updated_at?: string;
}
