export default interface Announcement {
    id?: number;
    title: string;
    body: string;
    type: string;
    starts_at: Date;
    ends_at: Date;
    created_by: number;
}
