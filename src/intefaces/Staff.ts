import User from "@/intefaces/User";
export default interface Staff {
  id: number;
  org_id: number;
  user_id: number;
  user: User;
  staff_id: string;
  phone: string;
  address: string;
  code: string;
  gender: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}
