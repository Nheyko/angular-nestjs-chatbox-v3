export interface User {
    id?: number;
    username: string;
    password: string;
    email: string;
    is_online: boolean;
    role_id: number;
    registration_date?: Date;
}