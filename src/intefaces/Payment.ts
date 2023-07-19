import { PaymentTypes } from '@/enums/PaymentTypes';

export default interface Payment {
  id?: number;
  advance: boolean;
  amount: number | null;
  method: PaymentTypes | null;
  created_by: number;
  department_id: number | null;
  paid_at: string | null;
  created_at?: string;
  updated_at?: string;
  creator?: { id: number; name: string };
  ac_no?: string;
  ac_holder?: string;
  bank?: string;
  branch?: string;
  txn_no?: string;
  cheque_no?: string;
  deposit_no?: string;
  deposit_slip?: null;
  mfs_vendor?: null;
  invoices: [];
  status?: string;
  showPopOver?: boolean ;
  remark?: string;

  bank_payment?: any;
  cheque_payment?: any;
  mfs_payment?:any;
  seller_id?: number | null
}
