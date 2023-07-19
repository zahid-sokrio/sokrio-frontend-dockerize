import User from '@/intefaces/User';

export default interface LeaveRequest {
  id?: number | null;
  user_id: number | null;
  reason: string | null;
  approved_at: null | string;
  actor_id: null | number;
  actor: null | User;
  user: null | User;
}
