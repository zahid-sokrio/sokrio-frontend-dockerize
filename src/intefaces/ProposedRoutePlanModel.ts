export enum PROPOSAL_STATUS {
    pending,
    accepted,
    rejected
}

export  interface ProposedRoutePlanModel {
    id: number;
    code: number;
    proposed_by: string;
    timespan: string;
    proposed_date: string;
    days: Array<string>;
    assigned_to: number;
    created_by: number;
    creator: {
        id: number;
        name: string;
    };
    // outlets: Array<string> | null;
    routePlans: Array<any>;
    startingPoint: string | null;
    status: PROPOSAL_STATUS;
    created_at: string;
    updated_at: string;
    tour_dates:Array< string>;
    reporting_time: string;
    showPopOver:boolean ;
    remark: string;
}

export  class ProposedRoutePlanEntity implements ProposedRoutePlanModel{
    assigned_to: number;
    created_at: string;
    created_by: number;
    creator: { id: number; name: string };
    days: Array<string>;
    id: number;
    code:number;
    proposed_by: string;
    proposed_date: string;
    reporting_time: string;
    routePlans: Array<any>;
    showPopOver: boolean;
    startingPoint: string | null;
    status: PROPOSAL_STATUS;
    timespan: string;
    tour_dates: Array<string>;
    updated_at: string;
    remark: string;


    constructor(assigned_to: number, created_at: string, created_by: number, creator: { id: number; name: string }, days: Array<string>, id: number, code: number, proposed_by: string, proposed_date: string, reporting_time: string, routePlans: Array<any>, showPopOver: boolean, startingPoint: string | null, status: PROPOSAL_STATUS, timespan: string, tour_dates: Array<string>, updated_at: string, remark:string) {
        this.assigned_to = assigned_to;
        this.created_at = created_at;
        this.created_by = created_by;
        this.creator = creator;
        this.days = days;
        this.id = id;
        this.code= code;
        this.proposed_by = proposed_by;
        this.proposed_date = proposed_date;
        this.reporting_time = reporting_time;
        this.routePlans = routePlans;
        this.showPopOver = showPopOver;
        this.startingPoint = startingPoint;
        this.status = status;
        this.timespan = timespan;
        this.tour_dates = tour_dates;
        this.updated_at = updated_at;
        this.remark= remark;
    }



}
