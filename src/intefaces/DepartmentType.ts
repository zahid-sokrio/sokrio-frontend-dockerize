export default interface DepartmentType {
  id?: number;
  name: string;
  label: string | null;
  has_outlet: boolean;
  self_managed: boolean;
  created_at?: string;
  updated_at?: string;
}
