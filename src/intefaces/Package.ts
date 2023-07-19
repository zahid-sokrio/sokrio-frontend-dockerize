import Feature from "@/intefaces/Feature";
export default interface Package {
    id: number;
    admin_id: number;
    name: string;
    trial_days: string;
    created_at: string;
    updated_at: string;
    cycle: number,
    price: number,
    feature: Feature | null,
}
