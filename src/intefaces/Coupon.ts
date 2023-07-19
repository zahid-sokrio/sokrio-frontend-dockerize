export default interface Coupon {
  id?: number;
  admin_id?: number;
  code: string;
  discount: number;
  expires_at: string;
  created_at?: string;
  updated_at?: string;
}
