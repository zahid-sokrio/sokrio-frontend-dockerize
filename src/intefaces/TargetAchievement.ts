import { TargetActiveOn } from "@/enums/TargetActiveOn";

export default interface TargetAchievement {
   id: number,
   target_id: number,
    type: 'order' | 'invoice' | 'delivery' | 'visit',
    achieved: number,
    created_at?: string;
    updated_at?: string;
}
