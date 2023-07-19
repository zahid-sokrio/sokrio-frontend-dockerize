import Subscription from '@/intefaces/Subscription';

export default interface OrgInvoice {
  id: number;
  subscription_id: number;
  carry_forwarded_from: number;
  paid_at: string;
  amount: number;
  coupon_id: number;
  payable: number | null;
  code: string;
  created_at: string;
  updated_at: string;
  payments: Array<{
    id: number;
    org_invoice_id: number;
    txn_no: string;
    medium: string;
    ac_no: string;
    paid_to: string;
    rejection_reason: string;
    approved_at: string;
    rejected_at: string;
    created_at: string;
    updated_at: string;
  }>;
  subscription: Subscription;
  linked_invoice: null;
}
