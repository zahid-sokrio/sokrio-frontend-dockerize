import Department from "@/intefaces/Department";

export default class DepartmentDTO implements  Department{
    address: string | null;
    badge_id: number | null;
    code: string | null;
    created_by: number | null;
    credit_limit: number | null;
    department_type_id: number | null;
    lat: number | null;
    long: number | null;
    name: string | null;
    outstanding_balance: number | null;
    owner_name: string | null;
    phone_no: string | null;
    photo: string | null;
    photo_url: string | null;
    routePlanId: any;
    supplier: Department | null;
    supplier_id: number | null;
    territory_id: number | null;
    is_visitable: any;

    constructor(address: string | null, badge_id: number | null, code: string | null, created_by: number | null, credit_limit: number | null, department_type_id: number | null, lat: number | null, long: number | null, name: string | null, outstanding_balance: number | null, owner_name: string | null, phone_no: string | null, photo: string | null, photo_url: string | null, routePlanId: any, supplier: Department | null, supplier_id: number | null, territory_id: number | null, is_visitable: any) {
        this.address = address;
        this.badge_id = badge_id;
        this.code = code;
        this.created_by = created_by;
        this.credit_limit = credit_limit;
        this.department_type_id = department_type_id;
        this.lat = lat;
        this.long = long;
        this.name = name;
        this.outstanding_balance = outstanding_balance;
        this.owner_name = owner_name;
        this.phone_no = phone_no;
        this.photo = photo;
        this.photo_url = photo_url;
        this.routePlanId = routePlanId;
        this.supplier = supplier;
        this.supplier_id = supplier_id;
        this.territory_id = territory_id;
        this.is_visitable = is_visitable;
    }
}
