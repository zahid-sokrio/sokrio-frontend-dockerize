import Scheme from '@/intefaces/Scheme';

export default interface Subscription {
  id: number;
  admin_id: number;
  name: string;
  trial_days: string;
  created_at: string;
  updated_at: string;
  org_id: number;
  scheme_id: number;
  scheme_meta: Scheme;
  cancelled_at: string;
  upgraded_from: number;
  coupon_id: number;
  user_quota: number;
  next_invoice_at: string;
}
