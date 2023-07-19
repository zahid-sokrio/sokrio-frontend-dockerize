import _ from "lodash";

export default interface FieldForce {
    id: number;
    name: string;
    todaysRoutes: any;
    roles: any;
    phone: string;
    trackings: Array<any>;
    batteryPercent: number;
    createdAt: string;
    updatedAt: string;
    plannedVisit: number;
    unplannedVisit: number;
    totalAssigned: number;
    propicUrl: string;
  }
