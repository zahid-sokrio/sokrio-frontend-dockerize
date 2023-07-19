import {Timespan} from "@/enums/Timespan";

export default interface Survey {
  id?: number;
  name: string;
  expires_at: string | null;
  code: string;
  timespan: Timespan | null;
  times: number;
  start_form: string | null;
  for: Array<string>;
  active: boolean;
  is_default: boolean;
}
