export interface Contact {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}
