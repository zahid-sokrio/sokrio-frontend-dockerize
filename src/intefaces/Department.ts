import Territory from '@/intefaces/Territory';
import RoutePlan from './RoutePlan';
import User from './User';

export default interface Department {
  id?: number | null;
  department_type_id: number | null;
  territory_id: number | null;
  territory?: Territory | null;
  credit_limit: number | null;
  outstanding_balance: number | null;
  badge_id: number | null;
  badge?: any;
  name: string | null;
  code: string | null;
  lat: number | null;
  long: number | null;
    address: string | null;
    owner_name: string | null;
    phone_no: string | null;
    photo: string | null;
    photo_url: string | null;
    created_by: number | null;
    supplier_id: number | null;
    supplier: Department | null;
    fieldForceId?: number | null;
    routePlanId: any;
    users?: User[] | null;
    is_visitable: boolean;
}
