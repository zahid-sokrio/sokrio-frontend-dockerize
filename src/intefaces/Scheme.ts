import Package from "@/intefaces/Package";

export default interface Scheme {
  id: number;
  admin_id: number;
  package_id: number;
  name: string;
  cycle: string;
  price: number;
  created_at: string;
  updated_at: string;
  package: Package;
}
