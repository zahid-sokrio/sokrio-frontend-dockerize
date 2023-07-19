export default interface UserForm {
    name: string,
    email: string,
    address: string,
    phone: number|string,
    password: string,
    password_confirmation: string,
    gender: string,
    territory_id: number|string,
    active: boolean|string,
    code: string,
    is_report: boolean|string,
}
