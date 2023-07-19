export default interface RoutePlan {
  id: number;
  name: string;
  timespans: string;
  expires_at: string;
  days: Array<string>;
  assigned_to: number;
  created_by: number;
  creator: Array<{
    id: number;
    name: string;
  }>;
  outlets: Array<string> | null;
  created_at: string;
  updated_at: string;
  tour_dates: any;
  reporting_time: string;
}
