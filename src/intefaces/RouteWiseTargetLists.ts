export default interface RouteWiseTargetLists {
    territory_id: string | number;
    type: string,
    scheme: string,
    amount: string | number,
    start_from: string,
    unit: string,
    expiresDate: string,
    status: boolean,
    products: Array<string>,
    assignees: Array<string>,
    territoryName: string,
}
